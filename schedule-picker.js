var timesOfDay = Template.schedulePicker.timesOfDay = {
  morning: '10:00 am'
  , breakfast: '8:00 am'
  , beforeBreakfast: '7:30 am'
  , afterBreakfast: '8:30 am'
  , lunch: '12:00 pm'
  , beforeLunch: '11:30 am'
  , afterLunch: '12:30 pm'
  , supper: '8:00 pm'
  , beforeSupper: '7:30 pm'
  , afterSupper: '8:30 pm'
  , evening: '9:00 pm'
  , late: '10:00 pm'
  , bedtime: '11:00 pm'
};

Template.schedulePicker.defaultOptions = {
  default: 'schedule'
  , options: {
    schedule: {
      name: 'Recurrent (SCH)'
      , default: 'daily'
      , options: {
        hourly: {
          name: 'Hourly'
        }
        , daily: {
          name: 'Daily'
          , default: 'once'
          , options: {
            once: {
              name: 'Once'
              , default: 'daily'
              , options: {
                daily: {
                  name: 'Every Day (DAILY)'
                  , schedule: timesOfDay.morning
                }
                , morning: {
                  name: 'Morning (QAM)'
                  , schedule: timesOfDay.morning
                }
                , breakfast: {
                  name: 'With Breakfast (WBR)'
                  , schedule: timesOfDay.breakfast
                }
                , beforeBreakfast: {
                  name: '30 Minutes before Breakfast (30BR)'
                  , schedule: timesOfDay.beforeBreakfast
                }
                , supper: {
                  name: 'With Supper (WSUP)'
                  , schedule: timesOfDay.supper
                }
                , beforeSupper: {
                  name: '30 Minutes before Supper (30SUP)'
                  , schedule: timesOfDay.beforeSupper
                }
                , afterSupper: {
                  name: '30 Minutes after Supper (PSUP)'
                  , schedule: timesOfDay.afterSupper
                }
                , evening: {
                  name: 'Evening (PM)'
                  , schedule: timesOfDay.evening
                }
                , bedtime: {
                  name: 'Bedtime (HS)'
                  , schedule: timesOfDay.bedtime
                }
              }
            }
            , twice: {
              name: 'Twice'
              , default: 'twice'
              , options: {
                twice: {
                  name: 'Twice Daily (BID)'
                  , schedule: [timesOfDay.morning, timesOfDay.late]
                }
                , morningAndBedtime: {
                  name: 'Morning and Bedtime (AM&HS)'
                  , schedule: ["7:00 am", timesOfDay.bedtime]
                }
                , twiceBeforeMeals: {
                  name: 'Twice Daily before Meals (BIDAC)'
                  , schedule: [timesOfDay.beforeBreakfast, timesOfDay.beforeSupper]
                }
                , twiceAfterMeals: {
                  name: 'Twice Daily after Meals (BIDPC)'
                  , schedule: [timesOfDay.afterBreakfast, timesOfDay.afterSupper]
                }
                , twiceMeals: {
                  name: 'Twice Daily with Meals (BIDWM)'
                  , schedule: [timesOfDay.breakfast, timesOfDay.supper]
                }
                , twiceInsulin: {
                  name: 'Twice Daily for Insulin'
                  , schedule: [timesOfDay.beforeBreakfast, timesOfDay.beforeSupper]
                }

              }
            }
          }
        }
        , weekly: {
          name: 'Weekly'
        }
        , monthly: {
          name: 'Monthly'
        }
      }
    }
    , onetime: {
      name: 'One Time (ONE)'
    }
  }
};

var partNames = ['scheduleKind', 'scheduleFrequency', 'scheduleRecurrence', 'scheduleTimes'];

Template.schedulePicker.defaultOptions.options.asneeded = _.defaults({
  name: 'As Needed (PRN)'
}, Template.schedulePicker.defaultOptions.options.schedule);

Template.schedulePicker.onCreated(function () {
  this.dict = new ReactiveDict();
});

Template.schedulePicker.events({
  'change select': function (e, tmpl) {
    var parts = this.parentParts;
    var part = e.currentTarget.value;
    parts.push(part);
    tmpl.dict.set('value', parts);
  }
});

Template.schedulePicker.helpers({
  parts: function () {
    var tmpl = Template.instance();
    var selection = tmpl.dict.get('value');
    var options = Template.schedulePicker.defaultOptions;
    var results = [];
    var parentParts = [];
    selection = selection || [];

    var option, part, i = 0;
    while (options && options.options) {
      part = selection.shift() || options.default || null;
      results.push(_.defaults({
        value: part
        , partName: partNames[i]
        , parentParts: parentParts.concat()
        , index: i
        , options: _.map(options.options, function (a, key) {
          return _.extend({
            value: key
          }, a);
        })
      }, options));
      options = part && options.options[part];
      i++;
      parentParts.push(part);
    }

    return results;
  }
  , isSelected: function (a, b) {
    return a === b;
  }
  , schedule: function () {
    var tmpl = Template.instance();
    var selection = tmpl.dict.get('value');
    var options = Template.schedulePicker.defaultOptions;
    var results = [];
    var parentParts = [];
    selection = selection || [];

    var part;
    while (options && options.options) {
      part = selection.shift() || options.default || null;
      options = part && options.options[part];
      parentParts.push(part);
    }

    return options.schedule;
  }
});