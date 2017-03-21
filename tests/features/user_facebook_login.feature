Feature: Enable OAuth on client
  As a User
  in order to simplify my login
  I would like to log in with Facebook

  Background:
    Given I open the app


  Scenario: Main page - Facebook login with valid credentials
    And I click button "Instant Facebook Connect"
    And I login using Facebook as "academy@craftacademy.se" and password "Cr@ft2017"
    Then I should be on the "app/activities" page

  Scenario: Login page - Facebook login with valid credentials
    Given I click "LOGIN"
    And I click button "Log in via Facebook"
    And I login using Facebook as "academy@craftacademy.se" and password "Cr@ft2017"
    Then I should be on the "app/activities" page
