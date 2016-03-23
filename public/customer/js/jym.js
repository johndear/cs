/**
 * 功能描述：用户端界面-交易猫相关
 * <p>
 * 版权所有：优视科技
 * </p>
 * <p>
 * 未经本公司许可，不得以任何方式复制或使用本程序任何部分
 * </p>
 * 
 * @author <a href="mailto:ljh104230@ucweb.com">廖金洪</a>
 * @version 交易猫接入版本 create on: 2015-12-15
 */
JymService = ({
	
	/**
	 * 各种文案消息
	 */
   // demo -- 使用
	messages : {
		title : templateProp['chat_title'],
		welcome : templateProp['chat_welcome'],
		//notlogin : '您是临时游客，退出咨询后聊天记录会丢失，建议您<a href="javascript:void(0);" onclick="JymService.login();">登录</a>帐号后再咨询。',
		//notlogin : '您是临时游客，退出咨询后聊天记录会丢失，建议您<a href="'+location.origin + '/csos/customer/api/jym/login?dialogId='+$('#dialogId').val()+'&uid=' + $('#userId').val()+'&csosUrl='+encodeURIComponent(location.href) +'">登录</a>帐号后再咨询。',
		notlogin:  formatLink(templateProp['chat_login'],"<a href='"+ location.origin + "/csos/customer/api/jym/login?dialogId="+$('#dialogId').val()+"&uid="+$('#userId').val()+"&csosUrl="+encodeURIComponent(location.href)+"'>","</a>"),
		connecting : templateProp['chat_conneting'],
		connected : templateProp['apply_connected'],
		evaluation : '',
		wait : templateProp['chat_wait']
	},
	
	
	
	/**
	 * 是或否
	 */
	yesOrno : {
		Y : 'Y',
		N : 'N'
	},

	/**
	 * 交易猫初始化信息
	 */
	init : function() {
		if (sys == jym) {
			//重置交易猫文案信息
			messages = JymService.messages;
			//交易猫客服，客户头像
			DEFAULT_USER_AVATAR = window['uae_image_root'] + '/customer/images/user_avatar_'+sys+'.png',
		    DEFAULT_SERVICE_AVATAR = window['uae_image_root'] + '/customer/images/service_avatar_'+sys+'.png';
			//修改交易猫评价图标
			$('#evaluate_score').removeClass("evaluate-dialog-score");
			$('#evaluate_score').addClass("evaluate-dialog-score-jym");
			$('.evaluate-dialog-header').addClass("evaluate-dialog-header-"+sys);
			$('.evaluate-dialog-header').removeClass("evaluate-dialog-header");
			
			// 用户未登录提示信息
			if (!islogin) {
				chatroom.sendTips(messages.notlogin);
			}
			
			$('#chat_title').html(messages.title);
		}
	},

	/**
	 * 交易猫登录
	 */
	login : function() {
		var csosUrl = encodeURIComponent(location.href);
    	$.ajax( {
            url : location.origin + '/csos/customer/api/jym/login',
            data : {
            	'dialogId' : $('#dialogId').val(),
                'uid' : $('#userId').val(),
                'csosUrl' : csosUrl
            },
            type:'post',
            dataType:'json',
            success : function(data) {
                
            }
        });
	},
	
	/**
	 * 用户中心
	 */
	userCenter : function(){
		var csosUrl = encodeURIComponent(location.href);
    	location.href = window['jym_user_url'] + '?csosUrl='+csosUrl;//跳转页面
	},
	
	
});

JymService.init();
