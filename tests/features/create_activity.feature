Feature: User can create an Activity
  As a User
  in order to share my experiences
  I need to be able to create an Activity

  PR Story: https://www.pivotaltracker.com/story/show/136350481

  Scenario: Successfully creates an activity
    Given I open the app
    And I am logged in as "thomas@random.se" with password "password"
    And I click "Create an Activity"
    And I set the Activity "Title" to "Hiking in Vättlefjäll"
    And I set the Activity "Body" to "Had a great time in Angered and so can you!"
    And I slide "Difficulty" to "3"
    And I select Activity "Category" to "Back country skiing"
    And I click "Create"
    Then I should be on the "activities" page

