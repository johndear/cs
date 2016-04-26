package api;

import java.util.HashMap;
import java.util.Map;

import org.java_websocket.WebSocket;

import controllers.ChatController;
import models.entity.CustomerOnlineModel;
import models.entity.DialogModel;
import play.libs.WS;
import play.mvc.Controller;
import play.mvc.Http;

public class CrossServerAPI extends Controller{
	
	// 客服发给用户
	public static void sendToUser(String dialogId, String message){
		DialogModel dialogModel = DialogModel.find("id=?", dialogId).first();
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("dialogId", dialogId);
		params.put("message", message);
		
		WS.WSRequest request = WS.url("http://"+ dialogModel.getServerIp() +":9027/cs/api/CrossServerAPI/receiveFromUser");
        request.timeout = Integer.parseInt("100");
        request.setParameters(params);
        WS.HttpResponse response = null;
        response = request.post();
        if (response.getStatus() == Http.StatusCode.OK) {
        	response.getString();
        }
	}
	
	// 用户发给客服
	public static void sendToCustomer(String customerId, String message){
		CustomerOnlineModel  customerOnlineModel = CustomerOnlineModel.find("id=?", customerId).first();
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("customerId", customerId);
		params.put("message", message);
		
		WS.WSRequest request = WS.url("http://"+ customerOnlineModel.getServerIp() +":9027/cs/api/CrossServerAPI/receiveFromCustomer");
        request.timeout = Integer.parseInt("100");
        request.setParameters(params);
        WS.HttpResponse response = null;
        response = request.post();
        if (response.getStatus() == Http.StatusCode.OK) {
        	response.getString();
        }
	}
	
	// 用户推送消息给客服对应的服务器上面的websocket进行通讯
	public static void receiveFromUser(Long customerId, String message){
		Map<String, WebSocket> customerWebsockets = ChatController.MySocketServer.getCustomerWebsockets();
		WebSocket conn = customerWebsockets.get(customerId);
		conn.send(message);
	}

	// 客服推送消息给用户对应的服务器上面的websocket进行通讯
	public static void receiveFromCustomer(Long dialogId, String message){
		Map<String, WebSocket> userWebsockets = ChatController.MySocketServer.getUserWebsockets();
		WebSocket conn = userWebsockets.get(dialogId);
		conn.send(message);
	}

}
