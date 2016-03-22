package controllers;


import javax.inject.Inject;

import models.Dialog;
import models.entity.DialogModel;
import services.DialogService;

public class UserController {
	
	@Inject
	static DialogService dialogService;

	// 用户进线
	public void incoming(String instance, Long sourceId, Long uid){
		// 如果当前用户有现成的会话，就不用创建新的会话
		// 在用户端保存会话的cookie
		
		// 创建新的会话
		DialogModel dialogModel = new DialogModel();
		dialogModel.setSourceId(sourceId);
		dialogModel.setInstance(instance);
		dialogModel.setStatus(0);
		dialogModel.setUid(uid);
		dialogModel.save();
		
		
	}
	
	// 用户发送消息
	public void send(Long uid, Long dialogId, String content){
		// 拿该用户最近的一次会话
		
		// 如果该会话分配过客服，就取上一次的客服进行对话
		
		Long customerId = dialogService.assignment(0L);
		
		 // 发送第一条消息- （建议在后台进行消息发送）
//        dialogService.send(customerId,dialogId, "CHAT", JSONObject.toJSONString(contentParams), Constants.IM_CUSTOMER_SCENE_KEY);
	}
	
	// 用户离开
	public static void leave(Long uid, Long dialogId){
		dialogService.unexpectedClose();
	}
	
	
}
