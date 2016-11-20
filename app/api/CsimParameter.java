package api;

import java.util.HashMap;
import java.util.Map;

import base.Constants;

public class CsimParameter {
    
    /**
	 * csim客户端路径
	 */
    private final String imRoot = Constants.IM_ROOT;
    
    /**
	 * csim客服类型
	 */
    private final String servicerType = Constants.IM_SERVICER_TYPE;

	/**
	 * csim用户类型
	 */
	private final String customerType = Constants.IM_CUSTOMER_TYPE;
    
    /**
	 * csim sceneKey
	 */
    private String sceneKey = null;
    
    /**
     * 签名结果
     */
    private final String sign;
    
    /**
     * 时间戳
     */
    private final long timestamp;

	/**
	 * 会话id
	 */
	private long dialogId;
	
	private static DialogAPI dialogService;
	static{
		if(null == dialogService){
			dialogService = new DialogAPI();
		}
	}

	/**
	 * 客服使用的参数初始化构造方法
	 * @param userId
	 */
	public CsimParameter(long userId) {
		this.sceneKey = Constants.IM_SERVICE_SCENE_KEY;
		this.timestamp = System.currentTimeMillis();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("userId", userId);
		params.put("userType", Constants.IM_SERVICER_TYPE);
		params.put("timestamp", timestamp);
		this.sign = dialogService.signService(params);
	}

	/**
	 * 用户使用的参数初始化构造方法
	 * @param userId
	 * @param dialogId
	 */
	public CsimParameter(String userId, long dialogId) {
		this.sceneKey = Constants.IM_CUSTOMER_SCENE_KEY;
		this.timestamp = System.currentTimeMillis();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("userId", userId);
		params.put("userType", Constants.IM_CUSTOMER_TYPE);
		params.put("timestamp", this.timestamp);
		params.put("dialogId", dialogId);
		this.sign = dialogService.signCustomer(params);
	}

	public String getSign() {
		return sign;
	}

	public String getImRoot() {
		return imRoot;
	}

	public String getServicerType() {
		return servicerType;
	}

	public String getCustomerType() {
		return customerType;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public String getSceneKey() {
		return sceneKey;
	}

}
