package controllers;


import java.io.IOException;

import utils.Menu;
import utils.Method;
import utils.Rest;

@Menu(name="用户管理", category="权限管理")
public class TUsers extends CRUD {
	
	@Rest(url="aa",method=Method.POST)
	public static void aa(){
	public static void aa() throws IOException{
		System.out.println("aa.....");
		response.setHeader("Content-Type", "text/html");
		response.out.write("<html><head></head><body><h1>123</h1></body></html>".getBytes());
		response.out.flush();
	}


}
