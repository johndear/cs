/* App Module */

'use strict';

var path='';

//客服状态 服务中/小休申请中/小休
var SERVING = "在线中";
var LEAVING = "小休申请中";
var LEFT = "小休中";
var OFFING = "离线申请中";
var OFF = "已离线";
var STOP_ALLOCATION = "停止进单";
var CS_STATUS = SERVING;

var timeOut25 = 2500;
var timeOut50 = 5000;
var timeOut100 = 10000;

var chatApp = angular.module('chatApp',
    ['irontec.simpleChat', 'uc.chatExpression', 'uc.biggerPic', 'ngResource', 'angularBootstrapNavTree', 'angular-bootbox','mgcrea.ngStrap', 'pagination']);

/**
 * bootbox 提示框组件，设置默认语言为中文
 */
chatApp.config(function ($bootboxProvider) {
    $bootboxProvider.setDefaults({ locale: "zh_CN" });
}).config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        animation: 'am-flip-x'
    });
}).config(function($popoverProvider) {
    angular.extend($popoverProvider.defaults, {
        animation: 'am-flip-x',
        trigger: 'hover'
    });
})
/**
 * close divs
 */
chatApp.factory('closeDivFactory',function(){
    var exp={show:false};
    var pic={show:false};

    var closeDiv=function(){
        exp.show=false;
        pic.show=false;
    }
    return {
        exp:exp,
        pic:pic,
        closeDiv:closeDiv
    }
}).factory('csInfoFactory', function($http){

    var csInfoData={};
    return{
        getCsInfo : function() {
            return $http({
                url: 'CsController/getCsInfo',
                method: 'GET'
            })
        },
        getCsInfoData:function(){
            return csInfoData;
        },
        setCsInfoData:function(data){
            csInfoData=csInfoData;
        },
        getSkillGroups:function(){
            return $http({
                url: '../admin/ScheduleController/loadEnablePreferably',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }
});
/**
 * 创建一个directive，执行未回复计时
 */
chatApp.directive('replyTime', function ($timeout) {
    return {
        restrict: 'A',
        template: "<div ng-bind='timer.time_str'></div>",
        scope: {
            timer: '='
        },
        link : function(scope){

            /**
             * 初始化计时
             * @type {number}
             */
            scope.timer.count = 0;
            var timeout = "";
            scope.timer.timedCount = function () {
                scope.timer.count = scope.timer.count + 1;
                var min = Math.floor(scope.timer.count / 60);
                var sec = scope.timer.count % 60;
                scope.timer.time_str = min + ":" + sec;
                timeout = $timeout(scope.timer.timedCount, 1000);
            };
            scope.timer.timedCount();

            /**
             * 销毁计时
             */
            scope.timer.clearTime = function () {
                scope.timer.count = 0;
                scope.timer.time_str = '';
                try {
                    $timeout.cancel(timeout);
                } catch (e) {
                    console.log("exception: clear timer for user msg",e);
                }
            }

        }
    };
});

chatApp.config(function($sceProvider){
    $sceProvider.enabled(false);
});

chatApp.constant("chatEnum",{
	Dept:{
		jym:2,
		sum:1
	}
});
//格式化日期
var formatDate= function(date){

    var year=date.getFullYear();

    var month=date.getMonth()+1;

    var day=date.getDate()+'';

    var hour=date.getHours();

    var min=date.getMinutes();

    var second=date.getSeconds();

    if(month<10){
        month='0'+month;
    }
    if(day<10){
        day='0'+day;
    }
    if(hour<10){
        hour='0'+hour;
    }
    if(min<10){
        min='0'+min;
    }
    if(second<10){
        second='0'+second;
    }
    return year+"-"+month+"-"+day+" "+hour+":"+min+":"+second;
}

var urlify=function (text) {

    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
    });
}
/**
 * 阻止冒泡
 * @param e
 */
var stopPropagation=function (e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
};


//窗口缩放的时候聊天窗口大小的改变
window.onresize=function(){
    setTimeout(function(){
        $(".msg-container-base").height(100);
        $(".msg-container-base").height(document.body.scrollHeight-257-45);
        $(".feedback").height(document.body.scrollHeight-460);
        },50);
    
};

/**
 * 监听浏览器刷新和关闭事件，并提示
 */
function checkLeave(){
    event.returnValue = "确定要退出U客服平台吗？退出后部分信息可能会丢失！";
}

/**
 * 显示遮罩
 */
var showShade = function(){
    var bh = angular.element("html").height();
    var bw = angular.element("html").width();
    angular.element(".shade").css({
        height: bh,
        width: bw,
        display: "block"
    });
}

/**
 * 空判断
 */
function isNull(val){
    if('' == val || undefined == val){
        return true;
    }else{
        return false;
    }
}

/**
 * 显示提示
 */
function msgPop(val, time){
    angular.element("#tips")[0].innerText = val;
    angular.element("#tips").css({display:"block"});
    setTimeout("angular.element('#tips').css('display','none')", time);
}

