'use strict';
var CLICK = 'click',
    DEFAULT_USER_AVATAR = window['uae_image_root'] + '/cs/public/images/user_avatar.png',
    DEFAULT_SERVICE_AVATAR = window['uae_image_root'] + '/cs/public/images/service_avatar.png',
    IM_CUSTOMER_TYPE = 'UC_OPEN',//CSIM客户标识
    IM_SERVICER_TYPE = 'UC_PORTAL',//CSIM客服标识
	jym = 'jym';

var tmpl = window.tmpl,
    myUtil = myUtilInit(),
    chatroom = chatroomInit(),
    evaluate = evaluateInit(),
    picModal = picModalInit();
faceInit();
// 优化手机点击事件
window.FastClick.attach(document.body);
// demo -- 获取模板信息
// var templateProp = eval('('+$('#templateProp').val()+')');

var messages = {
	title : 'UC在线客服',
	welcome : '您好，请一句话完整描述您的问题，以便我们为您安排专业的客服。',
	notlogin : '',
	connecting : '亲，正在为您连接客服，请耐心等待。',
	//connected : '客服连接成功。客服{0}已进入会话为您服务。',
	connected : '客服连接成功。客服{0}已进入会话为您服务。',
	//evaluation : '为了更好地帮助UC姐成长，请稍后对本次服务评价，么么哒~',
	evaluation : '为了更好地帮助UC姐成长，请稍后对本次服务评价，么么哒。',
	wait : '亲，正在为您跟进，请您耐心等待。'
}

/**
 *  聊天室控制
 *  @return {method} send           发送内容
 *  @return {method} sendTips       发送系统提示
 *  @return {method} show           显示工具
 *  @return {method} hideWidge      隐藏底部工具栏
 *  @return {method} reConnect      重新连接
 *
 */
