Feature: View map page


  Background:
    Given I open the app
    And I am logged in as "thomas@random.se" with password "password"

  Scenario: View profile
    Given I click on the toggle menu button
    And I select "Map"
    Then I should be on the "app/map" page
    And the Leaflet map should be visible

