
    //https://developer.mozilla.org/en-US/docs/Web/API/notification

    /**
     * 音频提醒，H5 的audio标签
     * @type {document}
     */
    var doc = document;
    var audio = doc.createElement('audio');
    audio.src = 'http://g.tbcdn.cn/crm/static/0.1.0/audio/1.mp3';
    //audio.src = '../public/cs/audio/notify.wma';
    audio.style.display = "none";


    /**
     * 桌面通知。延时消失
     * @param title
     * @param options
     */
    function showNotify(title, options) {
        // 音频提醒
        audio.play();
        // 桌面通知
        var notify = new Notification(title, options);
        setTimeout(function () {
            notify.close();
        }, timeOut100)
    }

    /**
     * H5 通知对象
     * @param title 标题
     * @param option 内容
     * @constructor
     */
    var Notifications = function(title, option) {
    	var icon = '../public/images/service_avatar.png';
    	if(deptId && deptId == 2){
    		icon = '../public/images/service_avatar_jym.png';
    	}
        // 判断浏览器是否支持Notification
        if (!("Notification" in window)) {
            return;
        }
        // 组装参数
        var options = {
            dir: 'rtl',
            icon: icon,
            body: subStr(option.body, 100)
        };
        // 浏览器已经授权桌面通知
        if (Notification.permission === "granted") {
            showNotify(title, options);
        }
        // 若没授权，提示用户是否要授权
        else {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    showNotify(title, options);
                }
            });
        }
    }

    /**
     * 字符串过长处理
     * @param str
     * @param len
     * @returns {*}
     */
    function subStr (str, len) {
        if (str.length <= len) {
            return str;
        } else {
            return str.substring(str, len) + '...';
        }
    }

