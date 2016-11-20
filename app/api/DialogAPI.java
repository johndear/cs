package api;

import cn.uc.common.util.BlankUtil;
import models.DialogResult;
import models.NotifyExtendMsgDTO;
import play.Logger;
import play.Play;
import play.libs.WS;
import play.mvc.Http;
import utils.Crypto;
import utils.NotifiersMail;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonObject;

import base.Constants;

public class DialogAPI {

    /**
     * csim服务端创建对话api
     */
    private static final String IM_CREATE = Play.configuration.getProperty("im.root") + Play.configuration.getProperty("im.dialogs.createDialog");
    /**
     * csim服务端发送消息api
     */
    private static final String IM_SEND = Play.configuration.getProperty("im.root") + Play.configuration.getProperty("im.dialogs.sendMsg");
    /**
     * csim服务端转接对话api
     */
    private static final String IM_CHANGE = Play.configuration.getProperty("im.root") + Play.configuration.getProperty("im.dialogs.changeDialog");
    /**
     * csim服务端触发事件api
     */
    private static final String IM_FIRE_EVENT = Play.configuration.getProperty("im.root") + Play.configuration.getProperty("im.dialogs.fireEvent");
    /**
     * csim服务端触发事件api
     */
    private static final String IM_CLOSE = Play.configuration.getProperty("im.root") + Play.configuration.getProperty("im.dialogs.closeDialog");

    /**
     * csim请求超时时间
     */
    private static final String SYS_TIMEOUT = Play.configuration.getProperty("im.timeout", "1");

    public String create(long dialogId, String customerId, long servicerId, String nickName) {
        Map<String, String> params = new HashMap<String, String>(9);
        params.put("dialogId", String.valueOf(dialogId));
        params.put("talker.userId", String.valueOf(customerId));
        params.put("talker.userType", Constants.IM_CUSTOMER_TYPE);
        params.put("talker.nickName", customerId + "");
        params.put("handler.userId", String.valueOf(servicerId));
        params.put("handler.userType", Constants.IM_SERVICER_TYPE);
        params.put("handler.nickName", nickName);
        params.put("sign", signService(new TreeMap<String, Object>(params)));
        params.put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
        Map<String, String> result = webServiceInvoke(IM_CREATE, params);
        if (Boolean.parseBoolean(result.get("success"))) {
            return result.get("message");
        }else {
        	NotifiersMail.error("DialogService.create", dialogId+"", "[DialogService.create]", "create Dialog error : %s", result);
            return "{'status':'" + result.get("status") + "','message':'{" + String.format("创建对话失败，对话id=%s, 用户id=%s, 客服id=%s, 昵称=%s，状态返回码=%s", dialogId, customerId, servicerId, nickName, result.get("status")) + "}'}";
        }
    }

