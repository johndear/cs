package models;

import play.*;
import play.data.validation.Required;
import play.db.jpa.*;

import javax.persistence.*;

import org.hibernate.annotations.Where;

import java.util.*;

@Entity
@Where(clause="deleted=0")
public class EventType extends Model {
    
	@Required(message="You have to complete the event type's name.")
	public String name;
	
	public String sex;
	
	public int deleted;

	@Override
	public String toString() {
		return name;
	}
	
}
