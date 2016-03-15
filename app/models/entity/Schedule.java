package models.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the csos_schedule database table.
 * 
 */
@Entity
@Table(name="csos_schedule")
@NamedQuery(name="Schedule.findAll", query="SELECT s FROM Schedule s")
public class Schedule implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column(name="dept_id")
	private BigInteger deptId;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="end_time")
	private Date endTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="start_time")
	private Date startTime;

	//bi-directional many-to-one association to CustomerSchedule
	@OneToMany(mappedBy="csosSchedule")
	private List<CustomerSchedule> csosCustomerSchedules;

	public Schedule() {
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public BigInteger getDeptId() {
		return this.deptId;
	}

	public void setDeptId(BigInteger deptId) {
		this.deptId = deptId;
	}

	public Date getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public List<CustomerSchedule> getCsosCustomerSchedules() {
		return this.csosCustomerSchedules;
	}

	public void setCsosCustomerSchedules(List<CustomerSchedule> csosCustomerSchedules) {
		this.csosCustomerSchedules = csosCustomerSchedules;
	}

	public CustomerSchedule addCsosCustomerSchedule(CustomerSchedule csosCustomerSchedule) {
		getCsosCustomerSchedules().add(csosCustomerSchedule);
		csosCustomerSchedule.setCsosSchedule(this);

		return csosCustomerSchedule;
	}

	public CustomerSchedule removeCsosCustomerSchedule(CustomerSchedule csosCustomerSchedule) {
		getCsosCustomerSchedules().remove(csosCustomerSchedule);
		csosCustomerSchedule.setCsosSchedule(null);

		return csosCustomerSchedule;
	}

}