package models.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * 功能描述：
 * <p> 版权所有：优视科技 </p>
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
 *
 * @author <a href="mailto:zhangxf3@ucweb.com">张晓凡</a>
 * @version 1.0.0
 * create on: 2015-05-29
 */
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
    
    /**
     * 功能描述：获取不在线的状态
     *
     * @return 
     * @author <a href="mailto:caily@ucweb.com">蔡龙颜 </a>
     * @version 在线客服接入交易猫
     * create on: 2016-1-26  
     */
    public static List<String> getOfflineServicerStatus(){
    	List<String> servicerStatus = new ArrayList<String>();
    	servicerStatus.add(String.valueOf(ServicerStatus.OFFLINE.index));
    	servicerStatus.add(String.valueOf(ServicerStatus.FREEZE.index));
    	servicerStatus.add(String.valueOf(ServicerStatus.OFFLINE_APPLYING.index));
    	return servicerStatus;
    }
    
    

}
