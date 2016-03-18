'use strict';

/*
Usage: <wysiwyg textarea-id="question" textarea-class="form-control"  textarea-height="80px" textarea-name="textareaQuestion" textarea-required ng-model="question.question" enable-bootstrap-title="true"></wysiwyg>
    options
        textarea-id             The id to assign to the editable div
        textarea-class          The class(es) to assign to the the editable div
        textarea-height         If not specified in a text-area class then the hight of the editable div (default: 80px)
        textarea-name           The name attribute of the editable div 
        textarea-required       HTML/AngularJS required validation
        textarea-menu           Array of Arrays that contain the groups of buttons to show Defualt:Show all button groups
        ng-model                The angular data model
        enable-bootstrap-title  True/False whether or not to show the button hover title styled with bootstrap  

Requires: 
    Twitter-bootstrap, fontawesome, jquery, angularjs, bootstrap-color-picker (https://github.com/buberdds/angular-bootstrap-colorpicker)

*/

angular.module('wysiwyg.module', ['colorpicker.module'])
    .directive('wysiwyg', function($timeout, wysiwgGui, $compile) {
        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                value: '=ngModel',
                textareaHeight: '@textareaHeight',
                textareaName: '@textareaName',
                textareaPlaceholder: '@textareaPlaceholder',
                textareaClass: '@textareaClass',
                textareaRequired: '@textareaRequired',
                textareaId: '@textareaId',
                textareaMenu: '@textareaMenu',
                saveEditorContent: '&',
                cancelEditing: '&'
            },
            replace: true,
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                //Create the menu system
                element.html(wysiwgGui.createMenu(attrs.textareaMenu));
                $compile(element.contents())(scope);
                
                var textarea = element.find('div.wysiwyg-textarea');

                scope.fonts = [
                    'Georgia',
                    'Palatino Linotype',
                    'Times New Roman',
                    'Arial',
                    'Helvetica',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Sans Unicode',
                    'Tahoma',
                    'Trebuchet MS',
                    'Verdana',
                    'Courier New',
                    'Lucida Console',
                    'Helvetica Neue'
                ].sort();

                scope.font = scope.fonts[6];

                scope.fontSizes = [{
                    value: '1',
                    size: '10px'
                }, {
                    value: '2',
                    size: '13px'
                }, {
                    value: '3',
                    size: '16px'
                }, {
                    value: '4',
                    size: '18px'
                }, {
                    value: '5',
                    size: '24px'
                }, {
                    value: '6',
                    size: '32px'
                }, {
                    value: '7',
                    size: '48px'
                }];

                scope.fontSize = scope.fontSizes[1];

                if (attrs.enableBootstrapTitle === "true" && attrs.enableBootstrapTitle !== undefined)
                    element.find('button[title]').tooltip({
                        container: 'body'
                    });

                textarea.on('keyup mouseup paste', function() {
                    scope.$apply(function readViewText() {
                        var html = textarea.html();
                        if (html == '<br>') {
                            html = '';
                        }
                        ngModelController.$setViewValue(html);
                    });
                });

                // 增加粘贴的功能
                textarea.on('paste', function (x) {
                    document.body.onpaste = function (e) { //浏览器提供的粘贴事件
                        var items = e.clipboardData.items;
                        for (var i = 0; i < items.length; ++i) {
                            var item = e.clipboardData.items[i];
                            if (items[i].kind == 'file' && items[i].type == 'image/png' && x.target == e.target) {
                                var fileReader = new FileReader();
                                fileReader.onloadend = function () {
                                    //获取图片的数据，格式是base64的格式
                                    var d = this.result;
                                    var img = document.createElement("img");
                                    img.src = d;
                                    var div = document.createElement("div");
                                    div.appendChild(img);
                                    // 插入光标处
                                    var range = window.getSelection().getRangeAt(0);
                                    range.insertNode(div);
                                };
                                fileReader.readAsDataURL(item.getAsFile());
                                break;
                                // Just get one
                            }
                        }
                    }
                });
                scope.isLink = false;

                //Used to detect things like A tags and others that dont work with cmdValue().
                function itemIs(tag) {
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        if (selection.startContainer.parentNode.tagName === tag.toUpperCase() || selection.endContainer.parentNode.tagName === tag.toUpperCase()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                //Used to detect things like A tags and others that dont work with cmdValue().
                function getHiliteColor() {
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        var style = $(selection.startContainer.parentNode).attr('style');
                        if (!angular.isDefined(style))
                            return false;

                        var a = style.split(';');
                        for (var i = 0; i < a.length; i++) {
                            var s = a[i].split(':');
                            if (s[0] === 'background-color')
                                return s[1];
                        }
                        return '#fff';
                    } else {
                        return '#fff';
                    }
                }

                textarea.on('click keyup focus mouseup', function() {
                    $timeout(function() {
                        scope.isBold = scope.cmdState('bold');
                        scope.isUnderlined = scope.cmdState('underline');
                        scope.isStrikethrough = scope.cmdState('strikethrough');
                        scope.isItalic = scope.cmdState('italic');
                        scope.isSuperscript = itemIs('SUP'); //scope.cmdState('superscript');
                        scope.isSubscript = itemIs('SUB'); //scope.cmdState('subscript');    
                        scope.isRightJustified = scope.cmdState('justifyright');
                        scope.isLeftJustified = scope.cmdState('justifyleft');
                        scope.isCenterJustified = scope.cmdState('justifycenter');
                        scope.isPre = scope.cmdValue('formatblock') == "pre";
                        scope.isBlockquote = scope.cmdValue('formatblock') == "blockquote";
                        scope.isOrderedList = scope.cmdState('insertorderedlist');
                        scope.isUnorderedList = scope.cmdState('insertunorderedlist');
                        scope.fonts.forEach(function(v, k) { //works but kinda crappy.
                            if (scope.cmdValue('fontname').indexOf(v) > -1) {
                                scope.font = v;
                                return false;
                            }
                        });

                        scope.fontSizes.forEach(function(v, k) {
                            if (scope.cmdValue('fontsize') === v.value) {
                                scope.fontSize = v;
                                return false;
                            }
                        });

                        scope.hiliteColor = getHiliteColor();
                        element.find('button.wysiwyg-hiliteColor').css("background-color", scope.hiliteColor);

                        scope.fontColor = scope.cmdValue('forecolor');
                        element.find('button.wysiwyg-fontcolor').css("color", scope.fontColor);

                        scope.isLink = itemIs('A');
                    }, 10);
                });

                // model -> view
                ngModelController.$render = function() {
                    textarea.html(ngModelController.$viewValue);
                };

                scope.format = function(cmd, arg) {
                    document.execCommand(cmd, false, arg);
                    // 修复点击按钮后保存没有更新ng-model的问题
                    var html = textarea.html();
                    if (html == '<br>') {
                        html = '';
                    }
                    ngModelController.$setViewValue(html);

                };

                scope.cmdState = function(cmd, id) {
                    return document.queryCommandState(cmd);
                };

                scope.cmdValue = function(cmd) {
                    return document.queryCommandValue(cmd);
                };

                scope.createLink = function() {
                    var input = prompt('Enter the link URL');
                    if (input && input !== undefined)
                        scope.format('createlink', input);
                };

                scope.insertImage = function() {
                    var input = prompt('Enter the image URL');
                    if (input && input !== undefined)
                        scope.format('insertimage', input);
                };

                scope.setFont = function() {
                    scope.format('fontname', scope.font);
                };

                scope.setFontSize = function() {
                    scope.format('fontsize', scope.fontSize.value);
                };

                scope.setFontColor = function() {
                    scope.format('forecolor', scope.fontColor);
                };

                scope.setHiliteColor = function() {
                    scope.format('hiliteColor', scope.hiliteColor);
                };

                scope.format('enableobjectresizing', true);
                scope.format('styleWithCSS', true);

                /**
                 * 增加全屏和退出全屏的方法 - add by chenzm 20141222
                 */
                scope.show_exit_fullscreen = false;
                /**
                 *  恢复只读模式，即：
                 *  在只读状态下全屏查看内容，退出全屏后需要还原内容的只读状态
                 */
                scope.recoverReadOnlyMode = false;
                var editorWrapper = element.find('div.ng-scope'),
                    windowH  = angular.element(window).height();
                scope.fullscreen = function(){
                    var menuWrapperH  = editorWrapper.children('div.wysiwyg-menu-wrapper').outerHeight(),
                        bottomMenuH   = editorWrapper.children('div.wysiwyg-bottom-menu').outerHeight();

                    scope.show_exit_fullscreen = true;
                    scope.recoverReadOnlyMode = false; // 通过点击工具栏的全屏按钮进来，不需要恢复只读状态
                    element.css({
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                        zIndex: 99999
                    });
                    angular.element('header').css('display', 'none');
                    angular.element('#' + scope.textareaId).css('height', windowH - menuWrapperH - bottomMenuH + 'px');
                };

                scope.exitfullscreen = function(){
                    scope.show_exit_fullscreen = false;
                    angular.element('header').css('display', 'block'); // todo 比较恶心，跟无关的页面元素耦合了，待改进
                    element.removeAttr('style');
                    if(scope.recoverReadOnlyMode) {
                        element.addClass('ng-hide'); // 恢复只读模式
                    }
                    editorWrapper.removeAttr('height');
                    angular.element('#' + scope.textareaId).css('height', scope.textareaHeight);
                };

                scope.saveEdited = function(){
                    scope.saveEditorContent();
                    $timeout(function(){
                        scope.exitfullscreen();
                    }, 500);
                };

                scope.cancelEdit = function(){
                    scope.exitfullscreen();
                    scope.cancelEditing(); // todo 判断是否需要
                }
            }
        };
    })
    .factory('wysiwgGui', function() {

        var defaultMenu = [
            ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
            ['font'],
            ['font-size'],
            ['font-color', 'hilite-color'],
            ['remove-format'],
            ['ordered-list', 'unordered-list', 'outdent', 'indent'],
            ['left-justify', 'center-justify', 'right-justify'],
            ['code', 'quote', 'paragragh'],
            ['link', 'image'],
            ['fullscreen']
        ];

        var getMenuStyles = function() {
            return '<style>' +
                '   .wysiwyg-btn-group-margin{  margin-right:5px; }' +
                '   .wysiwyg-select{ height:25px;margin-bottom:1px;padding:0;}' +
                '   .wysiwyg-colorpicker{ font-family: arial, sans-serif !important;font-size:16px !important; padding:2px 10px !important;}' +
                '   .wysiwyg-menu-wrapper{ background-color:#ecf0f1; }' +
                '   .wysiwyg-bottom-menu{ padding: 0 6px;vertical-align: middle;background-color: rgb(236, 240, 241); height: 40px; }' +
                '</style>';
        };

        var getMenuTextArea = function(padding_right) {
            return '<div id="{{textareaId}}" style="resize:vertical;height:{{textareaHeight || \'80px\'}}; overflow:auto" contentEditable="true" class="{{textareaClass}} wysiwyg-textarea" rows="{{textareaRows}}" name="{{textareaName}}" required="{{textareaRequired}}" placeholder="{{textareaPlaceholder}}" ng-model="value"></div>';
        };

        var getMenuGroup = function (float_right) {
            return float_right ? '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin" style="float: right;">' :
                '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">';
        };

        var getMenuItem = function(item) {
            item = item.toLowerCase().replace(' ', '-');
            switch (item) {
                case 'bold':
                    return '<button title="Bold" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'bold\')" ng-class="{ active: isBold}"><i class="fa fa-bold"></i></button>';
                    break;
                case 'italic':
                    return '<button title="Italic" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'italic\')" ng-class="{ active: isItalic}"><i class="fa fa-italic"></i></button>';
                    break;
                case 'underline':
                    return '<button title="Underline" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'underline\')" ng-class="{ active: isUnderlined}"><i class="fa fa-underline"></i></button>';
                    break;
                case 'strikethrough':
                    return '<button title="Strikethrough" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'strikethrough\')" ng-class="{ active: isStrikethrough}"><i class="fa fa-strikethrough"></i></button>';
                    break;
                case 'subscript':
                    return '<button title="Subscript" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'subscript\')" ng-class="{ active: isSubscript}"><i class="fa fa-subscript"></i></button>';
                    break;
                case 'superscript':
                    return '<button title="Superscript" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'superscript\')" ng-class="{ active: isSuperscript}"><i class="fa fa-superscript"></i></button>';
                    break;
                case 'font':
                    return '<select tabindex="-1"  unselectable="on" class="form-control wysiwyg-select" ng-model="font" ng-options="f for f in fonts" ng-change="setFont()"></select>';
                    break;
                case 'font-size':
                    return '<select unselectable="on" tabindex="-1" class="form-control wysiwyg-select" ng-model="fontSize" ng-options="f.size for f in fontSizes" ng-change="setFontSize()"></select>';
                    break;
                case 'font-color':
                    return '<button title="Font Color" tabindex="-1" colorpicker="rgba" type="button" colorpicker-position="top" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-fontcolor" ng-model="fontColor" ng-change="setFontColor()">A</button>';
                    break;
                case 'hilite-color':
                    return '<button title="Hilite Color" tabindex="-1" colorpicker="rgba" type="button" colorpicker-position="top" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-hiliteColor" ng-model="hiliteColor" ng-change="setHiliteColor()">H</button>';
                    break;
                case 'remove-format':
                    return '<button title="Remove Formatting" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'removeFormat\')" ><i class="fa fa-eraser"></i></button>';
                    break;
                case 'ordered-list':
                    return '<button title="Ordered List" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'insertorderedlist\')" ng-class="{ active: isOrderedList}"><i class="fa fa-list-ol"></i></button>';
                    break;
                case 'unordered-list':
                    return '<button title="Unordered List" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'insertunorderedlist\')" ng-class="{ active: isUnorderedList}"><i class="fa fa-list-ul"></i></button>';
                    break;
                case 'outdent':
                    return '<button title="Outdent" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'outdent\')"><i class="fa fa-outdent"></i></button>';
                    break;
                case 'indent':
                    return '<button title="Indent" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'indent\')"><i class="fa fa-indent"></i></button>';
                    break;
                case 'left-justify':
                    return '<button title="Left Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'justifyleft\')" ng-class="{ active: isLeftJustified}"><i class="fa fa-align-left"></i></button>';
                    break;
                case 'center-justify':
                    return '<button title="Center Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'justifycenter\')" ng-class="{ active: isCenterJustified}"><i class="fa fa-align-center"></i></button>';
                    break;
                case 'right-justify':
                    return '<button title="Right Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'justifyright\')" ng-class="{ active: isRightJustified}"><i class="fa fa-align-right"></i></button>';
                    break;
                case 'code':
                    return '<button title="Code" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'formatblock\', \'pre\')"  ng-class="{ active: isPre}"><i class="fa fa-code"></i></button>';
                    break;
                case 'quote':
                    return '<button title="Quote" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'formatblock\', \'blockquote\')"  ng-class="{ active: isBlockquote}"><i class="fa fa-quote-right"></i></button>';
                    break;
                case 'paragragh':
                    return '<button title="Paragragh" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'insertParagraph\')"  ng-class="{ active: isParagraph}">P</button>';
                    break;
                case 'link':
                    return '<button ng-show="!isLink" tabindex="-1" title="Link" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="createLink()"><i class="fa fa-link" ></i> </button>' +
                        '<button ng-show="isLink" tabindex="-1" title="Unlink" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="format(\'unlink\')"><i class="fa fa-unlink"></i> </button>';
                    break;
                case 'image':
                    return '<button title="Image" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="insertImage()"><i class="fa fa-picture-o"></i> </button>';
                    break;
                case 'fullscreen':
                    return '<button title="fullscreen" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="fullscreen()" ng-show="!show_exit_fullscreen"><i class="fa fa-expand"></i> </button>';
                    break;
                case 'exit-fullscreen':
                    return '<button title="exit fullscreen" tabindex="-1" type="button" unselectable="on" class="btn btn-default btn-flat" ng-click="exitfullscreen()" ng-show="show_exit_fullscreen"><i class="fa fa-compress"></i> </button>';
                    break;
                default:
                    console.log('Angular.wysiwyg: Unknown menu item.');
                    return '';
                    break;
            }
        };

        var getBottomMenu = function(){
            return  '<div class="wysiwyg-bottom-menu">'
                  + '  <button type="submit" ng-click="saveEdited()" class="btn btn-success btn-sm btn-flat desc_button">保存</button>'
                  + '  <button type="submit" ng-click="cancelEdit()" class="btn btn-default btn-sm btn-flat desc_button">取消</button>'
                  + '</div>';
        };

        var createMenu = function(menu) {
            
            if (angular.isDefined(menu) && menu !== '')
                menu = stringToArray(menu);
            else
                menu = defaultMenu;

            var menuHtml = '<div class="wysiwyg-editor-wrapper">';
            menuHtml += getMenuStyles();
            menuHtml += '<div class="wysiwyg-menu-wrapper">';
            // 创建工具栏
            for (var i = 0; i < menu.length; i++) {
                menuHtml += getMenuGroup($.inArray("fullscreen", menu[i]) != -1 || $.inArray("exit-fullscreen", menu[i]) != -1);
                for (var j = 0; j < menu[i].length; j++) {
                    menuHtml += getMenuItem(menu[i][j]);
                }
                menuHtml += '</div>';
            }
            menuHtml += '</div>';
            menuHtml += getMenuTextArea();
            //menuHtml += getBottomMenu();
            menuHtml += '</div>';
            return menuHtml;
        };

        var stringToArray = function(string) {
            var ret;
            try {
                ret = JSON.parse(string.replace(/'/g, '"'));
            } catch (e) {
            }
            return ret;
        };

        return {
            createMenu: createMenu
        }

    })
    .factory('wysiwgFSMode', function(){
        return {
            enterFullscreenMode: function(target){
                try{
                    var editor = angular.element('#' + target),
                        editorWrapper = editor.find('div.ng-scope'),
                        editorScope = editorWrapper.scope();
                    if(editor.hasClass('ng-hide')) {
                        editorScope.recoverReadOnlyMode = true;
                        editor.removeClass('ng-hide');
                    }
                    var editorContent = angular.element('#' + editor.attr("textarea-id")),
                        menuWrapperH  = editorWrapper.children('div.wysiwyg-menu-wrapper').outerHeight(),
                        bottomMenuH   = editorWrapper.children('div.wysiwyg-bottom-menu').outerHeight(),
                        windowH = angular.element(window).height();
                    editorScope.show_exit_fullscreen = true; // 工具栏显示退出全屏的按钮
                    editor.css({
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                        zIndex: 99999
                    });
                    angular.element('header').css('display', 'none');
                    editorContent.css('height', windowH - menuWrapperH - bottomMenuH + 'px');
                } catch (e){
                    console.log('failed to enter full screen mode for:' + e);
                }
            }
        }
    });