function chatroomInit() {
    var chatroom = document.getElementById('chatroom'),
        main = document.getElementById('main'),
        footer = document.getElementById('footer'),
        widgePanel = document.getElementById('widge_panel'),
        widgePanelJym = document.getElementById('widge_panel_jym'),
        facePanel = document.getElementById('face_wrap'),
        input = document.getElementById('input_box'),
        sendBtn = document.getElementById('send_btn'),
        callWidgeBtn = document.getElementById('call_widge_btn'),
        faceBtn = document.getElementById('widge_face_btn'),
        picBtn = document.getElementById('widge_pic_btn'),
        evaluateBtn = document.getElementById('widge_evaluate_btn'),
        waitMinute = window['customer_wait_minute'];
    
    //TODO 是否开始倒数
    var isReciprocal = false;
    
    // TODO 是否连接
    var isConnect = true,
        timeTipsData = {
            timer: null,
            lastStamp: 0
        };

    function init() {
        bindEvent();
    }

    function show(type) {
        hideWidge();
        switch (type) {
            case 'widge':
                widgePanel.style.display = 'block';
                break;
            case 'face':
                facePanel.style.display = 'block';
                break;
            case 'widge_jym':
            	widgePanelJym.style.display = 'block';
        }
    }

    function hideWidge() {
        widgePanel.style.display = 'none';
        facePanel.style.display = 'none';
        if (sys == jym) widgePanelJym.style.display = 'none';
    }

    function bindEvent() {
        var keyboardFlag = false;

        myUtil.addHandle(callWidgeBtn, CLICK, function() {
            keyboardFlag = false;
            if (sys == jym){
            	$('#widge_panel_jym').toggle();
            }
            else show('widge');
        });

        myUtil.addHandle(faceBtn, CLICK, function() {
            show('face');
        });

        //myUtil.addHandle(evaluateBtn, CLICK, function() {
        //    evaluate.show();
        //});

        myUtil.addHandle(chatroom, CLICK, function(e) {
            e = e || window.event;
            keyboardFlag = false;
            hideWidge();

            var el = e.target;
            if(el.nodeName === 'IMG') {
                picModal.show(el.src);
            }
        }, true);

        myUtil.addHandle(input, 'focus', function() {
            hideWidge();
        });

        myUtil.addHandle(sendBtn, CLICK, function() {
            var content = myUtil.trim(input.value);
            if (content) {
                var data = {
                    role: 'user',
                    type: 'talk',
                    avatar: DEFAULT_USER_AVATAR,
                    content: content
                };
                console.log('--- sendBtn click:' + serviceExecutor.isServicing());
                if(serviceExecutor.isServicing()) {//客服为其服务中
                    data.start = true;
                    send(data);
                    if(serviceExecutor.isRestart() === false){
                        data['content'] = content;
//                        alert(JSON.stringify(data));
                        sendServer(data);
//                        imHandler.send(data);   -- liusu 发送消息
                        //startServiceMonitor();//开启客服回复监控
                    }
                }else{
                    data.start = false;
                    send(data);
                    sendServer(data);
//                    serviceExecutor.startExecutor(content); -- liusu 分配客服
                    //将用户的第一次的话插入页面中，分配成功后清空
                    data['content'] = content;
                    serviceExecutor.addContents(data);
                    if((monitorMaper['customer'].isDisconnected() === true) && (serviceExecutor.isRestart() === false)) {
                        sendTips('亲，由于您已经退出客服会话，如需帮助，请<a href="javascript:void(0);" onclick="serviceExecutor.restartExecutor(this);" style="">重新连接</a>');
                    	//sendTips(formatLink(templateProp['offiline_quit'],"<a href='javascript:void(0);' onclick='serviceExecutor.restartExecutor(this);' style=''>","</a>"));
                    }else{
                        sendTips(messages.connecting);
                    }
                }
                input.value = '';
            }
        });

        function sendServer(data){
             $.ajax({
                        url: '../../cs/UserController/send',
                        data: {userId:$("#userId").val(), dialogId: $("#dialogId").val(), content: JSON.stringify(data)},
                        dataType: "script",
                        cache: true
                    });
        }

        myUtil.addHandle(input, 'blur', function(){
            if (input.value && keyboardFlag) {
                this.focus();
            } else if (!input.value) {
                keyboardFlag = false;
            }
        });

        if(input.oninput) {
            myUtil.addHandle(input, 'input', function() {
                if (input.value) {
                    keyboardFlag = true;
                } else {
                    keyboardFlag = false;
                }
            });
        } else {
            myUtil.addHandle(input, 'change', function() {
                if (input.value) {
                    keyboardFlag = true;
                } else {
                    keyboardFlag = false;
                }
            });
        }

    }

    /**
     * @param data 发送至聊天窗口内容
     *   {
     *      type: '类型',         必须 talk | pic | face
     *      role: '角色',         必须 user | service
     *      avatar: '头像链接',   必须 DEFAULT_USER_AVATAR | DEFAULT_SERVICE_AVATAR | 链接
     *      content: '内容',
     *      img: '图片或表情链接'
     *   }
     */
    function send(data) {
        if (!isConnect) {
            return;
        }
        var html = null;
        var urlReg = /(https?:\/\/[^\s]+)/g;
        if(!data.isSystem) {
            data.isSystem = false;
        }
        switch (data.type) {
            case 'talk':
                if (data.content) {
                    var match = data.content.match(urlReg);
                    if(match) {
                        for(var i=0, j, url, tmp, stg=[]; i<match.length; i++) {
                            url = match[i];
                            j = data.content.indexOf(url);
                            tmp = data.content.slice(0, j+url.length);
                            data.content = data.content.slice(j + url.length);
                            stg.push(tmp.replace(url, '<a href="javascript:void(0)" onclick="window.open(\'' + url + '\')">' + url + '</a>'));
                        }
                        data.content = stg.join('') + data.content;
                    }
                    html = tmpl('talk_tmpl', data);
                }
                break;
            case 'pic':
                if(!data.picId) {
                    data.picId = 'p' + (new Date()).getTime();
                }
                html = tmpl('pic_tmpl', data);
                break;
            case 'face':
                if (data.img) {
                    html = tmpl('face_tmpl', data);
                }
                break;
            case 'tips':
                if (data.content) {
                    html = tmpl('tips_tmpl', data);
                }
                break;
        }
        if (html) {
            // 移除上一个评价按钮
            if(data.role === 'service' && !data.isSystem) {
                updateEvaluateBtn();
            }
            
            //如果系统已经提示倒计时信息，清除旧的倒计时信息
            if(isReciprocal == true && data.role === 'service' && !data.isSystem){
            	var box = document.getElementById('chatroom');
            	var l = box.children.length,
                el = box.children[l - 1].innerHTML = "";
            }
            
            sendTimeTips();
            render(html);
            if (data.role === 'user') {
            	isReciprocal = false;
                if(data.start) {//开始会话了
                    /**用户发送消息后，开启对客服消息的监控，同时取消自己的无回复监控计时器**/
                    monitorMaper['service'].startMonitor();//开启对客服无回复的监控
                    monitorMaper['customer'].resetMonitor();//关闭用户无回复监控
                }
            }else if(data.role == 'service') {
            	//如果系统已经提示倒计时信息，创建一条新的倒计时信息
            	if(isReciprocal == true && !data.isSystem){
            		updateEvaluateBtn();
            		data.content = format('亲，您已超过{0}分钟没有说话，倒数 {1} s后会自动断开连接。若您还需要客服的服务，请反馈问题。',waitMinute,'<b> &nbsp;&nbsp; </b>');
            		render(tmpl('talk_tmpl', data));
                }
                /**客服发送消息，开启用户回复的监控，并取消对自己的监控，如果3分钟无回复，则显示提醒，倒计时60秒**/
                if(data.start){
                    monitorMaper['customer'].startMonitor();//开启用户无回复监控
                    monitorMaper['service'].resetMonitor();//关闭客服无回复监控
                }
            }
            if(data.type === 'pic') {
            	//客服发送到图片，url取content内容
            	if(data.role == 'service'){
            		data.img = data.content;
            	}
                // 上传成功加载图片, 移除loading并显示图片
                myUtil.loadImg(data.img, function(){
                    var dom = document.getElementById(data.picId);
                    dom.getElementsByTagName('img')[0].src = data.img;
                    dom.className += ' pic-done';
                    dom.removeChild(dom.getElementsByTagName('i')[0]);
                    scrollBottom();
                });
            }
            
            //系统提示倒数60秒 将倒数状态修改为已经倒数
            if(data.isReciprocal){
            	isReciprocal = true;
            }
        }
    }

    // 发送系统提示, content可以是html文本
    function sendTips(content) {
        if (!content) {
            return false;
        }
        var html = tmpl('tips_tmpl', {
            content: content
        });
        render(html);
    }
    function updateEvaluateBtn() {
        var btn = document.getElementById('avatar_evaluate');
        if(btn) {
            btn.parentNode.removeChild(btn);
        }
    }
    
    // 消息时间
    function sendTimeTips() {
    	// 在用户端时间显示
    	var clientTime = parseDate(getSmpFormatDateByLong(localDate, true));// liusu用户端时间 ->原new Date();
        var now = clientTime.getTime(),
            last = timeTipsData.lastStamp;

        if(now - last > 10 * 6000) {
            var content = formatDate(clientTime);// liusu用户端时间 ->原getCurrentTime(clientTime);
                var html = tmpl('time_tmpl', {
                    content: content
                });
            render(html);

            timeTipsData.lastStamp = now;
        } else {
            return false;
        }
    }

    // 上午、下午
    function getCurrentTime(date) {
        var now = date,
            h = now.getHours(),
            m = now.getMinutes(),
            s = now.getSeconds(),
            ret = '';

        if(h < 6) {
            ret += '凌晨';
        } else if(h < 12) {
            ret += '上午';
        } else if(h < 14) {
            ret += '中午';
        } else if(h < 18) {
            ret += '下午';
        } else {
            ret += '晚上';
        }
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        ret += ' ' + h + ':' + m;
        return ret;
    }
    
    // 格式化日期：24小时制
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

    function render(html) {
        var d = document.createElement('div');
        d.innerHTML = html;
        chatroom.appendChild(d.children[0]);
        scrollBottom();
    }

    function scrollBottom() {
        var PADDING = 20;

//        window.requestAnimFrame(function() {
//            main.scrollTop = chatroom.offsetHeight - main.offsetHeight + PADDING;
//        });
    }

    // TODO 重新连接
    function reConnect() {
        alert('connect');
    }

    init();

    return {
        send: send,
        sendTips: sendTips,
        sendTimeTips : sendTimeTips,
        hideWidge: hideWidge,
        reConnect: reConnect,
        scrollBottom: scrollBottom,
        isReciprocal: function(){return isReciprocal;}
    };
}

