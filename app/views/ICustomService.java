package services;

public interface ICustomService{
	
	void checkIn();
	
	boolean restApply();
	
	boolean resting();
	
	boolean restFinished();
	
	boolean offlineApply();
	
	boolean offlining();
	
	boolean offlineFinished();
	
	void onWork();
	
	void offWork();

}
