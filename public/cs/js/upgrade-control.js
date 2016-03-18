/**
 * Created by hongjm on 2015/5/26.
 */
'use strict';
chatApp.controller('upgradeCtrl', function ($scope, $http, UCsResource,CswsResource, bootbox,$modal) {

    /**
     * 获取聊天记录
     */
    var chatRecord = '';
    var chatRecordUser = '';
    $scope.jymServicerList =  jymServicerList.split(',');
    $scope.orderData= {
    		jymOrderNumber: "",
    		jymProvider: ""
        };
    /**
     * 表单校验
     * type：0-归档、1-升级
     */
    function validateForm(type){
        var count = 0;
        // 业务分类非空校验
        if(isNull($scope.problemType)){
            $scope.ptCss = $scope.user.dialogId;
            count++;
        }else{
            $scope.ptCss = "";
        }
        // 问题分类非空校验
        if(isNull($scope.problemCategory) || isNull($scope.problemCateId)){
            $scope.pcCss = $scope.user.dialogId;
            count++;
        }else{
            $scope.pcCss = "";
        }
        //交易猫订单号和服务商非空验证，先判断交易猫相关的层是否显示
        if($('#jymDiv').is(":visible")){
        	if(isNull($scope.orderData.jymOrderNumber)){
        		$scope.jymOrderCss = $scope.user.dialogId;
        		count++;
        	}
        	else{
        		$scope.jymOrderCss = "";
        	}
        }
        
        if($('#jymDiv').is(":visible")){
        	if(isNull($scope.orderData.jymProvider)){
        		$scope.jymProviderCss = $scope.user.dialogId;
        		count++;
        	}
        	else{
        		$scope.jymProviderCss = "";
        	}
        }
        
        // 若是升级
        if(1 == type){
            // 问题描述不能为空
            if(isNull($scope.problemDescription)){
                $scope.pdCss = $scope.user.dialogId;
                count++;
            }else{
                $scope.pdCss = "";
            }

        }else{
            $scope.pdCss = "";

        }

        if(count == 0)
            return true;
        else
            return false;
    }

    /**
     * 表单提示
     * @param type 0-归档 1-升级
     * @param index 所选会话在全队列中（包括在线和离线）的下标
     */
    $scope.doSubmit = function(index, type,user) {
        if(!validateForm(type)){
            return false;
        }
        // 归档/升级
        bootbox.dialog({
            message: (0 == type) ? '确认归档吗?' : '确认升级吗?',
            onEscape: function() {},
            buttons: {
                cancel: {
                    label: '取消',
                    callback: function() {
                    }
                },
                success: {
                    label: '继续归档升级',
                    className: "btn-success",
                    callback: function() {
                    	if(user.prdType == 'feedback_sys'){
                    		feedbackUpgrade();
                    	}else{
                    		upgrade(type, index, false);
                    	}
                        
                    }
                },
                "Danger!": {
                    label: '确认并关闭',
                    className: "btn-danger",
                    callback: function() {
                    	if(user.prdType == 'feedback_sys'){
                    		feedbackUpgrade();
                    	}else{
                    		upgrade(type, index, true);
                    	}
                    }
                }

            }
        });

    };
    
    var feedbackUpgrade=function(){
    	var feedbackUpgradeParam = {
                "instanceName":  $scope.user.instanceName,
                "feedbackId": $scope.user.feedbackId
    	};
    	var params = $.param(feedbackUpgradeParam);
    	$http({
            method: 'POST',
            url: path + '/feedback/archiveOrUpgrade',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params
        }).success(
    		function (resp){
    			msgPop('操作成功!', timeOut25);
        		$scope.removeFeedback($scope.user.dialogId);
            }
        );
    }


    var doUpgrade=function(type, index, isClose){

        var updateWorkParam = {
        	"jymOrderNumber": $scope.orderData.jymOrderNumber ? $scope.orderData.jymOrderNumber : '',
            "jymProvider": $scope.orderData.jymProvider ? $scope.orderData.jymProvider : '',
            "userId": $scope.user.userId,
            "deptId": $scope.csInfo.deptId ? $scope.csInfo.deptId : 1,
            "problemType":  $scope.problemType ? $scope.problemType : '',
            "problemCategory": $scope.problemCateId ? $scope.problemCateId : '',
            "chatRecord": chatRecord,
            "chatRecordUser": chatRecordUser,
            "problemDescription": $scope.problemDescription ? $scope.problemDescription : ''};

        // 重置聊天记录（全局变量）
        chatRecord = "";
        chatRecordUser = "";
        // 0-归档/ 1-升级
        if(0 == type){
            updateWorkParam.firstOperateType = "ARCHIVE";
            updateWorkParam.orderStatus = "ARCHIVED";
        }else{
            updateWorkParam.firstOperateType = "UPGRADE";
            updateWorkParam.orderStatus = "WAIT_CLAIM";

        }
        if($scope.csInfo.deptId == $scope.Dept.jym){
        	updateWorkParam.feedbackChannel = "JYM_ON_LINE";
        }else{
        	updateWorkParam.feedbackChannel = "ON_LINE";
        }        
        updateWorkParam.businessType = "ON_LINE";
        updateWorkParam.sid = $scope.user.dialogId; // 会话id
        updateWorkParam.userId = $scope.user.userId; // 用户id
        updateWorkParam.servicerName = userName; // 客服名称
        updateWorkParam.phonePlantFormId = $scope.user.phonePlantFormId; // 手机平台
        updateWorkParam.isCsos = 'true'; // 来自CSOS
        updateWorkParam.problemCategoryDesc = $scope.problemCategory     //问题分类描述

        var params = $.param(updateWorkParam);
        $http({
            method: 'POST',
            url: 'updateWorkOrder',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params
        }).success(
            function (resp){
                if(resp){
                    if(resp.success){
                        msgPop('操作成功!', timeOut25);
                        // 若关闭会话，全队列会离线队列，都要清除
                        if(isClose){
                            $scope.removeUser($scope.user.dialogId );
                            var allUserSize = $scope.userList.length;
                            // 关闭会话时，判断是否已经是停止进单了，若是要恢复进单，状态必须是【停止进单】
                            if($scope.isStop && allUserSize < csNotifyNumber && STOP_ALLOCATION == CS_STATUS){
                                $scope.changeStatus('START_ALLOCATION');
                            }

                        }else{
                            // 继续归档/升级，清掉问题分类与问题描述
                            $scope.problemCateId = '';
                            $scope.problemCategory = '';
                            $scope.problemDescription = '';
                            $scope.orderData.jymOrderNumber = '';
                            $scope.orderData.jymProvider = '';
                        }
                    }else{
                        msgPop('操作失败!', timeOut25);
                    }
                }
            }
        );

        //// resource请求
        //UCsResource.upgrade(params).$promise.then(function (resp) {
        //    //hideShade();
        //    if(resp){
        //        if(resp.success){
        //            msgPop('操作成功!', timeOut25);
        //            // 若关闭会话，全队列会离线队列，都要清除
        //            if(isClose){
        //                // 从offlineList中去掉
        //                for (var i = 0; i < $scope.offlineList.length; i++) {
        //                    if ($scope.user && $scope.user.dialogId == $scope.offlineList[i].dialogId) {
        //                        $scope.offlineList.splice(i, 1);
        //                        break;
        //                    }
        //                }
        //
        //                for (var i = 0; i < $scope.allUserList.length; i++) {
        //                    if ($scope.user && $scope.user.dialogId == $scope.allUserList[i].dialogId) {
        //                        $scope.allUserList.splice(i, 1);
        //                        break;
        //                    }
        //                }
        //                // 关闭会话时，判断是否已经是停止进单了，若是要恢复进单，状态必须是【停止进单】
        //                if($scope.isStop && $scope.allUserList.length < csNotifyNumber && STOP_ALLOCATION == CS_STATUS){
        //                    $scope.changeStatus('START_ALLOCATION');
        //                }
        //                // 监控所有会话都已升级/归档完，且已申请离线，即可离线
        //                if ($scope.allUserList && $scope.allUserList.length <= 0) {
        //                    $scope.offlineCs();
        //                }
        //            }else{
        //                // 继续归档/升级，清掉问题分类与问题描述
        //                $scope.problemCateId = '';
        //                $scope.problemCategory = '';
        //                $scope.problemDescription = '';
        //            }
        //        }else{
        //            msgPop('操作失败!', timeOut25);
        //        }
        //    }
        //
        //});

    }

    /**
     * 执行归档/升级
     * @param type 0-归档 1-升级
     * @param index 所选会话在全队列中（包括在线和离线）的下标
     * @param isClose 是否关闭会话
     */
    function upgrade(type, index, isClose){

        $http({
            method: 'GET',
            url: path + '/dialog/api/current/history',
            params: {'dialogId': $scope.user.dialogId}
        }).success(function(data) {
            if(data && data.contents){
                var contents = data.contents;
                for(var i=0; i<contents.length; i++){
                    var record = contents[i];
                    var role = '';
                    if('user' == record.role) {
                        role = '【用户】 -';
                        // 聊天记录-用户部分，用于意见反馈自动化分析，只要talk的部分
                        if('talk' == record.type){
                            chatRecordUser += record.content + '/';
                        }
                    } else if('kf' == record.role) {
                        role = '【客服】 -';
                    }

                    var recordStr = role + record.username + '    (' + record.time + ')<br>';
                    // 聊天内容格式拼接，face-表情、pic-图片、其他（talk/tips）
                    var contentStr = '';
                    var content = (null != record.content) ? record.content.replace('\n', '') : '';
                    if('face' == record.type){
                        contentStr = "<img src='"+csosUrlPrefix+"public/images/face/" + content + "' style='max-width: 200px; max-height: 200px;'>";
                    }else if('pic' == record.type){
                        contentStr = "<img src= '" + content + "' width='310px' style='max-width: 200px; max-height: 200px;'><br><a target='_blank' href='" + content + "'>查看大图</a>";
                    }else{
                        contentStr = record.content;
                    }

                    recordStr += contentStr + '<br><br>';
                    chatRecord += recordStr;
                }
            }
            doUpgrade(type, index, isClose);
        });

    }

    //*--------------------------------- 监控表单输入项的变化begin  ---------------------------------
    $scope.disUpgTemp=true;
    $scope.proDescTemplates={};
    $scope.problemDescription="";
    var getProblemDescTemplate = function(path){
        CswsResource.getProblemDescTemplate(path).success(function(data){
            //  表单信息
            if(data.success && data.problemDescTemplates != null && data.problemDescTemplates.length > 0){
                $scope.proDescTemplates = data.problemDescTemplates;
                $scope.disUpgTemp = false;

            }else{
                $scope.disUpgTemp = true;
            }
        });
    };


    $scope.$watch('problemCategory', function(val){
        if(!isNull(val)){
            $scope.pcCss = "";
        }
    });
    $scope.$watch('problemType', function(val){
        if(!isNull(val)){
            $scope.ptCss = "";
        }
    });
    $scope.$watch('problemDescription', function(val){
        if(!isNull(val)){
            $scope.pdCss = "";
        }
    });
    
    $scope.$watch('orderData.jymOrderNumber', function(val){
        if(!isNull(val)){
            $scope.jymOrderCss = "";
        }
    });
    
    $scope.$watch('orderData.jymProvider', function(val){
        if(!isNull(val)){
            $scope.jymProviderCss = "";
        }
    });
    

    //*--------------------------------- 监控表单输入项的变化end  ---------------------------------

    //*--------------------------------- 问题分类树 begin  ---------------------------------

    var tree;
    $scope.my_tree = tree = {};
    $scope.my_data=[];

    $scope.my_tree_handler = function(branch) {
        $scope.problemCategory = tree.getFullPath(branch);
        $scope.problemCateId = branch.id;
        tree.showTree(false);
        if(null != branch.id && 0 < branch.id)
            getProblemDescTemplate(branch.id);
        //$scope.problemDescription="";
    };
    $scope.$watch('problemCategory', function(keyword){
        tree.searchTree(keyword);
    });

    $scope.key_select=function(e){
        if(e.keyCode == 40 || e.keyCode==38 || e.keyCode==13){
            tree.key_select(e);
        }
    };


    var problemDescTemplateModal = $modal({
        scope: $scope,
        templateUrl: '/csos/public/cs/modal/problemDescTemplateModal.html',
        title: '问题模版',
        content: 'content',
        show:false,
        controllerAs:'upgradeCtrl'
    });

    $scope.chooseTemplates=function(content){
        $scope.problemDescription = $scope.problemDescription+"\n"+content;
        problemDescTemplateModal.hide();
    };


    $scope.showProblemDescTemplateModal = function ($event) {
        if (null != $scope.proDescTemplates && $scope.proDescTemplates.length > 0) {
            if(1 == $scope.proDescTemplates.length){
                $scope.problemDescription = $scope.problemDescription+"\n"+$scope.proDescTemplates[0].content;
            }else{
                problemDescTemplateModal.$promise.then(problemDescTemplateModal.show);
            }
        }
    };

    //*********************** 监控表单输入项的变化begin  ********************************
    $scope.$watch('problemType', function(val){
        if(!isNull(val)){
            angular.element("#ptRadio").removeClass('has-error');
        }
    });

    //var oringinData = angular.copy($scope.problemCateTreeObj);
    /**
     * 问题分类树初始化完毕之后，加载数据进去，【problemCateTreeObj】 是在msg-control.js中请求的，页面初始化时请求一次即可
     */
    $scope.show_tree= function(){
        tree.showTree(true);
        $scope.my_tree.setTreeData($scope.problemCateTreeObj);
    }

    /**
     * 问题分类树框，防止冒泡弹出
     */
    angular.element(document).on('click.yunkefu', function(){
        $scope.treeCss = $scope.user.dialogId;
    });

    angular.element(document).on('click.yunkefu', '#problemCategory, #abnTree', function(e){
        e.stopPropagation();
        $scope.treeCss = "";
    });

    //*--------------------------------- 问题分类树 end  ---------------------------------

});