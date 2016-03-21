package models;

import java.util.ArrayList;
import java.util.List;

import models.enums.ServicerStatus;

public class Customer {
	
	public Long id;
	
	public String username;
	
	public String portalCode;
	
	public Long deptId;
	
	public boolean isSelf;
	
	// 是否被冻结
	public boolean isFreeze;
	
	public ServicerStatus status;

	// 正在服务的班次
	public Long scheduleId;
	
	// 正在服务的对话
	List<Dialog> dialogs = new ArrayList<Dialog>();
	
	public int dialogCount(){
		return dialogs.size();
	}

}
