Feature: Facebook user can create an activity

  Background:
    Given I open the app
    And I click button "Instant Facebook Connect"
    And I login using Facebook as "academy@craftacademy.se" and password "Cr@ft2017"

  Scenario: Successfully creates an activity
    And I click "New" on the right side in the navigation bar
    And I set the Activity "Title" to "Random Guy's Great Adventure"
    And I set the Activity "Body" to "Had a great time in Angered and so can you!"
    And I slide "Difficulty" to "3"
    And I select Activity "Category" to "Back country skiing"
    And I click button "Create"
    And I wait for the application to load
    Then I should see "Random Guy's Great Adventure"
