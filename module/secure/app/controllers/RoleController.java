package controllers;

import java.util.List;
import java.util.Map;

import entity.Role;
import entity.RoleResourceAction;
import play.mvc.Controller;
import play.mvc.With;

@With(Secure.class)
public class RoleController extends Controller{
	
	@Check("role")
	public static void index(){
		renderTemplate("Secure/modules/role.html");
	}
	
	public static void query(){
		List<Role> list = Role.findAll();
		renderJSON(list);
	}
	
	public static void addRoleResource(Long roleId, List<Long> resourceIds) {
		RoleResourceAction.delete("roleId=?", roleId);
		for (Long resourceId : resourceIds) {
			RoleResourceAction rra = new RoleResourceAction();
			rra.roleId = roleId;
			rra.resourceId = resourceId;
			rra.save();
		}
    }
	
	public static void addRoleResourceAction(Long roleId, List<RoleResourceAction> actions) {
		for (RoleResourceAction roleResourceAction : actions) {
			RoleResourceAction rra = RoleResourceAction.find("roleId=? and resourceId=?", roleId, roleResourceAction.resourceId).first();
			rra.resourceAction = roleResourceAction.resourceAction;
			rra.save();
		}
    }

}
