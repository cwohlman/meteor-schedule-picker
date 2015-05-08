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

var options = [
  {
    label: 'Daily'
    , name: 'daily'
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
          , at: 10 * 60
        }]
      };
    }
    , getOptions: function () {
      return getOptions('day', makeConstructorFn('minute', 60 * 2, 60 * 24));
    }
    , getInstances: function (schedule) {
      return schedule.on;
    }
    , getInstanceOptions: function (instance) {
      return [makeMinutesOption(instance)];
    }
  }
];

var minuteOptions = _.map(_.range(24 * 4), function (i) {
  var minutes = i * 15;
  return {
    label: moment().startOf('day').add(minutes, 'minutes').format('hh:mm a')
    , value: minutes
  };
});

Template.schedulePicker.onCreated(function () {
  var tmpl = this;
  tmpl.schedule = new ReactiveVar();
  tmpl.selectedOption = new ReactiveVar();

  tmpl.autorun(function () {
    var data = Template.currentData();

    tmpl.schedule.set(data.value || options[0].createSchedule());
  });
  tmpl.autorun(function () {
    var schedule = tmpl.schedule.get();
    var selectedOption;
    if (schedule) {
      selectedOption = _.find(options, function (o) {
        return o.matches(schedule);
      });
      tmpl.selectedOption.set(selectedOption);
    }
  });
});

Template.schedulePicker.helpers({
  scheduleKinds: function () {
    return options;
  }
  , selectedPeriod: function () {
    var tmpl = Template.instance();
    return tmpl.selectedOption.get() === this;
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
    if (name === "period") {
      var selectedOption = _.findWhere(options, {name: name});
      if (selectedOption)
        tmpl.schedule.set(selectedOption.createSchedule());
    } else {
      var schedule = tmpl.schedule.get();
      schedule = this.update(schedule, value);
      tmpl.schedule.set(schedule);
    }
  }
});
