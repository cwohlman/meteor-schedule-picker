if (Meteor.isClient) {
  Template.registerHelper('debug', function () {
    return true;
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
