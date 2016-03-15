package models;

import java.util.ArrayList;
import java.util.List;

import play.db.jpa.Model;

public class CustomerDTO extends Model{
	
	boolean isSelf(){
		return false;
	}
	
	List<DialogDTO> intoDialogs = new ArrayList<DialogDTO>();

}
