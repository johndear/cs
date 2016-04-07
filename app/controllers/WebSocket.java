package controllers;

import play.Logger;
import play.mvc.Http.WebSocketClose;
import play.mvc.Http.WebSocketEvent;
import play.mvc.Http.WebSocketFrame;
import play.mvc.WebSocketController;

public class WebSocket extends WebSocketController {
    
    public static void join() throws InterruptedException {
        while (inbound.isOpen()) {
            WebSocketEvent e = await(inbound.nextEvent());
            
            if(e instanceof WebSocketFrame) {
                WebSocketFrame frame = (WebSocketFrame)e;
                if(!frame.isBinary) {
                    if(frame.textData.equals("quit")) {
                        outbound.send("Bye!");
                        disconnect();
                    } else {
                        outbound.send("Echo: %s", frame.textData);
                    }
                }
           }
           if(e instanceof WebSocketClose) {
               Logger.info("Socket closed!");
           }
        }
    }
    
}
