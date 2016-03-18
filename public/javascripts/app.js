$(function () {
    "use strict";

    $.ajaxSetup({
        error: function (jqXHR, textStatus, errorThrown) {
            Messenger().post({
                type: "error",
                message: jqXHR.status+" : "+errorThrown,
                hideAfter: 4
            });
        }
    });

    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
        theme: 'ice',
        hideAfter: 4
    };

    var mainContent = $('#main');

    //ajax加载内容区域
    function _LoadAjaxContent(url) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function (data, status, jqXHR) {
                var contentType = jqXHR.getResponseHeader("Content-Type");
                if (contentType.indexOf("application/json;") == 0) {
                    var dt = $.parseJSON(data);
                    if (dt.redirect) {
                        window.location.hash = dt.redirect;
                    }
                    if (dt.success && dt.message) {
                        Messenger().post({
                            message: dt.message,
                            hideAfter: 4
                        });
                    }
                    if (!dt.success && dt.errors) {
                        Messenger().post({
                            type: "error",
                            message: dt.errors.join("<br>"),
                            hideAfter: 4
                        });
                    }
                } else {
                    mainContent.html(data);
                    $("[data-toggle='tooltip']",mainContent).tooltip();
                }
            },
            dataType: "html"
        });
    }

    //全局a标签设置为ajaxLink时自动加载
    $("body").on("click", "a.ajaxLink", function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        $("li .active").removeClass("active");
        $(this).parent().addClass("active");
        if (window.location.hash == "#" + href) {
            _LoadAjaxContent(href);
        } else if(href != "#"){
            window.location.hash = href;
        }
    }).on("submit", "form.ajaxForm", function (e) {
        e.preventDefault();
        var element = $(this);
        var cf = element.attr("confirm");
        if (cf && !confirm(cf)) {
            return;
        }
        element.triggerHandler("submit.before");
        var data = element.serialize();
        var files = element.find("[type=file]");
        if (files.length > 0) {
            data = new FormData();
            files.each(function () {
                for (var i = 0, file; file = this.files[i]; ++i) {
                    data.append(this.name, file);
                }
            });
            $.each(element.serializeArray(), function () {
                data.append(this.name, this.value);
            });
        }
        $.ajax({
            url: this.action,
            async: false,
            data: data,
            processData: (!files.length),
            type: this.method,
            contentType: (files.length ? false : "application/x-www-form-urlencoded"),
            success: function (data, textStatus, jqXHR) {
                var contentType = jqXHR.getResponseHeader("Content-Type");
                element.triggerHandler("submit.success", data);
                if (contentType.indexOf("application/json;") == 0) {
                    var dt = $.parseJSON(data);
                    if (dt.redirect) {
                        if (window.location.hash == "#" + dt.redirect) {
                            _LoadAjaxContent(dt.redirect);
                        } else {
                            window.location.hash = dt.redirect;
                        }
                    }
                    if (dt.success && dt.message) {
                        Messenger().post({
                            message: dt.message,
                            hideAfter: 4
                        });
                    }
                    if (!dt.success && dt.errors) {
                        Messenger().post({
                            type: "error",
                            message: dt.errors.join("<br>"),
                            hideAfter: 4
                        });
                    }
                }
            }
        });
        return false;
    });

    //绑定hashchange事件
    if ("onhashchange" in window) {
        window.onhashchange = function () {
            if (window.location.hash) {
                _LoadAjaxContent(window.location.hash.substring(1));
            }
        }
    }

    //设置Pace触发ajax类型
    Pace.options.ajax.trackMethods.push("POST");
    Pace.options.ajax.ignoreURLs =  ['/org/tree','org/user','/org/dep','publiccomponent/searchgroup'];

    //Pace触发main区域遮罩
    Pace.on("restart", function () {
        this.fadeIn();
    }, $(".overlay"));

    Pace.on("done", function () {
        this.fadeOut();
    }, $(".overlay"));

    //初始化加载
    if (window.location.hash != "") {
        _LoadAjaxContent(window.location.hash.replace("#",""));
    } else {
        $("ul.sidebar-menu li:first a").click();
    }
});
