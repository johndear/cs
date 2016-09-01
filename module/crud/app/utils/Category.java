package utils;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 功能描述：
 *
 * @author <a href="mailto:guohua@ucweb.com">郭华</a>
 * @version 1.0.0
 * @since 1.0.0
 * create on: 2014/6/27 23:18
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface Category {
    //接口名称
    String value();
    //用法
    String usage() default "";
    //接口对外调用请求类型，当请求类型为GET的时候会忽略签名验证
    Methods method() default Methods.POST;
}
