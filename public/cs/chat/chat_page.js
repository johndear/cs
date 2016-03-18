(function () {
    'use strict';
    // 父controller，方便于controller之间的通信
    chatApp.controller('ChatRoot', chatRoot);

    // 聊天页面的controller和表情controller
    chatApp.controller('Chat', chatBox).controller('ExpBox', expBox).controller('BigPic', bigPic);

    function chatRoot($scope,$rootScope, $http, closeDivFactory) {
        $rootScope.isSelfEmp = window.isSelfEmp;
        $scope.closeDiv = function () {
            closeDivFactory.closeDiv();
        }

        $scope.baseInfo = null;
        //广播表情发送
        $scope.$on("expChange", function (event, msg) {
            $scope.$broadcast("ExpChangeFromRoot", msg);
        });
        //广播展示大图
        $scope.$on("showBigPic", function (event, msg) {
            $scope.$broadcast("ShowBigPicFromRoot", msg);
        });
    }

    function chatBox($scope, $http, closeDivFactory, $modal, $popover,bootbox) {
        var vm = this;
        if(deptId == $scope.Dept.jym){
        	vm.liked = [
	            {'id': '1','content': '亲，喵喵来为您服务了~!'},
	            {'id': '2','content': '亲，小喵有什么可以帮到您的吗？'},
	            {'id': '3','content': '亲，请您提供一下订单号~小喵帮您查询一下。'},
	            {'id': '4','content': '亲，BOSS大人有点多，小喵回复慢了，请您谅解哦~'},
	            {'id': '5','content': '亲，小喵正在为您查询，请您稍等下哦~'},
	            {'id': '6','content': '亲，请不要走开哦，小喵正在帮您查询哦~'}, 
	            {'id': '7','content': '亲，您不要着急哈，喵喵也很理解您现在的心情。'},
	            {'id': '8','content': '亲，您还有其他问题需要咨询的吗？'},
	            {'id': '9','content': '亲，您还有其他要咨询的吗？如果没有，请您稍后为喵喵的服务评分哦~'},
	            {'id': '10','content': '亲，若您还有其他问题需要咨询，欢迎再次召唤小喵！~请您稍后为喵喵的服务评价哦~感谢您对交易猫的支持！'},
	            {'id': '11','content': '感谢您对交易猫的支持，请您稍后为喵喵的服务评分哦，游戏愉快哦！'},
	            {'id': '12','content': '亲，为了更好的解决到您的问题，现在马上帮您转交给专家为您进一步处理，请您不要离开哦~（若出现掉线的情况，烦请重新联系客服哦）'},
	            {'id': '13','content': '亲，感谢您的耐心等待，小喵马上查看您反馈的问题，麻烦您稍等片刻哦~'}
	        ];
        }else if(deptId == $scope.Dept.sum){
        	vm.liked = [
	            {'id': '1','content': '亲，UC姐来了，请问有什么可以帮您？'},
	            {'id': '2','content': '亲，请问您的UC账号是多少呢？'},
	            {'id': '3','content': '亲，先不要走开哈，UC姐马上为您查询哦~'},
	            {'id': '4','content': '亲，先不要着急哈，UC姐也很理解您的心情的。'},
	            {'id': '5','content': '亲，因为咨询人数较多，UC姐回复您慢了，请您原谅UC姐哈。'},
	            {'id': '6','content': '若有疑问，UC姐一直在滴。随时听候您的召唤~'}, 
	            {'id': '7','content': '亲还有其他疑问么？没有的话请您稍后对我的服务做一下评价好吗，点击UC姐头像下方即可评价哦，么么哒\\(≧▽≦)/'}
	        ];
        }else{
        	vm.liked = [
        	            {'id': '1','content': 'Hi my friend,any problem about UC browser?'},
        	            {'id': '2','content': 'Plz wait a moment.I am checking it now.'},
        	            {'id': '3','content': 'Still checking.Hope you can wait patiently.'},
        	            {'id': '4','content': 'Could you plz send the specific link to me.I can test for you.Ok?'},
        	            {'id': '5','content': 'Plz try to clear cache and turn on/off cloud boost.Change speed mode or access point then refresh the page to see if it works or not,ok?'},
        	            {'id': '6','content': 'I am sorry but to better serve you, could you please speak in English?'}, 
        	            {'id': '7','content': 'I am sorry.That is not within our scope of service.If you still have any problem with uc browser,please feel free to contact us again!'},
        	            {'id': '8','content': 'Is there anything else we can help about UC?'},
        	            {'id': '9','content': 'Sorry we cannot provide any personal information due to our working rules.Hope you can understand.'}
        	            
        	        ];
        }
        
        if (userName) {
            vm.username = userName;
        } else {
            vm.username = 'Kf';
        }

        vm.userId = userId;
        
        vm.sender = {head: $scope.serviceAvatar};
        vm.receiver = {head: $scope.userAvatar};
        vm.systemNotice = {msg: ""};
        vm.startDate = {msg: ""};
        vm.user=$scope.user;
        vm.messages = $scope.user.messages;
        vm.writingMessage = {msg:""};

        var userInfo = $scope.user;
        console.log("$scope.user",$scope.user);

        /**
         *发送表情（监听从root controller发出的ExpChangeFromRoot事件）
         */
        $scope.$on("ExpChangeFromRoot",
            function (event, msg) {
	        	if(vm.user.prdType == 'feedback_sys'){//意见反馈直接追加到textarea里面
	        		var url = ' ' + csos_faces_url+msg.mark + ' ';
	        		vm.writingMessage.msg = vm.writingMessage.msg + url;
	        	}else{
	        		vm.sendMessage(msg.mark, vm.username, face_type);
	        	}
            });

        /**
         *监听用户下线
         */
        $scope.$on("userClosed",
            function (event, msg, dialogId) {
                if (dialogId == userInfo.dialogId) {
                    if ('close' == msg) {
                        vm.showNotice('用户已经下线了');
                    } else if ('offline' == msg) {
                        vm.showNotice('用户已经掉线了');
                    }

                }
            });
        /**
         * 显示系统消息（用户下线等）
         * @param message
         * @param username
         * @param type
         */
        vm.showNotice = function (message) {
            vm.systemNotice.msg = message;
            $scope.$apply();
        };

        vm.showExp = function () {
            var show = !closeDivFactory.exp.show;
            closeDivFactory.closeDiv();
            closeDivFactory.exp.show = show;
        };

        var myForwardingModal = $modal({
            scope: $scope,
            templateUrl: '/csos/public/cs/modal/forwarding.html',
            title: '转单',
            content: 'content',
            show:false,
            controllerAs:'Chat'
        });


        vm.forwarding = function ($event) {
            myForwardingModal.$promise.then(myForwardingModal.show);
        };

		/**
		 * 转交任务	add by liaostr 2015-12<br>
		 * forwardSkillGroup ：转交技能组<br>
		 * forwardReason ： 转交原因<br>
		 * prdType ：csos_sys=在线客服；feedback_sys=意见反馈<br>
		 */
        $scope.changeCustomer = function (forwardSkillGroup,forwardReason,prdType) {
        	//转交意见反馈单
        	if(prdType == 'feedback_sys'){
        		changeForFeedback(forwardSkillGroup);
        	}else{//暂时只有意见和在线，其它的都调用在线逻辑
        		changeForCsoc(forwardSkillGroup,forwardReason);
        	}
        }
        
        /**
		 * 转交任务-在线客服用	add by liaostr 2015-12<br>
		 * forwardSkillGroup ：转交技能组<br>
		 * forwardReason ： 转交原因<br>
		 */
        var changeForCsoc = function(forwardSkillGroup,forwardReason){
            if(!forwardSkillGroup || !forwardReason){
                bootbox.dialog({
                    message: '请确保转交技能组和转交原因都有填写',
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
            console.log('在线客服发起转单...');
            $http({
                method: 'POST',
                url: '../cs/WorkBenchController/changeCustomer',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {dialogId: $scope.activeUser, skillGroupId: forwardSkillGroup, reason: forwardReason}
            }).success(function (data) {
                if (data.success) {
                	console.log('转单成功');
                    $scope.removeUser($scope.activeUser);
                    myForwardingModal.hide();
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
            });
        
        }
        
        /**
		 * 转交任务-意见反馈客服用	add by liaostr 2015-12<br>
		 * forwardSkillGroup ：转交技能组<br>
		 */
        var changeForFeedback = function(forwardSkillGroup){
        	if(!forwardSkillGroup){
                bootbox.dialog({
                    message: '请选择要转交的技能组!',
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
            console.log('意见反馈客服发起转单...');
            $http({
                method: 'GET',
                url: '../feedback/DialogMessageController/change?dialogId=' + $scope.activeUser + '&skillGroupId=' + forwardSkillGroup,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data) {
                if (data.success) {
                	console.log('转单成功');
                	$scope.removeFeedback($scope.activeUser);
                    myForwardingModal.hide();
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
            });
        }
        
        var delete_user = function (list, dialogId) {
        	if (null != list && '' != list && '' != dialogId) {
                for (var i=0; i<list.length; i++){
                    if(list[i].dialogId == dialogId){
                    	list.splice(i,1);
                        break;
                    }
                }
            }
        	
        }
        
        /**
         * 发送消息
         * @param message
         * @param username
         * @param type
         */
        vm.sendMessage = function (message, username, type) {
            $scope.sendMessage($scope.user,message,username,type);
        };

        //vm.sendOut = function (content) {
        //    if (content) {
        //        content = JSON.stringify(content)
        //    }
        //    $scope.sendMsg( userInfo.dialogId,content);
        //}

        /**
         * 发送图片
         * @param url
         */
        vm.sendImg = function (url) {
            $scope.sendImg ($scope.user,url, vm.username, pic_type);
        };

        /**
         * 查看大图
         * @param url
         */
        vm.showBigImg = function (url) {
            $scope.$emit("showBigPic", url);
        }

        /**
         * 展示更多
         * */
        vm.showMore = function () {
            $scope.showMoreMessages($scope.user);
        }
    }

    function expBox($scope, closeDivFactory) {
        var exp = this;
        exp.showing = closeDivFactory.exp;
        exp.expressions = [
            {
                mark: '1.gif',
                url: faces_img_url + '1.gif'
            }, {
                mark: '2.gif',
                url: faces_img_url + '2.gif'
            }, {
                mark: '3.gif',
                url: faces_img_url + '3.gif'
            }, {
                mark: '4.gif',
                url: faces_img_url + '4.gif'
            }, {
                mark: '5.gif',
                url: faces_img_url + '5.gif'
            }, {
                mark: '8.gif',
                url: faces_img_url + '8.gif'
            }, {
                mark: '10.gif',
                url: faces_img_url + '10.gif'
            }, {
                mark: '12.gif',
                url: faces_img_url + '12.gif'
            }, {
                mark: '13.gif',
                url: faces_img_url + '13.gif'
            }, {
                mark: '16.gif',
                url: faces_img_url + '16.gif'
            }, {
                mark: '19.gif',
                url: faces_img_url + '19.gif'
            }
        ];
        exp.chooseExp = function (expression) {
            exp.showing.show = false;
            $scope.$emit("expChange", expression);
        };
    }

    function bigPic($scope, closeDivFactory) {
        var pic = this;
        pic.showing = closeDivFactory.pic;
        pic.picUrl = {url: ''};

        $scope.$on("ShowBigPicFromRoot",
            function (event, msg) {
                closeDivFactory.closeDiv();
                pic.picUrl.url = msg;
                closeDivFactory.pic.show = true;
            });
    }
})();
