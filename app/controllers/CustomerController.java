package controllers;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import models.Customer;
import models.enums.AccountStatus;
import play.Play;
import services.CustomService;
import services.DialogService;
import services.impl.Work;
import api.CsimParameter;
import base.SecureController;

public class CustomerController extends SecureController{
	
	// 在线客服
	public static Map<Long, Customer> customers = new HashMap<Long, Customer>();
	
	@Inject
	static DialogService dialogService;
	
	// 临时固定
	@Inject
	static CustomService customService;// = new CustomService(new Work(),null,null);
	
	// 动态注入
	public CustomerController(String type){
		if("jym".equals(type)){
			customService = new CustomService(null,null,null);
		}else if("zhywb".equals(type)){
			customService = new CustomService(new Work(),null,null);
		}
	}
	
	// 客服进入工作台/刷新
    public static void index() {
    	Customer customer = getCurrent();
    	
        if (customer.status == AccountStatus.FREEZE) {
            renderFailure("您的账号被冻结！不允许进入工作台，如有疑问请联系管理员");
        }
        
        if(customer.scheduleId==null){
        	renderFailure("没有要服务的班次");
        }
        
        // 刷新工作台
        if(customers.containsKey(customer.id)){
        	// TODO 可以考虑是否将该客服由其他状态（小休中、离线中）置为上线
        }else{
        	// 清空服务量（原）
        	
        	// 开始上班
        	onWork();
        }
        
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
		Customer customer = getCurrent();
		
		// 自营、u客服
		customService.onWork(customer.id, customer.scheduleId);

		// 添加上班客服
        customers.put(customer.id, customer);
	}

	// 客服下班
	public static void offWork(){
		Customer customer = getCurrent();

		// 自营、u客服
		customService.offWork(customer.id, customer.scheduleId);
		
		// 移除上班客服
		customers.remove(customer);
	}
	
	public static void applyRest(){
		Customer customer = getCurrent();

		// 是否可以申请小休
		boolean success = customService.restApply(customer.id, customer.scheduleId);
		
		// 如果可以，就改变客服状态为：申请小休中。如果没有对话，可以直接小休
		if(success){
			if(customer.dialogCount()==0){
				customService.resting(customer.id, customer.scheduleId);			
			}else{
				// 申请小休中
				renderSuccess("申请小休成功！");
			}
		}else{
			renderFailure("申请小休失败！请尝试在5分钟后重新申请");
		}

	}

	public static void applyOffline(){
		// 是否可以离线
		
		// 如果可以，就改变客服状态为：申请离线中
		
		// 自营不做下班处理，记录退出时间，u客服做下班处理
	}
	
	public static void applyOnline(){
		Customer customer = getCurrent();
		
		// 计算小休时长、离线时长
		if(true){
			customService.restFinished();
		}else if(false){
			customService.offlineFinished();
		}
	}
		
	// 转交
	public static void transfer(Long dialogId){
		// dialogservice.assignment()
		
		// dialog.update
		
		
	}
	
	// 主动关闭
	public static void closeDialog(){
		dialogService.close();
	}
	
	// 超时关闭
	public static void timeoutCloseDialog(){
		dialogService.unexpectedClose();
	}
	
}
