package models;

import java.util.ArrayList;
import java.util.List;

import play.db.jpa.Model;

public class CustomerDTO extends Model{
	
	public boolean isSelf;

	// 正在服务的班次
	public Long scheduleId;
	
	
	List<DialogDTO> intoDialogs = new ArrayList<DialogDTO>();

}
