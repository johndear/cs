/**
    * 功能描述：用户端界面交互相关
    * <p> 版权所有：优视科技 </p>
    * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
    *
    * @author <a href="mailto:zxf3qqcom">张晓凡</a>
    * @version 1.0.0
    * create on: 2015-05-21
    */
function serviceExecutor(){
    var replyInterval = window['reply_interval'];
    var maxReplyTime = window['max_reply_time'];
    if(!replyInterval) {
        replyInterval = 5;
    }
    if(!maxReplyTime) {
        maxReplyTime = 60;
    }
    var contents = []; //用于存储连接上客服之前用户发的话
    var maxCount = maxReplyTime / replyInterval; //因为5秒钟发起一次请求，一分钟失败，所以最大次数为12（应该根据用户id在服务器缓存中做操作？）
    var interval = replyInterval * 1000;//发起对话申请的时间间隔
    var restart = false; //是否是重新申请连接
    var running = false;//是否正在运行轮询申请
    var isNeed = true;//是否需要申请客服
    var inService = false;//客服是否正在服务中
    var dialogId = null;
    var userId = null;
    var userType = null;
    var userName = window['customer_username'];
    /**
     * 申请客服服务
     * @param url
     * @param userId
     * @param userType
     */
    function applyService(url, dialogId, userId, content){
        if(isNeed === true){
            $.ajax( {
                url : url,
                data : {
                    'dialogId' : dialogId,
                    'customerId' : userId,
                    'customerName' : userName,
                    'content' : content
                },
                type:'post',
                dataType:'json',
                success : function(data) {
                    if(false === data['success']){
                        if('ERROR' == data['type']){
                            chatroom.sendTimeTips();
                           chatroom.sendTips(data['extendMsg']);
                            //chatroom.sendTips(templateProp[data['extendMsg']]);
                        }else if('REFUSE' == data['type']){
                            chatroom.sendTimeTips();
                            chatroom.sendTips("亲，现在反馈的人太多了。为避免您长时间等待，建议您到 <a href='"+ window['feedback'] + "' target='_blank'>意见反馈</a> 反馈相关问题建议。");
                           // chatroom.sendTips(formatLink(templateProp['apply_failed'],"<a href='"+ window['feedback'] + "' target='_blank'>","</a>"));
                        }else{
                            setTimeout(function(){applyService(url, dialogId, userId, content)}, interval);
                        }
                    }else if(true === data['success']){
                        revalue(data);//对某些标识变量重新赋值
                        //插入js节点
                        loadJs(data);
                    }
                }
            });
        }
    };
    
    function loginFire(dialogId,userId,customerId){
		var eventMsg = JSON.stringify({type : 'login',dialogId : dialogId,receiverId:customerId});
        imHandler.fire(userId, IM_SERVICER_TYPE, dialogId, eventMsg);
	}
    
    /**
     * 加载Js脚本
     */
    function loadJs(data){
        var $imRoot = $("#imRoot").val();
        userId = $("#userId").val();
        userType = $("#userType").val();
        dialogId = $("#dialogId").val();
        var $sceneKey = $("#sceneKey").val();
        var $sign = $("#sign").val();
        var timestamp = $("#timestamp").val();
        var customerId = $("#customerId").val();
        $.ajax({
            url: $imRoot + '/longPolling.js?userId=' + userId + '&userType=' + userType + '&dialogId=' + dialogId + '&sceneKey=' + $sceneKey + '&timestamp=' + timestamp + '&sign=' + $sign,
            dataType: "script",
            cache: true
        }).done(function() {
        	try{
        		alert('123');
//        		imHandler.start();
                chatroom.sendTimeTips();
            	chatroom.sendTips(format(messages.connected, data['extendMsg']['nickName']));
                chatroom.sendTips(messages.evaluation);
                //建立连接后，交易猫用户如果已经登录，触发登录事件通知客服
                if (sys == jym && islogin) {
                	sendContentsForJymLogin(loginFire(dialogId,userId,customerId));
                }else{
                	sendContents();//发送未连接前用户说过的话
                }
        	}catch(e){
        		console.log(e.message);
        		monitorMaper['customer'].contactErrorDisconnect();
        		chatroom.sendTips('由于网络原因，您无法与客服建立连接，若还需要客服的服务，请<a href="javascript:void(0);" onclick="serviceExecutor.restartExecutor(this);" style="">刷新重连</a>或重新从帮助中心进入');
        		//chatroom.sendTips(formatLink(templateProp['timer_networkIssue'],"<a href='javascript:void(0);' onclick='serviceExecutor.restartExecutor(this);' style=''>","</a>"));
        	}
        });
    };
    /**
     * 初始化隐藏域内容
     */
    function initHidden(){
        dialogId = $("#dialogId").val();
        userId = $("#userId").val();
        userType = $("#userType").val();
    }

    /**
     * 重新赋值
     */
    function revalue(data){
        if(restart === true) {
            window.location.reload();
        }else{
            restart = false;//设置为非重新连接标识
            isNeed = false;//不需要申请了，已经获得客服分配
            monitorMaper['customer'].reConnect();//连线上客服，标识没有断线
            //将会话id插入页面
            var $dialogId = $("#dialogId");
            var $userId = $("#userId");
            var $serving = $("#serving");
            dialogId = data['dialogId'];
            userId = data['receiverId'];
            $dialogId.val(dialogId);
            $userId.val(userId);
            $serving.val("true");
        }
    };
    /**
     * 发送连接前用户发过的话
     */
    function sendContents(){
    	//TODO 修改为从第二句话开始
        for(var i = 1; i < contents.length; i++){
            imHandler.send(contents[i]);
            console.log("说过的话有：" + contents[i]);
        }
        /**用户发送消息后，开启对客服消息的监控，同时取消自己的无回复监控计时器**/
        monitorMaper['service'].startMonitor();//开启对客服无回复的监控
        monitorMaper['customer'].resetMonitor();//关闭用户无回复监控
        if(contents.length > 0) {
            contents = [];
        }
    };
    
    /**
     * 发送连接前用户发过的话
     */
    function sendContentsForJymLogin(callback){
        for(var i = 1; i < contents.length; i++){
        	//连接上之后触发登录事件
        	if(i==0)
        		imHandler.send(contents[i],callback);
        	else
        		imHandler.send(contents[i]);
            console.log("说过的话有：" + contents[i]);
        }
        /**用户发送消息后，开启对客服消息的监控，同时取消自己的无回复监控计时器**/
        monitorMaper['service'].startMonitor();//开启对客服无回复的监控
        monitorMaper['customer'].resetMonitor();//关闭用户无回复监控
        if(contents.length > 0) {
            contents = [];
        }
    };
    
    /**
     * 启动客服申请执行器
     * @param url 申请客服链接
     * @param userId 用户id
     * @param userType 用户类型
     */
    function startExecutor(content) {
        var url = "/csos/customer/api/applyService";
        if (running === false) {
            running = true;
            initHidden();
            applyService(url, dialogId, userId, content);//用户第一次发的内容也发往服务器，后期可能根据描述内容只能分配
        }
    };
    /**
     * 重新启动客服申请执行器
     */
    function restartExecutor(element){
        //element.onclick = "";//取消点击事件处理，防止再次点击
        //element.style.color = "#ccddee";//使a标签改变颜色
        //if((isRestart() === false) && (monitorMaper['customer'].isDisconnected())) {
        //    isNeed = true;//需要申请分配
        //    running = false;//还没有启动申请
        //    restart = true;//重新申请
        //    maxCount = 12;//恢复最大申请数
        //    startExecutor('重新链接');
        //}
        window.location.reload();
    };
    /**
     * 是否是重新申请
     * @returns {boolean}
     */
    function isRestart(){
        return restart;
    };
    /**
     * 是否有客服正在为其服务
     * @returns {boolean}
     */
    function isServicing(){
        var serving = $("#serving").val();
        if((serving == 'false') || (monitorMaper['customer'].isDisconnected())) {//会话id为空或者断线，则不是在服务中
            inService = false;
        }else{
            inService = true;
        }
        return inService;
    };
    /**
     * 设置正在运行中
     */
    function setRunning(isRunning){
        if(!isRunning){
            running = true;
        }else{
            running = isRunning;
        }
    };
    /**
     * 在请求分配完客服之前，缓存用户发过的话
     * @param content 消息的json对象
     */
    function addContents(content){
        contents.push(content);
    };
    return {
        startExecutor : startExecutor,
        restartExecutor : restartExecutor,
        setRunning : setRunning,
        isRestart : isRestart,
        isServicing : isServicing,
        addContents : addContents
    }
};

