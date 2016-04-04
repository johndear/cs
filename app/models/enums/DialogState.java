package models.enums;

public enum DialogState{
    
	/**
	 * 新建0
	 */
	NEW("新建", 0),
	/**
	 * 排队中1
	 */
	WAIT("排队中", 1),
	/**
	 * 会话中2
	 */
	ASSIGNMENT("会话中", 2),
	/**
	 * 关闭3
	 */
	CLOSE("关闭", 3),
	/**
	 * 已拒绝4
	 */
	REFUSED("已拒绝", 4),
	/**
	 * 已处理5
	 */
	HANDLED("已处理", 5); // 意见反馈单，在csos系统回复会话状态为“关闭”，别的系统回复或者删除会话状态为“已处理”

	// 成员变量  
	private String display;
	private int index;
	
	// 构造方法  
	private DialogState(String display, int index) {
		this.display = display;
		this.index = index;  
	}  
	
	public String display() {
		return this.display;
	}

}
