package models.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the csos_customer_online database table.
 * 
 */
@Entity
@Table(name="csos_customer_online")
@NamedQuery(name="CustomerOnline.findAll", query="SELECT c FROM CustomerOnline c")
public class CustomerOnline implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="customer_id")
	private String customerId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="last_active_time")
	private Date lastActiveTime;

	public CustomerOnline() {
	}

	public String getCustomerId() {
		return this.customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public Date getLastActiveTime() {
		return this.lastActiveTime;
	}

	public void setLastActiveTime(Date lastActiveTime) {
		this.lastActiveTime = lastActiveTime;
	}

}