var serviceExecutor = serviceExecutor();

/**
 * 开启客服消息的监控
 */
var startServiceMonitor = function(){
    var wait = window['wait_reply_second'];
    if(!wait){
        wait = 60;
    }
    var data = {
        wait : wait,//线上一分钟
        tips : messages.wait
    };
    return serviceMonitor(data);
};
/**
 * 开启用户消息的监控
 */
var startCustomerMonitor = function(){
    var waitMinute = window['customer_wait_minute'];
    var delaySecond = window['customer_delay_second'];
    //等待时间，单位分钟
    if(!waitMinute){
        waitMinute = 3;
    }
    //倒计时断开时间，单位秒
    if(!delaySecond){
        delaySecond = 60;
    }
    var timeout = waitMinute + (delaySecond / 60);
    var data = {
        wait: waitMinute * 60,  // 不说话断开连接，单位s
        delay: delaySecond,  // 延时断开, 单位s
        tips: '亲，您已超过' + waitMinute + '分钟没有说话，倒数 <b>xxx</b> s后会自动断开连接。若您还需要客服的服务，请反馈问题',
        disconnect: '亲，由于您' + timeout + '分钟内没有任何操作，已经自动退出客服会话，如需帮助，请<a href="javascript:void(0);" onclick="serviceExecutor.restartExecutor(this);" style="">重新连接</a>'
        //tips: format(templateProp['timer_closing'],waitMinute,'<b>xxx</b>'),
        //disconnect: formatLink(format(templateProp['timer_closed'],timeout),"<a href='javascript:void(0);' onclick='serviceExecutor.restartExecutor(this);' style=''>","</a>")
    };
    return customerMonitor(data);
};
/**
 * 客服回复监视器
 * @param data
 */
