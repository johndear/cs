chatApp.factory('UCsResource', function (baseResource) {
    var resourceType = cswsUrlPrefix + 'ucs';
    return baseResource(resourceType, {
        upgrade: {
            method: 'POST',
            url: resourceType + '/upgradeUcsOrder'
        }
        
    });
});


chatApp.factory('CswsResource', function ($http) {
    return{
        getProblemDescTemplate : function(path) {
            return $http({
                url: cswsUrlPrefix+'ucs/getProblemDescTemplate',
                method: 'GET',
                params: {'path': path}
            })
        }
    }
});