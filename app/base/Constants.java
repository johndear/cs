package base;

import play.Play;

public class Constants {
	
	/**
	 * 定义全局type
	 */
	public static final String ZORE = "0";
	public static final String ONE = "1";
	public static final String TWO = "2";
	public static final String THREE = "3";
	public static final String FOUR = "4";
	
	/**
	 * 交易猫订单操作类型常量(0:查询，1:催发货，2:核对状态，3:重新发起转账)
	 */
    public static final int JYM_ORDER_QUERY = 0;
    public static final int JYM_ORDER_URGE_DELIVER = 1;
    public static final int JYM_ORDER_CHECK_STATUS = 2;
    public static final int JYM_ORDER_RE_TRANSFER = 3;
	/**
     * csws数据源标志csws
     */
    public static final String DB_CSWS = "csws";
    /**
     * csim数据源标识
     */
    public static final String DB_CSIM = "csim";
    /**
     * csim数据源标识
     */
    public static final String DB_CSOS = "csos";
    /**
     * 查询对话聊天内容
     */
    public static final String DIALOG_CONTENT_LIST = "dialog.content.list";
    
    /**
     * 修改会话数据
     */
    public static final String DIALOG_UPDATE = "dialog.update";
    
    /**
     * 修改班务数据
     */
    public static final String SERVICESCHEDULE_UPDATE = "serviceSchedule.update";
    
    /**
     * 查询账号信息account.key.list
     */
    public static final String ACCOUNT_KEY_LIST = "account.key.list";
    
    /**
     * 客服分单信息account.key.list
     */
    public static final String ACCOUNT_ASSIGNMENT_KEY_LIST = "account.assignment.key.list";
    /**
     * 客服分单信息skill.group.list
     */
    public static final String SOURCE_SKILLGROUP_LIST = "source.skillgroup.list";
    
    /**
     * 分配客服Id
     */
    public static final String ACCOUNT_ASSIGNMENT_SERVICERID = "account.assignment.servicerId";
    
    /**
     * 查找某个埋点是否有在线的客服 
     */
    public static final String ACCOUNT_OFFLINESTATUS_COUNT = "account.offlineStatus.count";

    /**
     * 客服进单
     */
    public static final String ACCOUNT_ASSIGNMENT_INCREASING = "account.assignment.increasing";
    
    /**
     * 客服出单
     */
    public static final String ACCOUNT_ASSIGNMENT_DESCENDING = "account.assignment.descending";
    
    /**
     * 客服回收处理量
     */
    public static final String ACCOUNT_ASSIGNMENT_KEY_RECOVERY = "account.assignment.key.recovery";
    
    /**
     * 查询用户信息customers.key.list
     */
    public static final String CUSTOMERS_KEY_LIST = "customers.key.list";
    
    /**
     * 满意度内容字符检验长度200
     */
    public static final int V_SAVESATISFACTION_EVALUATE_L = 200;
    
    /**
     * 满意度评价类型CUSTOMER_SERVICE
     */
    public static final String SAVESATISFACTION_EVALUATE_TYPE = "CUSTOMER_SERVICE";
    
    /**
     * 满意度业务渠道ON_LINE
     */
    public static final String SAVESATISFACTION_BUSINESS_TYPE = "ON_LINE";
    
    /**
     * 数据库字符串长度1023
     */
    public static final int DB_LENGTH_1023 = 1023;
    
    /**
	 * 接口调用超时时间,单位是秒30秒sys.interface.timeout
	 */
    public static final int SYS_INTERFACE_TIMEOUT = Integer.parseInt(Play.configuration.getProperty("sys.interface.timeout","30"));

    /**
     * 用户在线超时关闭事件标识
     */
    public static final String EVENT_ONLINE_CLOSE = "online_close";
    /**
     * 用户离线超时关闭事件标识
     */
    public static final String EVENT_OFFLINE_CLOSE = "offline_close";
    /**
     * 客服转单标识
     */
    public static final String EVENT_CHANGE = "change";
    /**
     * 客服掉线标识
     */
    public static final String EVENT_OFFLINE = "offline";
    
