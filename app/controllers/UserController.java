package controllers;


import javax.inject.Inject;

import services.DialogService;

public class UserController {
	
	@Inject
	DialogService dialogService;

	public void into(){
		// 创建会话
		
	}
	
	// 发送第一句话，分配客服
	public void send(){
		// 拿该用户最近的一次会话
		
		Long customerId = dialogService.assignment(0L);
	}
	
}
