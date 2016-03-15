package base;

import java.util.HashMap;
import java.util.Map;

import play.mvc.Controller;
import play.mvc.Http;

public class BaseController extends Controller{

	void renderSuccess(Object data){
		Result result =new Result(data);
		renderJSON(result);
	}
	
	void renderFailure(String errorMsg){
		Result result =new Result("", errorMsg);
		renderJSON(result);
	}
	
	void renderFailure(String errorCode, String errorMsg){
		Result result =new Result(errorCode, errorMsg);
		renderJSON(result);
	}
	
	
}

@SuppressWarnings("unused")
class Result{
	
	private boolean success;
	private Object data;
	private String errorCode;
	private String errorMsg;
	
	public Result(Object data){
		this.success = true;
		this.data = data;
	}
	
	public Result(String errorCode, String errorMsg){
		this.success = false;
		this.errorCode = errorCode;
		this.errorMsg = errorMsg;
	}
	
}