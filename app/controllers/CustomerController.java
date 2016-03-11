package controllers;

import play.mvc.Controller;
import play.mvc.results.RenderTemplate;
import services.CustomService;
import services.impl.zhywb.Work;

public class CustomerController extends Controller{

	public static CustomService customService;
	
	public CustomerController(String type){
		if("jym".equals(type)){
			customService = new CustomService(null,null,null);
		}else if("zhywb".equals(type)){
			customService = new CustomService(new Work(),null,null);
		}
	}
	
	// 自营、u客服
	public void checkIn(){
		
		customService.onWork();
		
		renderTemplate(null);
	}
	
	public void applyRest(){
	}
	
}
