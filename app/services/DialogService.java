package services;

import java.util.HashMap;
import java.util.Map;

import models.entity.CustomerModel;
import models.entity.CustomerOnlineModel;
import models.entity.DialogModel;
import models.enums.DialogState;
import models.mappers.CustomerMapper;

import org.apache.ibatis.session.SqlSession;

import play.libs.WS;
import play.mvc.Http;
import base.IbatisSessionFactory;

public class DialogService {
	
	// 综合业务部（在线4+意见1）、交易猫（在线4）
	// 会话数据来源不一致

	// 按优先级、最大处理量、正在服务量顺序，分配客服（考虑：1、同部门；2、客服服务量必须小于最大量-区分不同渠道）
	public Long assignment(Long dialogId) {
		DialogModel dialogModel = DialogModel.findById(dialogId);
		if(dialogModel.getCustomerId()!=null){
			return dialogModel.getCustomerId();
		}
		
		SqlSession session = IbatisSessionFactory.get().openSession();
		CustomerMapper guestBookMapper = session.getMapper(CustomerMapper.class);
		CustomerModel customerModel = guestBookMapper.getCustomer();
		
		Long customerId = customerModel==null ? null : customerModel.getCustomerId();
		if(customerId != null){
			dialogModel.setCustomerId(customerId);
			dialogModel.save();
		}
		
		return customerId;
	}
	
	// 会话主动关闭
	public DialogModel close(Long dialogId){
		DialogModel dialog = DialogModel.findById(dialogId);
		dialog.setStatus(DialogState.CLOSE.ordinal());
		dialog.save();
		
		return dialog;
	}
	
	// 会话异常关闭
	public DialogModel unexpectedClose(Long dialogId){
		DialogModel dialog = DialogModel.findById(dialogId);
		dialog.setStatus(DialogState.CLOSE.ordinal());
		dialog.save();
		
		return dialog;
	}
	
	// 客服发给在其它服务器上的用户
	public void sendToUser(Long dialogId, String message){
		DialogModel dialogModel = DialogModel.find("id=?", dialogId).first();
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("dialogId", dialogId.toString());
		params.put("message", message);
		
		WS.WSRequest request = WS.url("http://"+ dialogModel.getServerIp() +":9027/cs/api/api/RemoteChat/sendToUser");
        request.timeout = Integer.parseInt("100");
        request.setParameters(params);
        WS.HttpResponse response = null;
        response = request.post();
        if (response.getStatus() == Http.StatusCode.OK) {
        	response.getString();
        }
	}
	
	// 用户发给在其它服务器上的客服
	public void sendToCustomer(Long customerId, String message){
		CustomerOnlineModel  customerOnlineModel = CustomerOnlineModel.find("customerId=?", customerId).first();
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("customerId", customerId.toString());
		params.put("message", message);
		
		WS.WSRequest request = WS.url("http://"+ customerOnlineModel.getServerIp() +":9027/cs/api/RemoteChat/sendToCustomer");
        request.timeout = Integer.parseInt("100");
        request.setParameters(params);
        WS.HttpResponse response = null;
        response = request.post();
        if (response.getStatus() == Http.StatusCode.OK) {
        	response.getString();
        }
	}

}
