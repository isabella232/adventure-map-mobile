Feature: User can log in using email and password
  As a User
  in order to use the app
  I need to sign in.

  PT Story: https://www.pivotaltracker.com/story/show/136350367

  Background:
    Given I open the app
    And I click "LOGIN"

  Scenario: User logs in with valid credentials
    And I enter "thomas@random.se" as email
    And I enter "password" as password
    And I click button "LOGIN"
    Then I should be on the "app/activities" page

  Scenario: User logs in with invalid credentials
    And I enter "thomas@random.se" as email
    And I enter "wrong_password" as password
    And I click button "LOGIN"
    Then I should be on the "intro/login" page
    And I should see "INVALID CREDENTIALS"


