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

var partNames = ['scheduleKind', 'scheduleFrequency'];

Template.schedulePicker.defaultOptions.options.asneeded = _.defaults({
  name: 'As Needed (PRN)'
}, Template.schedulePicker.defaultOptions.options.schedule);

Template.schedulePicker.onCreated(function () {
  this.dict = new ReactiveDict();
});

Template.schedulePicker.events({
  'change select': function (e, tmpl) {
    var parts = tmpl.dict.get('value') || [];
    var part = e.currentTarget.value;
    parts = parts.slice(0, this.index - 1);
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
    selection = selection || [];

    var option, part, i = 0;
    while (options && options.options) {
      part = selection.shift() || options.default || null;
      results.push(_.defaults({
        value: part
        , partName: partNames[i]
        , index: i
        , options: _.map(options.options, function (a, key) {
          return _.extend({
            value: key
          }, a);
        })
      }, options));
      options = part && options.options[part];
      i++;
    }

    return results;
  }
  , isSelected: function (a, b) {
    return a === b;
  }
});