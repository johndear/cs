package controllers;

import java.util.HashMap;
import java.util.Map;

import api.CsimParameter;
import base.SecureController;
import models.Customer;
import models.Principal;
import models.entity.CustomerModel;
import play.Play;
import services.CustomService;
import services.impl.zhywb.Work;

public class CustomerController extends SecureController{
	
	// 在线客服
	public static Map<Long, Customer> customers = new HashMap<Long, Customer>();

	public static CustomService customService;
	
	public CustomerController(String type){
		if("jym".equals(type)){
			customService = new CustomService(null,null,null);
		}else if("zhywb".equals(type)){
			customService = new CustomService(new Work(),null,null);
		}
	}
	
	// 进工作台
    public static void index() {
    	Customer customer = getCurrent();
//        if (AccountStatus.FREEZE == customer.getStatus()) {
//            return "您的账号被冻结！不允许进入工作台，如有疑问请联系管理员";
//        }
        
        // 判断这个客服是否可以上班
//
//        String  checkInMsg=csService.checkIn(principal);
////        String  checkInMsg=null;
//
//        //如果客服当前没有正在服务的班次,返回错误
//        if(!BlankUtil.isBlank(checkInMsg)){
//            error(checkInMsg);
//        }
    	
    	 //todo取session中的用户信息并用于页面显示
//    	Principal principal = new Principal();
//        principal.deptId =1;
//        principal.portalCode="u001";
//        principal.nickname="李四";
//        principal.username="李四";
//        principal.userId=1L;

        //csim请求参数
        CsimParameter csimParameter = new CsimParameter(customer.id);
        // 工单接口前缀
        String cswsUrlPrefix = Play.configuration.getProperty("csws.url.prefix");
        // csos接口前缀
        String csosUrlPrefix = Play.configuration.getProperty("csos.url.prefix");
        // 知识库地址
        String zhishiUrl = Play.configuration.getProperty("zhishi.url");
        //工作台ping时间间隔
        String interval = Play.configuration.getProperty("bench.interval", "10");
        //客服端监控用户多久没有回复，超过该时长作为掉线处理，单位/min
        String BENCH_MONITOR_TIME = Play.configuration.getProperty("bench.monitor.time", "10");
        //达到多少会话之后，再进线会提示归档/升级
        String csNotifyNumber = Play.configuration.getProperty("cs.notify.number", "20");
        //达到多少会话之后，停止进单
        String stopNumber = Play.configuration.getProperty("cs.stop.number", "30");
        //意见反馈websocket地址，端口
        String socketServerAddress = Play.configuration.getProperty("socket_server_address");
        String socketServerPort = Play.configuration.getProperty("socket_server_port");
        //服务商
        String jymServicerList = Play.configuration.getProperty("jym_servicer");

		render("cs/index.html", customer, csimParameter, BENCH_MONITOR_TIME, cswsUrlPrefix, csosUrlPrefix, zhishiUrl,
				interval, csNotifyNumber, stopNumber, socketServerAddress, socketServerPort, jymServicerList);
	}
	
	// 自营、u客服
	public void onWork(){
		Customer customer = getCurrent();
        customers.put(customer.id, customer);
	        
		customService.onWork();
		renderTemplate(null);
	}
	
	// 自营、u客服
	public void offWork(){
		Customer customer = getCurrent();
		customers.remove(customer);
		
		customService.offWork();
		renderTemplate(null);
	}
	
	public void applyRest(){
	}
	
	public void change(Long dialogId){
		// dialogservice.assignment()
		
		// dialog.update
		
		
	}
	
}
