package services;

import services.interfaces.IAssignment;
import services.interfaces.IChange;
import services.interfaces.IOffline;
import services.interfaces.IRest;
import services.interfaces.IWork;

public class CustomService {

	IWork work;
	IRest rest;
	IOffline offline;
	
	public CustomService(IWork work, IRest rest, IOffline offline){
		this.work = work;
		this.rest = rest;
		this.offline = offline;
	}

	public void onWork() {
		work.onWork();
	}

	public void offWork() {
		// TODO Auto-generated method stub
		
	}

	public boolean restApply() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean resting() {
		// TODO Auto-generated method stub
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



	
	
}
