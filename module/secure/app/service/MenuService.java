//package com.it.j2ee.modules.permission.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.it.j2ee.modules.permission.dao.MenuDao;
//import com.it.j2ee.modules.permission.entity.Menu;
//
//@Component
//@Transactional
//public class MenuService {
//	
//	@Autowired
//	private MenuDao menuDao;
//	
//	public List<Menu> getAllMenu() {
//		return (List<Menu>) menuDao.findAll();
//	}
//}
