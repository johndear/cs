package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import entity.User;

@Entity
@Table(name="t_group")
public class TGroup extends BaseModel {
	
	public String name;
	
	public String description;
	
	@OneToMany
	public List<TUser> Tusers;
	
	@OneToMany
	public List<TRole> Troles;
	
	
	
	
	
	

}
