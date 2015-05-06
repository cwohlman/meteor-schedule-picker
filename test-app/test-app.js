if (Meteor.isClient) {
  later.date.UTC();

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    startDate: function () {
      return new Date("2015-01-01T00:00:00Z");
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
