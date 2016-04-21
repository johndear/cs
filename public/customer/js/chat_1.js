var DEFAULT_USER_AVATAR = window['uae_image_root'] + '/public/images/user_avatar.png',
DEFAULT_SERVICE_AVATAR = window['uae_image_root'] + '/public/images/service_avatar.png';

chatApp.controller('userCtrl', function ($rootScope, $scope, $http, WebSocketService) {
	
	alert(dialogId);
	    $rootScope.params = 'userId=123';
	
		// 服务端推送数据
	    $scope.$on('ws-customer-msg', function(event, messageObj) {
	    	var message = messageObj.message;
	    	
	    	var dialog = {
		        start: false,
		        role: 'service',
		        type: 'talk',
		        avatar: DEFAULT_SERVICE_AVATAR,
		        content: message,
		        isSystem: true
		    };
	    	
	    	send(dialog);
	    });
	    
	    // 主动发送
	    $scope.send = function(){
	 		WebSocketService.sendMessage($scope.content).then(function(res) {
//					messages.push({type:1,message:res.message});
	 			console.log(res);
	 			var message = res.message;
	 			var dialog = {
 	                start: true,
 	                role: 'service',
 	                type: 'talk',
 	                avatar: DEFAULT_USER_AVATAR,
 	                content: message,
 	                img: message
 	            };
 	            send(dialog);
			}, function(res) {
				console.log('Failed: ' , res);
			});
            
        }
	    
	    function send(data){
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
	    	
//	    	sendTimeTips();
            render(html);
	    }
	    
	    function render(html) {
	    	var chatroom = document.getElementById('chatroom');
	        var d = document.createElement('div');
	        d.innerHTML = html;
	        chatroom.appendChild(d.children[0]);
	    }
	 	
	 	
 });