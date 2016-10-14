package models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import annotation.QueryParam;
import play.data.validation.Required;
import play.db.jpa.Model;
import utils.DateHelper;

@Entity
public class Event extends Model {

	@QueryParam
	@Required(message="You have to complete the event's name.")
	public String name;
	
	@QueryParam
	@Required(message="You have to select the type of the event.")
	@ManyToOne
	public EventType type;
	
//	@OneToMany
//	public List<TUser> users;
	
	@Required(message="You have to complete the event's place.")
	public String place;
	
	@Required(message="You have to complete the event's date.")
	public Date date;
	
	@Transient
	public String action;

	@Override
	public String toString() {
		return name;
	}

	public String countDown() {
		return DateHelper.dateDiff(new Date(), date);
	}
	
}
