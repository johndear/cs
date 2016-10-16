package jobs;

import play.i18n.Lang;

import java.lang.reflect.Method;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import controllers.CRUD;
import controllers.CRUD.For;
import annotation.Action;
import annotation.Menu;
import annotation.Rest;
import models.Event;
import models.EventType;
import models.TAction;
import models.TResource;
import play.Logger;
import play.Play;
import play.classloading.ApplicationClasses.ApplicationClass;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.mvc.Controller;
import play.mvc.Router;
import play.test.Fixtures;

@OnApplicationStart
public class BootstrapJob extends Job {

	@Override
	public void doJob() throws Exception {
		Lang.set("zh");//设置为中文  
		
//		Fixtures.deleteAllModels();
//		Fixtures.loadModels("data-" + Lang.get() + ".yml");

		Logger.info("ran BootstrapJob, %s events loaded, %s types loaded", Event.count(), EventType.count());
		
		// 生成国际化配置
		i18nConfigGenerator.generate();
		
		System.out.println("=============== 初始化系统权限数据开始  ===================");
		
		// 发布rest服务
		registerRoute();
		registerMenu();
		registerAction();
		
		System.out.println("=============== 已加载完系统权限数据  ===================");
		
	}
	
	private static void registerRoute() {
		List<ApplicationClass> clazzes = Play.classes.getAssignableClasses(Controller.class);
		for (ApplicationClass applicationClass : clazzes) {
			System.out.println(applicationClass.name);
			Rest rest = applicationClass.javaClass.getAnnotation(Rest.class);
			if(rest!=null){
				Method[] methods = applicationClass.javaClass.getMethods();
				for (Method method : methods) {
					Rest methodRest = method.getAnnotation(Rest.class);
					if(methodRest!=null){
						String reqUrl = (Play.ctxPath + "/"+(StringUtils.isNotEmpty(rest.url()) ? rest.url():"")+"/"+methodRest.url()).replace("//", "/");
						System.out.println(method.getName() + "===" +methodRest.method().name() + "==="+ reqUrl);
						Router.addRoute(methodRest.method().name(), reqUrl, applicationClass.name+"."+method.getName());
					}
					
				}
				
			}
        }
	}
	
	private static void registerMenu() {
		List<ApplicationClass> clazzes = Play.classes.getAssignableClasses(Controller.class);
		for (ApplicationClass applicationClass : clazzes) {
			System.out.println(applicationClass.name);
			Menu menu = applicationClass.javaClass.getAnnotation(Menu.class);
			CRUD.For foran = applicationClass.javaClass.getAnnotation(CRUD.For.class);
			if(menu==null && foran == null){
			}else{
				if(menu!=null && StringUtils.isEmpty(menu.code()) && foran==null){
					System.out.println("请指定菜单code" + applicationClass.name);
					continue;
				}
				String menuCode = StringUtils.isNotEmpty(menu.code()) ? menu.code() : foran.value().getSimpleName(); 
				TResource tresource = TResource.find("code=?", menuCode).first();
				if(tresource!=null){
					System.out.println(tresource.name+ " 已经存在.");
				}else{
					TResource resource = new TResource();
					resource.name = menu.name();
					resource.code = menuCode;
					resource.parent = null;
					resource.save();
				}
			}
				
        }
	}
	
	private static void registerAction() {
		List<ApplicationClass> clazzes = Play.classes.getAssignableClasses(Controller.class);
		for (ApplicationClass applicationClass : clazzes) {
			System.out.println(applicationClass.name);
				Method[] methods = applicationClass.javaClass.getMethods();
				for (Method method : methods) {
					Action action = method.getAnnotation(Action.class);
					if(action!=null && !"".equals(action.code())){
						TAction tAction = TAction.find("name=?", action.code()).first();
						if(tAction!=null){
							System.out.println(tAction.name+ " 已经存在.");
						}else{
							tAction = new TAction();
							tAction.title = action.name();
							tAction.name = action.code();
							tAction.save();
						}
					}
					
				}
				
        }
	}
	
}