//package entity;
//
//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
//import javax.persistence.Id;
//import javax.persistence.SequenceGenerator;
//import javax.persistence.Table;
//
//import org.hibernate.annotations.Cache;
//import org.hibernate.annotations.CacheConcurrencyStrategy;
//
//@Entity
//@Table(name = "tb_role_menu_action")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//public class RoleAction {
//
//	private Long id;
//	private Long roleId;
//	private Long menuId;
//	private String actions;
//	
//	@Id
//	@Column(name = "ID")
//	@SequenceGenerator(name = "SEQ_ROLE_MENU_ACTION", allocationSize = 1, sequenceName = "ydscm_permission.SEQ_ROLE_MENU_ACTION")
//	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_ROLE_MENU_ACTION")
//	public Long getId() {
//		return id;
//	}
//	public void setId(Long id) {
//		this.id = id;
//	}
//	public Long getRoleId() {
//		return roleId;
//	}
//	public void setRoleId(Long roleId) {
//		this.roleId = roleId;
//	}
//	public Long getMenuId() {
//		return menuId;
//	}
//	public void setMenuId(Long menuId) {
//		this.menuId = menuId;
//	}
//	public String getActions() {
//		return actions;
//	}
//	public void setActions(String actions) {
//		this.actions = actions;
//	}
//	
//	
//}
