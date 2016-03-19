package controllers;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import models.Customer;
import models.enums.AccountStatus;
import play.Play;
import services.CustomService;
import services.impl.Work;
import services.impl.zhywb.dao.CustomDao;
import api.CsimParameter;
import base.SecureController;

public class CustomerController extends SecureController{
	
	// 在线客服
	public static Map<Long, Customer> customers = new HashMap<Long, Customer>();
	
	@Inject
	private static CustomDao customDao;
	
	// 临时固定
	@Inject
	static CustomService customService = new CustomService(new Work(),null,null);
	// 动态注入
	public CustomerController(String type){
		if("jym".equals(type)){
			customService = new CustomService(null,null,null);
		}else if("zhywb".equals(type)){
			customService = new CustomService(new Work(),null,null);
		}
	}
	
	// 客服进入工作台
    public static void index() {
    	customDao.update(null);
    	Customer customer = getCurrent();
        if (customer.status == AccountStatus.FREEZE) {
            renderFailure("您的账号被冻结！不允许进入工作台，如有疑问请联系管理员");
        }
        
        if(customer.scheduleId==null){
        	renderFailure("没有要服务的班次");
        }
        
        // 开始上班
//        onWork();
        
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

    // 客服上班
	public static void onWork(){
		// 自营、u客服
		customService.onWork();

		Customer customer = getCurrent();
        customers.put(customer.id, customer);
	        
		renderTemplate(null);
	}

	// 客服下班
	public static void offWork(){
		// 自营、u客服
		customService.offWork();

		Customer customer = getCurrent();
		customers.remove(customer);
		
		renderTemplate(null);
	}
	
	public static void applyRest(){
	}
	
	public static void change(Long dialogId){
		// dialogservice.assignment()
		
		// dialog.update
		
		
	}
	
}
