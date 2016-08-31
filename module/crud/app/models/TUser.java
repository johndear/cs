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

import play.db.jpa.Model;


/**
 * The persistent class for the t_user database table.
 * 
 */
@Entity
@Table(name="t_user")
@NamedQuery(name="TUser.findAll", query="SELECT t FROM TUser t")
public class TUser extends Model implements Serializable {
	private static final long serialVersionUID = 1L;

	private String name;

	//bi-directional many-to-many association to TRole
//	@ManyToMany(mappedBy="TUsers")
	@OneToMany
	@JoinTable(
		name="t_user_role"
		, joinColumns={
			@JoinColumn(name="user_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="role_id")
			}
	)
	public List<TRole> TRoles;

	public TUser() {
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