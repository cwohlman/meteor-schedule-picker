Recur.defaultShortcuts = {
  morning: 60 * 10
  , afternoon: 60 * 14
  , lateAfternoon: 60 * 17
  , evening: 60 * 22
  , breakfast: 60 * 8
  , lunch: 60 * 12
  , supper: 60 * 20
  , wakup: 60 * 7
  , bedtime: 60 * 23
};

function getIntervals (period, count) {
  if (!period)
    return [];
  
  return _.map(_.range(1, count + 1), function (i) {
    var number = i === 1 ? "" : (i + '');
    var periodWithPlural = i === 1 ? period : period + 's';
    return {
      label: ["Every", number, periodWithPlural].join(" ")
      , value: i
    };
  });
}

// http://stackoverflow.com/a/13627586/2391620
function appendSuffix (i) {
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

function chooseParticle (word) {
  return {
    hour: 'an'
    , isoWeekday: 'an'
  }[word] || 'a';
}

function getFrequencies (period, count) {
  if (!period)
    return [];

  var particle = chooseParticle(period);

  return _.map(_.range(1, count + 1), function (i) {
    var name = i + " times";
    if (i === 1)
      name = "Once";
    else if (i === 2)
      name = "Twice";
    return {
      label: [name, particle, period].join(" ")
      , value: i
    };
  });
}

function getInstances (instances, targetCount, constructorFn) {
  while (instances.length > targetCount) {
    instances.pop();
  }
  while (instances.length < targetCount) {
    instances.push(constructorFn(instances));
  }
  return instances;
}

function getOptions (period, constructorFn) {
  return [
    {
      label: 'Interval'
      , name: 'interval'
      , value: function (schedule) {
        return schedule.interval;
      }
      , options: function (schedule) {
        return getIntervals(period, 12);
      }
      , update: function (schedule, value) {
        schedule.interval = value;
        return schedule;
      }
    }
    , {
      label: 'Frequency'
      , name: 'instanceCount'
      , value: function (schedule) {
        return schedule.on && schedule.on.length;
      }
      , options: function (schedule) {
        return getFrequencies(period, 12);
      }
      , update: function (schedule, value) {
        var instances = schedule.on;
        instances = getInstances(instances, value, constructorFn);
        schedule.on = instances;
        return schedule;
      }
    }
  ];
}

function makeConstructorFn (period, increment, max) {
  return function (instances) {
    var instance = _.last(instances);
    return {
      period: period
      , at: (instance.at + increment) % max
    };
  };
}

var minutesConstructor = makeConstructorFn('minute', 60 * 2, 60 * 24);
var weekDayConstructor = makeConstructorFn('day', 1, 7);
var monthDayConstructor = makeConstructorFn('day', 1, 28);

function makeMinutesOption(instance) {
  return {
    label: 'Time'
    , name: 'minute'
    , value: instance.at
    , options: minuteOptions
    , update: function (schedule, value) {
      instance.at = value;
      return schedule;
    }
  };
}

function makeWeekDaysOption(instance) {
  return {
    label: 'Day'
    , name: 'day'
    , value: instance.at
    , options: weekDayOptions
    , update: function (schedule, value) {
      instance.at = value;
      return schedule;
    }
  };
}

function makeMonthDaysOption(instance) {
  return {
    label: 'Day'
    , name: 'day'
    , value: instance.at
    , options: monthDayOptions
    , update: function (schedule, value) {
      instance.at = value;
      return schedule;
    }
  };
}

var minuteOptions = _.flatten([
  _.map(Recur.defaultShortcuts, function (val, name) {
    return {
      label: name
      , value: name
    };
  })
  , _.map(_.range(24 * 4), function (i) {
    var minutes = i * 15;
    return {
      label: moment().startOf('day').add(minutes, 'minutes').format('hh:mm a')
      , value: minutes
    };
  })
]);

var weekDayOptions = _.map([
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
], function (name, i) {
  i++;
  return {
    label: name
    , value: i
  };
});

var monthDayOptions = _.map(_.range(1, 32), function (i) {
  return {
    label: appendSuffix(i)
    , value: i - 1
  };
});

var hours = {
  1: _.range(0, 24)
  , 2: _.range(0, 24, 2)
  , 4: _.range(2, 24, 4)
  , 6: _.range(0, 24, 6)
  , 8: _.range(6, 24, 8)
  , 12: _.range(10, 24, 12)
};

var options = [
  {
    label: 'Hourly'
    , name: 'hourly'
    , value: 'hourly'
    , matches: function (schedule) {
      return schedule.kind === 'hourly';
    }
    , createSchedule: function () {
      // Hourly is really an alias for a certain kind of daily schedule.
      return {
        period: 'day'
        , kind: 'hourly'
        , interval: 1
        , on: [{
          period: 'minute'
          , at: 0 * 60
        }, {
          period: 'minute'
          , at: 6 * 60
        }, {
          period: 'minute'
          , at: 12 * 60
        }, {
          period: 'minute'
          , at: 18 * 60
        }]
      };
    }
    , getOptions: function () {
      return [{
        label: 'Interval'
        , name: 'interval'
        , value: function (schedule) {
          return Math.floor(24 / schedule.on.length);
        }
        , options: function (schedule) {
          return _.map([1,2,4,6,8,12], function (i)  {
            var number = i === 1 ? "" : (i + '');
            var periodWithPlural = i === 1 ? 'hour' : 'hours';
            return {
              label: ["Every", number, periodWithPlural].join(" ")
              , value: i
            };
          });
        }
        , update: function (schedule, value) {
          var instances = schedule.on;
          instances = _.map(hours[value], function (i) {
            return {
              period: 'minute'
              , at: i * 60
            };
          });
          schedule.on = instances;
          return schedule;
        }
      }];
    }
    , getInstances: function (schedule) {
      return schedule.on;
    }
    , getInstanceOptions: function (instance) {
      // XXX since this is hourly, we should really update all of the other
      // instances to match the specified hourly distance.
      return [makeMinutesOption(instance)];
    }
  }
  , {
    label: 'Daily'
    , name: 'daily'
    , value: 'daily'
    , matches: function (schedule) {
      return schedule.kind === 'daily';
    }
    , createSchedule: function () {
      return {
        period: 'day'
        , kind: 'daily'
        , interval: 1
        , on: [{
          period: 'minute'
          , at: 'morning'
        }]
      };
    }
    , getOptions: function () {
      return getOptions('day', minutesConstructor);
    }
    , getInstances: function (schedule) {
      return schedule.on;
    }
    , getInstanceOptions: function (instance) {
      return [makeMinutesOption(instance)];
    }
  }
  , {
    label: 'Weekly'
    , name: 'weekly'
    , value: 'weekly'
    , matches: function (schedule) {
      return schedule.kind === 'weekly';
    }
    , createSchedule: function () {
      return {
        period: 'week'
        , kind: 'weekly'
        , interval: 1
        , on: [
          {
            period: 'day'
            , at: 1
            , on: {
              period: 'minute'
              , at: 'morning'
            }
        }]
      };
    }
    , getOptions: function () {
      return getOptions('week', function (instances) {
        var day = weekDayConstructor(instances);
        day.on = {
          period: 'minute'
          , at: 'morning'
        };
        return day;
      });
    }
    , getInstances: function (schedule) {
      return schedule.on;
    }
    , getInstanceOptions: function (instance) {
      return instance && instance.on && [makeWeekDaysOption(instance), makeMinutesOption(instance.on)];
    }
  }
  , {
    label: 'Monthly'
    , name: 'monthly'
    , value: 'monthly'
    , matches: function (schedule) {
      return schedule.kind === 'monthly';
    }
    , createSchedule: function () {
      return {
        period: 'month'
        , kind: 'monthly'
        , interval: 1
        , on: [
          {
            period: 'day'
            , at: 1
            , on: {
              period: 'minute'
              , at: 'morning'
            }
        }]
      };
    }
    , getOptions: function () {
      return getOptions('month', function (instances) {
        var day = monthDayConstructor(instances);
        day.on = {
          period: 'minute'
          , at: 'morning' // 10 am
        };
        return day;
      });
    }
    , getInstances: function (schedule) {
      return schedule.on;
    }
    , getInstanceOptions: function (instance) {
      return instance && instance.on && [makeMonthDaysOption(instance), makeMinutesOption(instance.on)];
    }
  }
];

function makeDailyShortcut (args) {
  var kind = args.shift();
  var name = args.shift();
  var label = args.shift();
  var times = args;
  return {
    label: "(" +name.toUpperCase() + ") " + label 
    , name: name
    , value: name
    , matches: function (schedule) {
      return schedule.kind === kind && _.isEqual(_.pluck(schedule.on, 'at'), times);
    }
    , createSchedule: function () {
      return {
        kind: kind
        , period: 'day'
        , interval: 1
        , on: _.map(times, function (time) {
          return {
            period: 'minute'
            , at:  time
          };
        })
      };
    }
  };
}

function findShortcut(scheduleOrName) {
  var predicate = _.isString(scheduleOrName) ?
    function (o) {
      return o.value === scheduleOrName;
    } : function (o) {
      return o.matches(scheduleOrName);
    };

  return _.chain(scheduleShortcuts)
    .pluck('options')
    .flatten()
    .find(predicate)
    .value()
    ;
}

var scheduleShortcuts = [
  {
    label: "Daily"
    , options: _.map([
      ['daily', 'qd', 'Once Daily', 'morning']
      , ['daily', 'bid', 'Twice Daily', 'morning', 'evening']
      , ['daily', 'tid', 'Three Times Daily', 'morning', 16 * 60, 'evening']
      , ['daily', 'meals', 'With Meals', 8 * 60, 12 * 60, 20 * 60]
      , ['daily', 'qid', 'Four Times Daily', 'morning', 14 * 60, 18 * 60, 'evening']
    ], makeDailyShortcut)
  }
  , {
    label: 'Custom'
    , options: [{
      label: 'Custom'
      , name: 'custom'
      , value: 'custom'
      , matches: function (schedule) {
        return true;
      }
      , createSchedule: function () {
        return {
          kind: 'daily'
          , period: 'day'
          , on: [{
            period: 'minute'
            , at: 12 * 60
          }]
        };
      }
    }]
  }
];

Template.schedulePicker.onCreated(function () {
  var tmpl = this;
  tmpl.schedule = new ReactiveVar();
  tmpl.selectedOption = new ReactiveVar();
  tmpl.selectedShortcut = new ReactiveVar();

  tmpl.autorun(function () {
    var data = Template.currentData();

    tmpl.schedule.set(data.value || options[1].createSchedule());
  });
  tmpl.autorun(function () {
    var schedule = tmpl.schedule.get();
    var selectedOption, selectedShortcut;
    if (schedule) {
      selectedOption = _.find(options, function (o) {
        return o.matches(schedule);
      });
      tmpl.selectedOption.set(selectedOption);
      selectedShortcut = findShortcut(schedule);
      tmpl.selectedShortcut.set(selectedShortcut);
    }
  });
});

Template.schedulePicker.helpers({
  scheduleKinds: function () {
    return options;
  }
  , scheduleShortcuts: function () {
    return scheduleShortcuts;
  }
  , selectedPeriod: function () {
    var tmpl = Template.instance();
    return tmpl.selectedOption.get() === this;
  }
  , selectedShortcut: function () {
    var tmpl = Template.instance();
    return tmpl.selectedShortcut.get() === this;
  }
  , scheduleOptions: function () {
    var tmpl = Template.instance();
    var period = tmpl.selectedOption.get();
    return period && period.getOptions();
  }
  , scheduleInstances: function () {
    var tmpl = Template.instance();
    var period = tmpl.selectedOption.get();
    var schedule = tmpl.schedule.get();
    return period && schedule && period.getInstances(schedule);
  }
  , instanceOptions: function () {
    var tmpl = Template.instance();
    var period = tmpl.selectedOption.get();
    var schedule = tmpl.schedule.get();
    return period && schedule && period.getInstanceOptions(this);
  }
  , selected: function () {
    // check whether this.value matches ../value
    var parent = Template.parentData();
    var value = parent.value;
    if (_.isFunction(value)) {
      var tmpl = Template.instance();
      var schedule = tmpl.schedule.get();
      value = schedule && value(schedule);
    }

    return value == this.value;
  }
  , schedule: function () {
    var tmpl = Template.instance();
    var schedule = tmpl.schedule.get();
    return schedule;
  }
  , print: function (val) {
    return JSON.stringify(val, null, 2);
  }
});

Template.schedulePicker.events({
  'change select': function (e, tmpl) {
    var name = e.currentTarget.name;
    var value = e.currentTarget.value;
    if (_.isFinite(value))
      value = Number(value);
    if (name === "period") {
      var selectedOption = _.findWhere(options, {name: value});
      if (selectedOption)
        tmpl.schedule.set(selectedOption.createSchedule());
    } else if (name === 'shortcut') {
      var selectedShortcut = findShortcut(value);
      if (selectedShortcut)
        tmpl.schedule.set(selectedShortcut.createSchedule());

    } else {
      var schedule = tmpl.schedule.get();
      schedule = this.update(schedule, value);
      tmpl.schedule.set(schedule);
    }
  }
});
