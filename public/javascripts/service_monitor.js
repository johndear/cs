/**
 * 功能描述：客服页面对话监视器
 * <p> 版权所有：优视科技 </p>
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
 *
 * @author <a href="mailto:zxf3qqcom">张晓凡</a>
 * @version 1.0.0
 * create on: 2015-05-28
 */

var reply_timeout = bench_monitor_time;//回复超时时间;

console.log("reply_timeout",reply_timeout);

var dialogMonitor = function (callback) {

    var monitors = {};
    var cb = callback ? callback : callbackError;
    /**
     * 回复监控器
     */
    var monitor = function(callback,dialog_id) {
        var timer = null;
        var dialogId = dialog_id;

        /**
         * 启动监控
         */
        function start() {
            if(!timer){
                timer = setTimeout(function () {
                    callback(dialogId);
                }, reply_timeout *60* 1000);
            }
        };
        /**
         * 重置监控
         */
        function reset() {
            if (timer) {
                clearTimeout(timer);
                delete timer;
                timer = null;
            }
        };


        function getDialogId() {
            return dialogId;
        }


        return {
            start: start,
            reset: reset,
            getDialogId: getDialogId
        }
    };

    /**
     * 回调函数异常提醒
     */
    function callbackError(){
        alert('please send your callback function into monitor when you new a monitor object!');
    }
    /**
     * 注册监控器
     * @param name
     */
    function registerMonitor(name){
        console.log("注册监听器之间给你看看所有的监听器(monitor service)",monitors);
        if(!monitors[name]){
            monitors[name] = monitor(cb,name);
            console.log("监听器注册成功(monitor service)！",name);
        }else{
            console.log("监听器已经注册了(monitor service)",name);
        }
    };
    /**
     * 根据名字获取监控器
     * @param name
     * @returns {*}
     */
    function getMonitor(name){
        var tmpMonitor = monitors[name];
        if(!tmpMonitor) {
            //alert('monitor which named ' + name + " is null!");
        }
        return tmpMonitor;
    }

    /**
     * 清除监控器
     * @param name
     */
    function clearMonitor(name){
        var monitor = monitors[name];
        if(!monitor){
            monitor.reset();
            delete monitor[name];
        }
    };

    return {
        getMonitor : getMonitor,
        registerMonitor : registerMonitor,
        clearMonitor : clearMonitor
    }
};

