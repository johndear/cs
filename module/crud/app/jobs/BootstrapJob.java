package jobs;

import play.i18n.Lang;

import java.lang.reflect.Method;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import annotation.Action;
import annotation.Rest;
import models.Event;
import models.EventType;
import models.TAction;
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
		
		// 发布rest服务
		registerRoute();
		
		registerAction();
		
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