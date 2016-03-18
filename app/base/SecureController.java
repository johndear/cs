package base;

import models.CustomerDTO;
import models.Principal;
import models.entity.Customer;

public class SecureController extends BaseController{
	
	public static Principal principal = new Principal();
	public static CustomerDTO customerDto = null;
	static{
		 //todo取session中的用户信息并用于页面显示
        principal.deptId =1;
        principal.portalCode="u001";
        principal.nickname="李四";
        principal.username="李四";
        principal.userId=1L;
	}
	
	/**
	 * 
	 * 功能描述：
	 *	这里需要将登陆信息转换成customer对象
	 * @return 
	 * @author <a href="mailto:caily@ucweb.com">刘苏 </a>
	 * @version 在线客服二期
	 * create on: 2016年3月15日
	 */
	public static CustomerDTO getCurrent(){
		Customer customer = Customer.find("customerId=?", principal.userId).first();
		customerDto = new CustomerDTO();
		customerDto.id= customer.getCustomerId();
		customerDto.username = customer.getPortalCode();
		customerDto.isSelf = false;
		customerDto.scheduleId = 0L;
		customerDto.portalCode = customer.getPortalCode();
		return customerDto;
	}
	
	

}
