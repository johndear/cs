package utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReflectUtils {
	
	public static Method[] getBeanPublicStaticMethods(Class cl){
		List<Method> methodList = new ArrayList<Method>();
        for(; cl != null; cl = cl.getSuperclass()) {
        	Method[] methods = cl.getDeclaredMethods();
            for(Method method : methods) {
                if (!Modifier.isPublic(method.getModifiers())
                        || !Modifier.isStatic(method.getModifiers())) {
                    continue;
                }

                methodList.add(method);
            }
        }

        return methodList.toArray(new Method[]{});
    }

}
