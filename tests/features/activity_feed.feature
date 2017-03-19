Feature: View activity feed
  As a User
  in order to see all the activities for my given interests (pre determined or able to change in settings)
  I need to see a Feed of Activities.

  https://www.pivotaltracker.com/story/show/136351621

  Background:
    Given I open the app
    And I am logged in as "thomas@random.se" with password "password"
    And I create an activity "My Super Cool Activity"

  Scenario: I view my activity feed
    Given I go to "#/app/activities"
    Then the navigation bar should be "Activity Feed"
    And I should see "My Super Cool Activity"
