package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;


/**
 * The persistent class for the csos_source database table.
 * 
 */
@Entity
@Table(name="csos_source")
@NamedQuery(name="Source.findAll", query="SELECT s FROM Source s")
public class Source extends Model {
	private static final long serialVersionUID = 1L;


	@Column(name="source_name")
	private String sourceName;

	//bi-directional many-to-one association to Skillgroup
	@ManyToOne
	@JoinColumn(name="skillgroup_id")
	private Skillgroup csosSkillgroup;

	public Source() {
	}


	public String getSourceName() {
		return this.sourceName;
	}

	public void setSourceName(String sourceName) {
		this.sourceName = sourceName;
	}

	public Skillgroup getCsosSkillgroup() {
		return this.csosSkillgroup;
	}

	public void setCsosSkillgroup(Skillgroup csosSkillgroup) {
		this.csosSkillgroup = csosSkillgroup;
	}

}