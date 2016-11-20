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

public class LocalSecure extends Security {

	static String login_sql = "SELECT * FROM tb_user WHERE login_name=:loginName AND PASSWORD=:password";
	static String load_permission_sql = "SELECT t5.id,t5.name,t5.code,t5.url,t5.`actions` actions,t4.resource_action authActions,t5.pid pId FROM tb_user t1 LEFT JOIN tb_user_group t2 ON t1.id=t2.user_id LEFT JOIN tb_group_role t3 ON t2.group_id = t3.group_id LEFT JOIN tb_role_resource_action t4 ON t3.role_id=t4.role_id LEFT JOIN tb_resource t5 ON t4.resource_id=t5.id where t1.login_name=:loginName";

	/**
	 * 
	 * 功能描述：
	 *	用户登录验证
	 * @param username
	 * @param password
	 * @return 
	 * @author <a href="mailto:clyqqcom">刘苏 </a>
	 * @version 客服二期
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
			String[] actions = resource.getAuthActions().split(";");
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

