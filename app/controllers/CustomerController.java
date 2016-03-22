package controllers;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.inject.Inject;

import models.Customer;
import models.enums.AccountStatus;
import models.enums.ServicerStatus;
import play.Play;
import services.CustomService;
import services.DialogService;
import services.impl.Work;
import api.CsimParameter;
import base.SecureController;

public class CustomerController extends SecureController{
	
	// 在线客服--需要在启动的时候初始化（防止服务器重启将在线客服丢失，造成重新上班的情况）
	static Map<Long, Customer> customers = new HashMap<Long, Customer>();
	
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
        if (customer.isFreeze) {
            renderFailure("您的账号被冻结！不允许进入工作台，如有疑问请联系管理员");
        }
        
        if(customer.scheduleId==null){
        	renderFailure("没有要服务的班次");
        }
        
        // 刷新工作台
        if(customers.containsKey(customer.id)){
        	// TODO 可以考虑是否将该客服由其他状态（小休中、离线中）置为上线
        	
        }else{
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
		customers.remove(customer.id);
	}
	
	public static void applyRest(){
		Customer customer = getCurrent();
		// 是否可以申请小休
		boolean success = customService.allowRest(customer.id, customer.scheduleId);
		
		if(success){
			if(customer.dialogCount()==0){
				// 如果没有对话，可以直接小休
				customService.resting(customer.id, customer.scheduleId);			
			}else{
				// 更新客服状态为：申请小休中
				customService.restApply(customer.id, customer.scheduleId);
				// 申请小休中
				renderSuccess("申请小休成功！");
			}
		}else{
			renderFailure("申请小休失败！请尝试在5分钟后重新申请");
		}

	}

	public static void applyOffline(){
		Customer customer = getCurrent();
		// 更新客服状态为：申请离线中，
		if(customer.dialogCount()==0){
			if(customer.isSelf){
				// 自营客服，可以直接离线中
				customService.offlining(customer.id, customer.scheduleId);			
			}else{
				// u客服下班
				offWork();
			}
		}else{
			// 更新客服状态为：申请离线中
			customService.offlineApply(customer.id, customer.scheduleId);
			// 申请小休中
			renderSuccess("申请离线成功！");
		}
		
		// 自营不做下班处理，记录退出时间，u客服做下班处理
	}
	
	public static void applyOnline(){
		Customer customer = getCurrent();
		
		// 计算小休时长、离线时长
		if(customer.status == ServicerStatus.REST){
			customService.restFinished(customer.id, customer.scheduleId);
		}else if(customer.status == ServicerStatus.OFFLINE){
			customService.offlineFinished(customer.id, customer.scheduleId);
		}
		
		customService.onlineApply(customer.id, customer.scheduleId);
	}
		
	// 转交
	public static void transfer(Long dialogId){
		// dialogservice.assignment()
		
		// dialog.update
		
		
	}
	
	// 主动关闭
	public static void closeDialog(){
		// 关闭最后一个会话的时候，如果客服状态是申请小休中、申请离线中，就更新状态为小休中、离线中
		
		dialogService.close();
	}
	
	// 超时关闭
	public static void timeoutCloseDialog(){
		dialogService.unexpectedClose();
	}
	
}
