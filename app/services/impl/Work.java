package services.impl;

import javax.inject.Inject;

import play.modules.guice.InjectSupport;
import services.impl.zhywb.dao.CustomDao;
import services.interfaces.IWork;

@InjectSupport
public class Work implements IWork{

	@Inject
	private static CustomDao customDao;
	
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
