Package.describe({
  name: 'cwohlman:schedule-picker',
  version: "0.1.0",
  // Brief, one-line summary of the package.
  summary: 'Allow users to pick a schedule for some recurring event.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/cwohlman/meteor-schedule-picker',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
      'underscore'
      , 'templating'
      , 'reactive-dict'
      , 'reactive-var'
      , 'momentjs:moment@2.0.0'
    ]);

  api.addFiles([
    'later.js'
  ], 'client');

  api.addFiles([
      'schedule-picker.html'
      , 'schedule-picker.js'
    ], 'client');

  api.export('later', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('cwohlman:schedule-picker');
  api.addFiles('schedule-picker-tests.js');
});