    /**
     * 登录事件
     */
    public static final String EVENT_LOGIN = "login";
    /**
     * 客服举报标识
     */
    public static final String EVENT_REPORT = "report";
    
    /**
	 * csim客户端路径
	 */
    public static final String IM_ROOT = Play.configuration.getProperty("im.root");
    
    /**
	 * csim客服类型
	 */
    public static final String IM_SERVICER_TYPE = Play.configuration.getProperty("im.servicer_type");

    /**
     * csim的用户类型
     */
    public static String IM_CUSTOMER_TYPE = Play.configuration.getProperty("im.customer_type");

    /**
	 * csim sceneKey
	 */
    public static final String IM_SERVICE_SCENE_KEY = Play.configuration.getProperty("im.service_sceneKey");

    public static final String IM_CUSTOMER_SCENE_KEY = Play.configuration.getProperty("im.customer_sceneKey");

    /**
     * csim工作台端的签名
     */
    public static String IM_SECRET_KEY = Play.configuration.getProperty("im.secretKey");

    /**
     * 用户在线超时最大时长，单位分钟
     */
    public static final int CUSTOMER_ONLINE_TIMEOUT = Integer.parseInt(Play.configuration.getProperty("customer.online_timeout", "3"));
    /**
     *#用户在线超时后倒数秒数
     */
    public static final int CUSTOMER_TIMEOUT_COUNTDOWN = Integer.parseInt(Play.configuration.getProperty("customer.timeout_countdown", "60"));
    /**
     * 用户等待客服回复最大时长
     */
    public static final int CUSTOMER_WAIT_RESPONSE_SECOND = Integer.parseInt(Play.configuration.getProperty("customer.wait_response_second", "30"));

    /**
     * 用户请求客服服务的最大请求时间
     */
    public static final int CUSTOMER_MAX_APPLY_TIME = Integer.parseInt(Play.configuration.getProperty("customer.max_apply_time", "30"));
    /**
     * 用户请求客服的请求发起时间间隔
     */
    public static final int CUSTOMER_APPLY_INTERVAL = Integer.parseInt(Play.configuration.getProperty("customer.apply_interval", "5"));

    /**
     * 用户请求客服的请求发起时间间隔
     */
    public static final String FEEDBACK_DEFAULT_URL = Play.configuration.getProperty("feedback.default.url", "http://feedbackuccn/feedback/feedback/index?self_service=true&pf=%s&instance=%s&uc_param_str=einibicppfmivesifrutlantcunwsssvstjbst");

    /**
     * csos系统文件在uae上压缩后的根路径
     */
    public static final String UAE_COMPRESS_ROOT = Play.configuration.getProperty("uae_compress_root", "http://imageuccn/e/uaeext/c;08/csos");
    /**
     * csos系统文件再uae上未压缩的根路径
     */
    public static final String UAE_UNCOMPRESS_ROOT = Play.configuration.getProperty("uae_uncompress_root", "http://imageuccn/s/uae/g/08/csos");

    /**
     * 是否为开发模式
     */
    public static final boolean IS_DEV_MODE = Play.configuration.getProperty("application.mode", "dev").equals("dev");
    /**
     * 系统创建时保存的操作者的名字
     */
    public static final String SYSTEM_CREATOR_NAME = "SYS";
    /**
     * 最长登录时间
     */
    public static final int LONGEST_LOGIN_TIME = 16;
    /**
     * 交易猫标识
     */
    public static final String JYM_SYS_FLAG = "jym";

    /**
	 * 验证码过期时间,单位是分钟,默认5分钟
	 */
    public static final String VALIDATE_CODE_TIMEOUT = Play.configuration.getProperty("validatecode.timeout","5mn");

    /**
     * u客服角色code
     */
    public static final String ROLE_CODE_FOR_U="firstline_role_u";
    /**
     * u客服专家角色code
     */
    public static final String ROLE_CODE_FOR_U_MASTER="firstline_role_u_master";
    /**
     * U客服运营
     */
    public static final String ROLE_CODE_FOR_U_OPERATE="u_operator";
    /**
     * U客服超级管理员
     */
    public static final String ROLE_CODE_FOR_U_SUPER_ADMIN="u_super_admin";
    