/**
 * 表情控制
 * @return null
 */
function faceInit() {
    var path = window['uae_image_root'] + '/images/face/',
        faceGif = ['1.gif', '2.gif', '8.gif', '10.gif', '14.gif', '19.gif'];

    function bindEvent() {
        var faceUl = document.getElementById('face_ul'),
            faceLists = faceUl.getElementsByTagName('ul'),
            i;

        for (i = 0; i < faceLists.length; i++) {
            bind(i);
        }

        function bind(i) {
            faceLists[i].addEventListener(CLICK, function(e) {
                e = e || window.event;
                if (e.target.nodeName === 'IMG') {
                    var node = e.target,
                        idx = myUtil.inArray(node.parentNode, this.children) + i * 3;
                    sendFace(path, faceGif[idx]);//发送表情
                    chatroom.hideWidge();
                }
            }, true);
        }
    }

    bindEvent();
}

/**
 * 评价控制
 * @return {method} show     显示评价
 * @return {method} hide     隐藏评价
 * @return {method} getScore 获取评价值
 */
function evaluateInit() {
    var wrap = document.getElementById('evaluate_wrap'),
        evaluateScore = document.getElementById('evaluate_score'),
        scores = evaluateScore.getElementsByTagName('a'),
        textarea = document.getElementById('evaluate_textarea'),
        submitBtn = document.getElementById('evaluate_submit_btn'),
        cancelBtn = document.getElementById('evaluate_cancel_btn'),
        invalidTips = document.getElementById('evaluate_invalid'),
        score = null;
    // 满意为1，一般为0，不满意为-1
    // 可在html里面修改dom节点上data-score属性的值
    function getScore() {
        return score;
    }

    function resetScore() {
        for (var i = 0; i < scores.length; i++) {
            scores[i].className = '';
        }
        score = null;
        hideInvalid();
    }

    // 重置评价内容
    function reset() {
        resetScore();
        textarea.value = '';
    }

    function show() {
        wrap.style.display = 'block';
    }

    function hide() {
        wrap.style.display = 'none';
        reset();
    }
    function showInvalid() {
        invalidTips.style.opacity = '1';
    }

    function hideInvalid() {
        invalidTips.style.opacity = '0';
    }

    function bindEvent() {
        myUtil.addHandle(evaluateScore, CLICK, function(e) {
            e = e || window.event;
            var el = e.target;
            if (el.nodeName === 'A') {
                resetScore();
                el.className = 'select';
                score = el.getAttribute('data-score');
            }
        });

        myUtil.addHandle(submitBtn, CLICK, function() {
            // TODO, 提交评价
            var content = myUtil.trim(textarea.value);
            if (!score) {
                showInvalid();
                return;
            } else {
                comment(content, score);
                hide();
                chatroom.hideWidge();
                chatroom.sendTimeTips();
                chatroom.sendTips('评价成功。谢谢亲的建议！');
                //chatroom.sendTips(templateProp['evaluate_evaluateSuccess']);
                
                // 评价时，如果开始倒数，保留倒计时
                if(chatroom.isReciprocal()){
                	var box = document.getElementById('chatroom');
                	var l = box.children.length,
                	el = box.children[l - 2];
                	box.appendChild(el);
                }
            }
        });

        myUtil.addHandle(cancelBtn, CLICK, function() {
            hide();
        });
        if(myUtil.ua.android) {
            myUtil.addHandle(textarea, 'focus', function() {
                wrap.children[0].className += ' evaluate-focus';
            });

            myUtil.addHandle(textarea, 'blur', function() {
                wrap.children[0].className = wrap.children[0].className.replace(' evaluate-focus', '');
            });
        }
    }

    bindEvent();

    return {
        show: show,
        hide: hide,
        getScore: getScore
    };
}

