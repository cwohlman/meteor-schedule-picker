Recur.defaultShortcuts = {
  wakup: 60 * 7
  , "breakfast-30": 60 * 8 - 30
  , "breakfast-15": 60 * 8 - 15
  , breakfast: 60 * 8
  // , "breakfast+15": 60 * 8 + 15
  , "breakfast+30": 60 * 8 + 30
  , morning: 60 * 10
  , "lunch-30": 60 * 12 - 30
  , "lunch-15": 60 * 12 - 15
  , lunch: 60 * 12
  // , "lunch+15": 60 * 12 + 15
  , "lunch+30": 60 * 12 + 30
  , afternoon: 60 * 14
  , lateAfternoon: 60 * 17
  , "supper-30": 60 * 20 - 30
  , "supper-15": 60 * 20 - 15
  , supper: 60 * 20
  // , "supper+15": 60 * 20 + 15
  , "supper+30": 60 * 20 + 30
  , evening: 60 * 22
  , bedtime: 60 * 23
};

var shortcutNames = {
  wakup: "Wakeup"
  , "breakfast-30": "30 minutes before Breakfast"
  , "breakfast-15": "15 minute before Breakfast"
  , breakfast: "Breakfast"
  , "breakfast+15": "15 minutes after Breakfast"
  , "breakfast+30": "30 minutes after Breakfast"
  , morning: "Morning"
  , "lunch-30": "30 minutes before Lunch"
  , "lunch-15": "15 minute before Lunch"
  , lunch: "Lunch"
  , "lunch+15": "15 minutes after Lunch"
  , "lunch+30": "30 minutes after Lunch"
  , afternoon: "Afternoon"
  , lateAfternoon: "Late Afternoon"
  , "supper-30": "30 minutes before Supper"
  , "supper-15": "15 minute before Supper"
  , supper: "Supper"
  , "supper+15": "15 minutes after Supper"
  , "supper+30": "30 minutes after Supper"
  , evening: "Evening"
  , bedtime: "Bedtime"
};

function getIntervalDescription (period, i, onlyParticle) {
  var number = i === 1 ? "" : (i + '');
  var periodWithPlural = i === 1 ? period : period + 's';
  return _.filter([onlyParticle ? "every" : "Every", number, periodWithPlural], _.identity).join(" ");  
}

