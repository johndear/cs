/*!
 * date日期类型转换公用方法
 */

/**
 * Date=> dateStr
 * 扩展Date的format方法，如：startTime.format("yyyy-MM-dd HH:mm:ss")
 * 
 */
Date.prototype.format = function(fmt)   
{   
	var o = {           
	  "M+" : this.getMonth()+1, //月份           
	  "d+" : this.getDate(), //日           
	  "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
	  "H+" : this.getHours(), //小时           
	  "m+" : this.getMinutes(), //分           
	  "s+" : this.getSeconds(), //秒           
	  "q+" : Math.floor((this.getMonth()+3)/3), //季度           
	  "S" : this.getMilliseconds() //毫秒           
	  };  
	
	var week = {           
	  "0" : "/u65e5",           
	  "1" : "/u4e00",           
	  "2" : "/u4e8c",           
	  "3" : "/u4e09",           
	  "4" : "/u56db",           
	  "5" : "/u4e94",           
	  "6" : "/u516d"          
	  };    
	
	  if(/(y+)/.test(fmt)){           
	      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
	  }           
	  if(/(E+)/.test(fmt)){           
	      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
	  }           
	  for(var k in o){           
	      if(new RegExp("("+ k +")").test(fmt)){           
	          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
	      }           
	  }           
	  return fmt; 
} 

/** 
* Date=> dateStr（日期格式化）
* @param l long值 
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss 
*/ 
function getFormatDate(date, pattern) { 
	if (date == undefined) { 
		date = new Date(); 
	} 
	if (pattern == undefined) { 
		pattern = "yyyy-MM-dd hh:mm:ss"; 
	} 
	return date.format(pattern); 
}

/** 
* Date=> dateStr（是否显示完整日期）
* 为true时, 格式如"2000-03-05 01:05:04" 
* 为false时, 格式如 "2000-03-05" 
*/ 
function getSmpFormatDate(date, isFull) { 
	var pattern = ""; 
	if (isFull == true || isFull == undefined) { 
		pattern = "yyyy-MM-dd HH:mm:ss"; 
	} else { 
		pattern = "yyyy-MM-dd"; 
	} 
	return getFormatDate(date, pattern); 
} 

/** 
 * dateStr=> Date
 * 如：parseDate("2014-9-12 16:12:12");
 */  
function parseDate(dateStr){
	if(!dateStr || dateStr.length==0){
		return new Date();
	}
	
	if(dateStr && dateStr.length ==10){
		dateStr = dateStr +" 00:00:00";
	}
	
   	 var    strArray=dateStr.split(" ");   
   	 var    strDate=strArray[0].split("-");
   	 var    date = '';
   	 if(strArray[1]){
   		 var strTime=strArray[1].split(":");   
   		 date =new Date(strDate[0],(strDate[1]-parseInt(1)),strDate[2],strTime[0],strTime[1],strTime[2]);  
   	 }else{
   		 date =new Date(strDate[0],(strDate[1]-parseInt(1)),strDate[2]);
   	 }
     return date;
} 

/** 
* getCurrentDate 
* 获取当前日期字符串 
* 为true时, 格式如"2000-03-05 01:05:04" 
* 为false时, 格式如 "2000-03-05" 
*/ 
function getSmpFormatNowDate(isFull) { 
	return getSmpFormatDate(new Date(), isFull); 
} 

/** 
* long值=> dateStr（日期格式化）
* pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss 
*/ 
function getFormatDateByLong(long, pattern) { 
	return getFormatDate(new Date(long), pattern); 
} 

/** 
* long值=> dateStr（是否显示完整日期）
* 为true时, 格式如"2000-03-05 01:05:04" 
* 为false时, 格式如 "2000-03-05" 
* 默认格式：yyyy-MM-dd 
*/ 
function getSmpFormatDateByLong(long, isFull) { 
	return getSmpFormatDate(new Date(long), isFull); 
} 

// 获取服务器当前时间
function getServerTime(){
    var xmlHttp = false;
	try {
		xmlHttp = new XMLHttpRequest();
	}catch(e) {
		var IEXHRVers =["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
		for (var i=0, len=IEXHRVers.length; i< len;i++) {
			try {
				xmlHttp = new ActiveXObject(IEXHRVers[i]);
			}catch(e) {
				continue;
			}
		}
	}
     
    xmlHttp.open("HEAD",  "/csos/customer/CustomersController/getServerTime?rnd=" + new Date().valueOf(), false);
    xmlHttp.setRequestHeader("Range", "bytes=-1");
    xmlHttp.send(null);
    
    // 从response header中,获取服务器当前时间
 // 从response header中,获取用户端时区标准时间
    var ServerDate = xmlHttp.getResponseHeader("ServerDate");
    if(!ServerDate){
    	ServerDate = new Date();
    }else{
    	ServerDate = parseDate(ServerDate);
    }
    return ServerDate;
}

// 获取本地时区时间
function getLocalTime(){
	// 当地时区(比如北京为东八区为8,美国华盛顿为西5区为-5)
	var timezone = (new Date().getTimezoneOffset()/60)*(-1);
	
	var xmlHttp = false;
	try {
		xmlHttp = new XMLHttpRequest();
	}catch(e) {
		var IEXHRVers =["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
		for (var i=0, len=IEXHRVers.length; i< len;i++) {
			try {
				xmlHttp = new ActiveXObject(IEXHRVers[i]);
			}catch(e) {
				continue;
			}
		}
	}
     
    xmlHttp.open("HEAD",  "/csos/customer/CustomersController/getLocalTime?timeZoneOffset=" + timezone + "&rnd="+ new Date().valueOf(), false);
    xmlHttp.setRequestHeader("Range", "bytes=-1");
    xmlHttp.send(null);
    
    // 从response header中,获取用户端时区标准时间
    var LocalDate = xmlHttp.getResponseHeader("LocalDate");
    if(!LocalDate){
    	LocalDate = new Date();
    }else{
    	LocalDate = parseDate(LocalDate);
    }
    return LocalDate;
}

// 用户所在时区
var timezone = (new Date().getTimezoneOffset()/60)*(-1);

// liusu 本地计时器，客服北京时间、用户标准时间计时表（避免重复向后台发送请求）
var serverTimer = null;
var serverDate = null;
var localDate = null;
var serverTime = getServerTime().getTime();
var localTime = timezone == 8 ? serverTime : getLocalTime().getTime();
function serverTimedCount(){
	serverTime = serverTime + 1000;
	localTime = timezone == 8 ? serverTime : localTime + 1000;
	serverDate = parseDate(getFormatDateByLong(serverTime, 'yyyy-MM-dd HH:mm:ss'));
	localDate = parseDate(getFormatDateByLong(localTime, 'yyyy-MM-dd HH:mm:ss'));
//	console.log(serverTime +"==="+ localTime);
	
	serverTimer = setTimeout(serverTimedCount, 1000);
}
serverTimedCount();

/**
 * 测试
 */
//alert(getSmpFormatDate(new Date(1279849429000), true)); 
//alert(getSmpFormatDate(new Date(1279849429000),false)); 
//alert(getSmpFormatDateByLong(1279829423000, true)); 
//alert(getSmpFormatDateByLong(1279829423000,false)); 
//alert(getFormatDateByLong(1279829423000, "yyyy-MM")); 
//alert(getFormatDate(new Date(1279829423000), "yy-MM")); 
//alert(getFormatDateByLong(1279849429000, "yyyy-MM hh:mm"));

 