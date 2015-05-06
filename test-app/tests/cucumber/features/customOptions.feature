Feature: I should be able to specify custom options

  Scenario: Schedule Kind dropdown
    Given I navigate to "/"
    Then I should see a dropdown "scheduleKind" with the following options:
      | name | value    |
      | Test | test     |
