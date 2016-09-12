package controllers;

import java.util.List;

import entity.Group;
import entity.Role;
import play.mvc.Controller;
import play.mvc.With;

@With(Secure.class)
public class GroupController extends Controller{
	
	@Check("group")
	public static void index(){
		renderTemplate("Secure/modules/group.html");
	}
	
	public static void query(){
		List<Group> list = Group.findAll();
		renderJSON(list);
	}

}
