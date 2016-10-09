package models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;


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

	@ManyToMany
	@JoinTable(
		name="t_resource_action"
		, joinColumns={
			@JoinColumn(name="resource_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="action_id")
			}
		)
	public List<TAction> TActions = new ArrayList<TAction>();
	
	@ManyToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
    @JoinColumn(name="pid")
	public TResource parent;
	
//	@OneToMany(cascade=CascadeType.ALL,mappedBy="parent",fetch=FetchType.EAGER)
//    private Set<TResource> children = new HashSet<TResource>(0);
	
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