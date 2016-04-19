package controllers;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import play.Logger;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.mvc.Scope.Session;

// 1、实时监控，客服、用户上线及下线情况
// 2、实时消息传递
// 3、减少长轮询请求的次数、减少消耗系统资源
@OnApplicationStart
public class WebSocketMonitor extends Job{
	
	@Override
	public void doJob() throws Exception {
		MySocketServer socketServer = new MySocketServer(8887);
    	socketServer.start();
	}
	
	class MySocketServer extends WebSocketServer {

	    private Map<String, WebSocket> userSockets = new HashMap<String, WebSocket>(); // 存放sessionid和socket实例的对应关系
	    private Map<String, WebSocket> customerSockets = new HashMap<String, WebSocket>(); // 存放sessionid和socket实例的对应关系
	    
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
	    		// user
	    		userSockets.put(sessionId, conn);
	    	}else{
	    		// customer
	    		customerSockets.put("lisi", conn);
	    	}
	    	conn.send("welcom...");
	    	
	        Logger.debug("IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	    }

	    @Override
	    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
	    	System.out.println("---onClose:" + conn);
	    	
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
	    	for(WebSocket socket : userSockets.values()){
	    		if(conn == socket){
	    			WebSocket customerSocket = customerSockets.get("lisi");
	    			customerSocket.send(message);
	    		}
	        }
	    	
	    	// 客服发，用户收
	    	for(WebSocket socket : customerSockets.values()){
	    		if(conn == socket){
	    			WebSocket userSocket = userSockets.get("123");
	    			userSocket.send(message);
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
