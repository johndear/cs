package utils.classloader;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

public class Main {
	
	public static void main(String[] args) throws Exception {
		String path = "D:\\A-Github\\cs\\app\\utils\\LocalClass.class";
		ManageClassLoader mc = new ManageClassLoader();
		while (true) {
			Class c = mc.loadClass(path);
			Object o = c.newInstance();
			java.lang.reflect.Method m = c.getMethod("getName");
			m.invoke(o);
			System.out.println(c.getClassLoader());
			Thread.sleep(5000);
		}
	}


}
