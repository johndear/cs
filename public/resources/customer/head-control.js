/**
 * Created by hongjm on 2015/5/26.
 */
'use strict';

chatApp.controller('headCtrl', function ($scope, bootbox, $http, csInfoFactory, onlineChecker, $filter) {

    $scope.status = SERVING;
    CS_STATUS = $scope.status;
    $scope.restText = '申请小休';
    $scope.offlineText = '申请离线';
    $scope.scheduleText = '班务小计';


    $scope.scheduleStatistic = {};

    $scope.getScheduleStatistic = function (dialogid, total, count) {
        console.log("$scope.scheduleStatistic", $scope.scheduleStatistic);
        $http({
            method: 'POST',
            url: path + '/cs/WorkBenchController/scheduleStatistic',
            params: {
                dialogId: dialogid,
                total: total,
                count: count
            }
        }).success(function (data) {
            var loginTime = $filter('date')(new Date(data.loginTime), 'HH:mm:ss');

            var onlineMin = Math.floor(data.onlineServiceTime / 60);
            var onlineSec = data.onlineServiceTime % 60;

            var restMin = Math.floor(data.restTime / 60);
            var restSec = data.restTime % 60;

            var offlineMin = Math.floor(data.offlineTime / 60);
            var offlineSec = data.offlineTime % 60;
            $scope.popover = {
                "content": "<div class='col-md-6' style='padding-bottom: 20px'>服务人数：" + data.serviceNum + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>平均响应时长(s)：" + data.avgRespTime + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>满意：" + data.goodEvalNum + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>服务时长：" + onlineMin + "分" + onlineSec + "秒</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>一般：" + data.generalEvalNum + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>小休时长：" + restMin + "分" + restSec + "秒</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>不满意：" + data.badEvalNum + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>异常离线时长：" + offlineMin + "分" + offlineSec + "秒</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>流转个数：" + data.forwardTimes + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>上线时间：" + loginTime + "</div>" +
                "<div class='col-md-6' style='padding-bottom: 20px'>工单处理量：" + data.dealOrderNum + "</div>"
            };

            console.log($scope.popover);
        });
    }

    //add by luoqb at 2015/09/15 for：增加取消小休申请
    $scope.cancelRestText = '取消小休';
    $scope.cancelRestHide = true;

    $scope.popover = {
        "content": "<div class='col-md-6' style='padding-bottom: 20px'>班务小计加载中……</div>" +
        "<div class='col-md-6' style='padding-bottom: 20px'>服务时长(min)：" + 0 + "</div>"
    };


    /**
     * 监听没有在线会话，即可小休、离线
     */
    $scope.$on("NO_ONLINE_CUSTOMER", function () {
        if ($scope.status == LEAVING) {
            successLeave();
        }

        if ($scope.status == OFFING) {
            successOff();
        }
    });

    /**
     * 客服状态变更广播
     */
    $scope.$on("CHANGE_STATUS", function () {
        $scope.status = CS_STATUS;
    });

    /**
     * 申请小休
     */
    $scope.rest = function () {
        if ($scope.restText == '申请小休') {
            bootbox.confirm({
                message: "确认申请小休吗？",
                callback: function (result) {
                    if (result) {
                        applyLeave();
                    } else {

                    }
                }
            })
        } else if ($scope.restText == '申请上班') {
            bootbox.confirm({
                message: "确认申请上班吗？",
                callback: function (result) {
                    if (result) {
                        applyOn();
                    } else {

                    }
                }
            })

        }
    }

    //add by luoqb at 2015/09/15 for：增加取消小休功能
    /**
     * 取消小休
     */
    $scope.cancelRest = function () {
        bootbox.confirm({
            message: "确认取消小休吗？",
            callback: function (result) {
                if (result) {
                    cancelRest();
                } else {

                }
            }
        })
    }

    /**
     * 申请离线
     */
    $scope.offline = function () {
//        if ($scope.csInfo && $scope.csInfo.userId) {
            bootbox.confirm({
                message: "确认申请离线吗？" + ($scope.csInfo.isSelfEmployed ? "" : "离线成功之后将不能再回到当前班次哦"),
                callback: function (result) {
                    if (result) {
                        applyOff();
                    } else {

                    }
                }
            });
//        } else {
//            csInfoFactory.getCsInfo().success(function (data) {
//                $scope.csInfo = data;
//                csInfoFactory.setCsInfoData(data);
//                bootbox.confirm({
//                    message: "确认申请离线吗？" + (data.isSelfEmployed ? "" : "离线成功之后将不能再回到当前班次哦"),
//                    callback: function (result) {
//                        if (result) {
//                            applyOff();
//                        } else {
//
//                        }
//                    }
//                });
//            });
//        }
    }

    /**
     * 小休申请
     */
    var applyLeave = function () {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': 'REST_APPLYING'};
        $http({
            method: 'POST',
            url: path + '/cs/CustomerController/applyRest',
            params: params
        }).success(function (data) {
            if (data.success) {
                if ($scope.onlineSize <= 0) {
                    successLeave();
                } else {
//                	msgPop('小休申请成功！', timeOut50);
                    bootbox.confirm({
                        message: data.message,
                        callback: function (result) {
                        }
                    });
                    $scope.status = LEAVING;
                    CS_STATUS = $scope.status;
                    $scope.disRest = true;
                    $scope.restText = '请将所有在线会话完成后离开…';
                    $scope.offHide = true;

                    //add by luoqb at 2015/09/15 for：增加取消小休申请
                    $scope.cancelRestHide = false;
                }
            } else {
//                alert(JSON.stringify(data));
                bootbox.confirm({
                    message: data.message,
                    callback: function (result) {
                        if (result) {
                            msgPop('小休申请失败,请检查是否有未结束会话', timeOut50);
                        }
                    }
                });
            }

        }).error(function (data) {
            bootbox.confirm({
                message: data.message,
                callback: function (result) {
                    msgPop('小休申请失败', timeOut50);
                }
            });
        });
    };

    //add by luoqb at 2015/09/15 for：增加取消小休功能
    /**
     * 取消小休
     */
    var cancelRest = function () {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': 'REST_CANCEL'};
        $http({
            method: 'POST',
            url: path + '/cs/service/status/change',
            params: params
        }).success(function (data) {
            if (data.success) {
                $scope.status = SERVING;
                CS_STATUS = $scope.status;
                $scope.disRest = false;
                $scope.restText = '申请小休';
                $scope.offHide = false;
                $scope.cancelRestHide = true;
                msgPop('取消小休成功!', timeOut50);
            } else {
                alert(JSON.stringify(data));
                msgPop('取消小休失败', timeOut50);
            }

        }).error(function (data) {
            alert(JSON.stringify(data));
            msgPop('取消小休失败', timeOut50);
        });
    }

    /**
     * 小休成功
     */
    var successLeave = function () {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': 'REST'};
        $http({
            method: 'POST',
            url: path + '/cs/service/status/change',
            params: params
        }).success(function (data) {
            if (data.success) {
                $scope.offHide = true;
                $scope.disRest = false;
                $scope.cancelRestHide = true;
                $scope.restText = "申请上班";
                $scope.status = LEFT;
                CS_STATUS = $scope.status;
                msgPop('小休成功!', timeOut50);
            } else {
                alert(JSON.stringify(data));
                msgPop('小休失败', timeOut50);

            }

        }).error(function (data) {
            alert(JSON.stringify(data));
            msgPop('小休失败', timeOut50);
        });
    };

    /**
     * 离线申请
     */
    var applyOff = function () {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': 'OFFLINE_APPLYING'};
        $http({
            method: 'POST',
            url: path + '/cs/CustomerController/applyOffline',
            params: params
        }).success(function (data) {
            if (data.success) {
                if ($scope.allUserList && $scope.allUserList.length <= 0) {
                    successOff();
                } else {
                    $scope.status = OFFING;
                    CS_STATUS = $scope.status;
                    $scope.restHide = true;
                    $scope.disOffline = true;
                    $scope.cancelRestHide = true;
                    $scope.offlineText = '请将所有会话升级/归档完成后离开…';
                }
            } else {
                alert(JSON.stringify(data));
                msgPop('离线申请失败,请检查是否有未结束会话', timeOut50);
            }

        }).error(function (data, status, headers, config, statusText) {
            alert(JSON.stringify(data) + JSON.stringify(status) + JSON.stringify(statusText));
            msgPop('离线申请失败', timeOut50);
        });
    };

    /**
     * 离线成功
     */
    var successOff = function () {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': 'OFFLINE'};
        $http({
            method: 'POST',
            url: path + '/cs/service/status/change',
            params: params
        }).success(function (data) {
            if (data.success) {
                $scope.restHide = true;
                $scope.cancelRestHide = true;
                $scope.status = OFF;
                CS_STATUS = $scope.status;
                $scope.offHide = true;
//                showShade();
                bootbox.confirm({
                    message: data.message,
                    callback: function (result) {
                        if (result) {
                            msgPop('离线成功', timeOut50);
                        }
                    }
                });
            } else {
                alert(JSON.stringify(data));
                msgPop('离线失败', timeOut50);
            }

        }).error(function (data, status, headers, config, statusText) {
            alert(JSON.stringify(data) + JSON.stringify(status) + JSON.stringify(statusText));
            msgPop('离线失败', timeOut50);
        });
    };

    /**
     * 申请上班
     */
    var applyOn = function () {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': 'ONLINE'};
        $http({
            method: 'POST',
            url: path + '/cs/service/status/change',
            params: params
        }).success(function (data) {
            if (data.success) {
                $scope.status = SERVING;
                CS_STATUS = $scope.status;
                $scope.restText = '申请小休';
                $scope.offHide = false;
                $scope.cancelRestHide = true;
                bootbox.confirm({
                    message: data.message,
                    callback: function (result) {
                        if (result) {
                            msgPop('上班成功!', timeOut50);
                        }
                    }
                });
            } else {
                alert(JSON.stringify(data));
                msgPop('申请上班失败', timeOut50);
            }

        }).error(function (data, status, headers, config, statusText) {
            alert(JSON.stringify(data) + JSON.stringify(status) + JSON.stringify(statusText));
            msgPop('申请上班失败', timeOut50);
        });
    };

    var onlineCheckerSuccess=function (response) {
        var data=response.data;
        if (data.success) {
            if (data.message == OFFING) {
                $scope.status = OFFING;
                CS_STATUS = $scope.status;
                $scope.restHide = true;
                $scope.disOffline = true;
                $scope.cancelRestHide = true;
                $scope.offlineText = '请将所有会话升级/归档完成后离开…';
                msgPop('离线申请中!', timeOut50);
            } else if (data.message == OFF) {
                $scope.restHide = true;
                $scope.cancelRestHide = true;
                $scope.status = OFF;
                CS_STATUS = $scope.status;
                $scope.offHide = true;
                $scope.clearAllActiveUser();
//                 showShade();
                msgPop('离线成功!', timeOut50);
            }
        }else if(data && data.message){
        	msgPop(data.message, timeOut100);
        }
    };

    var onlineCheckerError=function () {
        //showShade();
        msgPop('登录异常!请刷新工作台', timeOut100);
    };

    /**
     * 心跳轮询
     */
    onlineChecker.start(onlineCheckerSuccess,onlineCheckerError);

});
