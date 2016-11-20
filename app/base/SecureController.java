package base;

import models.Customer;
import models.Principal;
import models.entity.CustomerModel;

public class SecureController extends BaseController{
	
	public static Principal principal = new Principal();
	static{
		 //todo取session中的用户信息并用于页面显示
        principal.deptId =1;
        principal.portalCode="ukf1";
        principal.nickname="u客服1";
        principal.username="ukf1";
        principal.userId=3005L;
	}
	
	public static Customer getCurrent(){
		CustomerModel customer = CustomerModel.find("customerId=?", principal.userId).first();
		Customer customerDto = new Customer();
		customerDto.id= customer.getCustomerId();
		customerDto.username = customer.getPortalCode();
		customerDto.isSelf = false;
		// 如果是u客服，该班次已经退出，是不能再上班的。要设置为null
		customerDto.scheduleId = 1L;
		customerDto.portalCode = customer.getPortalCode();
		return customerDto;
	}
	
	

}
