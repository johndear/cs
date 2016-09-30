package models;

import java.io.File;
import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import play.data.binding.NoBinding;
import play.data.validation.MaxSize;
import play.data.validation.Password;
import play.db.jpa.Blob;
import play.db.jpa.FileAttachment;
import play.db.jpa.Model;
import utils.QueryParam;


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