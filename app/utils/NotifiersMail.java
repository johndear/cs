package utils;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import play.Logger;
import play.Play;
import play.cache.Cache;
import play.mvc.Mailer;
import cn.uc.common.util.BlankUtil;

/**
 * 功能描述：通知预警邮件类,用于打印日志并向用户发送预警邮件
 * <p> 版权所有：优视科技
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 <p>
 *
 * @author <a href="mailto:caily@ucweb.com">蔡龙颜</a>
 * @version 在线客服一期
 * create on: 2015-5-27
 */
public class NotifiersMail extends Mailer {

    /**
     * 邮件提醒对象地址
     */
    public static String EMAIL_WARNING_USER = Play.configuration.getProperty("NotifiersMail.to", "caily@ucweb.com").trim();
    public static String MAIL_ADRESS_FROM = Play.configuration.getProperty("mail.smtp.user", "dev3-support@ucweb.com").trim();

    /**
     * 告警邮件缓存标识存储时间
     */
    private static String MAIL_CACHE_TIMEOUT = Play.configuration.getProperty("mail_cache_timeout", "3600s");

    public static String IP_STRING = null;

    static {
        //获取本机ip异常
        try {
            InetAddress ip = InetAddress.getLocalHost();
            if (!BlankUtil.isBlank(ip)) {
                IP_STRING = ip.getHostAddress();
                Logger.info("本机地址" + IP_STRING);
            }
        } catch (UnknownHostException e) {
            Logger.error(e.getCause(), "获取本机ip异常");
        }
    }

    /**
     * 邮件报警防轰炸校验
     * @param action    action方法名称
     * @param uid       操作者id
     * @return
     */
    private static boolean valid(String action, String uid) {
        boolean valid = false;
        String key = action + "_" + uid;
        Object time = Cache.get(key);
        if (time == null) {
            Cache.set(key, System.currentTimeMillis(), MAIL_CACHE_TIMEOUT);
            valid = true;
        }
        return valid;
    }
    /**
     * 功能描述：将错误日志打印并发送邮件
     *
     * @param action  action方法
     * @param id      调用id
     * @param e       异常信息
     * @param subject 邮件标题 [[CustomersApi.index]]
     * @param message 邮件内容 新建会话参数异常recordId=%s,sourceId=%s
     * @param args    邮件内容变量
     * @author <a href="mailto:caily@ucweb.com">蔡龙颜 </a>
     * @version 在线客服一期
     * create on: 2015-5-27
     */
    public static void error(String action, String id, Exception e, String subject, String message, Object... args) {
        Logger.error(e, subject + message, args);
        if (valid(action, id)) {
            //再发送邮件
            message = getMailMessage("csos系统异常提醒邮件", subject, message, args);
            send(message);
        }
    }
    /**
     * 功能描述：错误日志
     *
     * @param action  action方法
     * @param id      调用id
     * @param subject 邮件标题 [[CustomersApi.index]]
     * @param message 邮件内容 新建会话参数异常recordId=%s,sourceId=%s
     * @param args    邮件内容变量
     * @author <a href="mailto:caily@ucweb.com">蔡龙颜 </a>
     * @version 在线客服一期
     * create on: 2015-5-27
     */
    public static void error(String action, String id, String subject, String message, Object... args) {
        Logger.error(subject + message, args);
        if (valid(action, id)) {
            //再发送邮件
            message = getMailMessage("csos系统异常提醒邮件", subject, message, args);
            send(message);
        }
    }

    /**
     * 功能描述：设置邮件信息并生成邮件内容
     *
     * @param from    邮件发件人前缀
     * @param subject 邮件标题
     * @param message 带变量邮件内容
     * @param args    变量
     * @return 邮件内容
     * @author <a href="mailto:caily@ucweb.com">蔡龙颜 </a>
     * @version 在线客服一期
     * create on: 2015-5-27
     */
    private static String getMailMessage(String from, String subject, String message, Object... args) {
        setFrom(from + "<" + MAIL_ADRESS_FROM + ">");
        setSubject(subject + IP_STRING);
        addRecipient(getReceicers(EMAIL_WARNING_USER));

        if (!BlankUtil.isBlank(args)) {
        	message = String.format(message, args);
        }
        return message;
    }

    /**
     * 将  a@xx.com,b@xx.com  的邮件地址直接加为收件人
     *
     * @param emailAddress
     * @return
     */
    private static Object[] getReceicers(String emailAddress) {
        if (BlankUtil.isBlank(emailAddress)) return null;
        emailAddress = emailAddress.replaceAll("，", ",");
        String[] emailArray = emailAddress.split(",");
        List<String> emailList = new ArrayList<String>();
        for (String email : emailArray) {
            email = email.replaceAll("\\s", "");
            if (isEmailAddress(email)) {
                emailList.add(email);
            }
        }
        return emailList.toArray();
    }


    /**
     * 检验是否正确邮箱
     *
     * @param email
     * @return
     */
    private static boolean isEmailAddress(String email) {
        String regEx = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(email);
        return m.find();
    }
}
