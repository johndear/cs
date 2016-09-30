package models;

import java.io.Serializable;

import javax.persistence.*;

import play.db.jpa.Model;

import java.util.List;


/**
 * The persistent class for the t_resource database table.
 * 
 */
@Entity
@Table(name="t_resource")
@NamedQuery(name="TResource.findAll", query="SELECT t FROM TResource t")
public class TResource extends Model implements Serializable {
	private static final long serialVersionUID = 1L;

	public String name;

	@OneToMany
	@JoinTable(
		name="t_resource_action"
		, joinColumns={
			@JoinColumn(name="resource_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="action_id")
			}
		)
	public List<TAction> TActions;
	
	@Transient
	public String action;
	
	@Override
	public String toString() {
		return this.name;
	}

	public TResource() {
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}


}