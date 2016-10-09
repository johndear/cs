package utils.classloader;

/**
 * 默认提供的3种类加载器：JVM加载采用了双亲委派机制 -----------------bootstrap classLoader
 * -----------------extension classLoader -----------------app classLoader
 * 
 * @author Administrator
 *
 */
public class DynamicClassLoader extends ClassLoader {

	public Class<?> findClass(byte[] b) throws ClassNotFoundException {

		return defineClass(null, b, 0, b.length);
	}

}
