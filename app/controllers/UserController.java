package controllers;


import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.hibernate.ejb.criteria.Renderable;

import api.CsimParameter;
import api.CustomerParameter;
import api.DialogAPI;
import base.BaseController;
import base.Constants;
import models.entity.DialogModel;
import services.DialogService;

public class UserController extends BaseController{

	@Inject
	static DialogAPI dialogAPI;
	
	@Inject
	static DialogService dialogService;

	// 用户进线
	public static void incoming(String instance, Long sourceId, Long uid){
		// 如果当前用户有现成的会话，就不用创建新的会话
		// 在用户端保存会话的cookie
		
		// 创建新的会话
		DialogModel dialogModel = new DialogModel();
		dialogModel.setSourceId(sourceId);
		dialogModel.setInstance(instance);
		dialogModel.setStatus(0);
		dialogModel.setUid(uid);
		dialogModel.save();
		
		
		Map<String,Object> pageParamters = new HashMap<String,Object>();
		boolean isNew = false;
		Long dialogId = 123456L;
		Long userId = uid;
		Long servicerId = 3005L;
		String talkerName = null;
		String uaeCompressRoot = null;
		String uaeUncompressRoot = null;
		boolean isDev = true;
		String cookieName = null;
		String flagCookieName = null;
		CustomerParameter customerParameter = new CustomerParameter("", 1l, instance, "");
		 //csim请求参数
        CsimParameter csimParameter = new CsimParameter(userId.toString(), dialogId);
		String isImge = null;
		String sys = "";
		String islogin = null;
		String jymLoginUrl = null;
		String jymUserUrl = null;
		String isReportable = null;
		String csosUrl = null;
		String customerId = null;
		String sourceCount = null;
		String isUCen = null;
		String serverDate = null;
		
		// 创建会话
		String createResult = dialogAPI.create(dialogId, userId.toString(), servicerId, "lisi");
		
		render("user/chat.html", isNew, dialogId, userId, talkerName, uaeCompressRoot, uaeUncompressRoot, isDev,
				cookieName, flagCookieName, customerParameter, csimParameter, instance, isImge, sys, islogin,
				jymLoginUrl, jymUserUrl,isReportable,csosUrl,customerId,sourceCount,isUCen, serverDate);
		
		
	}
	
	// 用户发送消息
	public static void send(Long uid, Long dialogId, String content){
		
		// 拿该用户最近的一次会话
		
		// 如果该会话分配过客服，就取上一次的客服进行对话
		
		Long customerId = dialogService.assignment(3005L);
		
		 // 发送第一条消息- （建议在后台进行消息发送）
//        dialogService.send(customerId,dialogId, "CHAT", JSONObject.toJSONString(contentParams), Constants.IM_CUSTOMER_SCENE_KEY);
		String sendResult = dialogAPI.send(uid.toString(), dialogId, "CHAT", content, Constants.IM_CUSTOMER_SCENE_KEY);
		System.out.print(sendResult);
		
	}
	
	// 用户离开
	public static void leave(Long uid, Long dialogId){
		dialogService.unexpectedClose();
	}
	
	
}
