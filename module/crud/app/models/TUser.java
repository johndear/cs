package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import annotation.QueryParam;
import play.data.binding.NoBinding;
import play.data.validation.Password;
import play.db.jpa.Blob;


/**
 * The persistent class for the t_user database table.
 * 
 */
@Entity
@Table(name="t_user")
@NamedQuery(name="TUser.findAll", query="SELECT t FROM TUser t")
public class TUser extends BaseModel {

	@QueryParam
	public String user_name;
	
	public String login_name;
	
	@Password
	public String password;
	
	@NoBinding
	@Column(name="is_admin")
	public boolean isAdmin;
	
	public Blob icon;
	
	@Override
	public String toString() {
		return user_name;
	}

}