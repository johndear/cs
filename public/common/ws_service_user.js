/**
 * 意见反馈websocket服务 Created by 廖金洪
 */
'use strict';

chatApp.service('WebSocketService', [ '$timeout','$rootScope','$http', function($timeout,$rootScope,$http) {
	var self = this;
	var ws = null;
	
	// liusu temp
	var socketServerAddress= 'localhost';
	var socketServerPort = '8887';
	var params = 'userId=123';

	function newWebSocket() {
		var url = "ws://"+socketServerAddress + ":" + socketServerPort + '?' + params;
		var wsTmp = new WebSocket(url);
		wsTmp.onopen = function(evnt) {
			onOpen(evnt);
		};
		wsTmp.onmessage = function(evnt) {
			onMessage(evnt);
		};
		wsTmp.onclose = function(evnt) {
			onClose(evnt);
		};
		wsTmp.onerror = function(evnt) {
			onError(evnt);
		};
		return wsTmp;
	}

	ws = newWebSocket();
	$rootScope.ws = ws;

	function onOpen(evnt) {
		console.log("onOpen: ", evnt);
	}

	function onClose(evnt) {
		console.log("onClose: ", evnt);

//		$timeout(function() {
//			console.log('Reconnecting to server...')
//			newWebSocket();
//		}, 3000);
	}

	function onMessage(evnt) {
		console.log("onMessage: ", evnt);
		// 这里处理接收数据
		var evenData = evnt.data;
		console.log("websocket服务端推送数据: ", evenData);

		// 接收websocket服务端推送的数据
			// 客服-》用户
			$rootScope.$broadcast('ws-customer-msg', evenData);
			
			// init msg 'welcome...'
			chatroom.send({
		        start: false,
		        isSystem: true,
		        role: 'service',
		        type: 'talk',
		        avatar: "${uaeCompressRoot}/cs/public/images/service_avatar.png",
		        content: event.data
		    });
		
	}

	function onError(evnt) {
		console.log('onError: ', evnt);
//		$timeout(function() {
//			console.log('Reconnecting to server...')
//			newWebSocket();
//		}, 3000);
	}

} ]);