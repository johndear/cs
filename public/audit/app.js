var auditApp = angular.module('auditApp', ['ngResource', 'ngFileUpload']);
auditApp.config(function ($resourceProvider) {
	$resourceProvider.defaults.actions = {
//				      'create': {method: 'POST'},
//				      'update': {method: 'PUT'},
//				      'getAll': {method: 'GET', isArray:true},
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