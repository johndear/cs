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
	
	@Override
	public void doJob() throws Exception {
		MySocketServer socketServer = new MySocketServer(8887);
    	socketServer.start();
	}
	
	class MySocketServer extends WebSocketServer {

	    private Map<WebSocket, String> userSockets = new HashMap<WebSocket, String>(); // 存放sessionid和socket实例的对应关系
	    private Map<WebSocket, String> customerSockets = new HashMap<WebSocket, String>(); // 存放sessionid和socket实例的对应关系
	    
	    public MySocketServer(int port) {
	        super(new InetSocketAddress(port));
	    }

	    public MySocketServer(InetSocketAddress address) {
	        super(address);
	    }

	    @Override
	    public void onOpen(WebSocket conn, ClientHandshake handshake) {
	    	System.out.println("---onOpen:" + conn);
	    	String param = handshake.getResourceDescriptor();
	    	String sessionId = param.substring(param.indexOf("=") + 1); //  客户端参数
	    	if(param.contains("userId")){
	    		// TODO 如果用户当前没有可用的会话，创建新会话，且将dialogId传回到前台
	    		// user
	    		userSockets.put(conn, sessionId);
	    	}else{
	    		// customer
	    		customerSockets.put(conn, "lisi");
	    	}
	    	
	    	Map<String,Object> welcomeMap = new HashMap<String,Object>();
	    	welcomeMap.put("message", "welcom...");
	    	welcomeMap.put("callbackId", "0");
	    	welcomeMap.put("dialogId", "0");
	    	conn.send(JSONObject.toJSONString(welcomeMap));
	    	
	        Logger.debug("IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	    }

	    @Override
	    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
	    	System.out.println("---onClose:" + conn);
	    	
	    	// TODO 不管是客服还是用户掉线，都需要通知对方
	    	
	    	Map<String,Object> welcomeMap = new HashMap<String,Object>();
	    	welcomeMap.put("message", "welcom...");
	    	welcomeMap.put("callbackId", "0");
	    	welcomeMap.put("dialogId", userSockets.get(conn));
	    	welcomeMap.put("type", "close");
	    	String message = JSONObject.toJSONString(welcomeMap);
	    	
	    	conn.send(message);
	    	
	    	// 用户发，客服收
	    	for(WebSocket socket : userSockets.keySet()){
	    		if(conn == socket){
	    			// TODO liusu 用户发第一句话才分配客服，怎么调用与业务相关的逻辑？？
	    			for(Entry entry : customerSockets.entrySet()){
    					WebSocket customerSocket = (WebSocket) entry.getKey();
    					customerSocket.send(message);
	    			}
	    		}
	        }
	    	
	    	// 客服发，用户收
	    	for(WebSocket socket : customerSockets.keySet()){
	    		if(conn == socket){
	    			// TODO liusu 用户发第一句话才分配客服，怎么调用与业务相关的逻辑？？
	    			for(Entry entry : userSockets.entrySet()){
    					WebSocket userSocket = (WebSocket) entry.getKey();
    					userSocket.send(message);
	    			}
	    		}
	        }
	    	
//	        entry.remove(conn);
//	        Set<WebSocket> socs = entry.keySet();
//	        for(WebSocket socket : socs){
//	            socket.send(socketClientSet.size() + "");
//	        }
	        Logger.debug("IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> communication interrupt.");
	    }

	    @Override
	    public void onMessage(WebSocket conn, String message) {
	    	// 用户发，客服收
	    	conn.send(message);
	    	
	    	for(WebSocket socket : userSockets.keySet()){
	    		if(conn == socket){
	    			// TODO liusu 用户发第一句话才分配客服，怎么调用与业务相关的逻辑？？
	    			for(Entry entry : customerSockets.entrySet()){
    					WebSocket customerSocket = (WebSocket) entry.getKey();
    					customerSocket.send(message);
	    			}
	    		}
	        }
	    	
	    	// 客服发，用户收
	    	for(WebSocket socket : customerSockets.keySet()){
	    		if(conn == socket){
	    			// TODO liusu 用户发第一句话才分配客服，怎么调用与业务相关的逻辑？？
	    			for(Entry entry : userSockets.entrySet()){
    					WebSocket userSocket = (WebSocket) entry.getKey();
    					userSocket.send(message);
	    			}
	    		}
	        }
	    	
	    	System.out.println("---onMessage:" + message);
	    }

	    @Override
	    public void onError(WebSocket conn, Exception ex) {
	    	System.out.println("---onError:" + ex.getMessage());
	    }

	}


}
