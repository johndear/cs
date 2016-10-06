package controllers;

import play.mvc.With;
import utils.Menu;
import utils.Method;
import utils.Rest;

@With(CRUDSecure.class)
@Menu(name="用户管理", category="权限管理")
public class TUsers extends CRUD {
	
	@Rest(url="aa",method=Method.POST)
	public static void aa(){
		System.out.println("aa.....");
	}


}
