package test;

import com.google.inject.Binder;
import com.google.inject.Module;

public class MyModule2 implements Module {

	@Override
	public void configure(Binder arg0) {
		// TODO Auto-generated method stub
		arg0.bind(Hello.class).to(HelloImpl2222.class);
	}

}
