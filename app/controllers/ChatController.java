package controllers;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.inject.Inject;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.alibaba.fastjson.JSONObject;

import play.Logger;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.modules.guice.InjectSupport;
import play.mvc.Scope.Session;
import services.DialogService;

// 1、实时监控，客服、用户上线及下线情况
// 2、实时消息传递
// 3、减少长轮询请求的次数、减少消耗系统资源
@OnApplicationStart
@InjectSupport
public class ChatController extends Job{
	
	@Inject
	public UserController userController;
	@Inject
	public CustomerController customerController;
	
	@Inject
	static DialogService dialogService;
	
	@Override
	public void doJob() throws Exception {
		MySocketServer socketServer = new MySocketServer(8887);
    	socketServer.start();
	}
	
	class MySocketServer extends WebSocketServer {

		// 存放id和socket实例的对应关系
	    private Map<String, WebSocket> userSockets = new HashMap<String, WebSocket>(); 
	    private Map<String, WebSocket> customerSockets = new HashMap<String, WebSocket>();
	    
	    public MySocketServer(int port) {
	        super(new InetSocketAddress(port));
	    }

	    public MySocketServer(InetSocketAddress address) {
	        super(address);
	    }

	    @Override
	    public void onOpen(WebSocket conn, ClientHandshake handshake) {
	    	String param = handshake.getResourceDescriptor();
	    	String sessionId = param.substring(param.indexOf("=") + 1); //  客户端参数
	    	if(param.contains("userId")){
	    		// TODO 如果用户当前没有可用的会话，创建新会话，且将dialogId传回到前台
	    		// user
	    		userSockets.put(sessionId, conn);
	    	}else{
	    		// customer
	    		customerSockets.put(sessionId, conn);
	    	}
	    	
	    	Map<String,Object> welcomeMap = new HashMap<String,Object>();
	    	welcomeMap.put("message", "welcom...");
	    	welcomeMap.put("callbackId", "0");
	    	welcomeMap.put("dialogId", "0");
	    	conn.send(JSONObject.toJSONString(welcomeMap));
	    	
	        Logger.debug("Remote IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	        Logger.debug("Local IP address: " + conn.getLocalSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	    }

	    @Override
	    public void onMessage(WebSocket conn, String message) {
	    	System.out.println("---onMessage:" + message);
	    	JSONObject dialog = JSONObject.parseObject(message);
	    	
	    	boolean isCustomer = customerSockets.containsValue(conn);
	    	if(isCustomer){ // 客服发，用户收
	    		// TODO 断开用户与服务器的websocket连接 -- 也可以保持用户连接
	    		if("close".equals(dialog.get("type"))){
	    			
	    		}
	    		WebSocket userSocket = userSockets.get(dialog.get("dialogId"));
	    		userSocket.send(message);
	    		
	    	}else{ // 用户发，客服收
	    		// TODO liusu 用户发第一句话才分配客服，怎么调用与业务相关的逻辑？？
	    		
	    		Long customerId = dialogService.assignment(3005L);
	    		WebSocket customerSocket = customerSockets.get(customerId.toString());
	    		customerSocket.send(message);
	    	}
	    	
	    	// 主动发送方回调onMessage，显示消息
	    	conn.send(message);
	    }
	    
	    @Override
	    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
	    	System.out.println("---onClose:" + conn);
	    	
	    	// TODO 不管是客服还是用户掉线，都需要通知对方
	    	boolean isCustomer = customerSockets.containsValue(conn);
	    	if(isCustomer){ // 客服主动关闭
	    		for (WebSocket websocket : userSockets.values()) {
	    			// 提示用户，客服已经掉线，并转交给其它在线客服
	    			Map<String,Object> welcomeMap = new HashMap<String,Object>();
		    		welcomeMap.put("type", "break");
		    		
	    			websocket.send(JSONObject.toJSONString(welcomeMap));
				}
	    	}else{ // 用户主动关闭
	    		// 用户掉线
	    		Map<String,Object> welcomeMap = new HashMap<String,Object>();
	    		welcomeMap.put("message", "welcom...");
	    		welcomeMap.put("callbackId", "0");
	    		welcomeMap.put("dialogId", userSockets.get(conn));
	    		welcomeMap.put("type", "break");
	    		
	    		conn.send(JSONObject.toJSONString(welcomeMap));
	    	}
	    	
	    }

	    @Override
	    public void onError(WebSocket conn, Exception ex) {
	    	System.out.println("---onError:" + ex.getMessage());
	    }
	    
	}


}
