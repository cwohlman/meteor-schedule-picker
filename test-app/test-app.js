if (Meteor.isClient) {
  later.date.UTC();

  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    options: function () {

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
