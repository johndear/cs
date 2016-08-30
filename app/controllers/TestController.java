package controllers;

import com.google.inject.Guice;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Module;
import com.google.inject.Provides;
import com.google.inject.name.Named;

import base.AppModule;
import base.SecureController;
import play.modules.guice.InjectSupport;
import play.mvc.Before;
import play.mvc.Controller;
import test.Hello;

@InjectSupport
public class TestController extends Controller{
	
	@javax.inject.Inject
	@Named(value="impl1")
	static Hello h1;
	
	@javax.inject.Inject
	@Named(value="impl2")
	static Hello h2;
	
	// 动态注入
//	@Provides
    public static void index() throws InstantiationException, IllegalAccessException, ClassNotFoundException {
//    	Injector injector = Guice.createInjector(((Module)Class.forName("test.MyModule").newInstance()));
//    	Hello h = injector.getInstance(Hello.class);
    	
    	h1.sayhello();
    	h2.sayhello();
    }

}
