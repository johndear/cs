package annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import utils.Method;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface Rest {
    //接口名称
    String name() default "";
    //接口地址
    String url() default "";
    //接口对外调用请求类型
    Method method() default Method.GET;
}
