Feature: The schedule picker creates a hidden input with the JSONified array of selections

  Scenario Outline: 
    Given I navigate to "/"
    When I select these options:
      | option            |
      | Recurrent (SCH)   |
      | Daily             |
      | <recurrence>      |
      | <instructions>    |
    Then I should see the selection <schedule>

  Examples:
  | recurrence | instructions              | schedule                                                                                                         |
  | Twice      | Twice Daily (BID)         | ["schedule","daily","twice","twice"] |
  | Once       | Every Day (DAILY)         | ["schedule","daily","once","once"] |
  | Five       | Five Times per Day (FIVE) | ["schedule","daily","five","five"] |

