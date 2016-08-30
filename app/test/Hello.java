package test;

import com.google.inject.ImplementedBy;

@ImplementedBy(value=HelloImpl1111.class)
public interface Hello {

	void sayhello();
}
