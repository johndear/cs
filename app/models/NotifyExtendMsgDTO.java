package models;

public class NotifyExtendMsgDTO {
	
	/**
	 * 返回到前端显示的key
	 */
	private String key;
	/**
	 * type:auto、munal
	 */
	private String type;
	/**
	 * 当前客服昵称
	 */
	private String currentCsNickName;
	/**
	 * 下一个客服昵称
	 */
	private String nextCsNickName;
	/**
	 * 问题描述
	 */
	private String description;
	
	public NotifyExtendMsgDTO(){}
	
	public NotifyExtendMsgDTO(String type, String currentCsNickName, String nextCsNickName, String description) {
		super();
		this.type = type;
		this.currentCsNickName = currentCsNickName;
		this.nextCsNickName = nextCsNickName;
		this.description = description;
	}
	
	public NotifyExtendMsgDTO(String key,String type, String currentCsNickName, String nextCsNickName, String description) {
		super();
		this.key = key;
		this.type = type;
		this.currentCsNickName = currentCsNickName;
		this.nextCsNickName = nextCsNickName;
		this.description = description;
	}
	
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getCurrentCsNickName() {
		return currentCsNickName;
	}
	public void setCurrentCsNickName(String currentCsNickName) {
		this.currentCsNickName = currentCsNickName;
	}
	public String getNextCsNickName() {
		return nextCsNickName;
	}
	public void setNextCsNickName(String nextCsNickName) {
		this.nextCsNickName = nextCsNickName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	

}
