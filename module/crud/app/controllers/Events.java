package controllers;

import controllers.CRUD;
import utils.Menu;
import utils.Method;
import utils.Rest;


@Menu(name="事件管理", category="demo")
public class Events extends CRUD {

	@Rest(url="/test", method=Method.GET)
	public void aa(){
		
	}
	
}
