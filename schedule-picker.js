var timesOfDay = Template.schedulePicker.timesOfDay = {
  morning: '10:00 am'
  , breakfast: '8:00 am'
  , beforeBreakfast: '7:30 am'
  , afterBreakfast: '8:30 am'
  , lunch: '12:00 pm'
  , beforeLunch: '11:30 am'
  , afterLunch: '12:30 pm'
  , afternoon: '4:00 pm'
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
    onetime: {
      name: 'One Time (ONE)'
    }
    , schedule: {
      name: 'Recurrent (SCH)'
      , default: 'daily'
      , options: {
        hourly: {
          name: 'Hourly'
          , default: 'every4Hours'
          , options: {
            every4Hours: {
              name: 'Every 4 Hours (Q4H)'
              , schedule: ["6:00 am", "10:00 am", "2:00 pm", "6:00 pm", "10:00 pm", "2:00 am"]
            }
            , every6Hours: {
              name: 'Every 6 Hours (Q4H)'
              , schedule: ["6:00 am", "12:00 pm", "6:00 pm", "12:00 am"]
            }
            , every8Hours: {
              name: 'Every 8 Hours (Q4H)'
              , schedule: ["6:00 am", "2:00 pm", "10:00 pm"]
            }
            , every12Hours: {
              name: 'Every 12 Hours (Q4H)'
              , schedule: ["10:00 am", "10:00 pm"]
            }
          }
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
            , three: {
              name: 'Three'
              , default: 'three'
              , options: {
                three: {
                  name: 'Three Times per Day (TID)'
                  , schedule: [timesOfDay.morning, timesOfDay.afternoon, timesOfDay.late]
                }
                , beforeMeals: {
                  name: 'Before Meals'
                  , schedule: [timesOfDay.beforeBreakfast, timesOfDay.beforeLunch, timesOfDay.beforeSupper]
                }
                , afterMeals: {
                  name: 'After Meals'
                  , schedule: [timesOfDay.afterBreakfast, timesOfDay.afterLunch, timesOfDay.afterSupper]
                }
                , withMeals: {
                  name: 'With Meals'
                  , schedule: [timesOfDay.breakfast, timesOfDay.lunch, timesOfDay.supper]
                }
              }
            }
            , four: {
              name: 'Four'
              , default: 'four'
              , options: {
                four: {
                  name: 'Four Times per Day (QID)'
                  , schedule: [timesOfDay.morning, "2:00 pm", "6:00 pm", timesOfDay.late]
                }
                , withMealsAndBedtime: {
                  name: 'With Meals and Bedtime (WM&HS)'
                  , schedule: [timesOfDay.breakfast, timesOfDay.lunch, timesOfDay.supper, timesOfDay.bedtime]
                }
                , minutes15BeforeMealsAndBedtime: {
                  name: '15 Minutes before Meals and Bedtime'
                  , schedule: ["7:45 am", "11:45 am", "7:45 pm", "11:00 pm"]
                }
                , minutes30BeforeMealsAndBedtime: {
                  name: '30 Minutes before Meals and Bedtime'
                  , schedule: [timesOfDay.beforeBreakfast, timesOfDay.beforeLunch, timesOfDay.beforeSupper, timesOfDay.bedtime]
                }
                , beforeMealsAndBedtime: {
                  name: 'Before Meals and Bedtime (AC&HS)'
                  , schedule: [timesOfDay.beforeBreakfast, timesOfDay.beforeLunch, timesOfDay.beforeSupper, timesOfDay.bedtime]
                }
                , afterMealsAndBedtime: {
                  name: 'After Meals and Bedtime (PCS&HS)'
                  , schedule: [timesOfDay.afterBreakfast, timesOfDay.afterLunch, timesOfDay.afterSupper, timesOfDay.bedtime]
                }
              }
            }
            , five: {
              name: 'Five'
              , default: 'five'
              , options: {
                five: {
                  name: 'Five Times per Day (FIVE)'
                  , schedule: ['6:00 am', '10:00 am', '2:00 pm', '6:00 pm', '10:00 pm']
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
  }
};

var partNames = ['scheduleKind', 'scheduleFrequency', 'scheduleRecurrence', 'scheduleTimes'];

Template.schedulePicker.defaultOptions.options.asneeded = _.defaults({
  name: 'As Needed (PRN)'
}, Template.schedulePicker.defaultOptions.options.schedule);

Template.schedulePicker.onCreated(function () {
  var tmpl = this;
  tmpl.dict = new ReactiveDict();

  tmpl.autorun(function () {
    var data = Template.currentData();
    if (data && data.value && data.value.selection)
      tmpl.dict.set('value', data.value.selection);
  });
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
    var options = this.options || Template.schedulePicker.defaultOptions;
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
    var startDate = this.startDate;
    var selection = tmpl.dict.get('value');
    var options = this.options || Template.schedulePicker.defaultOptions;
    var results = [];
    var parentParts = [];
    selection = selection || [];

    var part;
    while (options && options.options) {
      part = selection.shift() || options.default || null;
      options = part && options.options[part];
      parentParts.push(part);
    }

    var schedule = later.parse.text(_.map([].concat(options.schedule), function (a) {
      return "at " + a;
    }).join(' also '));

    return JSON.stringify(schedule);
  }
  , scheduleTimes: function () {
    var tmpl = Template.instance();
    var selection = tmpl.dict.get('value');
    var options = this.options || Template.schedulePicker.defaultOptions;
    var results = [];
    var parentParts = [];
    selection = selection || [];

    var part;
    while (options && options.options) {
      part = selection.shift() || options.default || null;
      options = part && options.options[part];
      parentParts.push(part);
    }

    return [].concat(options.schedule).join(", ");
  }
  , selection: function () {
    var tmpl = Template.instance();
    var selection = tmpl.dict.get('value');
    var options = this.options || Template.schedulePicker.defaultOptions;
    var results = [];
    var parentParts = [];
    selection = selection || [];

    var part;
    while (options && options.options) {
      part = selection.shift() || options.default || null;
      options = part && options.options[part];
      parentParts.push(part);
    }

    return JSON.stringify(parentParts);
  }
});