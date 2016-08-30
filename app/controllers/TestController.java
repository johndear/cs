package controllers;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Module;

import base.SecureController;
import play.mvc.Controller;
import test.Hello;

public class TestController extends Controller{
	
	// 动态注入
    public static void index() throws InstantiationException, IllegalAccessException, ClassNotFoundException {
    	Injector injector = Guice.createInjector(((Module)Class.forName("test.MyModule").newInstance()));
    	Hello h = injector.getInstance(Hello.class);
    	h.sayhello();
    }

}
