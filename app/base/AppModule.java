package base;

import com.google.inject.Binder;
import com.google.inject.Module;
import com.google.inject.name.Names;

import test.Hello;
import test.HelloImpl1111;
import test.HelloImpl2222;

public class AppModule implements Module {

	@Override
	public void configure(Binder arg0) {
		// TODO Auto-generated method stub
		arg0.bind(Hello.class).annotatedWith(Names.named("impl1")).to(HelloImpl1111.class);
		arg0.bind(Hello.class).annotatedWith(Names.named("impl2")).to(HelloImpl2222.class);
	}

}