function serviceMonitor(data){
    var timer = null;
    var wait = data.wait;
    var tips = data.tips;

    function sendTip(){
        chatroom.send({
            start: false,
            role: 'service',
            type: 'talk',
            avatar: DEFAULT_SERVICE_AVATAR,
            content: tips
        });
    }

    function start(){
        if(!timer) {
            console.log('开启客服回复监视器....')
            timer = setTimeout(function(){
                sendTip();
                delete timer;
                timer = null;
            }, wait * 1000);
        }
    }
    function reset(){
        if(timer) {
            console.log('关闭客服回复监视器....')
            clearTimeout(timer);
            timer = null;
        }
    }

    return {
        startMonitor : start,
        resetMonitor : reset
    };
}

/**
 * 用户回复监视器
 * @param data
 * @returns {{reset: reset}}
 */
function customerMonitor(data) {
    var timer = null;
    var box = document.getElementById('chatroom');
    var delay = data.delay;
    var wait = data.wait;
    var tips = data.tips;
    var remind = null;
    var disconnected = false;
    if(!tips){
    	function sendTips() {
            remind = delay;
            chatroom.send({
                start: true,
                role: 'service',
                type: 'talk',
                isReciprocal: true,
                avatar: DEFAULT_SERVICE_AVATAR,
                content: tips.replace('xxx', remind)
            });
            count();
        };
    }
    
    //倒计时方法
    function count() {
        var l = box.children.length,
            el = box.children[l - 1];
        if (remind > 0 && el.className.indexOf('service-item') !== -1) {//计时未结束,且最后一个元素是客服的信息
            remind--;
            el.children[1].children[0].innerHTML = tips.replace('xxx', remind);
            setTimeout(function() {
                count();
            }, 1000);
        } else if (remind < 1 && el.className.indexOf('service-item') !== -1) {
            disconnect();
        }
    };
    function disconnect() {
        //alert('开始断开连接啦，赶紧观察...');
        $.ajax( {
            url:'/csos/dialog/api/online/' + $("#userId").val() + '/' + $("#dialogId").val(),
            type:'post',
            dataType:'json',
            success : function(r) {
                //alert('已经断开连接了.......');
                console.log(r);
                //清除会话id、用户id,去掉这段代码,与晓凡确认不需要了--cly
                //$("#dialogId").val('');
                //$("#userId").val('');
                //$("#serving").val('false');
            }
        });
        imHandler.close($("#dialogId").val());//用户自己关闭
        chatroom.sendTips(data.disconnect);
        disconnected = true;//标识已经断线
        serviceExecutor.setRunning();//设置已经运行过了
        monitorMaper['customer'].resetMonitor();//断线后重置用户回复监视器
        monitorMaper['service'].resetMonitor();//断线后重置客服回复监视器
    };
    function contactErrorDisconnect() {
        //alert('开始断开连接啦，赶紧观察...');
        $.ajax( {
            url:'/csos/dialog/api/contact/' + $("#userId").val() + '/' + $("#dialogId").val(),
            type:'post',
            dataType:'json',
            success : function(r) {
                //alert('已经断开连接了.......');
                console.log(r);
                //清除会话id、用户id,去掉这段代码,与晓凡确认不需要了--cly
                //$("#dialogId").val('');
                //$("#userId").val('');
                //$("#serving").val('false');
            }
        });
        imHandler.close($("#dialogId").val());//用户自己关闭
        disconnected = true;//标识已经断线
        serviceExecutor.setRunning();//设置已经运行过了
        monitorMaper['customer'].resetMonitor();//断线后重置用户回复监视器
        monitorMaper['service'].resetMonitor();//断线后重置客服回复监视器
    };
    function start(){
        //这里的问题是，客服或者用户连续说一堆话的时候，是以最后一句为监控起点，还是第一句？
        if(!timer){
            console.log('开启用户回复监视器....');
            timer = setTimeout(function() {
                sendTips();
                delete timer;
                timer = null;
            }, wait * 1000);
        }
    };
    function reset() {
        if(timer){
            console.log('关闭用户回复监视器....')
            clearTimeout(timer);
            timer = null;
        }
    };
    function isDisconnected(){
        return disconnected;
    };
    function reConnect(){
        disconnected = false;
    };
    function change(eventDialogId, nickName, type){
        if($("#dialogId").val() == eventDialogId) {
            chatroom.sendTimeTips();
            if("auto"==type){
            	chatroom.sendTips('因网络问题，已重新连接客服为您服务。');           	
            }else{
            	chatroom.sendTips('已转由客服'+ nickName +'为您服务。');
            	
            }
        }
    };
    // demo -- 测试csim替换结果
    function change(key,eventDialogId, nickName, type){
        if($("#dialogId").val() == eventDialogId) {
            chatroom.sendTimeTips();
            if("auto"==type){
            	chatroom.sendTips('因网络问题，已重新连接客服为您服务。');
            	//chatroom.sendTips(templateProp['change_reconnectTips']);
            }else if(templateProp[key]){
            	chatroom.sendTips('已转由客服'+ nickName +'为您服务。');
            	//chatroom.sendTips(format(templateProp[key],nickName));
            }
        }
    };
    function offline(eventDialogId){
        if($("#dialogId").val() == eventDialogId) {
            imHandler.close(eventDialogId);
            chatroom.sendTimeTips();
            chatroom.sendTips('由于网络原因，您已经与客服断开连接，若还需要客服的服务，请<a href="javascript:void(0);" onclick="serviceExecutor.restartExecutor(this);" style="">重新连接</a>');
            //chatroom.sendTips(formatLink(templateProp['offline_NetworkIssueQuit'],"<a href='javascript:void(0);' onclick='serviceExecutor.restartExecutor(this);' style=''>","</a>"));
            revalue();
        }
    };
    function onlineClose(eventDialogId){
        if($("#dialogId").val() == eventDialogId) {
            chatroom.sendTimeTips();
            chatroom.sendTips('亲，本次服务已结束。请您为我的服务评价。祝您生活愉快！');
            //chatroom.sendTips(templateProp['evaluate_closedTips']);
            revalue();
            imHandler.close($("#dialogId").val());
        }
    };
    function offlineClose(eventDialogId){
        if($("#dialogId").val() == eventDialogId) {
            chatroom.sendTimeTips();
            chatroom.sendTips('亲，您已经与客服断开连接，若还需要客服的服务，请<a href="javascript:void(0);" onclick="serviceExecutor.restartExecutor(this);" style="">重新连接</a>');
            //chatroom.sendTips(formatLink(templateProp['offline_closed'],"<a href='javascript:void(0);' onclick='serviceExecutor.restartExecutor(this);' style=''>","</a>"));
            revalue();
        }
    };
    function revalue(){
        monitorMaper['customer'].resetMonitor();//取消用户回复监控
        monitorMaper['service'].resetMonitor();//取消客服回复监控
        serviceExecutor.setRunning();//设置已经运行过了
        disconnected = true;//标识已经断线
    }
    return {
        startMonitor : start,
        resetMonitor : reset,
        reConnect : reConnect,
        offline : offline,
        change : change,
        onlineClose : onlineClose,
        offlineClose : offlineClose,
        isDisconnected : isDisconnected,
        contactErrorDisconnect :contactErrorDisconnect
    };
}
/**
 * 添加系统相关监视器
 * @returns {{showHistory: showHistory}}
 */
