define(function (require, exports, module) {
    var fname = "";
    var upload = {
        init:function(){
            var upBtn = $(".upload");
            var fileBtn = $("#file");
            var formBox = $("#formFile");
            //
            upBtn.on("click",function(){
                upload.tipFile();
            });
            //
            if(window.isEndstatus){
                require("./notice").news(langconfig.unsendPic, true);
            }else{
                formBox.on("change","#file",function(){
                    upload.selectFile();
                });
            }
        },
        tipFile: function(){
            if(window.isEndstatus){
                $("#formFile").find("#file").remove();
                require("./notice").news(langconfig.unsendPic, true);
            }
        },
        selectFile: function(){
        	var self = upload;
            fname =$("#formFile").find("#file").val();
            var reg = /\.(jpg|jpeg|png|tiff|tif|ico|bmp|gif)$/ig;
            if (fname == "") {
                return;
            }
            if(reg.test(fname)){ //文件名后缀正确
                self.submitFile(window.ROOT+'/http/connectorcommon/media/upload');
            }else{
                require("./render").kfRender(selfname,langconfig.upimage);
            }
        },
        submitFile: function(src){
            var self = upload;
            $("#formFile").attr("action",src).submit();
            //
            $("#hidden_frame").bind("load",function(){
                var res = $.parseJSON($("#hidden_frame").contents().find("body").text());
                if(res.code === "0"){
                    var file_id = res.data.downloadUrl;
                    window.myMediaId = res.data.mediaId;
                    self.sendSuccessMessage(file_id);
                    $("#chatlist").find(".sending").remove();
                    //
                    var thumbImg = '<img class="outerimg" alt="'+self.getFileName(fname)+'" src="'+file_id
+'?thumb=75x75" width="30" height="30" /> ';
                    var picStr = '<a class="outerimgbox" target="_blank" title="'+langconfig.lookOrigin
+'" href="'+file_id+'">'+thumbImg+'</a>';
                    require("./render").selfRender(selfname,picStr);
                }else if(res.code === "501"){//文件过大
                    $("#chatlist").find(".sending").remove();
                    require("./render").selfRender(selfname,langconfig.sendpicSizeError);
                    self.sendFailMessage(langconfig.sendpicSizeError);
                }else{//这里应该是更多的错误码
                    $("#chatlist").find(".sending").remove();
                    require("./render").selfRender(selfname,langconfig.sendpicError);
                    self.sendFailMessage(langconfig.sendFail);
                }
                $(this).unbind("load");
            });
            //这个是为了解决ie下选过的文件再选不再触发file的change方法
            $("#formFile").find("#file").replaceWith('<input id="file" type="file" name="userfile" title
="" data-title="'+(new Date().getTime())+'">');
        },
        sendSuccessMessage : function(file_id) {
            var currentTime = +new Date();
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/stateful/send",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" : {
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "content":{
                        "createTime" : currentTime,
                        "msgType" : "image",
                        "mediaId":myMediaId,
                        "picUrl":file_id,
                        "picName":upload.getFileName(fname),
                        "msgId" : currentTime
                    }
                }
            }
            require("./talk").talk.send(json);
        },
        sendFailMessage : function(msg) {
            var currentTime = +new Date();
            var json = {
                "header" :{
                    "requestId" : (new Date() - 0).toString(32),
                    "requestURI" : "/stateful/send",
                    "prefix" :{
                        "appId" : "000001001",
                        "version" : "1",
                        "platform" : plat
                    }
                },
                "body" : {
                    "sessionId":sessionId,
                    "fromUserId":userid,
                    "content":{
                        "createTime" : currentTime,
                        "msgType" : "text",
                        "content":msg,
                        "msgId" : currentTime
                    }
                }
            }
            require("./talk").talk.send(json);
        },
        getFileName:function(path){
            var pos1 = path.lastIndexOf('/');
            var pos2 = path.lastIndexOf('\\');
            var pos  = Math.max(pos1, pos2);
            if( pos<0 )
                return path;
            else
                return path.substring(pos+1);
        }
    };
    exports.upload = upload;
});