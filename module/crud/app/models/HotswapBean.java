package models;

import javax.persistence.Entity;
import javax.persistence.Table;

import play.db.jpa.Blob;

@Entity
@Table(name = "t_hotswap")
public class HotswapBean extends BaseModel {
	
	public String version;
	
	public Blob jarfile;
	
	
	

}
