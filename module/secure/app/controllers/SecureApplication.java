package controllers;

import play.mvc.Controller;
import play.mvc.With;

public class SecureApplication extends Controller {

    public static void index() {
        render("Secure/Application/index.html");
    }
    
    public static void welcome(){
    	render("Secure/modules/welcome.html");
    }

}