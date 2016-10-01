package models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import play.data.validation.MaxSize;
import play.db.jpa.Model;


/**
 * The persistent class for the t_role database table.
 * 
 */
@Entity
@Table(name="t_role")
@NamedQuery(name="TRole.findAll", query="SELECT t FROM TRole t")
public class TRole extends BaseModel {

	public String name;

	@ManyToMany
	@JoinTable(
		name="t_role_resource_action"
		, joinColumns={
			@JoinColumn(name="role_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="action_id")
			})
	public List<ResourceAction> TActions;

	@MaxSize(value=101)
	public String description;
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return this.name;
	}

}