    /**
     * 客服类型-自营客服
     */
    public static final String KF_TYPE_SELF_EMPLOYED="SELF_EMPLOYED";
    
    /**
     * 优选提前时间，默认提前30分钟
     */
    public static final int PRIORITY_TIME = Integer.parseInt(Play.configuration.getProperty("center.chooseschedule.priority_time","30"));
    
    /**
     * 调用csws接口，校验参数
     */
    // 工单接口前缀
    public static final String CSWS_BASEURL = Play.configuration.getProperty("csws.url.baseUrl");
    public static final int CSWS_CLIENTID = Integer.parseInt(Play.configuration.getProperty("csws.clientId","5"));
    public static final String CSWS_SECRET = Play.configuration.getProperty("csws.secret");
//    public static final String CSWS_NONCE = Play.configuration.getProperty("csws.nonce");
    /**
     * csws客服冻结接口
     */
	public static final String CSWS_FROZENACCOUNT = Play.configuration.getProperty("csws.frozenaccount",
			"/api/accountapi/frozenaccount");
	/**
     * csws客服催单接口
     */
	public static final String CSWS_REMINDER = Play.configuration.getProperty("csws.reminder",
			"/api/uccloudserviceapi/reminder");
	/**
     * csws客服追加信息接口
     */
	public static final String CSWS_ADDPROBLEMDESC = Play.configuration.getProperty("csws.addproblemdesc",
			"/api/uccloudserviceapi/addproblemdesc");
	

    public static String uRoleDisplayStr(String role){
        if(ROLE_CODE_FOR_U.equals(role)){
            return "u客服";
        }else if(ROLE_CODE_FOR_U_MASTER.equals(role)){
            return "u客服专家";
        }else if(ROLE_CODE_FOR_U_OPERATE.equals(role)){
            return "U客服运营";
        }else if(ROLE_CODE_FOR_U_SUPER_ADMIN.equals(role)){
            return "U客服超级管理员";
        }
        return "";
    }

	/**
	 * 交易猫登录url-获取code
	 */
	public static String JYM_AUTHORIZATION_URL = Play.configuration.getProperty("jym_authorization_url",
			"https://api.jiaoyimao.com/oauth2/authorize");
	/**
	 * 交易猫登录url-获取token
	 */
	public static String JYM_ACCESS_TOKEN_URL = Play.configuration.getProperty("jym_access_token_url",
			"https://api.jiaoyimao.com/oauth2/access_token");
	/**
	 * 交易猫客户端id
	 */
	public static String JYM_CLIENT_ID = Play.configuration.getProperty("jym_client_id",
			"YOUR_CLIENT_ID");
	/**
	 * 交易猫密钥
	 */
	public static String JYM_SECRET = Play.configuration.getProperty("jym_secret",
			"YOUR_CLIENT_SECRET");
	/**
	 * 交易猫用户个人中心url
	 */
	public static String JYM_USER_URL = Play.configuration.getProperty("jym_user_url",
			"https://www.jiaoyimao.com/account");



    /**
     * 交易猫部门id
     */
    public static final Long JYM_DEP_ID = Long.parseLong(Play.configuration.getProperty("jym.department.id","2"));
    
    /**
	 * 会话有效期
	 */
	public static final String SESSION_MAX_AGE = Play.configuration.getProperty("application.session.maxAge");
    
    /**
	 * 用户端存储的cookie名称
	 */
	public static final String COOKIE_NAME = Play.configuration.getProperty("customer.cookieName");
	
	/**
     * 下线或下班转单的重试次数,重试次数完后将会直接将用户断线
     */
    public static final int OFFLINE_CHANGE_TIME = Integer.valueOf(Play.configuration.getProperty("cs.offline.change.time","3"));
	
    /**
	 * 交易猫意见反馈路径,为空则代表用客服自己的意见反馈
	 */
	public static final String JYM_FEEDBACK_URL = Play.configuration.getProperty("jym.feedback.url");
}
