package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.util.Date;


/**
 * The persistent class for the csos_customer_schedule database table.
 * 
 */
@Entity
@Table(name="csos_customer_schedule")
public class CustomerScheduleModel extends Model {
	
	@Column(name="customer_id")
	private Long customerId;
	
	@Column(name="schedule_id")
	private Long scheduleId;

	@Column(name="change_count")
	private int changeCount;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="offwork_time")
	private Date offworkTime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="exist_time")
	private Date existTime;

	@Column(name="rest_timelong")
	private Long restTimelong;

	@Column(name="offline_timelong")
	private Long offlineTimelong;

	@Column(name="online_timelong")
	private Long onlineTimelong;

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

	public CustomerScheduleModel() {
	}

	
	public Date getExistTime() {
		return existTime;
	}


	public void setExistTime(Date existTime) {
		this.existTime = existTime;
	}


	public Long getCustomerId() {
		return customerId;
	}


	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}


	public Long getScheduleId() {
		return scheduleId;
	}


	public void setScheduleId(Long scheduleId) {
		this.scheduleId = scheduleId;
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

	public Long getRestTimelong() {
		return restTimelong;
	}

	public void setRestTimelong(Long restTimelong) {
		this.restTimelong = restTimelong;
	}

	public Long getOfflineTimelong() {
		return offlineTimelong;
	}

	public void setOfflineTimelong(Long offlineTimelong) {
		this.offlineTimelong = offlineTimelong;
	}

	public Long getOnlineTimelong() {
		return onlineTimelong;
	}

	public void setOnlineTimelong(Long onlineTimelong) {
		this.onlineTimelong = onlineTimelong;
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