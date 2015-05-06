Feature: The schedule picker creates a hidden input with the JSONified schedule

  Scenario Outline: 
    Given I navigate to "/"
    When I select these options:
      | option            |
      | Recurrent (SCH)   |
      | Daily             |
      | <recurrence>      |
      | <instructions>    |
    Then I should see the schedule <schedule>

  Examples:
  | recurrence | instructions              | schedule                                                                                                         |
  | Twice      | Twice Daily (BID)         | {"schedules":[{"t":[36000]},{"t":[79200]}],"exceptions":[],"error":-1}                                           |
  | Once       | Every Day (DAILY)         | {"schedules":[{"t":[36000]}],"exceptions":[],"error":-1}                                                         |
  | Five       | Five Times per Day (FIVE) | {"schedules":[{"t":[21600]},{"t":[36000]},{"t":[50400]},{"t":[64800]},{"t":[79200]}],"exceptions":[],"error":-1} |
