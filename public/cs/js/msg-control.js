/**
 * Created by hongjm on 2015/5/26.
 */
'use strict';

chatApp.controller('csosCtrl', function ($scope, $http, closeDivFactory, csInfoFactory,chatEnum) {

	var feedback_sys = 'feedback_sys';
    var serviceIM = null;
    $scope.Dept = chatEnum.Dept;
    
    /**
     * 会话处理器
     * @param events
     */
    var dialogHandler = function (events, dialogId) {
        if (events) {
            for (var index = 0; index < events.length; index++) {
                var event = events[index];
                var eventType = event.type;
                switch (eventType) {
                    case 'INIT_DIALOG':
                        displayDialog(event);
                        break;
                    case 'FLICKER':
                        updateFlicker(event);
                        break;
                    case 'MESSAGE':
                        //displayMessage(event);
                    	displayMessage(event,dialogId);
                        break;
                    case 'HISTORY':
                        displayHistory(event);
                        break;
                    case 'SEND_MESSAGE':
                        afterSend(event);
                        break;
                    case 'CHANGE_CSER':
                        alert("更改对话");
                        break;
                    case 'EVENT':
                        var eventMsg = {};
                        try{
                            eventMsg=JSON.parse(event['eventMessage']);
                        }catch(error){
                        }
                        if ('online_close' == eventMsg.type) {
                            var offline_user = getUserByDialogId(eventMsg.dialogId);
                            offlineUser(offline_user);
                            //timeout_offlineUser(offline_user);
                            $scope.sendMessage(offline_user, '用户离线啦~', 'sys', 'sys');

                        } else if ('change' == eventMsg.type) {
                            console.log('客服转单过来了...', eventMsg.extendMsg);
                            var extendMsg = JSON.parse(eventMsg.extendMsg);

                            // 加入新会话
                            event.dialogId = {};
                            event.dialogId.dialogId = eventMsg.dialogId;
                            var user = updateFlicker(event, 1);
                            // 载入前一个客服的聊天记录
                            initMessages(user);
                            // 加入转单提示文字
                            showChangeMsg(user, extendMsg.type, extendMsg.currentCsNickName, extendMsg.description);

                        }else if('login' == eventMsg.type){
                        	loginJYM(eventMsg.dialogId,eventMsg.receiverId);
                        	//查询下服务记录信息
                        	$scope.$broadcast('login.type', eventMsg.dialogId);
                        }else if('report' == eventMsg.type){
                        	// 处理举报单 - 黄玉云 2015/12/21
                        	dealReport(eventMsg);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

    };
    
    var setAccount = function(dialogId,customerId){
    	var user = getUserByDialogId(dialogId);
    	if(!user.baseInfo){
    		setTimeout(setAccount(dialogId), 1000);//每秒检测用户信息是否已获取到
    	}else{
    		user.baseInfo.account = customerId;
    		user.messages.push({
                'role': 'kf',
                'username': sys_type,
                'content': '用户已登录，用户信息以及服务记录信息已自动更新。',
                'type': sys_type,//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】
                'time': formatDate(serverDate)// liusu服务端时间 ->原formatDate(new Date())
            });
    	}
    }
    
    var loginJYM = function(dialogId,customerId){
    	var user = getUserByDialogId(dialogId);
    	if(user && customerId != user.userId){
        	var isExist = false;
        	angular.forEach(user.messages, function(value, key) {
        		 if(!isExist){
        			 if(value.content == '用户已登录，用户信息以及服务记录信息已自动更新。')
        				 isExist = true;
        		 }
    		});
        	if(!isExist){
        		setAccount(dialogId,customerId);
        	}
    	}
    }

    /**
     * 会话启动
     */
    var start = function () {
        serviceIM = $.csim({
            isSimple: false,
            packetSize: 10,
            fetchDialogs: true,
            callback: dialogHandler
        });
    };

    /**
     * im发送消息
     * @param selectedDialog
     * @param content
     */
    var send = function (selectedDialog, content) {
        if (!serviceIM) {
            start();
        }
        serviceIM.send(selectedDialog, 'CHAT', content);
    };

    /**
     * 关闭会话
     * @param dialogid
     */
    var close = function (dialogid) {
        serviceIM.close(dialogid);
    };
    
    /**
     * 关闭会话
     * @param dialogid
     */
    var timeout_close = function (user) {
    	//调用与客服主动关闭会话一样的逻辑
    	timeout_close_post(user);
    };

    function saveReplayTime(dialogid, total, count) {
        $http({
            method: 'POST',
            url: path + '/cs/WorkBenchController/saveReplayTime',
            params: {
                dialogId: dialogid,
                total: total,
                count: count
            }
        }).success(function (data) {
        });
    }

    start(); // 连接聊天核心啦O(∩_∩)O

    //-----------------------------------------业务处理 begin----------------------------------------------

    //用户列表
    $scope.userList = [];
    //在线用户长度
    $scope.onlineSize = 0;
    //在线用户长度
    $scope.offlineSize = 0;
    //
    //// 会话-客服未回复计时对象
    //$scope.timer_obj = {};
    
    //已经反馈用户列表，目前只显示一条数据，为后续扩展，还是用数组保存		add by liaostr
    $scope.feedbackList = [];
    
    // 是否会话数达到一定数据，停止进单
    $scope.isStop = false;

    $scope.csInfo = {};

    $scope.activeUserObj = {};

    //客服，用户聊天头像
    $scope.serviceAvatar = "/cs/public/images/service_avatar.png";
    $scope.userAvatar = "/cs/public/images/user_avatar.png";
    //判断交易猫头像
    if(deptId == $scope.Dept.jym){
    	$scope.serviceAvatar = "/cs/public/images/service_avatar_jym.png";
        $scope.userAvatar = "/cs/public/images/user_avatar_jym.png";
    }

    /**
     * 用户进线
     */
    var addToUserList = function (user) {
    	 $scope.userList.splice(0, 0, user);

    	 //第一个用户默认打开
        if($scope.userList.length<=1){
            selectActiveUser(user);
        }
        $scope.onlineSize++;

        //计时开启
        receiveTimerCount(user);
        initMessages(user);
    };
    
    /**
     * 用户在线超时结束会话
     */
    var timeout_offlineUser = function (user) {		
        timeout_close(user);
    };
    
    /**
     * 结束会话
     */
    var offlineUser = function (user) {
		logger('关闭会话', 'user:' + JSON.stringify(user));
        user.closed = true;
        $scope.onlineSize--;
        $scope.offlineSize++;
        // 清空计时
        clearTimerCount(user);
        // 关闭后，设置归档/升级按钮为可用
        showArchButtons(user);
        // 保存响应时长、对话次数
        if (user.dialogReplayTime) {
            saveReplayTime(user.dialogId, user.dialogReplayTime.total, user.dialogReplayTime.count);// 记录客服与该用户，响应时长之和（每次请求-响应的时长之和）、对话次数
        }
        close(user.dialogId);

        if ($scope.onlineSize <= 0) {
            $scope.$broadcast("NO_ONLINE_CUSTOMER");
        }
    };
    
    /**
     * 客服主动结束会话时回调
     */
    var offlineUserByCS = function (user) {
        user.closed = true;
        $scope.onlineSize--;
        $scope.offlineSize++;
        // 清空计时
        clearTimerCount(user);
        // 关闭后，设置归档/升级按钮为可用
        showArchButtons(user);
        // 保存响应时长、对话次数
        if (user.dialogReplayTime) {
            saveReplayTime(user.dialogId, user.dialogReplayTime.total, user.dialogReplayTime.count);// 记录客服与该用户，响应时长之和（每次请求-响应的时长之和）、对话次数
        }

        if ($scope.onlineSize <= 0) {
            $scope.$broadcast("NO_ONLINE_CUSTOMER");
        }
    };

    /**
     * 移除会话（转单的时候用到、升级归档的时候用到）
     */
    $scope.removeUser = function (dialogId) {
        var remove_user;
        for (var i = 0; i < $scope.userList.length; i++) {
            if (dialogId == $scope.userList[i].dialogId) {
                remove_user = $scope.userList[i];
                $scope.userList.splice(i, 1);
                // 清空计时
                clearTimerCount(remove_user);
                // 保存响应时长、对话次数
                if (remove_user && remove_user.dialogReplayTime) {
                    saveReplayTime(dialogId, remove_user.dialogReplayTime.total,remove_user.dialogReplayTime.count);// 记录客服与该用户，响应时长之和（每次请求-响应的时长之和）、对话次数
                }
                break;
            }
        }
        if (remove_user && remove_user.closed) {
            $scope.offlineSize--;
        } else {
            $scope.onlineSize--;
        }

        if ($scope.onlineSize <= 0) {
            $scope.$broadcast("NO_ONLINE_CUSTOMER");
        }

        return remove_user;
    };


    /**
     * 清除所有在线会话（后台自动离线之后用到）
     */
    $scope.clearAllActiveUser=function(){
        for (var i = 0; i < $scope.userList.length; i++) {
            var user = $scope.userList[i];
            if(!user.closed){
                offlineUser(user);
            }
        }
    }

    /**
     * 通过dialogId获取user对象
     * @param dialogId
     * @returns {*}
     */
    var getUserByDialogId = function (dialogId) {
        for (var i = 0; i < $scope.userList.length; i++) {
            if (dialogId == $scope.userList[i].dialogId) {
                return $scope.userList[i];
            }
        }
    }

	/**
     * 通过userId获取在线user对象
     * @param userId
     * @returns {*}
     */
    var getOnlineUserByUserId = function (userId) {
        for (var i = 0; i < $scope.userList.length; i++) {
            var user=$scope.userList[i];
            if (!user.closed && userId == user.userId) {
                return user;
            }
        }
    }


    /**
     * 选中当前active用户会话
     * @param user
     */
    var selectActiveUser = function (user) {
    	user.prdType = 'csos_sys';
        var dialogId = user.dialogId;
        $scope.selectedUserId = dialogId;
        serviceIM.select($scope.selectedUserId, 0);
        $scope.activeUserObj = user;
        $scope.activeUser = dialogId;
    };

    var getCsInfo = function (callback) {
        if (!$scope.csInfo.userId) {
            csInfoFactory.getCsInfo().success(function (data) {
                $scope.csInfo = data.csInfo;
                $scope.enableUpg=data.enableUpg
                if($scope.csInfo.deptId!=2){
                	$(".app-upgrade").css("height","155px");
                }
                csInfoFactory.setCsInfoData(data);
                if (callback) {
                    callback(data);
                }
            });
        }
    };
    
    var getUserInfo = function (userId, user) {
        window.customerId = userId;
        user.userId = userId;
//        var uid = userId;
//        if(user.customerId){//交易猫id
//        	uid = user.customerId;
//        }
        
        if (!user.baseInfo) {
            $http.get(cswsUrlPrefix + 'ucs/getUserInfo?userId=' + userId + '&isSelfEmployed=' + $scope.csInfo.isSelfEmployed).success(function (data) {
                if (!data.result) {
                    data.result = {};
                }
                var city = '';
                if (data.result.country) {
                    city += data.result.country + ''
                }
                if (data.result.prov) {
                    city += data.result.prov
                }

                if (data.result.city) {
                    city += data.result.city
                }
                user.baseInfo = {
                    recordId: data.result.recordId,
                    platform: data.phonePlantForm,
                    version: data.result.ver,
                    mi: data.result.mi,
                    city: city,
                    nw: data.result.nw,
                    nt: data.ntName,
                    instanceName: data.instanceDescription,
                    account: data.result.uid,
                    exAttr: data.exAttr,
                    instance: data.result.instance,
                    moreInfo: data.moreInfo,
                    sn : data.sn
                };

                if (data.nickNameStr) {
                    user.nickName = data.nickNameStr;
                }
                if (data.phonePlantFormId) {
                    user.phonePlantFormId = data.phonePlantFormId;
                }
            });
        } else {
            console.log(userId + '已经拿到用户信息');
        }
    };


    $scope.skillgroups = [];
    $scope.loadSkillGroups = function (callback) {
        csInfoFactory.getSkillGroups().success(function (data) {
            var skillGroups = data.skillgroups;
            for (var i in skillGroups) {
                var skillGroup = {"value": skillGroups[i].skillGroupId, "label": skillGroups[i].skillGroupName};
                $scope.skillgroups.push(skillGroup);
            }
            if (callback) {
                callback();
            }
        });
    };

    $scope.loadSkillGroups();

    /**
     * 1、请求csos关闭会话
     * 2、把对话从左上角移动到左下角
     * @type {{getMonitor, registerMonitor, clearMonitor}}
     */
    //用户离线超时关闭会话
    var monitors = dialogMonitor(function (dialogId) {
       // offline_post(dialogId, doClose);
    	var user = getUserByDialogId(dialogId);
    	offline_close_post(user,doClose);
    });

    var doClose = function (dialogId) {
        var offline_user = getUserByDialogId(dialogId);
        //offlineUser(offline_user);
        $scope.sendMessage(offline_user, '用户掉线啦~', 'sys', 'sys');
    };


    /**
     * 显示升级/归档按钮 并判断是否已经没有需要服务的用户
     * @param offline_user
     */
    var showArchButtons = function (offline_user) {
        if ($scope.enableUpg) {
            offline_user.showUpgrade = true;
        }
        offline_user.showArchived = true;
        offline_user.disableSendBtn = true;
    };

    /**
     * 用户离线超时
     * @param dialogId
     */
    var offline_post = function (dialogId, callback) {
        $http.post(path + '/dialog/api/offline/' + dialogId).
            success(function (data, status, headers, config) {
                if (data.success == true || data.success == 'true') {
					logger('用户离线超时', '会话id:' + dialogId);
                    callback(dialogId);
                }
            })
    };
    /**
     * 客服关闭
     * @param dialogId
     */
    var cs_close_post = function (user) {
    	var dialogId = user.dialogId;
        $http.post(path + '/dialog/api/close/' + dialogId).
            success(function (data, status, headers, config) {
            	if(data && data.success){
            		offlineUserByCS(user);
            	}else if(data && !data.success){
            		var existUser = getUserByDialogId(dialogId);
                    if (existUser && !existUser.closed) {
                    	alert(dialogId+" "+data.extendMsg);
                    	logger('客服关闭会话失败', 'dialogId:' + dialogId);
                    }
            	}
            	
            }).
            error(function (data, status, headers, config) {
            	//关闭会话失败，考虑传送日志到服务器
            	alert(dialogId+" 关闭出现错误,请稍后重试");
				logger('客服关闭会话出现错误', 'dialogId:' + dialogId);
            });
    };

    /**
     * 用户在线超时关闭会话
     * @param dialogId
     */
    var timeout_close_post = function (user) {
    	var dialogId = user.dialogId;
        $http.post(path + '/dialog/api/close/' + dialogId).
            success(function (data, status, headers, config) {
            	if(data && data.success){
            		offlineUserByCS(user);
            	}else if(data && !data.success){
            		var existUser = getUserByDialogId(dialogId);
                    if (existUser && !existUser.closed) {
                    	alert(dialogId+" 在线超时关闭失败,请稍后手动关闭");
                    	logger('在线超时关闭失败', 'dialogId:' + dialogId);
                    }
            	}
            	
            }).
            error(function (data, status, headers, config) {
            	//关闭会话失败，考虑传送日志到服务器
            	alert(dialogId+" 在线超时关闭出现错误,请稍后手动关闭");
				logger('在线超时关闭出错', 'dialogId:' + dialogId);
            });
    };

    /**
     * 用户离线超时关闭会话
     * @param dialogId
     */
    var offline_close_post = function (user, callback) {
    	var dialogId = user.dialogId;
        $http.post(path + '/dialog/api/close/' + dialogId).
            success(function (data, status, headers, config) {
            	if(data && data.success){
            		offlineUserByCS(user);
            		callback(dialogId);
            	}else if(data && !data.success){
            		var existUser = getUserByDialogId(dialogId);
                    if (existUser && !existUser.closed) {
                    	alert(dialogId+" 用户离线超时关闭失败,请稍后手动关闭");
                    	logger('用户离线超时关闭失败', 'dialogId:' + dialogId);
                    }
            	}
            	
            }).
            error(function (data, status, headers, config) {
            	//关闭会话失败，考虑传送日志到服务器
            	alert(dialogId+" 用户离线超时关闭出现错误,请稍后手动关闭");
				logger('用户离线超时关闭出现错误', 'dialogId:' + dialogId);
            });
    };
    
    /**
     * 新用户进线
     * @param $scope
     * @param user
     */
    var add_new_user = function ($scope, user) {
        // 对会话进行排重
        if (duplicateUser($scope.userList, user.dialogId)) {
            console.log('【有重复的会话id进线，返回false，dialogId = ' + user.dialogId + ' 】');
            return false;
        }
      
        //当出现同时增加同一个用户时会报错（updateFlicker和fetchDialogList都会add new user），捕获异常，再次添加
        try{
        	addToUserList(user);
        }catch(e){
        	//重新添加新用户
        	add_new_user($scope, user);
        }

        // 新用户进线提醒
        new Notifications('新用户接入', {
            body: user.nickName + '上线了！'
        });
        
        var allUserSize = $scope.userList.length;
        // 会话数超过20个，给出提示
        if (allUserSize >= csNotifyNumber) {
            msgPop('会话数达到' + allUserSize + '个,请及时归档/升级', timeOut50);
        }
        // 会话数超过30个，停止进单，状态必须是在线
        if (allUserSize >= stopNumber && SERVING == CS_STATUS) {
            $scope.changeStatus('STOP_ALLOCATION');
        }
    };


    /**
     * 客服状态变更
     * 若客服状态为离线或小休，不执行状态的变更
     * @param status ：'STOP_ALLOCATION' - 会话数达到一定数据，停止进单
     *                 'START_ALLOCATION' - 恢复进单
     */
    $scope.changeStatus = function (status) {
        var params = {'servicerId': window['servicerId'], 'servicerStatus': status};
        $http({
            method: 'POST',
            url: path + '/cs/service/status/change',
            params: params
        }).success(function (data) {
            if (data.success) {
                if ('STOP_ALLOCATION' == status) {
                    $scope.isStop = true;
                    msgPop('已停止进单,请及时归档/升级', timeOut50);
                    CS_STATUS = STOP_ALLOCATION;
                    $scope.changeStatusBroad();
                    console.log('【当前会话数为:' + $scope.userList.length + ',停止进单 】');
                } else if ('START_ALLOCATION' == status) {
                    $scope.isStop = false;
                    CS_STATUS = SERVING;
                    $scope.changeStatusBroad();
                    console.log('【当前会话数为:' + $scope.userList.length + ',恢复进单 】');
                }
            }
        }).error(function (data) {
        });
    };

    /**
     * 客服状态变更广播
     */
    $scope.changeStatusBroad = function () {
        $scope.$broadcast("CHANGE_STATUS");
    }

    /**
     * 对会话进行排重
     * @param list
     * @param id
     * @returns {boolean}
     */
    var duplicateUser = function (list, id) {
        if (null != list && '' != list && '' != id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].dialogId == id) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 初始化会话
     * changeCustomer 是否转交客服(显示转字样)
     * @param dialogEvent
     */
    var displayDialog = function (dialogEvent, changeCustomer) {
        var dialogId = dialogEvent.dialogId.dialogId;
        var lastReceivedMsgId = dialogEvent.lastReceivedMsgId;

        var user = {
            "dialogId": dialogId,
            "nickName": dialogId,
            "change": changeCustomer,
            "lastReceivedMsgId": lastReceivedMsgId,
            messages: [],
            "prdType":'csos_sys'
        };
        add_new_user($scope, user);
    };

    /**
     * when refreshed,get all messages of current dialog to show
     */
    var initMessages = function (user) {
        $http.get(path + '/dialog/api/current/history?dialogId=' + user.dialogId).success(function (data) {
            var userId=data.customerId;
            var dataList = data.contents;
            if (dataList) {
                for (var i = dataList.length - 1; i >= 0; i--) {
                    var elem = dataList[i];
                    if (elem.type == text_type) {
                        elem.content = urlify(elem.content);
                    }
                    user.messages.splice(0, 0, elem);
                }
            }
            getUserInfo(userId, user);
        });
    };

    $scope.showMoreMessages = function (user) {
        $http.get(path + '/dialog/api/last/history?dialogId=' + $scope.activeUser).success(function (data) {
            var dataList = data.contents;
            if (dataList) {
                for (var i = dataList.length - 1; i >= 0; i--) {
                    var elem = dataList[i];
                    if (elem.type == text_type) {
                        elem.content = urlify(elem.content);
                    }
                    user.messages.splice(0, 0, elem);
                }
            }
        })
    }
    /**
     * send out message
     * @param user
     * @param message
     * @param username
     * @param type
     */

    $scope.sendMessage = function (user, message, username, type) {
        if (!type) {
            type = text_type;
        }
        var dispalyContent = message;
        if (type == text_type) {
            dispalyContent = urlify(message);
        }
        
        // 客服端时间显示
        user.messages.push({
            'role': 'kf',
            'username': username,
            'content': dispalyContent,
            'type': type,//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】
            'time': formatDate(serverDate)// liusu服务器端时间 ->原formatDate(new Date())
        });

        var content = JSON.stringify({
            'role': 'kf',
            'username': username,
            'content': message,
            'type': type,//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】
            'time': formatDate(serverDate)// liusu服务器端时间 ->原formatDate(new Date())
        });
        if(user.prdType == feedback_sys){
        	sendMagForFeedback(user, dispalyContent.split("\n").join("<br>"));//意见反馈发送消息
        }else{
        	$scope.sendMsg(user, content);//在线客服发送消息
        }
        
    };
    /**
     * send out Img
     * @param user
     * @param message
     * @param username
     * @param type
     */

    $scope.sendImg = function (user, message, username, type) {
        var content = JSON.stringify({
            'role': 'kf',
            'username': username,
            'content': message,
            'type': type,//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】
            'time': formatDate(serverDate)// liusu服务端时间 ->原formatDate(new Date())
        });
        $scope.sendMsg(user, content);
    };

    /**
     * when receive changed dialog,show tips in the workbench
     * @param user
     * @param changeType
     * @param nickName
     * @param description
     */
    var showChangeMsg = function (user, changeType, nickName, description) {
        if ('auto' == changeType) {
            $scope.sendMessage(user, '客服' + nickName + '掉线，系统自动分配', 'sys', 'sys');
        } else {
            $scope.sendMessage(user, '客服' + nickName + '转单过来了,问题描述：' + description, 'sys', 'sys');
        }
    };

    /**
     * 收到已存在用户消息flicker事件
     * @param user
     */
    var receiveExistUserMsgFlicker = function (user) {
        var nickName = user.nickName;
        new Notifications('' == nickName ? user.dialogId : nickName, {
            body: '发送一条新消息'
        });
        receiveTimerCount(user);
    };


    /**
     * im消息闪烁（用户发送消息过来）
     * @param flickerEvent
     * @param changeCustomer:1为转单标记
     */
    var updateFlicker = function (flickerEvent, changeCustomer) {
        var dialogId = flickerEvent.dialogId.dialogId;

        var user = {"dialogId": dialogId, "nickName": dialogId, "change": changeCustomer, messages: []};
        var existUser = getUserByDialogId(dialogId);
        if (existUser) {
            receiveExistUserMsgFlicker(existUser);
        } else {
            add_new_user($scope, user);
        }
        return user;
    };


    /**
     * 会话结束（包括转单）清除计时器
     */
    var clearTimerCount = function (user) {
        if (user.timer_obj) {
            user.timer_obj.clearTime();
        }
        monitors.getMonitor(user.dialogId).reset();
    };

    /**
     * 发送消息计时
     * @param dialogId
     */
    var sendTimeCount = function (user) {
        if (user.timer_obj) {
            user.timer_obj.clearTime();
        }
        monitors.getMonitor(user.dialogId).start();
    }
    /**
     * 收到消息计时
     * @param dialogId
     */
    var receiveTimerCount = function (user) {
        //// 未存在计时对象前，初始化之
        //if (undefined == $scope.timer_obj[dialogId]) {
        //    $scope.timer_obj[dialogId] = {time_str: '', count: 0};
        //
        //}
        //// 重新重置计时对象
        //else if (0 == $scope.timer_obj[dialogId].count) {
        //    $scope.timer_obj[dialogId].timedCount();
        //
        //}
        if (undefined == user.timer_obj) {
            user.timer_obj = {time_str: '', count: 0};

        }
        // 重新重置计时对象
        else if (0 ==  user.timer_obj.count) {
            user.timer_obj.timedCount();

        }

        //注册一个监听器
        monitors.registerMonitor(user.dialogId);
        monitors.getMonitor(user.dialogId).reset();
    }

    /**
     * 研发测试专用，防止工作台空白，便于开发用——add by suff
     * @type {{dialogId: {dialogId: string, dialogType: number}, lastMessageCreateDate: number, lastReceivedMsgId: number}}
     */
    var testInitEvent={
        dialogId:{
            dialogId:"0001",
            dialogType: 0
        },
        lastMessageCreateDate: 1445496013097,
        lastReceivedMsgId: 1372033372472320
    };
//    displayDialog(testInitEvent);
    

    /**
     * 接收消息(只对用户发过来的消息进行处理)
     * @param message
     * @param username
     * @param type
     */
    $scope.displayMsg = function (userId,content) {
        content = JSON.parse(content);
        if (content.role != 'kf') {
            if (!content.type) {
                content.type = text_type;
            }

            if (content.type == text_type) {
                content.content = urlify(content.content);
            }
            var msg={
                        'role': content.role,
                        'username': content.username,
                        'content': content.content,
                        'type': content.type,//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】,
                        'time': content.time
                };
            if(userId==$scope.activeUserObj.userId){
                    $scope.activeUserObj.messages.push(msg);
            }else{
                var user =getOnlineUserByUserId(userId);
                user.messages.push(msg);
            }
        }
    };

    var hasNoUserInfo = function () {
        return !$scope.activeUserObj.baseInfo || !$scope.activeUserObj.baseInfo.recordId;
    }
    /**
     * 显示消息
     * @param messageEvent
     */
    var displayMessage = function (messageEvent, dialogId) {
    	if(dialogId !=null){
	    	var user = {"dialogId": dialogId, "nickName": dialogId, "change": 0, messages: []};   
	        if ("MESSAGE" == messageEvent.type) {
	            if (hasNoUserInfo() && messageEvent.talkerId && messageEvent.talkerId.userId) {
	                getUserInfo(messageEvent.talkerId.userId, $scope.activeUserObj);
	            }
	            $scope.displayMsg(messageEvent.talkerId.userId,messageEvent.content);
	            //receiveExistUserMsgFlicker(user);
	        }
    	}
    };

    // Display a content
    var displayHistory = function (historyEvent) {
        if (historyEvent.talkerId) {

        }
    };

    var afterSend = function (sendEvent) {
        displayMessage(sendEvent);
    };
    
    /**
     * 处理举报单 - 黄玉云 2015/12/21
     * @param eventMsg
     */
    var dealReport = function(eventMsg){
    	var dialogId = eventMsg.dialogId;
    	var extendMsg = JSON.parse(eventMsg.extendMsg);
    	// 关闭当前会话,并提示
    	if(extendMsg.type == 'close'){
    		console.log('close');
    		$scope.removeUser(dialogId);
    		// 前端信息提示
    		bootbox.dialog({
                message: extendMsg.description,
                callback: function () {
                }
            });
    	}
    };

    /**
     * 关闭会话
     * @param index
     * @param user
     */
    $scope.closeContact = function (index, user, notConfirm) {
        bootbox.confirm({
            message: "确认结束此会话吗？",
            callback: function (result) {
                if (result) {
                	//todo delete
                    //offlineUser(user);
                    //cs_close_post(user.dialogId);
                	cs_close_post(user);
                }
            }
        });
    }

    /**
     * 点击会话
     * @param user
     */
    $scope.activeUserIndex = 0;
    $scope.clickContact = function (user, index) {
        selectActiveUser(user);
    };


    $scope.sendMsg = function (user, msg) {
        // 保存对话时长、对话次数
        if (!user.dialogReplayTime) {
            user.dialogReplayTime = {total: 0, count: 0};
        }
        if (user.timer_obj.count != 0) {
            var replayTime = user.timer_obj.count;
            user.dialogReplayTime = {
                total: user.dialogReplayTime.total + Number(replayTime),
                count: user.dialogReplayTime.count + 1
            };
        }
        send(user.dialogId, msg);
        sendTimeCount(user);
    }


    /**
     * 关闭
     */
    $scope.closeDiv = function () {
        closeDivFactory.closeDiv();
    };

    /**
     * 请求问题分类数据
     */
    $scope.problemCateTree = '';

    var getProblemCateTree = function () {
        $http({
            method: 'GET',
            url: cswsUrlPrefix + 'ucs/getProblemCateForOnline?servicerId=' + $scope.csInfo.userId
        }).success(function (data) {
            $scope.problemCateTreeObj = data.result;
        });
    };

    var loadProblemCateTree = function () {
        if (!$scope.csInfo.userId) {
            getCsInfo(getProblemCateTree)
        } else {
            getProblemCateTree();
        }
    };
    loadProblemCateTree();


	// 意见反馈
    /**
     * 选择意见反馈
     */
    $scope.clickFeedback = function(user, index) {
    	$(".feedback").height(document.body.clientHeight - 460);//动态处理聊天区域大小
		$scope.selectedUserId = user.dialogId;
	    $scope.activeUserObj = user;
	    $scope.activeUser = $scope.activeUserObj.dialogId;
	    if(!user.baseInfo || user.messages.length == 0){
	    	$http({
	            method: 'GET',
	            url: path + '/feedback/FeedbackController/getFeedbackRecordInfo?instance='+user.instanceId+'&feedbackId=' + user.feedbackId + '&instanceName=' + user.instanceName,
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).success(function (data) {
	            if (data.success) {
	            	user.baseInfo = data.data.user;
		        	    
	            	user.messages.splice(0,user.messages.length);
	            	var role = "user";
	            	for (var i = 0; i < data.data.history.length; i++) {
	            		if("用户ID" == data.data.history[i].role){//此处逻辑不要问我为什么，我已经忘记了	add by liaostr
	            			role = "user";
	            		}else{
	            			role = "kf";
	            		}
	            		user.messages.push({
	                        'role': role,
	                        'username': data.data.history[i].username,
	                        'content': data.data.history[i].content,
	                        'type': "talk",//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】,
	                        'time': data.data.history[i].time,
	                        "downImage": data.data.history[i].downImage
	                    });
	            	}
	            }else{
	            	//转交的或者已回复的直接删除
	            	if(data.code == '000003' || data.code == '000005'){
	            		$scope.removeFeedback($scope.activeUser);
	            	}
	            	bootbox.dialog({
	                    message: data.message,
	                    onEscape: function() {},
	                    buttons: {
	                        cancel: {
	                            label: '确认',
	                            callback: function() {
	                            }
	                        }
	                    }
	                });
	            }
	        });
	    }
	    console.log("activeUserObj:",$scope.activeUserObj);
	}

    /**
     * 更新服务端推送数据
     */
    $scope.$on('ws-feedback', function(event,data) {
    	if(data && data != ""){
    		var res = JSON.parse(data);
    		//接受后端推送过来的数据，加到列表
    		$scope.feedbackList.unshift({
    			dialogId:res.dialogId,
    			instanceId:res.instanceId,
    			instanceName:res.instanceName,
    			feedbackId : res.feedbackId,
				uid : res.uid,
				messages:[],
				prdType : feedback_sys//意见反馈
			});
	    	// 新用户进线提醒
	        new Notifications('新用户接入', {
	            body: res.uid
	        });
    	}
		console.log("msg:"+data);
	});
    
    /**
     * 意见反馈发送消息
     */
    var sendMagForFeedback = function(user, content){

        if(!user || !content){
            bootbox.dialog({
                message: '发送信息或用户信息为空!',
                onEscape: function() {},
                buttons: {
                    cancel: {
                        label: '确认',
                        callback: function() {
                        }
                    }
                }
            });
            return;
        }
        console.log('意见反馈发送消息...');
        $http({
            method: 'POST',
            url: path + '/feedback/replyRecord',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {instance: user.instanceId,instanceName:user.instanceName, feedbackId: user.feedbackId, content: content}
        }).success(function (data) {
            if (data.success) {
            	showArchButtons(user);//设置归档/升级按钮为可用
            }else{
            	bootbox.dialog({
                    message: data.message,
                    onEscape: function() {},
                    buttons: {
                        cancel: {
                            label: '确认',
                            callback: function() {
                            }
                        }
                    }
                });
            }
        });
    }
    
    /**
     * 删除列表数据
     */
    $scope.removeFeedback = function (dialogId) {
        for (var i = 0; i < $scope.feedbackList.length; i++) {
            if (dialogId == $scope.feedbackList[i].dialogId) {
                $scope.feedbackList.splice(i, 1);
                break;
            }
        }
    };

	function logger(type, msg){
    	$http({
            method: 'POST',
            url: path + '/customer/CustomersController/log',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {type: type, msg: msg}
        }).success(function (data) {
        });
    	
    }


});