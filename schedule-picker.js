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

var defaults = {
  periodOptions: [
    {
      name: "Hourly"
      , value: 'hour'
    }
    , {
      name: "Daily"
      , value: 'day'
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
    }
    , {
      name: "Monthly"
      , value: 'month'
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
  , minuteOptions: _.map(_.range(0, 48), function (i) {
    var value = i * 30;
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
    var instanceCount = tmpl.dict.get('instanceCount');
    var period = tmpl.dict.get('period');
    var periodDef = _.find(defaults.periodOptions, function (a) {
      return a.value === period;
    });
    var requiredPeriods = _.difference(defaults.requiredPeriods, [periodDef.period || period]);

    var instances = _.map(_.range(instanceCount), function (i) {
      var periods = _.map(requiredPeriods, function (p) {
        var value = tmpl.dict.get(i + "." + p);
        var options = periodDef && periodDef[p + "Options"] || defaults[p + "Options"];
        return {
          value: value
          , period: p
          , options: options
        };
      });
      return {
        requiredPeriods: periods
        , index: i
      };
    });

    return instances;
  }
});

Template.schedulePicker.events({
  'change select': function (e, tmpl) {
    tmpl.dict.set(e.currentTarget.name, e.currentTarget.value);
  }
});