function getIntervals (period, count) {
  if (!period)
    return [];
  
  return _.map(_.range(1, count + 1), function (i) {
    return {
      label: getIntervalDescription(period, i)
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

function getFrequencyDescription (period, i, onlyParticle) {
  var name = i + " times";
  var particle = chooseParticle(period);
  if (i === 1)
    name = "Once";
  else if (i === 2)
    name = "Twice";
  return onlyParticle ? name : [name, particle, period].join(" ");
}

function getFrequencies (period, count) {
  if (!period)
    return [];

  return _.map(_.range(1, count + 1), function (i) {
    return {
      label: getFrequencyDescription(period, i)
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
        schedule.description = getComboDescription(period, schedule.interval, schedule.on.length);
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
        schedule.description = getComboDescription(period, schedule.interval, schedule.on.length);
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

function getHourlyDescription(i) {
  var number = i === 1 ? "" : (i + '');
  var periodWithPlural = i === 1 ? 'hour' : 'hours';
  return ["Every", number, periodWithPlural].join(" ");
}

function getComboDescription(period, interval, instanceCount) {
  if (instanceCount === 1)
    return getIntervalDescription(period, interval);
  if (interval === 1)
    return getFrequencyDescription(period, instanceCount);
  return getFrequencyDescription(period, instanceCount, true) + " " + getIntervalDescription(period, interval, true);
}

var minuteOptions = _.flatten([
  _.map(Recur.defaultShortcuts, function (val, name) {
    return {
      label: moment().startOf('day').add(val, 'minutes').format('hh:mm a') + ' (' + shortcutNames[name] + ')'
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

var rangeDates = function () {
  return [
    {
      label: 'Start Date'
      , name: 'start'
      , value: function (schedule) {
        var start = schedule && schedule.between && schedule.between[0];
        return start ? moment(start).format('M/D/YYYY') : '';
      }
      , update: function (schedule, value) {
        value = moment(value, 'M/D/YYYY', true).startOf('day');
        schedule.between = schedule.between || [null, null];

        if (value.isValid()) {
          schedule.between[0] = value.toDate();
          schedule.offset = value.toDate();
        } else {
          schedule.between[0] = null;
        }

        return schedule;
      }
    }
    , {
      label: 'End Date'
      , name: 'end'
      , value: function (schedule) {
        var end = schedule && schedule.between && schedule.between[1];
        return end ? moment(end).format('M/D/YYYY') : '';
      }
      , update: function (schedule, value) {
        value = moment(value, 'M/D/YYYY', true);
        schedule.between = schedule.between || [null, null];

        if (value.isValid()) {
          schedule.between[1] = value.clone().endOf('day').toDate();
        } else {
          schedule.between[1] = null;
        }

        return schedule;
      }
    }
  ];
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
        , description: getHourlyDescription(6)
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
            return {
              label: getHourlyDescription(i)
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
          schedule.description = getHourlyDescription(Number(value));
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
    , getDates: rangeDates
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
        , description: getComboDescription('day', 1, 1)
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
    , getDates: rangeDates
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
        , description: getComboDescription('week', 1, 1)
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
    , getDates: rangeDates
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
        , description: getComboDescription('month', 1, 1)
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
    , getDates: rangeDates
  }
  , {
    label: 'Once'
    , name: 'once'
    , value: 'once'
    , matches: function (schedule) {
      return schedule.kind === 'once';
    }
    , createSchedule: function () {
      return {
        period: 'day'
        , kind: 'once'
        , shortcutKind: 'once'
        , interval: 1
        , between: [moment().startOf('day').toDate(), moment().endOf('day').toDate()]
        , on: [{
          period: 'minute'
          , at: 'morning'
        }]
        , description: "Once"
      };
    }
    , getOptions: function () {
      return [];
    }
    , getInstances: function (schedule) {
      return schedule.on;
    }
    , getInstanceOptions: function (instance) {
      return [makeMinutesOption(instance)];
    }
    , getDates: function () {
      return [{
        label: 'Date'
        , name: 'date'
        , value: function (schedule) {
          var date = schedule && schedule.between && schedule.between[0];
          return date ? moment(date).format('M/D/YYYY') : '';
        }
        , update: function (schedule, value) {
          value = moment(value, 'M/D/YYYY', true);

          if (value.isValid()) {
            schedule.between = [value.clone().startOf('day').toDate(), value.clone().endOf('day').toDate()];
          } else {
            schedule.between = null;
          }

          return schedule;
        }
      }];
    }
  }
];

function makeDailyShortcut (args) {
  var kind = args.shift();
  var name = args.shift();
  var label = args.shift();
  var times = args;
  return {
    label: label + " (" + name.toUpperCase() + ")"
    , name: name
    , value: name
    , matches: function (schedule) {
      return schedule.shortcutKind === name;
    }
    , createSchedule: function () {
      return {
        kind: kind
        , shortcutKind: name
        , period: 'day'
        , interval: 1
        , on: _.map(times, function (time) {
          return {
            period: 'minute'
            , at:  time
          };
        })
        , description: label
      };
    }
  };
}

function makeWeeklyShortcut (args) {
  var kind = args.shift();
  var name = args.shift();
  var label = args.shift();
  var interval = args.shift();
  var times = args;
  return {
    label: label + " (" + name.toUpperCase() + ")"
    , name: name
    , value: name
    , matches: function (schedule) {
      return schedule.shortcutKind === name;
    }
    , createSchedule: function () {
      return {
        kind: kind
        , shortcutKind: name
        , period: kind === 'weekly' ? 'week' : 'month'
        , interval: interval
        , on: _.map(times, function (time) {
          var date = time[0];
          time = time[1];
          return {
            period: 'day'
            , at: date
            , on: {
              period: 'minute'
              , at:  time
            }
          };
        })
        , description: label
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
    label: "Once"
    , options: [{
      label: 'Once'
      , name: 'once'
      , value: 'once'
      , matches: function (schedule) {
        return schedule.shortcutKind === 'once';
      }
      , createSchedule: _.findWhere(options, {name: 'once'}).createSchedule
    }]
  }
  , {
    label: "Hourly"
    , options: _.map([
      ['hourly', 'q4h', 'Every Four Hours', 60 * 6, 60 * 10, 60 * (12 + 2), 60 * (12 + 6), 60 * (12 + 10)]
      , ['hourly', 'q6h', 'Every Six Hours', 60 * 6, 60 * 12, 60 * (12 + 6), 0]
      , ['hourly', 'q8h', 'Every Eight Hours', 60 * 6, 60 * (12 + 2), 60 * (12 + 10)]
      , ['hourly', 'q12h', 'Every Twelve Hours', 60 * 10, 60 * (12 + 10)]
    ], makeDailyShortcut)
  }
  , {
    label: "Once Daily"
    , options: _.map([
      ['daily', 'daily', 'Every Day', 'morning']
      , ['daily', 'qam', 'Every Morning', 'morning']
      , ['daily', 'wbr', 'Daily With Breakfast', 'breakfast']
      , ['daily', '30br', '30 Minutes Before Breakfast', 'breakfast-30']
      , ['daily', 'wsup', 'With Supper', 'supper']
      , ['daily', '30sup', '30 Minutes Before Supper', 'supper-30']
      , ['daily', 'psup', '30 Minutes After Supper', 'supper+30']
      , ['daily', 'pm', 'Daily in the evening', 'evening']
      , ['daily', 'hs', 'Bedtime', 'bedtime']
    ], makeDailyShortcut)
  }
  , {
    label: "Twice Daily"
    , options: _.map([
      ['daily', 'bid', 'Twice Daily', 'morning', 'evening']
      , ['daily', 'am&hs', 'Morning and Bedtime', 'wakeup', 'bedtime']
      , ['daily', 'bidwm', 'Twice Daily with Meals', 'breakfast', 'supper']
      , ['daily', 'bidac', 'Twice Daily before Meals', 'breakfast-30', 'supper-30']
      , ['daily', 'bidpc', 'Twice Daily after Meals', 'breakfast+30', 'supper+30']
      , ['daily', 'insulin', 'Twice Daily for Insulin', 'breakfast-30', 'supper-30']
    ], makeDailyShortcut)
  }
  , {
    label: "Three Times Daily"
    , options: _.map([
      ['daily', 'tid', 'Three Times per Day', 'morning', 60 * (12 + 4), 'evening']
      , ['daily', 'wm', 'With Meals', 'breakfast', 'lunch', 'supper']
      , ['daily', 'ac', 'Before Meals', 'breakfast-30', 'lunch-30', 'supper-30']
      , ['daily', 'pc', 'After Meals', 'breakfast+30', 'lunch+30', 'supper+30']
    ], makeDailyShortcut)
  }
  , {
    label: "Four Times Daily"
    , options: _.map([
      ['daily', 'qid', 'Four Times per Day', 'morning', 60 * (12 + 2), 60 * (12 + 6), 'evening']
      , ['daily', 'wm&hs', 'With Meals and Bedtime', 'breakfast', 'lunch', 'supper', 'bedtime']
      , ['daily', 'ac&hs', '15 Minutes Before Meals and Bedtime', 'breakfast-15', 'lunch-15', 'supper-15', 'bedtime']
      , ['daily', 'ac&hs', '30 Minutes Before Meals and Bedtime', 'breakfast-30', 'lunch-30', 'supper-30', 'bedtime']
      , ['daily', 'pc&hs', '30 Minutes After Meals and Bedtime', 'breakfast+30', 'lunch+30', 'supper+30', 'bedtime']
    ], makeDailyShortcut)
  }
  , {
    label: "Five Times Daily"
    , options: _.map([
      ['daily', 'five', 'Five Times per Day', 60 * 6, 60 * 10, 60 * (12 + 2), 60 * (12 + 6), 60 * (12 + 10)]
    ], makeDailyShortcut)
  }
  , {
    label: "Weekly"
    , options: _.map([
      ['weekly', 'qwk', 'Every Week', 1, [1, 'morning']]
      , ['weekly', 'biw', 'Every Other Week', 2, [1, 'morning']]
      , ['weekly', 'tiw', 'Every Third Week', 3, [1, 'morning']]
      , ['weekly', 'q2wk', 'Twice per Week', 1, [1, 'morning'], [4, 'morning']]
      , ['weekly', 'q3wk', 'Thrice per Week', 1, [1, 'morning'], [3, 'morning'], [5, 'morning']]
      , ['weekly', 'q3-4wk', 'Four Times per Week', 1, [1, 'morning'], [2, 'morning'], [4, 'morning'], [6, 'morning']]
    ], makeWeeklyShortcut)
  }
  , {
    label: "Monthly"
    , options: _.map([
      ['monthly', 'q1mo', 'Every Month', 1, [0, 'morning']]
      , ['monthly', 'q6mo', 'Every 6 Months', 6, [0, 'morning']]
    ], makeWeeklyShortcut)
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

    tmpl.schedule.set(data.value || findShortcut('daily').createSchedule());
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
  , scheduleDates: function () {
    var tmpl = Template.instance();
    var period = tmpl.selectedOption.get();
    return period && period.getDates();
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
  , custom: function () {
    var tmpl = Template.instance();
    var shortcut = tmpl.selectedShortcut.get();
    return shortcut && shortcut.name === 'custom';
  }
  , notCustom: function () {
    var tmpl = Template.instance();
    var shortcut = tmpl.selectedShortcut.get();
    return shortcut && shortcut.name !== 'custom';
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
  'change select, change input': function (e, tmpl) {
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
