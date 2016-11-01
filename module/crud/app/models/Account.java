package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import annotation.QueryParam;
import play.data.validation.Required;
import play.db.jpa.Model;

/**
 * 功能描述：客服账号表
 * <p> 版权所有：优视科技 </p>
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
 *
 * @author <a href="mailto:lqb.lqbqq">罗权邦</a>
 * @version 1.0.0
 * create on: 2015.12.16
 */

@Entity
@Table(name = "csos_account")
public class Account extends Model {
	
	public String name;
	
	/**
     * 姓名
     */
	@Required(message="You have to complete the event's name.")
    @Column(name = "account_id", nullable = false, length = 255)
    public String accountId;
	
	/**
     * 姓名
     */
	@QueryParam
	@Required
    @Column(name = "user_name", nullable = false, length = 255)
    public String userName;
    
    /**
     * portal账号
     */
    @Required
    @Column(name = "portal_code", nullable = false, length = 255)
    public String portalCode;
    
    /**
     * 客服昵称
     */
    @Required
    @Column(name = "nickname", nullable = false, length = 127)
    public String nickName;
    
    /**
     * 邮箱
     */
    @Column(name = "email", nullable = true, length = 255)
    public String email;
    
    /**
     * 最大处理能力
     */
    @Column(name = "handle_limit", nullable = true)
    public Integer handleLimit;
    
    /**
     * 质检抽检量
     */
    @Column(name = "check_count", nullable = true)
    public Integer checkCount;
    
    /**
     * 设定完成工单量
     */
    @Column(name = "except_count", nullable = true)
    public Integer exceptCount;
    
    /**
     * 客服类型0为自营客服,1为U客服
     */
    @Column(name = "kf_type", nullable = false)
    public String kfType;
    
    /**
     * 客服等级id
     */
    @Column(name = "level_id", nullable = true)
    public Long levelId;
    
    /**
     * 是否优选。1为优选，0为非优选。默认为0
     */
    @Column(name = "prior_choice", nullable = true)
    public int priorChoice;
    
    
    /**
     * 状态(0 无效;1 有效)
     */
    @Required
    @Column(name = "status", nullable = true, length = 4)
    public int status;
    
    /**
     * 创建时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_time", nullable = true)
    public Date createTime;
    
    /**
     * 修改时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modify_time", nullable = true)
    public Date modifyTime;
    
    /**
     * 备注
     */
    @Column(name = "remarks", nullable = true)
    public String remarks;
    
    /**
     * 同步时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "sync_time", nullable = true)
    public Date syncTime;
    
    @Transient
	public String action;
    
    /**
     * 功能描述：从工单系统获取客服账号信息
     *
     * @param sqlParams	
     * @return
     * @author <a href="mailto:lqb.lqbqq">罗权邦 </a>
     * @version 交易猫接入客服一期
     * create on: 2015.12.21
     */
    public void update(Account account,Date time){
    	this.userName = account.userName;
        this.portalCode = account.portalCode;
        this.nickName = account.nickName;
        this.email = account.email;
        this.checkCount = account.checkCount;
        this.handleLimit = account.handleLimit;
        this.exceptCount = account.exceptCount;
        this.kfType = account.kfType;
        this.levelId = account.levelId;
        this.priorChoice = account.priorChoice;
        this.status = account.status;
        this.createTime = account.createTime;
        this.modifyTime = account.modifyTime;
        this.remarks = account.remarks;
        this.syncTime = time;
        this.save();
    }

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPortalCode() {
		return portalCode;
	}

	public void setPortalCode(String portalCode) {
		this.portalCode = portalCode;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Integer getHandleLimit() {
		return handleLimit;
	}

	public void setHandleLimit(Integer handleLimit) {
		this.handleLimit = handleLimit;
	}

	public Integer getExceptCount() {
		return exceptCount;
	}

	public void setExceptCount(Integer exceptCount) {
		this.exceptCount = exceptCount;
	}

	public String getKfType() {
		return kfType;
	}

	public void setKfType(String kfType) {
		this.kfType = kfType;
	}

	public Long getLevelId() {
		return levelId;
	}

	public void setLevelId(Long levelId) {
		this.levelId = levelId;
	}

	public int getPriorChoice() {
		return priorChoice;
	}

	public void setPriorChoice(int priorChoice) {
		this.priorChoice = priorChoice;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Date getSyncTime() {
		return syncTime;
	}

	public void setSyncTime(Date syncTime) {
		this.syncTime = syncTime;
	}

	public Integer getCheckCount() {
		return checkCount;
	}

	public void setCheckCount(Integer checkCount) {
		this.checkCount = checkCount;
	}

	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
    
	
	
}

