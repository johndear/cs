package models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import play.db.jpa.Model;

@MappedSuperclass
public class BaseModel extends Model{

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="create_time")
	public Date createTime;
	
	public String createby;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	public Date modifyTime;
	
	public String modifyby;

	public int deleted;
	
	@Transient
	public String action;

}