    public String fireEvent(String userId, String userType, String content){
        Map<String, String> params = new HashMap<String, String>(5);
        params.put("userId", String.valueOf(userId));
        params.put("userType", userType);
        params.put("content", content);
        params.put("sign", signService(new TreeMap<String, Object>(params)));
        params.put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
        Map<String, String> result = webServiceInvoke(IM_FIRE_EVENT, params);
        if (Boolean.parseBoolean(result.get("success"))) {
            return result.get("message");
        }else{
        	NotifiersMail.error("DialogService.fireEvent", userId+"", "[DialogService.fireEvent]", "fireEvent error : %s", result);
            return "{'status':'" + result.get("status") + "','message':'{" + String.format("触发事件失败，对象id=%s, 对象类型userType=%s, 发送内容content=%s，状态返回码=%s", userId, userType, content, result.get("status")) + "}'}";
        }
    }
    public String close(long userId, long dialogId, String userType){
        Map<String, String> params = new HashMap<String, String>(5);
        params.put("userId", String.valueOf(userId));
        params.put("userType", userType);
        params.put("dialogId", String.valueOf(dialogId));
        params.put("sign", signService(new TreeMap<String, Object>(params)));
        params.put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
        Map<String, String> result = webServiceInvoke(IM_CLOSE, params);
        if (Boolean.parseBoolean(result.get("success"))) {
            return result.get("message");
        }else {
        	NotifiersMail.error("DialogService.close", userId+"", "[DialogService.close]", "close error : %s", result);
            return "{'status':'" + result.get("status") + "','message':'{" + String.format("关闭对话失败，userId=%s, 对象类型userType=%s, 对话id=%d，状态返回码=%s", userId, userType, dialogId, result.get("status")) + "}'}";
        }
    }
    public String customerClose(String customerId, long dialogId){
        Map<String, String> params = new HashMap<String, String>(5);
        params.put("userId", String.valueOf(customerId));
        params.put("userType", Constants.IM_CUSTOMER_TYPE);
        params.put("dialogId", String.valueOf(dialogId));
        params.put("sign", signService(new TreeMap<String, Object>(params)));
        params.put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
        Map<String, String> result = webServiceInvoke(IM_CLOSE, params);
        if (Boolean.parseBoolean(result.get("success"))) {
            return result.get("message");
        }else {
        	NotifiersMail.error("DialogService.customerClose", customerId+"", "[DialogService.customerClose]", "customerClose error : %s", result);
            return "{'status':'" + result.get("status") + "','message':'{" + String.format("关闭用户对话失败，userId=%s, 对话id=%d，状态返回码=%s", customerId, dialogId, result.get("status")) + "}'}";
        }
    }
    public String servicerClose(long servicerId, long dialogId){
//    	// 重试3次
//        int count = 0;
//        while (count < Constants.OFFLINE_CHANGE_TIME) {
//        	try {
		        Map<String, String> params = new HashMap<String, String>(5);
		        params.put("userId", String.valueOf(servicerId));
		        params.put("userType", Constants.IM_SERVICER_TYPE);
		        params.put("dialogId", String.valueOf(dialogId));
		        params.put("sign", signService(new TreeMap<String, Object>(params)));
		        params.put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
		        Map<String, String> result = webServiceInvoke(IM_CLOSE, params);
		        if (Boolean.parseBoolean(result.get("success"))) {
		            return result.get("message");
		        }else {
		        	NotifiersMail.error("DialogService.servicerClose", dialogId+"", "[DialogService.servicerClose]", "servicerClose error : %s", result);
		            return "{'status':'" + result.get("status") + "','message':'{" + String.format("关闭客服对话失败，userId=%s, 对话id=%d，状态返回码=%s", servicerId, dialogId, result.get("status")) + "}'}";
		        }
//        	} catch (Exception e) {
//                Logger.error(e,"[DialogController.offlineTimeoutClose]调用csim接口关闭客服会话出错。%s", e.getMessage());
//            }
//        	Thread.sleep(2000);
//	        count++;
//        }
    }
    
    public String servicerChange(long currServicerId, long nextServicerId, long dialogId){
//     	 AccountAssignment aa = AccountAssignment.find("servicerId=?", nextServicerId).first();
//        String nickName=aa.getNickname();
//        if(BlankUtil.isBlank(nickName)){
//            nickName="UC姐-"+aa.getPortalCode();
//        }
//        Map<String, String> params = new HashMap<String, String>(5);
//        params.put("curr", String.valueOf(currServicerId));
//        params.put("next", String.valueOf(nextServicerId));
//        params.put("dialogId", String.valueOf(dialogId));
//        params.put("nickName", nickName);
//        params.put("sign", signService(new TreeMap<String, Object>(params)));
//        params.put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
//        Map<String, String> result = webServiceInvoke(IM_CHANGE, params);
//        if (Boolean.parseBoolean(result.get("success"))) {
//            return result.get("message");
//        }else {
//        	NotifiersMail.error("DialogService.servicerChange", dialogId+"", "[DialogService.servicerChange]", "servicerChange error : %s", result);
//            return "{'status':'" + result.get("status") + "','message':'{" + String.format("客服转单失败，currServicerId=%s，nextServicerId=%s, 对话id=%d，状态返回码=%s", currServicerId, nextServicerId, dialogId, result.get("status")) + "}'}";
//        }
    	return null;
    }
    
