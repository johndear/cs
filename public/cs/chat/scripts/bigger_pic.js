(function() {
    'use strict';

    angular.module('uc.biggerPic', []);

    angular.module('uc.biggerPic').directive('ucBiggerPic', BiggerPic);

    function BiggerPic() {
        var bigerDiv =
            '<div ng-show="pic.showing.show" id="big-pic" ng-style="pic.getShowStyle()">' +
                '<div class="big-pic-container" ng-click="pic.hidePic()" >' +
                '</div>'+
                 '<div class="pic-wap" ng-click="pic.hidePic()"  ng-style="pic.getBackgroundStyle(pic.picUrl.url)" >' +
                '</div>'+
                '<div class="glyphicon glyphicon-remove big-pic-remove"></div>'+
            '</div>';


        var directive = {
            restrict: 'EA',
            template: bigerDiv,
            replace: true,
            scope: {
                picUrl: '=',
                showPic: '&',
                showing:'='
            },
            link: link,
            controller: PicCtrl,
            controllerAs: 'pic'
        };

        function link($scope) {

        }

        return directive;
    }

    PicCtrl.$inject = ['$scope'];

    function PicCtrl($scope) {
        var pic = this;
        pic.picUrl=$scope.picUrl;
        pic.showing=$scope.showing;

        pic.hidePic = function(){
            pic.showing.show=false;
        }
        pic.getBackgroundStyle=function(imagepath){
            return {
                'background-image':'url(' + imagepath + ')'
            }
        }


        pic.getShowStyle=function(){
            return {'display': pic.showing.show==true?'block':'none'}
        }
    }




})();