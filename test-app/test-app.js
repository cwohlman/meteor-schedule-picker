if (Meteor.isClient) {
  later.date.UTC();

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    options: function () {
      var options = EJSON.clone(Template.schedulePicker.defaultOptions);
      options.options.test = {
        name: "Test"
      };
      return options;
    }
  });

  Template.hello.events({

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
