package controllers;

import annotation.Menu;
import annotation.Rest;
import models.Event;
import utils.Method;


@Menu(name="事件管理", category="demo")
@CRUD.For(Event.class)
public class EventController extends CRUD {

	@Rest(url="/test", method=Method.GET)
	public void aa(){
		
	}
	
}
