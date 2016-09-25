package controllers;

import java.util.List;

import entity.Group;
import entity.Role;
import entity.User;
import play.mvc.Controller;
import play.mvc.With;

@With(Secure.class)
public class UserController extends Controller{
	
	@Check("group")
	public static void index(){
		renderTemplate("Secure/modules/user.html");
	}
	
	public static void queryAll(){
		List<User> list = User.findAll();
		renderJSON(list);
	}

}
