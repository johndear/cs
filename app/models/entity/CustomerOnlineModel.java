package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.util.Date;


/**
 * The persistent class for the csos_customer_online database table.
 * 
 */
@Entity
@Table(name="csos_customer_online")
public class CustomerOnlineModel extends Model {

	@Column(name="customer_id")
	private Long customerId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="last_active_time")
	private Date lastActiveTime;
	
//	@Column(name="status")
	private int status;

	public CustomerOnlineModel() {
	}
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Long getCustomerId() {
		return this.customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Date getLastActiveTime() {
		return this.lastActiveTime;
	}

	public void setLastActiveTime(Date lastActiveTime) {
		this.lastActiveTime = lastActiveTime;
	}

}