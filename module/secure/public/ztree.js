'use strict';
/* App Module */
var appModule = angular.module('adminApp');
appModule.directive('tree', function() {
	return {
		require : '?ngModel', // ?表示可选。绑定该数据模型
		restrict : 'A',
		scope : {
			nodes : "=nodeData"// 绑定directive元素身上的node-data数据模型的值到nodes变量上
		},
//		replace: true,
//		template: '<div>{{nodes}}</div>',
		link : function($scope, element, attrs, ngModel) {
//			console.log($scope.nodes);
			var setting = {
				check : {
					enable : true
				},
				data : {
					key : {
						title : "t"
					},
					simpleData : {
						enable : true
					}
				},
				callback : {
					onCheck : function(event, treeId, treeNode, clickFlag) {
						$scope.$apply(function() {
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							var nodes = treeObj.getCheckedNodes(true);
							ngModel.$setViewValue(nodes);
						});
					}
				}
			};
			
			$.fn.zTree.init(element, setting, $scope.nodes);
		}
	};
});
