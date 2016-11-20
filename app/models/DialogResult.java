package models;

public class DialogResult {
    /**
     * 会话操作是否成功
     */
    public boolean success;
    /**
     * 会话用户id
     */
    public String receiverId;
    /**
     * 会话客服id
     */
    public long handlerId;
    /**
     * 会话id
     */
    public long dialogId;
    /**
     * 会话操作类型
     */
    public String type;
    /**
     * 扩展信息字段
     */
    public Object extendMsg;
    
    
    public DialogResult(){}
    
    public DialogResult(boolean success, String type, Object extendMsg){
    	super();
    	this.success = success;
    	this.type = type;
		this.extendMsg = extendMsg;
    }
    
    public DialogResult(boolean success, String receiverId, long handlerId, long dialogId, String type,
			Object extendMsg) {
		super();
		this.success = success;
		this.receiverId = receiverId;
		this.handlerId = handlerId;
		this.dialogId = dialogId;
		this.type = type;
		this.extendMsg = extendMsg;
	}

	public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public long getHandlerId() {
        return handlerId;
    }

    public void setHandlerId(long handlerId) {
        this.handlerId = handlerId;
    }

    public long getDialogId() {
        return dialogId;
    }

    public void setDialogId(long dialogId) {
        this.dialogId = dialogId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getExtendMsg() {
        return extendMsg;
    }

    public void setExtendMsg(Object extendMsg) {
        this.extendMsg = extendMsg;
    }
}
