Feature: I should be able to select any kind of medical frequency

  Scenario Outline: Once daily options
    Given I navigate to "/"
    And I select these options:
      | option          |
      | Recurrent (SCH) |
      | Daily           |
      | Once            |
      | <option>        |
    Then I should see the time <value>

    Examples:
      | option                              | value    |
      | Every Day (DAILY)                   | 10:00 am |
      | Morning (QAM)                       | 10:00 am |
      | With Breakfast (WBR)                | 8:00 am  |
      | 30 Minutes before Breakfast (30BR)  | 7:30 am  |
      | With Supper (WSUP)                  | 8:00 pm  |
      | 30 Minutes before Supper (30SUP)    | 7:30 pm  |
      | 30 Minutes after Supper (PSUP)      | 8:30 pm  |
      | Evening (PM)                        | 9:00 pm  |
      | Bedtime (HS)                        | 11:00 pm |
