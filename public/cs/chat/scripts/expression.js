(function() {
    'use strict';

    angular.module('uc.chatExpression', []);

    angular.module('uc.chatExpression').directive('ucChatExpression', ChatExpression);

    function ChatExpression() {
        var expExpression =
            '<div class="emotion-container" id="emotion-container" ng-style="exp.getShowStyle()" ng-click="exp.stopPP($event)">' +
                '<div class="emotion-content">'+
                    '<div ng-repeat="expression in expressions">'+
                        '<li class="col-xs-3 col-md-3 emotion-blog" ng-click="exp.chooseFunction(expression)"><img ng-src="{{ expression.url }}"></li>'+
                    '</div>'+

                '</div>'+
                '<s class="arrow"></s>'+
            '</div>';



        var directive = {
            restrict: 'EA',
            template: expExpression,
            replace: true,
            scope: {
                expressions: '=',
                chooseFunction: '&',
                showing:'='
            },
            link: link,
            controller: ExpCtrl,
            controllerAs: 'exp'
        };

        function link(scope) {

        }

        return directive;
    }

    ExpCtrl.$inject = ['$scope'];

    function ExpCtrl($scope) {
        var exp = this;
        exp.chosen=[];
        exp.showing=$scope.showing;

        exp.chooseFunction = function(expression) {
            $scope.chooseFunction({expression: expression});
        };

        exp.getShowStyle=function(){
            return {'display': exp.showing.show==true?'block':'none'}
        };

        exp.stopPP=function($event){
            if($event){
                $event.stopPropagation();
            }
        }
    }

})();