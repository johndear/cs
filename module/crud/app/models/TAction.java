package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;

import java.util.*;

@Entity
@Table(name="t_action")
public class TAction extends BaseModel {
	
	public String name;
	
	public Blob icon;
    
	public String description;
	
	@Override
	public String toString() {
		return this.name;
	}
	
}


//CREATE TABLE t_action(
//	    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//	    NAME VARCHAR(20),
//	    icon BLOB,
//	    description VARCHAR(200),
//	    create_time DATE,
//	    createby VARCHAR(20),
//	    modify_time DATE,
//	    modifyby VARCHAR(20),
//	    deleted TINYINT
//	);


//CREATE TABLE t_resource_action(
//	    resource_id BIGINT,
//	    action_id BIGINT
//	    
//	);
