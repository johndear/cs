package api;

import base.Constants;
import cn.uc.common.util.BlankUtil;

/**
 * 功能描述：用户端配置参数对象
 * <p> 版权所有：优视科技 </p>
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 </p>
 *
 * @author <a href="mailto:zhangxf3@ucweb.com">张晓凡</a>
 * @version 1.0.0
 * create on: 2015-06-09
 */
public class CustomerParameter {
    private static final int waitMinute = Constants.CUSTOMER_ONLINE_TIMEOUT;
    private static final int delaySecond = Constants.CUSTOMER_TIMEOUT_COUNTDOWN;
    private static final int waitResponseSecond = Constants.CUSTOMER_WAIT_RESPONSE_SECOND;
    private static final int maxReplyTime = Constants.CUSTOMER_MAX_APPLY_TIME;
    private static final int replayInterval = Constants.CUSTOMER_APPLY_INTERVAL;

    private long pf;
    private String instance;
    private String feedbackUrl;
    private String sys;
    private String senstiveWords;

    public CustomerParameter(String sys,long pf, String instance,String feedbackUrl) {
        this.pf = pf;
        this.instance = instance;

        if(!BlankUtil.isBlank(feedbackUrl)){
            this.feedbackUrl=feedbackUrl;
        }else{

            this.feedbackUrl=String.format(Constants.FEEDBACK_DEFAULT_URL,pf,instance);
        }
        
//        if(Constants.JYM_SYS_FLAG.equals(sys)){
//        	this.senstiveWords = GlobalCacheUtil.getSysParamValue(FeedbackConstants.SYS_PARAMS_KEY.JYM_SENSITIVE_WORDS);
//        	//写死交易猫的意见反馈路径
//        	if(!BlankUtil.isBlank(Constants.JYM_FEEDBACK_URL)){
//        		this.feedbackUrl = Constants.JYM_FEEDBACK_URL;
//        	}
//        }
    }
    
    public static int getWaitMinute() {
        return waitMinute;
    }

    public static int getDelaySecond() {
        return delaySecond;
    }

    public static int getWaitResponseSecond() {
        return waitResponseSecond;
    }

    public static int getMaxReplyTime() {
        return maxReplyTime;
    }

    public static int getReplayInterval() {
        return replayInterval;
    }

    public long getPf() {
        return pf;
    }

    public void setPf(long pf) {
        this.pf = pf;
    }

    public String getInstance() {
        return instance;
    }

    public void setInstance(String instance) {
        this.instance = instance;
    }
}