function systemMonitor() {
    /**
     * 显示历史消息
     * @param historys
     */
    function showHistory(historys){
        var content = null;
        var length = historys.length;
        for(var i = 0; i < length; i++){
            content = historys.pop();
            if(content['role'] == 'kf'){
                content['role'] = 'service';
                content['avatar'] = DEFAULT_SERVICE_AVATAR;
            }
            chatroom.send(content);
        }
    }

    return {
        showHistory : showHistory
    }
}

var monitorMaper = {};//用于存放客服、用户倒计时器
monitorMaper['service'] = startServiceMonitor();
monitorMaper['customer'] = startCustomerMonitor();
monitorMaper['system'] = systemMonitor();
/**
 * 上传图片
 */
/**
 * 上传图片
 */
var uploadImg = function () {
    var msgContent = {
        start: true,
        role: 'user',
        type: 'pic',
        avatar: DEFAULT_USER_AVATAR,
        img: '',
        picId: 'p' + (new Date()).getTime()
    };
    var imgFile = $("#imgFile");
    if (imgFile) {
        var fileName = imgFile.val();
        if (fileName != "") {
            if (/\.(jpg|jpeg|png|JPEG|JPG|PNG)$/.test(fileName)) {
                $("#imgFileForm").ajaxSubmit({
                    dataType: 'json',
                    url: '/csos/customer/api/image',
                    beforeSend: function () {
                        // 上传图片前添加loading至聊天框
                        chatroom.send(msgContent);
                        if (!serviceExecutor.isServicing()) {
                            chatroom.sendTips(messages.connecting);
                        }
                    },
                    data: {
                        dialogId: $("#dialogId").val()
                    },
                    success: function (data) {
                        var success = data['success'];
                        if (success) {
                            var imgSrc = data['message'];
                            msgContent.img = imgSrc
                            msgContent['content'] = imgSrc
                            if (serviceExecutor.isServicing()) {
                                //将消息发送给csim
                                imHandler.send(msgContent);
                            } else {
                                serviceExecutor.startExecutor(imgSrc);
                                serviceExecutor.addContents(msgContent);
                            }
                            // 上传成功加载图片, 移除loading并显示图片
                            loadImg(msgContent.img, function () {
                                var dom = document.getElementById(msgContent.picId);
                                dom.getElementsByTagName('img')[0].src = msgContent.img;
                                dom.className += ' pic-done';
                                dom.removeChild(dom.getElementsByTagName('i')[0]);
                                chatroom.scrollBottom();
                            });
                        } else {
                            chatroom.sendTips(data['message']);
                        	//chatroom.sendTips(templateProp[data['message']]);
                        }
                    },
                    error: function (xhr) {
                        //alert("error");
                        console.log(xhr);
                    }
                });
            } else {
                chatroom.sendTips('上传的文件格式有误，请以.jpg,.jpeg,.png的图片上传。');
            	//chatroom.sendTips(templateProp[data['message']]);
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }

}

/**
 * 预加载图片
 * @param {string} url 图片链接
 * @param {function} callback 加载完成回调
 * @param {function} error 加载失败回调
 */
function loadImg(url, callback, error) {
    var img = new Image();
    img.onerror = function() {
        if(typeof error === 'function'){
            error();
        }
    };
    img.src = url;
    if(img.complete) {
        if(typeof callback === 'function'){
            callback();
        }
    } else {
        img.onload = function() {
            if(typeof callback === 'function'){
                callback();
            }
            this.onload = null;
            this.onerror = null;
        };
    }
}

/**
 * 用户评论
 * @param content   评论内容
 * @param score     满意度分数
 */
var comment = function(content, score){
    $.ajax({
        url: '/csos/customer/api/comment',
        data: {
            'content': content,
            'score': score,
            'dialogId': $('#dialogId').val()
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            console.log(data);
        }
    });
};
/**
 * 发送表情
 * @param url
 */
var sendFace = function(path, faceName) {
    var msgContent = {
        role: 'user',
        type: 'face',
        avatar: DEFAULT_USER_AVATAR,
        img: path + faceName
    };

    msgContent['content'] = faceName;
    if(serviceExecutor.isServicing()) {
        imHandler.send(msgContent);
        msgContent['start'] = true;
    }else{
        serviceExecutor.startExecutor(faceName);
        serviceExecutor.addContents(msgContent);
    }
    //发送消息到对话框中显示
    chatroom.send(msgContent);
    if(!serviceExecutor.isServicing()) {
        chatroom.sendTips(messages.connecting);
    }
};