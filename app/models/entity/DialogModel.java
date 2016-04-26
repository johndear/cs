package models.entity;

import java.io.Serializable;

import javax.persistence.*;

import play.db.jpa.Model;

import java.util.Date;


/**
 * The persistent class for the csos_dialog database table.
 * 
 */
@Entity
@Table(name="csos_dialog")
public class DialogModel extends Model {

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="assign_time")
	private Date assignTime;

	@Column(name="customer_id")
	private Long customerId;

	@Column(name="response_count")
	private int responseCount;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="response_time")
	private Date responseTime;

	@Column(name="source_id")
	private Long sourceId;
	
	@Column(name="instance")
	private String instance;
	
	@Column(name="uid")
	private Long uid;

	@Column(name="status")
	private int status;
	
	@Column(name="create_date")
	private Date createDate;
	
	@Column(name="server_ip")
	private String serverIp;

	public DialogModel() {
	}
	
	public Date getCreateDate() {
		return createDate;
	}



	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	

	public String getServerIp() {
		return serverIp;
	}

	public void setServerIp(String serverIp) {
		this.serverIp = serverIp;
	}

	public String getInstance() {
		return instance;
	}

	public void setInstance(String instance) {
		this.instance = instance;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public Date getAssignTime() {
		return this.assignTime;
	}

	public void setAssignTime(Date assignTime) {
		this.assignTime = assignTime;
	}

	public Long getCustomerId() {
		return this.customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public int getResponseCount() {
		return this.responseCount;
	}

	public void setResponseCount(int responseCount) {
		this.responseCount = responseCount;
	}

	public Date getResponseTime() {
		return this.responseTime;
	}

	public void setResponseTime(Date responseTime) {
		this.responseTime = responseTime;
	}

	public Long getSourceId() {
		return this.sourceId;
	}

	public void setSourceId(Long sourceId) {
		this.sourceId = sourceId;
	}

	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}