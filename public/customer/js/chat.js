/**
    * 功能描述：用户会话处理器
    * <p> 版权所有：优视科技 </p>
    * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
    *
    * @author <a href="mailto:zhangxf3qqcom">张晓凡</a>
    * @version 1.0.0
    * create on: 2015-05-25
    */
var cImHandler = function(){
    var closed = true;
    var customerIM = null;
    var userId = null;
    var dialogId = null;
    var userType = null;
    var historys = [];
    var isReportable = $("#isReportable").val()=='true';
    /**
     * 异常处理
     * @param exceptionEvent
     * @param method
     */
    var handelException = function (exceptionEvent, method) {
        switch (method) {
            case 'SEND_MESSAGE':
                customerIM.select(userType, 0);
                break;

            default:
                break;
        }
    };
    /**
     * 关闭会话
     * @param datas
     */
    var closeDialog = function(datas){
        if(!datas){
            alert('data is null...');
            return;
        }else if(datas.length != 5){
            alert('params wrong...');
            return;
        }
        $.ajax( {
            url: datas['url'],
            data : {
                'dialogId' : datas['dialogId'],
                'portalUid' : datas['portalUid'],
                'userId' : datas['userId'],
                'userType' : datas['userType']
            },
            type:'get',
            dataType:'json',
            success : function(r) {
                console.log(r);
                //alert(r);
            }
        });
    }
    /**
     * 显示对话
     * @param dialogEvent
     */
    var displayDialog = function (dialogEvent) {
        var dialogId = dialogEvent.dialogId.dialogId;
        var lastReceivedMsgId = dialogEvent.lastReceivedMsgId;
        var lastMessageCreateDate = dialogEvent.lastMessageCreateDate;
        var unreceivedCount = dialogEvent.unreceivedCount;
        //alert('显示会话...');
    };

    /**
     * 显示消息
     * @param messageEvent
     */
    var displayMessage = function (messageEvent) {

        var content=JSON.parse(messageEvent.content);
        var data = {
            start: true,
            role: 'service',
            type: content.type,
            avatar: DEFAULT_SERVICE_AVATAR,
            content: content.content,
            img: content.content
        };
        if(content.type == 'face'){
            data['img'] = window['uae_image_root'] + '/images/face/' + data['img'];
        }
        chatroom.send(data);
        //alert('显示消息');
        //对客服的信息进行校验，是否涉及敏感信息 - 黄玉云 2015/12/16
        checkContent(data);
    };
    /**
     * 显示历史
     * @param historyEvent
     */
    var displayHistory = function (historyEvent, length) {
        var content = JSON.parse(historyEvent['content']);
        historys.push(content);
        if(historys.length == length){
            monitorMaper['system'].showHistory(historys);
        }
    };
    var sendMessage = function(messageEvent){
        //alert('发送消息 ------> ' + messageEvent.content);
    };
    /**
     * 对聊天内容进行检查
     * 出现敏感字则在用户聊天窗口提示
     * @param content	聊天内容信息	
     */
    var checkContent = function(content){
    	var senstiveWords = window['senstive_words'];
    	// 检查是否需要做校验
    	if(!senstiveWords || content.type!='talk'){
    	   return;
    	}
    	//需要校验，但是没有命中则直接返回
    	var regExp = new RegExp(senstiveWords);
    	if(!regExp.test(content.content)){
    		return;
    	}
    	
    	// 若是客服内容出现敏感字，则出现举报按钮
    	if(content.role=='service'){
    		// 通知后台更改会话状态
    		updateDialogStatus();
    		// demo -- 替换链接
    		//chatroom.sendTips("客服不会以任何形式索要您账号的密码、保证金、验证码、请勿泄露，若客服有索要密码，金钱等行为，请点击 <a id = 'report' href='javascript:void(0);' onclick='imHandler.report();'>举报</a>。");
    		if(templateProp['report_reportTips']){
    			chatroom.sendTips(formatLink(templateProp['report_reportTips'],"<a id = 'report' href='javascript:void(0);' onclick='imHandler.report();'>","</a>"));
    		}
    	}else{
    		// 若是用户内容出现敏感字，则出现提醒
    		//chatroom.sendTips("请勿泄露您的账号密码给他人，若您已经泄露，请尽快修改您的密码。");
    		chatroom.sendTips(templateProp['report_sensTips']);	
    	}
    };
    
    var updateDialogStatus = function(){
    	// 获取会话相关信息
        var dialogId = $("#dialogId").val();
        
        $.ajax({
	        url: location.origin+'/csos/customer/api/updateDialogStatus',
	        data: {
	            'dialogId': dialogId,
	        },
	        type: 'post',
	        dataType: 'json',
	        success: function (res) {
	        	
	        }
	    });
    }
    
    /**
     * 用户点击举报按钮
     * 1 转单成功：前端提示转单
     * 2 转单失败：前端提示继续服务
     */
    var report = function(){
    	// 前端提示
    	//chatroom.sendTips("为保证您的权益，正在帮您转接给安全专员帮您处理。");	
    	chatroom.sendTips(templateProp['report_changing']);
    	// 获取会话相关信息
        var dialogId = $("#dialogId").val();
        var feedbackUrl = window['feedback'];
    	$.ajax({
	        url: location.origin+'/csos/customer/api/report',
	        data: {
	            'dialogId': dialogId,
	            //'feedbackUrl':window['feedback']
	            'feedbackUrl': feedbackUrl
	        },
	        type: 'post',
	        dataType: 'json',
	        success: function (res) {
	        	// 转单失败，前端提示
	        	// demo -- 后端返回至前端
	        	if(res.message && templateProp[res.message]){
	        		//如果是包含链接的，则需要格式化
	        		if(res.code && res.code == 'link' ){
	        			chatroom.sendTips(formatLink(templateProp[res.message],'<a href="javascript:void(0);" onclick="window.open('+feedbackUrl+');">','</a>'));
	        			
	        		}else{
	        			chatroom.sendTips(templateProp[res.message]);
	        		}
	        		
	        	}
	        }
	    });
    }
    
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
    /**
     * 对话处理方法
     * @param events
     * @param method
     */
    var dialogHandler = function (events, method) {
    	if(events){
    		for (var index = 0; index < events.length; index++) {
                var event = events[index];
                var eventType = event.type;
                console.log('--- dialogHandler '+eventType + ',method:' + method);
                switch (eventType) {
                    case 'INIT_DIALOG':
                        console.log("INIT_DIALOG..............");
                        displayDialog(event);
                        break;
                    case 'MESSAGE':
                        displayMessage(event);
                        break;
                    case 'HISTORY':
                        displayHistory(event, events.length);
                        if(isReportable && index==events.length-1){
                        	//chatroom.sendTips("客服不会以任何形式索要您账号的密码、保证金、验证码、请勿泄露，若客服有索要密码，金钱等行为，请点击 <a id = 'report' href='javascript:void(0);' onclick='imHandler.report();'>举报</a>。");
                        	// demo -- 替换
                        	if(templateProp['report_reportTips']){
                    			chatroom.sendTips(formatLink(templateProp['report_reportTips'],"<a id = 'report' href='javascript:void(0);' onclick='imHandler.report();'>","</a>"));
                    		}
                        }
                        break;
                    case 'SEND_MESSAGE':
                        sendMessage(event);
                        break;
                    case 'EVENT':
                        var eventMsg = event['eventMessage'];
                        if(eventMsg) {
                            eventMsg = JSON.parse(eventMsg);
                            if('online_close' == eventMsg['type']) {
                                monitorMaper['customer'].onlineClose(eventMsg['dialogId']);
                            }else if('offline_close' == eventMsg['type']){
                                monitorMaper['customer'].offlineClose(eventMsg['dialogId']);
                            }else if('change' == eventMsg['type']){
                            	console.log('用户接收转单通知...');
                            	var extendMsg = JSON.parse(eventMsg.extendMsg);
                            	//monitorMaper['customer'].change(eventMsg['dialogId'], extendMsg.nextCsNickName, extendMsg.type);
                            	// demo -- 获取csim替换结果
                            	monitorMaper['customer'].change(extendMsg.key,eventMsg['dialogId'], extendMsg.nextCsNickName, extendMsg.type);
                            }else if('offline' == eventMsg['type']){
                                //alert('由于网络原因，您已经与客服断开连接，若还需要客服的服务，请重新连接' + eventMsg['extendMsg']);
                                monitorMaper['customer'].offline(eventMsg['dialogId']);
                            }
                        }
                        break;
                    case 'AJAX_ERROR':

                    case 'INTERNAL_ERROR':
                        handelException(event, method);
                        break;

                    default:
                        break;
                }
            }
    	}
    };
    /**
     * 启动im
     */
    var start = function(){
        closed = false;
        userId = $("#userId").val();
        userType = $("#userType").val();
        dialogId = $("#dialogId").val();
        console.log('--- 1 start');
        customerIM = $.csim({
            isSimple : true,
            packetSize : 100,
            interval : 5 * 1000,
            callback : dialogHandler
        });
        customerIM.fire(userId, userType, dialogId, 'connecting...');
        customerIM.select(dialogId, 0);
    };
    var history = function(){
    	console.log('--- 2 history');
        dialogId = $("#dialogId").val();
        customerIM.history(dialogId, 0);
    }
    /**
     * 发送消息
     * @param dialogId      会话id
     * @param messageType   消息类型
     * @param content       消息内容
     * @param callback      发送后回调方法
     */
    var send = function(content, callback) {
        try {
            if(!customerIM) {
                start();
            }
            
            // 发送到客服端显示
            if(content) {
                delete content['start'];
                content['time'] = formatDate(serverDate); // liusu用户端时间 ->原formatDate(new Date());
                content['username'] = window['customer_username'];
                customerIM.send(dialogId, 'CHAT', JSON.stringify(content), callback);
                //对用户的信息进行校验，是否涉及敏感信息 - 黄玉云 2015/12/16
                checkContent(content);
            }
        }catch(e){
            monitorMaper['customer'].offlineClose();
        }
    };
    
    /**
     * 触发事件
     */
    var fire = function(userId, userType, dialogId, content, callback){
    	try {
            if(!customerIM) {
                start();
            }
            customerIM.fire(userId, userType, dialogId, content, callback);
        }catch(e){
            monitorMaper['customer'].offlineClose();
        }
    }
    
    /**
     * 关闭im连接
     */
    var close = function(dialogId){
        if(customerIM){
            customerIM.close(dialogId);
        }
        customerIM = null;
        closed = true;
    };
    /**
     * 判断im是否已经断开关闭
     * @returns {boolean}
     */
    var isClosed = function(){
        return closed;
    };
    
    var checkReport = function(){
    	chatroom.sendTips("test");	
    };

    return {
        start : start,
        history : history,
        send : send,
        close : close,
        isClosed : isClosed,
        report:report,
        fire : fire,
        checkReport:checkReport
    }
};
var imHandler = cImHandler();
