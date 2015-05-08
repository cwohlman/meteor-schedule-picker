// http://stackoverflow.com/a/13627586/2391620
function getWithSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

var getCentralDistribution = function (a, b, i) {
  var center = a / (b + 1);
  return Math.floor((i + 1) * center);
};

var defaults = {
  periodOptions: [
    {
      name: "Hourly"
      , value: 'hour'
      , getSchedule: function (instances) {
        return {
          period: 'day'
          , interval: 1
          , on: _.map(instances, function (instance) {
            return {
              period: 'minute'
              , at: instance.minute
            };
          })
        };
      }
      , getInstances: function (schedule) {
        return _.map([].concat(schedule.on), function (a) {
          return {
            minute: a.at
          };
        });
      }
      , createInstances: function (interval, instanceCount) {
        dailyInstanceCount = Math.floor(24 / interval);
        return _.flatten(_.map(_.range(dailyInstanceCount), function (i) {
          return _.map(_.range(instanceCount), function (ii) {
            return {
              minute: i * 60 * interval + ii * Math.floor(60 / instanceCount)
            };
          });
        }));
      }
    }
    , {
      name: "Daily"
      , value: 'day'
      , createSchedule: function (interval, instanceCount) {
        return {
          period: 'day'
          , interval: interval
          , on: _.map(_.range(instanceCount), function (i) {
            return {
              period: 'minute'
              , at: getCentralDistribution(24 * 4, instanceCount, i) * 15
            };
          })
        };
      }
    }
    , {
      name: "Weekly"
      , value: 'week'
      , dayOptions: [
        {value: 1, name: 'Monday'}
        , {value: 2, name: 'Tuesday'}
        , {value: 3, name: 'Wednesday'}
        , {value: 4, name: 'Thursday'}
        , {value: 5, name: 'Friday'}
        , {value: 6, name: 'Saturday'}
        , {value: 0, name: 'Sunday'}
      ]
      , schedule: function (interval, instanceCount) {
        return {
          period: 'week'
          , interval: interval
          , on: _.map(_.range(instanceCount), function (i) {
            return {
              period: 'day'
              , at: getCentralDistribution(7, instanceCount, i)
              , on: {
                period: 'minute'
                , at: 60 * 10 // 10 am
              }
            };
          })
        };
      }
    }
    , {
      name: "Monthly"
      , value: 'month'
      , schedule: function (interval, instanceCount) {
        return {
          period: 'month'
          , interval: interval
          , on: _.map(_.range(instanceCount), function (i) {
            return {
              period: 'day'
              , at: getCentralDistribution(28, instanceCount, i) + 1
              , on: {
                period: 'minute'
                , at: 60 * 10 // 10 am
              }
            };
          })
        };
      }
    }
  ]
  , requiredPeriods: [
    'day'
    , 'minute'
  ]
  , dayOptions: _.map(_.range(1, 29), function (i) {
    var withSuffix = getWithSuffix(i);
    return {
      value: i
      , name: withSuffix
    };
  })
  , minuteOptions: _.map(_.range(0, 24 * 4), function (i) {
    var value = i * 15;
    return {
      name: moment().startOf('day').add(value, 'minutes').format('hh:mm a')
      , value: value
    };
  })
};

var aVsAn = {
  'day': 'a'
  , 'hour': 'an'
  , 'week': 'a'
  , 'month': 'a'
  , 'year': 'a'
};

Template.schedulePicker.onCreated(function () {
  var tmpl = this;
  tmpl.dict = new ReactiveDict();
  tmpl.dict.set('period', 'day');
  tmpl.dict.set('interval', 1);
  tmpl.dict.set('instanceCount', 1);
});

