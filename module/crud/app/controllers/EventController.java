package controllers;

import models.Event;
import utils.Menu;
import utils.Method;
import utils.Rest;


@Menu(name="事件管理", category="demo")
@CRUD.For(Event.class)
public class EventController extends CRUD {

	@Rest(url="/test", method=Method.GET)
	public void aa(){
		
	}
	
}
