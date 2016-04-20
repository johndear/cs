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
	var params = 'customerId=123';//'userId=123';

	function newWebSocket() {
		var url = "ws://"+socketServerAddress + ":" + socketServerPort + '?' + params;
		
		if ("WebSocket" in window) {
		    ws = new WebSocket(url);
		  }
		  else if ("MozWebSocket" in window) {
		    ws = new MozWebSocket(url);
		  }
		  else{
			alert("浏览器版本过低，请升级您的浏览器。\r\n浏览器要求：IE10+/Chrome14+/FireFox7+/Opera11+");
			return;
		  }
		ws.onopen = function(evnt) {
			onOpen(evnt);
		};
		ws.onmessage = function(evnt) {
			onMessage(evnt);
		};
		ws.onclose = function(evnt) {
			onClose(evnt);
		};
		ws.onerror = function(evnt) {
			onError(evnt);
		};
		return ws;
	}

	function onOpen(evnt) {
		console.log("连接到了服务器!"); 
	}

	function onClose(evnt) {
		console.log('连接被关闭.');

//		$timeout(function() {
//			console.log('Reconnecting to server...')
//			newWebSocket();
//		}, 3000);
	}

	// 接收websocket服务端推送的数据
	function onMessage(evnt) {
		console.log("onMessage: ", evnt);

		// 用户-》客服
		$rootScope.$broadcast('ws-user-msg', evnt.data);
		
	}

	function onError(evnt) {
		console.log('onError: ', evnt);
//		$timeout(function() {
//			console.log('Reconnecting to server...')
//			newWebSocket();
//		}, 3000);
	}
	
	return ws;

} ]);

// 参考：http://www.51joben.com/archives/7302.html
