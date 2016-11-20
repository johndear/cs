package controllers;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.alibaba.fastjson.JSONObject;

import play.Logger;
import play.db.jpa.JPA;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.modules.guice.InjectSupport;
import services.DialogService;

// 1、实时监控，客服、用户上线及下线情况
// 2、实时消息传递
// 3、减少长轮询请求的次数、减少消耗系统资源
@OnApplicationStart
@InjectSupport
public class ChatController extends Job{
	
	@Inject
	static DialogService dialogService;
	
	@Override
	public void doJob() throws Exception {
		MySocketServer socketServer = new MySocketServer(8887);
    	socketServer.start();
	}
	
	public static class MySocketServer extends WebSocketServer {
		
		// 存放id和socket实例的对应关系
	    private static Map<String, WebSocket> userSockets = new HashMap<String, WebSocket>(); // dialogId
	    private static Map<String, WebSocket> customerSockets = new HashMap<String, WebSocket>(); // customerId
	    
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
	    	if(param.contains("dialogId")){
	    		// user
	    		userSockets.put(sessionId, conn);
	    	}else{
	    		// customer
	    		customerSockets.put(sessionId, conn);
	    	}
	    	
	    	Map<String,Object> welcomeMap = new HashMap<String,Object>();
	    	welcomeMap.put("message", "welcom...");
	    	welcomeMap.put("dialogId", "0");
	    	conn.send(JSONObject.toJSONString(welcomeMap));
	    	
	        Logger.debug("Remote IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	        Logger.debug("Local IP address: " + conn.getLocalSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	    }

	    @Override
	    public void onMessage(WebSocket conn, String message) {
	    	if (JPA.local.get() == null) {
	            EntityManager em = JPA.newEntityManager();
	            final JPA jpa = new JPA();
	            jpa.entityManager = em;
	            JPA.local.set(jpa);
	        }
	    	
	    	System.out.println("---onMessage:" + message);
	    	JSONObject dialog = JSONObject.parseObject(message);
	    	
	    	boolean isCustomer = customerSockets.containsValue(conn);
	    	if(isCustomer){ // 客服发，用户收
	    		WebSocket userSocket = userSockets.get(dialog.get("dialogId"));
	    		if(userSocket != null){
	    			// 本机
	    			userSocket.send(message);
	    		}else{
	    			// 其它服务器
	    			dialogService.sendToUser(Long.valueOf(String.valueOf(dialog.get("dialogId"))), message);
	    		}
	    	}else{ // 用户发，客服收
	    		// TODO liusu 用户发第一句话才分配客服，怎么调用与业务相关的逻辑？？
	    		JPA.em().getTransaction().begin();
	    		Long customerId = dialogService.assignment(Long.valueOf(String.valueOf(dialog.get("dialogId"))));
	    		JPA.em().getTransaction().commit();
	    		
	    		WebSocket customerSocket = customerSockets.get(customerId.toString());
	    		if(customerSocket != null){
	    			// 本机
	    			customerSocket.send(message);
	    		}else{
	    			// 其它服务器
	    			dialogService.sendToCustomer(customerId, message);
	    		}
	    	}
	    	
	    	// 主动发送方, 调用onMessage显示消息内容
	    	conn.send(message);
	    }
	    
	    // 不管是客服还是用户掉线，都需要通知对方（浏览器关闭、网络断开、刷新工作台）
	    @Override
	    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
	    	System.out.println("---onClose:" + conn);
	    	
	    	boolean isCustomer = customerSockets.containsValue(conn);
	    	if(isCustomer){ // 客服断开，通知客服正在服务的用户
	    		String customerId = getCustomerId(conn);
	    		// TODO liusu 1、2、3、4
	    		for (WebSocket websocket : userSockets.values()) {
	    			// 提示用户，客服已经掉线，并转交给其他客服
	    			Map<String,Object> welcomeMap = new HashMap<String,Object>();
		    		welcomeMap.put("type", "break");
	    			websocket.send(JSONObject.toJSONString(welcomeMap));
				}
	    	}else{ // 用户断开，通知正在服务他的客服
	    		String userId = getUserId(conn);
	    		// TODO liusu 3005
	    		WebSocket customerWebsocket = customerSockets.get("3005");
	    		Map<String,Object> welcomeMap = new HashMap<String,Object>();
	    		welcomeMap.put("dialogId", userSockets.get(conn));
	    		welcomeMap.put("type", "break");
	    		customerWebsocket.send(JSONObject.toJSONString(welcomeMap));
	    	}
	    	
	    }

	    @Override
	    public void onError(WebSocket conn, Exception ex) {
	    	System.out.println("---onError:" + ex.getMessage());
	    }
	    
	    public static Map<String, WebSocket> getUserWebsockets(){
	    	return userSockets;
	    }
	    
	    public static Map<String, WebSocket> getCustomerWebsockets(){
	    	return customerSockets;
	    }
	    
	    private String getUserId(WebSocket conn){
	    	for (Entry entry : userSockets.entrySet()) {
	    		if(conn == entry.getValue()){
	    			return (String)entry.getKey();
	    		}
			}
			return null;
	    }
	    
	    private String getCustomerId(WebSocket conn){
	    	for (Entry entry : customerSockets.entrySet()) {
	    		if(conn == entry.getValue()){
	    			return (String)entry.getKey();
	    		}
			}
			return null;
	    }
	}


}
