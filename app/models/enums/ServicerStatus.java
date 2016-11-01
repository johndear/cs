package models.enums;

import java.util.ArrayList;
import java.util.List;

public enum ServicerStatus {

    /**
     * 在线中
     */
    ONLINE("在线中", 0),
    /**
     * 冻结中
     */
    FREEZE("冻结中", 1),
    /**
     * 小休中
     */
    REST("小休中", 2),
    /**
     * 已离线
     */
    OFFLINE("已离线", 3),
    /**
     * 上班申请中
     */
    ONLINE_APPLYING("上班申请中", 4),
    /**
     * 小休申请中
     */
    REST_APPLYING("小休申请中", 5),
    /**
     * 离线申请中
     */
    OFFLINE_APPLYING("离线申请中", 6),
    /**
     * 未归档数太多停止进单
     */
    STOP_ALLOCATION("未归档数太多停止进单", 7),
    /**
     * 恢复进单
     */
    START_ALLOCATION("恢复进单", 8),
    /**
     * 取消小休
     */
    REST_CANCEL("取消小休", 9);
    

    private String display;
    private int index;

    private ServicerStatus(String display, int index) {
        this.display =display;
        this.index = index;
    }

    public String display() {
    	return this.display;
    }

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}
	
	public static ServicerStatus getServicerStatus(String text) {
		for (ServicerStatus status : ServicerStatus.values()) {
			if(text.equals(status.display())){
				return status;
			}
		}
		return null;
	}
    
    public static List<String> getOfflineServicerStatus(){
    	List<String> servicerStatus = new ArrayList<String>();
    	servicerStatus.add(String.valueOf(ServicerStatus.OFFLINE.index));
    	servicerStatus.add(String.valueOf(ServicerStatus.FREEZE.index));
    	servicerStatus.add(String.valueOf(ServicerStatus.OFFLINE_APPLYING.index));
    	return servicerStatus;
    }
    
    

}
