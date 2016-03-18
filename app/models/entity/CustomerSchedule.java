package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.math.BigInteger;
import java.util.Date;


/**
 * The persistent class for the csos_customer_schedule database table.
 * 
 */
@Entity
@Table(name="csos_customer_schedule")
public class CustomerSchedule extends Model {

	@Column(name="change_count")
	private int changeCount;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="offwork_time")
	private Date offworkTime;

	@Column(name="online_time")
	private BigInteger onlineTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="onwork_time")
	private Date onworkTime;

	@Column(name="service_num")
	private int serviceNum;

//	//bi-directional many-to-one association to Schedule
//	@ManyToOne
//	@JoinColumn(name="schedule_id")
//	private Schedule csosSchedule;
//
//	//bi-directional many-to-one association to Customer
//	@ManyToOne
//	@JoinColumn(name="customer_id")
//	private Customer csosCustomer;

	public CustomerSchedule() {
	}

	public int getChangeCount() {
		return this.changeCount;
	}

	public void setChangeCount(int changeCount) {
		this.changeCount = changeCount;
	}

	public Date getOffworkTime() {
		return this.offworkTime;
	}

	public void setOffworkTime(Date offworkTime) {
		this.offworkTime = offworkTime;
	}

	public BigInteger getOnlineTime() {
		return this.onlineTime;
	}

	public void setOnlineTime(BigInteger onlineTime) {
		this.onlineTime = onlineTime;
	}

	public Date getOnworkTime() {
		return this.onworkTime;
	}

	public void setOnworkTime(Date onworkTime) {
		this.onworkTime = onworkTime;
	}

	public int getServiceNum() {
		return this.serviceNum;
	}

	public void setServiceNum(int serviceNum) {
		this.serviceNum = serviceNum;
	}

//	public Schedule getCsosSchedule() {
//		return this.csosSchedule;
//	}
//
//	public void setCsosSchedule(Schedule csosSchedule) {
//		this.csosSchedule = csosSchedule;
//	}
//
//	public Customer getCsosCustomer() {
//		return this.csosCustomer;
//	}
//
//	public void setCsosCustomer(Customer csosCustomer) {
//		this.csosCustomer = csosCustomer;
//	}

}