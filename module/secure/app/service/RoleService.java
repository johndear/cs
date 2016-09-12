//package com.it.j2ee.modules.permission.service;
//
//import java.util.List;
//
//import javax.persistence.EntityManagerFactory;
//import javax.persistence.Query;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.it.j2ee.modules.permission.dao.MenuDao;
//import com.it.j2ee.modules.permission.dao.RoleActionDao;
//import com.it.j2ee.modules.permission.dao.RoleDao;
//import com.it.j2ee.modules.permission.entity.Menu;
//import com.it.j2ee.modules.permission.entity.Role;
//import com.it.j2ee.modules.permission.entity.RoleAction;
//
//@Component
//@Transactional
//public class RoleService {
//	
//	@Autowired
//	private EntityManagerFactory entityManagerFactory;
//
//	@Autowired
//	private RoleDao roleDao;
//	
//	@Autowired
//	private RoleActionDao roleActionDao;
//	
//	@Autowired
//	private MenuDao menuDao;
//	
//	
//	public List<Role> getAllRole() {
//		return (List<Role>) roleDao.findAll();
//	}
//	
//	@Transactional
//	public void saveRoleMenuAction(Long roleId, String roleActions){
//		if(roleActions!=null && !"".equals(roleActions)){
//			String actions[] = roleActions.split(";");
//			for(int i=0;i<actions.length;i++){
//				String menuId = actions[i].substring(0,actions[i].indexOf(":"));
//				Menu menu = this.menuDao.findOne(Long.parseLong(menuId));
//				if(menu==null){
//					continue;
//				}
//				String newActions = actions[i].substring(0, actions[i].length()).replaceAll(menuId, menu.getMenuNameEn());
//				
//				String sql = "select t from RoleAction t where roleId="+ roleId +" and menuId="+ menuId;
//				Query query = entityManagerFactory.createEntityManager().createQuery(sql);
//				List list = query.getResultList();
//				RoleAction auth = null;
//				if(list.size()>0){
//					auth = (RoleAction) list.get(0);
//					if(auth!=null){
//						auth.setActions(newActions);
//						this.roleActionDao.save(auth);
//					}
//				}else{
//					auth = new RoleAction();
//					auth.setMenuId(Long.parseLong(menuId));
//					auth.setRoleId(roleId);
//					auth.setActions(newActions);
//					this.roleActionDao.save(auth);
//				}
//				
//			}
//		}
//	}
//	
//	
//}
