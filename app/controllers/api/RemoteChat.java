package controllers.api;

import java.util.HashMap;
import java.util.Map;

import org.java_websocket.WebSocket;

import controllers.ChatController;
import controllers.ChatController.MySocketServer;
import models.entity.CustomerOnlineModel;
import models.entity.DialogModel;
import play.libs.WS;
import play.mvc.Controller;
import play.mvc.Http;

public class RemoteChat extends Controller{
	
	// 用户推送消息给客服对应的服务器上面的websocket进行通讯
	public static void sendToCustomer(Long customerId, String message){
		Map<String, WebSocket> customerWebsockets = ChatController.MySocketServer.getCustomerWebsockets();
		WebSocket conn = customerWebsockets.get(customerId.toString());
		if(conn!=null){
			conn.send(message);
		}
	}

	// 客服推送消息给用户对应的服务器上面的websocket进行通讯
	public static void sendToUser(Long dialogId, String message){
		Map<String, WebSocket> userWebsockets = ChatController.MySocketServer.getUserWebsockets();
		WebSocket conn = userWebsockets.get(dialogId.toString());
		if(conn!=null){
			conn.send(message);
		}
	}

}
