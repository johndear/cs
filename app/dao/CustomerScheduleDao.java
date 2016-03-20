package dao;

import java.util.Date;

import models.entity.CustomerScheduleModel;

public class CustomerScheduleDao {
	
	// 更新客服班次信息-上班时间
	public void updateOnworkTime(Long customerId, Long scheduleId){
		CustomerScheduleModel customerScheduleModel = CustomerScheduleModel.find("customerId=? and scheduleId=?", customerId, scheduleId).first();
		customerScheduleModel.setOnworkTime(new Date());
		customerScheduleModel.save();
	}
	
	// 更新客服班次-下班时间
	public void updateOffworkTime(Long customerId, Long scheduleId){
		CustomerScheduleModel customerScheduleModel = CustomerScheduleModel.find("customerId=? and scheduleId=?", customerId, scheduleId).first();
		customerScheduleModel.setOffworkTime(new Date());
		customerScheduleModel.save();
	}

}
