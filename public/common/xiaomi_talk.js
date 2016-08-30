define(function (require, exports, module) {
    //公用变量
    window.reconnection = 0;
    window.socketTimer = null;
    // 2015-11-06 webSocket连接时间记录
    var surveyRequestId = 0;
    var connectTimeCost = 0;
    var talk = {
        socketInit:function(apiUrl,callback){
            // 2015-11-06 webSocket连接时间记录
            connectTimeCost = new Date().getTime();
            window.socket = new WebSocket(apiUrl);
            socket.onopen = function (event) {
                // 2015-11-06 webSocket连接时间记录
                connectTimeCost = ( new Date().getTime() - connectTimeCost ) * 1000 * 1000;

                //console.log("Web Socket opened!");
                clearTimeout(socketTimer);
                callback && callback();
            };
            socket.onclose = function (event) {
                console.log("Web Socket closed.");
                reconnection++;
                if(!isEndstatus){
                    if(reconnection < 20){
                        window.socketTimer = setTimeout(function(){
                            talk.socketInit(apiUrl,function(){});
                        },1000*3);
                    }else{
                        clearTimeout(socketTimer);
                    }
                }
              talk.surveyDialog(true, true)
            };
            socket.onerror = function (event) {
                console.log("Web Socket error.");
            };
        },
        open:function(callback){
            window.sessionId = require("./cookie").cookie("sessionToken");
            if(window.WebSocket && socketHook){//支持websocket的使用websocket socketHook这个字段是为了到时候如果都不想使用websocket的时候修改此变量即可
                var deviceInfo = JSON.stringify({
                    "agent":"browser",
                    "ua":window.navigator.userAgent
                });
                var json = {
                    "header" :{
                        "requestId" : (new Date() - 0).toString(32),
                        "requestURI" : "/stateful/open",
                        "prefix" :{
                            "appId" : "000001001",
                            "version" : "1",
                            "platform" : plat
                        }
                    },
                    "body" :{"channel":channel,"referer":referer, "fromUserId":userid,"sessionId":sessionId, "timeZone":timeZone, "locale":lang,"deviceInfo":deviceInfo}
                };
                talk.socketInit(apiUrl,function(){
                    talk.send(json);
                    talk.listener();

                });
            }else{//ajax
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    cache:false,
                    data:{"channel":channel,"referer":referer,"fromUserId":userid,"sessionId":sessionId, "timeZone":timeZone, "locale":lang },
                    url:window.apiUrl + "/stateful/open",
                    success:function(res){
                        if(res.errcode){ //错误
                            require("./errorCode").errorLog(res.errcode);
                            if(res.errcode == 40011){
//                                require("./notice").news(langconfig.existSession,true);
                                $("#mc-wrap").html('<div class="maintain-box"><p>'+langconfig.existSession+'</p></div>');
                                $("#mc-submit").empty();
                            }else{
                                require("./notice").news(langconfig.receiveError,true);
                            }
                            //显示关闭按钮
                            $("#transferperson").hide(0,function(){
                                $("#closechat").show();
                                //$("#privacy,.chat-footer-split").show();
                            });
                        }else{
                            //这里是暂时的逻辑
                            window.mayAccessHuman = res.mayAccessHuman;
                            if(mayAccessHuman){ // 可以转人工
                                //显示关闭按钮
                                $("#closechat").hide(0,function(){
                                    $("#transferperson").show();
                                    //$("#privacy,.chat-footer-split").hide();
                                });
                            }else{ // 不可以转人工
                                //显示关闭按钮
                                $("#transferperson").hide(0,function(){
                                    $("#closechat").show();
                                    //$("#privacy,.chat-footer-split").show();
                                });
                            }
                            //
                            if(sessionId == res.sessionId){//是相同会话
                                window.historyItems = require("./cookie").storage.get(res.sessionId);
                                if(!!historyItems){
                                    require("./render").historys(historyItems);
                                }

                                //
                                if(!!res.users && res.users.length > 0){
                                    window.nickname = res.users[0].nickname || res.users[0].uid;
                                    window.avatar = res.users[0].icon || res.users[0].gender || "avatar_tpl";
                                    window.joined = true;
                                    // mifen2016 start
                                    window.kfInfo = res.users[0];
                                    // mifen2016 end
                                    showAvatar();
                                }
                            }else{
                                //设置到cookie
                                require("./cookie").cookie("sessionToken",res.sessionId,{"expires":1});
                            }
                            window.sessionId = res.sessionId;
                            talk.listener();

                            //开启ping检测
                            talk.ping();
                            if(callback){
                                setTimeout(function(){
                                    callback();
                                },0);
                            }
                        }
                    }
                });
            }
        },
        send:function(msgData){//消息类型比如text或者image 消息体
            var currentTime = +new Date();
            msgData.body.content = JSON.stringify(msgData.body.content);
            if(window.WebSocket && socketHook){
                // 2015-11-06 webSocket连接时间记录
                if( connectTimeCost > 0  )
                {
                    msgData.body.connectTimeCost = connectTimeCost;
                    connectTimeCost = 0;
                }

                msg = JSON.stringify(msgData);
                if (socket.readyState !== 1) {
                    if(isEndstatus) return;
                    require("./render").systemRender(langconfig.sysName,langconfig.sendMsgError);
                    socket.close();
                    talk.socketInit(apiUrl);
                    setTimeout(function () {
                        socket.send(msg);
                    }, 250);
                } else {
                    socket.send(msg);
                }
            }else{
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    url:window.apiUrl + "/stateful/send",
                    data:msgData.body,
                    success:function(res){
                        if(res.errcode){ //错误
                            require("./errorCode").errorLog(res.errcode);
                            require("./render").systemRender(langconfig.sysName,langconfig.sendMsgError);
                        }else{
                            //发送成功
                        }
                    }
                });
            }
        },
        listener:function(){
            if(window.WebSocket && socketHook){//支持websocket的使用websocket
                socket.onmessage = function (event) {
                    var res = JSON.parse(event.data);

                    // 2015-07-01 刷新无法启用suggest问题修复
                    if( res.body && $.type(res.body.users) == 'array'){
                        $.each(res.body.users, function(k,v){
                            if( v.role == 3 ) window.kfRole = 3;
                        })
                    }
                    if(res.header.action == "WEBSOCKET_RESPONSE"){ // 响应
                        switch (res.header.requestURI){
                            case "/stateful/open":
                                //console.log(JSON.stringify(res));
                                if(res.body.errcode){ //错误
                                    require("./errorCode").errorLog(res.body.errcode);
                                    if(res.body.errcode == 40011){
//                                        require("./notice").news(langconfig.existSession,true);
                                        $("#mc-wrap").html('<div class="maintain-box"><p>'+langconfig.existSession+'</p></div>');
                                        $("#mc-submit").empty();
                                    }else{
                                        require("./notice").news(langconfig.receiveError,true);
                                    }
                                }else{
                                    //判断需不需要加上转人工的链接
                                    window.mayAccessHuman = res.body.mayAccessHuman;
                                    if(mayAccessHuman){ // 可以转人工
                                        //显示关闭按钮
                                        $("#closechat").hide(0,function(){
                                            $("#transferperson").show();
                                            //$("#privacy,.chat-footer-split").hide();
                                        });
                                    }else{ // 不可以转人工
                                        //显示关闭按钮
                                        $("#transferperson").hide(0,function(){
                                            $("#closechat").show();
                                            //$("#privacy,.chat-footer-split").show();
                                        });
                                    }
                                    if(sessionId == res.body.sessionId){//是相同会话
                                        window.historyItems = require("./cookie").storage.get(res.body.sessionId);

                                        if(!!historyItems){
                                            require("./render").historys(historyItems);
                                          talk.getSurvey();
                                        }

                                        //
                                        if(!!res.body.users && res.body.users.length > 0){
                                            window.nickname = res.body.users[0].nickname || res.body.users[0].uid;
                                            window.avatar = res.body.users[0].icon || res.body.users[0].gender || "avatar_tpl";
                                            window.joined = true;
                                            // mifen2016 start
                                            window.kfInfo = res.body.users[0];
                                            // mifen2016 end
                                            showAvatar();
                                        }
                                    }else{
                                        //设置到cookie
                                        require("./cookie").cookie("sessionToken",res.body.sessionId,{"expires":1});
                                    }
                                    window.sessionId = res.body.sessionId;
                                    //
                                    //talk.listener();
                                }
                                break;
                            case "/stateful/text":
                                console.log(JSON.stringify(res));
                                if(res.body.errcode != 0){
                                    require("./render").systemRender(langconfig.sysName,langconfig.sendMsgError);
                                }
                                break;
                            case "/stateful/image":
                                if(res.body.errcode != 0){
                                    require("./render").systemRender(langconfig.sysName,langconfig.sendMsgError);
                                }
                                break;
                            case "/stateful/quit":
                                console.log(JSON.stringify(res));
                                //socket.close();
                                //清空localstorage和sessionToken的cookie
                                require("./cookie").storage.clear();
                                require("./cookie").cookie("sessionToken","",{"expires":-1});
                                break;
                            case "/stateful/recover":
                                console.log(JSON.stringify(res));
                                break;
                        }
                    }else if(res.header.action == "WEBSOCKET_EVENT"){ //事件
                        talk.swicthType(res.body);
                      talk.getSurvey();
                    }
                };
            }else{
                $.ajax({
                    "type":"POST",
                    "dataType":"json",
                    "timeout":1000*30,
                    "cache":false,
                    url:window.apiUrl + "/stateful/listen",
                    "data":{"sessionId":sessionId,"fromUserId":userid},
                    "success":function(res){
                        window.reconnection = 0;
                        var typeId = res.msgType;
                        talk.swicthType(res);
                        //成功后回调自己
                        if(window.sendquest){
                            talk.listener();
                        }
                    },
                    "error":function(XMLHttpRequest){
                        //断线重连机制
                        if(window.isEndstatus) return;
                        if(XMLHttpRequest.status == 502 || XMLHttpRequest.status == 504 || XMLHttpRequest.status == 408 || XMLHttpRequest.statusText == "timeout"){//服务器超时
                            if(window.sendquest){
                                talk.listener();
                            }
                        }else{ //断线重连策略
                            window.reconnection++;
                            if(window.reconnection < 1000){
                                window.setTimeout(function(){
                                    talk.listener();
                                },5000);
                            }else{
                                require("./notice").news(langconfig.receiveError,true);
                            }
                        }
                    }
                });
            }
        },
        getSurvey: function() {
          var currentTime = +new Date();

            $('.J_submit').on('click', function(e) {
              e.preventDefault();
              if (!$('.J_submit').hasClass('done')) {
                surveyRequestId = (new Date() - 0).toString(32);
                var json = {
                  "header": {
                    "requestId": (new Date() - 0).toString(32),
                    "requestURI": "/stateful/send",
                    "prefix": {
                      "appId": "000001001",
                      "version": "1",
                      "platform": plat
                    }
                  },
                  "body": {
                    "sessionId": sessionId,
                    "fromUserId": userid,
                    "content": {
                      "surveyId": 1,
                      "createTime": currentTime,
                      "msgType": "survey",
                      "msgId": currentTime,
                      "result": [
                        {
                          "itemId": 1,
                          "value": $('.J_scoreResult').val()
                        },
                        {
                          "itemId": 2,
                          "value": $('#scoreDes').val()
                        }
                      ]
                    }
                  }
                }
                talk.send(json);
                $('.J_submit').attr('data-val', $('#scoreDes').val());
                  talk.surveyDialog(true);
              }
            });
        },
      surveyDialog: function (flag, close) {
        close = close || '';
        if (flag) {
          if (close) {
            $('.J_submit').addClass('done').text('会话已结束');
          } else {
            $('.J_submit').addClass('done').text('已提交');
          }
          $('#scoreDes').text($('.J_submit').attr('data-val')).attr('readonly', true);
          $('.J_icon').off('mousedown');
        }
      },
        swicthType:function(data){
            //if(!window.sendquest) return;
            /*
             * 1: quit initiatively-- 主动退出
             2. session timeout -- 长时间不说话导致会话超时 【客户端收到partner_quit_for_timeout_event事件后触发】
             3. kf error --     客服出错              【客户端收到partner_quit_for_error_event事件后触发】
             4：quit because kf quit--  客服主动退出       【客户端收到partner_quit_event事件后触发】
             5. lost connection-- 长时间收不到Ping，连接断开，服务端将用户退出 【MIC服务端监听触发】
             6. duplicate session-- 重复会话               【客户端收到duplicate_session_event事件后触发】
             7. system retrieve-- 系统将会话回收            【客户端收到session_retrieve_by_system_event事件后触发】
             * */
            var obj = data;
            switch (obj.msgType){
                  case "survey": // 客服加入3分钟后，提醒用户点评满意度​
                    window.queuepos = -1;
                    if (!window.startSpeak) {
                        window.startSpeak = true;
                        //控制显示关闭按钮

                    }
                    require("./render").kfSurvey(window.nickname, obj.items);
                    break;
                case "queue_start_event"://排队开始的事件
                    require("./notice").news(langconfig.startConect,true);
                    $("#transferperson").hide(0,function(){
                        $("#closechat").show();
                        //$("#privacy,.chat-footer-split").show();
                    });
                    break;
                case "queue_error_event"://排队出错的事件
                    require("./notice").news(langconfig.noService,true);
                    break;
                case "queue_reach_max_event"://排队达到上限的事件
                    require("./notice").news(langconfig.noService,true);
                    window.userchoosecode = "";
                    break;
                case "queue_pos_update_event"://排队位置更新的事件
                    window.queuepos = obj.pos;
                    if(window.queuepos <= 20){
                        require("./notice").news(langconfig.queuebefore + window.queuepos + langconfig.queueafter,true);
                    }else{
                        require("./notice").news(langconfig.queueing + "<span class='loading'>&nbsp;</span>",true);
                    }
                    break;
                case "join_session_event"://人工客服加入会话的事件
                    window.nickname = obj.user.nickname || obj.user.uid;
                    window.avatar = obj.user.icon || obj.user.gender || "avatar_tpl";
                    window.kfRole = obj.user.role;
                    window.joined = true;

                    // mifen2016 start
                    window.kfInfo = obj.user;
                    // mifen2016 end

                    showAvatar();
                    //
                    require("./render").systemRender(langconfig.sysName,langconfig.kfStart + window.nickname + langconfig.kfStartend);
                    setTimeout(function(){
                        require("./notice").news(langconfig.kfbefore + nickname + langconfig.kfafter,false);
                    },500);
                    break;
                case "text"://发送文本聊天消息
                    window.queuepos = -1;
                    if (!window.startSpeak) {
                        window.startSpeak = true;
                        //控制显示关闭按钮

                    }
                    var txtMessage = talk.parsePic(obj.content);
                    require("./render").kfRender(window.nickname,txtMessage);
                    addastMsgId(obj.msgId)
                    break;
                case "image"://发送图片聊天消息
                    window.queuepos = -1;
                    var thumbImg = '<img class="outerimg" src="'+obj.image.picUrl+'?thumb=75x75" width="30" height="30" /> ';
                    var picStr = '<a class="outerimgbox" target="_blank" title="'+langconfig.lookOrigin+'" href="'+obj.image.picUrl+'">'+thumbImg+'</a>';
                    require("./render").kfRender(window.nickname, picStr);
                    break;
                case "news"://图文
                    if(obj.articleCount == 1){ // 单图文
                        var msg = require("./smarty").tmpl("mediaSingle",obj);
                    }else if(obj.articleCount > 1){//多图文
                        var msg = require("./smarty").tmpl("mediaulti",obj);
                    }
                    require("./render").kfNews(window.nickname, msg);
                    break;
                case "robot_no_answer"://发送文本聊天消息
                    window.queuepos = -1;
                    if (!window.startSpeak) {
                        window.startSpeak = true;
                    }
                    //判断需不需要加上转人工的链接
                    if(window.mayAccessHuman){
                        var txtMessage = obj.content + '<a class="transfer-person" xa="1" data-id="transfer-person">转接人工</a>';
                    }else{
                        var txtMessage = obj.content;
                    }
                    require("./render").kfRender(window.nickname,txtMessage);
                    break;
                case "partner_quit_event"://正常结束会话的事件
                    window.isEndstatus = true;
                    scoreChat();
                    //评价切换radio
                    setTimeout(function(){
                        $(".score_select").find("input[type='radio']").change(function(){
                            if($(this).prop("checked")){
                                $(this).parent().addClass("labelactive").siblings("label").removeClass("labelactive");
                            }
                        });
                    },500);
                    talk.close(4);
                    break;
                case "duplicate_session_event"://存在重复会话的事件
                    require("./render").kfRender(langconfig.sysName,langconfig.otherLogin);
                    require("./notice").news(langconfig.appOver,false);
                    window.isEndstatus = true;
                    talk.close(6);
                    break;
                case "partner_quit_for_error_event"://由于另一端出错，导致会话异常结束的事件
                    require("./notice").news(langconfig.serviceError,false);
                    window.isEndstatus = true;
                    talk.close(3);
                    break;
                case "partner_quit_for_timeout_event"://会话超时事件
                    window.isEndstatus = true;
                    require("./render").kfRender(langconfig.sysName,langconfig.timeout);
                    require("./notice").news(langconfig.appOver,true);
                    setTimeout(function(){
                        require("./render").systemRender(langconfig.sysName,langconfig.overTips);
                    },100);
                    talk.close(2);
                    break;
                case "session_retrieve_by_system_event"://会话被系统回收事件
                    require("./notice").news(langconfig.appOver,true);
                    require("./render").systemRender(langconfig.sysName,langconfig.timeout);
                    window.isEndstatus = true;
                    talk.close(7);
                    break;
                case "session_transfer_event"://会话转接事件
                    window.nickname = obj.user.nickname || obj.user.uid;
                    require("./render").kfRender(langconfig.sysName,langconfig.turnto + window.nickname + "！");
                    break;
                case "typing_event"://正在输入事件
                    //require("./notice").news(langconfig.writing,false);
                    break;
                case "human_skills_group_config_event"://推送人工客服技能组配置的事件
                    window.pass = data.windowClosable;
                    window.skillsgroup = data.groups;
                    talk.skills();
                    break;
                case "session_score_config_event"://推送人工会话满意度配置的事件
                    if(data.commitRequired){
                        window.chatScore = data;
                        scoreChat();

                        //评价切换radio
                        setTimeout(function(){
                            $(".score_select").find("input[type='radio']").change(function(){
                                if($(this).prop("checked")){
                                    $(this).parent().addClass("labelactive").siblings("label").removeClass("labelactive");
                                }
                            });
                        },500);
                    }
                    break;
                case "remind_user_score_event": // 客服加入3分钟后，提醒用户点评满意度​
                    $('#chatEvaluate em').show();
                    break;
            }
        },
        recover:function(){
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/recover.json",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" :{
                    "contextId":contextId
                }
            };
            chatSocket.socketSend(json);
        },
        ping:function(){
            $.ajax({
                "type":"GET",
                "dataType":"json",
                "cache":false,
                "url":apiUrl + "/stateful/ping",
                "data":{"fromUserId":userid,"sessionId":sessionId},
                success:function (data) {
                    pingCounter = 0;
                    if(!isEndstatus){
                        setTimeout(function(){
                            talk.ping();
                        },1000*5);
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    var pingtimer = setTimeout(function(){
                        talk.ping();
                        pingCounter++;
                    },1000*5);
                    if(pingCounter == 3){
                        require("./render").systemRender(langconfig.sysName,langconfig.sendMsgError);
                    }else if(pingCounter > 50){
                        clearTimeout(pingtimer);
                    }
                }
            });
        },
        skills:function(res){
            if(window.skillsgroup.length >= 1){//判断技能组正常展示
                function skillView(data){
                    var str = '<ul class="skills-listbox">';
                    $.each(data.contents,function(i,el){
                    	var imgUrl = el.img;
                    	var reg = /^(http|https):.+/
                    	if (!reg.test(imgUrl)) {
                    		imgUrl = window.ctx+"/static"+imgUrl;
                    	}
                        str += '<li class="skillsinfo" data-code="'+el.code+'" data-list="'+el.leaf+'" data-id="'+el.childGroupId+'"><div class="hoverhook"><div><img src="'+imgUrl+'" alt=""></div><span>'+el.name+'</span></div></li>'
                    });
                    str += '</ul>';
                    //
                    require("./pop").chatPop({
                        title:data.title,
                        content:str,
                        btns :true,
                        pass:window.pass
                    });
                };
                skillView(talk.getTop(window.skillsgroup));
                //
                $("#chat-pop").off("click").on("click",".skillsinfo",function(){
                    var $this = $(this);
                    var hasList = $this.attr("data-list");
                    if(hasList === "false"){//进入下一级
                        var skillKey = $this.attr("data-id");
                        var datalist = talk.getObj(skillKey,window.skillsgroup);;
                        $("#pop-content").find(".skills-listbox").hide(0,function(){
                            skillView(datalist);
                        });
                    }else{//提交
                        window.userchoosecode = $this.attr("data-code");
                        setTimeout(function(){
                            $("#close-pop").trigger("click");
                        },200);
                        //邀请人工
                        window.transposon = true;
                        talk.invite(userchoosecode);
                        //这里判断是否要显示关闭的按钮
                        $("#transferperson").hide(0,function(){
                            $("#closechat").show();
                            //$("#privacy,.chat-footer-split").show();
                        });
                    }
                });
            }
//            else if(window.skillsgroup.length == 1){ //如果是港台就直接取得技能组发送给服务器
//                window.userchoosecode = skillsgroup[0].contents[0].code;
//                talk.invite(userchoosecode);
//                $("#transferperson").hide(0,function(){
//                    $("#closechat").show();
//                });
//            }
        },
        invite:function(mcode){
            var currentTime = +new Date();
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/stateful/send",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" : {
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "content":{
                        "createTime" : currentTime,
                        "msgType" : "request_queue",
                        "queueId" : mcode,
                        "msgId" : currentTime
                    }
                }
            }
            talk.send(json);
        },
        requestHuman:function(){
            if(skillsgroup){
                talk.skills();
                return false;
            }
            var currentTime = +new Date();
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/stateful/send",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" : {
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "content":{
                        "createTime" : currentTime,
                        "msgType" : "request_access_human_service",
                        "msgId" : currentTime
                    }
                }
            }
            talk.send(json);
        },
        close:function(param){
            var reason = param || 1;
            if(window.WebSocket && socketHook){//支持websocket的使用websocket
                var json = {
                    "header" :{
                        "requestId" : (new Date() - 0).toString(32),
                        "requestURI" : "/stateful/quit",
                        "prefix" :{
                            "appId" : "000001001",
                            "version" : "1",
                            "platform" : plat
                        }
                    },
                    "body" : {
                        "sessionId":sessionId,
                        "fromUserId":userid,
                        "reason":reason
                    }
                }
                talk.send(json);
            }else{
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    url:apiUrl + "/stateful/quit",
                    data:{
                        "sessionId":sessionId,
                        "fromUserId":userid,
                        "reason":reason
                    },
                    success:function(data){
                        if(!data.errcode){
                            window.sendquest = false;
                            //清空localstorage和sessionToken的cookie
                            require("./cookie").storage.clear();
                            require("./cookie").cookie("sessionToken","",{"expires":-1});
                        }else{
                            //提示错误信息
                            require("./errorCode").errorLog(data.errcode);
                        }
                    },
                    error:function(errorRes){

                    }
                });
            }
          talk.surveyDialog(true, true)
        },
        closeSyn:function(){//ajax在关闭浏览器的时候调用
            $.ajax({
                type:"POST",
                dataType:"json",
                async:false,
                url:apiUrl + "/stateful/close",
                data:{
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "reason":1
                },
                success:function(data){}
            });
        },
        parsePic: function(msg){
            var atag = /<a.[^>]*?>([^<]*?)<\/a>/gi;
            var imgTag = /<img.[^>]*?>/gi;
            if(atag.test(msg) || imgTag.test(msg)){//判断如果有a链接的话就不在走过滤，兼容机器人和人工
                return msg;
            }else{
                var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
                msg = msg.replace(reg, '<a target="_blank" href="$1$2">$1$2</a>');
                //处理字符表情eg:[微笑]
                var _exprdata = require("./phiz").exprdata;
                for(var i=0,j=_exprdata.length;i<j;i++){
                    var tmpre = _exprdata[i].phiz.replace(/\[|\]/g,"");
                    if(msg.indexOf(_exprdata[i].phiz)!==-1){
                        var pattern = new RegExp("\\["+tmpre+"\\]","g");
                        msg = msg.replace(pattern,"<img width='32' height='32' alt='"+_exprdata[i].phiztxt+"' src="+window.ctx+"'/static/images/face/"+_exprdata[i].phizsrc+".png' />");
                    }
                }
                return msg;
            }
        },
        getSkills:function(){//获取技能组
            var currentTime = +new Date();
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/stateful/send",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" : {
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "content":{
                        "createTime" : currentTime,
                        "msgType" : "request_human_skills_group_config",
                        "content" : "",
                        "msgId" : currentTime
                    }
                }
            }
            talk.send(json);
        },
        getScore:function(){//获取满意度配置
            var currentTime = +new Date();
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/stateful/send",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" : {
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "content":{
                        "createTime" : currentTime,
                        "msgType" : "request_human_score_config",
                        "content" : "",
                        "msgId" : currentTime
                    }
                }
            }
            talk.send(json);
        },
        // notEndChat 不结束会话
        evaluate:function( notEndChat ){//评价

            if( isEndstatus ){
                if(!chatScore){ //如果没有配置数据直接关掉浏览器
                    window.close();
                    return false;
                }
            }

            var msg = require("./smarty").tmpl("tmpKfscore",chatScore);

            require("./pop").chatPop({
                title:langconfig.sSurvey,
                content:msg,
                btns : true,
                pass : !isEndstatus
                //pass : window.pass
            });
            //插入dom后操作方法
            setTimeout(function(){
                var scoreBtn = $(".active_button");
                scoreBtn.on("click",function(e){
                    e.preventDefault();
                    //避免用户点击太快点击两次了
                    $(this).hide();
                    //
                    deal($(this));
                });
            },0);
            //
            function deal(obj){
                var oWrap = obj.closest(".score");
                var option = oWrap.find(".score_select").find("input:checked").val();
                window.errorTip = oWrap.find(".error");
                var scoreWords = oWrap.find(".score_content").val();
                var len = scoreWords.length;
                //发送满意度评价
                var currentTime = +new Date();
                var json = {
                    "header" :{
                        "requestId" : (new Date() - 0).toString(32),
                        "requestURI" : "/stateful/send",
                        "prefix" :{
                            "appId" : "000001001",
                            "version" : "1",
                            "platform" : plat
                        }
                    },
                    "body" : {
                        "sessionId":sessionId,
                        "fromUserId":userid,
                        "content":{
                            "createTime" : currentTime,
                            "msgType" : "request_commit_score",
                            "msgId" : currentTime,
                            "ratingId":option,
                            "comment":scoreWords
                        }
                    }
                }
                talk.send(json);
                window.chatScore = null;

                // 隐藏满意度评价小红点
                $('#chatEvaluate em').hide();
                $("#close-pop").trigger("click");
                if( isEndstatus )
                {
                    setTimeout(function(){
                        window.close();
                    },800);
                }

            }
        },
        getObj:function(id,arr){
            var index = "";
            $.each(arr,function(i,el){
                if(id == el.id){
                    index = i;
                }
            });
            if(index !== ""){
                return arr[index];
            }
        },
        getTop:function(arr){
            var index = 0;
            $.each(arr,function(i,el){
                if(el.top){
                    index = i;
                }
            })
            return arr[index];
        }
    }
    exports.talk = talk;
});