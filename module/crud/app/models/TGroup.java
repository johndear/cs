package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import entity.User;

@Entity
@Table(name="t_group")
public class TGroup extends BaseModel {
	
	public String name;
	
	public String description;
	
	@ManyToMany
	@JoinTable(
			name="t_group_user"
			, joinColumns={
				@JoinColumn(name="group_id")
				}
			, inverseJoinColumns={
				@JoinColumn(name="user_id")
				}
			)
	public List<TUser> Tusers;
	
	@ManyToMany
	@JoinTable(
			name="t_group_role"
			, joinColumns={
				@JoinColumn(name="group_id")
				}
			, inverseJoinColumns={
				@JoinColumn(name="role_id")
				}
			)
	public List<TRole> Troles;
	
	
	
	
	
	

}
