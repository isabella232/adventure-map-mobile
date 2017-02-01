Feature: Running Cucumber with Protractor
  As a stakeholder
  In order to achieve a business value
  I would like to be able to do something

  Scenario: Protractor and Cucumber Test
    Given I go to "http://localhost:8100"
    Then I should see an navigation bar
    And the navigation bar should be "AdventureMap"
    And the title should be "AdventureMap"
    And I should see "HelloWorld"
