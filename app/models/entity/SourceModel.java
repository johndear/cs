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
public class SourceModel extends Model {
	private static final long serialVersionUID = 1L;


	@Column(name="source_name")
	private String sourceName;

	public SourceModel() {
	}


	public String getSourceName() {
		return this.sourceName;
	}

	public void setSourceName(String sourceName) {
		this.sourceName = sourceName;
	}

}