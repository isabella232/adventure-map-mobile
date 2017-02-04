Feature: User can log in using email and password
  As a User
  in order to use the app
  I need to sign in.

  PT Story: https://www.pivotaltracker.com/story/show/136350367

  Scenario: User logs in with valid credentials
    Given I open the app
    And I fill in "Email" with "thomas2@random.se"
    And I fill in "Password" with "password"
    And I click "Login"
    Then I should be on the "activities" page
    And I should see "This is the Activities View"

  Scenario: User logs in with invalid credentials
    Given I open the app
    And I fill in "Email" with "thomas2@random.se"
    And I fill in "Password" with "wrong_password"
    And I click "Login"
    Then I should be on the "home" page
    And I should see "Invalid credentials"


