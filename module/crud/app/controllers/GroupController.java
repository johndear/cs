package controllers;

import java.lang.reflect.Method;

import annotation.Menu;
import models.TGroup;
import play.classloading.enhancers.ControllersEnhancer.ControllerInstrumentation;
import play.mvc.ActionInvoker;
import play.mvc.With;

@Menu(name="用户组管理", category="权限管理")
@CRUD.For(TGroup.class)
@With(Secure.class)
public class GroupController extends CRUD {

	@Check("group")
	public static void list(int page, String search, String searchFields, String orderBy, String order) {
		ControllerInstrumentation.initActionCall();
		
		try {
			Method method = CRUD.class.getDeclaredMethod("_list", new Class[]{int.class, String.class, String.class,String.class,String.class});
			ActionInvoker.invokeControllerMethod(method, new Object[]{page, search, searchFields, orderBy, order});
			render("CRUD/list.html");
		} catch (Exception e) {
			ControllerInstrumentation.stopActionCall();
			e.printStackTrace();
		}
		
	}
	
}
