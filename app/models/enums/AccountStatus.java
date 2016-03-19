package models.enums;

/**
 * 功能描述：账号状态枚举
 * <p> 版权所有：优视科技
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 <p>
 * 
 * @author <a href="mailto:caily@ucweb.com">蔡龙颜</a>
 * @version 在线客服一期
 * create on: 2015-6-4 
 */
public enum AccountStatus {

	NORMAL("正常", 0),
    FREEZE("冻结", 1);
    

    private String display;
    private int index;

    private AccountStatus(String display, int index) {
        this.display =display;
        this.index = index;
    }

    public String display() {
    	return this.display;
    }

}
