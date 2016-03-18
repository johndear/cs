	/*
	 * 获取工作台左侧传进的参数
	 * name：需获取的参数名
	 */
	function getUrlParam(name) {
	    var p, r = new RegExp('[?|&]' + name + '=([^&]*)(&|#|$)');
	    if (p = window.location.search.match(r)) {
	        return p[1];
	    }
	    return '';
	};

	/*
	 * 邮箱验证
	 */
	function isEmail(email){
		if(email.length > 50){
			return false;
		}
		var emailRegExp = /^([\w]+([\w-\.+]*[\w-]+)?)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i
		if (!emailRegExp.test(email)||email.indexOf('.')==-1){
			return false;
		}else{
			return true;
		}
	}

	/*
	 * 数字验证
	 */
	function isNumber(val) {
		if(val.length > 20){
			return false;
		}
		var re = new RegExp("^[0-9]*$");
		if(re.test(val)){
			return true;
		}
		return false;
	}

	/*
     * 空判断
     */
    function isNull(val){
    	if('' == val || undefined == val){
    		return true;
    	}else{
    		return false;
    	}
    }