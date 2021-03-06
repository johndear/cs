package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.util.List;


/**
 * The persistent class for the csos_skillgroup database table.
 * 
 */
@Entity
@Table(name="csos_skillgroup")
public class SkillgroupModel extends Model {
	private static final long serialVersionUID = 1L;

	@Column(name="skillgroup_name")
	private String skillgroupName;

//	//bi-directional many-to-many association to Customer
//	@ManyToMany(mappedBy="csosSkillgroups")
//	private List<Customer> csosCustomers;
//
//	//bi-directional many-to-one association to Source
//	@OneToMany(mappedBy="csosSkillgroup")
//	private List<Source> csosSources;

	public SkillgroupModel() {
	}

	public String getSkillgroupName() {
		return this.skillgroupName;
	}

	public void setSkillgroupName(String skillgroupName) {
		this.skillgroupName = skillgroupName;
	}

}