/**
 * 客服websocket服务
 */
'use strict';

chatApp.service('WebSocketService', [ '$timeout', '$q', '$rootScope','$http', function($timeout,$q,$rootScope,$http) {
	var self = this;
	var ws = null;
	var Service = {};
	var callbacks = {};
    var currentCallbackId = 0;
	
	// liusu temp
	var socketServerAddress= 'localhost';
	var socketServerPort = '8887';
	var params = 'customerId=' + 3006;//'userId=123';

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
	
	newWebSocket();

	function onOpen(evnt) {
		console.log("连接到了服务器!"); 
	}

	function onClose(evnt) {
		console.log('连接被关闭.');

		$timeout(function() {
			console.log('Reconnecting to server...');
			newWebSocket();
		}, 3000);
	}

	// 接收websocket服务端推送的数据
	function onMessage(evnt) {
		var messageObj = JSON.parse(evnt.data);
		 console.log("onMessage: ", messageObj);
		 
	      if(callbacks.hasOwnProperty(messageObj.callbackId)) {// 主动请求
	    	  console.log('主动请求。。。');
	          $rootScope.$apply(callbacks[messageObj.callbackId].cb.resolve(messageObj));
	          delete callbacks[messageObj.callbackId];
	        
	      }else{// 服务端推送（广播给子scope） 用户-》客服
	    	  console.log('服务端推送。。。');
	    	  $rootScope.$broadcast('ws-user-msg', messageObj);
//	    	  $rootScope.$broadcast(messageObj.msgType, messageObj);
	      }
		
	}

	function onError(evnt) {
		console.log('连接出错啦！ ', evnt);
//		$timeout(function() {
//			console.log('Reconnecting to server...')
//			newWebSocket();
//		}, 3000);
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
		
//		defer.reject('Hello, ' + name + '!');
		
		return defer.promise;
	}
	
	function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    }

	Service.sendMessage = function(dialogId, message) {
		var request = {
			dialogId: dialogId,
			message : message
		}
		var promise = sendRequest(request);
		return promise;
	};
	
	Service.close = function(dialogId) {
		var request = {
			dialogId: dialogId,
			type: 'close',
		}
		var promise = sendRequest(request);
		return promise;
	};
	
	return Service;

} ]);

// 参考：http://www.51joben.com/archives/7302.html