/**
 * 查看大图控制
 * @return {method} show    显示大图
 */
function picModalInit() {
    var modal = document.getElementById('pic_modal');

    function bindEvent() {
        myUtil.addHandle(modal, CLICK, function(){
            hide();
        });
    }

    function show(url) {
        if(url) {
            modal.getElementsByTagName('img')[0].src = url;
            modal.style.display = 'block';
        }
    }

    function hide() {
        modal.style.display = 'none';
    }

    bindEvent();

    return {
        show: show
    };

}

/**
 * 自定义工具函数
 * @return {method} inArray     是否在数组内
 * @return {method} trim        去除空格
 * @return {method} addHandle   绑定事件
 * @return {method} hideBar     隐藏地址栏
 *
 */
function myUtilInit() {
    var ua = navigator.userAgent.toLowerCase(),
        browser = {
            wechat: !!ua.match(/MicroMessenger/i),
            uc: !!ua.match(/UCBrowser/i),
            weibo: !!ua.match(/weibo/i),
            ios: !!ua.match(/iPhone/i),
            android: !!ua.match(/Android/i)
        };

    init();

    function init() {

        adapt();

        addHandle(window, 'resize', function() {
            adapt();
        });
    }

    function inArray(item, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return false;
    }

    // wrap高度调整
    function adapt() {
        var main = document.getElementById('main'),
            inputPanel = document.getElementById('input_panel'),
            chatroomTips = 0,
            h = document.documentElement.clientHeight;
        if(document.getElementById('chatroom_tips'))
        	chatroomTips = document.getElementById('chatroom_tips').clientHeight;
        
        main.style.height = h - inputPanel.clientHeight - chatroomTips + 'px';
    }

    function addHandle(elem, evtype, fn, upon) {
        upon = upon ? true : false;
        if (elem.attachEvent) {
            elem.attachEvent('on' + evtype, fn);
        } else if (elem.addEventListener) {
            elem.addEventListener(evtype, fn, upon);
        } else {
            elem['on' + evtype] = fn;
        }
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/gm, '');
    }

    // 隐藏地址栏
    function hideBar() {
        window.scroll(0, 1);
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

    return {
        inArray: inArray,
        trim: trim,
        addHandle: addHandle,
        hideBar: hideBar,
        ua: browser,
        loadImg: loadImg
    };

}

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };