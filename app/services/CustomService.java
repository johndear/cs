package services;

import java.util.Date;

import javax.inject.Inject;

import play.modules.guice.InjectSupport;
import dao.CustomerScheduleDao;
import models.Customer;
import models.entity.CustomerModel;
import models.entity.CustomerOnlineModel;
import models.entity.CustomerScheduleModel;
import models.enums.ServicerStatus;
import services.interfaces.IAssignment;
import services.interfaces.IChange;
import services.interfaces.IOffline;
import services.interfaces.IRest;
import services.interfaces.IWork;

@InjectSupport
public class CustomService {

	IWork work;
	IRest rest;
	IOffline offline;
	
	@Inject
	CustomerScheduleDao customerScheduleDao;
	
	public CustomService(IWork work, IRest rest, IOffline offline){
		this.work = work;
		this.rest = rest;
		this.offline = offline;
	}

	public void onWork(Long customerId, Long scheduleId) {
		// 登记客服到上班列表中
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=?", customerId).first();
		if(customerOnlineModel==null){
			customerOnlineModel = new CustomerOnlineModel();
			customerOnlineModel.setCustomerId(customerId);
		}
		customerOnlineModel.setLastActiveTime(new Date());
		customerOnlineModel.setStatus(ServicerStatus.ONLINE.ordinal());
		customerOnlineModel.save();
		
		// 记录客服当前班次onwork_time
		customerScheduleDao.updateOnworkTime(customerId, scheduleId);
	}

	public void offWork(Long customerId, Long scheduleId) {
		// 上班列表中删除下班客服
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=?", customerId).first();
		customerOnlineModel.delete();
				
		// 记录客服当前班次offwork_time
		customerScheduleDao.updateOffworkTime(customerId, scheduleId);
	}
	
	// 客服如果要小休申请成功，那么客服的每个技能组都没有超出允许小休人数的范围（根据小休比例计算） 
	public boolean allowRest(Long customerId, Long scheduleId) {
		
		return true;
	}

	public void restApply(Long customerId, Long scheduleId) {
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=", customerId).first();
		customerOnlineModel.setStatus(ServicerStatus.REST_APPLYING.ordinal());
		customerOnlineModel.save();
	}

	// 记录开始小休时间
	public void resting(Long customerId, Long scheduleId) {
		// 记录小休时间
		CustomerScheduleModel customerScheduleModel = CustomerScheduleModel.find("customerId=? and scheduleId=?", customerId, scheduleId).first();
		customerScheduleModel.setExistTime(new Date());
		customerScheduleModel.save();
		
		// 更新客服状态
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=", customerId).first();
		customerOnlineModel.setStatus(ServicerStatus.REST.ordinal());
		customerOnlineModel.save();
	}

	public void restFinished(Long customerId, Long scheduleId) {
		// 计算小休时长
		CustomerScheduleModel customerScheduleModel = CustomerScheduleModel.find("customerId=? and scheduleId=?", customerId, scheduleId).first();
		customerScheduleModel.setRestTimelong(customerScheduleModel.getRestTimelong() + new Date().getTime()-customerScheduleModel.getExistTime().getTime());
		customerScheduleModel.save();
	}

	public void offlineApply(Long customerId, Long scheduleId) {
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=", customerId).first();
		customerOnlineModel.setStatus(ServicerStatus.OFFLINE_APPLYING.ordinal());
		customerOnlineModel.save();
	}

	public void offlining(Long customerId, Long scheduleId) {
		// 记录离线时间
		CustomerScheduleModel customerScheduleModel = CustomerScheduleModel.find("customerId=? and scheduleId=?", customerId, scheduleId).first();
		customerScheduleModel.setExistTime(new Date());
		customerScheduleModel.save();
		
		// 更新客服状态
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=", customerId).first();
		customerOnlineModel.setStatus(ServicerStatus.OFFLINE.ordinal());
		customerOnlineModel.save();
	}

	public void offlineFinished(Long customerId, Long scheduleId) {
		// 计算离线时长
		CustomerScheduleModel customerScheduleModel = CustomerScheduleModel.find("customerId=? and scheduleId=?", customerId, scheduleId).first();
		customerScheduleModel.setOfflineTimelong(customerScheduleModel.getOfflineTimelong() + new Date().getTime()-customerScheduleModel.getExistTime().getTime());
		customerScheduleModel.save();
	}
	
	public void onlineApply(Long customerId, Long scheduleId) {
		CustomerOnlineModel customerOnlineModel = CustomerOnlineModel.find("customerId=", customerId).first();
		customerOnlineModel.setStatus(ServicerStatus.ONLINE.ordinal());
		customerOnlineModel.save();
	}
	
	public void unexpectedOffline(){
		
	}
	
	
}
