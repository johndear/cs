package entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import play.db.jpa.Model;
//
@Entity
@Table(name = "tb_action")
public class Action  extends Model {
//
	private String name;
	
	private String resourceAction;
//	private String icon;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getResourceAction() {
		return resourceAction;
	}

	public void setResourceAction(String resourceAction) {
		this.resourceAction = resourceAction;
	}

	
	
//	
//	public String getActionName() {
//		return actionName;
//	}
//	public void setActionName(String actionName) {
//		this.actionName = actionName;
//	}
//	public String getEname() {
//		return ename;
//	}
//	public void setEname(String ename) {
//		this.ename = ename;
//	}
//	public String getIcon() {
//		return icon;
//	}
//	public void setIcon(String icon) {
//		this.icon = icon;
//	}
//	
//	
}
