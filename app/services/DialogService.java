package services;

import models.entity.DialogModel;
import models.enums.DialogState;

public class DialogService {
	
	// 综合业务部（在线4+意见1）、交易猫（在线4）
	// 会话数据来源不一致

	// 按优先级、最大处理量、正在服务量顺序，分配客服（考虑：1、同部门；2、客服服务量必须小于最大量-区分不同渠道）
	public Long assignment(Long dialogId) {
		
		return dialogId;
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
