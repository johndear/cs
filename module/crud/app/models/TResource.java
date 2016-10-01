package models;

import java.io.Serializable;

import javax.persistence.*;

import play.db.jpa.Model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


/**
 * The persistent class for the t_resource database table.
 * 
 */
@Entity
@Table(name="t_resource")
public class TResource extends BaseModel{

	public String name;
	
	public String code;
	
	public String url;

	@OneToMany
	@JoinTable(
		name="t_resource_action"
		, joinColumns={
			@JoinColumn(name="resource_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="action_id")
			}
		)
	public List<TAction> TActions;
	
	@ManyToOne(cascade=CascadeType.ALL,fetch=FetchType.LAZY)
    @JoinColumn(name="pid")
	public TResource parent;
	
	@Override
	public String toString() {
		return this.name;
	}

	public TResource() {
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}


}