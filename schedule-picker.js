// Write your package code here!
Template.schedulePicker.onCreated(function () {
  this.dict = new ReactiveDict();
});

Template.schedulePicker.events({
  'change [name="scheduleKind"]': function (e, tmpl) {
    tmpl.dict.set('scheduleKind', e.currentTarget.value);
  }
});

Template.schedulePicker.helpers({
  showFrequency: function () {
    var tmpl = Template.instance();
    return tmpl.dict.get('scheduleKind') !== 'onetime';
  }
});