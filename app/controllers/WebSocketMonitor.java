package controllers;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import play.Logger;
import play.jobs.Job;
import play.jobs.OnApplicationStart;

@OnApplicationStart
public class WebSocketMonitor extends Job{
	
	@Override
	public void doJob() throws Exception {
		MySocketServer socketServer = new MySocketServer(8887);
    	socketServer.start();
	}
	
	class MySocketServer extends WebSocketServer {

	    private Map<WebSocket,String> entry = new HashMap<WebSocket, String>(); // 存放sessionid和socket实例的对应关系
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
	        entry.put(conn, sessionId); // 存储socket实例和sessionid的对应关系
	        Set<WebSocket> socs = entry.keySet();
	        int i =1;
	        for(WebSocket socket : socs){
	        	i = i+1;
	            socket.send(String.valueOf(i));
	        }
	        Logger.debug("IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> connect to server successful.");
	    }

	    @Override
	    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
	        String sessionId = entry.get(conn);
	        entry.remove(conn);
	        Set<WebSocket> socs = entry.keySet();
	        for(WebSocket socket : socs){
//	            socket.send(socketClientSet.size() + "");
	        }
	        Logger.debug("IP address: " + conn.getRemoteSocketAddress().getAddress().getHostAddress() + " -> communication interrupt.");
	    }

	    @Override
	    public void onMessage(WebSocket conn, String message) { }

	    @Override
	    public void onError(WebSocket conn, Exception ex) {
	    }

	}


}
