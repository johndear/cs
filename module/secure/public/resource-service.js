'use strict';

//var services = angular.module('guthub.services', ['ngResource']);

services.factory('Resource', ['$resource', function($resource) {
		return $resource('ResourceController/:id', {id: '@id'},{
		});
}]);

services.factory('MultiResourceLoader', ['Resource', '$q',
    function(Resource, $q) {
  return function() {
    var delay = $q.defer();
    Resource.query(function(recipes) {
      delay.resolve(recipes);
    }, function() {
      delay.reject('Unable to fetch recipes');
    });
    return delay.promise;
  };
}]);

services.factory('ResourceLoader', ['Resource', '$route', '$q',
    function(Resource, $route, $q) {
  return function() {
    var delay = $q.defer();
    Resource.get({id: $route.current.params.recipeId}, function(Resource) {
      delay.resolve(Resource);
    }, function() {
      delay.reject('Unable to fetch Resource '  + $route.current.params.recipeId);
    });
    return delay.promise;
  };
}]);