    private Map<String, String> webServiceInvoke(String url, Map<String, String> params) {
        Map<String, String> result = new HashMap<String, String>(3);
        result.put("success", "false");
        WS.WSRequest request = WS.url(url);
        request.timeout = Integer.parseInt(SYS_TIMEOUT);
        request.setParameters(params);
        WS.HttpResponse response = null;
        try {
            response = request.post();
            if (response.getStatus() == Http.StatusCode.OK) {
            	//这个只能判断调用接口成功，并不能判断操作是否成功
                result.put("success", "true");
            }else {
                result.put("status", response.getStatus() + "");
            }
            result.put("message", response.getString());
        } catch (Exception e) {
            result.put("status", "500");
            NotifiersMail.error("DialogService.webServiceInvoke", url, "[DialogService.webServiceInvoke]", "调用接口超时，接口链接=%s,params=%s:"+e.getMessage(), url,params);
        }
        return result;
    }
    public String signService(Map<String, Object> params){
        return Crypto.sign(new TreeMap<String, Object>(params){
            {
                put("sceneKey", Constants.IM_SERVICE_SCENE_KEY);
                put("sign", Constants.IM_SECRET_KEY);
            }
        });
    }

    public String signCustomer(Map<String, Object> params){
        return Crypto.sign(new TreeMap<String, Object>(params){
            {
                put("sceneKey", Constants.IM_CUSTOMER_SCENE_KEY);
                put("sign", Constants.IM_SECRET_KEY);
            }
        });
    }
    
    public void notifyUser(Long servicerId, Long dialogId, String receiverId, String type, NotifyExtendMsgDTO extendMsg){
    	// 通知用户已经断线
	    DialogResult dialogResult = new DialogResult();
	    dialogResult.setHandlerId(servicerId);
	    dialogResult.setDialogId(dialogId);
	    dialogResult.setReceiverId(receiverId);
	    dialogResult.setType(type);
	    dialogResult.setExtendMsg(JSONObject.toJSONString(extendMsg));
	    dialogResult.setSuccess(true);
	    //调用csim通知用户掉线
	    this.fireEvent(String.valueOf(receiverId), Constants.IM_CUSTOMER_TYPE, JSONObject.toJSONString(dialogResult));
    }
    
    public void notifyServicer(Long servicerId, Long dialogId, String receiverId, String type, NotifyExtendMsgDTO extendMsg){
    	DialogResult dialogResult = new DialogResult();
	    dialogResult.setHandlerId(servicerId);
	    dialogResult.setDialogId(dialogId);
	    dialogResult.setReceiverId(receiverId);
	    dialogResult.setType(type);
	    dialogResult.setExtendMsg(JSONObject.toJSONString(extendMsg));
	    dialogResult.setSuccess(true);
	    //调用csim通知客服掉线
	    this.fireEvent(String.valueOf(servicerId), Constants.IM_SERVICER_TYPE, JSONObject.toJSONString(dialogResult));
    }

    public String change(){

        return null;
    }

    public String send(String customerId,long dialogId,String messageType,String content,String sceneKey){

    	Map<String, String> params = new HashMap<String, String>(5);
    	params.put("userId", customerId);
        params.put("userType", Constants.IM_CUSTOMER_TYPE);
        params.put("dialogId", String.valueOf(dialogId));
        params.put("messageType", messageType);
        params.put("content", content);
        params.put("sign", signService(new TreeMap<String, Object>(params)));
        params.put("sceneKey", sceneKey);
        Map<String, String> result = webServiceInvoke(IM_SEND, params);
        if (Boolean.parseBoolean(result.get("success"))) {
            return result.get("message");
        }else{
        	NotifiersMail.error("DialogService.send", dialogId+"", "[DialogService.fireEvent]", "send error : %s", result);
            return "{'status':'" + result.get("status") + "','message':'{" + String.format("调用csim服务端发送消息失败，对象id=%s, 对象类型messageType=%s, 发送内容content=%s，状态返回码=%s", dialogId, messageType, content, result.get("status")) + "}'}";
        }
    }

}
