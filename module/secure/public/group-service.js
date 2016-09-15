'use strict';

//var services = angular.module('guthub.services', ['ngGroup']);

services.factory('Group', ['$resource', function($resource) {
		return $resource('GroupController/:id', {id: '@id'},{
		});
}]);

services.factory('MultiGroupLoader', ['Group', '$q',
    function(Group, $q) {
  return function() {
    var delay = $q.defer();
    Group.query(function(recipes) {
      delay.resolve(recipes);
    }, function() {
      delay.reject('Unable to fetch recipes');
    });
    return delay.promise;
  };
}]);

