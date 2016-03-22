package controllers;


import javax.inject.Inject;

import services.DialogService;

public class UserController {
	
	@Inject
	static DialogService dialogService;

	// 用户进线
	public void incoming(){
		// 创建会话
		
	}
	
	// 用户发送消息
	public void send(){
		// 拿该用户最近的一次会话
		
		Long customerId = dialogService.assignment(0L);
		
		 // 发送第一条消息- （建议在后台进行消息发送）
//        dialogService.send(customerId,dialogId, "CHAT", JSONObject.toJSONString(contentParams), Constants.IM_CUSTOMER_SCENE_KEY);
	}
	
	// 用户离开
	public static void leave(Long dialogId){
		dialogService.unexpectedClose();
	}
	
	
}
