package entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import play.db.jpa.Model;

/**
 * 角色.
 * 
 * @author calvin
 */
@Entity
@Table(name = "tb_role")
// @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Role extends Model {
	
	
	@Column(name="role_name")
	private String roleName;
	
	//private List<Menu> menuList = new ArrayList<Menu>();

	//private List<RoleAction> permissionList = new ArrayList<RoleAction>();

	public Role() {
	}

	public Role(Long id) {
		this.id = id;
	}
	
	

	

//	public String getPermissions() {
//		return permissions;
//	}
//
//	public void setPermissions(String permissions) {
//		this.permissions = permissions;
//	}
//
//	@Transient
//	public List<String> getPermissionList() {
//		return ImmutableList.copyOf(StringUtils.split(permissions, ","));
//	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

//	@OneToMany(mappedBy="roleId")
//	// Fecth策略定义
//	@Fetch(FetchMode.SUBSELECT)
//	// 集合按id排序
//	@OrderBy("id ASC")
//	// 缓存策略
//	public List<RoleAction> getPermissionList() {
//		return permissionList;
//	}
//
//	public void setPermissionList(List<RoleAction> permissionList) {
//		this.permissionList = permissionList;
//	}
//	
//	@ManyToMany
//	@JoinTable(name = "tb_role_menu_action", schema="ydscm_permission", joinColumns = { @JoinColumn(name = "roleId") }, inverseJoinColumns = { @JoinColumn(name = "menuId") })
//	// Fecth策略定义
//	@Fetch(FetchMode.SUBSELECT)
//	// 集合按id排序
//	@OrderBy("id ASC")
//	// 缓存策略
//	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//	public List<Menu> getMenuList() {
//		return menuList;
//	}
//
//	public void setMenuList(List<Menu> menuList) {
//		this.menuList = menuList;
//	}
	
	
}
