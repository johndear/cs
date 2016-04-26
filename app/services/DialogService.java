package services;

import org.apache.ibatis.session.SqlSession;

import models.entity.CustomerModel;
import models.entity.DialogModel;
import models.enums.DialogState;
import models.mappers.CustomerMapper;
import mybatisplay.IbatisSessionFactory;

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

}
