package controllers;

import base.SecureController;
import play.mvc.Controller;
import play.mvc.results.RenderTemplate;
import services.CustomService;
import services.impl.zhywb.Work;

public class CustomerController extends SecureController{

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
	
	/**
	 * 
	 * 功能描述：
	 * 	客服将对话转给其他技能组客服
	 * @author <a href="mailto:caily@ucweb.com">刘苏 </a>
	 * @version 在线客服二期
	 * create on: 2016年3月15日
	 */
	public void change(Long dialogId){
		// dialogservice.assignment()
		
		// dialog.update
		
		
	}
	
}
