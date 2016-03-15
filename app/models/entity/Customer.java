package models.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigInteger;
import java.util.List;


/**
 * The persistent class for the csos_customer database table.
 * 
 */
@Entity
@Table(name="csos_customer")
@NamedQuery(name="Customer.findAll", query="SELECT c FROM Customer c")
public class Customer implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column(name="dept_id")
	private BigInteger deptId;

	@Column(name="nick_name")
	private String nickName;

	@Column(name="portal_code")
	private String portalCode;

	private int priority;

	//bi-directional many-to-one association to CustomerSchedule
	@OneToMany(mappedBy="csosCustomer")
	private List<CustomerSchedule> csosCustomerSchedules;

	//bi-directional many-to-many association to Skillgroup
	@ManyToMany
	@JoinTable(
		name="csos_customer_skillgroup"
		, joinColumns={
			@JoinColumn(name="customer_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="skillgroup_id")
			}
		)
	private List<Skillgroup> csosSkillgroups;

	public Customer() {
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

	public List<CustomerSchedule> getCsosCustomerSchedules() {
		return this.csosCustomerSchedules;
	}

	public void setCsosCustomerSchedules(List<CustomerSchedule> csosCustomerSchedules) {
		this.csosCustomerSchedules = csosCustomerSchedules;
	}

	public CustomerSchedule addCsosCustomerSchedule(CustomerSchedule csosCustomerSchedule) {
		getCsosCustomerSchedules().add(csosCustomerSchedule);
		csosCustomerSchedule.setCsosCustomer(this);

		return csosCustomerSchedule;
	}

	public CustomerSchedule removeCsosCustomerSchedule(CustomerSchedule csosCustomerSchedule) {
		getCsosCustomerSchedules().remove(csosCustomerSchedule);
		csosCustomerSchedule.setCsosCustomer(null);

		return csosCustomerSchedule;
	}

	public List<Skillgroup> getCsosSkillgroups() {
		return this.csosSkillgroups;
	}

	public void setCsosSkillgroups(List<Skillgroup> csosSkillgroups) {
		this.csosSkillgroups = csosSkillgroups;
	}

}