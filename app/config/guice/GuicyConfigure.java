package config.guice;

import play.modules.guice.GuiceSupport;
import com.google.inject.Guice;
import com.google.inject.Injector;

/**
 * 
 * 功能描述：引入guice，依赖注入
 * <p> 版权所有：优视科技
 * <p> 未经本公司许可，不得以任何方式复制或使用本程序任何部分 <p>
 * 
 * @author <a href="mailto:ljh104230@alibaba-inc.com">廖金洪</a>
 * @version 交易猫接入版本
 * create on: 2015年12月19日
 */
public class GuicyConfigure extends GuiceSupport {
    protected Injector configure() {
        Injector injector = Guice.createInjector();
        return injector;
    }
}