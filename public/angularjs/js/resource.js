angular.module('ucsApp').factory('UCsResource', function (baseResource) {
    var resourceType = 'ucs';
    return baseResource(resourceType, {
        upgrade: {
            method: 'POST',
            url: resourceType + '/upgradeUcsOrder'
        }
        
    });
});