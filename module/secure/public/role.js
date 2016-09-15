var adminApp = angular.module('adminApp');

adminApp.controller('roleCtrl', function($scope,$http, $uibModal, $log, Recipe, allResources){
	myResourceList = allResources.slice(0, allResources.length);

	$scope.bsTableControl = {
            options: {
            	url:'RoleController',
			    cache: false,
			    height: 400,
//			    striped: true,
			    pagination: false,
			    pageSize: 5,
			    pageList: [5, 10, 25, 50, 100, 200],
			    search: false,
			    showColumns: false,
			    showToggle: false,
			    showRefresh: false,
			    minimumCountColumns: 2,
			    clickToSelect: true,
			    maintainSelected: true,
			    singleSelect: true,
			    columns: [{
			    	field:'box',
			    	checkbox: true
			    },{
			        field: 'roleName',
			        title: '角色名称'
			    }, {
			        field: 'price',
			        title: '备注'
			    }, {
			        field: 'opt',
			        title: '操作',
			        formatter:function(value, row, index) {
			        	return '<a onclick="javascript:void(0);">分配资源</a>'
			        }
			    },{
			        field: 'id',
			        title: 'ID',
			        visible: false
			    }],
			    onClickCell: function(field, value, row, $element){
			    	if(field=='opt'){
			    		$scope.open(row);
			    	}
			    },
			    onClickRow: function(row, $element){
			    	getResourceAction(row.id);
			    },
			    onCheck: function(row, $element){
			    	getResourceAction(row.id);
			    }
            }
	}
	
	$scope.bsTableControl2 = {
            options: {
            	data: [],
				rowStyle: function (row, index) {
			        return { classes: 'none' };
			    },
			    cache: false,
			    height: 400,
			    striped: true,
			    pagination: false,
			    pageSize: 5,
			    pageList: [5, 10, 25, 50, 100, 200],
			    search: false,
			    showColumns: false,
			    showToggle: false,
			    showRefresh: false,
			    minimumCountColumns: 2,
			    clickToSelect: false,
			    maintainSelected: true,
			    columns: [{
			        field: 'name',
			        title: '资源名称'
			    },{
			        field: 'actions',
			        title: '操作名称'
			    },{
			        field: 'authActions',
			        title: '已授权操作'
			    }]
            }
	}
	
	function getResourceAction(roleId){
		$scope.bsTableControl2 = {
	            options: {
	            	url:'ResourceController/queryByRoleId?roleId='+roleId,
					rowStyle: function (row, index) {
				        return { classes: 'none' };
				    },
				    cache: false,
				    height: 400,
				    striped: true,
				    pagination: false,
				    pageSize: 5,
				    pageList: [5, 10, 25, 50, 100, 200],
				    search: false,
				    showColumns: false,
				    showToggle: false,
				    showRefresh: false,
				    minimumCountColumns: 2,
				    clickToSelect: false,
				    maintainSelected: true,
//				    detailView: true,
//				    detailFormatter:function(index, row, element) {
//				    	return '';
//				    },
				    columns: [{
				        field: 'name',
				        title: '资源名称'
				    },{
				        field: 'actions',
				        title: '操作名称',
				        formatter:function(value, row, index) {
				        	if(value!=undefined){
				        		if(value.endWith(',')){
				        			value = value.substring(0, value.length-1);
				        		}
				        		var checkBoxList = '';
				        		// 资源所有操作
				        		var actions = value.split(',');
				        		// 资源已授权操作
				        		if(row.authActions!=undefined){
				        			var authActions = row.authActions.split(',');
				        		}
				        		for(var i in actions){
				        			var _value = actions[i].split(':')[0];
				        			var _text = actions[i].split(':')[1];
				        			// 默认选中已授权操作
				        			var authed = false;
				        			for(var j in authActions){
				        				if(_value == authActions[j]){
				        					authed = true;
				        				}
				        			}
				        			checkBoxList +=' <input type="checkbox" value="'+ _value +'" '+ (authed? 'checked':'') +'>' + _text;
				        		}
				        		return checkBoxList;
				        	}
				        	return value;
					    }
				    },{
				        field: 'authActions',
				        title: '已授权操作',
				        visible: false
				    },{
				    	field:'id',
				        title: '资源id',
				        visible: false
				    }],
				    onClickCell: function(field, value, row, $element){
				    	if('actions'==field){
				    		var resourceAction = [];
				    		$element.find('input[type=checkbox]:checked').each(function(){
				    			resourceAction.push($(this).val());
				    		});
				    		row.authActions = resourceAction.join(',');
				    	}
				    }
	            }
		}
		$scope.$apply($scope.bsTableControl2);
	}
	
	
	
  // 弹出框事件
  $scope.open = function (selectedRow) {
	  var modalInstance = $uibModal.open({
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      animation: true,
	      size: '',// lg,sm
	      resolve: {
	    	roleId: selectedRow.id,
	    	resourceList: function () {
	    		return myResourceList;
	        }
	      }
	  });

	    modalInstance.result.then(function (selectedItem) {
	       $scope.selected = selectedItem;
	    }, function () {
	       $log.info('Modal dismissed at: ' + new Date());
	    });
  };

  $scope.saveRoleResourceAction = function () {
	  var roles = $('#bt1').bootstrapTable('getSelections');
	  if(roles.length==0){
		  alert('请选择角色，再保存');
		  return;
	  }
	  var resources = $('#bt2').bootstrapTable('getData', 0);
	  var authResourceAction = [];
	  for(var i in resources){
		  if(resources[i].authActions != undefined){
			  authResourceAction.push({resourceId:resources[i].id, resourceAction:resources[i].authActions});
		  }
	  }
	  
	  var data = {roleId: roles[0].id, actions: authResourceAction};
//	  console.log('authResourceAction', data);
	  Recipe.addRoleResourceAction(data);
  };
  
});

// 弹出框页面controller
adminApp.controller('ModalInstanceCtrl', function ($http, $scope, $uibModalInstance, roleId, resourceList, Recipe) {
	
	  console.log('resourceList', resourceList);
	  $scope.resources = resourceList;
	  $scope.selected = {
	    item: $scope.resources[0]
	  };
	
	  $scope.ok = function () {
		  console.log('ok...', $scope.selectNode);
		  if($scope.selectNode == undefined){
			  alert('请选中资源后，再保存');
			  return;
		  }
		  var selectedResourceIds = [];
		  for(var i in $scope.selectNode){
			  selectedResourceIds.push($scope.selectNode[i].id);
		  }
		  Recipe.addRoleResource({roleId:roleId, resourceIds:selectedResourceIds});
		  
//		  Recipe.get({id:'3'}, function(user){
//			  console.log('user', user)
//			  user.$save();
//			  //这里等价于User.save({id:'123'},{name:'changeAnotherName'})
//		  });
		  $uibModalInstance.close($scope.selected.item);
	  };
	
	  $scope.cancel = function () {
		  console.log('cancel...');
		  $uibModalInstance.dismiss('cancel');
	  };
});

String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}



