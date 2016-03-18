package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.math.BigInteger;
import java.util.List;


/**
 * The persistent class for the csos_customer database table.
 * 
 */
@Entity
@Table(name="csos_customer")
@NamedQuery(name="Customer.findAll", query="SELECT c FROM Customer c")
public class Customer extends Model {

	@Column(name="customer_id")
	private Long customerId;
	
	@Column(name="dept_id")
	private BigInteger deptId;

	@Column(name="nick_name")
	private String nickName;

	@Column(name="portal_code")
	private String portalCode;

	@Column(name="priority")
	private int priority;
	
	@Column(name="status")
	private int status;
	
	public Customer() {
	}
	
	public Long getCustomerId() {
		return customerId;
	}



	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}



	public int getStatus() {
		return status;
	}



	public void setStatus(int status) {
		this.status = status;
	}



	public BigInteger getDeptId() {
		return this.deptId;
	}

	public void setDeptId(BigInteger deptId) {
		this.deptId = deptId;
	}

	public String getNickName() {
		return this.nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getPortalCode() {
		return this.portalCode;
	}

	public void setPortalCode(String portalCode) {
		this.portalCode = portalCode;
	}

	public int getPriority() {
		return this.priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}


//	public CustomerSchedule addCsosCustomerSchedule(CustomerSchedule csosCustomerSchedule) {
//		getCsosCustomerSchedules().add(csosCustomerSchedule);
//		csosCustomerSchedule.setCsosCustomer(this);
//
//		return csosCustomerSchedule;
//	}
//
//	public CustomerSchedule removeCsosCustomerSchedule(CustomerSchedule csosCustomerSchedule) {
//		getCsosCustomerSchedules().remove(csosCustomerSchedule);
//		csosCustomerSchedule.setCsosCustomer(null);
//
//		return csosCustomerSchedule;
//	}

}