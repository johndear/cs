package models;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import play.db.jpa.Model;

@Entity
@Table(name="t_resource_action")
public class ResourceAction extends Model {
	
	@ManyToOne
	@JoinColumn(name = "resource_id")
	public TResource TResource;
	
	@ManyToOne
	@JoinColumn(name = "action_id")
	public TAction TAction;
	
}
