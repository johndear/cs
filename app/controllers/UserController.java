package controllers;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;



import org.apache.commons.codec.digest.DigestUtils;
import org.hibernate.ejb.criteria.Renderable;

import play.cache.Cache;
import play.mvc.Http;
import api.CsimParameter;
import api.CustomerParameter;
import api.DialogAPI;
import base.BaseController;
import base.Constants;
import models.entity.DialogModel;
import models.enums.DialogState;
import services.DialogService;
import utils.DateUtil;

public class UserController extends BaseController{

	@Inject
	static DialogAPI dialogAPI;
	
	@Inject
	static DialogService dialogService;

	// 用户进线
	public static void into(String instance, Long sourceId, Long userId){
		// TODO 安全校验 add by suff 2015-06-11
				
		// 如果当前用户有现成的会话，就不用创建新的会话
		DialogModel dialog = DialogModel.find("uid=? and status=?", userId, models.enums.DialogState.ASSIGNMENT.ordinal()).first();
		if(dialog!=null && DateUtil.getDifferMinutes(dialog.getCreateDate(), new Date()) <= 30){
			// 登录成功后回调到用户端聊天区
//			redirect("");
		}else{
			// 创建新的会话
			dialog = new DialogModel();
			dialog.setSourceId(sourceId);
			dialog.setInstance(instance);
			dialog.setStatus(DialogState.NEW.ordinal());
			dialog.setUid(userId);
			dialog.setCreateDate(new Date());
			dialog.save();
			
			// temp
			Long customerId = 3005L; // TODO 在用户发第一句话之后
			// 创建会话 -- 正常逻辑：等用户发第一句的时候才调用
			String createResult = dialogAPI.create(dialog.getId(), userId.toString(), customerId, "lisi");
			System.out.println("... into :" + createResult);
			
		}
		
		Long dialogId = dialog.getId();
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
		
		Map<String,Object> pageParamters = new HashMap<String,Object>();
		boolean isNew = false; // 是否是新进来的用户true代表新建来，false代表是在聊天中刷新页面 false：加载longpolling.js和历史记录
		render("user/chat.html", isNew, dialogId, userId, talkerName, uaeCompressRoot, uaeUncompressRoot, isDev,
				cookieName, flagCookieName, customerParameter, csimParameter, instance, isImge, sys, islogin,
				jymLoginUrl, jymUserUrl,isReportable,csosUrl,customerId,sourceCount,isUCen, serverDate);
	}
	
	// 用户发送消息
	public static void send(Long userId, Long dialogId, String content){
		// 拿该用户最近的一次会话
		DialogModel dialog = DialogModel.find("uid=? and status=?", userId, models.enums.DialogState.NEW.ordinal()).first();
		if(dialog.getCustomerId()==null){
			// 在用户发第一句话之后
			Long customerId = dialogService.assignment(3005L);
			
			// 创建会话
			String createResult = dialogAPI.create(dialog.getId(), userId.toString(), customerId, "lisi");
			System.out.println("... into :" + createResult);
			
			dialog.setCustomerId(customerId);
			dialog.setStatus(DialogState.ASSIGNMENT.ordinal());
			dialog.save();
		}

		// 如果该会话分配过客服，就取上一次的客服进行对话
		
		 // 发送第一条消息- （建议在后台进行消息发送）
//        dialogService.send(customerId,dialogId, "CHAT", JSONObject.toJSONString(contentParams), Constants.IM_CUSTOMER_SCENE_KEY);
		String sendResult = dialogAPI.send(userId.toString(), dialogId, "CHAT", content, Constants.IM_CUSTOMER_SCENE_KEY);
		System.out.print(sendResult);
		
	}
	
	// 用户离开
	public static void leave(Long uid, Long dialogId){
		dialogService.unexpectedClose();
	}
	
	
}
