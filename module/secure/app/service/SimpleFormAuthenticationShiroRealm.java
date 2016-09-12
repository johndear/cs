//package com.it.j2ee.modules.permission.service;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.HashSet;
//import java.util.List;
//
//import org.apache.commons.lang3.StringUtils;
//import org.apache.shiro.SecurityUtils;
//import org.apache.shiro.authc.AuthenticationException;
//import org.apache.shiro.authc.AuthenticationInfo;
//import org.apache.shiro.authc.AuthenticationToken;
//import org.apache.shiro.authc.SimpleAuthenticationInfo;
//import org.apache.shiro.authc.UsernamePasswordToken;
//import org.apache.shiro.authz.AuthorizationInfo;
//import org.apache.shiro.authz.SimpleAuthorizationInfo;
//import org.apache.shiro.realm.AuthorizingRealm;
//import org.apache.shiro.subject.PrincipalCollection;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.it.j2ee.modules.permission.entity.Menu;
//import com.it.j2ee.modules.permission.entity.Role;
//import com.it.j2ee.modules.permission.entity.RoleAction;
//import com.it.j2ee.modules.permission.entity.User;
//
///**
// * 
// * @author Administrator
// *
// */
//public class SimpleFormAuthenticationShiroRealm extends AuthorizingRealm {
//
//	@Autowired
//	private AccountService accountService;
//	
//	/**
//	 * 登陆回调，进行用户名和密码验证(token是用户界面输入，与数据库info信息进行密码校验)
//	 * 注：shiro职责只做密码校验，不做用户名检查
//	 * TODO 密码加密--高级应用
//	 */
//	@Override
//	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken userToken) throws AuthenticationException {
//		UsernamePasswordToken token = (UsernamePasswordToken) userToken;
//		String userName = token.getUsername();
//		// 检查用户名是否存在
//		User user = accountService.findUserByLoginName(userName);
//		if(user!=null){
//			return new SimpleAuthenticationInfo(user.getUserName(), "aa", getName()); // user.getPassword()
//		}
//		return null;
//	}
//	
//	/**
//	 * 授权回调
//	 */
//	@Override
//	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
//		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
//		
//		String userName = (String) principals.getPrimaryPrincipal();
//		User user = accountService.findUserByLoginName(userName);
//		List<Role> roles = user.getRoleList();
//		for (Role role : roles) {
////			 基于Role的权限信息
//			info.addRole(role.getRoleName());
////			 基于Permission的权限信息
//			List<RoleAction> list  = role.getPermissionList();
//			for (RoleAction roleAction : list) {
//				String actions = roleAction.getActions();// actions格式：user:add,user:edit,user:delete,..
//				if(StringUtils.isNotEmpty(actions)){
//					String[] permissions = actions.split(",");
//					for (String permission : permissions) {
//						info.addStringPermission(permission);
//					}
//				}
//			}
//		}
//		
////		基于菜单的权限信息
//		SecurityUtils.getSubject().getSession().setAttribute("menus", getMenus(user));
//		
//		return info;
//	}
//	
//	/**
//	 * 加载当前用户的菜单树
//	 * @param user
//	 * @return
//	 */
//	public Menu getMenus(User user){
//		List<Role> roles = user.getRoleList();
//		List<Menu> menus = new ArrayList<Menu>();
//		for (Role role : roles) {
//			List<Menu> mList = role.getMenuList();
//			menus.addAll(mList);
//		}
//		
//		// 去重菜单
//		HashSet<Menu> newMenus = new HashSet<Menu>(menus);
//		menus.clear();
//		menus.addAll(newMenus);
//		
//		Menu rootMenu = new Menu();
//		for (Menu menu : menus) {
//			if("ROOT".equals(menu.getMenuCode())){
//				rootMenu.setId(menu.getId());
//				buildMenuTree(rootMenu, menus);
//			}
//		}
//		
//		return rootMenu;
//	}
//	
//	private void buildMenuTree(Menu parentMenu, List<Menu> menus){
//		List<Menu> tempMenus = new ArrayList<Menu>();
//		for (Menu menu : menus) {
//			if(menu.getpId() == parentMenu.getId()){
//				tempMenus.add(menu);
//				buildMenuTree(menu, menus);
//			}
//		}
//		
//		if(tempMenus.size()>1){
//	    	Collections.sort(tempMenus,new Comparator<Menu>() {
//	            public int compare(Menu arg0, Menu arg1) {
//	                return arg0.getDisplayOrder().compareTo(arg1.getDisplayOrder());
//	            }
//	        });
//    	}
//		
//		parentMenu.setChildrens(tempMenus);
//	}
//	
//}
