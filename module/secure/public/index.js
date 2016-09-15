

var adminApp = angular.module('adminApp', ['ngRoute', 'bsTable', 'ui.bootstrap','guthub.services', 'ngTouch', 'ui.grid.treeView', 'mgcrea.ngStrap']);

// 对ajax http进行监控。添加拦截器，对request和response做前置和后置处理
adminApp.factory('errorInterceptor',function($q,$location,$rootScope){
	return {
		'responseError': function(rejection) {
			// 如果返回403，就跳转到没有权限访问的页面 
			// 现在已经改为后台跳转，这样做url不会改变，只需要设置权限后刷新当前页面就可以访问了
			if(rejection.status>=400 && rejection.status<500){
//				alert('access dead!');
//				$location.path('/accessDenied');
			}
		    return $q.reject(rejection);
		}
	};
});
adminApp.config(function($httpProvider){
	$httpProvider.interceptors.push('errorInterceptor');
});

adminApp.config(function ($resourceProvider) {
	$resourceProvider.defaults.actions = {
//	      'create': {method: 'POST'},
//	      'update': {method: 'PUT'},
//	      'getAll': {method: 'GET', isArray:true},
	      'get':    {method: 'GET'},
	      'save':   {method: 'POST'},
	      'query':  {method: 'GET', isArray:true},
	      'remove': {method: 'DELETE'},
	      'delete': {method: 'DELETE'}
    };
	
  $resourceProvider.defaults.actions.save = {
		 transformRequest:function(data) {
			 if (data === undefined) {
		           return data;
		     }
	         return $.param(data);
	     },
		 method:'post',
	     headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} // ignored
  };
});

//adminApp.factory("roleService", function($q){
//	return $http.get('ResourceController/queryAll').then(function(data){
//		console.log('data', data);
//	});
//    return {
//        getMessage: function(){
//            return $q.when("Hello World!");
//        }
//    };
//});

// TODO 怎么把跟secure有关的js，抽成独立的js。并且把main.html中依赖的js
adminApp.config(['$routeProvider', function($routeProvider, $http) {
	
        $routeProvider.when('/', {
            templateUrl: 'SecureApplication/welcome',
            controller: 'listCtrl'
        }).when('/resource', {
            templateUrl: 'ResourceController/index',
            controller: 'resourceCtrl'
        }).when('/role', {
            templateUrl: 'RoleController/index',
            controller: 'roleCtrl',
            resolve:{
            	allResources: ["MultiResourceLoader", function(MultiResourceLoader) {
                    return MultiResourceLoader();
                }]
            }
        }).when('/group', {
            templateUrl: 'GroupController/index',
            controller: 'groupCtrl',
            resolve:{
            	allGroups: ["MultiGroupLoader", function(MultiGroupLoader) {
                    return MultiGroupLoader();
                }]
            }
        }).when('/user', {
            templateUrl: 'UserController/index',
            controller: 'userCtrl'
        });

}]);

adminApp.controller('listCtrl', ['$scope', function($scope){
	
	console.log('welcom...');
	
}]);