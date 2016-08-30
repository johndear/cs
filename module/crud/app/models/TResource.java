package models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import play.db.jpa.Model;


/**
 * The persistent class for the t_resource database table.
 * 
 */
@Entity
@Table(name="t_resource")
@NamedQuery(name="TResource.findAll", query="SELECT t FROM TResource t")
public class TResource extends Model implements Serializable {
	private static final long serialVersionUID = 1L;

	private String name;

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
	private List<TRole> TRoles;

	public TResource() {
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<TRole> getTRoles() {
		return this.TRoles;
	}

	public void setTRoles(List<TRole> TRoles) {
		this.TRoles = TRoles;
	}

}