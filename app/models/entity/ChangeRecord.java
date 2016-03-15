package models.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigInteger;


/**
 * The persistent class for the csos_change_record database table.
 * 
 */
@Entity
@Table(name="csos_change_record")
@NamedQuery(name="ChangeRecord.findAll", query="SELECT c FROM ChangeRecord c")
public class ChangeRecord implements Serializable {
	private static final long serialVersionUID = 1L;

	private BigInteger id;

	public ChangeRecord() {
	}

	public BigInteger getId() {
		return this.id;
	}

	public void setId(BigInteger id) {
		this.id = id;
	}

}