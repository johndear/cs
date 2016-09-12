package controllers;

import java.util.List;

import play.mvc.Controller;
import play.mvc.With;
import entity.User;

@With(Secure.class)
public class AccountController extends Controller {

	@Check("user")
	public static void index(){
		renderTemplate("Secure/modules/user.html");
	}
	
	public static void queryAll(){
		List<User> list = User.findAll();
		renderJSON(list);
	}
	
}
