(function () {

  'use strict';

  module.exports = function () {

    // You can use normal require here, cucumber is NOT run in a Meteor context (by design)
    var url = require('url');
    var Promise = require('q');
    var _ = require('underscore');

    this.Given(/^I am a new user$/, function () {
      // no callbacks! DDP has been promisified so you can just return it
      return this.ddp.callAsync('reset', []); // this.ddp is a connection to the mirror
    });

    this.When(/^I navigate to "([^"]*)"$/, function (relativePath, callback) {
      // WebdriverIO supports Promises/A+ out the box, so you can return that too
      this.browser. // this.browser is a pre-configured WebdriverIO + PhantomJS instance
        url(url.resolve(process.env.HOST, relativePath)). // process.env.HOST always points to the mirror
        call(callback);
    });

    this.Then(/^I should see the title "([^"]*)"$/, function (expectedTitle, callback) {
      // you can use chai-as-promised in step definitions also
      this.browser.
        waitForVisible('h1'). // WebdriverIO chain-able promise magic
        getTitle().should.become(expectedTitle).and.notify(callback);
    });

    this.Then(/^I should see a dropdown "([^"]*)" with the following options:$/, function (dropdownName, table, callback) {

      var expectedOptions = table.hashes();
      var selector = 'select[name="' + dropdownName + '"]';
      var self = this;
      Promise.all(_.map(expectedOptions, function (item) {
        return self.browser.getText(selector + ' option[value="' + item.value + '"]').then(function (a) {
          return a.trim();
        }).should.become(item.name);
      })).nodeify(callback);
    });

    this.When(/^I select "([^"]*)" option of the "([^"]*)" dropdown$/, function (optionValue, dropdownName, callback) {
      var selector = 'select[name="' + dropdownName + '"]';

      this.browser.
        waitForVisible(selector).
        selectByValue(selector, optionValue).
        call(callback);
    });

    this.Then(/^I should not see a dropdown "([^"]*)"$/, function (dropdownName, callback) {
      var selector = 'select[name="' + dropdownName + '"]';

      this.browser.
        waitForVisible('select').
        isExisting(selector).
        should.become(false).
        and.notify(callback)
        ;
    });

    this.Then(/^The selected option of "([^"]*)" should be "([^"]*)"$/, function (dropdownName, expectedValue, callback) {
      var selector = 'select[name="' + dropdownName + '"]';

      this.browser.
        waitForVisible('select').
        getValue(selector).
        should.become(expectedValue).
        and.notify(callback)
        ;
    });

    this.Given(/^I select these options:$/, function (table, callback) {
      var self = this;
      Promise.all(_.map(table.hashes(), function (a, i) {
        return self.browser.selectByVisibleText('[data-option-index="' + i + '"]', a.option);
      })).nodeify(callback);
    });

    this.Then(/^I should see the time (.*)$/, function (value, callback) {
      this.browser.waitForVisible('p').getText('.schedule-time').should.become(value).and.notify(callback);
    });
  };

})();