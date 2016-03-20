package base;

import play.modules.guice.GuiceSupport;
import com.google.inject.Guice;
import com.google.inject.Injector;

/**
 *	默认只支持controller、job、mailer,如需支持更多其他类需要添加@injectsupport注解 
 */
public class GuicyConfigure extends GuiceSupport {
    protected Injector configure() {
        Injector injector = Guice.createInjector();
        return injector;
    }
}