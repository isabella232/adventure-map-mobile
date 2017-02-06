Feature: User can create an Activity
  As a User
  in order to share my experiences
  I need to be able to create an Activity

  PR Story: https://www.pivotaltracker.com/story/show/136350481

  Background:
    Given I open the app
    And I am logged in as "thomas@random.se" with password "password"
    And I wait for the application to load

  Scenario: Successfully creates an activity
    And I click "New" in the navigation bar
    And I set the Activity "Title" to "Hiking in Angered"
    And I set the Activity "Body" to "Had a great time in Angered and so can you!"
    And I slide "Difficulty" to "3"
    And I select Activity "Category" to "Back country skiing"
    And I click "Create"
    And I wait for the application to load
    Then I should be on the "activities" page
    And I should see "Hiking in Angered"

