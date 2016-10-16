package controllers;


import java.io.IOException;

import models.TUser;
import annotation.Menu;
import annotation.Rest;
import utils.Method;

@Menu(name="用户管理", category="权限管理")
@CRUD.For(TUser.class)
public class TUsers extends CRUD {
	
	@Rest(url="aa",method=Method.POST)
	public static void aa() throws IOException{
		System.out.println("aa.....");
		response.setHeader("Content-Type", "text/html");
		response.out.write("<html><head></head><body><h1>123</h1></body></html>".getBytes());
		response.out.flush();
	}


}
