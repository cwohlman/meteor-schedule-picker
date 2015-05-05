Feature: A user should see schedule dropdowns
  
  The idea here is for a user to see nested dropdowns to pick from - each
  dropdown represents a greater level of detail for the schedule

  Scenario: Schedule Kind dropdown
    Given I navigate to "/"
    Then I should see a dropdown "scheduleKind" with the following options:
      | name            | value       |
      | Recurrent (SCH) | schedule    |
      | As Needed (PRN) | asneeded    |
      | One Time (ONE)  | onetime     |

  Scenario: Schedule Frequency dropdown (schedule)
    Given I navigate to "/"
    When I select "schedule" option of the "scheduleKind" dropdown
    Then I should see a dropdown "scheduleFrequency" with the following options:
      | name   | value  |
      | Daily  | daily  |
      | Hourly | hourly |

  Scenario: Schedule Frequency dropdown (asneeded)
    Given I navigate to "/"
    When I select "asneeded" option of the "scheduleKind" dropdown
    Then I should see a dropdown "scheduleFrequency" with the following options:
      | name   | value  |
      | Daily  | daily  |
      | Hourly | hourly |

  Scenario: Schedule Frequency dropdown (onetime)
    Given I navigate to "/"
    When I select "onetime" option of the "scheduleKind" dropdown
    Then I should not see a dropdown "scheduleFrequency"