Feature: The schedule picker should display the next date

  Scenario Outline: Twice daily
    Given I navigate to "/"
    When I select these options:
      | option            |
      | Recurrent (SCH)   |
      | Daily             |
      | <recurrence>      |
      | <instructions>    |
    Then I should see the date "<date>"

  Examples:
  | recurrence | instructions              | date                     |
  | Twice      | Twice Daily (BID)         | 2015-01-01T10:00:00.000Z |
  | Once       | Every Day (DAILY)         | 2015-01-01T10:00:00.000Z |
  | Five       | Five Times per Day (FIVE) | 2015-01-01T06:00:00.000Z |
