package models.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the csos_skillgroup database table.
 * 
 */
@Entity
@Table(name="csos_skillgroup")
@NamedQuery(name="Skillgroup.findAll", query="SELECT s FROM Skillgroup s")
public class Skillgroup implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column(name="skillgroup_name")
	private String skillgroupName;

	//bi-directional many-to-many association to Customer
	@ManyToMany(mappedBy="csosSkillgroups")
	private List<Customer> csosCustomers;

	//bi-directional many-to-one association to Source
	@OneToMany(mappedBy="csosSkillgroup")
	private List<Source> csosSources;

	public Skillgroup() {
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSkillgroupName() {
		return this.skillgroupName;
	}

	public void setSkillgroupName(String skillgroupName) {
		this.skillgroupName = skillgroupName;
	}

	public List<Customer> getCsosCustomers() {
		return this.csosCustomers;
	}

	public void setCsosCustomers(List<Customer> csosCustomers) {
		this.csosCustomers = csosCustomers;
	}

	public List<Source> getCsosSources() {
		return this.csosSources;
	}

	public void setCsosSources(List<Source> csosSources) {
		this.csosSources = csosSources;
	}

	public Source addCsosSource(Source csosSource) {
		getCsosSources().add(csosSource);
		csosSource.setCsosSkillgroup(this);

		return csosSource;
	}

	public Source removeCsosSource(Source csosSource) {
		getCsosSources().remove(csosSource);
		csosSource.setCsosSkillgroup(null);

		return csosSource;
	}

}