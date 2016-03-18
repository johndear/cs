package base;

import play.Logger;
import play.db.jpa.JPA;
import play.mvc.Catch;
import play.mvc.Controller;

public class BaseController extends Controller{

	protected static void renderSuccess(Object data){
		Result result =new Result(data);
		renderJSON(result);
	}
	
	protected static void renderFailure(String errorMsg){
		Result result =new Result("", errorMsg);
		renderJSON(result);
	}
	
	protected static void renderFailure(String errorCode, String errorMsg){
		Result result =new Result(errorCode, errorMsg);
		renderJSON(result);
	}
	
	@Catch(value = Exception.class)
	protected static void catchUncheckException(Exception e) {
		Logger.error(e.getMessage());
		rollback();
		renderFailure("系统异常");
	}
	
	private static void rollback(){
		if(JPA.em().getTransaction().isActive()){
			JPA.em().getTransaction().rollback();
		}
	}
	
	@SuppressWarnings("unused")
	public static class Result{
		
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
	
}

