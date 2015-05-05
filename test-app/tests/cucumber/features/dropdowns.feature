Feature: A user should see schedule dropdowns
  
  The idea here is for a user to see nested dropdowns to pick from - each
  dropdown represents a greater level of detail for the schedule

  Scenario: Schedule Kind dropdown
    When I navigate to "/"
    Then I should see a dropdown "scheduleKind" with the following options:
      | name            | value       |
      | Recurrent (SCH) | schedule    |
      | As Needed (PRN) | asneeded    |
      | One Time (ONE)  | onetime     |
