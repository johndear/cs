package controllers;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;



import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.hibernate.ejb.criteria.Renderable;

import com.alibaba.fastjson.JSONObject;

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

public class UserController2 extends BaseController{

	@Inject
	static DialogAPI dialogAPI;
	
	@Inject
	static DialogService dialogService;

	// TODO 安全校验
	// 用户进线 -- 1、新用户； 2、老用户-刷新,加载longpolling.js和历史记录
	public static void into(String instance, Long sourceId, Long userId){
		boolean isNew = true;
		List<Integer> status =new ArrayList<Integer>();
		status.add(DialogState.NEW.ordinal());
//		StringUtils.join(status.toArray(),",")
				
		// 如果当前用户有现成的会话，就不用创建新的会话
		DialogModel dialog = DialogModel.find("uid=? and (status=? or status=? or status=?) order by createDate desc", userId, DialogState.NEW.ordinal(), DialogState.WAIT.ordinal(), DialogState.ASSIGNMENT.ordinal()).first();
		if(dialog!=null && DateUtil.getDifferMinutes(dialog.getCreateDate(), new Date()) <= 30){
			// 存在有效的会话
			isNew = false;
		}else{
			// 关闭已过期的会话
			if(dialog != null){
				dialog.setStatus(DialogState.CLOSE.ordinal());
				dialog.save();
			}
			
			// 创建新的会话
			dialog = new DialogModel();
			dialog.setSourceId(sourceId);
			dialog.setInstance(instance);
			dialog.setStatus(DialogState.NEW.ordinal());
			dialog.setUid(userId);
			dialog.setCreateDate(new Date());
			dialog.save();
		}
		
		Long dialogId = dialog.getId();
		String talkerName = null;
		String uaeCompressRoot = "http://localhost:9027/cs";
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
		render("user/chat.html", isNew, dialogId, userId, talkerName, uaeCompressRoot, uaeUncompressRoot, isDev,
				cookieName, flagCookieName, customerParameter, csimParameter, instance, isImge, sys, islogin,
				jymLoginUrl, jymUserUrl,isReportable,csosUrl,customerId,sourceCount,isUCen, serverDate);
	}
	
	// 用户发送消息
	public static void send(Long userId, Long dialogId, String content){
		// 拿该用户最近的一次会话
		DialogModel dialog = DialogModel.find("id=? and uid=? and (status=? or status=? or status=?) order by createDate desc", dialogId, userId, DialogState.NEW.ordinal(), DialogState.WAIT.ordinal(), DialogState.ASSIGNMENT.ordinal()).first();
		if(dialog==null || DateUtil.getDifferMinutes(dialog.getCreateDate(), new Date()) > 30){
			// 无效的会话, 则提示用户重新连接，创建新的会话
			return;
		}
		
		if(dialog.getCustomerId()==null){
			// 在用户发第一句话之后  -- 可以重试12次
			Long customerId = dialogService.assignment(3005L);
			
			// 创建会话
			String createResult = dialogAPI.create(dialog.getId(), userId.toString(), customerId, "lisi");
			JSONObject resultJson = (JSONObject) JSONObject.parse(createResult);
	         boolean createSuccess = String.valueOf(Http.StatusCode.OK).equals(resultJson.get("status"));
	         if(createSuccess){
	        	 dialog.setCustomerId(customerId);
	        	 dialog.setStatus(DialogState.ASSIGNMENT.ordinal());
	        	 dialog.save();
	         }else{
	        	 System.out.println("... create :" + createResult);
	         }
		}

		String sendResult = dialogAPI.send(userId.toString(), dialogId, "CHAT", content, Constants.IM_CUSTOMER_SCENE_KEY);
		System.out.println(sendResult);
	}
	
	// 用户在线超时关闭 -- 倒计时1分钟由前端触发（不可靠）
	public static void onlineTimeoutClose(Long uid, Long dialogId){
		DialogModel dialog = dialogService.unexpectedClose(dialogId);
		
		// 调用csim关闭会话
		dialogAPI.servicerClose(dialog.getCustomerId(), dialog.getId());
		dialogAPI.customerClose(dialog.getUid().toString(), dialog.getId());
		
		// 通知客服
		dialogAPI.notifyServicer(dialog.getCustomerId(), dialogId, uid.toString(), Constants.EVENT_ONLINE_CLOSE, null);
		
	}
	
	// 用户关闭浏览器、网络异常断开 -- 系统实时监控（怎么做到实时监控用户掉线了？）--推荐方案：websocket
	public static void unexpectedClose(Long uid, Long dialogId){
		DialogModel dialog = dialogService.unexpectedClose(dialogId);
		
		// 调用csim关闭会话
		dialogAPI.servicerClose(dialog.getCustomerId(), dialog.getId());
		dialogAPI.customerClose(dialog.getUid().toString(), dialog.getId());
		
		// 通知客服
		dialogAPI.notifyServicer(dialog.getCustomerId(), dialogId, uid.toString(), Constants.EVENT_OFFLINE_CLOSE, null);

	}
	
	
}
