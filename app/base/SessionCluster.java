package base;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import play.Logger;
import play.Play;
import play.cache.Cache;
import play.libs.Time;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.Http;

public class SessionCluster extends Controller {
	
	 /**
     * session的key
     */
    public static final String SESSION_WEIXIN_SECURE_KEY = "CSWS_SESSION_WEIXIN_SECURE_KEY";

    private static final String SESSION_MAX_AGE = Play.configuration.getProperty("application.session.maxAge");


	/**
	 * 更新session的超时时间
	 */
	@Before(priority = 0)
	static synchronized void updateSession() {
		String sessionId = getSessionId();
		Map<String, String> params = Cache.get(sessionId, Map.class);
		if (params == null) {
			params = new HashMap<String, String>();
		}
		Cache.set(sessionId, params, SESSION_MAX_AGE);
	}

	protected static synchronized String getSessionId() {
		Http.Cookie cookie = request.cookies.get(SESSION_WEIXIN_SECURE_KEY);
		String id;
		if (session.contains(SESSION_WEIXIN_SECURE_KEY)) {
			id = session.get(SESSION_WEIXIN_SECURE_KEY);
		} else if (cookie == null) {
			id = UUID.randomUUID().toString().replace("-", "");
			session.put(SESSION_WEIXIN_SECURE_KEY, id);
		} else {
			// 由于部分网关会对cookie搞搞阵，出现形如:xxxxxxx;PLAY_FLASH这样的value的cookie，所以兼容它,进行截取
			if (cookie.value.length() > 36) {
				id = cookie.value.substring(0, 36);
			} else {
				id = cookie.value;
			}
		}
		if (Cache.get(SESSION_WEIXIN_SECURE_KEY + id) == null) {
			Cache.set(SESSION_WEIXIN_SECURE_KEY + id, new HashMap<String, Object>(), SESSION_MAX_AGE);
		}
		setSessionCookie(id);
		return SESSION_WEIXIN_SECURE_KEY + id;
	}

	private static void setSessionCookie(String sessionId) {
		response.setCookie(SESSION_WEIXIN_SECURE_KEY, sessionId, null, "/", Time.parseDuration(SESSION_MAX_AGE), false,
				false);
	}

	/**
	 * 放入session值
	 *
	 * @param key
	 * @param value
	 */
	protected synchronized static void sessionPut(String key, Object value) {
		String sessionId = getSessionId();
		Map<String, Object> params = Cache.get(sessionId, Map.class);
		params.put(key, value);
		Cache.safeSet(sessionId, params, SESSION_MAX_AGE);
	}

	/**
	 * 一次性put多个值 格式为 key,value,key,value...参数必须是偶数
	 *
	 * @param objects
	 */
	protected synchronized static void sessionPut(Object... objects) {
		if (objects != null && objects.length % 2 == 0) {
			for (int i = 0; i < objects.length; i++) {
				String key = objects[i].toString();
				i++;
				Object value = objects[i];
				sessionPut(key, value);
			}
		} else {
			Logger.error(new IllegalArgumentException(), "sessionPut参数个数错误。");
		}
	}

	/**
	 * 获取session值
	 *
	 * @param key
	 * @return
	 */
	protected static Object sessionGet(String key) {
		String sessionId = getSessionId();
		Map<String, Object> params = Cache.get(sessionId, Map.class);
		if (params == null) {
			updateSession();
			params = new HashMap<String, Object>();
		}
		return params.get(key);
	}

	/**
	 * 获取session值
	 *
	 * @param key
	 * @return
	 */
	protected static <T> T sessionGet(String key, Class<T> clazz) {
		String sessionId = getSessionId();
		Map<String, Object> params = Cache.get(sessionId, Map.class);
		if (params == null) {
			updateSession();
			params = new HashMap<String, Object>();
		}
		return (T) params.get(key);
	}

	/**
	 * 移除session
	 *
	 * @param key
	 */
	protected synchronized static void sessionRemove(String key) {
		String sessionId = getSessionId();
		Map params = Cache.get(sessionId, Map.class);
		params.remove(key);
		Cache.set(sessionId, params, SESSION_MAX_AGE);
	}

}
