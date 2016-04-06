/**
 * 意见反馈websocket服务 Created by 廖金洪
 */
'use strict';

chatApp.service('WebSocketService', [ '$timeout','$rootScope','$http', function($timeout,$rootScope,$http) {
	var self = this;
	var ws = null;

//	function newWebSocket() {
//		var url = "ws://"+socketServerAddress + ":" + socketServerPort + '?userId=' + userId;
//		var wsTmp = new WebSocket(url);
//		wsTmp.onopen = function(evnt) {
//			onOpen(evnt);
//		};
//		wsTmp.onmessage = function(evnt) {
//			onMessage(evnt);
//		};
//		wsTmp.onclose = function(evnt) {
//			onClose(evnt);
//		};
//		wsTmp.onerror = function(evnt) {
//			onError(evnt);
//		};
//		return wsTmp;
//	}

//	ws = newWebSocket();

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
		console.log("意见反馈websocket服务端推送数据: ", evenData);

		// 传回后端实时推送的数据
		$rootScope.$broadcast('ws-feedback', evenData);
	}

	function onError(evnt) {
		console.log('onError: ', evnt);
//		$timeout(function() {
//			console.log('Reconnecting to server...')
//			newWebSocket();
//		}, 3000);
	}

} ]);