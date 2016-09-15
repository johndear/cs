var adminApp = angular.module('adminApp');

adminApp.controller('resourceCtrl', function($scope,$http,$aside,Resource){

	$scope.bsTableControl = {
            options: {
            	url:'ResourceController/queryAll',
				rowStyle: function (row, index) {
			        return { classes: 'none' };
			    },
			    cache: false,
			    height: 400,
			    striped: true,
			    pagination: false,
			    pageSize: 5,
			    pageList: [5, 10, 25, 50, 100, 200],
			    search: true,
			    showColumns: true,
			    showRefresh: false,
			    minimumCountColumns: 2,
			    clickToSelect: false,
			    showToggle: true,
			    maintainSelected: true,
			    columns: [{
			        field: 'id',
			        title: 'ID'
			    }, {
			        field: 'name',
			        title: '资源名称'
			    }, {
			        field: 'price',
			        title: '备注'
			    }, {
			        field: 'actions',
			        title: '操作'
			    }],
			    onClickRow: function(row, $element){
			    	console.log('row', row);
			    }
            }
	}
	
	// 弹出aside框
	$scope.aside = function(singleResource){
		var actionList = [];
		if(singleResource.actions){
			var actions = singleResource.actions.split(',');
			for(var i in actions){
				var action = actions[i];
				if(action!=''){
					actionList.push({code: action.split(':')[0], name: action.split(':')[1]});
				}
			}
		}
		
		$scope.resource = singleResource;
		$scope.resource.actionList = actionList;
		
		var myOtherAside = $aside({title: '详情页', content: '<b>基本信息</b>', scope: $scope, template: 'views/resource.tpl.html'});
		myOtherAside.$promise.then(function() {
			myOtherAside.show();
		});
	}
	
	$scope.addRow = function(){
		var actionList = $scope.resource.actionList;
		actionList.push({code: '', name: '', editable: true});
		$scope.resource.actionList = actionList;
	}
	
	$scope.save = function(){
		var actionList = $scope.resource.actionList;
		for (var i=0;i<actionList.length;i++){
			for (var j= i+1;j<actionList.length;j++){
				if(actionList[i].code==actionList[j].code || actionList[i].name==actionList[j].name){
					alert('已经存在该键/值: ' + actionList[i].code + '==' + actionList[i].name);
					return;
				}
			}
		}
		
		for (var i=0;i<actionList.length;i++){
			if(actionList[i].code=='' || actionList[i].name==''){
				alert('键/值不能为空: ' + actionList[i].code + '==' + actionList[i].name);
				return;
			}
		}
		
		console.log('actionList', actionList);
	}
	
	// =============== ui-grid =======================
	$scope.detail = function(row){
		console.log('row', row);
		console.log(row.entity.id);
		Resource.get({id: row.entity.id}, function(result){
			console.log('resource', result);
			// 弹出aside框
			$scope.aside(result);
		});
	}
	
	$scope.gridOptions = {
	    enableSorting: false,
	    enableFiltering: true,
	    showTreeExpandNoChildren: true,
	    columnDefs: [
	      { name: 'name', width: '30%' },
	      { name: 'code', width: '20%' },
	      { name: 'url', width: '20%' },
	      { name: 'pId', width: '25%' }
//	      { name: 'state', width: '35%' },
//	      { name: 'balance', width: '25%', cellFilter: 'currency' }
	    ],
	    onRegisterApi: function( gridApi ) {
	      $scope.gridApi = gridApi;
	      $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {
	    	console.log('Expanded...ajax..');
//	        if( row.entity.$$hashKey === $scope.gridOptions.data[50].$$hashKey && !$scope.nodeLoaded ) {
//	          $interval(function() {
//	            $scope.gridOptions.data.splice(51,0,
//	              {name: 'Dynamic 1', gender: 'female', age: 53, company: 'Griddable grids', balance: 38000, $$treeLevel: 1},
//	              {name: 'Dynamic 2', gender: 'male', age: 18, company: 'Griddable grids', balance: 29000, $$treeLevel: 1}
//	            );
//	            $scope.nodeLoaded = true;
//	          }, 2000, 1);
//	        }
	      });
	    },
	    rowTemplate: '<div ng-click="grid.appScope.detail(row)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>'
	  };
	 
	  $http.get('ResourceController')
	  .success(function(data) {
//	   for ( var i = 0; i < data.length; i++ ){
//	     data[i].state = data[i].address.state;
//	     data[i].balance = Number( data[i].balance.slice(1).replace(/,/,'') );
//	   }
	   data[0].$$treeLevel = 0;
//	   data[1].$$treeLevel = 1;
//	   data[10].$$treeLevel = 1;
//	   data[11].$$treeLevel = 1;
//	   data[20].$$treeLevel = 0;
//	   data[25].$$treeLevel = 1;
//	   data[50].$$treeLevel = 0;
//	   data[51].$$treeLevel = 0;
	   $scope.gridOptions.data = data;
	  });
	 
	  $scope.expandAll = function(){
	    $scope.gridApi.treeBase.expandAllRows();
	  };
	 
	  $scope.toggleRow = function( rowNum ){
	    $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
	  };
	 
	  $scope.toggleExpandNoChildren = function(){
	    $scope.gridOptions.showTreeExpandNoChildren = !$scope.gridOptions.showTreeExpandNoChildren;
	    $scope.gridApi.grid.refresh();
	  };
	});

