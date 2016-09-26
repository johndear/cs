package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import controllers.CRUD.Exclude;
import play.db.jpa.Model;

@MappedSuperclass
public class BaseModel extends Model{

	@Exclude
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_time")
	public Date createTime;
	
	@Exclude
	public String createby;
	
	@Exclude
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	public Date modifyTime;
	
	@Exclude
	public String modifyby;

	@Exclude
	public int deleted;
	
	@Transient
	public String action;

}

