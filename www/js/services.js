angular.module('adventureMap.services', [])

  .factory('Activity', function ($resource, API_URL) {
    return $resource(API_URL + '/activities/:id', {id: '@id'}, {
      'save': { method: 'POST' }
    });
  });
