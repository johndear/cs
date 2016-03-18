package services.impl.zhywb;

import javax.inject.Inject;

import services.impl.zhywb.dao.CustomDao;
import services.interfaces.IWork;

public class Work implements IWork{

	@Inject
	CustomDao customDao;
	
	@Override
	public void onWork() {
		// 是否到上班时间 、是否迟到
		
		customDao.update(null);// 登记上班
	}

	@Override
	public void offWork() {
		
		// 是否早退、计算在线服务时长、在线服务人数
		
		customDao.update(null);// 登记下班、记录登出时间
		
		
	}

}
