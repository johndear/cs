var chatroom = document.getElementById('chatroom');
var DEFAULT_USER_AVATAR = window['uae_image_root'] + '/public/images/user_avatar.png',
DEFAULT_SERVICE_AVATAR = window['uae_image_root'] + '/public/images/service_avatar.png';

chatApp.controller('userCtrl', function ($rootScope, $scope, $http, WebSocketService) {
	
	    $rootScope.params = 'userId=123';
	
		/**
	     * 更新服务端推送数据
	     */
	    $scope.$on('ws-customer-msg', function(event,data) {
	    	alert(123);
	    });
	    
	    $scope.sendServer = function(){
	 		var content = $scope.content;
	 		
	 		$rootScope.ws.send(content);
            
            var data = {
                    start: true,
                    role: 'service',
                    type: 'talk',
                    avatar: DEFAULT_USER_AVATAR,
                    content: content,
                    img: content
                };
            send(data);
            
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
	        var d = document.createElement('div');
	        d.innerHTML = html;
	        chatroom.appendChild(d.children[0]);
	    }
	 	
	 	
 });