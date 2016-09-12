package entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import play.db.jpa.Model;

@Entity
@Table(name = "tb_role_resource_action")
public class RoleResourceAction extends Model {
	
	@Column(name="role_id")
	public Long roleId;
	
	@Column(name="resource_id")
	public Long resourceId;
	
	@Column(name="resource_action")
	public String resourceAction;
	
	

}
