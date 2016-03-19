package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.math.BigInteger;
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
	private BigInteger customerId;

	@Column(name="response_count")
	private int responseCount;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="response_time")
	private Date responseTime;

	@Column(name="source_id")
	private BigInteger sourceId;

	private int status;

	public DialogModel() {
	}

	public Date getAssignTime() {
		return this.assignTime;
	}

	public void setAssignTime(Date assignTime) {
		this.assignTime = assignTime;
	}

	public BigInteger getCustomerId() {
		return this.customerId;
	}

	public void setCustomerId(BigInteger customerId) {
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

	public BigInteger getSourceId() {
		return this.sourceId;
	}

	public void setSourceId(BigInteger sourceId) {
		this.sourceId = sourceId;
	}

	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}