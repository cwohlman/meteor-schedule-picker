Feature: I should be able to select any kind of medical frequency

  Scenario Outline:
    Given I navigate to "/"
    And I select these options:
      | option          |
      | Recurrent (SCH) |
      | <frequency>     |
      | <recurrence>    |
      | <time>          |
    Then I should see the time <value>

    Examples:
      | frequency | recurrence | time                               | value                      |
      | Daily     | Once       | Every Day (DAILY)                  | 10:00 am                   |
      | Daily     | Once       | Morning (QAM)                      | 10:00 am                   |
      | Daily     | Once       | With Breakfast (WBR)               | 8:00 am                    |
      | Daily     | Once       | 30 Minutes before Breakfast (30BR) | 7:30 am                    |
      | Daily     | Once       | With Supper (WSUP)                 | 8:00 pm                    |
      | Daily     | Once       | 30 Minutes before Supper (30SUP)   | 7:30 pm                    |
      | Daily     | Once       | 30 Minutes after Supper (PSUP)     | 8:30 pm                    |
      | Daily     | Once       | Evening (PM)                       | 9:00 pm                    |
      | Daily     | Once       | Bedtime (HS)                       | 11:00 pm                   |
      | Daily     | Twice      | Twice Daily (BID)                  | 10:00 am,10:00 pm          |
      | Daily     | Twice      | Morning and Bedtime (AM&HS)        | 7:00 am,11:00 pm           |
      | Daily     | Twice      | Twice Daily before Meals (BIDAC)   | 7:30 am,7:30 pm            |
      | Daily     | Twice      | Twice Daily after Meals (BIDPC)    | 8:30 am,8:30 pm            |
      | Daily     | Twice      | Twice Daily with Meals (BIDWM)     | 8:00 am,8:00 pm            |
      | Daily     | Twice      | Twice Daily for Insulin            | 7:30 am,7:30 pm            |
