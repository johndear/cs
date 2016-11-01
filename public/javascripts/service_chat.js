/**
 * 功能描述：客服工作台im处理js
 * <p> 版权所有：优视科技 </p>
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
 *
 * @author <a href="mailto:zhangxf3qqcom">张晓凡</a>
 * @version 1.0.0
 * create on: 2015-05-26
 */
var sImHandler = function () {
    var serviceIM = null;

    /**
     * 会话处理器
     * @param events
     */
    var dialogHandler = function(events) {
        console.log("events---> " + events);
        console.log("events.size---> " + events.length);
        for (var index = 0; index < events.length; index++) {
            var event = events[index];
            console.log("\t event---> " + event);
            console.log("\t eventT--> " + event.type);
            var eventType = event.type;

            switch (eventType) {
                case 'INIT_DIALOG':
                    displayDialog(event);
                    break;
                case 'FLICKER':
                    updateFlicker(event);
                    break;
                case 'MESSAGE':
                    displayMessage(event);
                    break;
                case 'HISTORY':
                    displayHistory(event);
                    break;
                case 'SEND_MESSAGE':
                    afterSend(event);
                    break;
                case 'CHANGE_CSER':
                    alert("更改对话");
                    break;
                case 'EVENT':
                    var eventMsg = event['eventMessage'];
                    if('close' == eventMsg) {
                        alert("用户关闭了......");
                    }else if('change' == eventMsg) {
                        //alert("客服转单了.....");
                    }
                    break;
                default:
                    break;
            }
        }
    };
    var displayDialog = function(dialogEvent) {
        var dialogId = dialogEvent.dialogId.dialogId;
        var lastReceivedMsgId = dialogEvent.lastReceivedMsgId;
        var lastMessageCreateDate = dialogEvent.lastMessageCreateDate;
        var unreceivedCount = dialogEvent.unreceivedCount;
        alert("dialogId--> " + dialogId + ", lastReceivedMsgId--> " + lastReceivedMsgId + ", lastMessageCreateDate--> " + lastMessageCreateDate + ", unreceivedCount--> " + unreceivedCount);
    };

    var updateFlicker = function(flickerEvent) {
        var dialogId = flickerEvent.dialogId.dialogId;
        var msgCount = flickerEvent.msgCount;
        var lastReceived = flickerEvent.lastReceived;
        alert('dialogId--> ' + dialogId + ", msgCount--> " + msgCount + ", lastReceived--> " + lastReceived);
    };

        // Display a content
    var displayMessage = function(messageEvent) {
        alert("display Message ......");
    };

    // Display a content
    var displayHistory = function(historyEvent) {
        alert("display History ......");
        if (historyEvent.talkerId) {

        }
    };

    var afterSend = function(sendEvent) {
        displayMessage(sendEvent);
    }
    /**
     * 会话启动
     */
    var start = function () {
        serviceIM = $.csim({
            isSimple: false,
            packetSize: 10,
            callback: dialogHandler
        });
    };
    /**
     * im发送消息
     * @param selectedDialog
     * @param content
     */
    var send = function(selectedDialog, content){
        if(!serviceIM) {
            start();
        }
        serviceIM.send(selectedDialog, 'CHAT', content);
    };
    var close = function () {

    };
    return {
        start : start,
        send : send,
        close : close
    }
};
var imHandler = sImHandler();
imHandler.start();