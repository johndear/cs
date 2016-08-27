/**
 * Created with JetBrains WebStorm.
 * User: sunxh
 * Email:sunxiaohui@xiaomi.com
 * Date: 14-1-6
 * Time: 下午8:59
 * To change this template use File | Settings | File Templates.
 */
define(function(require,exports,module){
    require("./jquery.1.9.2.js");
    $(function($){
        //声明变量
        var oInput = $("#inarea");
        var oSubmit = $("#submit-btn");
        var oSuggest = $("#suggest");
        var oBcardbox = $("#bcard");
        var oBcardInner = oBcardbox.find("#bcard-inner");
        var tabIndex = -100;
        var toolbar = $("#toolbar");
        var faceBox = $("#facebtn");
        var upload = $(".upload");
        var frontPic = $("#front-pic");
        var backPic = $("#back-pic");
        var quitBtn = $("#closechat");
        var suggestTimer = null;
        //初始化接口
        require("./init.js").getAgent(function(status){
            //初始化变量
            window.username = require("./cookie.js").cookie("userName");  //获取昵称
            window.selfname = (require("./getUser").getNickname(userid))?(require("./getUser").getNickname
(userid)):(window.userid ? window.userid : "游客");      // 用户自己昵称
            window.myName = "我" ;         //使用者的昵称
            window.nickname = ""           // 客服昵称
            window.robotname = "米兔";      //机器人昵称
            window.appsession = true;      //app一次完成的回话，包括机器人和人工
            window.isEndstatus = false;    //是否已经结束（用来判断结束状态）
            window.startSpeak = false;     //客服第一次说话
            window.sendquest = true;  // 要不要在发送listen请求
            window.face = false;      //是否显示表情和图片上传默认否
            window.joined = false;    //客服加入
            window.limitTimer = null;  // 机器人限制suggest数量
            window.isFast = 0;         // 限制太频繁输入提交
            window.avatar = "";        // 头像
            window.pass = true;       //经过机器人,默认是经过机器人，如果是true表示不经过机器人
            window.transposon = false; //有没有转过人工
            window.skillsgroup = "";   //技能组数据
            window.chatScore = "";     // 满意度评价数据
            window.mayAccessHuman = "";//是否可以转人工
            window.shortcutAsk = [];   //快捷问（目前已废弃作为本地提示使用）
            window.isSuggest = true;   // 是否要调用建议问，默认是调用
            window.kfRole; /*此字段来区分人工和客服状态    2表示人工客服，3表示机器人*/
            //获取时区
            try{
                window.timeZone = new Date().getTimezoneOffset() / 60;
                if(timeZone > 0){
                    if(timeZone < 10){
                        timeZone = "GMT-0" + timeZone + "00";
                    }else{
                        timeZone = "GMT-" + timeZone + "00";
                    }
                }else {
                    if(timeZone > -10){
                        timeZone = "GMT+0" + (timeZone * -1) + "00";
                    }else{
                        timeZone = "GMT+" +  (timeZone * -1) + "00";
                    }
                }
            }catch(e){
                window.timeZone  = "";
            }
            window.plat="web";        //platform 平台名称，在这里是定值就是web
            window.pingCounter = 0;   //ping的计数器 （为断线重连策略使用）
            window.region = require("./getQueryStr").getQueryString("region") || "cn";      //默认就是大陆

            //window.lang = require("./getQueryStr").getQueryString("_locale") || "zh_CN";        //
简体中文（现在有jsp提供）
            //window.channel = require("./getQueryStr").getQueryString("channel") || "cn.web.mi";   
     //简体中文（现在有jsp提供）
            window.langconfig = require("./lang.js")[lang];  // 多语言获取当前语言的提示文字
            $.extend(window.langconfig,window.selfLang);     // 此字段为不同地区显示的数量不同来准备的
            if(window.location.href.indexOf("mcode") != -1){ //区分简繁，繁体版不需要选择技能组（繁体版是写死了技能组）
                window.userchoosecode = require("./getQueryStr").getQueryString("mcode");
            }else{
                window.userchoosecode = "";
            }
            //转人工
            window.tranfer = function(){
                require("./talk").talk.requestHuman();
            };
            //评价
            window.scoreChat = function(){
                setTimeout(function(){
                    require("./talk").talk.evaluate();
                },100)
            };
            //记录聊天的最后一个messageId
            window.addastMsgId = function(id){
                require("./cookie").cookie("lastMsgId",id,{expires:1});
            }
            window.removeLastMsgId = function(id){
                require("./cookie").cookie("lastMsgId","",{expires:-1});
            }
            //显示头像（主要是机器人的时候不推送头像信息）
            window.showAvatar = function(){
                if( window.avatar == 0){
                    window.avatar = window.ctx+"/static/images/girl.jpg";
                }else if(window.avatar == 1){
                    window.avatar = window.ctx+"/static/images/boy.jpg";
                }else if(window.avatar == "avatar_tpl"){
                    window.avatar = window.ctx+"/static/images/avatar_tpl.jpg";
                    return false;
                }
                frontPic.fadeOut(0,function(){
                    $(this).attr("src",window.avatar).addClass("tpl-img").show();
                    // mifen2016 start
                    $(this).wrap('<div class="kfInfoFrontPic"></div>');
                    if( window.kfInfo.medals && window.kfInfo.medals.length > 0 ){
                        $(this).parent().removeClass('noStar').after('<div class="kfInfoStar"></div>'
);
                    }else{
                        $(this).parent().addClass('noStar')
                    }
                    // mifen2016 end
                });

                // mifen2016 start
                backPic.hide().parent().append(
                    '<div class="kfInfo">' +
                        '<div class="kfInfo-avatar"><img src="'+window.avatar+'" /></div>' +
                        '<div class="kfInfo-detail">' +
                            '<div class="kfInfo-name"><span>'+ window.nickname +'</span>'+( window.kfInfo
.medals && window.kfInfo.medals.length > 0 ? '<em></em>' : '' )+'</div>' +
                            '<div class="kfInfo-tip">您是'+(window.kfInfo.gender == 1 ? '他' : '她')+'服务
的</div>' +
                            '<div class="kfInfo-number">第<span>'+ (window.kfInfo.totalServiceAmount 
|| 1) +'</span>位用户</div>' +
                        '</div>' +
                        '<div class="kfInfo-current">为您服务<span>'+ (window.kfInfo.currentServiceNo ||
 1) +'</span>次</div>' +
                    '</div>'
                );
                // 显示 满意度评价按钮
                $('#chatEvaluate').show();
                // mifen2016 end
            }
            //隐藏工具条
            window.closeBar = function(){
                toolbar.hide();
            };
            //过滤标签防止xss
            window.escapeHtml = function(unsafe) {
                return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace
(/"/g, "&quot;").replace(/'/g, "&#039;");
            };
            //拉取快捷问数据 （刚刚调整的，不再需要这个）
            //require("./suggest").getSuggest();
            //初始化聊天，调用open接口
            require("./talk").talk.open();

            //点击发送消息
            oSubmit.on("click",function(e){
                e.preventDefault();
                if(isEndstatus){//如果回话结束将不能发送消息
                    require("./notice").news(langconfig.chatOver,true);
                    return false;
                }
                //限制恶意的快速发送消息
                if(window.isFast > 0){
                    var delta = e.timeStamp - isFast;
                    isFast = e.timeStamp;
                    if(delta < 1000){
                        require("./notice").news(langconfig.sendQuick,false);
                        return false;
                    }
                }else{
                    window.isFast = e.timeStamp;
                }
                var msg = $.trim(oInput.val());
                msg = escapeHtml(msg);
                var oldMsg = msg; //发送给客服不需要表情文字转成图片
                var reg = /\[[\u4e00-\u9fa5,good,ok]+\]/g;  //匹配表情编码例如[微笑]
                var _exprdata = require("./phiz").exprdata;
                var len = _exprdata.length;
                if(msg == "") {
                    require("./notice").news(langconfig.noEmpty,false);
                    return false;
                };
                var reglink = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;  //匹配url（里面有许多的需求要求自己
或者客服发送的消息里面包含url要转化成可以点击的）
                msg = msg.replace(reglink, '<a target="_blank" href="$1$2">$1$2</a>');
                //
                msg = msg.replace(reg,function(data){
                    var arr = [];
                    var returnHook = false;
                    for (var i = 0; i < len; i++) {
                        if(_exprdata[i].phiz == data){
                            returnHook = true;
                            arr.push('<img width="32" height="32" class="face-emoji" src='+window.ctx
+'"/static/images/face/'+_exprdata[i].phizsrc+'.png" alt="'+_exprdata[i].phiztxt+'">');
                        }
                    };
                    return returnHook ? arr : data;
                });
                //
                require("./render").selfRender(window.myName,msg); //聊天发给自己
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
                            "msgType" : "text",
                            "content":oldMsg,
                            "msgId" : currentTime
                        }
                    }
                }
                require("./talk").talk.send(json);
                //置空输入框
                oInput.val("");
            });

            //提交
            oInput.on("keyup",function(e){
                window.eventType = e.type;
                var len = oSuggest.children().length;
                if(e.keyCode == 13 || (e.ctrlkey && e.keyCode == 13)){
                    if(oSuggest.css("display") == "block" && oSuggest.find(".over").length > 0){
                        sendMsg(false,oSuggest.find(".over"));
                        statSuggest(oSuggest.find(".over"));
                    }else{
                        sendMsg(true);
                    }
                    //one = false;
                }else if(e.keyCode == 38){ //上
                    if(tabIndex == -100){
                        tabIndex = len - 1;
                    }else{
                        tabIndex = oSuggest.children(".over").index() - 1;
                    }
                    if(oSuggest.css("display") == "block" && len > 0){
                        if(tabIndex > -1){
                            oSuggest.children().eq(tabIndex--).addClass("over").siblings().removeClass
("over");
                        }else{
                            oSuggest.children().removeClass("over");
                            tabIndex = -100;
                        }
                    }
                }else if(e.keyCode == 40){//下
                    if(tabIndex == -100){
                        tabIndex = 0;
                    }else{
                        tabIndex = oSuggest.children(".over").index() + 1;
                    }
                    if(oSuggest.css("display") == "block" && len > 0){
                        if(tabIndex < len){
                            oSuggest.children().eq(tabIndex++).addClass("over").siblings().removeClass
("over");
                        }else{
                            oSuggest.children().removeClass("over");
                            tabIndex = -100;
                        }
                    }
                }else{
                    //在机器人不能用或者机器人已经结束的时候不在显示suggest
                    if(window.isEndstatus) return;
                    var msg = $.trim($(this).val());
                    if(msg != "" && window.kfRole === 3) {
                        if(!isSuggest) return;
                        clearTimeout( suggestTimer );
                        suggestTimer = setTimeout(function(){
                            require("./suggest").suggest(msg);
                        }, 200);
                    }else{
                        require("./suggest").suggestHide();
                        tabIndex = -100;
                    }
                }
            });
            //suggest鼠标操作
            $("#suggest").on("mouseenter","a",function(e){
                $(this).removeClass("over").siblings().removeClass("over");
                tabIndex = $(this).index();
            });
            //点击触发
            oSuggest.on("click","a",function(e){
                e.preventDefault();
                //
                sendMsg(false,$(this));
                //
                statSuggest($(this))
            });
            //发消息
            function sendMsg(bol,obj){
                if(bol){
                    oSubmit.trigger("click");
                    require("./suggest").suggestHide();
                }else{
                    oInput.val(obj.text());
                    oSubmit.trigger("click");
                    require("./suggest").suggestHide();
                }
                tabIndex = -100;
            };
            //统计suggest点击的接口
            function statSuggest(obj){
                var msg = obj.text();
                $.ajax({
                    type:"GET",
                    dataType:"json",
                    url:window.ROOT + "/api/suggest/selected",
                    data:{"question":msg},
                    success:function (res) {}
                });
            }
            //resize 初始化调用下全局的方法下面的都是类似
            require("./resize.js");
            //表情
            require("./phiz.js").faceFn();
            //初始化上传
            require("./upload").upload.init();
            //清除闪动提示
            $("body").on("click",function(){
                require("./shake").shakeClear();
            });
            //切换名片
            oBcardInner.on("click",function(){
                $(this).toggleClass("turn");
            });
            //点击结束回话按钮
            require("./closeChat").closeChat();
            //临时新增的转人工接口（当时说是临时的，现在估计就是这样了）
            $("#transferperson").click(function(e){
                e.preventDefault();
                if(window.userchoosecode){
                    require("./notice").news(langconfig.startConect,false);
                }else{
                    tranfer();
                }
            });
            //点击机器人的功能链接
            $("#chatlist").off("click").on("click","a",function(e){
                var $this = $(this);
                if($this.hasClass("transfer-person")){
                    if(window.userchoosecode){
                        require("./notice").news(langconfig.startConect,false);
                    }else{
                        tranfer();
                    }
                }
                if($this.attr("href") == "#"){ //动态菜单指令
                    e.preventDefault();
                    var msg = $this.text();
                    oInput.val(msg);
                    oSubmit.trigger("click");
                }
            });

        });
    });
});