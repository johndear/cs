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

	//bi-directional many-to-many association to TRole
	@ManyToMany
	@JoinTable(
		name="t_role_resource"
		, joinColumns={
			@JoinColumn(name="resource_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="role_id")
			}
		)
	public List<TRole> TRoles;
	
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

	public TResource() {
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}


}