Template.schedulePicker.helpers({
  periodOptions: function () {
    return this.periodOptions || defaults.periodOptions;
  }
  , intervalOptions: function () {
    var tmpl = Template.instance();
    var period = tmpl.dict.get('period');

    if (!period)
      return [];
    
    return [
      ""
      , "2"
      , "3"
      , "4"
      , "5"
      , "6"
      , "7"
      , "8"
      , "9"
      , "10"
      , "11"
      , "12"
    ].map(function (a, i) {
      i++;
      if (i === 2)
        period = period + 's';
      return {
        name: ["Every", a, period].join(" ")
        , value: i
      };
    });
  }
  , instanceCountOptions: function () {
    var tmpl = Template.instance();
    var period = tmpl.dict.get('period');
    var particle = aVsAn[period] || 'a';

    if (!period)
      return [];

    return [
      "Once"
      , "Twice"
      , "3 times"
      , "4 times"
      , "5 times"
      , "6 times"
      , "7 times"
      , "8 times"
      , "9 times"
      , "10 times"
      , "11 times"
      , "12 times"
    ].map(function (a, i) {
      i++;
      return {
        name: [a, particle, period].join(" ")
        , value: i
      };
    });
  }
  , showFrequency: function () {
    return true;
  }
  , selected: function (a, b) {
    var tmpl = Template.instance();
    return a === tmpl.dict.get(b);
  }
  , matches: function (a, b) {
    return a == b;
  }
  , instances: function () {
    var tmpl = Template.instance();
    var instanceCount = Number(tmpl.dict.get('instanceCount'));
    if (!instanceCount)
      return;
    var interval = tmpl.dict.get('interval');
    if (!interval)
      return;
    var period = tmpl.dict.get('period');
    if (!period)
      return;
    var periodDef = _.find(defaults.periodOptions, function (a) {
      return a.value === period;
    });
    if (!periodDef || !_.isFunction(periodDef.createInstances))
      return;
    var instances = periodDef.createInstances(interval, instanceCount);

    return _.map(instances, function (a, i) {
      return {
        requiredPeriods: _.map(a, function (val, p) {
          return {
            value: val
            , period: p
            , options: periodDef && periodDef[p + "Options"] || defaults[p + "Options"]
          };
        })
        , index: i
      };
    });
    // if (!sampleSchedule)
    //   return;
    // if (!sampleSchedule.on)
    //   return;
    // instanceCount = _.isArray(sampleSchedule.on) ? sampleSchedule.on.length : 1;

    // var requiredPeriods = [];
    // var currentSchedule = sampleSchedule;
    // while (true) {
    //   if (currentSchedule && currentSchedule.on) {
    //     currentSchedule = currentSchedule.on;
    //   } else
    //     break;
    //   if (currentSchedule[0]) {
    //     currentSchedule = currentSchedule[0];
    //   }
    //   if (currentSchedule.period) {
    //     requiredPeriods.push(currentSchedule.period);
    //   }
    // }

    // var scheduleValues = _.map([].concat(sampleSchedule.on), function (a) {
    //   var results = {};
    //   while (a && a.at) {
    //     results[a.period] = a.at;
    //     a = a.on;
    //   }
    //   return results;
    // });

    // var instances = _.map(_.range(instanceCount), function (i) {
    //   var instanceValues = scheduleValues[i] || {};
    //   var periods = _.map(requiredPeriods, function (p) {
    //     var value = tmpl.dict.get(i + "." + p) || instanceValues[p];
    //     var options = periodDef && periodDef[p + "Options"] || defaults[p + "Options"];
    //     return {
    //       value: value
    //       , period: p
    //       , options: options
    //     };
    //   });
    //   return {
    //     requiredPeriods: periods
    //     , index: i
    //   };
    // });

    // return instances;
  }
  , schedule: function () {

  }
});

Template.schedulePicker.events({
  'change select': function (e, tmpl) {
    tmpl.dict.set(e.currentTarget.name, e.currentTarget.value);
  }
  , 'change [name="period"]': function (e, tmpl) {
    _.each(['instanceCount', 'interval'], function (a) {
      tmpl.dict.set(a, 1);
    });
    if (e.currentTarget.value === 'hour')
      tmpl.dict.set('interval', 4);
  }
});
