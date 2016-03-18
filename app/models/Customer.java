package models;

import java.util.ArrayList;
import java.util.List;

import models.enums.AccountStatus;
import play.db.jpa.Model;

public class Customer {
	
	public Long id;
	
	public String username;
	
	public String portalCode;
	
	public Long deptId;
	
	public boolean isSelf;
	
	public AccountStatus status = AccountStatus.NORMAL;

	// 正在服务的班次
	public Long scheduleId;
	
	
	List<Dialog> intoDialogs = new ArrayList<Dialog>();

}
