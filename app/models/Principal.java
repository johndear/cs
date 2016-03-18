package models;

import java.io.Serializable;

import models.enums.ServicerStatus;


public class Principal implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public Long userId;
	
	public String portalCode;
	
	public String username;
	
	public String nickname;
	
	/**
	 * 部门id
	 */
	public long deptId;
	/**
	 * 部门名称
	 */
	public String deptName;
	
	/**
	 * 全部部门id，用“,”分割
	 */
	public String multipleDeptId;
	/**
	 * 全部部门名称，用“,”分割
	 */
	public String multipleDeptName;

    //管理员
    public boolean isSystemManager;

    //自营客服
    public boolean isSelfEmployed;

    //优选客服
    public boolean isPreferably;

    //U客服运营
    public boolean isUOperator;

    //U客服超级管理员
    public boolean isUSuperAdmin;

    public String uRole;
    
    // 当前客服状态，登录时默认是在线状态
    public ServicerStatus status;

}
