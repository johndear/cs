package services;

import javax.inject.Inject;

import play.modules.guice.InjectSupport;
import dao.CustomerScheduleDao;
import models.Customer;
import models.entity.CustomerScheduleModel;
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
//		work.onWork();
		
		// 记录客服当前班次onwork_time
		customerScheduleDao.updateOnworkTime(customerId, scheduleId);
        
	}

	public void offWork(Long customerId, Long scheduleId) {
		// 记录客服当前班次offwork_time
		customerScheduleDao.updateOffworkTime(customerId, scheduleId);
		        		
	}

	// 客服如果要小休申请成功，那么客服的每个技能组都没有超出允许小休人数的范围（根据小休比例计算） 
	public boolean restApply(Long customerId, Long scheduleId) {
		
		return false;
	}

	// 记录开始小休时间
	public boolean resting(Long customerId, Long scheduleId) {
		return false;
	}

	public boolean restFinished() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean offlineApply() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean offlining() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean offlineFinished() {
		// TODO Auto-generated method stub
		return false;
	}
	
	public void unexpectedOffline(){
		
	}
	
	
}
