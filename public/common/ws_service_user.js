/**
 * 意见反馈websocket服务 Created by 廖金洪
 */
'use strict';

chatApp.service('WebSocketService',['$timeout','$rootScope','$http', function($timeout, $rootScope, $http) {
	var self = this;
	var ws = null;
	var Service = {};

	// liusu temp
	var socketServerAddress = 'localhost';
	var socketServerPort = '8887';
	var params = 'userId=123';

	function newWebSocket() {
		var url = "ws://" + socketServerAddress + ":" + socketServerPort + '?' + params;

		if ("WebSocket" in window) {
			ws = new WebSocket(url);
		} else if ("MozWebSocket" in window) {
			ws = new MozWebSocket(url);
		} else {
			alert("浏览器版本过低，请升级您的浏览器。\r\n浏览器要求：IE10+/Chrome14+/FireFox7+/Opera11+");
			return;
		}

		ws.onopen = function(evnt) {
			onOpen(evnt);
		};
		ws.onmessage = function(evnt) {
			listener(evnt);
		};
		ws.onclose = function(evnt) {
			onClose(evnt);
		};
		ws.onerror = function(evnt) {
			onError(evnt);
		};
		return ws;
	}

	newWebSocket();

	$rootScope.ws = newWebSocket();

	function onOpen(evnt) {
		console.log("连接到了服务器!");
	}

	function onClose(evnt) {
		console.log('连接被关闭.');

		// $timeout(function() {
		// console.log('Reconnecting to server...')
		// newWebSocket();
		// }, 3000);
	}

	function listener(evnt) {
		console.log("onMessage: ", evnt);

		// 主动请求
		if (false) {

		} else {
			// 服务端推送（广播给子scope）--客服-》用户
			$rootScope.$broadcast('ws-customer-msg', evnt);
		}
	}

	function onError(evnt) {
		console.log('onError: ', evnt);
		// $timeout(function() {
		// console.log('Reconnecting to server...')
		// newWebSocket();
		// }, 3000);
	}

	function sendRequest(request) {
		var defer = $q.defer();
		var callbackId = getCallbackId();
		callbacks[callbackId] = {
			time : new Date(),
			cb : defer
		};
		request.callbackId = callbackId;
		ws.send(JSON.stringify(request));
		return defer.promise;
	}

	Service.sendMessage = function(message) {
		var request = {
			message : message
		}
		var promise = sendRequest(request);
		return promise;
	};
	return Service;

} ]);