package models.entity;

import java.io.Serializable;
import javax.persistence.*;

import play.db.jpa.Model;

import java.math.BigInteger;


/**
 * The persistent class for the csos_change_record database table.
 * 
 */
@Entity
@Table(name="csos_change_record")
@NamedQuery(name="ChangeRecord.findAll", query="SELECT c FROM ChangeRecord c")
public class ChangeRecord extends Model {
	private static final long serialVersionUID = 1L;


	public ChangeRecord() {
	}


}