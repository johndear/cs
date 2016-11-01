package controllers;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import org.apache.commons.lang.StringUtils;

import play.db.jpa.JPA;
import controllers.Secure.Security;
import entity.Action;
import entity.Resource;
import entity.User;

public class CRUDSecure extends Security {

	static String login_sql = "SELECT * FROM t_user WHERE login_name=:loginName AND PASSWORD=:password";
	static String load_permission_sql = "SELECT t7.id,t7.name,t7.code,t7.url,(SELECT GROUP_CONCAT(t_2.name) FROM t_resource_action t_1 LEFT JOIN t_action t_2  ON t_1.action_id=t_2.id WHERE t_1.resource_id = t7.id) actions, GROUP_CONCAT(t6.name)     authActions, GROUP_CONCAT(t6.title)    authActionTitles, t7.pid                pId FROM t_user t1  LEFT JOIN t_group_user t2 ON t1.id = t2.user_id LEFT JOIN t_group_role t3 ON t2.group_id = t3.group_id LEFT JOIN t_role_resource_action t4 ON t3.role_id = t4.role_id LEFT JOIN t_resource_action t5 ON t4.resource_id = t5.resource_id AND t4.action_id = t5.action_id LEFT JOIN t_action t6 ON t5.action_id=t6.id LEFT JOIN t_resource t7 ON t5.resource_id = t7.id WHERE t1.login_name = :loginName GROUP BY t7.id;";

	/**
	 * 
	 * 功能描述：
	 *	用户登录验证
	 * @param username
	 * @param password
	 * @return 
	 * @author <a href="mailto:clyqqcom">刘苏 </a>
	 * @version 在线客服二期
	 * create on: 2016年6月25日
	 */
	static boolean authenticate(String username, String password) {
		List<User> list = JPA.em()
				.createNativeQuery(login_sql, User.class)
				.setParameter("loginName", username)
				.setParameter("password", password).getResultList();
		return list.size() > 0;
	}
	
	/**
	 * 功能描述：
	 * 	权限验证
	 * 	权限格式如下：,资源:操作,user:add,user:edit,user:remove,...,
	 * 	权限匹配：,xxxx:(add|edit|remove),
	 * @param profile
	 * @return
	 */
	static boolean check(String profile) {
		String userName = session.get("username");
		if("super".equals(userName)){ // 超级管理员
			return true;
		}
		
		// 加载用户权限
		List<Resource> list = JPA.em()
				.createNativeQuery(load_permission_sql, Resource.class)
				.setParameter("loginName", connected()).getResultList();

		StringBuffer permissions = new StringBuffer(",");
		String permission = null;
		for (Resource resource : list) {
			if(resource == null){
				continue;
			}
			
			// 资源访问权限(如:,user,)
			permission = resource.getCode() + ',';
			if (!permissions.toString().contains(',' + permission)) {
				permissions.append(permission);
			}
			// 资源操作权限(如:,user:add,user:edit,)
			if(StringUtils.isEmpty(resource.getAuthActions())){
				continue;
			}
			String[] actions = resource.getAuthActions().split(",");
			for (String action : actions) {
				permission = resource.getCode() + ':' + action + ',';
				
				if (!permissions.toString().contains(',' + permission)) {
					permissions.append(permission);
				}
			}
		}

		// 判断是否拥有指定权限
		// permissions值格式如下：,user,user:add,user:edit, 与,profile,对比
		if ("".equals(permissions.toString())
				|| !permissions.toString().toLowerCase()
						.contains(',' + profile.toLowerCase() + ',')) {
			return false;
		}

		return true;
	}
	
	static void onCheckFailed(String profile) {
        renderTemplate("Secure/errors/accessDenied.html");
    }

}

