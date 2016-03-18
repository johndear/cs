/**
 * 功能描述：客服在线状态更新器
 * <p> 版权所有：优视科技 </p>
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
 *
 * @author <a href="mailto:zhangxf3@ucweb.com">张晓凡</a>
 * @version 1.0.0
 * create on: 2015-06-11
 */
'use strict';

chatApp.factory('onlineChecker', function ($http,$interval) {

    var timer = null;
    var successCallback = null;
    var errorCallback = null;

    /**
     * 开启在线轮询检查，用于工作台初始化、申请上班成功操作
     */
    function start(successCb, errorCb) {
        successCallback = successCb;
        errorCallback = errorCb;
        if (!timer) {
            timer = $interval(ping, interval * 1000);
        }
    };
    /**
     * 关闭在线轮询检查，用于申请小休成功，申请离线成功操作
     */
    function reset() {
        if (timer) {
            //clearInterval(timer);
            $interval.cancel(timer);
//            delete timer;
            timer = null;
        }
    };

    function ping() {
        $http.get('/csos/cs/service/ping/' + servicerId + '?statusText=' + CS_STATUS).then(successCallback, errorCallback);
    };

    return {
        start: start,
        reset: reset
    }
});
