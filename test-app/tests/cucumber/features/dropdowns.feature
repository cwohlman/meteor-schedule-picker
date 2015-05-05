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
      | name    | value   |
      | Hourly  | hourly  |
      | Daily   | daily   |
      | Weekly  | weekly  |
      | Monthly | monthly |

  Scenario: Schedule Frequency dropdown (asneeded)
    Given I navigate to "/"
    When I select "asneeded" option of the "scheduleKind" dropdown
    Then I should see a dropdown "scheduleFrequency" with the following options:
      | name    | value   |
      | Hourly  | hourly  |
      | Daily   | daily   |
      | Weekly  | weekly  |
      | Monthly | monthly |

  Scenario: Schedule Frequency dropdown (asneeded)
    Given I navigate to "/"
    When I select "schedule" option of the "scheduleKind" dropdown
    When I select "daily" option of the "scheduleFrequency" dropdown
    When I select "once" option of the "scheduleRecurrence" dropdown
    Then I should see a dropdown "scheduleTimes" with the following options:
      | name                               | value           |
      | Every Day (DAILY)                  | daily           |
      | Morning (QAM)                      | morning         |
      | With Breakfast (WBR)               | breakfast       |
      | 30 Minutes before Breakfast (30BR) | beforeBreakfast |
      | With Supper (WSUP)                 | supper          |
      | 30 Minutes before Supper (30SUP)   | beforeSupper    |
      | 30 Minutes after Supper (PSUP)     | afterSupper     |
      | Evening (PM)                       | evening         |
      | Bedtime (HS)                       | bedtime         |

  Scenario: Schedule Frequency dropdown (onetime)
    Given I navigate to "/"
    When I select "onetime" option of the "scheduleKind" dropdown
    Then I should not see a dropdown "scheduleFrequency"

  Scenario: Daily should be the default option for the frequency dropdown
    Given I navigate to "/"
    When I select "schedule" option of the "scheduleKind" dropdown
    Then The selected option of "scheduleFrequency" should be "daily"
