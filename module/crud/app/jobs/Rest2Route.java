package jobs;

import java.lang.reflect.Method;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import play.Play;
import play.classloading.ApplicationClasses;
import play.classloading.ApplicationClasses.ApplicationClass;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.mvc.Controller;
import play.mvc.Router;
import play.mvc.Router.Route;
import utils.Rest;

public class Rest2Route {

	public static void publish() {
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
	
}