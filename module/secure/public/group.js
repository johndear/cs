var adminApp = angular.module('adminApp');

adminApp.controller('groupCtrl', function($scope,$http, $aside, allGroups){

	$scope.bsTableControl = {
            options: {
            	url:'UserController/queryAll',
                //data: allGroups,
				rowStyle: function (row, index) {
			        return { classes: 'none' };
			    },
			    // toolbar: '#toolbar'
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
			        field: 'userName',
			        title: '用户名'
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

	$scope.allGroups = [{id:1,name:'班长',pId:0},
	                    {id:2,name:'组长',pId:1},
	                    {id:2,name:'普通会员',pId:1}];
	
});

