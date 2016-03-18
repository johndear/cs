/**
 * 1、按照js列表顺序依次加载
 * 2、初始化dom时，如果需要调用js里面的函数，需要在onload=xxx()中调用（确保js加载完，否则调用不到）
 */
function loadJs() {
	
	// 初始化xmlHttp对象
	var xmlHttp = false;
	try {
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		var IEXHRVers = [ "Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP" ];
		for (var i = 0, len = IEXHRVers.length; i < len; i++) {
			try {
				xmlHttp = new ActiveXObject(IEXHRVers[i]);
			} catch (e) {
				continue;
			}
		}
	}

	// 发送post请求
	xmlHttp.open("POST", "/csos/customer/CustomersController/loadJs", false);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	xmlHttp.onreadystatechange = function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {
			// 动态添加<script>标签
			var head = document.head || document.documentElement;
			var jsVersionList = JSON.parse(xmlHttp.responseText);
			for ( var i in jsVersionList) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.async = false;
				script.src = jsVersionList[i];
				head.insertBefore(script, head.lastChild);
			}
	    }
	};
	
	// 参数传递
	xmlHttp.send("jsList="+ JSON.stringify(arguments) + "&rnd=" + new Date().valueOf());
}