package models;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import annotation.TableExclude;
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
	
	@TableExclude
	@Exclude
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="modify_time")
	public Date modifyTime;
	
	@TableExclude
	@Exclude
	public String modifyby;

	@TableExclude
	@Exclude
	public int deleted;
	
	// 名称、url
	@Transient
	public Map<String, String> outerTableAction;
	
	@Transient
	public Map<String, String> innerTableAction;
	
	public BaseModel(){
		outerTableAction = new HashMap<String, String>();
		outerTableAction.put("add", "1");
//		outerTableAction.put("adf", "234");
		
		innerTableAction = new HashMap<String, String>();
		innerTableAction.put("edit", "2");
		innerTableAction.put("delete", "3");
//		innerTableAction.put("aa", "4");
	}

}

