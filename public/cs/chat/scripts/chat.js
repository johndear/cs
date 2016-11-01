(function () {
    'use strict';

    angular.module('irontec.simpleChat', ['luegg.directives']);

    angular.module('irontec.simpleChat').directive('file',
        function () {
            return {
                restrict: 'E',
                template: '<input type="file" />',
                replace: true,
                require: 'ngModel',
                link: function (scope, element, attr, ctrl) {
                    var listener = function () {
                        scope.$apply(function () {
                            attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                        });
                    }
                    element.bind('change', listener);
                }
            }
        }).directive('irontecSimpleChat', [SimpleChat]);

    function SimpleChat() {
        var likeIcon =
            '<div class="dropup">' +
            '<span class="input-tool-icon glyphicon-heart like-icon dropdown-toggle"  data-toggle="dropdown" aria-expanded="true">' +
            '</span>' +
            '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2" style="width: 370px;background-color: #E3E3E3">' +
            '<li role="presentation" ng-click="vm.quickSendFunction(diy.content)" title="{{ diy.content }}" ng-repeat="diy in vm.liked" style="padding-right: 10px;padding-left: 10px"><a role="menuitem" tabindex="-1" style="overflow: hidden;padding-left:0" href="#">{{diy.content}}</a></li>' +
            '</ul>' +
            '</div>';


        var fileUpload =
            '<form method="POST" enctype="multipart/form-data">' +
            '<div class="glyphicon-picture pic-icon">' +
            '<file name="image" class="fileInput" ng-model="inputFile" ng-change="vm.sendImg()" accept="image/png,image/jpg,image/jpeg" />' +
                //'<input class="fileInput" type="file" ng-model="imgFile" name="imgFile" ng-change="angular.element(this).scope().sendImg()">' +
            '</div>' +
            '</form>';


        var chatTemplate =
            '<div class="row chat-window" ng-class="vm.theme">' +
            '<div class="col-xs-12 col-md-12">' +
            '<div class="panel">' +
            '<div class="panel-body msg-container-base" ng-class="{\'feedback\' : vm.user.prdType == \'feedback_sys\'}"  id="vm.getContainerId()" ng-style="vm.panelStyle" scroll-glue>' +
            '<div ng-show="vm.showHistory">' +
            '<div>' +
            '<p class="text-center chat-more" ng-click="vm.showMoreFunction()">查看更多</p>' +
            '</div>' +

            '<div>' +
            '<div class="time-liner"></div>' +
            '<p class="text-center time-liner-content" ng-bind="vm.startDate.msg">2015-05-22</p>' +
            '</div>' +
            '</div>' +


            '<div class="row msg-container" ng-repeat="message in vm.messages">' +
            '<div ng-if="message.type==\'sys\'">' +
            '<p class="text-center" style="color: #778389;margin-left: 80;margin-right: 80">{{ message.content }}</p>' +
            '</div>' +
            '<div ng-if="message.type!=\'sys\'">' +
            '<div class="chat-msg" ng-class="message.role==\'kf\' ?' + " 'chat-msg-sent' : 'chat-msg-receive'" + '" chat-msg-sent">' +
            '<div class="sub">' +
            '<div class="img">' +
            '<div ng-if="message.role==\'kf\'">' +
            '<img title="" ng-src="{{ vm.sender.head }}" >' +
            '</div>' +
            '<div ng-if="message.role!=\'kf\'">' +
            '<img title="" ng-src="{{ vm.receiver.head }}" >' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="main">' +
            '<div class="info"> {{message.time}}' +
            '</div>' +
            '<div class="msg">' +
            '<div class="pic_loading" ng-if="!message.content">' +
            '<i></i>' +
            '</div>' +
            '<div ng-if="message.content">' +
            '<div ng-if="message.type==\'pic\'">' +
            '<div ng-if="message.content">' +
            '<a href="#" ng-click="vm.showBigPic(message.content,$event)" title="双击查看大图" >' +
            '<img style="max-height:300px; max-width:200px" class="message-pic"  ng-src="{{message.content}}">' +
            '<a href="{{message.content}}" target="_blank"><p style="  text-align: right;color: rgb(38, 105, 192);">查看原图>></p></a>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '<div ng-if="message.type==\'talk\'" ng-bind-html="message.content" ></div>' +
            '<div ng-if="message.downImage"><a style="color:red;" href="{{message.downImage}}" target="_blank">附件</a></div>' +
            '<div ng-if="message.type==\'face\'">' +
            '<img style="max-height:300px; max-width:200px"  ng-src="../public/images/face/{{message.content}}">' +
            '</div>' +
            '</div>' +

            '</div>' +
            '<s class="arrow"></s>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div ng-if="vm.systemNotice.msg">' +
            '<p class="text-center chat-more">{{ vm.systemNotice.msg }}</p>' +
            '</div>' +
            '</div>' +
            '<div class="panel-footer chat-footer" style="">' +
            '<div class="row" style="padding-left: 20px;">' +
            '<div class="col-md-1" ng-if="vm.deptId != 2"><span class="input-tool-icon emotion-icon" ng-click="vm.showExp($event)"></span></div>' +
            '<div class="col-md-1"><span class="input-tool-icon">' + likeIcon + '</span></div>' +
            '<div class="col-md-1"><span class="input-tool-icon">' + fileUpload + '</span></div>' +
            '<div class="col-md-9">'+
            '<button ng-class="{\'btn-disabled\': vm.user.disableSendBtn}" ng-if="vm.user.prdType==\'feedback_sys\'" type="button" class="btn forward-btn" ng-disabled="vm.user.disableSendBtn" ng-click="vm.submitFunction()">{{vm.submitButtonText}}</button>'+
            '<button ng-class="{\'btn-disabled\': vm.user.disableSendBtn}" type="button" class="btn forward-btn" ng-disabled="vm.user.disableSendBtn" ng-click="vm.forwarding($event)">{{ vm.forwardButtonText }}</button>' +
            '</div>' +
            '</div>' +
            '<form style="display:inherit" ng-submit="vm.submitFunction()">' +
            //客服
            '<div ng-if="vm.user.prdType!=\'feedback_sys\'" class="input-group">' +
            '<textarea rows="3" class="form-control input-sm chat-input" placeholder="{{vm.inputPlaceholderText}}" ng-keydown="vm.send($event)" ng-model="vm.writingMessage.msg" />' +
            '<span class="input-group-btn">' +
            '<input type="submit" class="btn btn-sm chat-submit-button" ng-disabled="vm.user.disableSendBtn" value="{{vm.submitButtonText}}" />' +
            '</span>' +
            '</div>' +
            //意见反馈
            '<div ng-if="vm.user.prdType==\'feedback_sys\'" class="input-group" style="width:100%">' +
            '<textarea rows="12" class="form-control input-sm chat-input" placeholder="{{vm.inputPlaceholderText}}" ng-keydown="vm.send($event)" ng-model="vm.writingMessage.msg" />' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        var directive = {
            restrict: 'EA',
            template: chatTemplate,
            replace: true,
            scope: {
                messages: '=',
                writingMessage: '=',
                username: '=',
                userId: '=',
                liked: '=',
                sender: '=',
                receiver: '=',
                user: '=',
                systemNotice: '=',
                startDate: '=',
                inputPlaceholderText: '@',
                submitButtonText: '@',
                forwardButtonText: '@',
                title: '@',
                theme: '@',
                submitFunction: '&',
                showMoreFunction: '&',
                sendImg: '&',
                showBigPic: '&',
                showExp: '&',
                forwarding: '&',
                showHistory : '='
            },
            link: link,
            controller: ChatCtrl,
            controllerAs: 'vm'
        };

        function link(scope, element) {
            if (!scope.inputPlaceholderText) {
                scope.inputPlaceholderText = 'Write your message here...';

            }

            if (!scope.submitButtonText || scope.submitButtonText === '') {
                scope.submitButtonText = 'Send';
            }

            if (!scope.forwardButtonText || scope.forwardButtonText === '') {
                scope.forwardButtonText = 'forward';
            }


            if (!scope.title) {
                scope.title = 'Chat';
            }
        }

        return directive;
    }

    ChatCtrl.$inject = ['$scope', '$http'];

    function ChatCtrl($scope, $http) {
        var vm = this;
        var isHidden = false;

        vm.user = $scope.user;
        vm.activeUser = $scope.activeUser;

        vm.messages = $scope.messages;
        vm.writingMessage = $scope.writingMessage;
        vm.username = $scope.username;
        vm.userId = $scope.userId;
        vm.user = $scope.user;
        vm.deptId = deptId;
        vm.sender = $scope.sender;

        vm.receiver = $scope.receiver;
        vm.liked = $scope.liked;
        vm.inputPlaceholderText = $scope.inputPlaceholderText;
        vm.submitButtonText = $scope.submitButtonText;
        vm.forwardButtonText = $scope.forwardButtonText;
        vm.title = $scope.title;
        vm.theme = 'chat-th-' + $scope.theme;
//        vm.writingMessage = '';
        vm.systemNotice = $scope.systemNotice;
        vm.startDate = $scope.startDate;

        vm.showHistory = $scope.showHistory;//是否显示更多查询


        $scope.popover = {
            "title": "Title",
            "content": "Hello Popover<br />This is a multiline message!"
        };

        if (!vm.systemNotice) {
            vm.systemNotice = {msg: 'hello'};
        }

        vm.send = function (e) {
            if (e.ctrlKey && e.keyCode == 13) {
                vm.submitFunction();
            }
        };
        vm.submitFunction = function () {
            if (vm.writingMessage.msg) {
                $scope.submitFunction({message: vm.writingMessage.msg, username: vm.username});
            }
            vm.writingMessage.msg = '';
        };

        vm.quickSendFunction = function (msg) {
            vm.writingMessage.msg = vm.writingMessage.msg + msg;
        };

        vm.showMoreFunction = function () {
        	if(vm.deptId == 2 && !vm.user.baseInfo.account){
        		msgPop("该用户未登录,查询不到更多信息", timeOut25);
        		return false;
        	}
            $scope.showMoreFunction();
            vm.showHistory = false;
        };


        vm.sendImg = function () {
            var url = '';
            var imgFile = $scope.inputFile;

            if (imgFile) {
            	if(vm.user.prdType == 'csos_sys'){//客服直接发送
            		vm.messages.push({
                        'role': 'kf',
                        'username': vm.username,
                        'content': url,
                        'type': pic_type,//【talk-普通对话内容，pic-图片内容，face-表情内容，tips-提示内容】,
                        'time': formatDate(serverDate)// liusu服务器端时间 ->原formatDate(new Date())
                    });
            	}

                var index = vm.messages.length;

                var fd = new FormData();
                fd.append('imgFile', imgFile);

                $http.post('../cs/service/image/' + vm.userId, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                    console.log(data);
                    if (data.success) {
                    	var imgUrl = data.message;
                        if (imgUrl) {
                            imgUrl = imgUrl.replace(/\n/g, "");
                        }
                    	if(vm.user.prdType == 'feedback_sys'){//意见反馈直接增加到输入款
                    		vm.quickSendFunction(' '+imgUrl+' ');
                    	}else{//客服
	                        $scope.sendImg({url: imgUrl});
	                        vm.messages[index - 1].content = imgUrl;
                    	}
                    } else {
                        alert(data.message);
                    }

                }).error(function (data) {
                    console.log(data);
                });
            }


        }

        vm.showExp = function ($event) {
            if ($event) {
                $event.stopPropagation();
            }
            $scope.showExp();
        }

        vm.forwarding = function ($event) {
            $scope.forwarding();
        }

        vm.showBigPic = function (url, $event) {
            if ($event) {
                $event.stopPropagation();
            }
            $scope.showBigPic({url: url});
        }

        vm.panelStyle = {'display': 'block'};
        vm.chatButtonClass = 'glyphicon-minus icon_minim';


        vm.toggle = toggle;

        function toggle() {
            if (isHidden) {
                vm.chatButtonClass = 'glyphicon-minus icon_minim';
                vm.panelStyle = {'display': 'block'};
                isHidden = false;
            } else {
                vm.chatButtonClass = 'glyphicon-plus icon_minim';
                vm.panelStyle = {'display': 'none'};
                isHidden = true;
            }

        }

        vm.getContainerId = function () {
            return "chat-container-" + vm.user.dialogId;
        };

        // 计算消息区的高度
        $(".msg-container-base").height(document.body.clientHeight - 300);
        // 计算插件区的高度
        $(".plugin-style").height(document.body.clientHeight - 202);

    }


})();
