/**
 * Created by suff on 2015/10/22.
 */

chatApp.controller('serviceRecordController',
				function($scope, $http, $aside, $modal, bootbox) {
    $scope.serviceRecordPaginationConf = {
        currentPage: 1,
        itemsPerPage: 5,
        perPageOptions:[5, 10, 15, 20, 30]
    };
    //查询条件
    var searchParam = {
		fromDate : '',
		toDate : '',
		inputOrderAuthor : '',
		phone : '',
		uid : '',
		gcmallOrderNo : '',
		sn : '',
		account : ''
	};
    var setParam = function(fromDate,toDate,uid,account,sn,inputOrderAuthor,phone,gcmallOrderNo){
    	searchParam.fromDate = fromDate;
    	searchParam.toDate = toDate;
    	searchParam.uid = uid;
    	searchParam.account = account;
    	searchParam.sn = sn;
    	searchParam.inputOrderAuthor = inputOrderAuthor;
    	searchParam.phone = phone;
    	searchParam.gcmallOrderNo = gcmallOrderNo;
    };
	
	function addDates(date,days){
	   var d = new Date(date); 
       d.setDate(d.getDate() + days); 
       return d; 
   }

	var showMsg = function(msg){
		bootbox.dialog({
	      message: msg,
	      onEscape: function() {},
	      buttons: {
	          cancel: {
	              label: '确认',
	              callback: function() {
	              }
	          }
	      }
	  });
    }
    
    $scope.orderSearchData= {
    		orderNo: ""
        };
    
    /**
     * 交易猫用户登录，再加载一次服务记录查询
     */
    $scope.$on('login.type', function(event,data) {
    	if($('#servicer_li_'+data).hasClass('active')){
	    	$scope.fromDate = new Date();
	    	$scope.changeFromDate();
	    	$scope.uid = $scope.user.userId;
	    	if($scope.user.baseInfo && $scope.user.baseInfo.sn)
	    		$scope.sn = $scope.user.baseInfo.sn;
    		$scope.query();
    	}
	});

    /**
     * 初始化查询条件
     */
    $scope.initQuery = function(dialogId){
    	if(!$('#servicer_li_'+dialogId).hasClass('active')){
	    	$scope.fromDate = new Date();
	    	$scope.changeFromDate();
	    	$scope.uid = $scope.user.userId;
	    	if($scope.user.baseInfo && $scope.user.baseInfo.sn)
	    		$scope.sn = $scope.user.baseInfo.sn;
    		$scope.query();
    	}
    }
    
    // query click
    $scope.query = function() {
    	var sn = '';
		if($scope.user.baseInfo && $scope.user.baseInfo.sn){
			sn = $scope.user.baseInfo.sn;
		}
		setParam(new Date(), addDates(
				new Date(), 7),
				$scope.user.userId,
				$scope.user.baseInfo.account,
				sn, '', '', '');
        queryByPage();
    }
    
    $scope.queryByCondition = function(){
    	
    	if(!$scope.fromDate || !$scope.toDate){
    		showMsg('【提单开始时间/结束时间】不能为空');
    		return;
    	}
    	if(!$scope.uid && !$scope.inputOrderAuthor && !$scope.phone && !$scope.gcmallOrderNo){
    		showMsg('【提单人、来电号码、用户ID、订单号】不能全部为空');
    		return;
    	}
    	
    	   	
    	setParam($scope.fromDate, $scope.toDate,
			$scope.uid, '','',
			$scope.inputOrderAuthor, $scope.phone,
			$scope.gcmallOrderNo);
        queryByPage();
    }
    
    //查询最近一笔订单的订单号
    $scope.lastOrderQuery =  function() {
 	   var postData = {
 			   //uid: "1403501574274042",
 			  uid: $scope.user.userId
 	   }
 	   $http({
 		   method: 'POST',
 		   url: 'searchOrderRecord',
 		   headers: {
 			   'Content-Type': 'application/json'
 		   },
 		   params:postData
 	   }).success(function(result) { 	
 		  if(result && result.status==20000000 && result.data.success){
 			 $scope.orderSearchData = result.data;
		   }		  
 	   }).error(function(result){
 		   msgPop('连接超时,请稍后重试！', timeOut50);
 	   });
    }  
    function format(secondsTime)
    {
	    //secondsTime是整数，否则要parseInt转换
	    var time = new Date(secondsTime);
	    var y = time.getFullYear();
	    var m = time.getMonth()+1;
	    var d = time.getDate();
	    var h = time.getHours();
	    var mm = time.getMinutes();
	    var s = time.getSeconds();
	    return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
    }
    //查询订单
   $scope.orderQuery =  function() {
	   if(isNull($scope.orderSearchData.orderNo)){
		   msgPop('请输入订单号再查询！', timeOut50);
		   return false;
	   }
	   var postData = {
			   orderNo: $scope.orderSearchData.orderNo
	   }
	   $http({
		   method: 'POST',
		   url: 'searchOrderRecord',
		   headers: {
			   'Content-Type': 'application/json'
		   },
		   params:postData
	   }).success(function(result) {
		   if(result && result.status==20000000){
			   $scope.orderQueryResult = result.data;
			   if(result.data.cTime){
				   $scope.orderQueryResult.cTime = format(result.data.cTime * 1000);
			   }
			   if(result.data.PayTime){
				   $scope.orderQueryResult.PayTime = format(result.data.PayTime * 1000);
			   }
			   if(result.data.deliverTime){
				   $scope.orderQueryResult.deliverTime = format(result.data.deliverTime * 1000);
			   }
			   
		   }else if(result && result.status==50000001){
			   msgPop('未授权应用！', timeOut50);
		   }else if(result && result.status==50000002){
			   msgPop('签名错误！', timeOut50);
		   }else if(result && result.status==50000003){
			   msgPop('请求参数不合法！', timeOut50);
		   }else if(result && result.status==50000004){
			   msgPop('请求不在白名单中！', timeOut50);
		   }else if(result && result.status==50000008){
			  msgPop('查询订单失败，请稍后重试！', timeOut50);
		   }else{
			   msgPop('数据库无此订单信息！', timeOut50);
		  }
	   }).error(function(result){
		   msgPop('连接超时,请稍后重试！', timeOut50);
	   });
   }  
   //催发货
   $scope.urgeDeliver = function() {
	   var postData = {
			   orderNo: $scope.orderSearchData.orderNo
	   }
	   $http({
		   method: 'POST',
		   url: 'urgeDeliver',
		   headers: {
			   'Content-Type': 'application/json'
		   },
		   params:postData
	   }).success(function(result) {
		   if(result && result.status==20000000){
			   if(result.data.success){
				   msgPop('催发货成功！', timeOut50);
			   }else{
				   //先判断接口是否返回催单失败的原因，如果有，则现在返回的原因，如果无，则显示“催单失败，接口返回异常”
				   if(!result.data.reason){
					   msgPop('催单失败，接口返回异常！', timeOut50);
				   }else{
					   msgPop(result.data.reason, timeOut50);
				   }
			   }	
		  }else if(result && result.status==50000001){
			   msgPop('未授权应用！', timeOut50);
		   }else if(result && result.status==50000002){
			   msgPop('签名错误！', timeOut50);
		   }else if(result && result.status==50000003){
			   msgPop('请求参数不合法！', timeOut50);
		   }else if(result && result.status==50000004){
			   msgPop('请求不在白名单中！', timeOut50);
		   }else if(result && result.status==50000008){
			   msgPop('未知错误！', timeOut50);
		   }else {
			  msgPop('催发货失败，请稍后重试！', timeOut50);
		  }
	   }).error(function(result){
		   msgPop('连接超时,请稍后重试！', timeOut50);
	   });
   }
   //核对状态
   $scope.checkStatus = function() {
	   var postData = {
			   orderNo: $scope.orderSearchData.orderNo
	   }
	   $http({
		   method: 'POST',
		   url: 'checkStatus',
		   headers: {
			   'Content-Type': 'application/json'
		   },
		   params:postData
	   }).success(function(result) {
		   if(result && result.status==20000000 && result.data.success){
				  msgPop('核对状态成功！', timeOut50);
		   }else if(result && result.status==50000001){
			   msgPop('未授权应用！', timeOut50);
		   }else if(result && result.status==50000002){
			   msgPop('签名错误！', timeOut50);
		   }else if(result && result.status==50000003){
			   msgPop('请求参数不合法！', timeOut50);
		   }else if(result && result.status==50000004){
			   msgPop('请求不在白名单中！', timeOut50);
		   }else{
				  msgPop('核对状态失败，请稍后重试！', timeOut50);
		   }
	   }).error(function(result){
		   msgPop('连接超时,请稍后重试！', timeOut50);
	   });
   }
   //重新发起转账
   $scope.reTransfer = function() {
	   var postData = {
			   orderNo: $scope.orderSearchData.orderNo
	   }
	   $http({
		   method: 'POST',
		   url: 'reTransfer',
		   headers: {
			   'Content-Type': 'application/json'
		   },
		   params:postData
	   }).success(function(result) {
		   if(result && result.status==20000000 && result.data.success){
				  msgPop('重新发起转账成功！', timeOut50);
		   }else if(result && result.status==50000001){
			   msgPop('未授权应用！', timeOut50);
		   }else if(result && result.status==50000002){
			   msgPop('签名错误！', timeOut50);
		   }else if(result && result.status==50000003){
			   msgPop('请求参数不合法！', timeOut50);
		   }else if(result && result.status==50000004){
			   msgPop('请求不在白名单中！', timeOut50);
		   }else{
				  msgPop('重新发起转账失败，请稍后重试！', timeOut50);
		   }
	   }).error(function(result){
		   msgPop('连接超时,请稍后重试！', timeOut50);
	   });
   }
   
   $scope.changeFromDate = function(){
	   if($scope.fromDate){
		   $scope.toDate = addDates($scope.fromDate,7);
		   $scope.maxToDate = addDates($scope.fromDate,7);
	   }
   }
   
    var initPage = $scope.serviceRecordPaginationConf.currentPage + $scope.serviceRecordPaginationConf.itemsPerPage;
    function queryByPage(pageCount){
        console.log($scope.user);
        
        if($scope.pageFlag){
            var postData = {
                page: $scope.serviceRecordPaginationConf.currentPage,
                pageSize: $scope.serviceRecordPaginationConf.itemsPerPage,
                'searchParam.fromDate':searchParam.fromDate,
                'searchParam.toDate':searchParam.toDate,
                'searchParam.inputOrderAuthor':searchParam.inputOrderAuthor,
                'searchParam.phone':searchParam.phone,
                'searchParam.uid':searchParam.uid,
                'searchParam.account':searchParam.account,
                'searchParam.uid':searchParam.uid,
                'searchParam.gcmallOrderNo':searchParam.gcmallOrderNo,
                'searchParam.sn' : searchParam.sn
            };

            $http({
                method: 'POST',
                url: 'searchServiceRecord',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: postData
            }).success(function(response) {
                $scope.serviceRecordPaginationConf.totalItems = response.result.total;
                $scope.serviceRecords = response.result.data;
            });
        }

        if(initPage == pageCount){
            $scope.pageFlag = true; // 初始化时，避免重复请求
        }
    }

    $scope.$watch('serviceRecordPaginationConf.currentPage + serviceRecordPaginationConf.itemsPerPage', queryByPage);

    $scope.showOrderDetail=function(serviceRecord){
        $scope.detailProblem = serviceRecord.orderId + "," + serviceRecord.telId;
        var postData = {
            orderId: serviceRecord.orderId,
            telId: serviceRecord.telId
        }

        $http({
            method: 'POST',
            url: 'searchDetail',
            headers: {
                'Content-Type': 'application/json'
            },
            params: postData
        }).success(function(response) {
            //$scope.detailProblem = response.detailProblem;
            //$scope.chatRecord = response.chatRecord;
            //$scope.orderId = serviceRecord.orderId;
            $("#newTab_detailProblem").val(response.detailProblem);
            $("#newTab_chatRecord").val(response.chatRecord);
            $("#newTab_orderId").val(serviceRecord.orderId);
            
            console.log("newTab_detailProblem: " + $("#newTab_detailProblem").val());
            console.log("newTab_chatRecord: " + $("#newTab_chatRecord").val());
            console.log("newTab_orderId: " + $("#newTab_orderId").val());
            window.open("/csos/public/cs/modal/serviceRecord.html", "工单"+ serviceRecord.orderId + "详情");
        });

        //var myAside = $aside(
        //    {
        //        scope: $scope,
        //        title: '工单'+ serviceRecord.orderId +'详情',
        //        templateUrl: '/csos/public/cs/modal/serviceRecord.html',
        //        placement:'right'
        //    });
        //
        //myAside.$promise.then(function() {
        //    myAside.show();
        //})
    }
    
    /**
     * 操作：REMINDER("催单", 1),ADDITION_QUESTION("追加信息", 17)
     */
    $scope.operation = function(type,orderId){
    	$scope.type = type;
    	$scope.orderId = orderId;
    	if(type && orderId){
    		if(type === 1){
        		$scope.title = '催单';
        		$scope.msg = '输入催单原因';
        	}else if(type === 17){
        		$scope.title = '追加信息';
        		$scope.msg = '输入追加信息';
        	}
        	showModal();
    	}else{
    		msgPop('请求参数【操作类型/工单编号】为空', timeOut50);
    	}
    }
    
    /**
     * 催单，追加信息模态框
     */
    var myModal = $modal({
        scope: $scope,
        templateUrl: '/csos/public/cs/modal/operation.html',
        title: $scope.title,
        content: 'content',
        show:false,
        controllerAs:'serviceRecordController'
    });


    var showModal = function () {
        myModal.$promise.then(myModal.show);
    };
    
    /**
     * 催单
     */
    $scope.reminding = function(orderId,reason){
    	if(orderId && reason){
    		$http({
                method: 'POST',
                url: 'reminder',
                headers: {'Content-Type': 'application/json'},
                params: {orderIds:orderId,reason:reason}
            }).success(function(response) {
        		if(response.success){
                	//msgPop('催单成功！', timeOut50);
                	showMsg('催单成功！');
                	myModal.$promise.then(myModal.hide);
                }else{
//                    	msgPop(response.msg, timeOut50);
                	showMsg(response.msg);
                }
            });
    	}else{
    		showMsg('【催单原因/工单编号】为空');
    	}
    }

    /**
     * 追加信息
     */
    $scope.addInfo = function(orderId,content){
    	if(orderId && content){
    		$http({
                method: 'POST',
                url: 'addProblemDesc',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {orderId:orderId,content:content}
            }).success(function(response) {
                if(response.success){
//                	msgPop('追加信息成功！', timeOut50);
                	showMsg('追加信息成功！');
                	myModal.$promise.then(myModal.hide);
                }else{
//                	msgPop(response.msg, timeOut50);
                	showMsg(response.msg);
                }
            });
    	}else{
    		showMsg('【追加内容/工单编号】为空');
    	}
    }
})
