'use strict';

//var services = angular.module('guthub.services');

services.factory('Recipe', ['$resource', function($resource) {
		return $resource('RoleController/:id', {id: '@id'},{
			addRoleResource:{
				transformRequest:function(data) {
					 if (data === undefined) {
				           return data;
				     }
			         return $.param(data);
			    },
				headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}, // ignored
				method:'POST',
				url:'RoleController/addRoleResource'
			},
			addRoleResourceAction:{
				transformRequest:function(data) {
					 if (data === undefined) {
				           return data;
				     }
			         return $.param(data);
			    },
				headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}, // ignored
				method:'POST',
				url:'RoleController/addRoleResourceAction'
			}
		});
}]);

services.factory('MultiRecipeLoader', ['Recipe', '$q',
    function(Recipe, $q) {
  return function() {
    var delay = $q.defer();
    Recipe.query(function(recipes) {
      delay.resolve(recipes);
    }, function() {
      delay.reject('Unable to fetch recipes');
    });
    return delay.promise;
  };
}]);

services.factory('RecipeLoader', ['Recipe', '$route', '$q',
    function(Recipe, $route, $q) {
  return function() {
    var delay = $q.defer();
    Recipe.get({id: $route.current.params.recipeId}, function(recipe) {
      delay.resolve(recipe);
    }, function() {
      delay.reject('Unable to fetch recipe '  + $route.current.params.recipeId);
    });
    return delay.promise;
  };
}]);