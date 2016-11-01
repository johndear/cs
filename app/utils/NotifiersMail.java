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
    public static void error(String action, String id, Exception e, String subject, String message, Object... args) {
        Logger.error(e, subject + message, args);
        if (valid(action, id)) {
            //再发送邮件
            message = getMailMessage("csos系统异常提醒邮件", subject, message, args);
            send(message);
        }
    }

    public static void error(String action, String id, String subject, String message, Object... args) {
        Logger.error(subject + message, args);
        if (valid(action, id)) {
            //再发送邮件
            message = getMailMessage("csos系统异常提醒邮件", subject, message, args);
            send(message);
        }
    }

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
