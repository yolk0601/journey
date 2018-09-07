; /*!widget/Module.Dropdown/dropdown.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */
var dropdown = dropdown || {};
//var $ = require('jquery');
//头部菜单显示隐藏
dropdown.show = function(e) {
    var that = $(e);
    that.addClass('hover').siblings().removeClass('hover');
    that.find('.dropdown-body').show();
    that.on('mouseleave', function(event) {
        that.removeClass('hover');
        that.find('.dropdown-body').hide();
    });
};
dropdown.init = function(handle) {
    $('.ui-dropdown').on('mouseenter', function(event) {
        dropdown.show(this);
    });
};
//$(function () {
//    //头部菜单
//    $('.ui-dropdown').on('mouseenter', function (event) {
//        dropdown.show(this);
//    });
//
//});
; /*!widget/Module.Follow/follow.js*/
/**
 * 
 * 
    关注按钮：
    <div class="ui_follow add focus_m" data-url="/teachers/follow/" data-params="urlStr=287&amp;urlKey=30a7f6b663710b1824a13eca674021ae" data-type="3"> 
        <em>+</em>关注
    </div>
 
    已关注，带取消：
    <div class="ui_follow follow_cancel" data-url="/teachers/follow/" data-value="425" data-params="urlStr=425&amp;urlKey=7830acaf10067e0302053fb4f9d0c6e0" data-type="2"> 
        <em class="addsucess"></em>
        已关注 <i class="line">|</i>
        <a href="javascript:void(0)" class="">取消</a>
    </div>
    
    已关注：
    <div class="ui_follow follow_cancel" data-url="/teachers/follow/" data-params="urlStr=30263&amp;urlKey=a0fb1a25fcfffd5722a8a9d8db52215e" data-type="2"> 
        <em class="addsucess"></em>已关注
    </div>
    
    $().follow({
        
    });
 
 */
;
(function($) {
    // 默认配置
    var defaults = {
        url: '', // 每页的条目数
        type: 1, // 关注按钮类型：1、灰底；2、加关注；3、已关注，取消
        params: null, // 点击关注时请求ajax的携带的参数
        state: 1, // 关注状态：1. 不可取消； 2. 可取消
        goto: window.location.href
    };
    /*
     * @name 关注老师操作
     * @param userId:被关注人id，type:操作类型(1:改为已关注，2：改为取消关注成功，3：改为已关注可取消状态，4：改为取消关注成功且删除)
     * @return sign(0:未登录，1：成功 2：失败 3：未登录)
     */
    // 发送请求
    var _followPost = function(options) {
        //        console.log('ajax:');
        var that = $(this);
        var data = that.data();
        var settings = $.extend({}, defaults, data);
        settings.tp = (that.find('a.follow_add').length > 0) ? 'add' : 'cancel';
        //        console.log('data-type: ' + settings.type);
        if (!settings.url) {
            return false;
        }
        $.ajax({
            type: "post",
            url: settings.url,
            timeout: 7000,
            dataType: 'json',
            data: settings.params + '&type=' + settings.type,
            success: function(msg) {
                if (msg.sign == 2) {
                    window.location.href = msg.msg;
                } else if (msg.sign == 1) {
                    var btnCls = that.find('.follow_add').hasClass('btn') ? 'btn' : 'btn-sm';
                    var btn = that.find('a');
                    if (settings.tp == 'add') {
                        defaults.tp = 'cancel';
                        btn.removeClass('follow_add btn-warning').addClass('btn-default');
                        var cls = btn.attr('class');
                        var tpl = '<span class="' + cls + '">已关注</span> ';
                        if (settings.state == 2) {
                            tpl += '<a href="###" class="' + btnCls + ' btn-link text-primary follow_cancel">取消关注</a>';
                        }
                        that.html(tpl);
                        follows.unbind.call(that.find('.follow_add'));
                    } else {
                        defaults.tp = 'add';
                        btn = that.find('a').prev();
                        btn.removeClass('btn-default').addClass('btn-warning follow_add');
                        var cls = btn.attr('class');
                        var tpl = '<a href="###" class="' + cls + '">+ 关注</a>';
                        that.html(tpl);
                        follows.unbind.call(that.find('.follow_cancel'));
                    }
                    var _type = data.type == 1 ? 2 : 1;
                    //                    console.log('data: ' + data.type);
                    //                    console.log('type: ' + _type);
                    that.data('type', _type);
                    return;
                } else {
                    alert(msg.msg);
                }
            },
            error: function() {
                alert('数据读取错误..');
            }
        });
    };
    var follows = {
        // 初始化
        init: function(options) {
            //            console.log('init:');
        },
        bind: function(options) {
            var that = $(this);
            that.off('click', 'a').on('click', 'a', function() {
                if ($(this).hasClass('follow_add')) {
                    follows.add.call(that);
                } else if ($(this).hasClass('follow_cancel')) {
                    follows.cancel.call(that);
                }
            });
            return;
        },
        unbind: function() {
            $(this).off('click', 'a');
        },
        // 加关注
        add: function(opt) {
            //            console.info('add: ');
            _followPost.call(this);
        },
        // 取消关注
        cancel: function(opt) {
            //            console.log('cancel: ');
            _followPost.call(this);
        },
        // 返回关注、已关注的HTML结构
        template: function(tp) {
            var tpl = '';
            switch (tp) {
                // 1:改为已关注
                case 1:
                    tpl = '';
                    break;
                    // 2：改为取消关注成功
                case 2:
                    tpl = '';
                    break;
                    // 3：改为已关注可取消状态
                case 3:
                    tpl = '';
                    break;
                    // 4：改为取消关注成功且删除
                case 4:
                    tpl = '';
                    break;
            }
            return tpl;
        }
    };
    $.fn.follow = function(method) {
        if ($.isEmptyObject(method)) {
            return this.each(function() {
                var that = $(this),
                    data = that.data();
                // 如果data为空则退出
                if ($.isEmptyObject(data)) {
                    return false;
                } else {
                    follows.bind.call(this, data);
                }
                return this;
            });
        } else if (follows[method]) {
            return follows[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object') {
            return follows.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on $.follow');
        }
    };
})(jQuery);
; /*!widget/Module.Modal/Modal.js*/
/**
 * Created by yangmengyuan on 15/11/17.
 */
var createModal = createModal || {};
createModal.show = function(e) {
    this.opt = {};
    this.target = '';
    $.extend(this.opt, e);
    //console.log(this.opt);
    $('body').append("<div id='" + this.opt.id + "' class='modal fade " + this.opt.cls + "'  role='dialog'><div class='modal-dialog' style='width:" + this.opt.width + "px;' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>" + this.opt.title + "</h4></div><div class='modal-body'>" + this.opt.content + "</div></div>");
    $('.modal').on('hidden.bs.modal', function(e) {
        $(this).remove();
    })
};
; /*!widget/Module.Modal/swfobject.js*/
/**
 * swfobject
 */
/*! SWFObject v2.2 <http://code.google.com/p/swfobject/> 
    is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject = swfobject || function() {
    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        ON_READY_STATE_CHANGE = "onreadystatechange",
        win = window,
        doc = document,
        nav = navigator,
        plugin = false,
        domLoadFnArr = [main],
        regObjArr = [],
        objIdArr = [],
        listenersArr = [],
        storedAltContent,
        storedAltContentId,
        storedCallbackFn,
        storedCallbackObj,
        isDomLoaded = false,
        isExpressInstallActive = false,
        dynamicStylesheet,
        dynamicStylesheetMedia,
        autoHideShow = true,
        /* Centralized function for browser feature detection
        - User agent string detection is only used when no good alternative is possible
        - Is executed directly for optimal performance
    */
        ua = function() {
            var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
                u = nav.userAgent.toLowerCase(),
                p = nav.platform.toLowerCase(),
                windows = p ? /win/.test(p) : /win/.test(u),
                mac = p ? /mac/.test(p) : /mac/.test(u),
                webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
                playerVersion = [0, 0, 0],
                d = null;
            if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                d = nav.plugins[SHOCKWAVE_FLASH].description;
                if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                    plugin = true;
                    ie = false; // cascaded feature detection for Internet Explorer
                    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                    playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                    playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                }
            } else if (typeof win.ActiveXObject != UNDEF) {
                try {
                    var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                    if (a) { // a will return null when ActiveX is disabled
                        d = a.GetVariable("$version");
                        if (d) {
                            ie = true; // cascaded feature detection for Internet Explorer
                            d = d.split(" ")[1].split(",");
                            playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                        }
                    }
                } catch (e) {}
            }
            return {
                w3: w3cdom,
                pv: playerVersion,
                wk: webkit,
                ie: ie,
                win: windows,
                mac: mac
            };
        }(),
        /* Cross-browser onDomLoad
        - Will fire an event as soon as the DOM of a web page is loaded
        - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
        - Regular onload serves as fallback
    */
        onDomLoad = function() {
            if (!ua.w3) {
                return;
            }
            if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
                callDomLoadFunctions();
            }
            if (!isDomLoaded) {
                if (typeof doc.addEventListener != UNDEF) {
                    doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                }
                if (ua.ie && ua.win) {
                    doc.attachEvent(ON_READY_STATE_CHANGE, function() {
                        if (doc.readyState == "complete") {
                            doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                            callDomLoadFunctions();
                        }
                    });
                    if (win == top) { // if not inside an iframe
                        (function() {
                            if (isDomLoaded) {
                                return;
                            }
                            try {
                                doc.documentElement.doScroll("left");
                            } catch (e) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            callDomLoadFunctions();
                        })();
                    }
                }
                if (ua.wk) {
                    (function() {
                        if (isDomLoaded) {
                            return;
                        }
                        if (!/loaded|complete/.test(doc.readyState)) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        callDomLoadFunctions();
                    })();
                }
                addLoadEvent(callDomLoadFunctions);
            }
        }();
    function callDomLoadFunctions() {
        if (isDomLoaded) {
            return;
        }
        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
            var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
            t.parentNode.removeChild(t);
        } catch (e) {
            return;
        }
        isDomLoaded = true;
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }
    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        } else {
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }
    /* Cross-browser onload
        - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
        - Will fire an event as soon as a web page including all of its assets are loaded 
     */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener != UNDEF) {
            win.addEventListener("load", fn, false);
        } else if (typeof doc.addEventListener != UNDEF) {
            doc.addEventListener("load", fn, false);
        } else if (typeof win.attachEvent != UNDEF) {
            addListener(win, "onload", fn);
        } else if (typeof win.onload == "function") {
            var fnOld = win.onload;
            win.onload = function() {
                fnOld();
                fn();
            };
        } else {
            win.onload = fn;
        }
    }
    /* Main function
        - Will preferably execute onDomLoad, otherwise onload (as a fallback)
    */
    function main() {
        if (plugin) {
            testPlayerVersion();
        } else {
            matchVersions();
        }
    }
    /* Detect the Flash Player version for non-Internet Explorer browsers
        - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
          a. Both release and build numbers can be detected
          b. Avoid wrong descriptions by corrupt installers provided by Adobe
          c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
        - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
    */
    function testPlayerVersion() {
        var b = doc.getElementsByTagName("body")[0];
        var o = createElement(OBJECT);
        o.setAttribute("type", FLASH_MIME_TYPE);
        var t = b.appendChild(o);
        if (t) {
            var counter = 0;
            (function() {
                if (typeof t.GetVariable != UNDEF) {
                    var d = t.GetVariable("$version");
                    if (d) {
                        d = d.split(" ")[1].split(",");
                        ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                } else if (counter < 10) {
                    counter++;
                    setTimeout(arguments.callee, 10);
                    return;
                }
                b.removeChild(o);
                t = null;
                matchVersions();
            })();
        } else {
            matchVersions();
        }
    }
    /* Perform Flash Player and SWF version matching; static publishing only
     */
    function matchVersions() {
        var rl = regObjArr.length;
        if (rl > 0) {
            for (var i = 0; i < rl; i++) { // for each registered object element
                var id = regObjArr[i].id;
                var cb = regObjArr[i].callbackFn;
                var cbObj = {
                    success: false,
                    id: id
                };
                if (ua.pv[0] > 0) {
                    var obj = getElementById(id);
                    if (obj) {
                        if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                            setVisibility(id, true);
                            if (cb) {
                                cbObj.success = true;
                                cbObj.ref = getObjectById(id);
                                cb(cbObj);
                            }
                        } else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                            var att = {};
                            att.data = regObjArr[i].expressInstall;
                            att.width = obj.getAttribute("width") || "0";
                            att.height = obj.getAttribute("height") || "0";
                            if (obj.getAttribute("class")) {
                                att.styleclass = obj.getAttribute("class");
                            }
                            if (obj.getAttribute("align")) {
                                att.align = obj.getAttribute("align");
                            }
                            // parse HTML object param element's name-value pairs
                            var par = {};
                            var p = obj.getElementsByTagName("param");
                            var pl = p.length;
                            for (var j = 0; j < pl; j++) {
                                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                                    par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                }
                            }
                            showExpressInstall(att, par, id, cb);
                        } else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
                            displayAltContent(obj);
                            if (cb) {
                                cb(cbObj);
                            }
                        }
                    }
                } else { // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
                    setVisibility(id, true);
                    if (cb) {
                        var o = getObjectById(id); // test whether there is an HTML object element or not
                        if (o && typeof o.SetVariable != UNDEF) {
                            cbObj.success = true;
                            cbObj.ref = o;
                        }
                        cb(cbObj);
                    }
                }
            }
        }
    }
    function getObjectById(objectIdStr) {
        var r = null;
        var o = getElementById(objectIdStr);
        if (o && o.nodeName == "OBJECT") {
            if (typeof o.SetVariable != UNDEF) {
                r = o;
            } else {
                var n = o.getElementsByTagName(OBJECT)[0];
                if (n) {
                    r = n;
                }
            }
        }
        return r;
    }
    /* Requirements for Adobe Express Install
        - only one instance can be active at a time
        - fp 6.0.65 or higher
        - Win/Mac OS only
        - no Webkit engines older than version 312
    */
    function canExpressInstall() {
        return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
    }
    /* Show the Adobe Express Install dialog
        - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
    */
    function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
        isExpressInstallActive = true;
        storedCallbackFn = callbackFn || null;
        storedCallbackObj = {
            success: false,
            id: replaceElemIdStr
        };
        var obj = getElementById(replaceElemIdStr);
        if (obj) {
            if (obj.nodeName == "OBJECT") { // static publishing
                storedAltContent = abstractAltContent(obj);
                storedAltContentId = null;
            } else { // dynamic publishing
                storedAltContent = obj;
                storedAltContentId = replaceElemIdStr;
            }
            att.id = EXPRESS_INSTALL_ID;
            if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) {
                att.width = "310";
            }
            if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) {
                att.height = "137";
            }
            doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
            var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                fv = "MMredirectURL=" + encodeURI(window.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
            if (typeof par.flashvars != UNDEF) {
                par.flashvars += "&" + fv;
            } else {
                par.flashvars = fv;
            }
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && ua.win && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceElemIdStr += "SWFObjectNew";
                newObj.setAttribute("id", replaceElemIdStr);
                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                (function() {
                    if (obj.readyState == 4) {
                        obj.parentNode.removeChild(obj);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            }
            createSWF(att, par, replaceElemIdStr);
        }
    }
    /* Functions to abstract and display alternative content
     */
    function displayAltContent(obj) {
        if (ua.ie && ua.win && obj.readyState != 4) {
            // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
            // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
            el.parentNode.replaceChild(abstractAltContent(obj), el);
            obj.style.display = "none";
            (function() {
                if (obj.readyState == 4) {
                    obj.parentNode.removeChild(obj);
                } else {
                    setTimeout(arguments.callee, 10);
                }
            })();
        } else {
            obj.parentNode.replaceChild(abstractAltContent(obj), obj);
        }
    }
    function abstractAltContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        } else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }
    /* Cross-browser dynamic SWF creation
     */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        if (ua.wk && ua.wk < 312) {
            return r;
        }
        if (el) {
            if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
                attObj.id = id;
            }
            if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
                var att = "";
                for (var i in attObj) {
                    if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
                        if (i.toLowerCase() == "data") {
                            parObj.movie = attObj[i];
                        } else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            att += ' class="' + attObj[i] + '"';
                        } else if (i.toLowerCase() != "classid") {
                            att += ' ' + i + '="' + attObj[i] + '"';
                        }
                    }
                }
                var par = "";
                for (var j in parObj) {
                    if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
                        par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                    }
                }
                el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
                r = getElementById(attObj.id);
            } else { // well-behaving browsers
                var o = createElement(OBJECT);
                o.setAttribute("type", FLASH_MIME_TYPE);
                for (var m in attObj) {
                    if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
                        if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                            o.setAttribute("class", attObj[m]);
                        } else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
                            o.setAttribute(m, attObj[m]);
                        }
                    }
                }
                for (var n in parObj) {
                    if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
                        createObjParam(o, n, parObj[n]);
                    }
                }
                el.parentNode.replaceChild(o, el);
                r = o;
            }
        }
        return r;
    }
    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }
    /* Cross-browser SWF removal
        - Especially needed to safely and completely remove a SWF in Internet Explorer
    */
    function removeSWF(id) {
        var obj = getElementById(id);
        if (obj && obj.nodeName == "OBJECT") {
            if (ua.ie && ua.win) {
                obj.style.display = "none";
                (function() {
                    if (obj.readyState == 4) {
                        removeObjectInIE(id);
                    } else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            } else {
                obj.parentNode.removeChild(obj);
            }
        }
    }
    function removeObjectInIE(id) {
        var obj = getElementById(id);
        if (obj) {
            for (var i in obj) {
                if (typeof obj[i] == "function") {
                    obj[i] = null;
                }
            }
            obj.parentNode.removeChild(obj);
        }
    }
    /* Functions to optimize JavaScript compression
     */
    function getElementById(id) {
        var el = null;
        try {
            el = doc.getElementById(id);
        } catch (e) {}
        return el;
    }
    function createElement(el) {
        return doc.createElement(el);
    }
    /* Updated attachEvent function for Internet Explorer
        - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
    */
    function addListener(target, eventType, fn) {
        target.attachEvent(eventType, fn);
        listenersArr[listenersArr.length] = [target, eventType, fn];
    }
    /* Flash Player and SWF content version matching
     */
    function hasPlayerVersion(rv) {
        var pv = ua.pv,
            v = rv.split(".");
        v[0] = parseInt(v[0], 10);
        v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
        v[2] = parseInt(v[2], 10) || 0;
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }
    /* Cross-browser dynamic CSS creation
        - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
    */
    function createCSS(sel, decl, media, newStyle) {
        if (ua.ie && ua.mac) {
            return;
        }
        var h = doc.getElementsByTagName("head")[0];
        if (!h) {
            return;
        } // to also support badly authored HTML pages that lack a head element
        var m = (media && typeof media == "string") ? media : "screen";
        if (newStyle) {
            dynamicStylesheet = null;
            dynamicStylesheetMedia = null;
        }
        if (!dynamicStylesheet || dynamicStylesheetMedia != m) {
            // create dynamic stylesheet + get a global reference to it
            var s = createElement("style");
            s.setAttribute("type", "text/css");
            s.setAttribute("media", m);
            dynamicStylesheet = h.appendChild(s);
            if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
            }
            dynamicStylesheetMedia = m;
        }
        // add style rule
        if (ua.ie && ua.win) {
            if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
                dynamicStylesheet.addRule(sel, decl);
            }
        } else {
            if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
            }
        }
    }
    function setVisibility(id, isVisible) {
        if (!autoHideShow) {
            return;
        }
        var v = isVisible ? "visible" : "hidden";
        if (isDomLoaded && getElementById(id)) {
            getElementById(id).style.visibility = v;
        } else {
            createCSS("#" + id, "visibility:" + v);
        }
    }
    /* Filter to avoid XSS attacks
     */
    function urlEncodeIfNecessary(s) {
        var regex = /[\\\"<>\.;]/;
        var hasBadChars = regex.exec(s) != null;
        return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
    }
    /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
     */
    var cleanup = function() {
        if (ua.ie && ua.win) {
            window.attachEvent("onunload", function() {
                // remove listeners to avoid memory leaks
                var ll = listenersArr.length;
                for (var i = 0; i < ll; i++) {
                    listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                }
                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                var il = objIdArr.length;
                for (var j = 0; j < il; j++) {
                    removeSWF(objIdArr[j]);
                }
                // cleanup library's main closures to avoid memory leaks
                for (var k in ua) {
                    ua[k] = null;
                }
                ua = null;
                for (var l in swfobject) {
                    swfobject[l] = null;
                }
                swfobject = null;
            });
        }
    }();
    return {
        /* Public API
            - Reference: http://code.google.com/p/swfobject/wiki/documentation
        */
        registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
            if (ua.w3 && objectIdStr && swfVersionStr) {
                var regObj = {};
                regObj.id = objectIdStr;
                regObj.swfVersion = swfVersionStr;
                regObj.expressInstall = xiSwfUrlStr;
                regObj.callbackFn = callbackFn;
                regObjArr[regObjArr.length] = regObj;
                setVisibility(objectIdStr, false);
            } else if (callbackFn) {
                callbackFn({
                    success: false,
                    id: objectIdStr
                });
            }
        },
        getObjectById: function(objectIdStr) {
            if (ua.w3) {
                return getObjectById(objectIdStr);
            }
        },
        embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
            var callbackObj = {
                success: false,
                id: replaceElemIdStr
            };
            if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                setVisibility(replaceElemIdStr, false);
                addDomLoadEvent(function() {
                    widthStr += ""; // auto-convert to string
                    heightStr += "";
                    var att = {};
                    if (attObj && typeof attObj === OBJECT) {
                        for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                            att[i] = attObj[i];
                        }
                    }
                    att.data = swfUrlStr;
                    att.width = widthStr;
                    att.height = heightStr;
                    var par = {};
                    if (parObj && typeof parObj === OBJECT) {
                        for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                            par[j] = parObj[j];
                        }
                    }
                    if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                        for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                            if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + k + "=" + flashvarsObj[k];
                            } else {
                                par.flashvars = k + "=" + flashvarsObj[k];
                            }
                        }
                    }
                    if (hasPlayerVersion(swfVersionStr)) { // create SWF
                        var obj = createSWF(att, par, replaceElemIdStr);
                        if (att.id == replaceElemIdStr) {
                            setVisibility(replaceElemIdStr, true);
                        }
                        callbackObj.success = true;
                        callbackObj.ref = obj;
                    } else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                        att.data = xiSwfUrlStr;
                        showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        return;
                    } else { // show alternative content
                        setVisibility(replaceElemIdStr, true);
                    }
                    if (callbackFn) {
                        callbackFn(callbackObj);
                    }
                });
            } else if (callbackFn) {
                callbackFn(callbackObj);
            }
        },
        switchOffAutoHideShow: function() {
            autoHideShow = false;
        },
        ua: ua,
        getFlashPlayerVersion: function() {
            return {
                major: ua.pv[0],
                minor: ua.pv[1],
                release: ua.pv[2]
            };
        },
        hasFlashPlayerVersion: hasPlayerVersion,
        createSWF: function(attObj, parObj, replaceElemIdStr) {
            if (ua.w3) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            } else {
                return undefined;
            }
        },
        showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
            if (ua.w3 && canExpressInstall()) {
                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
            }
        },
        removeSWF: function(objElemIdStr) {
            if (ua.w3) {
                removeSWF(objElemIdStr);
            }
        },
        createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
            if (ua.w3) {
                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
            }
        },
        addDomLoadEvent: addDomLoadEvent,
        addLoadEvent: addLoadEvent,
        getQueryParamValue: function(param) {
            var q = doc.location.search || doc.location.hash;
            if (q) {
                if (/\?/.test(q)) {
                    q = q.split("?")[1];
                } // strip question mark
                if (param == null) {
                    return urlEncodeIfNecessary(q);
                }
                var pairs = q.split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                    }
                }
            }
            return "";
        },
        // For internal usage only
        expressInstallCallback: function() {
            if (isExpressInstallActive) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj && storedAltContent) {
                    obj.parentNode.replaceChild(storedAltContent, obj);
                    if (storedAltContentId) {
                        setVisibility(storedAltContentId, true);
                        if (ua.ie && ua.win) {
                            storedAltContent.style.display = "block";
                        }
                    }
                    if (storedCallbackFn) {
                        storedCallbackFn(storedCallbackObj);
                    }
                }
                isExpressInstallActive = false;
            }
        }
    };
}();; /*!widget/Module.Pagination/paginations.js*/
/**
 * 
 * @example
        $('.ui-pages').pages({
            total : 50, // 总记录数
            size: 2, // 每页显示记录数
            index : 26, // 当前页
            url : '#!{page}', // 非ajax情况下分类的链接地址
            // 点击分页时的回调，返回被点击的页数
            click : function(e){
                console.log(e);
            }
        }); 
 */
;
(function($) {
    var defaults = {
        'total': 100, // 条目总数，异步分页时必填，模拟分页时为数组的长度
        'size': 10, // 每页的条目数
        'index': 1, // 初始化时选定的页数
        'cls': '', // 分页容器ul上面的出class名
        'range': 2, // 可见的页码范围，即当前页码两边的页码数量。比如当前是第 6 页，设置 pageRange 为 2，则页码条显示为 '1... 4 5 6 7 8'
        'handle': '.pagination-handle', // 加载分页的容器
        'click': null, // 点击分页后事件绑定
        'container': '.pagination-container', // 存放分页数据内容的容器
        'url': null // 分页按钮的链接
    };
    var methods = {
        init: function() {},
        data: function(len) {
            if (len <= 0) {
                return [];
            }
            return new Array(len || 100);
        },
        template: function(str) {}
    };
    $.fn.pages = function(options) {
        if (options && options.total <= 1) {
            return this;
        }
        return this.each(function() {
            var that = $(this);
            if (typeof options == 'number') {
                that.pagination(options);
                return that;
            }
            var settings = $.extend({}, defaults, options);
            settings.handle = that;
            var _opt = {
                dataSource: methods.data(settings.total),
                totalNumber: settings.total, // 条目总数，异步分页时必填，模拟分页时为数组的长度
                pageNumber: settings.index, // 指定初始化时加载哪一页的数据
                pageSize: settings.size, // 每页的条目数
                pageRange: settings.range, // 可见的页码范围，即当前页码两边的页码数量。比如当前是第 6 页，设置 pageRange 为 2，则页码条显示为 '1... 4 5 6 7 8'
                ulClassName: 'pagination ' + settings.cls,
                callback: function(data, pagination) {
                    try {
                        settings.callback(pagination);
                    } catch (e) {}
                }
            };
            if (typeof settings.click == 'function') {
                _opt.afterPageOnClick = _opt.afterNextOnClick = _opt.afterPreviousOnClick = function() {
                    settings.click(settings.handle.pagination('getSelectedPageNum'));
                };
                _opt.pageLink = 'javascript:void(0);';
            }
            if (settings.url) {
                _opt.pageLink = settings.url;
            }
            //            that.pagination('destroy').pagination(_opt);
            that.pagination(_opt);
            return that;
        });
        //        var settings = $.extend({}, defaults, options);
        //
        //        settings.handle = this;
        //        var _opt = {
        //            dataSource: methods.data(settings.total),
        //            totalNumber: settings.total,   // 条目总数，异步分页时必填，模拟分页时为数组的长度
        //            pageNumber: settings.index,  // 指定初始化时加载哪一页的数据
        //            pageSize: settings.size, // 每页的条目数
        //            pageRange: settings.range, // 可见的页码范围，即当前页码两边的页码数量。比如当前是第 6 页，设置 pageRange 为 2，则页码条显示为 '1... 4 5 6 7 8'
        //            ulClassName: 'pagination ' + settings.cls,
        //            callback: function(data, pagination){
        //                try{
        //                    settings.callback(pagination);
        //                }catch(e){}
        //            }
        //        };
        //        if(typeof settings.click == 'function'){
        //            _opt.afterPageOnClick = _opt.afterNextOnClick = _opt.afterPreviousOnClick = function(){
        //                settings.click(settings.handle.pagination('getSelectedPageNum'));
        //            };
        //        }
        //        if(settings.url){
        //            _opt.pageLink  = settings.url;
        //        }
        //
        //        this.pagination(_opt);
        //
        //        return this;
    };
})(jQuery);
/*
 * pagination.js 2.0.7
 *
 * Released under the MIT license.
 */
(function(global, $) {
    if (typeof $ === 'undefined') {
        throwError('Pagination requires jQuery.');
    }
    var pluginName = 'pagination';
    var pluginHookMethod = 'addHook';
    var eventPrefix = '__pagination-';
    // Conflict, use backup
    if ($.fn.pagination) {
        pluginName = 'pagination2';
    }
    $.fn[pluginName] = function(options) {
        if (typeof options === 'undefined') {
            return this;
        }
        var container = $(this);
        var pagination = {
            initialize: function() {
                var self = this;
                // 保存当前实例的属性
                if (!container.data('pagination')) {
                    container.data('pagination', {});
                }
                // 初始化之前
                if (self.callHook('beforeInit') === false) return;
                // 如果分页已经初始化,摧毁它
                if (container.data('pagination').initialized) {
                    $('.paginationjs', container).remove();
                }
                // 初始化是否禁用分页
                self.disabled = !!attributes.disabled;
                // 传递给回调函数
                var model = self.model = {
                    pageRange: attributes.pageRange,
                    pageSize: attributes.pageSize
                };
                // "dataSource"的类型是未知的,解析它找到真正的数据
                self.parseDataSource(attributes.dataSource, function(dataSource) {
                    // 分页是否同步模式
                    self.sync = Helpers.isArray(dataSource);
                    if (self.sync) {
                        model.totalNumber = attributes.totalNumber = dataSource.length;
                    }
                    // 获取页面的总数
                    model.totalPage = self.getTotalPage();
                    // 不到一页
                    if (attributes.hideWhenLessThanOnePage) {
                        if (model.totalPage <= 1) return;
                    }
                    var el = self.render(true);
                    // 额外的类名
                    if (attributes.className) {
                        el.addClass(attributes.className);
                    }
                    model.el = el;
                    // 加载模板
                    container[attributes.position === 'bottom' ? 'append' : 'prepend'](el);
                    // 绑定事件
                    self.observer();
                    // 初始化标志
                    container.data('pagination').initialized = true;
                    // 初始化之后
                    self.callHook('afterInit', el);
                });
            },
            render: function(isBoot) {
                var self = this;
                var model = self.model;
                var el = model.el || $('<div class="paginationjs"></div>');
                var isForced = isBoot !== true;
                // 渲染之前
                self.callHook('beforeRender', isForced);
                var currentPage = model.pageNumber || attributes.pageNumber;
                var pageRange = attributes.pageRange;
                var totalPage = model.totalPage;
                var rangeStart = currentPage - pageRange;
                var rangeEnd = currentPage + pageRange;
                if (rangeEnd > totalPage) {
                    rangeEnd = totalPage;
                    rangeStart = totalPage - pageRange * 2;
                    rangeStart = rangeStart < 1 ? 1 : rangeStart;
                }
                if (rangeStart <= 1) {
                    rangeStart = 1;
                    rangeEnd = Math.min(pageRange * 2 + 1, totalPage);
                }
                el.html(self.createTemplate({
                    currentPage: currentPage,
                    pageRange: pageRange,
                    totalPage: totalPage,
                    rangeStart: rangeStart,
                    rangeEnd: rangeEnd
                }));
                // 渲染之后
                self.callHook('afterRender', isForced);
                return el;
            },
            // 创建模板
            createTemplate: function(args) {
                var self = this;
                var currentPage = args.currentPage;
                var totalPage = args.totalPage;
                var rangeStart = args.rangeStart;
                var rangeEnd = args.rangeEnd;
                var totalNumber = attributes.totalNumber;
                var showPrevious = attributes.showPrevious;
                var showNext = attributes.showNext;
                var showPageNumbers = attributes.showPageNumbers;
                var showNavigator = attributes.showNavigator;
                var showGoInput = attributes.showGoInput;
                var showGoButton = attributes.showGoButton;
                var pageLink = attributes.pageLink;
                var prevText = attributes.prevText;
                var nextText = attributes.nextText;
                var ellipsisText = attributes.ellipsisText;
                var goButtonText = attributes.goButtonText;
                var classPrefix = attributes.classPrefix;
                var activeClassName = attributes.activeClassName;
                var disableClassName = attributes.disableClassName;
                var ulClassName = attributes.ulClassName;
                var formatNavigator = $.isFunction(attributes.formatNavigator) ? attributes.formatNavigator() : attributes.formatNavigator;
                var formatGoInput = $.isFunction(attributes.formatGoInput) ? attributes.formatGoInput() : attributes.formatGoInput;
                var formatGoButton = $.isFunction(attributes.formatGoButton) ? attributes.formatGoButton() : attributes.formatGoButton;
                var autoHidePrevious = $.isFunction(attributes.autoHidePrevious) ? attributes.autoHidePrevious() : attributes.autoHidePrevious;
                var autoHideNext = $.isFunction(attributes.autoHideNext) ? attributes.autoHideNext() : attributes.autoHideNext;
                var header = $.isFunction(attributes.header) ? attributes.header() : attributes.header;
                var footer = $.isFunction(attributes.footer) ? attributes.footer() : attributes.footer;
                var html = '';
                var goInput = '<input type="text" class="J-paginationjs-go-pagenumber">';
                var goButton = '<input type="button" class="J-paginationjs-go-button" value="' + goButtonText + '">';
                var formattedString;
                var i, pageUrl;
                if (header) {
                    formattedString = self.replaceVariables(header, {
                        currentPage: currentPage,
                        totalPage: totalPage,
                        totalNumber: totalNumber
                    });
                    html += formattedString;
                }
                if (showPrevious || showPageNumbers || showNext) {
                    html += '<div class="paginationjs-pages">';
                    if (ulClassName) {
                        html += '<ul class="' + ulClassName + '">';
                    } else {
                        html += '<ul>';
                    }
                    // 上一页按钮
                    if (showPrevious) {
                        if (currentPage === 1) {
                            if (!autoHidePrevious) {
                                html += '<li class="' + classPrefix + '-prev ' + disableClassName + '"><a>' + prevText + '<\/a><\/li>';
                            }
                        } else {
                            pageUrl = pageLink.replace('{page}', (currentPage - 1));
                            html += '<li class="' + classPrefix + '-prev J-paginationjs-previous" data-num="' + (currentPage - 1) + '" title="Previous page"><a href="' + pageUrl + '">' + prevText + '<\/a><\/li>';
                        }
                    }
                    // 页码
                    if (showPageNumbers) {
                        if (rangeStart <= 3) {
                            for (i = 1; i < rangeStart; i++) {
                                if (i == currentPage) {
                                    html += '<li class="' + classPrefix + '-page J-paginationjs-page ' + activeClassName + '" data-num="' + i + '"><a>' + i + '<\/a><\/li>';
                                } else {
                                    pageUrl = pageLink.replace('{page}', i);
                                    html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageUrl + '">' + i + '<\/a><\/li>';
                                }
                            }
                        } else {
                            if (attributes.showFirstOnEllipsisShow) {
                                pageUrl = pageLink.replace('{page}', 1);
                                html += '<li class="' + classPrefix + '-page ' + classPrefix + '-first J-paginationjs-page" data-num="1"><a href="' + pageUrl + '">1<\/a><\/li>';
                            }
                            html += '<li class="' + classPrefix + '-ellipsis ' + disableClassName + '"><a>' + ellipsisText + '<\/a><\/li>';
                        }
                        // 主循环
                        for (i = rangeStart; i <= rangeEnd; i++) {
                            if (i == currentPage) {
                                html += '<li class="' + classPrefix + '-page J-paginationjs-page ' + activeClassName + '" data-num="' + i + '"><a>' + i + '<\/a><\/li>';
                            } else {
                                pageUrl = pageLink.replace('{page}', i);
                                html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageUrl + '">' + i + '<\/a><\/li>';
                            }
                        }
                        if (rangeEnd >= totalPage - 2) {
                            for (i = rangeEnd + 1; i <= totalPage; i++) {
                                pageUrl = pageLink.replace('{page}', i);
                                html += '<li class="' + classPrefix + '-page J-paginationjs-page" data-num="' + i + '"><a href="' + pageUrl + '">' + i + '<\/a><\/li>';
                            }
                        } else {
                            html += '<li class="' + classPrefix + '-ellipsis ' + disableClassName + '"><a>' + ellipsisText + '<\/a><\/li>';
                            if (attributes.showLastOnEllipsisShow) {
                                pageUrl = pageLink.replace('{page}', totalPage);
                                html += '<li class="' + classPrefix + '-page ' + classPrefix + '-last J-paginationjs-page" data-num="' + totalPage + '"><a href="' + pageUrl + '">' + totalPage + '<\/a><\/li>';
                            }
                        }
                    }
                    // 下一页按钮
                    if (showNext) {
                        if (currentPage == totalPage) {
                            if (!autoHideNext) {
                                html += '<li class="' + classPrefix + '-next ' + disableClassName + '"><a>' + nextText + '<\/a><\/li>';
                            }
                        } else {
                            pageUrl = pageLink.replace('{page}', (currentPage + 1));
                            html += '<li class="' + classPrefix + '-next J-paginationjs-next" data-num="' + (currentPage + 1) + '" title="Next page"><a href="' + pageUrl + '">' + nextText + '<\/a><\/li>';
                        }
                    }
                    html += '<\/ul><\/div>';
                }
                // 导航条
                if (showNavigator) {
                    if (formatNavigator) {
                        formattedString = self.replaceVariables(formatNavigator, {
                            currentPage: currentPage,
                            totalPage: totalPage,
                            totalNumber: totalNumber
                        });
                        html += '<div class="' + classPrefix + '-nav J-paginationjs-nav">' + formattedString + '<\/div>';
                    }
                }
                // 跳转输入框
                if (showGoInput) {
                    if (formatGoInput) {
                        formattedString = self.replaceVariables(formatGoInput, {
                            currentPage: currentPage,
                            totalPage: totalPage,
                            totalNumber: totalNumber,
                            input: goInput
                        });
                        html += '<div class="' + classPrefix + '-go-input">' + formattedString + '</div>';
                    }
                }
                // 跳转按钮
                if (showGoButton) {
                    if (formatGoButton) {
                        formattedString = self.replaceVariables(formatGoButton, {
                            currentPage: currentPage,
                            totalPage: totalPage,
                            totalNumber: totalNumber,
                            button: goButton
                        });
                        html += '<div class="' + classPrefix + '-go-button">' + formattedString + '</div>';
                    }
                }
                if (footer) {
                    formattedString = self.replaceVariables(footer, {
                        currentPage: currentPage,
                        totalPage: totalPage,
                        totalNumber: totalNumber
                    });
                    html += formattedString;
                }
                return html;
            },
            // 跳转到指定的页面
            go: function(number, callback) {
                var self = this;
                var model = self.model;
                if (self.disabled) return;
                var pageNumber = number;
                var pageSize = attributes.pageSize;
                var totalPage = model.totalPage;
                pageNumber = parseInt(pageNumber);
                // 页码范围
                if (!pageNumber || pageNumber < 1 || pageNumber > totalPage) return;
                // 同步模式
                if (self.sync) {
                    render(self.getDataSegment(pageNumber));
                    return;
                }
                var postData = {};
                var alias = attributes.alias || {};
                postData[alias.pageSize ? alias.pageSize : 'pageSize'] = pageSize;
                postData[alias.pageNumber ? alias.pageNumber : 'pageNumber'] = pageNumber;
                var formatAjaxParams = {
                    type: 'get',
                    cache: false,
                    data: {},
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    dataType: 'json',
                    async: true
                };
                $.extend(true, formatAjaxParams, attributes.ajax);
                $.extend(formatAjaxParams.data || {}, postData);
                formatAjaxParams.url = attributes.dataSource;
                formatAjaxParams.success = function(response) {
                    render(self.filterDataByLocator(response));
                };
                formatAjaxParams.error = function(jqXHR, textStatus, errorThrown) {
                    attributes.formatAjaxError && attributes.formatAjaxError(jqXHR, textStatus, errorThrown);
                    self.enable();
                };
                self.disable();
                $.ajax(formatAjaxParams);
                function render(data) {
                    // 分页之前
                    if (self.callHook('beforePaging', pageNumber) === false) return false;
                    // Pagination direction
                    model.direction = typeof model.pageNumber === 'undefined' ? 0 : (pageNumber > model.pageNumber ? 1 : -1);
                    model.pageNumber = pageNumber;
                    self.render();
                    if (self.disabled && !self.sync) {
                        // enable
                        self.enable();
                    }
                    // 缓存模型数据
                    container.data('pagination').model = model;
                    // 格式结果之前执行的回调函数
                    if ($.isFunction(attributes.formatResult)) {
                        var cloneData = $.extend(true, [], data);
                        if (!Helpers.isArray(data = attributes.formatResult(cloneData))) {
                            data = cloneData;
                        }
                    }
                    container.data('pagination').currentPageData = data;
                    // callback
                    self.doCallback(data, callback);
                    // 分页之后
                    self.callHook('afterPaging', pageNumber);
                    // 已经是第一页
                    if (pageNumber == 1) {
                        self.callHook('afterIsFirstPage');
                    }
                    // 已经是最后一页
                    if (pageNumber == model.totalPage) {
                        self.callHook('afterIsLastPage');
                    }
                }
            },
            doCallback: function(data, customCallback) {
                var self = this;
                var model = self.model;
                if ($.isFunction(customCallback)) {
                    customCallback(data, model);
                } else if ($.isFunction(attributes.callback)) {
                    attributes.callback(data, model);
                }
            },
            destroy: function() {
                // 销毁之前
                if (this.callHook('beforeDestroy') === false) return;
                this.model.el.remove();
                container.off();
                // 删除样式元素
                $('#paginationjs-style').remove();
                // 销毁之后
                this.callHook('afterDestroy');
            },
            previous: function(callback) {
                this.go(this.model.pageNumber - 1, callback);
            },
            next: function(callback) {
                this.go(this.model.pageNumber + 1, callback);
            },
            disable: function() {
                var self = this;
                var source = self.sync ? 'sync' : 'async';
                // 禁用之前
                if (self.callHook('beforeDisable', source) === false) return;
                self.disabled = true;
                self.model.disabled = true;
                // 禁用之后
                self.callHook('afterDisable', source);
            },
            enable: function() {
                var self = this;
                var source = self.sync ? 'sync' : 'async';
                // 启用之前
                if (self.callHook('beforeEnable', source) === false) return;
                self.disabled = false;
                self.model.disabled = false;
                // 启用之后
                self.callHook('afterEnable', source);
            },
            refresh: function(callback) {
                this.go(this.model.pageNumber, callback);
            },
            show: function() {
                var self = this;
                if (self.model.el.is(':visible')) return;
                self.model.el.show();
            },
            hide: function() {
                var self = this;
                if (!self.model.el.is(':visible')) return;
                self.model.el.hide();
            },
            // 替换变量的模板
            replaceVariables: function(template, variables) {
                var formattedString;
                for (var key in variables) {
                    var value = variables[key];
                    var regexp = new RegExp('<%=\\s*' + key + '\\s*%>', 'img');
                    formattedString = (formattedString || template).replace(regexp, value);
                }
                return formattedString;
            },
            // 替换pageLink中的页面
            replacePageLink: function(template, variables) {
                var formattedString;
                for (var key in variables) {
                    var value = variables[key];
                    var regexp = new RegExp('{' + key + '}', 'img');
                    formattedString = (formattedString || template).replace(regexp, value);
                }
                return formattedString;
            },
            // 获取数据段
            getDataSegment: function(number) {
                var pageSize = attributes.pageSize;
                var dataSource = attributes.dataSource;
                var totalNumber = attributes.totalNumber;
                var start = pageSize * (number - 1) + 1;
                var end = Math.min(number * pageSize, totalNumber);
                return dataSource.slice(start - 1, end);
            },
            // 获取总页数
            getTotalPage: function() {
                return Math.ceil(attributes.totalNumber / attributes.pageSize);
            },
            // 获取数据定位
            getLocator: function(locator) {
                var result;
                if (typeof locator === 'string') {
                    result = locator;
                } else if ($.isFunction(locator)) {
                    result = locator();
                } else {
                    throwError('"locator" is incorrect. (String | Function)');
                }
                return result;
            },
            // 通过 "locator" 过滤数据
            filterDataByLocator: function(dataSource) {
                var locator = this.getLocator(attributes.locator);
                var filteredData;
                // dataSource 是一个对象,使用 “locator” 来定位真正的数据
                if (Helpers.isObject(dataSource)) {
                    try {
                        $.each(locator.split('.'), function(index, item) {
                            filteredData = (filteredData ? filteredData : dataSource)[item];
                        });
                    } catch (e) {}
                    if (!filteredData) {
                        throwError('dataSource.' + locator + ' is undefined.');
                    } else if (!Helpers.isArray(filteredData)) {
                        throwError('dataSource.' + locator + ' must be an Array.');
                    }
                }
                return filteredData || dataSource;
            },
            // 解析 dataSource
            parseDataSource: function(dataSource, callback) {
                var self = this;
                var args = arguments;
                if (Helpers.isObject(dataSource)) {
                    callback(attributes.dataSource = self.filterDataByLocator(dataSource));
                } else if (Helpers.isArray(dataSource)) {
                    callback(attributes.dataSource = dataSource);
                } else if ($.isFunction(dataSource)) {
                    attributes.dataSource(function(data) {
                        if ($.isFunction(data)) {
                            throwError('Unexpect parameter of the "done" Function.');
                        }
                        args.callee.call(self, data, callback);
                    });
                } else if (typeof dataSource === 'string') {
                    if (/^https?|file:/.test(dataSource)) {
                        attributes.ajaxDataType = 'jsonp';
                    }
                    callback(dataSource);
                } else {
                    throwError('Unexpect data type of the "dataSource".');
                }
            },
            callHook: function(hook) {
                var paginationData = container.data('pagination');
                var result;
                var args = Array.prototype.slice.apply(arguments);
                args.shift();
                if (attributes[hook] && $.isFunction(attributes[hook])) {
                    if (attributes[hook].apply(global, args) === false) {
                        result = false;
                    }
                }
                if (paginationData.hooks && paginationData.hooks[hook]) {
                    $.each(paginationData.hooks[hook], function(index, item) {
                        if (item.apply(global, args) === false) {
                            result = false;
                        }
                    });
                }
                return result !== false;
            },
            observer: function() {
                var self = this;
                var el = self.model.el;
                // Go to page
                container.on(eventPrefix + 'go', function(event, pageNumber, done) {
                    pageNumber = parseInt($.trim(pageNumber));
                    if (!pageNumber) return;
                    if (!$.isNumeric(pageNumber)) {
                        throwError('"pageNumber" is incorrect. (Number)');
                    }
                    self.go(pageNumber, done);
                });
                // Page click
                el.delegate('.J-paginationjs-page', 'click', function(event) {
                    var current = $(event.currentTarget);
                    var pageNumber = $.trim(current.attr('data-num'));
                    if (!pageNumber || current.hasClass(attributes.disableClassName) || current.hasClass(attributes.activeClassName)) return;
                    // 页面按钮点击之前
                    if (self.callHook('beforePageOnClick', event, pageNumber) === false) return false;
                    self.go(pageNumber);
                    // 页面按钮点击之后
                    self.callHook('afterPageOnClick', event, pageNumber);
                    if (!attributes.pageLink) return false;
                });
                // Previous click
                el.delegate('.J-paginationjs-previous', 'click', function(event) {
                    var current = $(event.currentTarget);
                    var pageNumber = $.trim(current.attr('data-num'));
                    if (!pageNumber || current.hasClass(attributes.disableClassName)) return;
                    // 上一页点击之前
                    if (self.callHook('beforePreviousOnClick', event, pageNumber) === false) return false;
                    self.go(pageNumber);
                    // 上一页点击之后
                    self.callHook('afterPreviousOnClick', event, pageNumber);
                    if (!attributes.pageLink) return false;
                });
                // Next click
                el.delegate('.J-paginationjs-next', 'click', function(event) {
                    var current = $(event.currentTarget);
                    var pageNumber = $.trim(current.attr('data-num'));
                    if (!pageNumber || current.hasClass(attributes.disableClassName)) return;
                    // 下一页点击之前
                    if (self.callHook('beforeNextOnClick', event, pageNumber) === false) return false;
                    self.go(pageNumber);
                    // 下一页点击之后
                    self.callHook('afterNextOnClick', event, pageNumber);
                    if (!attributes.pageLink) return false;
                });
                // Go button click
                el.delegate('.J-paginationjs-go-button', 'click', function() {
                    var pageNumber = $('.J-paginationjs-go-pagenumber', el).val();
                    // 跳转按钮点击之前
                    if (self.callHook('beforeGoButtonOnClick', event, pageNumber) === false) return false;
                    container.trigger(eventPrefix + 'go', pageNumber);
                    // 跳转按钮点击之后
                    self.callHook('afterGoButtonOnClick', event, pageNumber);
                });
                // go input enter
                el.delegate('.J-paginationjs-go-pagenumber', 'keyup', function(event) {
                    if (event.which === 13) {
                        var pageNumber = $(event.currentTarget).val();
                        // 输入之前
                        if (self.callHook('beforeGoInputOnEnter', event, pageNumber) === false) return false;
                        container.trigger(eventPrefix + 'go', pageNumber);
                        // 重新获取焦点
                        $('.J-paginationjs-go-pagenumber', el).focus();
                        // 输入之后
                        self.callHook('afterGoInputOnEnter', event, pageNumber);
                    }
                });
                // 上一页
                container.on(eventPrefix + 'previous', function(event, done) {
                    self.previous(done);
                });
                // 下一页
                container.on(eventPrefix + 'next', function(event, done) {
                    self.next(done);
                });
                // 禁用
                container.on(eventPrefix + 'disable', function() {
                    self.disable();
                });
                // 启用
                container.on(eventPrefix + 'enable', function() {
                    self.enable();
                });
                // 刷新
                container.on(eventPrefix + 'refresh', function(event, done) {
                    self.refresh(done);
                });
                // 显示
                container.on(eventPrefix + 'show', function() {
                    self.show();
                });
                // 隐藏
                container.on(eventPrefix + 'hide', function() {
                    self.hide();
                });
                // 销毁
                container.on(eventPrefix + 'destroy', function() {
                    self.destroy();
                });
                // 是否加载默认页面
                if (attributes.triggerPagingOnInit) {
                    container.trigger(eventPrefix + 'go', Math.min(attributes.pageNumber, self.model.totalPage));
                }
            }
        };
        // If initial
        if (container.data('pagination') && container.data('pagination').initialized === true) {
            // 处理事件
            if ($.isNumeric(options)) {
                // container.pagination(5)
                container.trigger.call(this, eventPrefix + 'go', options, arguments[1]);
                return this;
            } else if (typeof options === 'string') {
                var args = Array.prototype.slice.apply(arguments);
                args[0] = eventPrefix + args[0];
                switch (options) {
                    case 'previous':
                    case 'next':
                    case 'go':
                    case 'disable':
                    case 'enable':
                    case 'refresh':
                    case 'show':
                    case 'hide':
                    case 'destroy':
                        container.trigger.apply(this, args);
                        break;
                        // 得到选中页码
                    case 'getSelectedPageNum':
                        if (container.data('pagination').model) {
                            return container.data('pagination').model.pageNumber;
                        } else {
                            return container.data('pagination').attributes.pageNumber;
                        }
                        // 得到总页面
                    case 'getTotalPage':
                        return container.data('pagination').model.totalPage;
                        // 得到选中的页面数据
                    case 'getSelectedPageData':
                        return container.data('pagination').currentPageData;
                        // 分页是否被禁用
                    case 'isDisabled':
                        return container.data('pagination').model.disabled === true;
                    default:
                        throwError('Pagination do not provide action: ' + options);
                }
                return this;
            } else {
                // 卸载旧实例之前初始化一个新的
                uninstallPlugin(container);
            }
        } else {
            if (!Helpers.isObject(options)) {
                throwError('Illegal options');
            }
        }
        // 属性
        var attributes = $.extend({}, arguments.callee.defaults, options);
        // 检查参数
        parameterChecker(attributes);
        pagination.initialize();
        return this;
    };
    // 实例的默认值
    $.fn[pluginName].defaults = {
        // Data source
        // Array | String | Function | Object
        //dataSource: '',
        // String | Function
        //locator: 'data',
        // 总条目,必须指定分页是异步的
        totalNumber: 1,
        // 默认页数
        pageNumber: 1,
        // 每页的条目
        pageSize: 10,
        // 页面范围(当前页的两边)
        pageRange: 2,
        // 是否显示 'Previous' 按钮
        showPrevious: true,
        // 是否显示 'Next' 按钮
        showNext: true,
        // 是否显示分页按钮
        showPageNumbers: true,
        showNavigator: false,
        // 是否显示 'Go' 输入框
        showGoInput: false,
        // 是否显示 'Go' 按钮
        showGoButton: false,
        // 页面链接
        pageLink: '',
        // 'Previous' 文本
        prevText: '&laquo;',
        // 'Next' 文本
        nextText: '&raquo;',
        // 省略号文本
        ellipsisText: '...',
        // 'Go' 按钮文本
        goButtonText: 'Go',
        // 额外分页元素的样式名称
        //className: '',
        classPrefix: 'paginationjs',
        // 默认当前页的样式名
        activeClassName: 'active',
        // 默认禁用的样式名
        disableClassName: 'disabled',
        // 分页中ul的样式名
        //ulClassName: '',
        // 是否插入内联样式
        inlineStyle: true,
        formatNavigator: '<%= currentPage %> / <%= totalPage %>',
        formatGoInput: '<%= input %>',
        formatGoButton: '<%= button %>',
        // 分页元素在容器中的位置
        position: 'bottom',
        // 当第一页时自动隐藏上一页按钮
        autoHidePrevious: false,
        // 当最后一页时自动隐藏下一页按钮
        autoHideNext: false,
        //header: '',
        //footer: '',
        // 别名为自定义分页参数
        //alias: {},
        // 是否在初始化时触发分页
        triggerPagingOnInit: true,
        // 当不到一页的时候是否隐藏分页
        hideWhenLessThanOnePage: false,
        showFirstOnEllipsisShow: true,
        showLastOnEllipsisShow: true,
        // 分页回调
        callback: function() {}
    };
    // 注册钩子
    $.fn[pluginHookMethod] = function(hook, callback) {
        if (arguments.length < 2) {
            throwError('Missing argument.');
        }
        if (!$.isFunction(callback)) {
            throwError('callback must be a function.');
        }
        var container = $(this);
        var paginationData = container.data('pagination');
        if (!paginationData) {
            container.data('pagination', {});
            paginationData = container.data('pagination');
        }
        !paginationData.hooks && (paginationData.hooks = {});
        //paginationData.hooks[hook] = callback;
        paginationData.hooks[hook] = paginationData.hooks[hook] || [];
        paginationData.hooks[hook].push(callback);
    };
    // 静态方法
    $[pluginName] = function(selector, options) {
        if (arguments.length < 2) {
            throwError('Requires two parameters.');
        }
        var container;
        // 'selector' is a jQuery object
        if (typeof selector !== 'string' && selector instanceof jQuery) {
            container = selector;
        } else {
            container = $(selector);
        }
        if (!container.length) return;
        container.pagination(options);
        return container;
    };
    // ============================================================
    // helpers
    // ============================================================
    var Helpers = {};
    // Throw error
    function throwError(content) {
        throw new Error('Pagination: ' + content);
    }
    // 检查参数
    function parameterChecker(args) {
        if (!args.dataSource) {
            throwError('"dataSource" is required.');
        }
        if (typeof args.dataSource === 'string') {
            if (typeof args.totalNumber === 'undefined') {
                throwError('"totalNumber" is required.');
            } else if (!$.isNumeric(args.totalNumber)) {
                throwError('"totalNumber" is incorrect. (Number)');
            }
        } else if (Helpers.isObject(args.dataSource)) {
            if (typeof args.locator === 'undefined') {
                throwError('"dataSource" is an Object, please specify "locator".');
            } else if (typeof args.locator !== 'string' && !$.isFunction(args.locator)) {
                throwError('' + args.locator + ' is incorrect. (String | Function)');
            }
        }
    }
    // 卸载插件
    function uninstallPlugin(target) {
        var events = ['go', 'previous', 'next', 'disable', 'enable', 'refresh', 'show', 'hide', 'destroy'];
        // off events of old instance
        $.each(events, function(index, value) {
            target.off(eventPrefix + value);
        });
        // reset pagination data
        target.data('pagination', {});
        // remove old
        $('.paginationjs', target).remove();
    }
    // 对象类型检测
    function getObjectType(object, tmp) {
        return ((tmp = typeof(object)) == "object" ? object == null && "null" || Object.prototype.toString.call(object).slice(8, -1) : tmp).toLowerCase();
    }
    $.each(['Object', 'Array'], function(index, name) {
        Helpers['is' + name] = function(object) {
            return getObjectType(object) === name.toLowerCase();
        };
    });
    /*
     * export via AMD or CommonJS
     * */
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return $;
        });
    }
})(this, window.jQuery);
; /*!widget/Module.popover/xue.popover.js*/
/**
 * 提示弹出层封装
 * @authors duxinli
 * @date    2015-11-17
 * @version $Id$
 */
var popoverTips = popoverTips || {};
/**
 * 提示弹出层显示方法
 * @param  {Object} params 参数配置对象
 */
popoverTips.show = function(params) {
    params = $.extend({
        dom: null, //任意子节点
        placement: 'top', //弹出层显示位置
        trigger: 'click', //事件
        con: '', //提示内容，可以是function或者html字符串
        title: '', //title内容
        html: true //true |false
    }, params || {});
    //先清除已经存在的
    if ($('body').find('.popover[role="tooltip"]')) {
        $('body').find('.popover[role="tooltip"]').each(function() {
            var that = this;
            $(this).prev().prev().popover('destroy');
            $(this).siblings('.popover-mask-box').remove();
        })
    }
    //配置参数
    if (params.dom) {
        $(params.dom).popover({
            placement: params.placement,
            html: params.html,
            trigger: params.trigger,
            title: params.title,
            content: params.con
        });
        $(params.dom).popover('show');
    }
    //弹出展开的时候删除点击dom防止重复点击
    var _domW = $(params.dom).outerWidth();
    var _domH = $(params.dom).outerHeight();
    if ($(params.dom).nextAll('.popover-mask-box').length == 0) {
        $(params.dom).after('<span class="popover-mask-box"></span>');
        $(params.dom).nextAll('.popover-mask-box').css({
            width: _domW,
            height: _domH,
            marginLeft: -(_domW)
        });
    }
};
/**
 * 提示弹出层销毁方法
 * @param  {Object} dom 任意子节点
 */
popoverTips.destroy = function(dom) {
    $(dom).popover('destroy');
    $(dom).nextAll('.popover-mask-box').remove();
}
; /*!widget/Public.Dynamic/fresh.js*/
/*******************************************
 *
 * 新鲜事所有交互逻辑业务功能
 * @authors Du xin li
 * @date    2015-10-22
 * @version $Id$
 *
 *********************************************/
var fresh = fresh || {};
fresh.path = fresh.path || {};
//fresh.path.url = '/data/Dynamic/';
fresh.path.url = '/Dynamic/';
fresh.path.img = '/static/img/';
fresh.emoteHmtl = null;
/**
 * 
 * 动态切换大小图片、视频、作答效果
 * @param {Object} fm fresh.media前缀
 * 
 */
fresh.media = fresh.media || {};
(function(fm) {
    fm.img = fm.img || {};
    /**
     * 切换大小图片方法
     * @param  {Object} dom 任意子节点
     */
    fm.img.toggle = function(dom) {
        var _img = $(dom);
        //判断是否存在图片，如果不存在则返回false
        if (_img.length == 0) {
            return false;
        } else {
            var _url = _img.find('img').attr('src');
            if (_img.hasClass('fresh-media-img-list')) {
                if (_img.siblings('.fresh-type-img').find('img').length == 0) {
                    var _tpl = '<div class="fresh-media-big-img">\
                                    <img src="' + _url.replace("_small", "_big") + '">\
                                  </div>';
                    _img.siblings('.fresh-type-img').html(_tpl);
                }
            }
            _img.hide();
            _img.siblings('.fresh-type-img').show();
        }
    }
    fm.answer = fm.answer || {};
    /**
     * 点击作答按钮动态切换试题大小图方法
     * @param  {Object} dom 任意子节点
     */
    fm.answer.btnToggle = function(dom) {
        var that = $(dom),
            _wrap = that.closest('.fresh-detail'),
            _item = _wrap.find('.fresh-type-answer');
        _item.toggle();
        if (_item.hasClass('fresh-big-img-answer')) {
            _item.find('.fresh-sign-remove').remove();
        }
    }
    /**
     * 点击动态试题图片切换方法
     * @param  {Object} dom 任意子节点
     * @param  {Object} e event对象
     */
    fm.answer.imgToggle = function(dom, e) {
        var that = $(dom);
        if ($(e.target).data('type') == 'radio') {
            return false;
        } else {
            that.hide().siblings('.fresh-type-answer').show();
            if (that.hasClass('fresh-big-img-answer')) {
                that.find('.fresh-sign-remove').remove();
            }
        }
    }
    /**
     * 选择动态试题答案：提交答案
     * @param  {Object} dom 任意子节点
     */
    fm.answer.answerSubmit = function(dom) {
        var that = $(dom),
            selectAnswer_Box = that.closest('.fresh-big-answer'),
            smallAnswer_Box = that.closest('.fresh-type-answer').siblings('.fresh-type-answer').find('.fresh-media-small-img');
        //解析html
        var analysis_html = '<div class="fresh-big-analysis">$analysis$</div>';
        //增加答题正确与否与抢金币成功与否的图片提示html
        var bigSign_html = '<div class="fresh-big-sign-exam fresh-sign-remove"><img src="' + fresh.path.img + '$bigSignImg$.png"/></div>';
        //增加大图右上角正确或错误图标html
        var examRight_html = '<i class="fresh-bigimg-examIcon $examRightIcon$"></i>';
        //改变小图试题右上角正确或错误图标html
        var smallRight_html = '<i class="fresh-examIcon $smallRightIcon$"></i>';
        //作题结果提示html
        var examRezult_html = '',
            _url = window.location.pathname,
            _dynId = that.closest('.fresh-detail').data("id"),
            _stuAnswer = $.trim(that.text());
        $.ajax({
            //url: fresh.path.url + 'answer.json',
            url: fresh.path.url + 'ajaxSaveDynQueLog',
            //type : 'get',
            type: 'post',
            dataType: 'json',
            data: {
                url: _url,
                dynId: _dynId,
                stuAnswer: _stuAnswer
            },
            beforeSend: function() {
                $(dom).addClass('fresh-Answer-disabled');
            },
            success: function(data) {
                var _sign = data.sign;
                var dataMsg = data.msg;
                if (_sign == 0) {
                    alert(data.msg);
                    return false;
                } else if (_sign == 2) {
                    window.location.href = dataMsg;
                    return false;
                }
                // 增加解析内容
                if (dataMsg.analysisimg_path != '') {
                    analysis_html = analysis_html.replace('$analysis$', '<strong>解析</strong><img src="' + dataMsg.analysisimg_path + '">');
                } else {
                    analysis_html = analysis_html.replace('$analysis$', '');
                }
                selectAnswer_Box.after(analysis_html);
                // 增加右上角正确/错误提示图标
                if (dataMsg.is_right == '1') {
                    if (dataMsg.is_gold == '1') {
                        bigSign_html = bigSign_html.replace('$bigSignImg$', 'fresh_examtip1');
                    } else {
                        bigSign_html = bigSign_html.replace('$bigSignImg$', 'fresh_examtip');
                    }
                    examRight_html = examRight_html.replace('$examRightIcon$', 'fresh-bigimg-examIcon-right');
                    smallRight_html = smallRight_html.replace('$smallRightIcon$', 'fresh-examIcon-right');
                } else {
                    bigSign_html = bigSign_html.replace('$bigSignImg$', 'fresh_examtip2');
                    examRight_html = examRight_html.replace('$examRightIcon$', 'fresh-bigimg-examIcon-error');
                    smallRight_html = smallRight_html.replace('$smallRightIcon$', 'fresh-examIcon-error');
                }
                selectAnswer_Box.before(bigSign_html);
                selectAnswer_Box.after(examRight_html);
                smallAnswer_Box.append(smallRight_html);
                //作题结果提示
                examRezult_html += '您的答案是：<em>' + dataMsg.stu_answer + '</em>&nbsp;&nbsp;';
                examRezult_html += '&nbsp;&nbsp;参考答案是：<span>' + dataMsg.right_answer + '</span>&nbsp;&nbsp;&nbsp;&nbsp;';
                /*if(dataMsg.right_num <= 5){
                    examRezult_html += '<span class="fresh-sign-remove">每日五题已答对<em> '+ dataMsg.right_num +' </em>题</span>&nbsp;&nbsp;&nbsp;&nbsp;';
                }else{
                    examRezult_html += '<span class="fresh-sign-remove">每日五题已完成</span>';
                }
                examRezult_html += '<span class="fresh-sign-remove">你是第<em> '+ dataMsg.dyn_que_replynum +' </em>';*/
                examRezult_html += '<span class="fresh-sign-remove">你是第<em> ' + dataMsg.dyn_que_replynum + ' </em>个答题的学员，已有<em> ' + dataMsg.dyn_que_rightnum + ' </em>人答对!</span>';
                selectAnswer_Box.html(examRezult_html)
            },
            complete: function() {
                $(dom).removeClass('fresh-Answer-disabled');
            }
        });
    };
    fm.video = fm.video || {};
    /**
     * 新鲜事点击视频缩略图展开播放视频方法
     * @param  {Object} dom 任意子节点
     */
    /* fm.video.videoPlay = function(dom){
         var videoBox = $(dom).closest('.fresh-type-video');
         //视频div层显示
         videoBox.next().show();
         //视频缩略图隐藏
         videoBox.hide();//图隐藏
         var url = videoBox.next().data('url');
         var video_html ='<div class="fresh-media-big-video">'
                             + '<p class="fresh-media-packUp"><a href="javascript:void(0);" class="fresh-packUp-video">收起</a></p>'
                             + '<div id="flashcontent" style ="height:408px;">'
                             + '<object id="FlashID" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" height="408" width="600"> '
                             + '<param name="movie" value="http://www.xueersi.com/flash/xueersiPlayer.swf" />'
                             + '<param name="quality" value="high" />'
                             + '<param name="wmode" value="opaque" />'
                             + '<param name="allowscriptaccess" value="always">'
                             + '<param name="allowFullScreen" value="true" />'
                             + '<param name="swfversion" value="9.0.115.0" />'
                             + '<param name="FlashVars" value="url='+ url +'/&autoPlay=true" />'
                             + '<!-- 此 param 标签提示使用 Flash Player 6.0 r65 和更高版本的用户下载最新版本的 Flash Player。如果您不想让用户看到该提示，请将其删除。 -->'
                             + '<param name="expressinstall" value="./player/expressInstall.swf" />'
                             + '<!-- 下一个对象标签用于非 IE 浏览器。所以使用 IECC 将其从 IE 隐藏。 --> '
                             + '<!--[if !IE]>-->'
                             + '<object type="application/x-shockwave-flash" data="http://www.xueersi.com/flash/xueersiPlayer.swf" height="100%" width="100%">'
                             + '<!--<![endif]-->'
                             + '<param name="quality" value="high" />'
                             + '<param name="wmode" value="opaque" />'
                             + '<param name="allowscriptaccess" value="always">'
                             + '<param name="allowFullScreen" value="true" />'          
                             + '<param name="swfversion" value="9.0.115.0" />'         
                             + '<param name="expressinstall" value="player/expressInstall.swf" />'
                             +'<param name="FlashVars" value="url='+ url +'/&autoPlay=true" />'
                             +'<!-- 浏览器将以下替代内容显示给使用 Flash Player 6.0 和更低版本的用户。 -->'
                             +'<div>'
                             +'<h4>此页面上的内容需要较新版本的 Adobe Flash Player。</h4>'
                             +'<p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="获取 Adobe Flash Player" height="33" width="112" /></a></p>'
                             +'</div>'
                             +'<!--[if !IE]>-->'
                             +'</object>    '       
                             +'<!--<![endif]-->'
                             +'</object>'
                           + '</div>'
                         + '</div>'; 
         videoBox.next().html(video_html);  
     }*/
    fm.video.videoPlay = function(dom) {
        var videoBox = $(dom).closest('.fresh-type-video');
        //视频div层显示
        videoBox.next().show();
        //视频缩略图隐藏
        videoBox.hide(); //图隐藏
        var url = videoBox.next().data('url');
        var video_html = '<div class="fresh-media-big-video">' + '<p class="fresh-media-packUp"><a href="javascript:void(0);" class="fresh-packUp-video">收起</a></p>' + '<div id="flashcontent" style ="height:408px;">' + '<iframe src="' + url + '" frameborder="no" border="0" scrolling="no" width="100%" height="100%">iframe>' + '</div>' + '</div>';
        videoBox.next().html(video_html);
    }
    /**
     * 点击视频大图上的收起显示小图视频方法
     * @param  {Object} dom 任意子节点
     */
    fm.video.videoHide = function(dom) {
        var videoBox = $(dom).closest(".fresh-media-expand-video");
        videoBox.hide();
        videoBox.prev().show();
        videoBox.find(".fresh-media-big-video").remove();
    }
})(fresh.media);
/**
 * 
 * 评论所有相关业务
 * @param {Object} fc fresh.comment前缀
 * 
 */
fresh.comment = fresh.comment || {};
(function(fc) {
    fc.tpl = {
        formBox: '<form class="fresh-comment-form fresh-parentComment-formBox" action="javascript:void(0);">\
                      <div class="fresh-comment-title">\
                          <span class="fresh-comment-title-text pull-left">原文评论</span> \
                          <span class="fresh-comment-close-btn pull-right"></span>\
                      </div>\
                      <div class="fresh-comment-textarea">\
                        <textarea></textarea>\
                      </div>\
                      <div class="fresh-comment-func">\
                          <div class="fresh-comment-emote-smiles-btn fresh-emote-current" flag="0">\
                              <i class="fresh-comment-emote-btn"></i>\
                              <a href="javascript:void(0);" class="fresh-comment-emotetext">表情</a>\
                          </div>\
                          <div class="fresh-comment-btn">\
                             <span class="fresh-comment-size">您还可以输入<em class="fresh-comment-text-num"> 140 </em>字</span>\
                             <div class="fresh-comment-submit-btn">\
                                <a href="#" class="blue-radius-btn" data-toggle="modal" data-target="#fresh-dialog-verificationCode">评论</a>\
                             </div>\
                          </div>\
                          <span class="fresh-comment-tips hiding"></span>\
                      </div>\
                  </form>',
        replyForm: '<form class="fresh-comment-form fresh-comment-repley" action="javascript:void(0);">\
                      <div class="fresh-comment-textarea">\
                        <textarea>$textarea$</textarea>\
                      </div>\
                      <div class="fresh-comment-func">\
                          <div class="fresh-comment-emote-smiles-btn fresh-emote-current" flag="0">\
                              <i class="fresh-comment-emote-btn"></i>\
                              <a href="javascript:void(0);" class="fresh-comment-emotetext">表情</a>\
                          </div>\
                          <div class="fresh-comment-btn">\
                             <div class="fresh-comment-submit-btn">\
                                <a href="#" class="blue-radius-btn" data-toggle="modal" data-target="#fresh-dialog-verificationCode">评论</a>\
                             </div>\
                          </div>\
                          <span class="fresh-comment-tips hiding"></span>\
                      </div>\
                  </form>'
    };
    fc.param = {
        wraper: null, //单条评论信息fresh-detail类名
        commentBox: null, //单条评论信息评论框fresh-comment-box类名
        infoBox: null, //显示评论信息的fresh-comment-detail-info类名
        bar: null, //评论按钮fresh-comment-expand-btn类名
        close: null, //评论框的关闭按钮fresh-comment-close-btn类名
        form: null, //评论框文本域fresh-comment-textarea类名下的textarea
        submit: null, //提交评论按钮fresh-comment-submit-btn类名下的a
        textSzie: null, //评论文字限制区域的文字数量fresh-comment-text-num类名
        status: null //发送评论状态显示fresh-comment-status类名在fresh-comment-textarea的自己中
    };
    /**
     * 设置默认参数
     * @param  {Object} dom 任意子节点
     */
    fc.setParam = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var wraper = that.closest('.fresh-detail');
        if (wraper.length == 0) {
            return false;
        }
        //获取信息id
        this.id = wraper.data('id');
        var _infoBox = null;
        if (wraper.find('.fresh-comment-detail-info').length == 0) {
            _infoBox = wraper.closest('.fresh-comment-detail-info');
        } else {
            _infoBox = wraper.find('.fresh-comment-detail-info');
        }
        var _commentBox = null;
        if (wraper.find('.fresh-comment-box').length == 0) {
            _commentBox = wraper.closest('.fresh-comment-box');
        } else {
            _commentBox = wraper.find('.fresh-comment-box');
        }
        this.param = {
            wraper: wraper,
            commentBox: _commentBox,
            bar: wraper.find('.fresh-comment-expand-btn'),
            infoBox: _infoBox,
            close: wraper.find('.fresh-comment-close-btn'),
            form: wraper.find('.fresh-comment-textarea:eq(0) textarea'),
            submit: wraper.find('.fresh-comment-submit-btn:eq(0) a'),
            textSzie: wraper.find('.fresh-comment-form:eq(0)').find('.fresh-comment-text-num'),
            status: wraper.find('.fresh-comment-form:eq(0)').find('.fresh-comment-status'),
            tips: wraper.find('.fresh-comment-tips:eq(0)')
        };
    }
    /**
     * 点击评论切换评论框区域和评论消息方法
     * @param  {Object} dom 任意子节点
     */
    fc.toggle = function(dom) {
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        if (this.param.bar.hasClass('fresh-comment-show')) {
            this.hide();
        } else {
            this.show(dom);
        }
    }
    /**
     * 评论框区域和评论消息显示方法
     * @param  {Object} dom 任意子节点
     */
    fc.show = function(dom) {
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        this.param.bar.addClass('fresh-comment-show');
        this.getList(dom);
    }
    /**
     * 评论框区域和评论消息隐藏方法
     * @param  {Object} dom 任意子节点
     */
    fc.hide = function() {
        this.param.bar.removeClass('fresh-comment-show');
        this.param.commentBox.addClass('hiding');
        // 隐藏后初始化参数
        $.each(this.param, function(k, v) {
            fc.param[k] = null;
        });
    }
    /**
     * 关闭评论框方法
     * @param  {Object} dom 任意子节点
     */
    fc.close = function(dom) {
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        //判断评论类型，默认评论框是否显示data-type=2显示默认
        if (this.param.bar.data('type') && this.param.bar.data('type') == 2) {
            return false;
        }
        this.hide();
    }
    /**
     * 获取评论列表信息
     * @param  {Object} dom 任意子节点
     */
    fc.getList = function(dom) {
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var _params = fc.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').data('params');
        //ajax获取评论信息
        $.ajax({
            //url: fresh.path.url + "coment.html",
            //type: 'get',
            url: fresh.path.url + "dynComList",
            type: 'post',
            dataType: 'html',
            data: _params,
            beforeSend: function() {
                fc.param.infoBox.html('<span class="fresh-commentInfo-loading">Loading...</span>');
            },
            success: function(data) {
                fc.setMsg(data);
            },
            error: function(a, b, c) {
                alert(c);
            },
            complete: function() {
                fc.param.infoBox.find('.fresh-commentInfo-loading').remove();
            }
        });
    }
    /**
     * 设置评论内容信息方法
     * @param  {string} msg 评论信息html内容
     * @param  {Object} dom 任意子节点
     */
    fc.setMsg = function(msg) {
        if (!msg) {
            return false;
        }
        //如果没有评论消息返回的是暂无评论的html
        this.param.commentBox.removeClass('hiding');
        this.param.infoBox.html(msg);
        //评论发布框
        var _formBox = this.tpl.formBox;
        if (this.param.commentBox.find('.fresh-parentComment-formBox').length == 0) {
            this.param.commentBox.prepend(_formBox);
        }
        var _closeBtn = this.param.commentBox.find('.fresh-comment-close-btn');
        this.param.commentBox.find('.fresh-comment-form:eq(0) textarea').focus();
        var bar_type = this.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').data('type');
        //判断关闭按钮显示与否
        if (bar_type && bar_type == 2) {
            _closeBtn.hide();
        } else {
            _closeBtn.show();
        }
    }
    /**
     * 评论框文本域属于字数限制方法
     * @param  {string} dom 任意子节点
     */
    fc.textareaNum = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(that.val());
        var len = val.length;
        var form = that.closest('.fresh-comment-form'),
            size = form.find('.fresh-comment-size .fresh-comment-text-num');
        if (len > 140) {
            that.val(val.substring(0, 140));
            size.text(0);
            return false;
        } else {
            size.text(140 - len);
        }
    };
    /**
     * 设置评论数量方法
     * @param  {string} dom 任意子节点
     */
    fc.setcount = function() {
        var countbox = this.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').next('em').find('i');
        if (countbox.length == 0) {
            return false;
        }
        var _num = Number(countbox.text());
        _num++;
        countbox.text(_num);
    };
    /**
     * 发布评论方法
     * @param  {string} dom 任意子节点
     */
    fc.post = function(dom) {
        //判断元素节点是否存在
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(this.param.form.val());
        var len = val.length;
        if (len == 0) {
            alert('请您填写内容');
            return false;
        }
        //验证码的值
        var vd = $('#verificationCode').val() || '';
        var _tipCode = $('#fresh-dialog-tips-Code');
        var _params = fc.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').data('params');
        $.ajax({
            //url: fresh.path.url + 'ajaxAddDynComment.json',//添加成功与否验证ajax
            //data: param + '&content=' + encodeURIComponent(val) + '&verificationCode=' + vd,
            //type: 'get',
            url: fresh.path.url + 'ajaxAddDynComment', //添加成功与否验证ajax
            data: _params + "&content=" + encodeURIComponent(val) + "&verificationCode=" + vd,
            type: 'post',
            dataType: 'json',
            beforeSend: function() {
                fc.param.form.before('<div class="fresh-comment-status"><span class="fresh-comment-loading">Loading...</span></div>');
                fc.param.submit.before('<span class="fresh-comment-submit-disabled"></span>');
                $('.fresh-dialog-verificationCode .fresh-dialog-sure-btn a').addClass('fresh-dialog-btn-disabled');
                //重新设置参数才能获取到动态增加的元素状态
                fc.setParam(dom);
            },
            success: function(data) {
                var tp = data.sign,
                    msg = data.msg;
                if (tp === 0) {
                    alert(msg);
                    //fc.param.form.val('');
                    //fc.param.textSzie.text(140);
                    return false;
                } else if (tp === 1) {
                    //关闭验证弹出层
                    $('#fresh-dialog-verificationCode').modal('hide');
                    fc.param.form.val('');
                    fc.param.status.html('<span class="fresh-comment-success">发布成功</span>');
                    //获取信息列表
                    fc.getList(dom);
                    fc.setcount();
                    //文本框清空后可属于数字还原
                    fc.param.textSzie.text(140);
                } else if (tp === 2) {
                    //跳转页面
                    window.location.href = msg;
                } else if (tp === 3) {
                    _tipCode.text(msg);
                    $('#verificationCode').focus();
                    $('.fresh-dialog-verificationCode .fresh-dialog-sure-btn a').removeClass('fresh-dialog-btn-disabled');
                    return false;
                } else {
                    return false;
                }
            },
            error: function(a, b, c) {
                fc.param.form.before('<div class="fresh-comment-status"><span class="fresh-comment-warning">' + c + '</span></div>');
            },
            complete: function() {
                setTimeout(function() {
                    fc.param.status.fadeOut('fast', function() {
                        $(this).remove();
                    });
                    fc.param.submit.closest('.fresh-comment-func').find('.fresh-comment-submit-disabled').remove();
                    $('#verificationCode').focus();
                }, 1000);
            }
        });
    }
    /**
     * 验证码弹出层方法
     * @param  {string} code 任意文本字符串
     */
    fc.VerificationBox = function(code) {
        var codeHtml = '<div class="fresh-dialog-verificationCode">\
                            <div class="fresh-dialog-content">\
                               <div class="fresh-dialog-medal">\
                                   <div class="fresh-dialog-medal-tips">\
                                       <span>您连续评论次数太多了，请输入验证码完成发布。</span>\
                                   </div>\
                                   <div class="fresh-dialog-medal-img">\
                                        <span>验证码</span>\
                                        <input type="text" autocomplete="off" maxlength="4" id="verificationCode" name="verificationCode">\
                                        <span>\
                                          <img width="60" height="20" id="verificationImg" alt="验证码" src="https://www.xueersi.com/verifications/show?AY2N5mp5im13" title="(看不清，换一张)">\
                                        </span>\
                                    </div>\
                                    <span id="fresh-dialog-tips-Code"></span>\
                                    <div class="fresh-dialog-sure-btn">\
                                        <a href="###" class="blue-radius-btn">确定</a>\
                                    </div>\
                               </div>\
                            </div>\
                        </div>'
        return codeHtml;
    }
    /**
     * 发布评论检测是否需要验证码
     * @param  {string} dom 任意子节点
     */
    fc.sendComment = function(dom) {
        //判断元素节点是否存在
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(this.param.form.val());
        var len = val.length;
        if (len == 0) {
            this.param.tips.removeClass('hide').html('请您填写内容');
            return false;
        }
        this.param.tips.addClass('hide').html('');
        var _dataInfo = $(dom).closest('.fresh-comment-box').prev('.fresh-barinfo').find('.fresh-comment-expand-btn');
        var _par = _dataInfo.data('params');
        var _ty = _dataInfo.data('codetype');
        $.ajax({
            //url: fresh.path.url + 'ajaxCheckVerCode.json',
            //type: 'get',
            url: fresh.path.url + 'ajaxCheckVerCode',
            type: 'post',
            dataType: 'JSON',
            data: _par + '&codetype=' + _ty,
            success: function(data) {
                var tp = data.sign,
                    msg = data.msg;
                if (tp === 0) { //错误提醒   
                    alert(msg);
                    // fc.param.form.val(val);
                    fc.param.textSzie.text(140);
                    return false;
                } else if (tp === 1) { //不需要验证码验证直接提交
                    fc.post(dom);
                } else if (tp === 2) { //跳转页面
                    window.location.href = msg;
                } else if (tp === 3) { //需要验证码 弹出证码提示框
                    //弹出层现实效果
                    createModal.show({
                        id: 'fresh-dialog-verificationCode',
                        cls: 'fresh-dialog--modal-verification',
                        title: '提示',
                        content: fc.VerificationBox()
                    });
                    // $('#fresh-dialog-verificationCode').modal('show');
                    $('#fresh-dialog-verificationCode').modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true
                    })
                    fc.changeVerificationImg('verificationImg');
                    //切换验证码
                    $('#verificationImg').off('click').on('click', function() {
                        fc.changeVerificationImg('verificationImg');
                    })
                    //点击验证码弹出层中的确定按钮
                    $('body').off('click').on('click', '.fresh-dialog-sure-btn a', function() {
                        if ($(this).hasClass('fresh-dialog-btn-disabled')) {
                            return false;
                        }
                        var _val = $('#verificationCode').val();
                        var _tipCode = $('#fresh-dialog-tips-Code');
                        if (_val == '') {
                            _tipCode.text('请输入验证码');
                            $('#verificationCode').focus();
                            return false;
                        } else if (!/^[a-zA-Z0-9]{4,4}$/.test(_val)) {
                            _tipCode.text('验证码错误，请重新输入');
                            $('#verificationCode').focus();
                            return false;
                        } else {
                            fc.post(dom);
                            //$('#fresh-dialog-verificationCode').modal('hide');
                        }
                    })
                } else {
                    return false;
                }
            }
        });
    }
    /**
     * 调用验证码方法
     * @param  {imgId} dom 任意子节点
     */
    fc.changeVerificationImg = function(imgId) {
        $.ajax({
            url: fresh.path.url + 'ajaxGetVerCode',
            type: 'post',
            dataType: 'json',
            success: function(data) {
                if (data.sign == 1) {
                    $('img[id="' + imgId + '"]').attr('src', data.msg);
                }
            }
        })
    }
    /**
     * 评论列表里回复区域评论切换
     * @param  {string} dom 任意子节点
     */
    fc.replyToggle = function(dom) {
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        var _tpl = this.tpl.replyForm,
            _wraper = this.param.wraper,
            _text = _wraper.find('.fresh-text .fresh-info')
        _user = _wraper.find('.fresh-text .fresh-uesr'),
            _bar = _wraper.find('.fresh-barinfo');
        //将HTML大写标签转换为小写
        _text = _text.html().replace(/<[^>].*?>/g, function(a1) {
            var dom = a1.toLowerCase();
            return dom;
        });
        //查找img标签，替换为img的title
        _text = _text.replace(/<img.*?>/g, function(a1) {
            var img = $(a1),
                tit = img.attr('title');
            if (img.attr('src').indexOf('http://img04.xesimg.com/icon/emoji') > -1) {
                return '[' + tit + ']';
            } else {
                return a1;
            }
        });
        // 再去掉内容中的所有标签
        _text = _text.replace(/<[^>].*?>/g, '');
        _tpl = _tpl.replace('$textarea$', '//@' + _user.data('user') + ' ' + _text);
        var form = _bar.next('.fresh-comment-repley');
        if (form.length == 0) {
            _bar.after(_tpl);
            _bar.next().find('.fresh-comment-textarea textarea').focus();
        } else {
            form.remove();
        }
    }
    /**
     * 点击表情按钮插入表情方法
     * @param  {string} dom 任意子节点
     * @param  {Object} event event对象
     * @param  {number} send 判断是发送新鲜事表情还是评论中的表情,send存在是发送新鲜事的表情，不存在是评论
     */
    fc.emote = function(dom, event, send) {
        //当前文本框textarea
        var _currentTextarea = null;
        //判断是评论中表情还是发送新鲜事表情
        if (send) {
            _currentTextarea = $(dom).closest('.fresh-send-box').find('.fresh-send-textareaBox');
        } else {
            if (dom) {
                this.setParam(dom);
            } else {
                return false;
            }
            _currentTextarea = this.param.form;
        }
        var e = window.event || event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (!fresh.emoteHmtl) {
            $.ajax({
                //url: fresh.path.url + 'emote.html',
                //type: 'get',
                url: fresh.path.url + 'ajaxGetEmoList',
                type: 'post',
                dataType: 'html',
                success: function(data) {
                    fresh.emoteHmtl = data;
                    fresh.emote.show(dom, _currentTextarea);
                }
            })
        } else {
            fresh.emote.show(dom, _currentTextarea);
        }
    }
    /**
     * tab标枪切换方法
     * @param  {Object} tabTit 任意子节点
     * @param  {Object} on 任意类名
     * @param  {Object} tabCon 任意子节点
     */
    fc.emoteTabs = function(tabTit, on, tabCon) {
        $(tabTit).children().click(function() {
            $(this).addClass(on).siblings().removeClass(on);
            var index = $(tabTit).children().index(this);
            $(tabCon).children().eq(index).show().siblings('ul').hide();
        });
    }
    /**
     * 删除新鲜事或者评论弹出层方法
     * @param {string} cont 提示文本
     * @return {html} html元素
     */
    fc.delDialog = function(cont) {
        var delComment_html = '<div class="fresh-dialog-delete">\
                                 <div class="fresh-dialog-delete-content">\
                                      <p class="fresh-dialog-delete-tips">' + cont + '</p>\
                                      <div class="fresh-dialog-delete-btn">\
                                         <a href="javascript:void(0);" class="fresh-btn fresh-sure-btn">确定</a>\
                                         <a href="javascript:void(0);" class="fresh-btn fresh-cancel-btn">取消</a>\
                                      </div>\
                                 </div>\
                             </div>'
        return delComment_html;
    }
    /**
     * 删除新鲜事和评论方法
     * @param  {string} dom 任意子节点
     */
    fc.delComment = function(dom) {
        var that = $(dom);
        if (dom) {
            this.setParam(dom);
        } else {
            return false;
        }
        //判断删除的是新鲜事还是评论中的删除
        var _type = $(dom).data().sign;
        //需要传递的参数
        var _data = $(dom).data('params');
        var _url = $(dom).data('url');
        //提示信息
        var tipInfo = null;
        if (_type == 1) {
            tipInfo = '你确定删除该新鲜事吗?';
        } else if (_type == 2) {
            tipInfo = '你确定删除该评论吗?';
        }
        //提示弹出层显示
        popoverTips.show({
            dom: that,
            placement: 'top',
            trigger: 'click',
            con: fc.delDialog(tipInfo)
        });
        //点击确认按钮删除
        $('body').off('click', '.fresh-dialog-delete .fresh-sure-btn').on('click', '.fresh-dialog-delete .fresh-sure-btn', function() {
            $.ajax({
                //url: fresh.path.url + "ajaxDelDynamic.json",
                //type: 'get',
                url: fresh.path.url + _url,
                type: 'post',
                dataType: 'json',
                data: _data,
                success: function(data) {
                    var _tp = data.sign;
                    _msg = data.msg;
                    if (_tp == 0) {
                        alert(_msg);
                        return false;
                    } else if (_tp == 1) {
                        if (_type == 2) {
                            var changebox = fc.param.commentBox.prev('.fresh-barinfo').find('.fresh-comment-expand-btn').next('em').find('i');
                            if (changebox.length == 0) {
                                return false;
                            }
                            var _num = Number(changebox.text());
                            _num--;
                            changebox.text(_num);
                            fc.getList(dom);
                        } else if (_type == 1) {
                            var changeText = "抱歉，该新鲜事已被删除";
                            var changeBox = fc.param.wraper.find('.fresh-text:eq(0) .fresh-info');
                            changeBox.html(changeText);
                            //删除右侧文本中除了文本头部和显示时间的地方
                            fc.param.commentBox.remove(); //删除评论框所有信息
                            fc.param.wraper.find('.fresh-media').remove(); //删除图片
                            fc.param.wraper.find('.fresh-barinfo:eq(0) .fresh-right').remove(); //删除评论和删除以及收藏按钮
                        } else {
                            return false;
                        }
                    } else if (_tp == 2) {
                        window.location.href = _msg;
                        return false;
                    } else {
                        return false;
                    }
                    popoverTips.destroy(dom);
                }
            });
        })
        //点击取消按钮
        $('body').off('click', '.fresh-dialog-delete .fresh-cancel-btn').on('click', '.fresh-dialog-delete .fresh-cancel-btn', function() {
            popoverTips.destroy(dom);
        })
    }
})(fresh.comment);
/**
 * 
 * 添加收藏和取消收藏相关业务
 * @param {Object} fc fresh.collect
 * 
 */
fresh.collect = fresh.collect || {};
(function(fl) {
    /**
     * 收藏相关的弹出层方法
     * @param  {html | string} cont html字符串
     */
    fl.dialogBox = function(cont) {
        var collect_html = '<div class="fresh-dialog-collect">\
                               <div class="fresh-dialog-collect-content">\
                                   <div class="fresh-dialog-success">\
                                      <i class="fresh-dialog-collect-icon"></i>\
                                      ' + cont + '\
                                   </div>\
                               </div>\
                           </div>';
        return collect_html;
    }
    /**
     * 添加收藏方法
     * @param  {string} dom 任意子节点
     */
    fl.add = function(dom) {
        var that = $(dom);
        var params = $(dom).data().params;
        if (!params) {
            return false;
        }
        that.removeClass('fresh-collect-add-btn');
        $.ajax({
            //url: fresh.path.url + 'ajaxAddCollect.json',
            //type : 'get',
            url: fresh.path.url + 'ajaxAddCollect',
            type: 'post',
            data: params,
            dataType: 'json',
            success: function(data) {
                var _sign = data.sign;
                if (_sign == 0) {
                    alert(data.msg);
                    return false;
                } else if (_sign == 2) {
                    window.location.href = data.msg;
                    return false;
                }
                if (data) {
                    popoverTips.show({
                        dom: that,
                        placement: 'top',
                        trigger: 'click',
                        con: fl.dialogBox(data.msg)
                    });
                    var collectBox = that.nextAll('em').find('i');
                    setTimeout(function() {
                        that.html('取消收藏');
                        //改变收藏的数量
                        if (collectBox.length > 0) {
                            var _num = Number(collectBox.text());
                            _num++;
                            collectBox.text(_num);
                        }
                        that.addClass('fresh-collect-cancel-btn');
                        popoverTips.destroy(dom);
                    }, 1000);
                } else {
                    popoverTips.destroy(dom);
                    that.addClass('fresh-collect-cancel-btn');
                }
            },
            error: function() {
                popoverTips.destroy(dom);
            }
        });
    }
    /**
     * 取消收藏方法
     * @param  {string} dom 任意子节点
     */
    fl.cancel = function(dom) {
        var that = $(dom);
        var params = $(dom).data().params;
        if (!params) {
            return false;
        }
        that.removeClass('fresh-collect-cancel-btn');
        $.ajax({
            //url: fresh.path.url + 'ajaxCancelCollect.json',
            //type : 'get',
            url: fresh.path.url + 'ajaxCancelCollect',
            type: 'post',
            data: params,
            dataType: 'json',
            success: function(data) {
                var _sign = data.sign;
                if (_sign == 0) {
                    alert(data.msg);
                    return false;
                } else if (_sign == 2) {
                    window.location.href = data.msg;
                    return false;
                }
                if (data) {
                    //取消收藏成功弹出层显示
                    popoverTips.show({
                        dom: that,
                        placement: 'top',
                        trigger: 'click',
                        con: fl.dialogBox(data.msg)
                    });
                    var collectBox = that.nextAll('em').find('i');
                    setTimeout(function() {
                        that.html('收藏');
                        //改变收藏的数量
                        if (collectBox.length > 0) {
                            var _num = Number(collectBox.text());
                            if (_num > 0) {
                                _num--;
                            } else {
                                return false;
                            }
                            collectBox.text(_num);
                        }
                        that.addClass('fresh-collect-add-btn');
                        popoverTips.destroy(dom);
                    }, 1000);
                } else {
                    popoverTips.destroy(dom);
                    that.addClass('fresh-collect-add-btn');
                }
            },
            error: function() {
                popoverTips.destroy(dom);
            }
        });
    }
})(fresh.collect)
/**
 * 
 * 发送新鲜事相关业务
 * @param {Object} fc fresh.send
 * 
 */
fresh.send = fresh.send || {};
(function(fs) {
    /**
     * 限制发送新鲜事文本域可输入字数方法
     * @param  {string} dom 任意子节点
     */
    fs.limitNum = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(that.val());
        var len = val.length;
        var sendBox = that.closest('.fresh-send-box'),
            size = sendBox.find('.fresh-send-text-num');
        if (len > 140) {
            that.val(val.substring(0, 140));
            size.text(0);
            return false;
        } else {
            size.text(140 - len);
        }
    };
    /**
     * 发布新鲜事图片上传方法
     * @param  {string} dom 任意子节点
     */
    fs.fileupload = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        if (that.val() == '') {
            return false;
        }
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(dom.value)) {
            alert('图片格式无效！');
            return false;
        }
        //显示图片预览区域
        $('#fresh-send-preview').removeClass('hiding');
        $('.fresh-send-preview-imgvideo').find('img').attr('src', 'http://img04.xesimg.com/loading.gif');
        this.setImagePreview('fresh-fileToUpload', 'fresh-send-preview-imgvideo', 120, 36);
    };
    /**
     * 上传图片本地预览方法
     * @param {Object} fileObj 上传文件file的id元素  fresh-fileToUpload 
     * @param {Object} previewObj 预览图片的父层id元素  fresh-send-preview-imgvideo
     * @param {Number} maxWidth 预览图最大宽  
     * @param {Number} minWidth 预览图最小宽  
     */
    fs.setImagePreview = function(fileObj, previewObj, maxWidth, minWidth) {
        var docObj = document.getElementById(fileObj);
        var imgObjPreview = document.getElementById(previewObj);
        if (docObj.files && docObj.files[0]) {
            //火狐下，直接设img属性
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            imgObjPreview.innerHTML = '<img id="fresh-send-preview-img"><i class="fresh-preview-close"></i>';
            var img = document.getElementById('fresh-send-preview-img');
            img.src = window.URL.createObjectURL(docObj.files[0]);
        } else {
            //IE下，使用滤镜
            try {
                var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
                docObj.select();
                imgObjPreview.focus(); //防止在ie9下拒绝访问，解决办法是让其他的div元素获取焦点
                var imgSrc = document.selection.createRange().text;
                imgObjPreview.innerHTML = '<img id="fresh-send-preview-img"><i class="fresh-preview-close"></i>';
                var img = document.getElementById('fresh-send-preview-img');
                img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc;
                //var rate = (maxWidth/img.height>maxWidth/img.width?maxWidth/img.width:maxHeight/img.height);
                //等比例缩放图片的大小
                var rate = (img.offsetWidth > maxWidth) ? (maxWidth / img.offsetWidth) : (img.offsetWidth > minWidth ? 1 : minWidth / img.offsetWidth);
                imgObjPreview.innerHTML = "<div id='fresh-send-preview-img' style='width:" + img.offsetWidth * rate + "px;height:" + img.offsetHeight * rate + "px;" + sFilter + imgSrc + "\"'></div><i class='fresh-preview-close'></i>";
            } catch (e) {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            //document.selection.empty();
        }
        //return true;
    }
    /**
     * 点击发送按钮，弹出发送新鲜事弹出框的方法
     * @param  {string} dom 任意子节点
     */
    fs.box = function(dom) {
        //虚拟弹出层显示新鲜事弹出层
        var _sendBox = '<form class="fresh-send-box" method="POST" action="/Dynamic/addDynamic" enctype="multipart/form-data" name="formsubmitf">\
                            <textarea class="fresh-send-textareaBox" name="content"></textarea>\
                            <div class="fresh-send-preview hiding" id="fresh-send-preview">\
                                 <div class="fresh-send-preview-imgvideo" id="fresh-send-preview-imgvideo">\
                                     <img id="fresh-send-preview-img" src="">\
                                     <i class="fresh-preview-close"></i>\
                                 </div>\
                            </div>\
                            <div class="fresh-send-form">\
                                 <div class="fresh-send-emote-click-btn fresh-emote-current" flag="0">\
                                    <i class="fresh-send-emote"></i>\
                                    <a href="javascript:void(0);">表情</a>\
                                 </div>\
                                 <div class="fresh-send-upload">\
                                    <input class="fresh-fileToUpload" id="fresh-fileToUpload" type="file" size="45" autocomplete="off"  name="dynImg" accept="image/*" />\
                                 </div>\
                                 <a href="javascript:void(0);">图片</a>\
                                 <em class="pull-left">（支持类型 JPG、PNG，大小不超过5M）</em>\
                                 <div class="fresh-send-submit-box pull-right">\
                                  <button class="blue-radius-btn fresh-send-submit-btn" type="button">发布</button>\
                                 </div>\
                                 <span class="pull-right">\
                                    <em class="pull-left">您还可以输入</em>\
                                    <em class="fresh-send-text-num pull-left">140</em>\
                                    <em class="pull-left">字</em>\
                                 </span>\
                                 <span class="fresh-comment-tips hiding"></span>\
                            </div>\
                            <input type="hidden" value="0" name="mypretime">\
                        </form>'
        createModal.show({
            id: 'fresh-sendInfo-box',
            cls: 'fresh-send-box-modal-dialog',
            title: '发新鲜事',
            width: 800,
            content: _sendBox
        });
        //点击关闭图片区域按钮
        $('body').off('click', '.fresh-send-box .fresh-preview-close').on('click', '.fresh-send-box .fresh-preview-close', function() {
            //删除图片同时清空file的值。以防再次上传同一张图片的时候change不改变无法正常运行
            $('.fresh-send-upload').html('<input class="fresh-fileToUpload" id="fresh-fileToUpload" type="file" size="45" autocomplete="off"  name="dynImg" accept="image/*" />')
            $('#fresh-send-preview').addClass('hiding');
        });
    };
    /**
     * 提交新鲜事方法
     * @param  {string} dom 任意子节点
     */
    fs.submit = function(dom) {
        var _form = $(dom);
        if (_form.length == 0) {
            return false;
        }
        var textarea = _form.find('textarea.fresh-send-textareaBox'),
            content = $.trim(textarea.val()),
            len = content.length;
        if (len < 10 || len > 140 || len == 0) {
            _form.find('.fresh-comment-tips').removeClass('hide').html('请填写内容，长度在10~140之间');
            return false;
        } else {
            _form.find('.fresh-comment-tips').addClass('hide').html('');
            _form.submit();
            $('#fresh-sendInfo-box').modal('hide');
        }
    };
    /**
     * 发送新鲜事检测数据时间方法
     * @param  {string} dom 任意子节点
     */
    fs.checkData = function() {
        Today = new Date();
        var NowHour = Today.getHours();
        var NowMinute = Today.getMinutes();
        var NowSecond = Today.getSeconds();
        var mysec = (NowHour * 3600) + (NowMinute * 60) + NowSecond;
        var a = document.formsubmitf.mypretime.value;
        if ((mysec - document.formsubmitf.mypretime.value) > 60) { //600只是一个时间值，就是5秒钟内禁止重复提交，值随你高兴设  
            document.formsubmitf.mypretime.value = mysec;
        } else {
            //alert(' 按一次就够了，请勿重复提交！请耐心等待！谢谢合作！'); 
            return false;
        }
        document.forms.formsubmitf.submit();
    }
})(fresh.send)
/**
 * 
 * 关注新鲜事相关业务
 * @param {Object} fc fresh.attention
 * 
 */
fresh.attention = fresh.attention || {};
(function(fa) {
    /**
     * 关注和取消新鲜事方法
     * @param  {string} dom 任意子节点
     */
    fa.addCancel = function(dom) {
        var _type = $(dom).data().type;
        var _params = $(dom).data().params + '&type=' + _type;
        $.ajax({
            //url: fresh.path.url + 'ajaxFollow.json',
            //type: "get",
            url: fresh.path.url + 'ajaxFollow',
            type: "post",
            timeout: 7000,
            dataType: 'json',
            data: _params,
            success: function(data) {
                if (data.sign == 2) {
                    window.location.href = data.msg;
                } else if (data.sign == 1) {
                    switch (_type) {
                        case 1:
                            $(e).html('<em>已关注</em>');
                            break;
                        case 2:
                            $(dom).html('<a href="javascript:void(0)" class="fresh-attention-btn fresh-add-attention-btn"><span class="fresh-add left">+</span><span class="left">关注</span></a>');
                            $(dom).data({
                                type: 3
                            });
                            break;
                        case 3:
                            $(dom).html('<em>已关注</em><i class="fresh-course-line">|</i><a href="javascript:void(0)" class="fresh-add-cancel-btn">取消</a>');
                            $(dom).data({
                                type: 2
                            });
                            break;
                    }
                } else {
                    alert(data.msg);
                    return false;
                }
            },
            error: function() {
                alert('数据读取错误..');
            }
        });
    }
})(fresh.attention)
/**
 * 
 * 表情相关业务
 * @param {Object} fe fresh.emote
 * 
 */
fresh.emote = fresh.emote || {};
(function(fe) {
    /**
     * 表情弹出层显示方法
     * @param  {string} dom 任意子节点
     * @param  {string} textarea 任意子节点
     */
    fe.show = function(dom, textarea) {
        popoverTips.show({
            dom: dom,
            placement: 'bottom',
            trigger: 'click',
            con: fresh.emoteHmtl
        })
        //表情按钮距离左边框的距离
        var _emoteLeft = $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').prevAll('.fresh-emote-current').offset().left;
        //表情弹出层宽度的一半
        var dialog_emoteW = $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').outerWidth() / 2;
        var _popoverW = 0;
        if (_emoteLeft < dialog_emoteW) {
            _popoverW = _emoteLeft;
        } else {
            _popoverW = dialog_emoteW - 25;
        }
        //箭头靠左显示
        $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').css('marginLeft', _popoverW);
        $('.fresh-dialog-emote').closest('.popover[role="tooltip"]').find('.arrow').css('left', '25px');
        //点击表情插入文本框
        $('.fresh-dialog-emote').off('click', '.fresh-jsSmilies li').on('click', '.fresh-jsSmilies li', function() {
            var _val = $(this).data('action');
            textarea.focus();
            textarea.insertContent(_val);
            popoverTips.destroy(dom);
        })
        //关闭表情层(关闭表情弹出层)
        $('.fresh-dialog-emote').off('click', '.fresh-smilies-close').on('click', '.fresh-smilies-close', function() {
            popoverTips.destroy(dom);
        });
        //tabs和分页切换
        fresh.comment.emoteTabs(".fresh-smilies-tabs", "current", ".fresh-dialog-smilies-box");
        fresh.comment.emoteTabs(".fresh-smilies-page-box", "current", ".fresh-dialog-smilies-con");
    }
})(fresh.emote)
/*******************************************
 *
 * 插入光标处的插件
 * @authors Du xin li
 * @update    2015-10-25
 *
 *********************************************/
$.fn.extend({
    insertContent: function(myValue, t) {
        var that = $(this);
        var $t = $(this)[0];
        if (document.selection) {
            this.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
            sel.moveStart('character', -l);
            var wee = sel.text.length;
            if (arguments.length == 2) {
                var l = $t.value.length;
                sel.moveEnd("character", wee + t);
                t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
                sel.select();
            }
        } else if ($t.selectionStart || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
            if (arguments.length == 2) {
                $t.setSelectionRange(startPos - t, $t.selectionEnd + t);
                this.focus();
            }
        } else {
            this.value += myValue;
            this.focus();
        }
    }
})
; /*!widget/Public.Dynamic/fresh.load.min.js*/
/*******************************************
 *
 * 新鲜事所有事件绑定功能
 * @authors Du xin li
 * @date    2015-10-22
 * @version $Id$
 *
 *********************************************/
$(function() {
    //清楚tab键盘获取焦点
    /* $('body').off('keydown').on('keydown', function(e){
          var ev = e || event;
         if (ev.keyCode == 9) {
             if (ev.preventDefault) {
                 ev.preventDefault();
             }
             else {
                 window.event.returnValue = false;
             }
         }    
      })*/
    //动态大小图片切换功能
    $('.fresh-main-wrapper').off('click', '.fresh-type-img div').on('click', '.fresh-type-img div', function() {
        var that = $(this).closest('.fresh-type-img');
        fresh.media.img.toggle(that);
    })
    // 动态中点击“作答”切换做题效果
    $('.fresh-main-wrapper').off('click', '.fresh-answer-btn').on('click', '.fresh-answer-btn', function() {
        fresh.media.answer.btnToggle(this);
    });
    // 点击动态试题图片切换方法
    $('.fresh-main-wrapper').off('click', '.fresh-type-answer .fresh-media-small-img').on('click', '.fresh-type-answer .fresh-media-small-img', function(e) {
        var that = $(this).closest('.fresh-type-answer');
        fresh.media.answer.imgToggle(that, e);
    });
    $('.fresh-main-wrapper').off('click', '.fresh-big-img-answer').on('click', '.fresh-big-img-answer', function(e) {
        fresh.media.answer.imgToggle(this, e);
    });
    // 选择动态试题答案：提交答案
    $('.fresh-main-wrapper').off('click', '.fresh-big-selectAnswer a[data-type="radio"]').on('click', '.fresh-big-selectAnswer a[data-type="radio"]', function() {
        if (!$(this).hasClass('fresh-Answer-disabled')) {
            fresh.media.answer.answerSubmit(this);
        }
    });
    //点击视频小图显示视频大图效果
    $('.fresh-main-wrapper').off('click', '.fresh-type-video .fresh-media-small-video').on('click', '.fresh-type-video .fresh-media-small-video', function() {
        fresh.media.video.videoPlay(this);
    });
    //点击视频大图上的收起显示小图视频效果
    $('.fresh-main-wrapper').off('click', '.fresh-packUp-video').on('click', '.fresh-packUp-video', function() {
        fresh.media.video.videoHide(this);
    });
    /* ================= 评论相关 ============= */
    //点击父级评论按钮切换评论框区域和消息
    $('.fresh-main-wrapper').off('click', '.fresh-comment-expand-btn').on('click', '.fresh-comment-expand-btn', function() {
        var that = $(this);
        if (that.data('type') && that.data('type') == 2) {
            return false;
        }
        fresh.comment.toggle(this);
    });
    //点击关闭评论框按钮
    $('.fresh-main-wrapper').off('click', '.fresh-comment-close-btn').on('click', '.fresh-comment-close-btn', function() {
        fresh.comment.close(this);
    });
    //限制文本域字数显示
    $('.fresh-main-wrapper').off('input keyup paste focus', '.fresh-comment-textarea textarea').on('input keyup paste focus', '.fresh-comment-textarea textarea', function() {
        var that = this;
        setTimeout(function() {
            fresh.comment.textareaNum(that);
        }, 10);
    });
    //点击发布评论内容按钮
    $('.fresh-main-wrapper').off('click', '.fresh-comment-submit-btn a').on('click', '.fresh-comment-submit-btn a', function() {
        fresh.comment.sendComment(this);
    });
    // 点击评论列表里回复区域评论切换
    $('.fresh-main-wrapper').off('click', '.fresh-comment-list .fresh-barinfo .fresh-childComment-expand-btn').on('click', '.fresh-comment-list .fresh-barinfo .fresh-childComment-expand-btn', function() {
        fresh.comment.replyToggle(this);
    });
    // 点击表情按钮,弹出表情弹出层
    $('.fresh-main-wrapper').off('click', '.fresh-comment-emote-smiles-btn').on('click', '.fresh-comment-emote-smiles-btn', function(event) {
        fresh.comment.emote(this, event);
    });
    //点击删除新鲜事和评论的删除
    $('.fresh-main-wrapper').off('click', '.fresh-barinfo a.fresh-del-msg').on('click', '.fresh-barinfo a.fresh-del-msg', function() {
        fresh.comment.delComment(this);
    });
    /* ================= 收藏相关 ============= */
    //点击添加收藏按钮
    $('.fresh-main-wrapper').off('click', '.fresh-collect-add-btn').on('click', '.fresh-collect-add-btn', function() {
        fresh.collect.add(this);
    });
    //点击取消收藏按钮
    $('.fresh-main-wrapper').off('click', '.fresh-collect-cancel-btn').on('click', '.fresh-collect-cancel-btn', function() {
        fresh.collect.cancel(this);
    });
    /* ================= 发布新鲜事相关 ============= */
    //限制发布新鲜事文本域字数显示
    $('body').off('input keyup paste focus', '.fresh-send-textareaBox').on('input keyup paste focus', '.fresh-send-textareaBox', function() {
        var that = this;
        setTimeout(function() {
            fresh.send.limitNum(that);
        }, 10);
    });
    // 点击表情按钮,弹出表情弹出层
    $('body').off('click', '.fresh-send-emote-click-btn').on('click', '.fresh-send-emote-click-btn', function(event) {
        fresh.comment.emote(this, event, 'send');
    });
    // 发布新鲜事里面的选择上传图片
    $('body').off('change', '.fresh-send-form #fresh-fileToUpload').on('change', '.fresh-send-form #fresh-fileToUpload', function() {
        fresh.send.fileupload(this);
    });
    //点击发送新鲜事按钮应该是弹出层
    $('#freshPost').bind('click', function() {
        fresh.send.box(this);
    })
    //发送新鲜事提交表单前的数据时间验证
    $('body').off('submit', 'form.fresh-send-box').on('submit', 'form.fresh-send-box', function() {
        fresh.send.checkData();
    })
    //点击发送按钮
    $('body').off('click', '.fresh-send-box .fresh-send-submit-btn').on('click', '.fresh-send-box .fresh-send-submit-btn', function() {
        var that = $(this);
        var form = that.closest('form.fresh-send-box');
        fresh.send.submit(form);
    })
    /* ================= 关注相关 ============= */
    //点击添加关注按钮
    /* $('.fresh-main-wrapper').off('click', '.fresh-course-attention .fresh-add-attention-btn').on('click', '.fresh-course-attention .fresh-add-attention-btn', function(){
         var that = $(this).closest('.fresh-course-attention');
         fresh.attention.addCancel(that);
     })
     //点击添加取消关注按钮
     $('.fresh-main-wrapper').off('click', '.fresh-course-attention .fresh-add-cancel-btn').on('click', '.fresh-course-attention .fresh-add-cancel-btn', function(){
         var that = $(this).closest('.fresh-course-attention');
         fresh.attention.addCancel(that);
     })*/
    //默认展开评论直接走fresh.getList.getList(dom);并且一个页面只有一个fresh-list评论
    /* var dom = $('.fresh-list').find('.fresh-barinfo');
     fresh.comment.getList(dom);*/
    //点击详情区域事件
    $('.fresh-hover-item').off('click').on('click', function(event) {
        if ($(event.target).attr('href') || $(event.target).attr('date-role') == 'fresh-avatar') {
            return; //return 把控制权返回给页面,不响应这个点击事件，不能用return false,否则正常的链接无法点击使用
        } else {
            var url = $(this).find('.fresh-barinfo a').attr('href');
            window.open(url);
        }
    })
})
; /*!widget/Public.Module/collectApp.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
var colect = colect || {};
/**
 * 
 * 动态切换大小图片、视频、作答效果
 * @param {Object} fm colect.media前缀
 * 
 */
colect.media = colect.media || {};
(function(fm) {
    fm.img = fm.img || {};
    /**
     * 切换大小图片方法
     * @param  {Object} dom 页面元素
     */
    fm.img.toggle = function(dom) {
        var _img = $(dom);
        //判断是否存在图片，如果不存在则返回false
        if (_img.length == 0) {
            return false;
        } else {
            var _url = _img.find('img').attr('src');
            if (_img.hasClass('colect-media-img-list')) {
                if (_img.siblings('.colect-type-img').find('img').length == 0) {
                    var _tpl = '<div class="colect-media-big-img">\
                    <img src="' + _url.replace("_small", "_big") + '">\
                    </div>';
                    _img.siblings('.colect-type-img').html(_tpl);
                }
            }
            _img.hide();
            _img.siblings('.colect-type-img').show();
        }
    }
    fm.answer = fm.answer || {};
})(colect.media);
$('.collect-feed').off('click', '.colect-type-img').on('click', '.colect-type-img', function() {
    colect.media.img.toggle(this);
});
//音频时间长短控制背景长度
$(function() {
    var $times = $('.icoVoiceCon .voiceTime em');
    $times.each(function() {
        var $len = $(this).text();
        var $con = $(this).parents('.icoVoiceCon');
        if ($len > 0) {
            $con.css('width', '80px');
        }
        if ($len > 20) {
            $con.css('width', '100px');
        }
        if ($len > 40) {
            $con.css('width', '120px');
        }
    });
    //点击播放音频
    $('.content-collect').on('click', '.icoVoiceCon span.icoVoice', function() {
        var that = $(this),
            par = that.parents('.collect-feed'),
            len = par.hasClass('icoVoicePlaying'),
            _url = $('#audioUrl');
        var times = that.next().find('em').text();
        // alert(times);
        var ur = that.parents('.icoVoiceCon').find('#voiceUrl').val();
        if (len === false) {
            // alert(1111)
            par.addClass('icoVoicePlaying').siblings().removeClass('icoVoicePlaying');
            _url.attr('src', ur);
        } else {
            // alert(222)
            par.removeClass('icoVoicePlaying');
            _url.attr('src', 'http://img04.xesimg.com/xuelibugou_logo.png');
        };
        setTimeout(function() {
            par.removeClass('icoVoicePlaying');
            _url.attr('src', 'http://img04.xesimg.com/xuelibugou_logo.png');
        }, times + '000');
    });
    $('.content-collect').on('click', '.feed-media', function() {
        $(this).addClass('hide').siblings('').removeClass('hide');
    });
});
; /*!widget/Public.Module/courses_dialog.js*/
/*
 * XESUI
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 声明 xue 包：增加别名“X”
 *
 * @author Marco (marco@xesui.com)
 * @modify 2014-07-28 20:02:08
 * @version $Id$
 *
 * @links http://xesui.com
 */
var X, xue;
xue = xue || function(expr, fn) {
    return xue.dom ? xue.dom(expr, fn) : {};
};
X = xue;
window.xue = xue;
xue.version = '10551';
xue.id = 'xesui';
xue.guid = '$XESUI$';
xue.team = {
    Marco: 'Marco@xesui.com',
    Alex: 'Alex@xesui.com',
    oba: 'oba@xesui.com'
};
xue.expr = '';
xue.host = window.location.host;
var _host = xue.host.split('.');
if (_host.length > 2) {
    xue.subdomain = _host[0];
    xue.domain = _host[1];
}
/* ========================== 公共方法 =========================== */
xue.random = function(min, max, len) {
};
xue.use = xue.use || function(moduleName, callback, isQuequ, timeout) {
    /**
     * 声明内部变量，用于存放传入的参数
     *
     * n  [moduleName] : 模块名称
     * f  [callback]   : 回调函数
     * q  [isQueue]    : 是否加入队列
     * t  [timeout]    : 延迟执行回调的时间
     * tp [typeof]     : 存放参数类型
     *
     * @type {[type]}
     */
    var n = null,
        f = false,
        q = false,
        t = false,
        tp = null;
    /**
     * 循环参数对象
     *
     * 根据参数的类型存入相应的变量中
     * 如果类型不匹配则返回变量的原始值，防止变量被重复赋值
     */
    $.each(arguments, function(k, v) {
        tp = typeof v;
        n = (tp === 'string') ? v : n;
        f = (tp === 'function') ? v : f;
        q = (tp === 'boolean') ? v : q;
        t = (tp === 'number') ? v : t;
    });
    // 如果没有传入模块名称，则直接返回xue对象，并提示错误；
    if (n === null || n === '') {
        alert('方法调用错误，没有模块名称');
        return xue;
    }
    /**
     * 回调函数
     * @return {object}   xue[n]  返回模块对象
     */
    var _callback = function() {
        if (f) {
            return f(xue[n]);
        }
    };
    /**
     * 模块状态判断
     *
     * 如果已经存在，则直接调用回调函数
     * 如果不存在，则通过异步加载模块文件，
     * 文件加载成功之后根据传入的timeout情况来确定是否延时触发回调函数
     */
    if (xue[n]) {
        _callback();
    } else {
        // 调用异步加载方法，默认线上JS模块文件放到 sript/下面，文件名：xue.[模块名].min.js
        xue.loader('http://js04.xesimg.com/xue.' + n + '.min.js', function() {
            if (t) {
                setTimeout(function() {
                    _callback();
                }, t);
            } else {
                _callback();
            }
        });
    }
    return this;
};
/* ========================== UI 组件 =========================== */
/* ========================== module =========================== */
xue.dialog = xue.dialog || function(opt) {
    var o = {};
    /**
     * 初始化
     *
     * 如果opt是{}对象，则进行配置
     * 如果是字符串，即ID，则检查队列中是否存在，如果存在则设置win.id和win.box为指定id
     *
     * 否则直接合并默认配置
     *
     * @type {[type]} 返回xue.dailog对象
     */
    if (opt && typeof opt === 'object' && opt.length === undefined) {
        $.extend(o, xue.dialog._default, opt);
        xue.dialog._init(o);
        return xue.dialog;
    } else if (opt && typeof opt === 'string') {
        var id = 'xuebox_' + opt;
        var item = xue.dialog.queue[id];
        if (item) {
            xue.dialog.id = id;
            xue.dialog.box = item.DOM_BOX;
        }
        return xue.dialog;
    } else {
        $.extend(o, xue.dialog._default);
        xue.dialog._init(o);
    }
    return xue.dialog;
};
(function() {
    var win = xue.dialog;
    win.id = 'xuebox';
    win.tpl = {
        /**
         * 弹窗外围容器
         * @type {String}
         */
        wrap: '<div id="$id$" class="dialog">$dialog_box$ $dialog_close$ $dialog_arrow$</div>',
        /**
         * 关闭按钮
         * @type {String}
         */
        close: '<a href="javascript:void(0);" class="dialog_close">关闭</a>',
        /**
         * 指示箭头模板
         * $arrow_type$ : 按钮位置
         * - tl : 上左
         * - tr : 上右
         * - bl : 下左
         * - br : 下右
         * @type {String}
         */
        arrow: '<div class="dialog_arrow arrow_$arrow_type$"></div>',
        /**
         * 按钮模版
         * $btn_id$   :
         * $btn_type$ :
         * $btn_cls$  :
         * $btn_text$ :
         * @type {String}
         */
        button: '<button type="button" data-type="$btn_type$" id="$id$_btn_$btn_id$" class="btn $btn_cls$ $btn_type$" href="javascript:void(0);">$btn_text$</button>',
        /**
         * 弹窗容器table
         * $id$ :
         * $is_title$ :
         * $is_buttons$ :
         * $title$ :
         * $content$ :
         * $buttons$ :
         * $width$ :
         * $height$ :
         * @type {[type]}
         */
        box: '<table class="dialog_box">\n' + '    <thead><tr class="t"><td class="tl"></td><td class="tc"></td><td class="tr"></td></tr></thead>\n' + '   <tbody class="dialog_head $is_title$">\n' + '       <tr class="ct">\n' + '          <td class="cl"></td>\n' + '         <td class="dialog_handle">\n' + '               <p class="dialog_title" id="$id$_title">$title$</p>\n' + '          </td>\n' + '            <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tbody class="dialog_body">\n' + '      <tr class="cc">\n' + '          <td class="cl"></td>\n' + '         <td id="$id$_content" class="dialog_content_wrap"><div class="dialog_content">$content$</div></td>\n' + '           <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tbody class="dialog_foot $is_buttons$">\n' + '     <tr class="cb">\n' + '          <td class="cl"></td>\n' + '         <td class="dialog_buttons" id="$id$_buttons">$buttons$</td>\n' + '          <td class="cr"></td>\n' + '     </tr>\n' + '    </tbody>\n' + ' <tfoot><tr class="b"><td class="bl"></td><td class="bc"></td><td class="br"></td></tr></tfoot>\n' + '</table>\n',
        /**
         * 背景遮罩
         */
        mask: '<div class="dialog_mask"></div>'
    };
    /**
     * 默认配置
     * @type {Object}
     */
    win._default = {
        content: '<div class="aui_loading"><span>loading..</span></div>',
        title: '\u6d88\u606f', // 标题. 默认'消息'
        handle: null,
        button: null, // 自定义按钮
        ok: null, // 确定按钮回调函数
        no: null, // 取消按钮回调函数
        submit: null, // 同 ok
        cancel: null, // 同 no
        init: null, // 对话框初始化后执行的函数
        close: null, // 对话框关闭前执行的函数
        okVal: '\u786E\u5B9A', // 确定按钮文本. 默认'确定'
        cancelVal: '\u53D6\u6D88', // 取消按钮文本. 默认'取消'
        width: 'auto', // 内容宽度
        height: 'auto', // 内容高度
        minWidth: 96, // 最小宽度限制
        minHeight: 32, // 最小高度限制
        padding: null, // 内容与边界填充距离,默认：'25px 20px'
        skin: '', // 皮肤名(预留接口,尚未实现)
        icon: null, // 消息图标名称
        time: null, // 自动关闭时间
        esc: true, // 是否支持Esc键关闭
        focus: true, // 是否支持对话框按钮自动聚焦
        show: true, // 初始化后是否显示对话框
        follow: null, // 跟随某元素(即让对话框在元素附近弹出)
        // path      : _path,               // Dialog路径
        lock: false, // 是否锁屏
        background: '#000', // 遮罩颜色
        opacity: 0.7, // 遮罩透明度
        duration: 300, // 遮罩透明度渐变动画速度
        fixed: false, // 是否静止定位
        left: null, // X轴坐标
        top: null, // Y轴坐标
        zIndex: 1000, // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
        resize: true, // 是否允许用户调节尺寸
        drag: true, // 是否允许用户拖动位置，
        border: true, // 是否显示边框
        cls: '' // dialog外围增加样式：dialog_alert / dialog_win等
    };
    // 设置队列
    win.queue = { /* 'id' : {} */ };
    win._init = function(opt) {
        this.id = opt.id ? 'xuebox_' + opt.id : 'xuebox';
        this.queue[this.id] = opt;
        /* --------------- 获取HTML结构 ------------- */
        var _dom = this.tpl.wrap;
        _dom = _dom.replace('$id$', this.id);
        _dom = _dom.replace('$dialog_close$', this._getClose());
        _dom = _dom.replace('$dialog_box$', this._getDOM());
        _dom = _dom.replace(/\$dialog_arrow\$/, this._getArrow());
        /* --------------- 页面中插入 ------------- */
        if ($('#xuebox_' + opt.id).length > 0) {
            $('#xuebox_' + opt.id).remove();
        }
        // var _top_temp = Number(-2000);
        $(_dom).appendTo('body');
        // $(_dom).css('top', Number(-2000)).appendTo('body');
        this.box = $('#' + this.id);
        // this.box.css('top', -2000);
        /* --------------- 存储配置 ------------- */
        // 设置DOM节点到队列中
        var dom = {
            DOM_BOX: this.box,
            DOM_CLOSE: this.box.find('.dialog_close'),
            DOM_CANCEL: this.box.find('.btn_cancel'),
            DOM_OK: this.box.find('.btn_ok'),
            DOM_BUTTONS: this.box.find('.dialog_buttons .btn'),
            DOM_TITLE: this.box.find('.dialog_title'),
            DOM_CONTENT: this.box.find('.dialog_content_wrap')
        };
        this._setOption('DOM_BOX', dom.DOM_BOX);
        this._setOption('DOM_CLOSE', dom.DOM_CLOSE);
        this._setOption('DOM_CANCEL', dom.DOM_CANCEL);
        this._setOption('DOM_OK', dom.DOM_OK);
        this._setOption('DOM_CONTENT', dom.DOM_CONTENT);
        this._setOption('DOM_TITLE', dom.DOM_TITLE);
        this._setOption('DOM_BUTTONS', dom.DOM_BUTTONS);
        this._setOption(dom);
        /* --------------- 事件绑定 ------------- */
        var that = this;
        // 关闭事件
        this._addClick(dom.DOM_CLOSE, opt.close);
        // 取消事件
        this._addClick(dom.DOM_CANCEL, opt.no || opt.cancel);
        // 确定事件
        this._addClick(dom.DOM_OK, opt.ok || opt.submit);
        // buttons的事件绑定
        // {id, tp, text, cls, fn}
        if (opt.button && opt.button.length > 0) {
            $.each(opt.button, function(k, v) {
                var _btn = $('#' + that.id + '_btn_' + v.id);
                that._addClick(_btn, v.fn);
            });
        }
        // 给Dialog绑定点击事件，点击后重置Dialog的id和dom值
        dom.DOM_BOX.off('mousedown').on('mousedown', function() {
            that.id = $(this).attr('id');
            that.box = $(this);
        });
        /* --------------- 设置定位和尺寸 ------------- */
        this.resize();
        // this(this.id).position();
        /* --------------- 设定背景遮罩 ------------- */
        if (opt.lock) {
            var bg = opt.lockbg ? true : false;
            this.lock(bg);
        }
        /* --------------- 判断是否显示边框 ------------- */
        if (opt.border) {
            dom.DOM_BOX.removeClass('dialog_noborder');
        } else {
            dom.DOM_BOX.addClass('dialog_noborder');
        }
        // 如果不存在遮罩，则给所有的弹窗增加1px边框样式
        // if($('.dialog_mask').length == 0){
        // $('.dialog').addClass('dialog_noMask');
        // }
        /* --------------- 设置圆角 ------------- */
        // 头部存在的时候增加样式
        if (dom.DOM_BOX.find('.dialog_head:hidden').length > 0) {
            dom.DOM_CONTENT.addClass('dialog_radius_top');
        } else {
            dom.DOM_CONTENT.removeClass('dialog_radius_top');
        }
        // 底部存在的时候增加样式
        if (dom.DOM_BOX.find('.dialog_foot:hidden').length > 0) {
            dom.DOM_CONTENT.addClass('dialog_radius_bottom');
        } else {
            dom.DOM_CONTENT.removeClass('dialog_radius_bottom');
        }
        /* --------------- 设置外围样式 ------------- */
        if (opt.cls) {
            dom.DOM_BOX.addClass(opt.cls);
        }
        /* --------------- 设置延时关闭 ------------- */
        if (opt.time) {
            this.timeout(opt.time, dom.DOM_BOX);
        }
        /* --------------- 设置跟随 ------------- */
        if (opt.follow) {
            this.follow(opt.follow);
        }
        /* --------------- 设置右上角的关闭按钮 ------------- */
        /**
         * 当内容区域出现滚动条，且没有标题区域的时候，关闭按钮会被滚动条遮住
         *
         * 判断
         */
        // if(!opt.title){
        //  var c = dom.DOM_CONTENT.find('.dialog_content'),
        //      d = c[0];
        //  // 判断容器滚动高度是否大于容器高度，或者容器的 offsetHeight > 容器高度的时候进行调整
        //  if(d.scrollHeight > d.clientHeight || d.offsetHeight > d.clientHeight){
        //      dom.DOM_CLOSE.css('right', 25);
        //  }
        // }
        /* --------------- 设置箭头 ------------- */
        this.arrow(opt.handle);
        /* --------------- 设置IE6兼容 ------------- */
        if (xue.isIE6) {
            dom.DOM_BOX.addClass('dialog_noshadow');
            // 增加iframe遮罩
            if ($('body').find('select').length > 0) {
                win.iframe();
            }
        } else {
            dom.DOM_BOX.removeClass('dialog_noshadow');
        }
    };
    win.iframe = function(tp) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var w = $('body').width(),
            h = $('body').height();
        var iframe_tpl = '<iframe id="dialog_iframe" style="position:fixed;width:100%;height:100%;top:0;left:0;_position:absolute;_width:' + w + ';_height:' + h + ';_filter:alpha(opacity=0);opacity=0;border-style:none;z-index:998;"></iframe>';
        // if(!this.iframe){
        $('body').append(iframe_tpl);
        // }
        // this.iframe = $('#dialog_iframe');
    };
    // 获取关闭标签HTML结构
    win._getClose = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var _close = opt.close ? this.tpl.close : '';
        return _close;
    };
    // 获取箭头标签的HTML结构
    win._getArrow = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var tp = opt.arrow;
        if (tp) {
            var html = win.tpl.arrow;
            tp = tp ? (tp === true ? 'bc' : tp) : 'bc';
            html = html.replace('$arrow_type$', tp);
            return html;
        } else {
            return '';
        }
    };
    // 获取按钮组标签的HTML结构
    win._getButton = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        /**
         * 获取button数据
         *
         * [{id:'', text:'', tp:'', cls:'', fn}]
         * @type {[type]}
         */
        var btn = opt.button;
        var tpl = this.tpl.button;
        var btns = '';
        var re = {
            id: /\$id\$/g,
            btn: /\$btn_id\$/,
            type: /\$btn_type\$/g,
            cls: /\$btn_cls\$/,
            text: /\$btn_text\$/
        };
        if (btn && typeof btn === 'object' && btn.length > 0) {
            $.each(btn, function(k, v) {
                var _btn = tpl;
                _btn = _btn.replace(re.id, win.id);
                _btn = _btn.replace(re.btn, v.id);
                _btn = _btn.replace(re.type, 'btn_' + v.tp);
                _btn = _btn.replace(re.cls, v.cls);
                _btn = _btn.replace(re.text, v.text);
                btns += _btn;
            });
        }
        if (opt.submit || opt.ok) {
            var _submit = tpl;
            _submit = _submit.replace(re.type, 'btn_ok');
            _submit = _submit.replace(re.id, win.id);
            _submit = _submit.replace(re.btn, 'ok');
            _submit = _submit.replace(re.cls, 'btn_red');
            _submit = _submit.replace(re.text, opt.submitVal || opt.okVal);
            btns += _submit;
        }
        if (opt.cancel || opt.no) {
            var _cancel = tpl;
            _cancel = _cancel.replace(re.type, 'btn_cancel');
            _cancel = _cancel.replace(re.id, win.id);
            _cancel = _cancel.replace(re.btn, 'cancel');
            _cancel = _cancel.replace(re.cls, 'btn_gray');
            _cancel = _cancel.replace(re.text, opt.cancelVal || opt.noVal);
            btns += _cancel;
        }
        return btns;
    };
    // 获取整个中间区域的HTML结构
    win._getDOM = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var box = this.tpl.box;
        /*
         * $id$ :
         * $is_title$ :
         * $is_buttons$ :
         * $title$ :
         * $content$ :
         * $buttons$ :
         * $width$ :
         * $height$ :
         */
        var id = this.id || xue.getTime();
        box = box.replace(/\$id\$/g, id);
        /**
         * title
         */
        if (opt.title) {
            box = box.replace(/\$is_title\$/, '');
            box = box.replace(/\$title\$/, opt.title);
        } else {
            box = box.replace(/\$is_title\$/, 'hidden');
            box = box.replace(/\$title\$/, this._default.title);
        }
        /**
         * 按钮组
         */
        var _btn = this._getButton(),
            isbtn = _btn ? '' : 'hidden';
        box = box.replace('$buttons$', _btn);
        box = box.replace('$is_buttons$', isbtn);
        /**
         * 内容区域
         */
        box = box.replace('$content$', opt.content);
        return box;
    };
    // 向队列中添加属性
    win._setOption = function(key, val, id) {
        var _id = id || win.id;
        var list = win.queue[_id];
        list[key] = val;
        return win.queue;
    };
    /**
     * 事件绑定
     * @param  {selector}   expr 要绑定的元素
     * @param  {Function} fn   要绑定的事件
     * @return {[type]}        [description]
     */
    win._addClick = function(expr, fn) {
        var box = $(expr).parents('.dialog'),
            id = (box.length > 0) ? box.attr('di') : this.id;
        var _fn = (fn && typeof fn === 'function') ? fn : function() {
            win.close();
        };
        var that = this;
        $(expr).off('click').on('click', function() {
            that.box = $(this).parents('.dialog');
            that.id = that.box.attr('id');
            _fn(this, id);
        });
    };
    /**
     * 返回尺寸
     * @type {Object}
     *
     * 返回值： w = width, h = height, l = left, t = top, s = scrollTop, c = center, m = middle
     */
    win._size = {
        wins: function() {
            var _win = $(window);
            // 窗体尺寸
            var w = {
                w: _win.width(), // 宽度
                h: _win.height(), // 高度
                s: _win.scrollTop() // 滚动高度
            };
            // 窗体垂直中线
            w.c = (w.w / 2);
            // 窗体可显示区域水平中线
            w.m = w.s + (w.h / 2);
            return w;
        },
        box: function() {
            var opt = win.queue[win.id];
            if (!opt) {
                return win;
            }
            var box = opt.DOM_BOX;
            // 弹窗的尺寸
            var d = /*this.getSize() ||*/ {
                w: box.outerWidth(true),
                h: box.outerHeight(true)
            };
            return d;
        },
        handle: function() {
            var opt = win.queue[win.id];
            if (!opt) {
                return win;
            }
            var handle = $(opt.handle);
            if (handle.length === 0) {
                return win;
            }
            var h = {
                w: handle.width(),
                h: handle.height(),
                l: handle.offset().left,
                t: handle.offset().top
            };
            // handle垂直中心
            h.c = h.l + (h.w / 2);
            return h;
        }
    };
    // 事件绑定
    // win._addEvent = function(ev, expr, fn){};
    // 关闭事件
    win.close = function(fn) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        // 当关闭的容器ID并不是当前激活窗口时，禁止弹层
        if ((typeof(fn) == 'string') && (this.id !== 'xuebox_' + fn)) {
            return;
        }
        opt.DOM_BOX.remove();
        if (xue.isIE6) {
            $('#dialog_iframe').remove();
            // this.iframe = null;
        }
        delete this.queue[this.id];
        //关闭的时候检查剩余弹窗中有没有锁定的，如果有则不删除遮罩
        var islock = false;
        $.each(this.queue, function() {
            if (this.lock) {
                islock = true;
            }
        });
        if (!islock) {
            this.unlock();
        }
    };
    // 设置弹窗的位置
    win.position = function(left, top) {
        var box = [],
            opt = this.queue[this.id];
        if ((left && typeof left === 'number') || (top && typeof top === 'number')) {
            if (!opt) {
                return;
            }
            opt.left = left || opt.left;
            opt.top = top || opt.top;
            box.push(opt);
        } else {
            // 重置所有弹窗的定位
            // $.each(this.queue, function(){
            //  box.push(this);
            // });
            // 只设置当前弹窗的定位
            box.push(opt);
        }
        $.each(box, function() {
            var opt = this;
            var box = opt.DOM_BOX;
            var pos = {
                left: left || opt.left || ($(window).width() / 2) - (box.width() / 2),
                top: top || opt.top || ($(window).height() / 2) - (box.height() / 2)
            };
            box.css({
                left: pos.left,
                top: pos.top
            });
        });
        return this;
    };
    // 设置弹窗的大小
    win.resize = function(width, height) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        if ((width || opt.width) && (height || opt.height)) {
            var box = opt.DOM_BOX;
            var con = box.find('.dialog_content');
            con.css({
                width: width || opt.width,
                height: height || opt.height
            });
            if (opt.padding) {
                con.css('padding', opt.padding);
            }
            // 如果没有设置宽度的，则需要延时处理：等dialog加载完成后再设置定位，否则直接设置
            if (!opt.width || opt.width == 'auto') {
                setTimeout(function() {
                    win.position();
                }, 100);
            } else {
                win.position();
            }
        }
        if (xue.isIE6) {
            var _box = opt.DOM_BOX;
            _box.css({
                width: _box.width()
            });
            _box.find('.dialog_arrow').css('width', _box.width());
        }
        return this;
    };
    // 设置弹窗的层级，默认为1000
    win.zIndex = function() {};
    /**
     * 设置当前焦点,zindex : 2000
     *
     * 其他的Dialog的zindex值设为默认 1000
     *
     * 当点击某个的时候，可以激活当前焦点
     *
     * @return {[type]} [description]
     */
    win.focus = function() {};
    /**
     * 获取弹窗内容区域
     * @param  {string} tp 获取类型：html / text / dom
     * @return {[type]}    根据类型返回：html(HTML内容) / text(文本) / dom(jQuery对象)
     */
    win.getContent = function(tp) {
        var opt = this.queue[this.id];
        if (!opt) {
            return;
        }
        var DOM = opt.DOM_CONTENT.find('.dialog_content'),
            con = '';
        if (tp === 'html') {
            con = DOM.html();
        } else if (tp === 'text') {
            con = DOM.text();
        } else {
            con = DOM;
        }
        return con;
    };
    /**
     * 设置遮罩
     * @param  {boolen} lockbg 是否显示背景图片（斜线）
     * @return {[type]}        [description]
     */
    win.lock = function(lockbg) {
        var mask = $('body').find('.dialog_mask');
        if (mask.length > 0) {
            mask.show();
        } else {
            $('body').append(this.tpl.mask);
        }
        var newMask = $('.dialog_mask');
        if (lockbg) {
            newMask.addClass('mask_bg');
        } else {
            $('.dialog_mask').removeClass('mask_bg');
        }
        if (xue.isIE6) {
            var h = Math.max($('body').outerHeight(), $(window).outerHeight());
            newMask.height(h);
        }
        if (newMask.height() < $(window).height()) {
            newMask.height($(window).height());
        }
        // $('.dialog').addClass('dialog_noborder');
    };
    /**
     * 取消遮罩
     *
     * 判断当前点击的元素是否有lock，如果没有则不关闭遮罩
     *
     * 如果有，还要看关闭后其他弹层中是否有lock，如果有，则还不能关闭遮罩
     *
     * @return {[type]} [description]
     */
    win.unlock = function(id) {
        $('.dialog_mask').remove();
    };
    win.content = function(msg) {
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var box = opt.DOM_BOX.find('.dialog_content');
        box.html(msg);
        this.resize();
        return this;
    };
    win.title = function(title) {
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var box = opt.DOM_BOX.find('.dialog_title');
        box.html(title);
        return this;
    };
    win.timeout = function(timer, box) {
        var t = timer || 2000;
        var that = this;
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var _box = box || opt.DOM_BOX;
        setTimeout(function() {
            _box.fadeOut(100, function() {
                that.close();
            });
            // if(opt.lock){
            // }
            // delete that.queue[that.id];
        }, t);
    };
    win.getSize = function() {
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var box = opt.DOM_BOX;
        var width = box.outerWidth(),
            height = box.outerHeight();
        return {
            width: width,
            height: height
        };
    };
    win._getHandleSize = function(expr) {
        var handle = $(expr);
        if (handle.length === 0) {
            return false;
        }
        var offset = handle.offset();
        var size = {
            height: handle.outerHeight(true),
            width: handle.outerWidth(true),
            left: offset.left,
            top: offset.top
        };
        return size;
    };
    win.follow = function(expr) {
        var handle = $(expr);
        if (handle.length === 0) {
            return this;
        }
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var box = opt.DOM_BOX;
        if (box.hasClass('dialog_follow')) {
            box.addClass('dialog_follow');
        }
        var dom = this._getHandleSize(handle);
        var size = {
            width: box.outerWidth(true),
            height: box.outerHeight(true)
        };
        win.position(dom.left - (size.width / 2) + (dom.width / 2), dom.top - (size.height / 2) - dom.height - 11);
        // win.position(dom.left - (size.width / 2) + 10, dom.top - (size.height /2) - dom.height - 10);
        return this;
    };
    /**
     * 箭头定位
     * @param  {[type]} fixe [description]
     * @return {[type]}      [description]
     *
     *
     *
     *    ...... 未完成 .......
     */
    win.arrow = function(handle) {
        var _dom = $(handle);
        if (_dom.length === 0) {
            return;
        }
        var opt = this.queue[this.id];
        if (!opt) {
            return this;
        }
        var box = opt.DOM_BOX;
        // 窗体尺寸
        var w = this._size.wins();
        var s = this._size.handle();
        // 弹窗的尺寸
        var d = this._size.box();
        // 设置箭头类别
        var c = (s.c < w.c) ? 'l' : 'r', // 垂直区域
            m = ((s.t - d.h) < w.s) ? 't' : 'b'; // 水平区域
        var tp = m + c;
        var arrow = box.find('.dialog_arrow');
        arrow.removeClass().addClass('dialog_arrow').addClass('arrow_' + tp);
        var aLeft = Math.floor((c == 'l') ? d.w * 0.2 : d.w * 0.8);
        // console.log(s);
        arrow.css({
            'background-position': aLeft + 'px 0'
        });
        // this.position();
    };
})();
/* ================== 插件 =================== */
xue.win = xue.dialog;
(function() {
    var w = xue.win;
    var config = {
        id: 'win',
        lock: true,
        close: true,
        title: '标题',
        content: '<div></div>',
        submit: true,
        cancel: true
    };
    $.each(config, function(k, v) {
        w._default[k] = v;
    });
})();
/* ================================================= 全局事件 ==================================================== */
// window尺寸发生变化时
$(window).resize(function() {
    if ($('.dialog').length > 0) {
        xue.win.position();
    }
});
// 页面滚动时
// $(window).scroll(function(){
// });
$(function() {
    // 开始
    var userinfo_temp = false,
        userinfo_dom = null,
        userinfo_show = null,
        userinfo_interval = false;
    var time_all = '';
    // 绑定所有V用户的鼠标滑过事件：弹出用户信息
    $('body').off('mouseover', '.ui-userinfo').on('mouseover', '.ui-userinfo', function(ev) {
        var d = $(this).data();
        var that = $(this);
        if (!d.params) {
            return;
        }
        var over_url = location.href;
        var over_time = Date.now();
        time_all = over_time;
        // var ra = ev; ra.relatedTarget;
        // userinfo_show = null;
        userinfo_show = true;
        userinfo_dom = that;
        setTimeout(function() {
            if (userinfo_show) {
                // that = userinfo_dom;
                userinfoShow(userinfo_dom);
                userinfo_show = null;
                userinfo_dom = null;
            }
        }, 800);
        // return;
        var userinfoShow = function(udom) {
            var temp = udom.find('.pop_userinfo_temp');
            if (temp.length > 0) {
                var msg = temp.html();
                xue.use('userinfo', function() {
                    xue.userinfo.show(udom, msg);
                });
            } else {
                if (!udom.hasClass('info_open')) {
                    var _url = '/UserPages/ajaxUserPage';
                    //var _a = $('.ui-userinfo').data('url');
                    var url = _url;
                    // var url = window.location.hostname == 'v04.xesui.com' ? '../json/pop_userinfo.php' : '/UserPages/ajaxUserPage';
                    var par = udom.data().params;
                    // var url = '/data/courses/teacher-bomb.html';
                    $.ajax(url, {
                        type: 'get',
                        dataType: 'html',
                        data: par,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(result) {
                            // alert(result)
                            // var msg = xue.ajaxCheck.HTML(result);
                            if (result != '0') {
                                // if(result.sign == 1){
                                xue.use('userinfo', function() {
                                    if (xue.userinfo) {
                                        xue.userinfo.show(udom, result);
                                        $('.ui_follow').follow();
                                    }
                                });
                            }
                        },
                        error: function() {
                            alert('数据请求失败')
                        }
                    });
                }
            }
            udom.addClass('info_open');
            userinfo_temp = true;
        };
        that.off('mouseout').on('mouseout', function(a, b, c, d) {
            userinfo_temp = false;
            userinfo_show = false;
            userinfo_dom = null;
            var re = $(a.relatedTarget);
            var _c = $('.dialog_userinfo').find(re);
            if (_c.length > 0) {
                userinfo_temp = true;
            }
            setTimeout(function() {
                if (!userinfo_temp) {
                    // 关闭窗口的时候传入要关闭窗口的ID，防止关闭正在激活的窗口（非用户信息窗口）
                    xue.win('userinfo').close('userinfo');
                    that.removeClass('info_open');
                }
                that = null;
            }, 500);
            var out_time = Date.now();
            var o_time = out_time - over_time;
            utrack('xueersi', 'key=user_tab&value=times:' + o_time + ';userid:' + that.data('params') + ';url:' + over_url);
        });
    });
    $('body').off('mouseover', '.dialog_userinfo').on('mouseover', '.dialog_userinfo', function(a) {
        userinfo_temp = true;
    });
    $('body').off('mouseout', '.dialog_userinfo').on('mouseout', '.dialog_userinfo', function(a) {
        var re = a.relatedTarget;
        var c = $(this).find(re);
        if (c.length === 0) {
            userinfo_temp = false;
            setTimeout(function() {
                if (!userinfo_temp) {
                    xue.win('userinfo').close();
                    $('.ui-userinfo').removeClass('info_open');
                }
            }, 500);
        }
        var over_url = location.href;
        var out_time = Date.now();
        var o_time = out_time - time_all;
        var src_img = $(this).find('.app-code img').attr('src') || '';
        utrack('xueersi', 'key=user_tab&value=times:' + o_time + ';userid:0;url:' + over_url + ';weixin_code_img_url:' + src_img);
    });
    // 结束
});
; /*!widget/Public.Module/courses.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
// 头像切换封装函数
var courses = courses || {};
courses.avatar = courses.avatar || {};
(function(a) {
    a.box = {
        pic: null,
        list: null,
        btn: null
    };
    a.step = $(".avatar-items li").width();
    a.size = 0;
    a.max = 0;
    a.len = 0;
    a.toggle = function(expr) {
        var btn = $(expr);
        if (btn.length == 0) {
            return;
        }
        var wrap = btn.parent();
        var pic = wrap.hasClass('avatar-roll') ? wrap.siblings('.avatar-items') : wrap.find('.avatar-items');
        if (pic.length == 0) {
            return;
        }
        this.box.pic = pic;
        this.box.list = pic.find('li');
        this.box.btn = btn;
        this.box.prev = btn.hasClass('prev') ? btn : btn.siblings('.prev');
        this.box.next = btn.hasClass('next') ? btn : btn.siblings('.next');
        this.size = this.box.list.length;
        this.max = this.size - 1;
        this.step = pic.find('li').width();
        var list = pic.find('li');
        var left = pic.css('margin-left');
        this.left = Number(left.replace('px', ''));
        if (btn.hasClass('prev')) {
            a.prev();
        } else {
            a.next();
        }
    }
    a.prev = function() {
        if (a.left < 0) {
            a.box.pic.animate({
                marginLeft: '+=' + a.step + 'px'
            }, 500, function() {
                a.left += a.step;
                a.setCls();
                if (a.left >= 0) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };
    a.next = function() {
        var box = a.box.pic,
            left = Number(box.css('margin-left').replace('px', ''));
        if (a.left > -(a.max * a.step)) {
            a.box.pic.animate({
                marginLeft: '-=' + a.step + 'px'
            }, 500, function() {
                a.left -= a.step;
                a.setCls();
                if (a.left <= -(a.max * a.step)) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };
    a.setCls = function() {
        var hasNext = Math.abs(a.left) < ((a.box.list.length - 1) * a.step);
        var hasPrev = a.left < 0;
        if (hasNext) {
            a.box.next.removeClass('none');
        } else {
            a.box.next.addClass('none');
        }
        if (hasPrev) {
            a.box.prev.removeClass('none');
        } else {
            a.box.prev.addClass('none');
        }
    };
})(courses.avatar);
// 绑定老师头像切换事件
$('body').off('click', '.avatar-roll a, .majar-items .prev, .majar-items .next').on('click', '.avatar-roll a, .majar-items .prev, .majar-items .next', function() {
    var that = $(this);
    console.log(that);
    if (that.hasClass('none')) {
        return false;
    } else {
        courses.avatar.toggle(that)
    }
});
//热门专题课区域增加链接
var a = $('.course-list.hot-course-list');
var bLink = $('.course-list.hot-course-link');
a.on('mouseover', function() {
    $(this).addClass('hover-feed');
});
a.on('mouseout', function() {
    $(this).removeClass('hover-feed');
});
bLink.find('.course-detail').off('click').on('click', function(event) {
    var t = $(event.target);
    if (t.attr('href')) {
        return;
    } else {
        var b = $(this).find('.course-title a');
        window.open(b.attr('href'));
    }
})
/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-08 16:57:28
 * @version $Id$
 * 
 * @links http://xesui.com
 */
/**
 * @name ui.userinfo.js
 * @description 弹出的用户信息窗口
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */
// 课程列表增加筛选功能
function showStuterm() {
    $('.stu-term-select').css('height', 'auto').find('.stu-term-select-content').css('display', 'block');
    $('.stu-term-select-title i').removeClass('fa-angle-down').addClass('fa-angle-up');
};
function hideStuterm() {
    $('.stu-term-select').css('height', '37px').find('.stu-term-select-content').css('display', 'none');
    $('.stu-term-select-title i').removeClass('fa-angle-up').addClass('fa-angle-down');
}
$('body').on('mouseenter', '.stu-term-select', function() {
    showStuterm();
}).on('mouseleave', '.stu-term-select', function() {
    hideStuterm();
});
; /*!widget/Public.Module/glory.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
var glory = glory || {};
/**
 * 初始化三级联动下拉框
 *
 * @return
 */
function initSelects(params) {
    $.ajax({
        type: "post",
        url: params.jsonUrl,
        dataType: "json",
        timeout: 7000,
        success: function(result) {
            // 如果有系统模块,则显示
            if (result != '') {
                var str = '';
                str += '<select id="' + params.level_1_id + '" name="' + params.level_1_id + '" onchange="selectType1(this)">';
                str += '<option value="" selected>--请选择--</option>';
                $.each(result, function(i, j) {
                    if (params.level_1_default != '') {
                        str += '<option value="' + i + '"';
                        if (params.level_1_default == i) {
                            str += ' selected ';
                            if (params.level_2_default != '') {
                                initSelects_2(params, i);
                            }
                        }
                        str += '>' + j['name'] + '</option>';
                    } else {
                        if (j['child'] != '') {
                            var isShow = 0;
                        } else {
                            var isShow = 1;
                        }
                        str += '<option ' + ' show="' + isShow + '" description="' + j['description'] + '" value="' + i + '">' + j['name'] + '</option>';
                    }
                });
                str += '</select>';
                $(params.container + '[id="' + params.container_id + '"]').html(str);
                $(params.container + ' select[id="' + params.level_1_id + '"]').bind("change", function() {
                    initSelects_2(params, $(this).val());
                });
            }
        },
        error: function() {
            // alert('数据读取错误..');
        }
    });
};
/**
 * 初始化二级联动下拉框
 */
function initSelects_2(params, pid) {
    if (pid == '') {
        // 如果没有选择一级,则删除二级,三级下拉框
        $(params.container + ' select[id="' + params.level_2_id + '"]').remove();
        $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
    } else {
        $.ajax({
            type: "GET",
            url: params.jsonUrl,
            dataType: "json",
            timeout: 7000,
            success: function(result) {
                // 如果有子类别,则显示
                if (result[pid]['child'] != '') {
                    var str = '';
                    str += '<select id="' + params.level_2_id + '" name="' + params.level_2_id + '" onchange="selectType2(this)">';
                    str += '<option value="" selected>--请选择--</option>';
                    $.each(result[pid]['child'], function(i, j) {
                        if (params.level_2_default != '') {
                            str += '<option value="' + i + '"';
                            if (params.level_2_default == i) {
                                str += ' selected ';
                                if (params.level_3_default != '') {
                                    initSelects_3(params, pid, i);
                                }
                            }
                            str += '>' + j['name'] + '</option>';
                        } else {
                            if (j['child'] != '') {
                                var isShow = 0;
                            } else {
                                var isShow = 1;
                            }
                            str += '<option ' + ' show="' + isShow + '" description="' + j['description'] + '" value="' + i + '">' + j['name'] + '</option>';
                        }
                    });
                    str += '</select>';
                    $(params.container + ' select[id="' + params.level_2_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_1_id + '"]').after(str);
                    $(params.container + ' select[id="' + params.level_2_id + '"]').bind("change", function() {
                        initSelects_3(params, pid, $(this).val());
                    });
                } else {
                    $(params.container + ' select[id="' + params.level_2_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                }
            },
            error: function() {
                // alert('数据读取错误..');
            }
        });
    }
};
/**
 * 初始化三级联动下拉框
 */
function initSelects_3(params, ppid, pid) {
    if (pid == '') {
        // 如果没有选择二级,则删除三级下拉框
        $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
    } else {
        $.ajax({
            type: "GET",
            url: params.jsonUrl,
            dataType: "json",
            timeout: 7000,
            success: function(result) {
                // 如果有子类别,则显示
                if (result[ppid]['child'][pid]['child'] != '') {
                    var str = '';
                    str += '<select id="' + params.level_3_id + '" name="' + params.level_3_id + '" onchange="selectType3(this)">';
                    str += '<option value="" selected>--请选择--</option>';
                    $.each(result[ppid]['child'][pid]['child'], function(i, j) {
                        if (params.level_3_default != '') {
                            str += '<option val ="100" value="' + i + '"';
                            if (params.level_3_default == i) {
                                str += ' selected ';
                            }
                            str += '>' + j['name'] + '</option>';
                        } else {
                            str += '<option gold ="' + j['gold_num'] + '" description="' + j['description'] + '" value="' + i + '">' + j['name'] + '</option>';
                        }
                    });
                    str += '</select>';
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                    $(params.container + ' select[id="' + params.level_2_id + '"]').after(str);
                } else {
                    $(params.container + ' select[id="' + params.level_3_id + '"]').remove();
                }
            },
            error: function() {
                // alert('数据读取错误..');
            }
        });
    }
};
// 生成随机字符串
function generateMixed(n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
};
function winContorl(t, b, bl, h, that) {
    var left = that.offset().left,
        top = that.offset().top,
        h = -5;
    t.children().each(function() {
        var ch = $(this).innerHeight();
        h += ch;
    }).last().removeClass('hasborder_1');;
    if ($('.glory_window_come').length == 0) {
        $(document.body).append('<div class="glory_window_come"></div>');
    }
    var content = t.html();
    if (bl) {
        that.attr('id', 'window_sign');
        $('.glory_window_come').html(content).offset({
            left: left,
            top: top - h - 10
        }).height(h).fadeIn();
    } else if (typeof that.attr('id') == 'undefined') {
        $('#window_sign').removeAttr('id');
        that.attr('id', 'window_sign');
        $('.glory_window_come').html(content).height(h).offset({
            left: left,
            top: top - h - 10
        });
    } else {
        $('.glory_window_come').html('').remove();
        $('#window_sign').removeAttr('id');
    }
}
$(function() {
    $(document.body).on('click', function(event) {
        var a = $(event.target).hasClass('show-course'),
            b = $(event.target).hasClass('glory_window_come');
        if (!a && !b && $('.glory_window_come').length !== 0) {
            $('.glory_window_come').remove();
            $('#window_sign').removeAttr('id');
        }
    })
});
glory.comment = glory.comment || {};
/**
 * 评论框文本域属于字数限制方法
 * @param  {string} dom 任意子节点
 */
(function(fc) {
    fc.textareaNum = function(dom) {
        var that = $(dom);
        if (that.length == 0) {
            return false;
        }
        var val = $.trim(that.val());
        var len = val.length;
        var form = that.closest('.fresh-comment-form'),
            size = form.find('.fresh-comment-size .fresh-comment-text-num');
        if (len > 140) {
            that.val(val.substring(0, 140));
            size.text(0);
            return false;
        } else {
            size.text(140 - len);
        }
    };
})(glory.comment);
//限制文本域字数显示
$('.glory_log_submit').off('input keyup paste focus', '.comment_textarea textarea').on('input keyup paste focus', '.comment_textarea textarea', function() {
    // alert(111)
    var that = this;
    setTimeout(function() {
        glory.comment.textareaNum(that);
    }, 10);
});; /*!widget/Public.Module/xue.userinfo.min.js*/
/**
 * XESUI 
 * Copyright 2013 xueersi.com All rights reserved.
 *
 * @description 
 *
 * @author Marco (marco@xesui.com)
 * @modify 2013-07-08 16:57:28
 * @version $Id$
 * 
 * @links http://xesui.com
 */
/**
 * @name ui.userinfo.js
 * @description 弹出的用户信息窗口
 * 
 * @module 
 * @submodule 
 * @main 
 * @class 
 * @constructor 
 * @static 
 */
xue.userinfo = xue.userinfo || {};
(function() {
    var u = xue.userinfo;
    // u.queue = 
    u.opt = {
        id: null,
        handle: null,
        orientation: null,
        content: null
    };
    u.show = function(expr, content) {
        if (arguments.length == 0) {
            return;
        }
        var msg = content || null,
            handle = expr ? $(expr) : false;
        var left, top, tp;
        if (handle.length == 0 && !msg) {
            return;
        }
        // u.setDom(handle, msg);
        var w = handle.width(),
            h = handle.height(),
            l = handle.offset().left,
            t = handle.offset().top;
        // win (w:330 h:150)
        var left = l - 50,
            top = t - 150,
            arrow = 'bl';
        var side = handle.parents('.layout_side').hasClass('right');
        if (side) {
            left = l - 235;
            arrow = 'br';
        }
        var o = {
            id: 'userinfo',
            cls: 'dialog_userinfo',
            title: false,
            submit: false,
            cancel: false,
            lock: false,
            close: false,
            left: left,
            top: top,
            handle: handle,
            arrow: arrow,
            content: '<div class="pop_userinfo_wrap">' + msg + '</div>'
        };
        xue.win(o);
        // 根据滚动条设置显示的方向，以及箭头位置
        // var win = xue.win('userinfo');
        // var s = win.getSize();
        // var new_top = t - (s.height) - 8;
        // if((new_top - $(window).scrollTop()) < 0){
        //     new_top = t + h + 5;
        //     var _uwin = $('.dialog_userinfo');
        //     var _arrow = _uwin.find('.dialog_arrow');
        //     if(_arrow.hasClass('arrow_br')){
        //         _arrow.removeClass('arrow_br').addClass('arrow_tr');
        //     }else if(_arrow.hasClass('arrow_bl')){
        //         _arrow.removeClass('arrow_bl').addClass('arrow_tl');
        //     }
        // }
        var _u = xue.win('userinfo');
        // 窗体尺寸
        var w = _u._size.wins();
        // handle尺寸
        var h = _u._size.handle();
        // 弹窗的尺寸
        var d = _u._size.box();
        // 设置箭头类别
        // var c = (h.c < w.c) ? 'l' : 'r',        // 垂直区域
        //     m = ((s.t - d.h )< w.s) ? 't' : 'b';            // 水平区域
        //     // m = (h.t < w.m) ? 't' : 'b';            // 水平区域
        var left = (h.c < w.c) ? h.l - (d.w * 0.2) + (h.w / 2) - 7 : (h.l - d.w) + (d.w * 0.2) + (h.w / 2) - 7;
        var new_top = ((h.t - d.h) < w.s) ? h.t + h.h + 7 : h.t - d.h - 7;
        xue.win('userinfo').position(left, new_top);
        // 当滑出后，点击关注，或者取消按钮时，情况已经缓存到页面中的内容，重新请求
        $('.dialog_userinfo').on('mousedown', '.ui_follow', function() {
            var temp = handle.find('.pop_userinfo_temp');
            if (temp.length > 0) {
                temp.remove();
            }
        });
        if (xue.isIE6) {
            $('.dialog_userinfo').find('.dialog_arrow').width($('.dialog_userinfo').width());
        }
        // 设置u.opt
        // append节点到handle里面
        // 执行弹窗
    };
    /**
     * 在鼠标滑过的节点内存入弹出的结构，下次再滑过时不再请求
     * @return {[type]} [description]
     */
    u.setDom = function(handle, content) {
        var box = $(handle);
        if (box.length == 0) {
            return;
        }
        if (box.find('.pop_userinfo_temp').length == 0) {
            box.append('<div class="pop_userinfo_temp">' + content + '</div>')
        } else {
            box.find('.pop_userinfo_temp').html(content);
        }
    };
    u.close = function() {
        $('.dialog_userinfo').hide();
    };
    /**
     * 根据鼠标滑过的节点位置，返回将要显示的弹层坐标
     * @return {[type]} [description]
     */
    u.getPosition = function() {
        var box = u.opt.handle;
        if (!box) {
            return this;
        }
    };
    /**
     * 根据鼠标滑过的节点，返回箭头的方向: bl, br, tl, tr
     * @return {[type]} [description]
     */
    u.getOrientation = function() {};
})();; /*!widget/Public.Selector/selector.js*/
/**
 * Created by user on 2015/10/21.
 */
//上半部年级以及知识点选择的处理
var select = select || {};
select.opti = {
    item      : '.choice-item-each',
    grade     : '.choice-item-grade',
    pointInput: '.choice-items-spe-input',
    itemSpe   : '.choice-items-spe',
    pointShow : '.choice-more-download',
    selector  : '.choice-special .selector',
    choiceHide: '.choiceHide',
    choiceSpe: '.choice-items-spe'
}
/**
* [chooseSpan description]
* @param  {string} all       [所有的标签]
* @param  {string} that      [点击选中的标签]
* @param  {[type]} className [description]
* @return {[type]} none      [description]
*/
// 学科+年级+知识点 三级联动
select.threeOption = function(config){
    var $s1 = $("#" + config.s1);
    var $s2 = $("#" + config.s2);
    var $s3 = $("#" + config.s3);
    $s1.find('li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $s2.html("");
        $s3.html("");
        var s1_curr_val = $(this).find('a').eq(0).attr('id');
        $.each(selectDatas, function (k, v) {
            if (s1_curr_val == v.id) {
                if (v.grades) {
                    $.each(v.grades, function (k, v) {
                        appendOptionTo($s2, v.name, v.id, v.grade);
                    });
                }
            }
        });
        $s2.find('li').eq($s2.find('li').length -1).click();//调取知识点(点击科目默认click最后一个年级)
        moreKnowledge();
    });
    $s2.on('click', 'li', function(){
        var tpl = '<p class="grade_tips">年级最多可以选三个哦~</p>';
        $('.grade_tips').remove();
        var parent = $(this);
        if (parent.hasClass('current')) {
            if ($(this).parents('.nav-grade').find('li.current').length == 1 ) {//年级最少选择1个
                return false;
            }else {
                parent.removeClass('current');
            }
        }
        else {
            if ($(this).parents('.nav-grade').find('li.current').length > 2 ) {
                $('#select_grades').append(tpl);
                return;
            }else {
                parent.addClass('current');
            }
        }
        $s3.html("");
        $('<li role="presentation" class="active"><a class="choice-item-each" href="javascript:;" id="0">全部</a></li>').appendTo($s3);
        var s1_curr_val = $s1.find('li.active').find('a').eq(0).attr('id');
        var s2_curr_val = $(this).find('a').eq(0).attr('id');
        $.each(selectDatas, function (k, v) {
            if (s1_curr_val == v.id) {
                if (v.grades) {
                    $.each(v.grades, function (k, v) {
                        for (var i = 0; i < $s2.find('li.current').length; i ++) {
                            if ($s2.find('li.current').eq(i).find('a').attr('id') == v.id) {
                                $.each(v.range, function (k, v) {
                                    appendOptionTo($s3, v.name, v.id, v.grade);
                                });
                            }
                        }
                    });
                }
            }
        });
        $s3.find('li').eq(0).addClass('active').siblings().removeClass('active');//默认选中的知识点
        select.getTestList($(this).parents('ul').attr('id'));
        moreKnowledge();
    });
    function appendOptionTo($o, name, id, grade) {
        var $opt = '';
        if ($o == $s2) {
            $opt = $('<li role="presentation"><a class="choice-item-grade" href="javascript:;" id="'+ id +'">'+ name +'</a></li>');
            $opt.appendTo($o);
        }else if($o == $s3){//知识点去重
            var m = 0;
            if ($s3.find('li').length > 0) {
                for (var i = 0; i < $s3.find('li').length; i ++) {
                    if ($s3.find('li').eq(i).find('a').attr('id') == id) {
                        m ++;
                        return;
                    }
                }  
                if (m == 0) {
                    $opt = $('<li role="presentation" data-grade="'+ grade +'"><a class="choice-item-each" href="javascript:;" id="'+ id +'">'+ name +'</a></li>');
                    $opt.appendTo($o);
                }
            }else {
                $opt = $('<li role="presentation" data-grade="'+ grade +'"><a class="choice-item-each" href="javascript:;" id="'+ id +'">'+ name +'</a></li>');
                $opt.appendTo($o);
            }    
        }else {
            $opt = $('<li role="presentation"><a class="choice-item-each" href="javascript:;" id="'+ id +'">'+ name +'</a></li>');
            $opt.appendTo($o);
        }    
    };
    // 判断更多知识点展开入口是否存在(根据包含知识点的父级高度判断)
    function moreKnowledge () {
        if ($(select.opti.pointInput).height() <= 40) {
            $(select.opti.pointInput).next().hide();
        }else {
            $(select.opti.pointInput).next().show();
        }
    }
    
}
select.renderAreaSelect = function(){
    var defaults = {
        s1: 'select_subject',
        s2: 'select_grades',
        s3: 'select_range'
    };
    select.threeOption(defaults);
};

// 直播错题和录播错题选项卡
$(function() {
    $("#wrong_test_label li").on('click', function() {
        $(this).addClass('active').siblings('li').removeClass('active');
        var type = $(this).data('type');
        if (type == 'live') {
            $('.wrong_test_lists_live').show();
            $('.wrong_test_lists').hide();
            select.liveSelector();
        } else {
            $('.wrong_test_lists_live').hide();
            $('.wrong_test_lists').show();
            select.recordSubject();
        }
    });
    $("#wrong_test_label li").eq($('#wrong_test_type').val()).click();
})
//直播筛选条件
select.liveSelector = function(){
    $('#wrongQuest_sum').text(0);
    $('.wrongQuest-download').show();
    if (selectDatas == '') {
        $('.wrongQuest-download').addClass('disable');
        return false;
    }
    if (!$("#wrong_test_label li:eq(0)").hasClass('getThreeOption')) {//刚进入页面或者切换直播选项卡都会调select.liveSelector，这里的标识是为了只在刚进入页面才调用select.renderAreaSelect();避免多次调用
       select.renderAreaSelect();
       $("#wrong_test_label li:eq(0)").addClass('getThreeOption');
    }
    if ($(select.opti.pointInput).height() <= 40) {
        $(select.opti.pointInput).next().hide();
    }else {
        $(select.opti.pointInput).next().show();
    }
    select.getTestList(0);
}
//录播错题学科
select.recordSubject = function(){
    $('#wrongQuest_sum').text(0);
    $('.wrongQuest-download').hide();
    url = '/WrongTests/ajaxRecordSubjects';
    $.ajax({
        url: url,
        data: '',
        type: "POST",
        dataType: 'html',
        success: function(d) {
            var resData = xue.ajaxCheck.html(d);
            if (resData) {
                $('.wrong_test_lists').html(resData);
            }
        },
        error: function() {
            alert('数据读取错误..');
        }
    });
}

//学期滑过效果
$('body').on("mouseover mouseout", '#select_term li a', function(event){
    if(event.type == "mouseover"){
        //鼠标悬浮
        $(this).next('.popover').show();
    }else if(event.type == "mouseout"){
        //鼠标离开
        $(this).next('.popover').hide();
    }
}) 
//错题状态滑过效果
$('body').on("mouseover mouseout", '.wrongQuesStat', function(event){
    if(event.type == "mouseover"){
        //鼠标悬浮
        $(this).find('.popover').show();
    }else if(event.type == "mouseout"){
        //鼠标离开
        $(this).find('.popover').hide();
    }
}) 

// 筛选信息交互
select.chooseSpan = function(all,that,className){
    $(all).removeClass(className);
    $(that).addClass(className);
}
/* 学科+学期+试题来源+知识点+试题状态 点击选择交互 */
$('body').on('click', select.opti.item, function(){
    var that = this,
        all = $(that).parent('li').siblings(),
        thatLi = $(that).parent('li');
    select.chooseSpan(all,thatLi,'active');
    if ($(that).parents('ul').attr('id') != 'select_subject' && $(that).parents('.wrap-body').hasClass('wrong_test_lists_live')) {
        select.getTestList($(this).parents('ul').attr('id'));//因为学科年级知识点的三级联动也调了select.getTestList()，为避免重复，所以这里排除掉学科
    }
})

// 知识点的展开收起
$(select.opti.selector).on('click', function() {
    var that = this;
    /* 选择框已经打开处理分支 */
    if ($(that).hasClass('showSelect')) {
        select.selectorHide(that);
    } else {
        select.selectorShow(that);
    }
});
// 展示知识点
select.selectorShow = function(that){
    $(that).children('a').html('收起知识点');
    $(that).children('i').removeClass('fa-angle-down fa-chevron-down').addClass('fa-angle-up fa-chevron-up');
    $(that).addClass('showSelect');
    $(select.opti.pointInput).parent().css({'height':'auto', 'overflow': 'auto'});
}
// 隐藏知识点
select.selectorHide = function(that){
    $(that).children('a').html('更多知识点');
    $(that).children('i').removeClass('fa-angle-up fa-chevron-up').addClass('fa-angle-down fa-chevron-down');
    $(that).removeClass('showSelect');
    $(select.opti.pointInput).parent().css({'height':'48px', 'overflow': 'hidden'});
}

// 获取当前选中的筛选项
select.getTestList = function(search){
    var params = [];
    for (var j = 0; j < $(select.opti.grade).parent('li.current').length; j ++ ) {
        params.push($(select.opti.grade).parent('li.current').eq(j).find('a').attr('id'));
    }
    var searchType = 0;
    switch (search) {
        case "select_subject": 
            searchType = 1;
            break;
        case "select_grades": 
            searchType = 2;
            break;
        case "select_range": 
            searchType = 3;
            break;
        case "select_term": 
            searchType = 4;
            break;
        case "select_source": 
            searchType = 5;
            break;
        case "select_status": 
            searchType = 6;
            break;
        default:
            searchType = 0;
    }
    $.ajax({
        url: '/WrongTests/search',
        data: {
            subject: $('#select_subject li.active a').attr('id'),
            term: $('#select_term li.active a').attr('id'),
            source: $('#select_source li.active a').attr('id'),
            range: $('#select_range li.active a').attr('id'),
            status: $('#select_status li.active a').attr('id'),
            grades: params,
            page: 1,
            searchType: searchType
        },
        type: "POST",
        dataType: 'html',
        success: function(res){
            var resData = xue.ajaxCheck.html(res);
            if (resData) {
                $('.live_wrong_test').html(resData);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'live_wrong_test']);
            }
            if ($('.wrongQuest-download').hasClass('disable')) {
                if ($('#wrongQuest_sum').text().trim() != 0) {
                    $('.wrongQuest-download').removeClass('disable');
                }
            }else {
                if ($('#wrongQuest_sum').text().trim() == 0) {
                    $('.wrongQuest-download').addClass('disable');
                }
            }
        },
        error: function(){

        }
    });
}

// 未订正 + 移除错题本
$('body').on('click', '.que .notCure',function(){
    if ($(this).hasClass('disable')) {
        return false;
    }
    var that = this;
    $.ajax({
        url: '/WrongTests/correct',
        data: {
            id: $(this).parents('.que').attr('id'),
            type: 1
        },
        type: "POST",
        dataType: 'json',
        success: function(res){
            if (res.sign == 0) {
                alert(res.data);
            }
            else if(res.sign == 1){
                $(that).parents('.que').remove();
                select.getTestList(0);
            } 
            else if(res.sign == 2){
                window.location.href = res.msg;
            }   
        },
        error: function(){
            alert('出错了');
        }
    });
});
$('body').on('click', '.que .removeQues',function(){
    var that = this;
    $.ajax({
        url: '/WrongTests/remove',
        data: {
            id: $(this).parents('.que').attr('id'),
            type: 1
        },
        type: "POST",
        dataType: 'json',
        success: function(res){
            if (res.sign == 0) {
                alert(res.data);
            }
            else if(res.sign == 1){
                $(that).parents('.que').remove();
                select.getTestList(0);
            }
            else if(res.sign == 2){
                window.location.href = res.msg;
            } 
        },
        error: function(){
            alert('出错了');
        }
    });
});

// 下载错题本
$('.wrongQuest-download').on('click',function(){
    if ($(this).hasClass('disable')) {
        return false;
    }
    $('.downQuesMask').show();
    select.getDownInfo();
});
// 错题本版本选择
$('.version').on('click',function(){
    $(this).addClass('active').siblings('.version').removeClass('active');
});
// 错题分批下载单选按钮个数
select.getDownInfo = function(){
    var arrGrade = [];
    for (var i = 0; i < $('#select_grades li.current').length; i ++) {
        arrGrade.push($('#select_grades li.current').eq(i).find('a').text());
    }
    arrGrade.join('、');
    if ($('#select_source li.active a').text() == '全部' || $('#select_term li.active a').text() == '全部') {
        if ($('#select_source li.active a').text() == '全部' && $('#select_term li.active a').text() == '全部') {
            $('.quesNum i').text($('#select_subject li.active a').text()+'——'+arrGrade); 
        }
        if ($('#select_source li.active a').text() != '全部' && $('#select_term li.active a').text() == '全部') {
            $('.quesNum i').text($('#select_subject li.active a').text()+'——'+arrGrade+'——'+$('#select_source li.active a').text()); 
        }
        if ($('#select_source li.active a').text() == '全部' && $('#select_term li.active a').text() != '全部') {
            $('.quesNum i').text($('#select_subject li.active a').text()+'——'+arrGrade+'——'+$('#select_term li.active a').text()); 
        }
    }else {
        $('.quesNum i').text($('#select_subject li.active a').text()+'——'+arrGrade+'——'+$('#select_term li.active a').text()+'——'+$('#select_source li.active a').text()); 
    }
    $('.quesNum b').text($('#wrongQuest_sum').text());
    var quesNum = $('#wrongQuest_sum').text();
    var radioNum = Math.ceil(quesNum/100);
    if (radioNum > 1) {
        var tpl = '<div class="downPart"><p>由于试题下载量过大，生成速度缓慢，请分批下载</p><ul>';
        tpl += '<li><input type="radio" name="quesPart" id="part1" checked><label for="part1"><span>1-100</span>题</label></li>';
        var start = 1,
            end = 100;
        for (var i = 0; i < radioNum-2; i ++) {
            start += 100;
            end += 100;
            tpl += '<li><input type="radio" name="quesPart" id="part'+ (i+2) +'"><label for="part'+ (i+2) +'"><span>'+ start +'-'+ end +'</span>题</label></li>';
        }
        tpl += '<li><input type="radio" name="quesPart" id="part'+ radioNum +'"><label for="part'+ radioNum +'"><span>'+ (end+1) +'-'+ quesNum +'</span>题</label></li></ul></div>';
        $('.downQuesCont .quesNum').after(tpl);
    }
}

// 关闭错题本弹窗
$('.closeDownload').on('click',function(){
    $('.downPart').remove();
    $('.downloadBtn a').text('下载');
    $('.downQuesMask').hide();
});
// 下载按钮
$('.downloadBtn a').on('click', function(){
    if ($(this).hasClass('disable')) {
        return false;
    }
    $(this).addClass('disable');
    $('.loadWrongQues').show();

    var analytic = $('.versionOpt .version.active').attr('id');
    var grades = [];
    for (var j = 0; j < $(select.opti.grade).parent('li.current').length; j ++ ) {
        grades.push($(select.opti.grade).parent('li.current').eq(j).find('a').attr('id'));
    }
    if ($('.downPart').length > 0) {
        var dsize = $('.downPart ul li input:checked').next('label').find('span').text();
    }else {
        var dsize = '';
    }
    $.ajax({
        url: '/WrongTests/down',
        data: {
            subject: $('#select_subject li.active a').attr('id'),
            term: $('#select_term li.active a').attr('id'),
            source: $('#select_source li.active a').attr('id'),
            range: $('#select_range li.active a').attr('id'),
            status: $('#select_status li.active a').attr('id'),
            grades: grades,
            type: 1,
            analytic: analytic,
            dsize: dsize
        },
        type: "POST",
        dataType: 'json',
        success: function(res){
            if (res.sign == 0) {
                alert(res.data);
                $('.loadWrongQues').hide();
                $('.downloadBtn a').text('重新下载');
                $('.downloadBtn a').removeClass('disable');
            }
            else if(res.sign == 1){
                $('.loadWrongQues').hide();
                $('.downloadBtn a').text('下载');
                $('.downloadBtn a').removeClass('disable');
                window.location = res.data;
                if ($('.downQuesCont .downPart').length == 0) {
                    $('.closeDownload').click();
                }
            } 
            else if(res.sign == 2){
                window.location.href = res.msg;
            } 
        },
        error: function(){
            alert('出错了');
        }
    });
});
;/*!widget/Public.Topbar/topbar.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-30 14:50:51
 * @version $Id$
 */
$(function() {
    dropdown.init();
});; /*!widget/Public.Video/video.js*/
var xue = xue || {};
xue.video = xue.video || {};
(function() {
    var v = xue.video;
    v.opt = {
        url: '',
        dom: '.video-player-wrap'
    };
    v.get = function(url) {
        var _url = $(v.opt.dom).data('url') || url || v.opt.url;
        var _params = $(v.opt.dom).data('params') || '';
        if (_url == '' || !_url) {
            return this;
        }
        //        if(window.XDomainRequest){
        //            xdr = new XDomainRequest();
        //            if (xdr) {
        //                xdr.onerror = function(){
        //                    alert('error！');
        //                };
        ////                    xdr.ontimeout = 10000;
        //                xdr.onprogress = function(){
        //                    alert('progress……');
        //                };
        //                xdr.onload = function(){
        //                    $(v.opt.dom).html(xdr.responseText);
        //                };
        //                xdr.timeout = 10000;
        //                xdr.open("get", _url);
        //                xdr.withCredentials = true;
        //                xdr.send();
        //            } else {
        //                alert("Failed to create");
        //            }
        //        }else{
        $.ajax({
            url: _url,
            type: 'GET',
            dataType: 'html',
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                $(v.opt.dom).html(result);
            }
        });
        //        }
        return this;
        //        $(v.opt.dom).get(_url, _params);
    };
}());
$(function() {
    if ($(xue.video.opt.dom).length > 0) {
        xue.video.get();
    }
});; /*!widget/UserHome.courses/courseStudycenter.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
// 头像切换封装函数
var courses = courses || {};
courses.avatar = courses.avatar || {};
(function(a) {
    a.box = {
        pic: null,
        list: null,
        btn: null
    };
    a.step = $(".avatar-items li").width();
    a.size = 0;
    a.max = 0;
    a.len = 0;
    a.toggle = function(expr) {
        var btn = $(expr);
        if (btn.length == 0) {
            return;
        }
        var wrap = btn.parent();
        var pic = wrap.hasClass('avatar-roll') ? wrap.siblings('.avatar-items') : wrap.find('.avatar-items');
        if (pic.length == 0) {
            return;
        }
        this.box.pic = pic;
        this.box.list = pic.find('li');
        this.box.btn = btn;
        this.box.prev = btn.hasClass('prev') ? btn : btn.siblings('.prev');
        this.box.next = btn.hasClass('next') ? btn : btn.siblings('.next');
        this.step = $(".avatar-items li").width();
        this.size = this.box.list.length;
        this.max = this.size - 1;
        var list = pic.find('li');
        var left = pic.css('margin-left');
        this.left = Number(left.replace('px', ''));
        if (btn.hasClass('prev')) {
            a.prev();
        } else {
            a.next();
        }
    }
    a.prev = function() {
        if (a.left < 0) {
            a.box.pic.animate({
                marginLeft: '+=' + a.step + 'px'
            }, 500, function() {
                a.left += a.step;
                a.setCls();
                if (a.left >= 0) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };
    a.next = function() {
        var box = a.box.pic,
            left = Number(box.css('margin-left').replace('px', ''));
        if (a.left > -(a.max * a.step)) {
            a.box.pic.animate({
                marginLeft: '-=' + a.step + 'px'
            }, 500, function() {
                a.left -= a.step;
                a.setCls();
                if (a.left <= -(a.max * a.step)) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };
    a.setCls = function() {
        var hasNext = Math.abs(a.left) < ((a.box.list.length - 1) * a.step);
        var hasPrev = a.left < 0;
        if (hasNext) {
            a.box.next.removeClass('none');
        } else {
            a.box.next.addClass('none');
        }
        if (hasPrev) {
            a.box.prev.removeClass('none');
        } else {
            a.box.prev.addClass('none');
        }
    };
})(courses.avatar);
// 绑定老师头像切换事件
$(function() {
    $('body').off('click', '.avatar-roll a, .majar-items .prev, .majar-items .next').on('click', '.avatar-roll a, .majar-items .prev, .majar-items .next', function() {
        var that = $(this);
        if (that.hasClass('none')) {
            return false;
        } else {
            courses.avatar.toggle(that)
        }
    });
})
// 随堂测试弹框
function testLive(dom) {
    $(dom).popover({
        placement: 'top',
        html: true,
        trigger: 'hover',
        title: '',
        content: function() {
            var listTest_html = $(this).parents('.amount-show').siblings('.listTest-pop').html();
            return listTest_html;
        }
    });
}
// 直播辅导弹框
function liveHelp(dom) {
    $(dom).popover({
        placement: 'top',
        html: true,
        trigger: 'hover',
        title: '',
        content: function() {
            var listTest_html = $(this).parents('.amount-show').siblings('.list-help-pop').html();
            return listTest_html;
        }
    });
}
//辅导导师头像弹层
function QrCodeInstructor(dom) {
    $(dom).popover({
        placement: 'top',
        html: true,
        trigger: 'hover',
        title: '',
        content: function() {
            var listTest_html = $(this).find('.QR-code-instructor').html();
            return listTest_html;
        }
    });
}
// 讲义资料弹框tab事件
$('body').on('click', '.material-wrap .material-tab li', function() {
        var index = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $('.material-content').eq(index).show().siblings('.material-content').hide();
    })
    // 录播课程
function tabRecord() {
    $('.teacher-tab li').on('click', function() {
        index = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $(this).parents('.teacher-tab').siblings('.tab-record-content').find('.tab-pane').eq(index).addClass('active').siblings().removeClass('active');
    });
};
// 大纲tab切换
function tabProgram() {
    $('.program-tab li').on('click', function() {
        index = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $('.tab-program-content .tab-program-content-general').eq(index).addClass('active').siblings().removeClass('active');
    });
};
$(function() {
    // 退课成功
    $('body').on('click', '.drop-course-detail-inner .drop-course-btn', function() {
        var result = $('.dropCourse-success-wrap').html();
        $('#dropCourse .modal-body').html(result);
        countDown(3, '#dropCourse');
    });
    // var countDownTime=parseInt(3);    //在这里设置时长
    function countDown(countDownTime, courseDownTimeId) {
        $('.setTimeNum').text(countDownTime);
        var timer = setInterval(function() {
            if (countDownTime > 1) {
                countDownTime--;
                $('.setTimeNum').text(countDownTime);
            } else {
                clearInterval(timer);
                $(courseDownTimeId).modal('hide');
                $("#course_lists_label li.active").click();
            }
        }, 1000);
        // 手动关闭弹层时清除计时器
        $(courseDownTimeId).on('hide.bs.modal', function(e) {
            clearInterval(timer);
        });
    }
    // 退课成功
    // $('body').on('click', '.drop-course-detail-inner .drop-charge', function() {
    //     $('.drop-charge-explain-wrap').toggleClass('dropCharge-hide');
    // });
    // 临时调课成功
    $('body').on('click', '.temporary-adjust-course-detail-inner .drop-course-btn', function() {
        var result = $('.temporary-adjust-wrap').html();
        $('#temporaryAdjustCourse .modal-body').html(result);
    });
    // 永久调课确认按钮点击
    $('body').on('click', '.permanent-adjust-course-detail-inner .drop-course-btn', function() {
        var result = $('.permanent-adjust-wrap').html();
        $('#permanentAdjustCourse .modal-body').html(result);
        countDown(3, '#permanentAdjustCourse');
    });
    // 永久调课无课状态下确认按钮点击
    $('body').on('click', '.permanent-adjust-nocourse-detail .drop-course-btn', function() {
        $('#permanentAdjustCourse').modal('hide');
    });
    // 永久调课场次调整点击事件
    $('body').off('click', '.adjust-course-select li a').on('click', '.adjust-course-select li a', function() {
        if ($(this).parent('li').hasClass("adjustActive")) {
            $(this).parent('li').removeClass('adjustActive');
            $('.permanent-adjust-course-detail-inner .ajust-course-btn').attr('disabled', true);
        } else {
            $(this).parent('li').addClass('adjustActive').siblings('li').removeClass('adjustActive');
            $('.permanent-adjust-course-detail-inner .ajust-course-btn').attr('disabled', false);
        }
    })
});
$('body').on('click', '.moreService .moreServiceBtn', function() {
    $('.userhome_new .service').css({
        right: -135
    })
    $(this).closest('.moreService').find('.service').css({
        right: 0
    })
})
$('body').on('click', '.service .closeService', function() {
    $(this).closest('.service').css({
        right: -135
    })
})
$('body').on('mouseleave', '.moreService .service', function() {
        var $this = $(this);
        setTimeout(function() {
            $this.css({
                right: -135
            })
        }, 500)
    })
    // $(window).scroll(function() {
    //     console.debug($(this).scrollTop() + $(window).height());
    // });
; /*!widget/UserHome.courses/cycle.js*/
//首页+产品列表页进度条
(function($) {
    $.fn.svgCircle = function(i) {
        i = $.extend({
            parent: null,
            w: 75,
            R: 30,
            sW: 20,
            color: ["#000", "#000"],
            perent: [100, 100],
            speed: 0,
            delay: 1000
        }, i);
        return this.each(function() {
            var e = i.parent;
            if (!e) return false;
            var w = i.w;
            var r = Raphael(e, w, w),
                R = i.R,
                init = true,
                param = {
                    stroke: "#f2dab1"
                },
                hash = document.location.hash,
                marksAttr = {
                    fill: hash || "#444",
                    stroke: "none"
                };
            r.customAttributes.arc = function(b, c, R) {
                var d = 360 / c * b,
                    a = (90 - d) * Math.PI / 180,
                    x = w / 2 + R * Math.cos(a),
                    y = w / 2 - R * Math.sin(a),
                    color = i.color,
                    path;
                if (c == b) {
                    path = [
                        ["M", w / 2, w / 2 - R],
                        ["A", R, R, 0, 1, 1, w / 2 - 0.01, w / 2 - R]
                    ]
                } else {
                    path = [
                        ["M", w / 2, w / 2 - R],
                        ["A", R, R, 0, +(d > 180), 1, x, y]
                    ]
                }
                return {
                    path: path
                }
            };
            var f = r.path().attr({
                stroke: "#eeeeee",
                "stroke-width": i.sW
            }).attr({
                arc: [100, 100, R]
            });
            var g = r.path().attr({
                stroke: "#f36767",
                "stroke-width": i.sW
            }).attr(param).attr({
                arc: [0.01, i.speed, R]
            });
            var h;
            if (i.perent[1] > 0) {
                setTimeout(function() {
                    g.animate({
                        stroke: i.color[1],
                        arc: [i.perent[1], 100, R]
                    }, 900, ">")
                }, i.delay)
            } else {
                g.hide()
            }
        })
    }
})(jQuery);
function progressBar() {
    var c = $('.processingbar');
    animateEle();
    $(window).scroll(function() {
        animateEle()
    });
    function animateEle() {
        var b = {
            top: $(window).scrollTop(),
            bottom: $(window).scrollTop() + $(window).height()
        };
        c.each(function() {
            if (b.top <= $(this).offset().top && b.bottom >= $(this).offset().top && !$(this).data('bPlay')) {
                $(this).data('bPlay', true);
                var a = $(this).parent().find('font').text().replace(/\%/, '');
                if ($(this).find("font").text() !== "0%") {
                    $(this).svgCircle({
                        parent: $(this)[0],
                        w: 112,
                        R: 54,
                        sW: 3,
                        color: ["#5abdeb", "#5abdeb", "#5abdeb"],
                        perent: [100, a],
                        speed: 150,
                        delay: 400
                    })
                }
                if ($(this).find("font").text() == "0%") {
                    $(this).find("font").css("color", "#a9a9a9");
                    $(this).svgCircle({
                        parent: $(this)[0],
                        w: 112,
                        R: 54,
                        sW: 3,
                        color: ["#d1d1d1", "#d1d1d1", "#d1d1d1"],
                        perent: [100, a],
                        speed: 150,
                        delay: 400
                    })
                }
            }
        })
    }
}
var pie = {
    run: function(a) {
        if (!a.id) throw new Error("must be canvas id.");
        var b = document.getElementById(a.id),
            ctx;
        if (b && (ctx = b.getContext("2d"))) {
            b.width = b.height = "200";
            var c = function() {};
            var d = a.onBefore || c;
            var e = a.onAfter || c;
            d(ctx);
            ctx.fillStyle = a.color || '#5abdeb';
            var f = a.step || 1;
            var g = a.delay || 10;
            var i = 0,
                rage = 360 * (a.percent || 0);
            var h = -Math.PI * 0.5;
            var j = function() {
                i = i + f;
                if (i <= rage) {
                    ctx.beginPath();
                    ctx.moveTo(100, 100);
                    ctx.arc(100, 100, 100, h, Math.PI * 2 * (i / 360) + h);
                    ctx.fill();
                    setTimeout(j, g)
                } else {
                    e(ctx)
                }
            };
            j()
        }
    }
};; /*!widget/UserHome.courses/raphael.js*/
/*
 * Raphael 1.5.2 - JavaScript Vector Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://raphaeljs.com/license.html) license.
 */
(function() {
    function a() {
        if (a.is(arguments[0], G)) {
            var b = arguments[0],
                d = bV[m](a, b.splice(0, 3 + a.is(b[0], E))),
                e = d.set();
            for (var g = 0, h = b[w]; g < h; g++) {
                var i = b[g] || {};
                c[f](i.type) && e[L](d[i.type]().attr(i))
            }
            return e
        }
        return bV[m](a, arguments)
    }
    a.version = "1.5.2";
    var b = /[, ]+/,
        c = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        },
        d = /\{(\d+)\}/g,
        e = "prototype",
        f = "hasOwnProperty",
        g = document,
        h = window,
        i = {
            was: Object[e][f].call(h, "Raphael"),
            is: h.Raphael
        },
        j = function() {
            this.customAttributes = {}
        },
        k, l = "appendChild",
        m = "apply",
        n = "concat",
        o = "createTouch" in g,
        p = "",
        q = " ",
        r = String,
        s = "split",
        t = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend" [s](q),
        u = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        v = "join",
        w = "length",
        x = r[e].toLowerCase,
        y = Math,
        z = y.max,
        A = y.min,
        B = y.abs,
        C = y.pow,
        D = y.PI,
        E = "number",
        F = "string",
        G = "array",
        H = "toString",
        I = "fill",
        J = Object[e][H],
        K = {},
        L = "push",
        M = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        N = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        O = {
            "NaN": 1,
            Infinity: 1,
            "-Infinity": 1
        },
        P = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        Q = y.round,
        R = "setAttribute",
        S = parseFloat,
        T = parseInt,
        U = " progid:DXImageTransform.Microsoft",
        V = r[e].toUpperCase,
        W = {
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: "10px \"Arial\"",
            "font-family": "\"Arial\"",
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            opacity: 1,
            path: "M0,0",
            r: 0,
            rotation: 0,
            rx: 0,
            ry: 0,
            scale: "1 1",
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            translation: "0 0",
            width: 0,
            x: 0,
            y: 0
        },
        X = {
            along: "along",
            blur: E,
            "clip-rect": "csv",
            cx: E,
            cy: E,
            fill: "colour",
            "fill-opacity": E,
            "font-size": E,
            height: E,
            opacity: E,
            path: "path",
            r: E,
            rotation: "csv",
            rx: E,
            ry: E,
            scale: "csv",
            stroke: "colour",
            "stroke-opacity": E,
            "stroke-width": E,
            translation: "csv",
            width: E,
            x: E,
            y: E
        },
        Y = "replace",
        Z = /^(from|to|\d+%?)$/,
        $ = /\s*,\s*/,
        _ = {
            hs: 1,
            rg: 1
        },
        ba = /,?([achlmqrstvxz]),?/gi,
        bb = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        bc = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
        bd = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/,
        be = function(a, b) {
            return a.key - b.key
        };
    a.type = h.SVGAngle || g.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
    if (a.type == "VML") {
        var bf = g.createElement("div"),
            bg;
        bf.innerHTML = "<v:shape adj=\"1\"/>";
        bg = bf.firstChild;
        bg.style.behavior = "url(#default#VML)";
        if (!(bg && typeof bg.adj == "object")) return a.type = null;
        bf = null
    }
    a.svg = !(a.vml = a.type == "VML");
    j[e] = a[e];
    k = j[e];
    a._id = 0;
    a._oid = 0;
    a.fn = {};
    a.is = function(a, b) {
        b = x.call(b);
        if (b == "finite") return !O[f](+a);
        return b == "null" && a === null || b == typeof a || b == "object" && a === Object(a) || b == "array" && Array.isArray && Array.isArray(a) || J.call(a).slice(8, -1).toLowerCase() == b
    };
    a.angle = function(b, c, d, e, f, g) {
        {
            if (f == null) {
                var h = b - d,
                    i = c - e;
                if (!h && !i) return 0;
                return ((h < 0) * 180 + y.atan(-i / -h) * 180 / D + 360) % 360
            }
            return a.angle(b, c, f, g) - a.angle(d, e, f, g)
        }
    };
    a.rad = function(a) {
        return a % 360 * D / 180
    };
    a.deg = function(a) {
        return a * 180 / D % 360
    };
    a.snapTo = function(b, c, d) {
        d = a.is(d, "finite") ? d : 10;
        if (a.is(b, G)) {
            var e = b.length;
            while (e--)
                if (B(b[e] - c) <= d) return b[e]
        } else {
            b = +b;
            var f = c % b;
            if (f < d) return c - f;
            if (f > b - d) return c - f + b
        }
        return c
    };
    function bh() {
        var a = [],
            b = 0;
        for (; b < 32; b++) a[b] = (~(~(y.random() * 16)))[H](16);
        a[12] = 4;
        a[16] = (a[16] & 3 | 8)[H](16);
        return "r-" + a[v]("")
    }
    a.setWindow = function(a) {
        h = a;
        g = h.document
    };
    var bi = function(b) {
            if (a.vml) {
                var c = /^\s+|\s+$/g,
                    d;
                try {
                    var e = new ActiveXObject("htmlfile");
                    e.write("<body>");
                    e.close();
                    d = e.body
                } catch (a) {
                    d = createPopup().document.body
                }
                var f = d.createTextRange();
                bi = bm(function(a) {
                    try {
                        d.style.color = r(a)[Y](c, p);
                        var b = f.queryCommandValue("ForeColor");
                        b = (b & 255) << 16 | b & 65280 | (b & 16711680) >>> 16;
                        return "#" + ("000000" + b[H](16)).slice(-6)
                    } catch (a) {
                        return "none"
                    }
                })
            } else {
                var h = g.createElement("i");
                h.title = "Raphaël Colour Picker";
                h.style.display = "none";
                g.body[l](h);
                bi = bm(function(a) {
                    h.style.color = a;
                    return g.defaultView.getComputedStyle(h, p).getPropertyValue("color")
                })
            }
            return bi(b)
        },
        bj = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")"
        },
        bk = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")"
        },
        bl = function() {
            return this.hex
        };
    a.hsb2rgb = function(b, c, d, e) {
        if (a.is(b, "object") && "h" in b && "s" in b && "b" in b) {
            d = b.b;
            c = b.s;
            b = b.h;
            e = b.o
        }
        return a.hsl2rgb(b, c, d / 2, e)
    };
    a.hsl2rgb = function(b, c, d, e) {
        if (a.is(b, "object") && "h" in b && "s" in b && "l" in b) {
            d = b.l;
            c = b.s;
            b = b.h
        }
        if (b > 1 || c > 1 || d > 1) {
            b /= 360;
            c /= 100;
            d /= 100
        }
        var f = {},
            g = ["r", "g", "b"],
            h, i, j, k, l, m;
        if (c) {
            d < 0.5 ? h = d * (1 + c) : h = d + c - d * c;
            i = 2 * d - h;
            for (var n = 0; n < 3; n++) {
                j = b + 1 / 3 * -(n - 1);
                j < 0 && j++;
                j > 1 && j--;
                j * 6 < 1 ? f[g[n]] = i + (h - i) * 6 * j : j * 2 < 1 ? f[g[n]] = h : j * 3 < 2 ? f[g[n]] = i + (h - i) * (2 / 3 - j) * 6 : f[g[n]] = i
            }
        } else f = {
            r: d,
            g: d,
            b: d
        };
        f.r *= 255;
        f.g *= 255;
        f.b *= 255;
        f.hex = "#" + (16777216 | f.b | f.g << 8 | f.r << 16).toString(16).slice(1);
        a.is(e, "finite") && (f.opacity = e);
        f.toString = bl;
        return f
    };
    a.rgb2hsb = function(b, c, d) {
        if (c == null && a.is(b, "object") && "r" in b && "g" in b && "b" in b) {
            d = b.b;
            c = b.g;
            b = b.r
        }
        if (c == null && a.is(b, F)) {
            var e = a.getRGB(b);
            b = e.r;
            c = e.g;
            d = e.b
        }
        if (b > 1 || c > 1 || d > 1) {
            b /= 255;
            c /= 255;
            d /= 255
        }
        var f = z(b, c, d),
            g = A(b, c, d),
            h, i, j = f; {
            if (g == f) return {
                h: 0,
                s: 0,
                b: f,
                toString: bj
            };
            var k = f - g;
            i = k / f;
            b == f ? h = (c - d) / k : c == f ? h = 2 + (d - b) / k : h = 4 + (b - c) / k;
            h /= 6;
            h < 0 && h++;
            h > 1 && h--
        }
        return {
            h: h,
            s: i,
            b: j,
            toString: bj
        }
    };
    a.rgb2hsl = function(b, c, d) {
        if (c == null && a.is(b, "object") && "r" in b && "g" in b && "b" in b) {
            d = b.b;
            c = b.g;
            b = b.r
        }
        if (c == null && a.is(b, F)) {
            var e = a.getRGB(b);
            b = e.r;
            c = e.g;
            d = e.b
        }
        if (b > 1 || c > 1 || d > 1) {
            b /= 255;
            c /= 255;
            d /= 255
        }
        var f = z(b, c, d),
            g = A(b, c, d),
            h, i, j = (f + g) / 2,
            k;
        if (g == f) k = {
            h: 0,
            s: 0,
            l: j
        };
        else {
            var l = f - g;
            i = j < 0.5 ? l / (f + g) : l / (2 - f - g);
            b == f ? h = (c - d) / l : c == f ? h = 2 + (d - b) / l : h = 4 + (b - c) / l;
            h /= 6;
            h < 0 && h++;
            h > 1 && h--;
            k = {
                h: h,
                s: i,
                l: j
            }
        }
        k.toString = bk;
        return k
    };
    a._path2string = function() {
        return this.join(",")[Y](ba, "$1")
    };
    function bm(a, b, c) {
        function d() {
            var g = Array[e].slice.call(arguments, 0),
                h = g[v]("►"),
                i = d.cache = d.cache || {},
                j = d.count = d.count || [];
            if (i[f](h)) return c ? c(i[h]) : i[h];
            j[w] >= 1000 && delete i[j.shift()];
            j[L](h);
            i[h] = a[m](b, g);
            return c ? c(i[h]) : i[h]
        }
        return d
    }
    a.getRGB = bm(function(b) {
        if (!b || !(!((b = r(b)).indexOf("-") + 1))) return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1
        };
        if (b == "none") return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none"
        };
        !(_[f](b.toLowerCase().substring(0, 2)) || b.charAt() == "#") && (b = bi(b));
        var c, d, e, g, h, i, j, k = b.match(N);
        if (k) {
            if (k[2]) {
                g = T(k[2].substring(5), 16);
                e = T(k[2].substring(3, 5), 16);
                d = T(k[2].substring(1, 3), 16)
            }
            if (k[3]) {
                g = T((i = k[3].charAt(3)) + i, 16);
                e = T((i = k[3].charAt(2)) + i, 16);
                d = T((i = k[3].charAt(1)) + i, 16)
            }
            if (k[4]) {
                j = k[4][s]($);
                d = S(j[0]);
                j[0].slice(-1) == "%" && (d *= 2.55);
                e = S(j[1]);
                j[1].slice(-1) == "%" && (e *= 2.55);
                g = S(j[2]);
                j[2].slice(-1) == "%" && (g *= 2.55);
                k[1].toLowerCase().slice(0, 4) == "rgba" && (h = S(j[3]));
                j[3] && j[3].slice(-1) == "%" && (h /= 100)
            }
            if (k[5]) {
                j = k[5][s]($);
                d = S(j[0]);
                j[0].slice(-1) == "%" && (d *= 2.55);
                e = S(j[1]);
                j[1].slice(-1) == "%" && (e *= 2.55);
                g = S(j[2]);
                j[2].slice(-1) == "%" && (g *= 2.55);
                (j[0].slice(-3) == "deg" || j[0].slice(-1) == "°") && (d /= 360);
                k[1].toLowerCase().slice(0, 4) == "hsba" && (h = S(j[3]));
                j[3] && j[3].slice(-1) == "%" && (h /= 100);
                return a.hsb2rgb(d, e, g, h)
            }
            if (k[6]) {
                j = k[6][s]($);
                d = S(j[0]);
                j[0].slice(-1) == "%" && (d *= 2.55);
                e = S(j[1]);
                j[1].slice(-1) == "%" && (e *= 2.55);
                g = S(j[2]);
                j[2].slice(-1) == "%" && (g *= 2.55);
                (j[0].slice(-3) == "deg" || j[0].slice(-1) == "°") && (d /= 360);
                k[1].toLowerCase().slice(0, 4) == "hsla" && (h = S(j[3]));
                j[3] && j[3].slice(-1) == "%" && (h /= 100);
                return a.hsl2rgb(d, e, g, h)
            }
            k = {
                r: d,
                g: e,
                b: g
            };
            k.hex = "#" + (16777216 | g | e << 8 | d << 16).toString(16).slice(1);
            a.is(h, "finite") && (k.opacity = h);
            return k
        }
        return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1
        }
    }, a);
    a.getColor = function(a) {
        var b = this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: a || 0.75
            },
            c = this.hsb2rgb(b.h, b.s, b.b);
        b.h += 0.075;
        if (b.h > 1) {
            b.h = 0;
            b.s -= 0.2;
            b.s <= 0 && (this.getColor.start = {
                h: 0,
                s: 1,
                b: b.b
            })
        }
        return c.hex
    };
    a.getColor.reset = function() {
        delete this.start
    };
    a.parsePathString = bm(function(b) {
        if (!b) return null;
        var c = {
                a: 7,
                c: 6,
                h: 1,
                l: 2,
                m: 2,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                z: 0
            },
            d = [];
        a.is(b, G) && a.is(b[0], G) && (d = bo(b));
        d[w] || r(b)[Y](bb, function(a, b, e) {
            var f = [],
                g = x.call(b);
            e[Y](bc, function(a, b) {
                b && f[L](+b)
            });
            if (g == "m" && f[w] > 2) {
                d[L]([b][n](f.splice(0, 2)));
                g = "l";
                b = b == "m" ? "l" : "L"
            }
            while (f[w] >= c[g]) {
                d[L]([b][n](f.splice(0, c[g])));
                if (!c[g]) break
            }
        });
        d[H] = a._path2string;
        return d
    });
    a.findDotsAtSegment = function(a, b, c, d, e, f, g, h, i) {
        var j = 1 - i,
            k = C(j, 3) * a + C(j, 2) * 3 * i * c + j * 3 * i * i * e + C(i, 3) * g,
            l = C(j, 3) * b + C(j, 2) * 3 * i * d + j * 3 * i * i * f + C(i, 3) * h,
            m = a + 2 * i * (c - a) + i * i * (e - 2 * c + a),
            n = b + 2 * i * (d - b) + i * i * (f - 2 * d + b),
            o = c + 2 * i * (e - c) + i * i * (g - 2 * e + c),
            p = d + 2 * i * (f - d) + i * i * (h - 2 * f + d),
            q = (1 - i) * a + i * c,
            r = (1 - i) * b + i * d,
            s = (1 - i) * e + i * g,
            t = (1 - i) * f + i * h,
            u = 90 - y.atan((m - o) / (n - p)) * 180 / D;
        (m > o || n < p) && (u += 180);
        return {
            x: k,
            y: l,
            m: {
                x: m,
                y: n
            },
            n: {
                x: o,
                y: p
            },
            start: {
                x: q,
                y: r
            },
            end: {
                x: s,
                y: t
            },
            alpha: u
        }
    };
    var bn = bm(function(a) {
            if (!a) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            a = bw(a);
            var b = 0,
                c = 0,
                d = [],
                e = [],
                f;
            for (var g = 0, h = a[w]; g < h; g++) {
                f = a[g];
                if (f[0] == "M") {
                    b = f[1];
                    c = f[2];
                    d[L](b);
                    e[L](c)
                } else {
                    var i = bv(b, c, f[1], f[2], f[3], f[4], f[5], f[6]);
                    d = d[n](i.min.x, i.max.x);
                    e = e[n](i.min.y, i.max.y);
                    b = f[5];
                    c = f[6]
                }
            }
            var j = A[m](0, d),
                k = A[m](0, e);
            return {
                x: j,
                y: k,
                width: z[m](0, d) - j,
                height: z[m](0, e) - k
            }
        }),
        bo = function(b) {
            var c = [];
            if (!a.is(b, G) || !a.is(b && b[0], G)) b = a.parsePathString(b);
            for (var d = 0, e = b[w]; d < e; d++) {
                c[d] = [];
                for (var f = 0, g = b[d][w]; f < g; f++) c[d][f] = b[d][f]
            }
            c[H] = a._path2string;
            return c
        },
        bp = bm(function(b) {
            if (!a.is(b, G) || !a.is(b && b[0], G)) b = a.parsePathString(b);
            var c = [],
                d = 0,
                e = 0,
                f = 0,
                g = 0,
                h = 0;
            if (b[0][0] == "M") {
                d = b[0][1];
                e = b[0][2];
                f = d;
                g = e;
                h++;
                c[L](["M", d, e])
            }
            for (var i = h, j = b[w]; i < j; i++) {
                var k = c[i] = [],
                    l = b[i];
                if (l[0] != x.call(l[0])) {
                    k[0] = x.call(l[0]);
                    switch (k[0]) {
                        case "a":
                            k[1] = l[1];
                            k[2] = l[2];
                            k[3] = l[3];
                            k[4] = l[4];
                            k[5] = l[5];
                            k[6] = +(l[6] - d).toFixed(3);
                            k[7] = +(l[7] - e).toFixed(3);
                            break;
                        case "v":
                            k[1] = +(l[1] - e).toFixed(3);
                            break;
                        case "m":
                            f = l[1];
                            g = l[2];
                        default:
                            for (var m = 1, n = l[w]; m < n; m++) k[m] = +(l[m] - (m % 2 ? d : e)).toFixed(3)
                    }
                } else {
                    k = c[i] = [];
                    if (l[0] == "m") {
                        f = l[1] + d;
                        g = l[2] + e
                    }
                    for (var o = 0, p = l[w]; o < p; o++) c[i][o] = l[o]
                }
                var q = c[i][w];
                switch (c[i][0]) {
                    case "z":
                        d = f;
                        e = g;
                        break;
                    case "h":
                        d += +c[i][q - 1];
                        break;
                    case "v":
                        e += +c[i][q - 1];
                        break;
                    default:
                        d += +c[i][q - 2];
                        e += +c[i][q - 1]
                }
            }
            c[H] = a._path2string;
            return c
        }, 0, bo),
        bq = bm(function(b) {
            if (!a.is(b, G) || !a.is(b && b[0], G)) b = a.parsePathString(b);
            var c = [],
                d = 0,
                e = 0,
                f = 0,
                g = 0,
                h = 0;
            if (b[0][0] == "M") {
                d = +b[0][1];
                e = +b[0][2];
                f = d;
                g = e;
                h++;
                c[0] = ["M", d, e]
            }
            for (var i = h, j = b[w]; i < j; i++) {
                var k = c[i] = [],
                    l = b[i];
                if (l[0] != V.call(l[0])) {
                    k[0] = V.call(l[0]);
                    switch (k[0]) {
                        case "A":
                            k[1] = l[1];
                            k[2] = l[2];
                            k[3] = l[3];
                            k[4] = l[4];
                            k[5] = l[5];
                            k[6] = +(l[6] + d);
                            k[7] = +(l[7] + e);
                            break;
                        case "V":
                            k[1] = +l[1] + e;
                            break;
                        case "H":
                            k[1] = +l[1] + d;
                            break;
                        case "M":
                            f = +l[1] + d;
                            g = +l[2] + e;
                        default:
                            for (var m = 1, n = l[w]; m < n; m++) k[m] = +l[m] + (m % 2 ? d : e)
                    }
                } else
                    for (var o = 0, p = l[w]; o < p; o++) c[i][o] = l[o];
                switch (k[0]) {
                    case "Z":
                        d = f;
                        e = g;
                        break;
                    case "H":
                        d = k[1];
                        break;
                    case "V":
                        e = k[1];
                        break;
                    case "M":
                        f = c[i][c[i][w] - 2];
                        g = c[i][c[i][w] - 1];
                    default:
                        d = c[i][c[i][w] - 2];
                        e = c[i][c[i][w] - 1]
                }
            }
            c[H] = a._path2string;
            return c
        }, null, bo),
        br = function(a, b, c, d) {
            return [a, b, c, d, c, d]
        },
        bs = function(a, b, c, d, e, f) {
            var g = 1 / 3,
                h = 2 / 3;
            return [g * a + h * c, g * b + h * d, g * e + h * c, g * f + h * d, e, f]
        },
        bt = function(a, b, c, d, e, f, g, h, i, j) {
            var k = D * 120 / 180,
                l = D / 180 * (+e || 0),
                m = [],
                o, p = bm(function(a, b, c) {
                    var d = a * y.cos(c) - b * y.sin(c),
                        e = a * y.sin(c) + b * y.cos(c);
                    return {
                        x: d,
                        y: e
                    }
                });
            if (j) {
                G = j[0];
                H = j[1];
                E = j[2];
                F = j[3]
            } else {
                o = p(a, b, -l);
                a = o.x;
                b = o.y;
                o = p(h, i, -l);
                h = o.x;
                i = o.y;
                var q = y.cos(D / 180 * e),
                    r = y.sin(D / 180 * e),
                    t = (a - h) / 2,
                    u = (b - i) / 2,
                    x = t * t / (c * c) + u * u / (d * d);
                if (x > 1) {
                    x = y.sqrt(x);
                    c = x * c;
                    d = x * d
                }
                var z = c * c,
                    A = d * d,
                    C = (f == g ? -1 : 1) * y.sqrt(B((z * A - z * u * u - A * t * t) / (z * u * u + A * t * t))),
                    E = C * c * u / d + (a + h) / 2,
                    F = C * -d * t / c + (b + i) / 2,
                    G = y.asin(((b - F) / d).toFixed(9)),
                    H = y.asin(((i - F) / d).toFixed(9));
                G = a < E ? D - G : G;
                H = h < E ? D - H : H;
                G < 0 && (G = D * 2 + G);
                H < 0 && (H = D * 2 + H);
                g && G > H && (G = G - D * 2);
                !g && H > G && (H = H - D * 2)
            }
            var I = H - G;
            if (B(I) > k) {
                var J = H,
                    K = h,
                    L = i;
                H = G + k * (g && H > G ? 1 : -1);
                h = E + c * y.cos(H);
                i = F + d * y.sin(H);
                m = bt(h, i, c, d, e, 0, g, K, L, [H, J, E, F])
            }
            I = H - G;
            var M = y.cos(G),
                N = y.sin(G),
                O = y.cos(H),
                P = y.sin(H),
                Q = y.tan(I / 4),
                R = 4 / 3 * c * Q,
                S = 4 / 3 * d * Q,
                T = [a, b],
                U = [a + R * N, b - S * M],
                V = [h + R * P, i - S * O],
                W = [h, i];
            U[0] = 2 * T[0] - U[0];
            U[1] = 2 * T[1] - U[1]; {
                if (j) return [U, V, W][n](m);
                m = [U, V, W][n](m)[v]()[s](",");
                var X = [];
                for (var Y = 0, Z = m[w]; Y < Z; Y++) X[Y] = Y % 2 ? p(m[Y - 1], m[Y], l).y : p(m[Y], m[Y + 1], l).x;
                return X
            }
        },
        bu = function(a, b, c, d, e, f, g, h, i) {
            var j = 1 - i;
            return {
                x: C(j, 3) * a + C(j, 2) * 3 * i * c + j * 3 * i * i * e + C(i, 3) * g,
                y: C(j, 3) * b + C(j, 2) * 3 * i * d + j * 3 * i * i * f + C(i, 3) * h
            }
        },
        bv = bm(function(a, b, c, d, e, f, g, h) {
            var i = e - 2 * c + a - (g - 2 * e + c),
                j = 2 * (c - a) - 2 * (e - c),
                k = a - c,
                l = (-j + y.sqrt(j * j - 4 * i * k)) / 2 / i,
                n = (-j - y.sqrt(j * j - 4 * i * k)) / 2 / i,
                o = [b, h],
                p = [a, g],
                q;
            B(l) > "1e12" && (l = 0.5);
            B(n) > "1e12" && (n = 0.5);
            if (l > 0 && l < 1) {
                q = bu(a, b, c, d, e, f, g, h, l);
                p[L](q.x);
                o[L](q.y)
            }
            if (n > 0 && n < 1) {
                q = bu(a, b, c, d, e, f, g, h, n);
                p[L](q.x);
                o[L](q.y)
            }
            i = f - 2 * d + b - (h - 2 * f + d);
            j = 2 * (d - b) - 2 * (f - d);
            k = b - d;
            l = (-j + y.sqrt(j * j - 4 * i * k)) / 2 / i;
            n = (-j - y.sqrt(j * j - 4 * i * k)) / 2 / i;
            B(l) > "1e12" && (l = 0.5);
            B(n) > "1e12" && (n = 0.5);
            if (l > 0 && l < 1) {
                q = bu(a, b, c, d, e, f, g, h, l);
                p[L](q.x);
                o[L](q.y)
            }
            if (n > 0 && n < 1) {
                q = bu(a, b, c, d, e, f, g, h, n);
                p[L](q.x);
                o[L](q.y)
            }
            return {
                min: {
                    x: A[m](0, p),
                    y: A[m](0, o)
                },
                max: {
                    x: z[m](0, p),
                    y: z[m](0, o)
                }
            }
        }),
        bw = bm(function(a, b) {
            var c = bq(a),
                d = b && bq(b),
                e = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                },
                f = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                },
                g = function(a, b) {
                    var c, d;
                    if (!a) return ["C", b.x, b.y, b.x, b.y, b.x, b.y];
                    !(a[0] in {
                        T: 1,
                        Q: 1
                    }) && (b.qx = b.qy = null);
                    switch (a[0]) {
                        case "M":
                            b.X = a[1];
                            b.Y = a[2];
                            break;
                        case "A":
                            a = ["C"][n](bt[m](0, [b.x, b.y][n](a.slice(1))));
                            break;
                        case "S":
                            c = b.x + (b.x - (b.bx || b.x));
                            d = b.y + (b.y - (b.by || b.y));
                            a = ["C", c, d][n](a.slice(1));
                            break;
                        case "T":
                            b.qx = b.x + (b.x - (b.qx || b.x));
                            b.qy = b.y + (b.y - (b.qy || b.y));
                            a = ["C"][n](bs(b.x, b.y, b.qx, b.qy, a[1], a[2]));
                            break;
                        case "Q":
                            b.qx = a[1];
                            b.qy = a[2];
                            a = ["C"][n](bs(b.x, b.y, a[1], a[2], a[3], a[4]));
                            break;
                        case "L":
                            a = ["C"][n](br(b.x, b.y, a[1], a[2]));
                            break;
                        case "H":
                            a = ["C"][n](br(b.x, b.y, a[1], b.y));
                            break;
                        case "V":
                            a = ["C"][n](br(b.x, b.y, b.x, a[1]));
                            break;
                        case "Z":
                            a = ["C"][n](br(b.x, b.y, b.X, b.Y));
                            break
                    }
                    return a
                },
                h = function(a, b) {
                    if (a[b][w] > 7) {
                        a[b].shift();
                        var e = a[b];
                        while (e[w]) a.splice(b++, 0, ["C"][n](e.splice(0, 6)));
                        a.splice(b, 1);
                        k = z(c[w], d && d[w] || 0)
                    }
                },
                i = function(a, b, e, f, g) {
                    if (a && b && a[g][0] == "M" && b[g][0] != "M") {
                        b.splice(g, 0, ["M", f.x, f.y]);
                        e.bx = 0;
                        e.by = 0;
                        e.x = a[g][1];
                        e.y = a[g][2];
                        k = z(c[w], d && d[w] || 0)
                    }
                };
            for (var j = 0, k = z(c[w], d && d[w] || 0); j < k; j++) {
                c[j] = g(c[j], e);
                h(c, j);
                d && (d[j] = g(d[j], f));
                d && h(d, j);
                i(c, d, e, f, j);
                i(d, c, f, e, j);
                var l = c[j],
                    o = d && d[j],
                    p = l[w],
                    q = d && o[w];
                e.x = l[p - 2];
                e.y = l[p - 1];
                e.bx = S(l[p - 4]) || e.x;
                e.by = S(l[p - 3]) || e.y;
                f.bx = d && (S(o[q - 4]) || f.x);
                f.by = d && (S(o[q - 3]) || f.y);
                f.x = d && o[q - 2];
                f.y = d && o[q - 1]
            }
            return d ? [c, d] : c
        }, null, bo),
        bx = bm(function(b) {
            var c = [];
            for (var d = 0, e = b[w]; d < e; d++) {
                var f = {},
                    g = b[d].match(/^([^:]*):?([\d\.]*)/);
                f.color = a.getRGB(g[1]);
                if (f.color.error) return null;
                f.color = f.color.hex;
                g[2] && (f.offset = g[2] + "%");
                c[L](f)
            }
            for (d = 1, e = c[w] - 1; d < e; d++) {
                if (!c[d].offset) {
                    var h = S(c[d - 1].offset || 0),
                        i = 0;
                    for (var j = d + 1; j < e; j++) {
                        if (c[j].offset) {
                            i = c[j].offset;
                            break
                        }
                    }
                    if (!i) {
                        i = 100;
                        j = e
                    }
                    i = S(i);
                    var k = (i - h) / (j - d + 1);
                    for (; d < j; d++) {
                        h += k;
                        c[d].offset = h + "%"
                    }
                }
            }
            return c
        }),
        by = function(b, c, d, e) {
            var f;
            if (a.is(b, F) || a.is(b, "object")) {
                f = a.is(b, F) ? g.getElementById(b) : b;
                if (f.tagName) return c == null ? {
                    container: f,
                    width: f.style.pixelWidth || f.offsetWidth,
                    height: f.style.pixelHeight || f.offsetHeight
                } : {
                    container: f,
                    width: c,
                    height: d
                }
            } else return {
                container: 1,
                x: b,
                y: c,
                width: d,
                height: e
            }
        },
        bz = function(a, b) {
            var c = this;
            for (var d in b) {
                if (b[f](d) && !(d in a)) switch (typeof b[d]) {
                    case "function":
                        (function(b) {
                            a[d] = a === c ? b : function() {
                                return b[m](c, arguments)
                            }
                        })(b[d]);
                        break;
                    case "object":
                        a[d] = a[d] || {};
                        bz.call(this, a[d], b[d]);
                        break;
                    default:
                        a[d] = b[d];
                        break
                }
            }
        },
        bA = function(a, b) {
            a == b.top && (b.top = a.prev);
            a == b.bottom && (b.bottom = a.next);
            a.next && (a.next.prev = a.prev);
            a.prev && (a.prev.next = a.next)
        },
        bB = function(a, b) {
            if (b.top === a) return;
            bA(a, b);
            a.next = null;
            a.prev = b.top;
            b.top.next = a;
            b.top = a
        },
        bC = function(a, b) {
            if (b.bottom === a) return;
            bA(a, b);
            a.next = b.bottom;
            a.prev = null;
            b.bottom.prev = a;
            b.bottom = a
        },
        bD = function(a, b, c) {
            bA(a, c);
            b == c.top && (c.top = a);
            b.next && (b.next.prev = a);
            a.next = b.next;
            a.prev = b;
            b.next = a
        },
        bE = function(a, b, c) {
            bA(a, c);
            b == c.bottom && (c.bottom = a);
            b.prev && (b.prev.next = a);
            a.prev = b.prev;
            b.prev = a;
            a.next = b
        },
        bF = function(a) {
            return function() {
                throw new Error("Raphaël: you are calling to method “" + a + "” of removed object")
            }
        };
    a.pathToRelative = bp;
    if (a.svg) {
        k.svgns = "http://www.w3.org/2000/svg";
        k.xlink = "http://www.w3.org/1999/xlink";
        Q = function(a) {
            return +a + (~(~a) === a) * 0.5
        };
        var bG = function(a, b) {
            if (b)
                for (var c in b) b[f](c) && a[R](c, r(b[c]));
            else {
                a = g.createElementNS(k.svgns, a);
                a.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                return a
            }
        };
        a[H] = function() {
            return "Your browser supports SVG.\nYou are running Raphaël " + this.version
        };
        var bH = function(a, b) {
                var c = bG("path");
                b.canvas && b.canvas[l](c);
                var d = new bN(c, b);
                d.type = "path";
                bK(d, {
                    fill: "none",
                    stroke: "#000",
                    path: a
                });
                return d
            },
            bI = function(a, b, c) {
                var d = "linear",
                    e = 0.5,
                    f = 0.5,
                    h = a.style;
                b = r(b)[Y](bd, function(a, b, c) {
                    d = "radial";
                    if (b && c) {
                        e = S(b);
                        f = S(c);
                        var g = (f > 0.5) * 2 - 1;
                        C(e - 0.5, 2) + C(f - 0.5, 2) > 0.25 && (f = y.sqrt(0.25 - C(e - 0.5, 2)) * g + 0.5) && f != 0.5 && (f = f.toFixed(5) - 0.00001 * g)
                    }
                    return p
                });
                b = b[s](/\s*\-\s*/);
                if (d == "linear") {
                    var i = b.shift();
                    i = -S(i);
                    if (isNaN(i)) return null;
                    var j = [0, 0, y.cos(i * D / 180), y.sin(i * D / 180)],
                        k = 1 / (z(B(j[2]), B(j[3])) || 1);
                    j[2] *= k;
                    j[3] *= k;
                    if (j[2] < 0) {
                        j[0] = -j[2];
                        j[2] = 0
                    }
                    if (j[3] < 0) {
                        j[1] = -j[3];
                        j[3] = 0
                    }
                }
                var m = bx(b);
                if (!m) return null;
                var n = a.getAttribute(I);
                n = n.match(/^url\(#(.*)\)$/);
                n && c.defs.removeChild(g.getElementById(n[1]));
                var o = bG(d + "Gradient");
                o.id = bh();
                bG(o, d == "radial" ? {
                    fx: e,
                    fy: f
                } : {
                    x1: j[0],
                    y1: j[1],
                    x2: j[2],
                    y2: j[3]
                });
                c.defs[l](o);
                for (var q = 0, t = m[w]; q < t; q++) {
                    var u = bG("stop");
                    bG(u, {
                        offset: m[q].offset ? m[q].offset : q ? "100%" : "0%",
                        "stop-color": m[q].color || "#fff"
                    });
                    o[l](u)
                }
                bG(a, {
                    fill: "url(#" + o.id + ")",
                    opacity: 1,
                    "fill-opacity": 1
                });
                h.fill = p;
                h.opacity = 1;
                h.fillOpacity = 1;
                return 1
            },
            bJ = function(b) {
                var c = b.getBBox();
                bG(b.pattern, {
                    patternTransform: a.format("translate({0},{1})", c.x, c.y)
                })
            },
            bK = function(c, d) {
                var e = {
                        "": [0],
                        none: [0],
                        "-": [3, 1],
                        ".": [1, 1],
                        "-.": [3, 1, 1, 1],
                        "-..": [3, 1, 1, 1, 1, 1],
                        ". ": [1, 3],
                        "- ": [4, 3],
                        "--": [8, 3],
                        "- .": [4, 3, 1, 3],
                        "--.": [8, 3, 1, 3],
                        "--..": [8, 3, 1, 3, 1, 3]
                    },
                    h = c.node,
                    i = c.attrs,
                    j = c.rotate(),
                    k = function(a, b) {
                        b = e[x.call(b)];
                        if (b) {
                            var c = a.attrs["stroke-width"] || "1",
                                f = ({
                                    round: c,
                                    square: c,
                                    butt: 0
                                })[a.attrs["stroke-linecap"] || d["stroke-linecap"]] || 0,
                                g = [],
                                i = b[w];
                            while (i--) g[i] = b[i] * c + (i % 2 ? 1 : -1) * f;
                            bG(h, {
                                "stroke-dasharray": g[v](",")
                            })
                        }
                    };
                d[f]("rotation") && (j = d.rotation);
                var m = r(j)[s](b);
                if (m.length - 1) {
                    m[1] = +m[1];
                    m[2] = +m[2]
                } else m = null;
                S(j) && c.rotate(0, true);
                for (var n in d) {
                    if (d[f](n)) {
                        if (!W[f](n)) continue;
                        var o = d[n];
                        i[n] = o;
                        switch (n) {
                            case "blur":
                                c.blur(o);
                                break;
                            case "rotation":
                                c.rotate(o, true);
                                break;
                            case "href":
                            case "title":
                            case "target":
                                var t = h.parentNode;
                                if (x.call(t.tagName) != "a") {
                                    var u = bG("a");
                                    t.insertBefore(u, h);
                                    u[l](h);
                                    t = u
                                }
                                n == "target" && o == "blank" ? t.setAttributeNS(c.paper.xlink, "show", "new") : t.setAttributeNS(c.paper.xlink, n, o);
                                break;
                            case "cursor":
                                h.style.cursor = o;
                                break;
                            case "clip-rect":
                                var y = r(o)[s](b);
                                if (y[w] == 4) {
                                    c.clip && c.clip.parentNode.parentNode.removeChild(c.clip.parentNode);
                                    var z = bG("clipPath"),
                                        A = bG("rect");
                                    z.id = bh();
                                    bG(A, {
                                        x: y[0],
                                        y: y[1],
                                        width: y[2],
                                        height: y[3]
                                    });
                                    z[l](A);
                                    c.paper.defs[l](z);
                                    bG(h, {
                                        "clip-path": "url(#" + z.id + ")"
                                    });
                                    c.clip = A
                                }
                                if (!o) {
                                    var B = g.getElementById(h.getAttribute("clip-path")[Y](/(^url\(#|\)$)/g, p));
                                    B && B.parentNode.removeChild(B);
                                    bG(h, {
                                        "clip-path": p
                                    });
                                    delete c.clip
                                }
                                break;
                            case "path":
                                c.type == "path" && bG(h, {
                                    d: o ? i.path = bq(o) : "M0,0"
                                });
                                break;
                            case "width":
                                h[R](n, o);
                                if (i.fx) {
                                    n = "x";
                                    o = i.x
                                } else break;
                            case "x":
                                i.fx && (o = -i.x - (i.width || 0));
                            case "rx":
                                if (n == "rx" && c.type == "rect") break;
                            case "cx":
                                m && (n == "x" || n == "cx") && (m[1] += o - i[n]);
                                h[R](n, o);
                                c.pattern && bJ(c);
                                break;
                            case "height":
                                h[R](n, o);
                                if (i.fy) {
                                    n = "y";
                                    o = i.y
                                } else break;
                            case "y":
                                i.fy && (o = -i.y - (i.height || 0));
                            case "ry":
                                if (n == "ry" && c.type == "rect") break;
                            case "cy":
                                m && (n == "y" || n == "cy") && (m[2] += o - i[n]);
                                h[R](n, o);
                                c.pattern && bJ(c);
                                break;
                            case "r":
                                c.type == "rect" ? bG(h, {
                                    rx: o,
                                    ry: o
                                }) : h[R](n, o);
                                break;
                            case "src":
                                c.type == "image" && h.setAttributeNS(c.paper.xlink, "href", o);
                                break;
                            case "stroke-width":
                                h.style.strokeWidth = o;
                                h[R](n, o);
                                i["stroke-dasharray"] && k(c, i["stroke-dasharray"]);
                                break;
                            case "stroke-dasharray":
                                k(c, o);
                                break;
                            case "translation":
                                var C = r(o)[s](b);
                                C[0] = +C[0] || 0;
                                C[1] = +C[1] || 0;
                                if (m) {
                                    m[1] += C[0];
                                    m[2] += C[1]
                                }
                                cz.call(c, C[0], C[1]);
                                break;
                            case "scale":
                                C = r(o)[s](b);
                                c.scale(+C[0] || 1, +C[1] || +C[0] || 1, isNaN(S(C[2])) ? null : +C[2], isNaN(S(C[3])) ? null : +C[3]);
                                break;
                            case I:
                                var D = r(o).match(M);
                                if (D) {
                                    z = bG("pattern");
                                    var E = bG("image");
                                    z.id = bh();
                                    bG(z, {
                                        x: 0,
                                        y: 0,
                                        patternUnits: "userSpaceOnUse",
                                        height: 1,
                                        width: 1
                                    });
                                    bG(E, {
                                        x: 0,
                                        y: 0
                                    });
                                    E.setAttributeNS(c.paper.xlink, "href", D[1]);
                                    z[l](E);
                                    var F = g.createElement("img");
                                    F.style.cssText = "position:absolute;left:-9999em;top-9999em";
                                    F.onload = function() {
                                        bG(z, {
                                            width: this.offsetWidth,
                                            height: this.offsetHeight
                                        });
                                        bG(E, {
                                            width: this.offsetWidth,
                                            height: this.offsetHeight
                                        });
                                        g.body.removeChild(this);
                                        c.paper.safari()
                                    };
                                    g.body[l](F);
                                    F.src = D[1];
                                    c.paper.defs[l](z);
                                    h.style.fill = "url(#" + z.id + ")";
                                    bG(h, {
                                        fill: "url(#" + z.id + ")"
                                    });
                                    c.pattern = z;
                                    c.pattern && bJ(c);
                                    break
                                }
                                var G = a.getRGB(o);
                                if (G.error)
                                    if ((({
                                            circle: 1,
                                            ellipse: 1
                                        })[f](c.type) || r(o).charAt() != "r") && bI(h, o, c.paper)) {
                                        i.gradient = o;
                                        i.fill = "none";
                                        break
                                    } else {
                                        delete d.gradient;
                                        delete i.gradient;
                                        !a.is(i.opacity, "undefined") && a.is(d.opacity, "undefined") && bG(h, {
                                            opacity: i.opacity
                                        });
                                        !a.is(i["fill-opacity"], "undefined") && a.is(d["fill-opacity"], "undefined") && bG(h, {
                                            "fill-opacity": i["fill-opacity"]
                                        })
                                    }
                                G[f]("opacity") && bG(h, {
                                    "fill-opacity": G.opacity > 1 ? G.opacity / 100 : G.opacity
                                });
                            case "stroke":
                                G = a.getRGB(o);
                                h[R](n, G.hex);
                                n == "stroke" && G[f]("opacity") && bG(h, {
                                    "stroke-opacity": G.opacity > 1 ? G.opacity / 100 : G.opacity
                                });
                                break;
                            case "gradient":
                                (({
                                    circle: 1,
                                    ellipse: 1
                                })[f](c.type) || r(o).charAt() != "r") && bI(h, o, c.paper);
                                break;
                            case "opacity":
                                i.gradient && !i[f]("stroke-opacity") && bG(h, {
                                    "stroke-opacity": o > 1 ? o / 100 : o
                                });
                            case "fill-opacity":
                                if (i.gradient) {
                                    var H = g.getElementById(h.getAttribute(I)[Y](/^url\(#|\)$/g, p));
                                    if (H) {
                                        var J = H.getElementsByTagName("stop");
                                        J[J[w] - 1][R]("stop-opacity", o)
                                    }
                                    break
                                }
                            default:
                                n == "font-size" && (o = T(o, 10) + "px");
                                var K = n[Y](/(\-.)/g, function(a) {
                                    return V.call(a.substring(1))
                                });
                                h.style[K] = o;
                                h[R](n, o);
                                break
                        }
                    }
                }
                bM(c, d);
                m ? c.rotate(m.join(q)) : S(j) && c.rotate(j, true)
            },
            bL = 1.2,
            bM = function(b, c) {
                if (b.type != "text" || !(c[f]("text") || c[f]("font") || c[f]("font-size") || c[f]("x") || c[f]("y"))) return;
                var d = b.attrs,
                    e = b.node,
                    h = e.firstChild ? T(g.defaultView.getComputedStyle(e.firstChild, p).getPropertyValue("font-size"), 10) : 10;
                if (c[f]("text")) {
                    d.text = c.text;
                    while (e.firstChild) e.removeChild(e.firstChild);
                    var i = r(c.text)[s]("\n");
                    for (var j = 0, k = i[w]; j < k; j++)
                        if (i[j]) {
                            var m = bG("tspan");
                            j && bG(m, {
                                dy: h * bL,
                                x: d.x
                            });
                            m[l](g.createTextNode(i[j]));
                            e[l](m)
                        }
                } else {
                    i = e.getElementsByTagName("tspan");
                    for (j = 0, k = i[w]; j < k; j++) j && bG(i[j], {
                        dy: h * bL,
                        x: d.x
                    })
                }
                bG(e, {
                    y: d.y
                });
                var n = b.getBBox(),
                    o = d.y - (n.y + n.height / 2);
                o && a.is(o, "finite") && bG(e, {
                    y: d.y + o
                })
            },
            bN = function(b, c) {
                var d = 0,
                    e = 0;
                this[0] = b;
                this.id = a._oid++;
                this.node = b;
                b.raphael = this;
                this.paper = c;
                this.attrs = this.attrs || {};
                this.transformations = [];
                this._ = {
                    tx: 0,
                    ty: 0,
                    rt: {
                        deg: 0,
                        cx: 0,
                        cy: 0
                    },
                    sx: 1,
                    sy: 1
                };
                !c.bottom && (c.bottom = this);
                this.prev = c.top;
                c.top && (c.top.next = this);
                c.top = this;
                this.next = null
            },
            bO = bN[e];
        bN[e].rotate = function(c, d, e) {
            if (this.removed) return this;
            if (c == null) {
                if (this._.rt.cx) return [this._.rt.deg, this._.rt.cx, this._.rt.cy][v](q);
                return this._.rt.deg
            }
            var f = this.getBBox();
            c = r(c)[s](b);
            if (c[w] - 1) {
                d = S(c[1]);
                e = S(c[2])
            }
            c = S(c[0]);
            d != null && d !== false ? this._.rt.deg = c : this._.rt.deg += c;
            e == null && (d = null);
            this._.rt.cx = d;
            this._.rt.cy = e;
            d = d == null ? f.x + f.width / 2 : d;
            e = e == null ? f.y + f.height / 2 : e;
            if (this._.rt.deg) {
                this.transformations[0] = a.format("rotate({0} {1} {2})", this._.rt.deg, d, e);
                this.clip && bG(this.clip, {
                    transform: a.format("rotate({0} {1} {2})", -this._.rt.deg, d, e)
                })
            } else {
                this.transformations[0] = p;
                this.clip && bG(this.clip, {
                    transform: p
                })
            }
            bG(this.node, {
                transform: this.transformations[v](q)
            });
            return this
        };
        bN[e].hide = function() {
            !this.removed && (this.node.style.display = "none");
            return this
        };
        bN[e].show = function() {
            !this.removed && (this.node.style.display = "");
            return this
        };
        bN[e].remove = function() {
            if (this.removed) return;
            bA(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            for (var a in this) delete this[a];
            this.removed = true
        };
        bN[e].getBBox = function() {
            if (this.removed) return this;
            if (this.type == "path") return bn(this.attrs.path);
            if (this.node.style.display == "none") {
                this.show();
                var a = true
            }
            var b = {};
            try {
                b = this.node.getBBox()
            } catch (a) {} finally {
                b = b || {}
            }
            if (this.type == "text") {
                b = {
                    x: b.x,
                    y: Infinity,
                    width: 0,
                    height: 0
                };
                for (var c = 0, d = this.node.getNumberOfChars(); c < d; c++) {
                    var e = this.node.getExtentOfChar(c);
                    e.y < b.y && (b.y = e.y);
                    e.y + e.height - b.y > b.height && (b.height = e.y + e.height - b.y);
                    e.x + e.width - b.x > b.width && (b.width = e.x + e.width - b.x)
                }
            }
            a && this.hide();
            return b
        };
        bN[e].attr = function(b, c) {
            if (this.removed) return this;
            if (b == null) {
                var d = {};
                for (var e in this.attrs) this.attrs[f](e) && (d[e] = this.attrs[e]);
                this._.rt.deg && (d.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (d.scale = this.scale());
                d.gradient && d.fill == "none" && (d.fill = d.gradient) && delete d.gradient;
                return d
            }
            if (c == null && a.is(b, F)) {
                if (b == "translation") return cz.call(this);
                if (b == "rotation") return this.rotate();
                if (b == "scale") return this.scale();
                if (b == I && this.attrs.fill == "none" && this.attrs.gradient) return this.attrs.gradient;
                return this.attrs[b]
            }
            if (c == null && a.is(b, G)) {
                var g = {};
                for (var h = 0, i = b.length; h < i; h++) g[b[h]] = this.attr(b[h]);
                return g
            }
            if (c != null) {
                var j = {};
                j[b] = c
            } else b != null && a.is(b, "object") && (j = b);
            for (var k in this.paper.customAttributes)
                if (this.paper.customAttributes[f](k) && j[f](k) && a.is(this.paper.customAttributes[k], "function")) {
                    var l = this.paper.customAttributes[k].apply(this, [][n](j[k]));
                    this.attrs[k] = j[k];
                    for (var m in l) l[f](m) && (j[m] = l[m])
                }
            bK(this, j);
            return this
        };
        bN[e].toFront = function() {
            if (this.removed) return this;
            this.node.parentNode[l](this.node);
            var a = this.paper;
            a.top != this && bB(this, a);
            return this
        };
        bN[e].toBack = function() {
            if (this.removed) return this;
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                bC(this, this.paper);
                var a = this.paper
            }
            return this
        };
        bN[e].insertAfter = function(a) {
            if (this.removed) return this;
            var b = a.node || a[a.length - 1].node;
            b.nextSibling ? b.parentNode.insertBefore(this.node, b.nextSibling) : b.parentNode[l](this.node);
            bD(this, a, this.paper);
            return this
        };
        bN[e].insertBefore = function(a) {
            if (this.removed) return this;
            var b = a.node || a[0].node;
            b.parentNode.insertBefore(this.node, b);
            bE(this, a, this.paper);
            return this
        };
        bN[e].blur = function(a) {
            var b = this;
            if (+a !== 0) {
                var c = bG("filter"),
                    d = bG("feGaussianBlur");
                b.attrs.blur = a;
                c.id = bh();
                bG(d, {
                    stdDeviation: +a || 1.5
                });
                c.appendChild(d);
                b.paper.defs.appendChild(c);
                b._blur = c;
                bG(b.node, {
                    filter: "url(#" + c.id + ")"
                })
            } else {
                if (b._blur) {
                    b._blur.parentNode.removeChild(b._blur);
                    delete b._blur;
                    delete b.attrs.blur
                }
                b.node.removeAttribute("filter")
            }
        };
        var bP = function(a, b, c, d) {
                var e = bG("circle");
                a.canvas && a.canvas[l](e);
                var f = new bN(e, a);
                f.attrs = {
                    cx: b,
                    cy: c,
                    r: d,
                    fill: "none",
                    stroke: "#000"
                };
                f.type = "circle";
                bG(e, f.attrs);
                return f
            },
            bQ = function(a, b, c, d, e, f) {
                var g = bG("rect");
                a.canvas && a.canvas[l](g);
                var h = new bN(g, a);
                h.attrs = {
                    x: b,
                    y: c,
                    width: d,
                    height: e,
                    r: f || 0,
                    rx: f || 0,
                    ry: f || 0,
                    fill: "none",
                    stroke: "#000"
                };
                h.type = "rect";
                bG(g, h.attrs);
                return h
            },
            bR = function(a, b, c, d, e) {
                var f = bG("ellipse");
                a.canvas && a.canvas[l](f);
                var g = new bN(f, a);
                g.attrs = {
                    cx: b,
                    cy: c,
                    rx: d,
                    ry: e,
                    fill: "none",
                    stroke: "#000"
                };
                g.type = "ellipse";
                bG(f, g.attrs);
                return g
            },
            bS = function(a, b, c, d, e, f) {
                var g = bG("image");
                bG(g, {
                    x: c,
                    y: d,
                    width: e,
                    height: f,
                    preserveAspectRatio: "none"
                });
                g.setAttributeNS(a.xlink, "href", b);
                a.canvas && a.canvas[l](g);
                var h = new bN(g, a);
                h.attrs = {
                    x: c,
                    y: d,
                    width: e,
                    height: f,
                    src: b
                };
                h.type = "image";
                return h
            },
            bT = function(a, b, c, d) {
                var e = bG("text");
                bG(e, {
                    x: b,
                    y: c,
                    "text-anchor": "middle"
                });
                a.canvas && a.canvas[l](e);
                var f = new bN(e, a);
                f.attrs = {
                    x: b,
                    y: c,
                    "text-anchor": "middle",
                    text: d,
                    font: W.font,
                    stroke: "none",
                    fill: "#000"
                };
                f.type = "text";
                bK(f, f.attrs);
                return f
            },
            bU = function(a, b) {
                this.width = a || this.width;
                this.height = b || this.height;
                this.canvas[R]("width", this.width);
                this.canvas[R]("height", this.height);
                return this
            },
            bV = function() {
                var b = by[m](0, arguments),
                    c = b && b.container,
                    d = b.x,
                    e = b.y,
                    f = b.width,
                    h = b.height;
                if (!c) throw new Error("SVG container not found.");
                var i = bG("svg");
                d = d || 0;
                e = e || 0;
                f = f || 512;
                h = h || 342;
                bG(i, {
                    xmlns: "http://www.w3.org/2000/svg",
                    version: 1.1,
                    width: f,
                    height: h
                });
                if (c == 1) {
                    i.style.cssText = "position:absolute;left:" + d + "px;top:" + e + "px";
                    g.body[l](i)
                } else c.firstChild ? c.insertBefore(i, c.firstChild) : c[l](i);
                c = new j;
                c.width = f;
                c.height = h;
                c.canvas = i;
                bz.call(c, c, a.fn);
                c.clear();
                return c
            };
        k.clear = function() {
            var a = this.canvas;
            while (a.firstChild) a.removeChild(a.firstChild);
            this.bottom = this.top = null;
            (this.desc = bG("desc"))[l](g.createTextNode("Created with Raphaël"));
            a[l](this.desc);
            a[l](this.defs = bG("defs"))
        };
        k.remove = function() {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var a in this) this[a] = bF(a)
        }
    }
    if (a.vml) {
        var bW = {
                M: "m",
                L: "l",
                C: "c",
                Z: "x",
                m: "t",
                l: "r",
                c: "v",
                z: "x"
            },
            bX = /([clmz]),?([^clmz]*)/gi,
            bY = / progid:\S+Blur\([^\)]+\)/g,
            bZ = /-?[^,\s-]+/g,
            b$ = 1000 + q + 1000,
            b_ = 10,
            ca = {
                path: 1,
                rect: 1
            },
            cb = function(a) {
                var b = /[ahqstv]/ig,
                    c = bq;
                r(a).match(b) && (c = bw);
                b = /[clmz]/g;
                if (c == bq && !r(a).match(b)) {
                    var d = r(a)[Y](bX, function(a, b, c) {
                        var d = [],
                            e = x.call(b) == "m",
                            f = bW[b];
                        c[Y](bZ, function(a) {
                            if (e && d[w] == 2) {
                                f += d + bW[b == "m" ? "l" : "L"];
                                d = []
                            }
                            d[L](Q(a * b_))
                        });
                        return f + d
                    });
                    return d
                }
                var e = c(a),
                    f, g;
                d = [];
                for (var h = 0, i = e[w]; h < i; h++) {
                    f = e[h];
                    g = x.call(e[h][0]);
                    g == "z" && (g = "x");
                    for (var j = 1, k = f[w]; j < k; j++) g += Q(f[j] * b_) + (j != k - 1 ? "," : p);
                    d[L](g)
                }
                return d[v](q)
            };
        a[H] = function() {
            return "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version
        };
        bH = function(a, b) {
            var c = cd("group");
            c.style.cssText = "position:absolute;left:0;top:0;width:" + b.width + "px;height:" + b.height + "px";
            c.coordsize = b.coordsize;
            c.coordorigin = b.coordorigin;
            var d = cd("shape"),
                e = d.style;
            e.width = b.width + "px";
            e.height = b.height + "px";
            d.coordsize = b$;
            d.coordorigin = b.coordorigin;
            c[l](d);
            var f = new bN(d, c, b),
                g = {
                    fill: "none",
                    stroke: "#000"
                };
            a && (g.path = a);
            f.type = "path";
            f.path = [];
            f.Path = p;
            bK(f, g);
            b.canvas[l](c);
            return f
        };
        bK = function(c, d) {
            c.attrs = c.attrs || {};
            var e = c.node,
                h = c.attrs,
                i = e.style,
                j, k = (d.x != h.x || d.y != h.y || d.width != h.width || d.height != h.height || d.r != h.r) && c.type == "rect",
                m = c;
            for (var n in d) d[f](n) && (h[n] = d[n]);
            if (k) {
                h.path = cc(h.x, h.y, h.width, h.height, h.r);
                c.X = h.x;
                c.Y = h.y;
                c.W = h.width;
                c.H = h.height
            }
            d.href && (e.href = d.href);
            d.title && (e.title = d.title);
            d.target && (e.target = d.target);
            d.cursor && (i.cursor = d.cursor);
            "blur" in d && c.blur(d.blur);
            if (d.path && c.type == "path" || k) e.path = cb(h.path);
            d.rotation != null && c.rotate(d.rotation, true);
            if (d.translation) {
                j = r(d.translation)[s](b);
                cz.call(c, j[0], j[1]);
                if (c._.rt.cx != null) {
                    c._.rt.cx += +j[0];
                    c._.rt.cy += +j[1];
                    c.setBox(c.attrs, j[0], j[1])
                }
            }
            if (d.scale) {
                j = r(d.scale)[s](b);
                c.scale(+j[0] || 1, +j[1] || +j[0] || 1, +j[2] || null, +j[3] || null)
            }
            if ("clip-rect" in d) {
                var o = r(d["clip-rect"])[s](b);
                if (o[w] == 4) {
                    o[2] = +o[2] + +o[0];
                    o[3] = +o[3] + +o[1];
                    var q = e.clipRect || g.createElement("div"),
                        t = q.style,
                        u = e.parentNode;
                    t.clip = a.format("rect({1}px {2}px {3}px {0}px)", o);
                    if (!e.clipRect) {
                        t.position = "absolute";
                        t.top = 0;
                        t.left = 0;
                        t.width = c.paper.width + "px";
                        t.height = c.paper.height + "px";
                        u.parentNode.insertBefore(q, u);
                        q[l](u);
                        e.clipRect = q
                    }
                }
                d["clip-rect"] || e.clipRect && (e.clipRect.style.clip = p)
            }
            c.type == "image" && d.src && (e.src = d.src);
            if (c.type == "image" && d.opacity) {
                e.filterOpacity = U + ".Alpha(opacity=" + d.opacity * 100 + ")";
                i.filter = (e.filterMatrix || p) + (e.filterOpacity || p)
            }
            d.font && (i.font = d.font);
            d["font-family"] && (i.fontFamily = "\"" + d["font-family"][s](",")[0][Y](/^['"]+|['"]+$/g, p) + "\"");
            d["font-size"] && (i.fontSize = d["font-size"]);
            d["font-weight"] && (i.fontWeight = d["font-weight"]);
            d["font-style"] && (i.fontStyle = d["font-style"]);
            if (d.opacity != null || d["stroke-width"] != null || d.fill != null || d.stroke != null || d["stroke-width"] != null || d["stroke-opacity"] != null || d["fill-opacity"] != null || d["stroke-dasharray"] != null || d["stroke-miterlimit"] != null || d["stroke-linejoin"] != null || d["stroke-linecap"] != null) {
                e = c.shape || e;
                var v = e.getElementsByTagName(I) && e.getElementsByTagName(I)[0],
                    x = false;
                !v && (x = v = cd(I));
                if ("fill-opacity" in d || "opacity" in d) {
                    var y = ((+h["fill-opacity"] + 1 || 2) - 1) * ((+h.opacity + 1 || 2) - 1) * ((+a.getRGB(d.fill).o + 1 || 2) - 1);
                    y = A(z(y, 0), 1);
                    v.opacity = y
                }
                d.fill && (v.on = true);
                if (v.on == null || d.fill == "none") v.on = false;
                if (v.on && d.fill) {
                    var B = d.fill.match(M);
                    if (B) {
                        v.src = B[1];
                        v.type = "tile"
                    } else {
                        v.color = a.getRGB(d.fill).hex;
                        v.src = p;
                        v.type = "solid";
                        if (a.getRGB(d.fill).error && (m.type in {
                                circle: 1,
                                ellipse: 1
                            } || r(d.fill).charAt() != "r") && bI(m, d.fill)) {
                            h.fill = "none";
                            h.gradient = d.fill
                        }
                    }
                }
                x && e[l](v);
                var C = e.getElementsByTagName("stroke") && e.getElementsByTagName("stroke")[0],
                    D = false;
                !C && (D = C = cd("stroke"));
                if (d.stroke && d.stroke != "none" || d["stroke-width"] || d["stroke-opacity"] != null || d["stroke-dasharray"] || d["stroke-miterlimit"] || d["stroke-linejoin"] || d["stroke-linecap"]) C.on = true;
                (d.stroke == "none" || C.on == null || d.stroke == 0 || d["stroke-width"] == 0) && (C.on = false);
                var E = a.getRGB(d.stroke);
                C.on && d.stroke && (C.color = E.hex);
                y = ((+h["stroke-opacity"] + 1 || 2) - 1) * ((+h.opacity + 1 || 2) - 1) * ((+E.o + 1 || 2) - 1);
                var F = (S(d["stroke-width"]) || 1) * 0.75;
                y = A(z(y, 0), 1);
                d["stroke-width"] == null && (F = h["stroke-width"]);
                d["stroke-width"] && (C.weight = F);
                F && F < 1 && (y *= F) && (C.weight = 1);
                C.opacity = y;
                d["stroke-linejoin"] && (C.joinstyle = d["stroke-linejoin"] || "miter");
                C.miterlimit = d["stroke-miterlimit"] || 8;
                d["stroke-linecap"] && (C.endcap = d["stroke-linecap"] == "butt" ? "flat" : d["stroke-linecap"] == "square" ? "square" : "round");
                if (d["stroke-dasharray"]) {
                    var G = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    C.dashstyle = G[f](d["stroke-dasharray"]) ? G[d["stroke-dasharray"]] : p
                }
                D && e[l](C)
            }
            if (m.type == "text") {
                i = m.paper.span.style;
                h.font && (i.font = h.font);
                h["font-family"] && (i.fontFamily = h["font-family"]);
                h["font-size"] && (i.fontSize = h["font-size"]);
                h["font-weight"] && (i.fontWeight = h["font-weight"]);
                h["font-style"] && (i.fontStyle = h["font-style"]);
                m.node.string && (m.paper.span.innerHTML = r(m.node.string)[Y](/</g, "&#60;")[Y](/&/g, "&#38;")[Y](/\n/g, "<br>"));
                m.W = h.w = m.paper.span.offsetWidth;
                m.H = h.h = m.paper.span.offsetHeight;
                m.X = h.x;
                m.Y = h.y + Q(m.H / 2);
                switch (h["text-anchor"]) {
                    case "start":
                        m.node.style["v-text-align"] = "left";
                        m.bbx = Q(m.W / 2);
                        break;
                    case "end":
                        m.node.style["v-text-align"] = "right";
                        m.bbx = -Q(m.W / 2);
                        break;
                    default:
                        m.node.style["v-text-align"] = "center";
                        break
                }
            }
        };
        bI = function(a, b) {
            a.attrs = a.attrs || {};
            var c = a.attrs,
                d, e = "linear",
                f = ".5 .5";
            a.attrs.gradient = b;
            b = r(b)[Y](bd, function(a, b, c) {
                e = "radial";
                if (b && c) {
                    b = S(b);
                    c = S(c);
                    C(b - 0.5, 2) + C(c - 0.5, 2) > 0.25 && (c = y.sqrt(0.25 - C(b - 0.5, 2)) * ((c > 0.5) * 2 - 1) + 0.5);
                    f = b + q + c
                }
                return p
            });
            b = b[s](/\s*\-\s*/);
            if (e == "linear") {
                var g = b.shift();
                g = -S(g);
                if (isNaN(g)) return null
            }
            var h = bx(b);
            if (!h) return null;
            a = a.shape || a.node;
            d = a.getElementsByTagName(I)[0] || cd(I);
            !d.parentNode && a.appendChild(d);
            if (h[w]) {
                d.on = true;
                d.method = "none";
                d.color = h[0].color;
                d.color2 = h[h[w] - 1].color;
                var i = [];
                for (var j = 0, k = h[w]; j < k; j++) h[j].offset && i[L](h[j].offset + q + h[j].color);
                d.colors && (d.colors.value = i[w] ? i[v]() : "0% " + d.color);
                if (e == "radial") {
                    d.type = "gradientradial";
                    d.focus = "100%";
                    d.focussize = f;
                    d.focusposition = f
                } else {
                    d.type = "gradient";
                    d.angle = (270 - g) % 360
                }
            }
            return 1
        };
        bN = function(b, c, d) {
            var e = 0,
                f = 0,
                g = 0,
                h = 1;
            this[0] = b;
            this.id = a._oid++;
            this.node = b;
            b.raphael = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = c;
            this.paper = d;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {
                    deg: 0
                },
                sx: 1,
                sy: 1
            };
            !d.bottom && (d.bottom = this);
            this.prev = d.top;
            d.top && (d.top.next = this);
            d.top = this;
            this.next = null
        };
        bO = bN[e];
        bO.rotate = function(a, c, d) {
            if (this.removed) return this;
            if (a == null) {
                if (this._.rt.cx) return [this._.rt.deg, this._.rt.cx, this._.rt.cy][v](q);
                return this._.rt.deg
            }
            a = r(a)[s](b);
            if (a[w] - 1) {
                c = S(a[1]);
                d = S(a[2])
            }
            a = S(a[0]);
            c != null ? this._.rt.deg = a : this._.rt.deg += a;
            d == null && (c = null);
            this._.rt.cx = c;
            this._.rt.cy = d;
            this.setBox(this.attrs, c, d);
            this.Group.style.rotation = this._.rt.deg;
            return this
        };
        bO.setBox = function(a, b, c) {
            if (this.removed) return this;
            var d = this.Group.style,
                e = this.shape && this.shape.style || this.node.style;
            a = a || {};
            for (var g in a) a[f](g) && (this.attrs[g] = a[g]);
            b = b || this._.rt.cx;
            c = c || this._.rt.cy;
            var h = this.attrs,
                i, j, k, l;
            switch (this.type) {
                case "circle":
                    i = h.cx - h.r;
                    j = h.cy - h.r;
                    k = l = h.r * 2;
                    break;
                case "ellipse":
                    i = h.cx - h.rx;
                    j = h.cy - h.ry;
                    k = h.rx * 2;
                    l = h.ry * 2;
                    break;
                case "image":
                    i = +h.x;
                    j = +h.y;
                    k = h.width || 0;
                    l = h.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", Q(h.x), ", ", Q(h.y - 2), "l", Q(h.x) + 1, ", ", Q(h.y - 2)][v](p);
                    i = h.x - Q(this.W / 2);
                    j = h.y - this.H / 2;
                    k = this.W;
                    l = this.H;
                    break;
                case "rect":
                case "path":
                    if (this.attrs.path) {
                        var m = bn(this.attrs.path);
                        i = m.x;
                        j = m.y;
                        k = m.width;
                        l = m.height
                    } else {
                        i = 0;
                        j = 0;
                        k = this.paper.width;
                        l = this.paper.height
                    }
                    break;
                default:
                    i = 0;
                    j = 0;
                    k = this.paper.width;
                    l = this.paper.height;
                    break
            }
            b = b == null ? i + k / 2 : b;
            c = c == null ? j + l / 2 : c;
            var n = b - this.paper.width / 2,
                o = c - this.paper.height / 2,
                q;
            d.left != (q = n + "px") && (d.left = q);
            d.top != (q = o + "px") && (d.top = q);
            this.X = ca[f](this.type) ? -n : i;
            this.Y = ca[f](this.type) ? -o : j;
            this.W = k;
            this.H = l;
            if (ca[f](this.type)) {
                e.left != (q = -n * b_ + "px") && (e.left = q);
                e.top != (q = -o * b_ + "px") && (e.top = q)
            } else if (this.type == "text") {
                e.left != (q = -n + "px") && (e.left = q);
                e.top != (q = -o + "px") && (e.top = q)
            } else {
                d.width != (q = this.paper.width + "px") && (d.width = q);
                d.height != (q = this.paper.height + "px") && (d.height = q);
                e.left != (q = i - n + "px") && (e.left = q);
                e.top != (q = j - o + "px") && (e.top = q);
                e.width != (q = k + "px") && (e.width = q);
                e.height != (q = l + "px") && (e.height = q)
            }
        };
        bO.hide = function() {
            !this.removed && (this.Group.style.display = "none");
            return this
        };
        bO.show = function() {
            !this.removed && (this.Group.style.display = "block");
            return this
        };
        bO.getBBox = function() {
            if (this.removed) return this;
            if (ca[f](this.type)) return bn(this.attrs.path);
            return {
                x: this.X + (this.bbx || 0),
                y: this.Y,
                width: this.W,
                height: this.H
            }
        };
        bO.remove = function() {
            if (this.removed) return;
            bA(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.Group.parentNode.removeChild(this.Group);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var a in this) delete this[a];
            this.removed = true
        };
        bO.attr = function(b, c) {
            if (this.removed) return this;
            if (b == null) {
                var d = {};
                for (var e in this.attrs) this.attrs[f](e) && (d[e] = this.attrs[e]);
                this._.rt.deg && (d.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (d.scale = this.scale());
                d.gradient && d.fill == "none" && (d.fill = d.gradient) && delete d.gradient;
                return d
            }
            if (c == null && a.is(b, "string")) {
                if (b == "translation") return cz.call(this);
                if (b == "rotation") return this.rotate();
                if (b == "scale") return this.scale();
                if (b == I && this.attrs.fill == "none" && this.attrs.gradient) return this.attrs.gradient;
                return this.attrs[b]
            }
            if (this.attrs && c == null && a.is(b, G)) {
                var g, h = {};
                for (e = 0, g = b[w]; e < g; e++) h[b[e]] = this.attr(b[e]);
                return h
            }
            var i;
            if (c != null) {
                i = {};
                i[b] = c
            }
            c == null && a.is(b, "object") && (i = b);
            if (i) {
                for (var j in this.paper.customAttributes)
                    if (this.paper.customAttributes[f](j) && i[f](j) && a.is(this.paper.customAttributes[j], "function")) {
                        var k = this.paper.customAttributes[j].apply(this, [][n](i[j]));
                        this.attrs[j] = i[j];
                        for (var l in k) k[f](l) && (i[l] = k[l])
                    }
                i.text && this.type == "text" && (this.node.string = i.text);
                bK(this, i);
                i.gradient && (({
                    circle: 1,
                    ellipse: 1
                })[f](this.type) || r(i.gradient).charAt() != "r") && bI(this, i.gradient);
                (!ca[f](this.type) || this._.rt.deg) && this.setBox(this.attrs)
            }
            return this
        };
        bO.toFront = function() {
            !this.removed && this.Group.parentNode[l](this.Group);
            this.paper.top != this && bB(this, this.paper);
            return this
        };
        bO.toBack = function() {
            if (this.removed) return this;
            if (this.Group.parentNode.firstChild != this.Group) {
                this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild);
                bC(this, this.paper)
            }
            return this
        };
        bO.insertAfter = function(a) {
            if (this.removed) return this;
            a.constructor == cC && (a = a[a.length - 1]);
            a.Group.nextSibling ? a.Group.parentNode.insertBefore(this.Group, a.Group.nextSibling) : a.Group.parentNode[l](this.Group);
            bD(this, a, this.paper);
            return this
        };
        bO.insertBefore = function(a) {
            if (this.removed) return this;
            a.constructor == cC && (a = a[0]);
            a.Group.parentNode.insertBefore(this.Group, a.Group);
            bE(this, a, this.paper);
            return this
        };
        bO.blur = function(b) {
            var c = this.node.runtimeStyle,
                d = c.filter;
            d = d.replace(bY, p);
            if (+b !== 0) {
                this.attrs.blur = b;
                c.filter = d + q + U + ".Blur(pixelradius=" + (+b || 1.5) + ")";
                c.margin = a.format("-{0}px 0 0 -{0}px", Q(+b || 1.5))
            } else {
                c.filter = d;
                c.margin = 0;
                delete this.attrs.blur
            }
        };
        bP = function(a, b, c, d) {
            var e = cd("group"),
                f = cd("oval"),
                g = f.style;
            e.style.cssText = "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
            e.coordsize = b$;
            e.coordorigin = a.coordorigin;
            e[l](f);
            var h = new bN(f, e, a);
            h.type = "circle";
            bK(h, {
                stroke: "#000",
                fill: "none"
            });
            h.attrs.cx = b;
            h.attrs.cy = c;
            h.attrs.r = d;
            h.setBox({
                x: b - d,
                y: c - d,
                width: d * 2,
                height: d * 2
            });
            a.canvas[l](e);
            return h
        };
        function cc(b, c, d, e, f) {
            return f ? a.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", b + f, c, d - f * 2, f, -f, e - f * 2, f * 2 - d, f * 2 - e) : a.format("M{0},{1}l{2},0,0,{3},{4},0z", b, c, d, e, -d)
        }
        bQ = function(a, b, c, d, e, f) {
            var g = cc(b, c, d, e, f),
                h = a.path(g),
                i = h.attrs;
            h.X = i.x = b;
            h.Y = i.y = c;
            h.W = i.width = d;
            h.H = i.height = e;
            i.r = f;
            i.path = g;
            h.type = "rect";
            return h
        };
        bR = function(a, b, c, d, e) {
            var f = cd("group"),
                g = cd("oval"),
                h = g.style;
            f.style.cssText = "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
            f.coordsize = b$;
            f.coordorigin = a.coordorigin;
            f[l](g);
            var i = new bN(g, f, a);
            i.type = "ellipse";
            bK(i, {
                stroke: "#000"
            });
            i.attrs.cx = b;
            i.attrs.cy = c;
            i.attrs.rx = d;
            i.attrs.ry = e;
            i.setBox({
                x: b - d,
                y: c - e,
                width: d * 2,
                height: e * 2
            });
            a.canvas[l](f);
            return i
        };
        bS = function(a, b, c, d, e, f) {
            var g = cd("group"),
                h = cd("image");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + a.width + "px;height:" + a.height + "px";
            g.coordsize = b$;
            g.coordorigin = a.coordorigin;
            h.src = b;
            g[l](h);
            var i = new bN(h, g, a);
            i.type = "image";
            i.attrs.src = b;
            i.attrs.x = c;
            i.attrs.y = d;
            i.attrs.w = e;
            i.attrs.h = f;
            i.setBox({
                x: c,
                y: d,
                width: e,
                height: f
            });
            a.canvas[l](g);
            return i
        };
        bT = function(b, c, d, e) {
            var f = cd("group"),
                g = cd("shape"),
                h = g.style,
                i = cd("path"),
                j = i.style,
                k = cd("textpath");
            f.style.cssText = "position:absolute;left:0;top:0;width:" + b.width + "px;height:" + b.height + "px";
            f.coordsize = b$;
            f.coordorigin = b.coordorigin;
            i.v = a.format("m{0},{1}l{2},{1}", Q(c * 10), Q(d * 10), Q(c * 10) + 1);
            i.textpathok = true;
            h.width = b.width;
            h.height = b.height;
            k.string = r(e);
            k.on = true;
            g[l](k);
            g[l](i);
            f[l](g);
            var m = new bN(k, f, b);
            m.shape = g;
            m.textpath = i;
            m.type = "text";
            m.attrs.text = e;
            m.attrs.x = c;
            m.attrs.y = d;
            m.attrs.w = 1;
            m.attrs.h = 1;
            bK(m, {
                font: W.font,
                stroke: "none",
                fill: "#000"
            });
            m.setBox();
            b.canvas[l](f);
            return m
        };
        bU = function(a, b) {
            var c = this.canvas.style;
            a == +a && (a += "px");
            b == +b && (b += "px");
            c.width = a;
            c.height = b;
            c.clip = "rect(0 " + a + " " + b + " 0)";
            return this
        };
        var cd;
        g.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !g.namespaces.rvml && g.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            cd = function(a) {
                return g.createElement("<rvml:" + a + " class=\"rvml\">")
            }
        } catch (a) {
            cd = function(a) {
                return g.createElement("<" + a + " xmlns=\"urn:schemas-microsoft.com:vml\" class=\"rvml\">")
            }
        }
        bV = function() {
            var b = by[m](0, arguments),
                c = b.container,
                d = b.height,
                e, f = b.width,
                h = b.x,
                i = b.y;
            if (!c) throw new Error("VML container not found.");
            var k = new j,
                n = k.canvas = g.createElement("div"),
                o = n.style;
            h = h || 0;
            i = i || 0;
            f = f || 512;
            d = d || 342;
            f == +f && (f += "px");
            d == +d && (d += "px");
            k.width = 1000;
            k.height = 1000;
            k.coordsize = b_ * 1000 + q + b_ * 1000;
            k.coordorigin = "0 0";
            k.span = g.createElement("span");
            k.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            n[l](k.span);
            o.cssText = a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", f, d);
            if (c == 1) {
                g.body[l](n);
                o.left = h + "px";
                o.top = i + "px";
                o.position = "absolute"
            } else c.firstChild ? c.insertBefore(n, c.firstChild) : c[l](n);
            bz.call(k, k, a.fn);
            return k
        };
        k.clear = function() {
            this.canvas.innerHTML = p;
            this.span = g.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas[l](this.span);
            this.bottom = this.top = null
        };
        k.remove = function() {
            this.canvas.parentNode.removeChild(this.canvas);
            for (var a in this) this[a] = bF(a);
            return true
        }
    }
    var ce = navigator.userAgent.match(/Version\\x2f(.*?)\s/);
    navigator.vendor == "Apple Computer, Inc." && (ce && ce[1] < 4 || navigator.platform.slice(0, 2) == "iP") ? k.safari = function() {
        var a = this.rect(-99, -99, this.width + 99, this.height + 99).attr({
            stroke: "none"
        });
        h.setTimeout(function() {
            a.remove()
        })
    } : k.safari = function() {};
    var cf = function() {
            this.returnValue = false
        },
        cg = function() {
            return this.originalEvent.preventDefault()
        },
        ch = function() {
            this.cancelBubble = true
        },
        ci = function() {
            return this.originalEvent.stopPropagation()
        },
        cj = (function() {
            {
                if (g.addEventListener) return function(a, b, c, d) {
                    var e = o && u[b] ? u[b] : b,
                        g = function(e) {
                            if (o && u[f](b))
                                for (var g = 0, h = e.targetTouches && e.targetTouches.length; g < h; g++) {
                                    if (e.targetTouches[g].target == a) {
                                        var i = e;
                                        e = e.targetTouches[g];
                                        e.originalEvent = i;
                                        e.preventDefault = cg;
                                        e.stopPropagation = ci;
                                        break
                                    }
                                }
                            return c.call(d, e)
                        };
                    a.addEventListener(e, g, false);
                    return function() {
                        a.removeEventListener(e, g, false);
                        return true
                    }
                };
                if (g.attachEvent) return function(a, b, c, d) {
                    var e = function(a) {
                        a = a || h.event;
                        a.preventDefault = a.preventDefault || cf;
                        a.stopPropagation = a.stopPropagation || ch;
                        return c.call(d, a)
                    };
                    a.attachEvent("on" + b, e);
                    var f = function() {
                        a.detachEvent("on" + b, e);
                        return true
                    };
                    return f
                }
            }
        })(),
        ck = [],
        cl = function(a) {
            var b = a.clientX,
                c = a.clientY,
                d = g.documentElement.scrollTop || g.body.scrollTop,
                e = g.documentElement.scrollLeft || g.body.scrollLeft,
                f, h = ck.length;
            while (h--) {
                f = ck[h];
                if (o) {
                    var i = a.touches.length,
                        j;
                    while (i--) {
                        j = a.touches[i];
                        if (j.identifier == f.el._drag.id) {
                            b = j.clientX;
                            c = j.clientY;
                            (a.originalEvent ? a.originalEvent : a).preventDefault();
                            break
                        }
                    }
                } else a.preventDefault();
                b += e;
                c += d;
                f.move && f.move.call(f.move_scope || f.el, b - f.el._drag.x, c - f.el._drag.y, b, c, a)
            }
        },
        cm = function(b) {
            a.unmousemove(cl).unmouseup(cm);
            var c = ck.length,
                d;
            while (c--) {
                d = ck[c];
                d.el._drag = {};
                d.end && d.end.call(d.end_scope || d.start_scope || d.move_scope || d.el, b)
            }
            ck = []
        };
    for (var cn = t[w]; cn--;)(function(b) {
        a[b] = bN[e][b] = function(c, d) {
            if (a.is(c, "function")) {
                this.events = this.events || [];
                this.events.push({
                    name: b,
                    f: c,
                    unbind: cj(this.shape || this.node || g, b, c, d || this)
                })
            }
            return this
        };
        a["un" + b] = bN[e]["un" + b] = function(a) {
            var c = this.events,
                d = c[w];
            while (d--)
                if (c[d].name == b && c[d].f == a) {
                    c[d].unbind();
                    c.splice(d, 1);
                    !c.length && delete this.events;
                    return this
                }
            return this
        }
    })(t[cn]);
    bO.hover = function(a, b, c, d) {
        return this.mouseover(a, c).mouseout(b, d || c)
    };
    bO.unhover = function(a, b) {
        return this.unmouseover(a).unmouseout(b)
    };
    bO.drag = function(b, c, d, e, f, h) {
        this._drag = {};
        this.mousedown(function(i) {
            (i.originalEvent || i).preventDefault();
            var j = g.documentElement.scrollTop || g.body.scrollTop,
                k = g.documentElement.scrollLeft || g.body.scrollLeft;
            this._drag.x = i.clientX + k;
            this._drag.y = i.clientY + j;
            this._drag.id = i.identifier;
            c && c.call(f || e || this, i.clientX + k, i.clientY + j, i);
            !ck.length && a.mousemove(cl).mouseup(cm);
            ck.push({
                el: this,
                move: b,
                end: d,
                move_scope: e,
                start_scope: f,
                end_scope: h
            })
        });
        return this
    };
    bO.undrag = function(b, c, d) {
        var e = ck.length;
        while (e--) ck[e].el == this && (ck[e].move == b && ck[e].end == d) && ck.splice(e++, 1);
        !ck.length && a.unmousemove(cl).unmouseup(cm)
    };
    k.circle = function(a, b, c) {
        return bP(this, a || 0, b || 0, c || 0)
    };
    k.rect = function(a, b, c, d, e) {
        return bQ(this, a || 0, b || 0, c || 0, d || 0, e || 0)
    };
    k.ellipse = function(a, b, c, d) {
        return bR(this, a || 0, b || 0, c || 0, d || 0)
    };
    k.path = function(b) {
        b && !a.is(b, F) && !a.is(b[0], G) && (b += p);
        return bH(a.format[m](a, arguments), this)
    };
    k.image = function(a, b, c, d, e) {
        return bS(this, a || "about:blank", b || 0, c || 0, d || 0, e || 0)
    };
    k.text = function(a, b, c) {
        return bT(this, a || 0, b || 0, r(c))
    };
    k.set = function(a) {
        arguments[w] > 1 && (a = Array[e].splice.call(arguments, 0, arguments[w]));
        return new cC(a)
    };
    k.setSize = bU;
    k.top = k.bottom = null;
    k.raphael = a;
    function co() {
        return this.x + q + this.y
    }
    bO.resetScale = function() {
        if (this.removed) return this;
        this._.sx = 1;
        this._.sy = 1;
        this.attrs.scale = "1 1"
    };
    bO.scale = function(a, b, c, d) {
        if (this.removed) return this;
        if (a == null && b == null) return {
            x: this._.sx,
            y: this._.sy,
            toString: co
        };
        b = b || a;
        !(+b) && (b = a);
        var e, f, g, h, i = this.attrs;
        if (a != 0) {
            var j = this.getBBox(),
                k = j.x + j.width / 2,
                l = j.y + j.height / 2,
                m = B(a / this._.sx),
                o = B(b / this._.sy);
            c = +c || c == 0 ? c : k;
            d = +d || d == 0 ? d : l;
            var r = this._.sx > 0,
                s = this._.sy > 0,
                t = ~(~(a / B(a))),
                u = ~(~(b / B(b))),
                x = m * t,
                y = o * u,
                z = this.node.style,
                A = c + B(k - c) * x * (k > c == r ? 1 : -1),
                C = d + B(l - d) * y * (l > d == s ? 1 : -1),
                D = a * t > b * u ? o : m;
            switch (this.type) {
                case "rect":
                case "image":
                    var E = i.width * m,
                        F = i.height * o;
                    this.attr({
                        height: F,
                        r: i.r * D,
                        width: E,
                        x: A - E / 2,
                        y: C - F / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: i.rx * m,
                        ry: i.ry * o,
                        r: i.r * D,
                        cx: A,
                        cy: C
                    });
                    break;
                case "text":
                    this.attr({
                        x: A,
                        y: C
                    });
                    break;
                case "path":
                    var G = bp(i.path),
                        H = true,
                        I = r ? x : m,
                        J = s ? y : o;
                    for (var K = 0, L = G[w]; K < L; K++) {
                        var M = G[K],
                            N = V.call(M[0]); {
                            if (N == "M" && H) continue;
                            H = false
                        }
                        if (N == "A") {
                            M[G[K][w] - 2] *= I;
                            M[G[K][w] - 1] *= J;
                            M[1] *= m;
                            M[2] *= o;
                            M[5] = +(t + u ? !(!(+M[5])) : !(+M[5]))
                        } else if (N == "H")
                            for (var O = 1, P = M[w]; O < P; O++) M[O] *= I;
                        else if (N == "V")
                            for (O = 1, P = M[w]; O < P; O++) M[O] *= J;
                        else
                            for (O = 1, P = M[w]; O < P; O++) M[O] *= O % 2 ? I : J
                    }
                    var Q = bn(G);
                    e = A - Q.x - Q.width / 2;
                    f = C - Q.y - Q.height / 2;
                    G[0][1] += e;
                    G[0][2] += f;
                    this.attr({
                        path: G
                    });
                    break
            }
            if (this.type in {
                    text: 1,
                    image: 1
                } && (t != 1 || u != 1))
                if (this.transformations) {
                    this.transformations[2] = "scale(" [n](t, ",", u, ")");
                    this.node[R]("transform", this.transformations[v](q));
                    e = t == -1 ? -i.x - (E || 0) : i.x;
                    f = u == -1 ? -i.y - (F || 0) : i.y;
                    this.attr({
                        x: e,
                        y: f
                    });
                    i.fx = t - 1;
                    i.fy = u - 1
                } else {
                    this.node.filterMatrix = U + ".Matrix(M11=" [n](t, ", M12=0, M21=0, M22=", u, ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");
                    z.filter = (this.node.filterMatrix || p) + (this.node.filterOpacity || p)
                }
            else if (this.transformations) {
                this.transformations[2] = p;
                this.node[R]("transform", this.transformations[v](q));
                i.fx = 0;
                i.fy = 0
            } else {
                this.node.filterMatrix = p;
                z.filter = (this.node.filterMatrix || p) + (this.node.filterOpacity || p)
            }
            i.scale = [a, b, c, d][v](q);
            this._.sx = a;
            this._.sy = b
        }
        return this
    };
    bO.clone = function() {
        if (this.removed) return null;
        var a = this.attr();
        delete a.scale;
        delete a.translation;
        return this.paper[this.type]().attr(a)
    };
    var cp = {},
        cq = function(b, c, d, e, f, g, h, i, j) {
            var k = 0,
                l = 100,
                m = [b, c, d, e, f, g, h, i].join(),
                n = cp[m],
                o, p;
            !n && (cp[m] = n = {
                data: []
            });
            n.timer && clearTimeout(n.timer);
            n.timer = setTimeout(function() {
                delete cp[m]
            }, 2000);
            if (j != null) {
                var q = cq(b, c, d, e, f, g, h, i);
                l = ~(~q) * 10
            }
            for (var r = 0; r < l + 1; r++) {
                if (n.data[j] > r) p = n.data[r * l];
                else {
                    p = a.findDotsAtSegment(b, c, d, e, f, g, h, i, r / l);
                    n.data[r] = p
                }
                r && (k += C(C(o.x - p.x, 2) + C(o.y - p.y, 2), 0.5));
                if (j != null && k >= j) return p;
                o = p
            }
            if (j == null) return k
        },
        cr = function(b, c) {
            return function(d, e, f) {
                d = bw(d);
                var g, h, i, j, k = "",
                    l = {},
                    m, n = 0;
                for (var o = 0, p = d.length; o < p; o++) {
                    i = d[o];
                    if (i[0] == "M") {
                        g = +i[1];
                        h = +i[2]
                    } else {
                        j = cq(g, h, i[1], i[2], i[3], i[4], i[5], i[6]);
                        if (n + j > e) {
                            if (c && !l.start) {
                                m = cq(g, h, i[1], i[2], i[3], i[4], i[5], i[6], e - n);
                                k += ["C", m.start.x, m.start.y, m.m.x, m.m.y, m.x, m.y];
                                if (f) return k;
                                l.start = k;
                                k = ["M", m.x, m.y + "C", m.n.x, m.n.y, m.end.x, m.end.y, i[5], i[6]][v]();
                                n += j;
                                g = +i[5];
                                h = +i[6];
                                continue
                            }
                            if (!b && !c) {
                                m = cq(g, h, i[1], i[2], i[3], i[4], i[5], i[6], e - n);
                                return {
                                    x: m.x,
                                    y: m.y,
                                    alpha: m.alpha
                                }
                            }
                        }
                        n += j;
                        g = +i[5];
                        h = +i[6]
                    }
                    k += i
                }
                l.end = k;
                m = b ? n : c ? l : a.findDotsAtSegment(g, h, i[1], i[2], i[3], i[4], i[5], i[6], 1);
                m.alpha && (m = {
                    x: m.x,
                    y: m.y,
                    alpha: m.alpha
                });
                return m
            }
        },
        cs = cr(1),
        ct = cr(),
        cu = cr(0, 1);
    bO.getTotalLength = function() {
        if (this.type != "path") return;
        if (this.node.getTotalLength) return this.node.getTotalLength();
        return cs(this.attrs.path)
    };
    bO.getPointAtLength = function(a) {
        if (this.type != "path") return;
        return ct(this.attrs.path, a)
    };
    bO.getSubpath = function(a, b) {
        if (this.type != "path") return;
        if (B(this.getTotalLength() - b) < "1e-6") return cu(this.attrs.path, a).end;
        var c = cu(this.attrs.path, b, 1);
        return a ? cu(c, a).end : c
    };
    a.easing_formulas = {
        linear: function(a) {
            return a
        },
        "<": function(a) {
            return C(a, 3)
        },
        ">": function(a) {
            return C(a - 1, 3) + 1
        },
        "<>": function(a) {
            a = a * 2;
            if (a < 1) return C(a, 3) / 2;
            a -= 2;
            return (C(a, 3) + 2) / 2
        },
        backIn: function(a) {
            var b = 1.70158;
            return a * a * ((b + 1) * a - b)
        },
        backOut: function(a) {
            a = a - 1;
            var b = 1.70158;
            return a * a * ((b + 1) * a + b) + 1
        },
        elastic: function(a) {
            if (a == 0 || a == 1) return a;
            var b = 0.3,
                c = b / 4;
            return C(2, -10 * a) * y.sin((a - c) * (2 * D) / b) + 1
        },
        bounce: function(a) {
            var b = 7.5625,
                c = 2.75,
                d;
            if (a < 1 / c) d = b * a * a;
            else if (a < 2 / c) {
                a -= 1.5 / c;
                d = b * a * a + 0.75
            } else if (a < 2.5 / c) {
                a -= 2.25 / c;
                d = b * a * a + 0.9375
            } else {
                a -= 2.625 / c;
                d = b * a * a + 0.984375
            }
            return d
        }
    };
    var cv = [],
        cw = function() {
            var b = +(new Date);
            for (var c = 0; c < cv[w]; c++) {
                var d = cv[c];
                if (d.stop || d.el.removed) continue;
                var e = b - d.start,
                    g = d.ms,
                    h = d.easing,
                    i = d.from,
                    j = d.diff,
                    k = d.to,
                    l = d.t,
                    m = d.el,
                    n = {},
                    o;
                if (e < g) {
                    var r = h(e / g);
                    for (var s in i)
                        if (i[f](s)) {
                            switch (X[s]) {
                                case "along":
                                    o = r * g * j[s];
                                    k.back && (o = k.len - o);
                                    var t = ct(k[s], o);
                                    m.translate(j.sx - j.x || 0, j.sy - j.y || 0);
                                    j.x = t.x;
                                    j.y = t.y;
                                    m.translate(t.x - j.sx, t.y - j.sy);
                                    k.rot && m.rotate(j.r + t.alpha, t.x, t.y);
                                    break;
                                case E:
                                    o = +i[s] + r * g * j[s];
                                    break;
                                case "colour":
                                    o = "rgb(" + [cy(Q(i[s].r + r * g * j[s].r)), cy(Q(i[s].g + r * g * j[s].g)), cy(Q(i[s].b + r * g * j[s].b))][v](",") + ")";
                                    break;
                                case "path":
                                    o = [];
                                    for (var u = 0, x = i[s][w]; u < x; u++) {
                                        o[u] = [i[s][u][0]];
                                        for (var y = 1, z = i[s][u][w]; y < z; y++) o[u][y] = +i[s][u][y] + r * g * j[s][u][y];
                                        o[u] = o[u][v](q)
                                    }
                                    o = o[v](q);
                                    break;
                                case "csv":
                                    switch (s) {
                                        case "translation":
                                            var A = r * g * j[s][0] - l.x,
                                                B = r * g * j[s][1] - l.y;
                                            l.x += A;
                                            l.y += B;
                                            o = A + q + B;
                                            break;
                                        case "rotation":
                                            o = +i[s][0] + r * g * j[s][0];
                                            i[s][1] && (o += "," + i[s][1] + "," + i[s][2]);
                                            break;
                                        case "scale":
                                            o = [+i[s][0] + r * g * j[s][0], +i[s][1] + r * g * j[s][1], 2 in k[s] ? k[s][2] : p, 3 in k[s] ? k[s][3] : p][v](q);
                                            break;
                                        case "clip-rect":
                                            o = [];
                                            u = 4;
                                            while (u--) o[u] = +i[s][u] + r * g * j[s][u];
                                            break
                                    }
                                    break;
                                default:
                                    var C = [].concat(i[s]);
                                    o = [];
                                    u = m.paper.customAttributes[s].length;
                                    while (u--) o[u] = +C[u] + r * g * j[s][u];
                                    break
                            }
                            n[s] = o
                        }
                    m.attr(n);
                    m._run && m._run.call(m)
                } else {
                    if (k.along) {
                        t = ct(k.along, k.len * !k.back);
                        m.translate(j.sx - (j.x || 0) + t.x - j.sx, j.sy - (j.y || 0) + t.y - j.sy);
                        k.rot && m.rotate(j.r + t.alpha, t.x, t.y)
                    }(l.x || l.y) && m.translate(-l.x, -l.y);
                    k.scale && (k.scale += p);
                    m.attr(k);
                    cv.splice(c--, 1)
                }
            }
            a.svg && m && m.paper && m.paper.safari();
            cv[w] && setTimeout(cw)
        },
        cx = function(b, c, d, e, f) {
            var g = d - e;
            c.timeouts.push(setTimeout(function() {
                a.is(f, "function") && f.call(c);
                c.animate(b, g, b.easing)
            }, e))
        },
        cy = function(a) {
            return z(A(a, 255), 0)
        },
        cz = function(a, b) {
            if (a == null) return {
                x: this._.tx,
                y: this._.ty,
                toString: co
            };
            this._.tx += +a;
            this._.ty += +b;
            switch (this.type) {
                case "circle":
                case "ellipse":
                    this.attr({
                        cx: +a + this.attrs.cx,
                        cy: +b + this.attrs.cy
                    });
                    break;
                case "rect":
                case "image":
                case "text":
                    this.attr({
                        x: +a + this.attrs.x,
                        y: +b + this.attrs.y
                    });
                    break;
                case "path":
                    var c = bp(this.attrs.path);
                    c[0][1] += +a;
                    c[0][2] += +b;
                    this.attr({
                        path: c
                    });
                    break
            }
            return this
        };
    bO.animateWith = function(a, b, c, d, e) {
        for (var f = 0, g = cv.length; f < g; f++) cv[f].el.id == a.id && (b.start = cv[f].start);
        return this.animate(b, c, d, e)
    };
    bO.animateAlong = cA();
    bO.animateAlongBack = cA(1);
    function cA(b) {
        return function(c, d, e, f) {
            var g = {
                back: b
            };
            a.is(e, "function") ? f = e : g.rot = e;
            c && c.constructor == bN && (c = c.attrs.path);
            c && (g.along = c);
            return this.animate(g, d, f)
        }
    }
    function cB(a, b, c, d, e, f) {
        var g = 3 * b,
            h = 3 * (d - b) - g,
            i = 1 - g - h,
            j = 3 * c,
            k = 3 * (e - c) - j,
            l = 1 - j - k;
        function m(a) {
            return ((i * a + h) * a + g) * a
        }
        function n(a, b) {
            var c = o(a, b);
            return ((l * c + k) * c + j) * c
        }
        function o(a, b) {
            var c, d, e, f, j, k;
            for (e = a, k = 0; k < 8; k++) {
                f = m(e) - a;
                if (B(f) < b) return e;
                j = (3 * i * e + 2 * h) * e + g;
                if (B(j) < 0.000001) break;
                e = e - f / j
            }
            c = 0;
            d = 1;
            e = a;
            if (e < c) return c;
            if (e > d) return d;
            while (c < d) {
                f = m(e);
                if (B(f - a) < b) return e;
                a > f ? c = e : d = e;
                e = (d - c) / 2 + c
            }
            return e
        }
        return n(a, 1 / (200 * f))
    }
    bO.onAnimation = function(a) {
        this._run = a || 0;
        return this
    };
    bO.animate = function(c, d, e, g) {
        var h = this;
        h.timeouts = h.timeouts || [];
        if (a.is(e, "function") || !e) g = e || null;
        if (h.removed) {
            g && g.call(h);
            return h
        }
        var i = {},
            j = {},
            k = false,
            l = {};
        for (var m in c)
            if (c[f](m)) {
                if (X[f](m) || h.paper.customAttributes[f](m)) {
                    k = true;
                    i[m] = h.attr(m);
                    i[m] == null && (i[m] = W[m]);
                    j[m] = c[m];
                    switch (X[m]) {
                        case "along":
                            var n = cs(c[m]),
                                o = ct(c[m], n * !(!c.back)),
                                p = h.getBBox();
                            l[m] = n / d;
                            l.tx = p.x;
                            l.ty = p.y;
                            l.sx = o.x;
                            l.sy = o.y;
                            j.rot = c.rot;
                            j.back = c.back;
                            j.len = n;
                            c.rot && (l.r = S(h.rotate()) || 0);
                            break;
                        case E:
                            l[m] = (j[m] - i[m]) / d;
                            break;
                        case "colour":
                            i[m] = a.getRGB(i[m]);
                            var q = a.getRGB(j[m]);
                            l[m] = {
                                r: (q.r - i[m].r) / d,
                                g: (q.g - i[m].g) / d,
                                b: (q.b - i[m].b) / d
                            };
                            break;
                        case "path":
                            var t = bw(i[m], j[m]);
                            i[m] = t[0];
                            var u = t[1];
                            l[m] = [];
                            for (var v = 0, x = i[m][w]; v < x; v++) {
                                l[m][v] = [0];
                                for (var y = 1, z = i[m][v][w]; y < z; y++) l[m][v][y] = (u[v][y] - i[m][v][y]) / d
                            }
                            break;
                        case "csv":
                            var A = r(c[m])[s](b),
                                B = r(i[m])[s](b);
                            switch (m) {
                                case "translation":
                                    i[m] = [0, 0];
                                    l[m] = [A[0] / d, A[1] / d];
                                    break;
                                case "rotation":
                                    i[m] = B[1] == A[1] && B[2] == A[2] ? B : [0, A[1], A[2]];
                                    l[m] = [(A[0] - i[m][0]) / d, 0, 0];
                                    break;
                                case "scale":
                                    c[m] = A;
                                    i[m] = r(i[m])[s](b);
                                    l[m] = [(A[0] - i[m][0]) / d, (A[1] - i[m][1]) / d, 0, 0];
                                    break;
                                case "clip-rect":
                                    i[m] = r(i[m])[s](b);
                                    l[m] = [];
                                    v = 4;
                                    while (v--) l[m][v] = (A[v] - i[m][v]) / d;
                                    break
                            }
                            j[m] = A;
                            break;
                        default:
                            A = [].concat(c[m]);
                            B = [].concat(i[m]);
                            l[m] = [];
                            v = h.paper.customAttributes[m][w];
                            while (v--) l[m][v] = ((A[v] || 0) - (B[v] || 0)) / d;
                            break
                    }
                }
            }
        if (k) {
            var G = a.easing_formulas[e];
            if (!G) {
                G = r(e).match(P);
                if (G && G[w] == 5) {
                    var H = G;
                    G = function(a) {
                        return cB(a, +H[1], +H[2], +H[3], +H[4], d)
                    }
                } else G = function(a) {
                    return a
                }
            }
            cv.push({
                start: c.start || +(new Date),
                ms: d,
                easing: G,
                from: i,
                diff: l,
                to: j,
                el: h,
                t: {
                    x: 0,
                    y: 0
                }
            });
            a.is(g, "function") && (h._ac = setTimeout(function() {
                g.call(h)
            }, d));
            cv[w] == 1 && setTimeout(cw)
        } else {
            var C = [],
                D;
            for (var F in c)
                if (c[f](F) && Z.test(F)) {
                    m = {
                        value: c[F]
                    };
                    F == "from" && (F = 0);
                    F == "to" && (F = 100);
                    m.key = T(F, 10);
                    C.push(m)
                }
            C.sort(be);
            C[0].key && C.unshift({
                key: 0,
                value: h.attrs
            });
            for (v = 0, x = C[w]; v < x; v++) cx(C[v].value, h, d / 100 * C[v].key, d / 100 * (C[v - 1] && C[v - 1].key || 0), C[v - 1] && C[v - 1].value.callback);
            D = C[C[w] - 1].value.callback;
            D && h.timeouts.push(setTimeout(function() {
                D.call(h)
            }, d))
        }
        return this
    };
    bO.stop = function() {
        for (var a = 0; a < cv.length; a++) cv[a].el.id == this.id && cv.splice(a--, 1);
        for (a = 0, ii = this.timeouts && this.timeouts.length; a < ii; a++) clearTimeout(this.timeouts[a]);
        this.timeouts = [];
        clearTimeout(this._ac);
        delete this._ac;
        return this
    };
    bO.translate = function(a, b) {
        return this.attr({
            translation: a + " " + b
        })
    };
    bO[H] = function() {
        return "Raphaël’s object"
    };
    a.ae = cv;
    var cC = function(a) {
        this.items = [];
        this[w] = 0;
        this.type = "set";
        if (a)
            for (var b = 0, c = a[w]; b < c; b++) {
                if (a[b] && (a[b].constructor == bN || a[b].constructor == cC)) {
                    this[this.items[w]] = this.items[this.items[w]] = a[b];
                    this[w]++
                }
            }
    };
    cC[e][L] = function() {
        var a, b;
        for (var c = 0, d = arguments[w]; c < d; c++) {
            a = arguments[c];
            if (a && (a.constructor == bN || a.constructor == cC)) {
                b = this.items[w];
                this[b] = this.items[b] = a;
                this[w]++
            }
        }
        return this
    };
    cC[e].pop = function() {
        delete this[this[w]--];
        return this.items.pop()
    };
    for (var cD in bO) bO[f](cD) && (cC[e][cD] = (function(a) {
        return function() {
            for (var b = 0, c = this.items[w]; b < c; b++) this.items[b][a][m](this.items[b], arguments);
            return this
        }
    })(cD));
    cC[e].attr = function(b, c) {
        if (b && a.is(b, G) && a.is(b[0], "object"))
            for (var d = 0, e = b[w]; d < e; d++) this.items[d].attr(b[d]);
        else
            for (var f = 0, g = this.items[w]; f < g; f++) this.items[f].attr(b, c);
        return this
    };
    cC[e].animate = function(b, c, d, e) {
        (a.is(d, "function") || !d) && (e = d || null);
        var f = this.items[w],
            g = f,
            h, i = this,
            j;
        e && (j = function() {
            !(--f) && e.call(i)
        });
        d = a.is(d, F) ? d : j;
        h = this.items[--g].animate(b, c, d, j);
        while (g--) this.items[g] && !this.items[g].removed && this.items[g].animateWith(h, b, c, d, j);
        return this
    };
    cC[e].insertAfter = function(a) {
        var b = this.items[w];
        while (b--) this.items[b].insertAfter(a);
        return this
    };
    cC[e].getBBox = function() {
        var a = [],
            b = [],
            c = [],
            d = [];
        for (var e = this.items[w]; e--;) {
            var f = this.items[e].getBBox();
            a[L](f.x);
            b[L](f.y);
            c[L](f.x + f.width);
            d[L](f.y + f.height)
        }
        a = A[m](0, a);
        b = A[m](0, b);
        return {
            x: a,
            y: b,
            width: z[m](0, c) - a,
            height: z[m](0, d) - b
        }
    };
    cC[e].clone = function(a) {
        a = new cC;
        for (var b = 0, c = this.items[w]; b < c; b++) a[L](this.items[b].clone());
        return a
    };
    a.registerFont = function(a) {
        if (!a.face) return a;
        this.fonts = this.fonts || {};
        var b = {
                w: a.w,
                face: {},
                glyphs: {}
            },
            c = a.face["font-family"];
        for (var d in a.face) a.face[f](d) && (b.face[d] = a.face[d]);
        this.fonts[c] ? this.fonts[c][L](b) : this.fonts[c] = [b];
        if (!a.svg) {
            b.face["units-per-em"] = T(a.face["units-per-em"], 10);
            for (var e in a.glyphs)
                if (a.glyphs[f](e)) {
                    var g = a.glyphs[e];
                    b.glyphs[e] = {
                        w: g.w,
                        k: {},
                        d: g.d && "M" + g.d[Y](/[mlcxtrv]/g, function(a) {
                            return ({
                                l: "L",
                                c: "C",
                                x: "z",
                                t: "m",
                                r: "l",
                                v: "c"
                            })[a] || "M"
                        }) + "z"
                    };
                    if (g.k)
                        for (var h in g.k) g[f](h) && (b.glyphs[e].k[h] = g.k[h])
                }
        }
        return a
    };
    k.getFont = function(b, c, d, e) {
        e = e || "normal";
        d = d || "normal";
        c = +c || ({
            normal: 400,
            bold: 700,
            lighter: 300,
            bolder: 800
        })[c] || 400;
        if (!a.fonts) return;
        var g = a.fonts[b];
        if (!g) {
            var h = new RegExp("(^|\\s)" + b[Y](/[^\w\d\s+!~.:_-]/g, p) + "(\\s|$)", "i");
            for (var i in a.fonts)
                if (a.fonts[f](i)) {
                    if (h.test(i)) {
                        g = a.fonts[i];
                        break
                    }
                }
        }
        var j;
        if (g)
            for (var k = 0, l = g[w]; k < l; k++) {
                j = g[k];
                if (j.face["font-weight"] == c && (j.face["font-style"] == d || !j.face["font-style"]) && j.face["font-stretch"] == e) break
            }
        return j
    };
    k.print = function(c, d, e, f, g, h, i) {
        h = h || "middle";
        i = z(A(i || 0, 1), -1);
        var j = this.set(),
            k = r(e)[s](p),
            l = 0,
            m = p,
            n;
        a.is(f, e) && (f = this.getFont(f));
        if (f) {
            n = (g || 16) / f.face["units-per-em"];
            var o = f.face.bbox.split(b),
                q = +o[0],
                t = +o[1] + (h == "baseline" ? o[3] - o[1] + +f.face.descent : (o[3] - o[1]) / 2);
            for (var u = 0, v = k[w]; u < v; u++) {
                var x = u && f.glyphs[k[u - 1]] || {},
                    y = f.glyphs[k[u]];
                l += u ? (x.w || f.w) + (x.k && x.k[k[u]] || 0) + f.w * i : 0;
                y && y.d && j[L](this.path(y.d).attr({
                    fill: "#000",
                    stroke: "none",
                    translation: [l, 0]
                }))
            }
            j.scale(n, n, q, t).translate(c - q, d - t)
        }
        return j
    };
    a.format = function(b, c) {
        var e = a.is(c, G) ? [0][n](c) : arguments;
        b && a.is(b, F) && e[w] - 1 && (b = b[Y](d, function(a, b) {
            return e[++b] == null ? p : e[b]
        }));
        return b || p
    };
    a.ninja = function() {
        i.was ? h.Raphael = i.is : delete Raphael;
        return a
    };
    a.el = bO;
    a.st = cC[e];
    i.was ? h.Raphael = a : Raphael = a
})(); /*!widget/UserHome.gold/gold.js*/
/**
 * Created by yangmengyuan on 15/10/24.
 */
$(function() {
    var $body = $('body');
    var addressInput = '#realname, #add_province, #add_city,#add_country, #address, #zipcode, #phone';
    //提交生成收货地址列表
    function saveNewAddress(inputs) {
        var input = inputs || $(addressInput);
        var data = {
            id: 0
        };
        data.id = $('#add_id').val();
        var id;
        inputs.each(function() {
            id = this.id;
            id = id.replace('add_', '');
            data[id] = $(this).val();
        });
        data['province_text'] = $('#add_province option:checked').text();
        data['city_text'] = $('#add_city option:checked').text();
        data['country_text'] = $('#add_country option:checked').text();
        var _tpl =
            '<label class="present-address-focus"><input type="radio" name="addId"  value="$id$" id="addid_$id$" checked/>$realname$ $province_text$ $city_text$ $country_text$ $address$ $phone$</label>'
        var o = {
            id: data.id,
            realname: data.realname,
            province_id: data.province,
            city_id: data.city,
            country_id: data.country,
            address: data.address,
            zipcode: data.zipcode,
            phone: data.phone
        };
        $.ajax('/GoldShop/saveStuAdds/', {
            type: 'POST',
            dataType: 'json',
            data: o,
            success: function(result) {
                console.log(result);
                console.log(result.sign);
                if (result.sign == 0) {
                    alert(result.msg);
                    return false;
                }
                var _id = result.addId;
                var tp = _tpl;
                tp = tp.replace(/\$id\$/g, _id);
                tp = tp.replace(/\$phone\$/g, data.phone);
                tp = tp.replace(/\$zipcode\$/g, data.zipcode);
                tp = tp.replace(/\$address\$/g, data.address);
                tp = tp.replace(/\$country\$/g, data.country);
                tp = tp.replace(/\$city\$/g, data.city);
                tp = tp.replace(/\$province\$/g, data.province);
                tp = tp.replace(/\$realname\$/g, data.realname);
                tp = tp.replace(/\$province_text\$/g, data.province_text);
                tp = tp.replace(/\$city_text\$/g, data.city_text);
                tp = tp.replace(/\$country_text\$/g, data.country_text);
                if (result.type === 1) {
                    $(tp).prependTo('.gold_new_address');
                    $(".present-address-new").removeClass('present-address-focus');
                    $(addressInput).val('');
                } else if (result.type === 2) {
                    $('#addid_' + data.id).parent().html(tp);
                }
                $('.info_from').hide();
                $('.present-exchange').show();
            }
        });
    }
    // 保存收货地址
    $('body').on('click', '#address_submit_btn', function() {
        var inputs = $(addressInput),
            errorbox = $('.error_tips_address');
        var ids = {
            realname: '收货人姓名',
            province: '省份',
            city: '城市',
            country: '地区',
            address: '详细地址',
            zipcode: '邮政编码',
            phone: '手机',
            add_province: '省份',
            add_city: '城市',
            add_country: '地区'
        };
        var _reg = {
            phone: (/^(13|15|18|14|17)[0-9]{9}$/.test($('#phone').val()) ? true : false),
            zipcode: (/^[0-9][0-9]{5}$/.test($('#zipcode').val()) ? true : false)
        };
        //邮编
        var id, error = [],
            error_text = '',
            tpl = '$input$ 不能为空',
            error_reg = [],
            reg_text = '';
        inputs.each(function() {
            id = this.id;
            if ($(this).val().trim() === '') {
                error.push(ids[id]);
                $(this).addClass('error');
            } else {
                // 判断手机号与邮编格式
                if (id == 'phone' || id == 'zipcode') {
                    if (!_reg[id]) {
                        error_reg.push(ids[id]);
                        reg_text += ids[id];
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                } else {
                    $(this).removeClass('error');
                }
            }
        });
        var temp_text = '';
        if (error.length > 0) {
            error_text = error.toString();
            temp_text = tpl.replace('$input$', error_text);
        }
        // 判断手机号与邮编格式
        if (error_reg.length > 0) {
            reg_text = error_reg.toString() + '格式不正确';
            if (error.length > 0) {
                temp_text += ', ';
            }
            temp_text += reg_text;
        }
        if (temp_text != '') {
            errorbox.text(temp_text);
            return;
        }
        errorbox.empty();
        saveNewAddress(inputs);
    });
    function goldTabAJax(e, p) { //封装ajax方法
        var _url = $(e).data('url');
        //console.log($(e));
        $.ajax({
            url: _url,
            type: 'post',
            dataType: 'html',
            data: p,
            success: function(result) {
                if (result.substr(0, 4) == 'http' || result.substr(0, 1) == '/') {
                    window.location.href = result;
                    return;
                }
                $('.gold-detail-block-change').html(result);
                //截字处理
                $('.gold-store-present-card-name').each(function() {
                    var maxwidth = 13;
                    if ($(this).text().length > maxwidth) {
                        $(this).text($(this).text().substring(0, maxwidth));
                        $(this).html($(this).html() + '...');
                    }
                });
            }
        });
    }
    var $gdtbtn = $('.gold-detail-title li');
    $gdtbtn.on("click", function(e) {
        var that = $(this);
        that.addClass('active').siblings().removeClass('active gold-detail-title-on');
        var arr = {};
        $('.calendar').remove();
        goldTabAJax(that, arr);
    });
    $body.on("click", ".gold-store-title-container li", function(e) {
        var that = $(this);
        var arr = {};
        goldTabAJax(that, arr);
    });
    $body.on("click", ".gold-exchange-title-container li", function(e) {
        var that = $(this);
        var arr = {};
        goldTabAJax(that, arr);
    });
    $body.on('click', ".gold-exchange-rank span", function(e) {
        var that = $(this);
        var is_used = $(this).data('id');
        var arr = {};
        arr['is_used'] = is_used;
        goldTabAJax(that, arr);
    });
    $body.on('click', ".gold-store-present-rank-by a", function(e) {
        var that = $(this);
        var sort_type = $(this).data('type');
        var arr = {};
        var gold = $(this).data('gold');
        var gold_sort = 1;
        if (gold == 1) {
            gold_sort = 2;
        }
        arr['sort_type'] = sort_type;
        arr['gold_sort'] = gold_sort;
        goldTabAJax(that, arr);
    });
    $body.on('click', ".gold-exchange-use span", function(e) {
        var exchangeid = $(this).closest('.gold-exchange-show').attr('id')
        if (confirm('您确定使用这张卡片吗？')) {
            $.ajax({
                url: '/GoldShop/useMagicCard',
                type: 'post',
                dataType: 'json',
                data: {
                    id: exchangeid
                },
                success: function(result) {
                    if (result.sign == 2) {
                        window.location.href = result.msg;
                        return;
                    }
                    alert(result.msg);
                    if (result.sign == 1) {
                        var url = '/GoldShop/ajaxGetMagicExLogs/',
                            param = 'is_used=1';
                        if (url) {
                            $.ajax({
                                url: url,
                                data: param,
                                type: "POST",
                                dataType: 'html',
                                success: function(result) {
                                    $('.gold-detail-block-change').html(result);
                                }
                            });
                        }
                    }
                }
            })
        }
    });
    //鼠标移到目标卡片交互
    $body.on({
        mouseenter: function() {
            $(this)
                .stop()
                .css({
                    'box-shadow': '0 1px 5px 0px #666'
                }, 300);
        },
        mouseleave: function() {
            $(this)
                .stop()
                .css({
                    'box-shadow': 'none'
                }, 300);
        }
    }, '.gold-store-present-card');
    $body.on({
        mouseenter: function() {
            $(this)
                .stop()
                .css({
                    'box-shadow': '0 1px 5px 0px #666'
                }, 300);
        },
        mouseleave: function() {
            $(this)
                .stop()
                .css({
                    'box-shadow': 'none'
                }, 300);
        }
    }, '.gold-store-card');
    $body.on({
        mouseenter: function() {
            $(this)
                .stop()
                .css({
                    'box-shadow': '0 1px 5px 0px #666'
                }, 300);
        },
        mouseleave: function() {
            $(this)
                .stop()
                .css({
                    'box-shadow': 'none'
                }, 300);
        }
    }, '.gold-exchange-present-card');
    var
        pabLabel = '.present-address-box form label',
        presentAdd = '.present-add',
        presentDec = '.present-dec',
        redCardAdd = '.red-card-add',
        redCardDec = '.red-card-dec';
    //魔法卡兑换模态框
    $body.on('click', '.gold-store-card-exchange', function() {
        var cardid = $(this).closest('.gold-store-card').attr('id');
        $.ajax({
            url: '/GoldShop/magicDetail',
            //url: '/data/gold/gold-card-modal.html',
            type: 'post',
            //type: 'get',
            dataType: 'html',
            data: {
                id: cardid
            },
            success: function(result) {
                if (result.substr(0, 4) == 'http' || result.substr(0, 1) == '/') {
                    window.location.href = result;
                    return;
                }
                goldCardModal.showModal(result);
            }
        })
    });
    var goldCardModal = goldCardModal || {};
    goldCardModal.showModal = function(con) {
        var that = $(this),
            data = that.data();
        var con = con;
        createModal.show({
            id: 'cardModal',
            width: '740',
            title: '魔法卡兑换',
            cls: 'cardModal bbb',
            content: con
        });
        $('#cardModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        var
            $rcig = $('.red-card-intro-gold em'),
            $redCardPiece = $('.red-card-piece em'),
            gold = parseInt($rcig.html()),
            piece = parseInt($redCardPiece.html()),
            $redCardNum = $('.red-card-num'),
            exMax = $('#exchange_max').val();
        //exMax = 19;
        $body.off('click', redCardAdd).on("click", redCardAdd, function() {
            //console.log($pig.length);
            var num = parseInt($redCardNum.html());
            if (num == 0 || num < 0) {
                $redCardNum.html(0);
                $rcig.html(gold);
            } else if (num >= (exMax - 1)) {
                $redCardNum.html(exMax);
                $rcig.html(gold * exMax);
                $(redCardAdd).css({
                    'background-color': '#b5b5b5'
                });
                if (exMax > 1 || num > 1) {
                    $(redCardDec).css({
                        'background-color': '#3398cc'
                    });
                }
            } else if (num >= piece - 1) {
                $redCardNum.html(piece);
                $rcig.html(gold * piece);
                console.log(piece);
                if (piece == 1) {
                    $(redCardAdd).css({
                        'background-color': '#b5b5b5'
                    });
                    $(redCardDec).css({
                        'background-color': '#b5b5b5'
                    });
                    console.log(piece);
                } else {
                    $(redCardAdd).css({
                        'background-color': '#3398cc'
                    });
                }
                //$(redCardAdd).css({'background-color': '#b5b5b5'});
                //$(redCardDec).css({'background-color':'#3398cc'});
            } else {
                $redCardNum.html(num + 1);
                $rcig.html(gold * (num + 1));
                $(redCardAdd).css({
                    'background-color': '#3398cc'
                });
                if (exMax > 1 || num > 1) {
                    $(redCardDec).css({
                        'background-color': '#3398cc'
                    });
                }
            }
        });
        $body.off('click', redCardDec).on("click", redCardDec, function() {
            var num = parseInt($redCardNum.html());
            if (num == 1) {
                $redCardNum.html(num);
                $rcig.html(gold);
                $(redCardDec).css({
                    'background-color': '#b5b5b5'
                });
                if (!piece) {
                    $(redCardAdd).css({
                        'background-color': '#3398cc'
                    });
                } else {
                    $(redCardAdd).css({
                        'background-color': '#3398cc'
                    });
                    if (piece == 1) {
                        $(redCardAdd).css({
                            'background-color': '#b5b5b5'
                        });
                    }
                }
            } else if (num == 2) {
                $redCardNum.html(num - 1);
                $rcig.html(gold * (num - 1));
                $(redCardDec).css({
                    'background-color': '#b5b5b5'
                });
                $(redCardAdd).css({
                    'background-color': '#3398cc'
                });
            } else {
                $redCardNum.html(num - 1);
                $rcig.html(gold * (num - 1));
                $(redCardDec).css({
                    'background-color': '#3398cc'
                });
                $(redCardAdd).css({
                    'background-color': '#3398cc'
                });
            }
        });
    };
    //魔法卡兑换
    $body.on('click', '.red-card-exchange', function() {
        var redCardId = $(this).closest('.red-card-box').attr('id'),
            $rct = $('.red-card-tip'),
            div = $rct.html(),
            redCardNum = $('.red-card-num'),
            num = parseInt(redCardNum.html());
        $.ajax({
            url: '/GoldShop/ajaxExchange',
            type: 'post',
            dataType: 'json',
            data: {
                id: redCardId,
                award_type: 2,
                num: num
            },
            success: function(msg, event) {
                if (msg.sign == 2) {
                    window.location.href = msg.msg;
                    return;
                }
                if (msg.sign == 0) {
                    if (div !== '') {
                        event.preventDefault();
                    } else {
                        $rct.append('<div class="alert alert-danger fade in"><span class="glyphicon glyphicon-exclamation-sign gold-tip-alert"></span><span>' + msg.msg + '</span></div>')
                    }
                }
                if (msg.sign == 1) {
                    $('#cardModal').modal('hide');
                    var _url = msg.msg;
                    $.ajax({
                        url: _url,
                        type: 'post',
                        dataType: 'html',
                        success: function(result) {
                            $('.gold-detail-block-change').html(result);
                            var exList = $('#ex-list');
                            var pList = $('#p-list');
                            exList.addClass('active');
                            pList.removeClass('active');
                        }
                    });
                }
            }
        });
    });
    //实物兑换模态框
    $body.on('click', '.gold-store-present-exchange', function() {
        var presentid = $(this).closest('.gold-store-present-card').attr('id');
        $.ajax({
            url: '/GoldShop/realAwardDetail',
            //url:'/data/gold/gold-present-modal.html',
            type: 'post',
            //type:'get',
            dataType: 'html',
            data: {
                id: presentid
            },
            success: function(result) {
                if (result.substr(0, 4) == 'http' || result.substr(0, 1) == '/') {
                    window.location.href = result;
                    return;
                }
                goldPresentModal.showModal(result);
            }
        })
    });
    var goldPresentModal = goldPresentModal || {};
    goldPresentModal.showModal = function(con) {
        var that = $(this),
            data = that.data();
        var con = con;
        //console.log(data);
        createModal.show({
            id: 'presentModal',
            width: '740',
            title: "实物礼品兑换",
            cls: "presentModal aaa ccc",
            content: con
        });
        $('#presentModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $body.on("click", pabLabel, function(e) {
            var
                $target = $(e.target),
                $pabLabel = $(pabLabel),
                $pan = $('.present-address-new'),
                $df = $('#details_form'),
                $pe = $('.present-exchange');
            if ($target[0].nodeName != 'LABEL') {
                $target = $target.parents('label');
                var index = $target.index();
            }
            $pabLabel.removeClass('present-address-focus').eq(index).addClass('present-address-focus');
            if ($pan.hasClass('present-address-focus')) {
                $df.show();
                $pe.hide()
            } else {
                $df.hide();
                $pe.show();
            }
        });
        var
        //pig = '.present-intro-gold em',
            $pig = $('.present-intro-gold em'),
            $presentPiece = $('.present-piece em'),
            gold = parseInt($pig.html()),
            piece = parseInt($presentPiece.html()),
            $presentNum = $('.present-num'),
            exMax = $('#exchange_max').val();
        $body.off('click', presentAdd).on("click", presentAdd, function() {
            //console.log($pig.length);
            console.log(piece);
            var num = parseInt($presentNum.html());
            if (num == 0 || num < 0) {
                $presentNum.html(0);
                $pig.html(gold);
            } else if (num >= (exMax - 1)) {
                $presentNum.html(exMax);
                $pig.html(gold * exMax);
                $(presentAdd).css({
                    'background-color': '#b5b5b5'
                });
                if (exMax > 1 || num > 1) {
                    $(presentDec).css({
                        'background-color': '#3398cc'
                    });
                }
            } else if (num >= piece - 1) {
                $presentNum.html(piece);
                $pig.html(gold * piece);
                console.log(piece);
                if (piece == 1) {
                    $(presentAdd).css({
                        'background-color': '#b5b5b5'
                    });
                    $(presentDec).css({
                        'background-color': '#b5b5b5'
                    });
                    console.log(piece);
                } else {
                    $(presentAdd).css({
                        'background-color': '#3398cc'
                    });
                }
                //$(redCardAdd).css({'background-color': '#b5b5b5'});
                //$(redCardDec).css({'background-color':'#3398cc'});
            } else {
                $presentNum.html(num + 1);
                $pig.html(gold * (num + 1));
                $(presentAdd).css({
                    'background-color': '#3398cc'
                });
                if (exMax > 1 || num > 1) {
                    $(presentDec).css({
                        'background-color': '#3398cc'
                    });
                }
            }
        });
        $body.off('click', presentDec).on("click", presentDec, function() {
            var num = parseInt($presentNum.html());
            if (num == 1) {
                $presentNum.html(num);
                $pig.html(gold);
                $(presentDec).css({
                    'background-color': '#b5b5b5'
                });
                if (!piece) {
                    $(presentAdd).css({
                        'background-color': '#3398cc'
                    });
                } else {
                    $(presentAdd).css({
                        'background-color': '#3398cc'
                    });
                    if (piece == 1) {
                        $(presentAdd).css({
                            'background-color': '#b5b5b5'
                        });
                    }
                }
            } else if (num == 2) {
                $presentNum.html(num - 1);
                $pig.html(gold * (num - 1));
                $(presentDec).css({
                    'background-color': '#b5b5b5'
                });
                $(presentAdd).css({
                    'background-color': '#3398cc'
                });
            } else {
                $presentNum.html(num - 1);
                $pig.html(gold * (num - 1));
                $(presentDec).css({
                    'background-color': '#3398cc'
                });
                $(presentAdd).css({
                    'background-color': '#3398cc'
                });
            }
        });
    };
    //实物礼品兑换
    $body.on('click', '.present-exchange', function() {
        var
            $pct = $('.present-card-tip'),
            presentId = $(this).closest('.present-box').attr('id'),
            $presentNum = $('.present-num'),
            num = parseInt($presentNum.html()),
            div = $pct.html(),
            adddata = $('.present-address-box input:checked[name="addId"]'),
            addId = adddata.val();
        $.ajax({
            url: '/GoldShop/ajaxExchange',
            type: 'post',
            dataType: 'json',
            data: {
                award_type: 1,
                id: presentId,
                num: num,
                addId: addId
            },
            success: function(msg, event) {
                if (msg.sign == 0) {
                    if (div !== '') {
                        event.preventDefault();
                    } else {
                        $pct.append('<div class="alert alert-danger fade in"><span class="glyphicon glyphicon-exclamation-sign gold-tip-alert"></span><span>' + msg.msg + '</span></div>')
                    }
                }
                if (msg.sign == 1) {
                    $('#presentModal').modal('hide');
                    var _url = msg.msg;
                    $.ajax({
                        url: _url,
                        type: 'post',
                        dataType: 'html',
                        success: function(result) {
                            if (msg.sign == 2) {
                                window.location.href = msg.msg;
                                return;
                            }
                            $('.gold-detail-block-change').html(result);
                            var exList = $('#ex-list');
                            var pList = $('#p-list');
                            exList.addClass('active');
                            pList.removeClass('active');
                        }
                    });
                }
            }
        });
    });
});
; /*!widget/UserHome.header/homeHeader.js*/
/**
 * Created by user on 2015/10/21.
 */
/* 展示学生勋章 */
function showStudPrize(dom) {
    var leftDis = dom.offset().left;
    var heightDis = dom.offset().top + dom.height();
    var _dom = dom.data('target') || dom.attr('data-target');
    //取出勋章页卡的结构
    var tpl = $('#' + _dom).html();
    //定义向上箭头的结构
    var arrow = '<div class="dialog_arrow_c student-medal-dialog-arrow arrow_tl ' + _dom + '"></div>';
    var box = '<div id="stuBox_' + _dom + '" class="student-medal-dialog">' + tpl + '</div>';
    $('body').find('.student-medal-dialog').remove();
    $('body').find('.student-medal-dialog-arrow').remove();
    $('body').append(arrow);
    $('body').append(box);
    //目前所测试的距离可能在不同的浏览器中会有偏差；设置页卡的定位
    $('.' + _dom).css({
        'top': heightDis - 4,
        'left': leftDis + 5,
        'z-index': 11
    })
    $('#stuBox_' + _dom).css({
        'position': 'absolute',
        'top': heightDis - 5,
        'left': leftDis - 160,
        'z-index': 10
    })
}
/* 鼠标移入，勋章展现 */
$('ul.user-medal.list-inline li img[data-target*="hidediv_"]').off('mouseover').on('mouseover', function() {
    var that = this;
    var dom = $(that);
    //通过判断箭头（唯一标识）来区别页面是否有勋章页卡，如果有就不创建
    if (!$('div.dialog_arrow').length) {
        showStudPrize(dom);
    }
    return false;
});
/* 鼠标移出，页卡消失 */
$('ul.user-medal.list-inline li img[data-target*="hidediv_"]').off('mouseout').on(' mouseout', function(e) {
    var tar = $(e.relatedTarget),
        that = this,
        _dom = $(that).data('target'),
        boxId = 'stuBox_' + _dom;
    //删除页卡的方法
    function removeDom(boxId) {
        $('div.dialog_arrow_c.arrow_tl').remove();
        $('#' + boxId).remove();
    }
    //如果
    if (tar.attr('id') !== boxId && !tar.hasClass(_dom)) {
        removeDom(boxId);
    } else {
        $('#' + boxId).on('mouseleave', function(e) {
            //如果移动到勋章上面，则页卡不消失
            var tar = $(e.relatedTarget);
            if (!tar.hasClass(_dom)) {
                removeDom(boxId);
            }
        })
    }
    return false;
});; /*!widget/UserHome.homework/homework.ImageSet.min.js*/
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < 62 ? '' : e(parseInt(c / 62))) + ((c = c % 62) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if ('0'.replace(0, e) == 0) {
        while (c--) r[e(c)] = k[c];
        k = [function(e) {
            return r[e] || e
        }];
        e = function() {
            return '([3-59cf-hj-mo-rt-yCG-NP-RT-Z]|[12]\\w)'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('4 $$,$$B,$$A,$$F,$$D,$$E,$$CE,$$S;(3(){4 O,B,A,F,D,E,CE,S;O=3(id){5"22"==1F id?P.getElementById(id):id};O.emptyFunction=3(){};O.extend=3(N,13,1r){9(1r===23)1r=14;I(4 Q x 13){9(1r||!(Q x N)){N[Q]=13[Q]}}5 N};O.deepextend=3(N,13){I(4 Q x 13){4 1h=13[Q];9(N===1h)continue;9(1F 1h==="c"){N[Q]=L.callee(N[Q]||{},1h)}J{N[Q]=1h}}5 N};O.wrapper=3(me,25){4 1G=3(){me.R(Z,L)};4 1H=3(){};1H.15=25.15;1G.15=new 1H;5 1G};B=(3(T){4 b={17:/17/.M(T)&&!/1I/.M(T),1I:/1I/.M(T),26:/webkit/.M(T)&&!/1J/.M(T),27:/27/.M(T),1J:/1J/.M(T)};4 1s="";I(4 i x b){9(b[i]){1s="26"==i?"1i":i;1K}}b.1i=1s&&1L("(?:"+1s+")[\\\\/: ]([\\\\d.]+)").M(T)?1L.$1:"0";b.ie=b.17;b.28=b.17&&1N(b.1i,10)==6;b.ie7=b.17&&1N(b.1i,10)==7;b.29=b.17&&1N(b.1i,10)==8;5 b})(1O.navigator.userAgent.toLowerCase());A=3(){4 m={isArray:3(2a){5 Object.15.toString.18(2a)==="[c 1P]"},1t:3(K,W,j){9(K.1t){5 1u(j)?K.1t(W):K.1t(W,j)}J{4 U=K.1j;j=1u(j)?0:j<0?1v.2b(j)+U:1v.2c(j);I(;j<U;j++){9(K[j]===W)5 j}5-1}},1w:3(K,W,j){9(K.1w){5 1u(j)?K.1w(W):K.1w(W,j)}J{4 U=K.1j;j=1u(j)||j>=U-1?U-1:j<0?1v.2b(j)+U:1v.2c(j);I(;j>-1;j--){9(K[j]===W)5 j}5-1}}};3 11(c,t){9(23===c.1j){I(4 l x c){9(y===t(c[l],l,c))1K}}J{I(4 i=0,U=c.1j;i<U;i++){9(i x c){9(y===t(c[i],i,c))1K}}}};11({2d:3(c,t,r){11(c,3(){t.R(r,L)})},map:3(c,t,r){4 m=[];11(c,3(){m.2e(t.R(r,L))});5 m},1x:3(c,t,r){4 m=[];11(c,3(2f){t.R(r,L)&&m.2e(2f)});5 m},every:3(c,t,r){4 m=14;11(c,3(){9(!t.R(r,L)){m=y;5 y}});5 m},some:3(c,t,r){4 m=y;11(c,3(){9(t.R(r,L)){m=14;5 y}});5 m}},3(2g,l){m[l]=3(c,t,r){9(c[l]){5 c[l](t,r)}J{5 2g(c,t,r)}}});5 m}();F=(3(){4 19=1P.15.19;5{bind:3(1y,r){4 1a=19.18(L,2);5 3(){5 1y.R(r,1a.2h(19.18(L)))}},bindAsEventListener:3(1y,r){4 1a=19.18(L,2);5 3(h){5 1y.R(r,[E.1k(h)].2h(1a))}}}})();D={1z:3(p){4 1b=p?p.2i:P;5 1b.2j.2k||1b.2l.2k},1A:3(p){4 1b=p?p.2i:P;5 1b.2j.2m||1b.2l.2m},2n:P.1l?3(a,b){5!!(a.2o(b)&16)}:3(a,b){5 a!=b&&a.2n(b)},G:3(p){4 q=0,V=0,X=0,Y=0;9(!p.2p||B.29){4 n=p;while(n){q+=n.offsetLeft,V+=n.offsetTop;n=n.offsetParent};X=q+p.offsetWidth;Y=V+p.offsetHeight}J{4 G=p.2p();q=X=D.1A(p);V=Y=D.1z(p);q+=G.q;X+=G.X;V+=G.V;Y+=G.Y};5{"q":q,"V":V,"X":X,"Y":Y}},clientRect:3(p){4 G=D.G(p),1Q=D.1A(p),1R=D.1z(p);G.q-=1Q;G.X-=1Q;G.V-=1R;G.Y-=1R;5 G},1c:P.1l?3(u){5 P.1l.2q(u,1m)}:3(u){5 u.1S},getStyle:P.1l?3(u,l){4 o=P.1l.2q(u,1m);5 l x o?o[l]:o.getPropertyValue(l)}:3(u,l){4 o=u.o,1c=u.1S;9(l=="12"){9(/1T\\(12=(.*)\\)/i.M(1c.1x)){4 12=parseFloat(1L.$1);5 12?12/2r:0}5 1}J 9(l=="2s"){l="2t"}4 m=1c[l]||1c[S.1U(l)];9(!/^-?\\d+(?:px)?$/i.M(m)&&/^\\-?\\d/.M(m)){4 q=o.q,1B=u.runtimeStyle,2v=1B.q;1B.q=1c.q;o.q=m||0;m=o.pixelLeft+"px";o.q=q;1B.q=2v}5 m},setStyle:3(1n,o,1d){9(!1n.1j){1n=[1n]}9(1F o=="22"){4 s=o;o={};o[s]=1d}A.2d(1n,3(u){I(4 l x o){4 1d=o[l];9(l=="12"&&B.ie){u.o.1x=(u.1S.1x||"").2w(/1T\\([^)]*\\)/,"")+"1T(12="+1d*2r+")"}J 9(l=="2s"){u.o[B.ie?"2t":"cssFloat"]=1d}J{u.o[S.1U(l)]=1d}}})}};E=(3(){4 1e,1f,v=1,1V=3(g,f,k){9(!k.$$v)k.$$v=v++;9(!g.C)g.C={};4 H=g.C[f];9(!H){H=g.C[f]={};9(g["on"+f]){H[0]=g["on"+f]}}};9(1O.1X){4 1o={"mouseenter":"2x","mouseleave":"2y"};1e=3(g,f,k){9(f x 1o){1V(g,f,k);4 2z=g.C[f][k.$$v]=3(h){4 1C=h.1p;9(!1C||(g!=1C&&!(g.2o(1C)&16))){k.18(Z,h)}};g.1X(1o[f],2z,y)}J{g.1X(f,k,y)}};1f=3(g,f,k){9(f x 1o){9(g.C&&g.C[f]){g.2A(1o[f],g.C[f][k.$$v],y);1Y g.C[f][k.$$v]}}J{g.2A(f,k,y)}}}J{1e=3(g,f,k){1V(g,f,k);g.C[f][k.$$v]=k;g["on"+f]=1D};1f=3(g,f,k){9(g.C&&g.C[f]){1Y g.C[f][k.$$v]}};3 1D(){4 1E=14,h=1k();4 H=Z.C[h.f];I(4 i x H){Z.$$1D=H[i];9(Z.$$1D(h)===y){1E=y}}5 1E}}3 1k(h){9(h)5 h;h=1O.h;h.pageX=h.clientX+D.1A(h.1Z);h.pageY=h.clientY+D.1z(h.1Z);h.target=h.1Z;h.20=20;h.21=21;4 1p={"2y":h.toElement,"2x":h.fromElement}[h.f];9(1p){h.1p=1p}5 h};3 20(){Z.cancelBubble=14};3 21(){Z.1E=y};5{"1e":1e,"1f":1f,"1k":1k}})();CE=(3(){4 v=1;5{1e:3(c,f,k){9(!k.$$$v)k.$$$v=v++;9(!c.w)c.w={};9(!c.w[f])c.w[f]={};c.w[f][k.$$$v]=k},1f:3(c,f,k){9(c.w&&c.w[f]){1Y c.w[f][k.$$$v]}},fireEvent:3(c,f){9(!c.w)5;4 1a=1P.15.19.18(L,2),H=c.w[f];I(4 i x H){H[i].R(c,1a)}},clearEvent:3(c){9(!c.w)5;I(4 f x c.w){4 H=c.w[f];I(4 i x H){H[i]=1m}c.w[f]=1m}c.w=1m}}})();S={1U:3(s){5 s.2w(/-([a-z])/ig,3(all,2B){5 2B.toUpperCase()})}};9(B.28){try{P.execCommand("BackgroundImageCache",y,14)}catch(e){}};$$=O;$$B=B;$$A=A;$$F=F;$$D=D;$$E=E;$$CE=CE;$$S=S})();', [], 162, '|||function|var|return||||if|||object|||type|element|event||from|handler|name|ret||style|node|left|thisp||callback|elem|guid|cusevents|in|false||||events||||rect|handlers|for|else|array|arguments|test|destination||document|property|apply||ua|len|top|elt|right|bottom|this||each|opacity|source|true|prototype||msie|call|slice|args|doc|curStyle|value|addEvent|removeEvent||copy|version|length|fixEvent|defaultView|null|elems|fix|relatedTarget||override|vMark|indexOf|isNaN|Math|lastIndexOf|filter|fun|getScrollTop|getScrollLeft|rtStyle|related|handleEvent|returnValue|typeof|ins|subclass|opera|chrome|break|RegExp||parseInt|window|Array|sLeft|sTop|currentStyle|alpha|camelize|storage||addEventListener|delete|srcElement|stopPropagation|preventDefault|string|undefined||parent|safari|firefox|ie6|ie8|obj|ceil|floor|forEach|push|item|method|concat|ownerDocument|documentElement|scrollTop|body|scrollLeft|contains|compareDocumentPosition|getBoundingClientRect|getComputedStyle|100|float|styleFloat||rsLeft|replace|mouseover|mouseout|fixhandler|removeEventListener|letter'.split('|'), 0, {})); /*!widget/UserHome.homework/homework.ImageTrans.min.js*/
/**
 * ImageTrans图片旋转 缩放 拖拽
 * @authors duxinli
 * @date    2015-10-12
 * @version $Id$
 */
/**
 * 判断浏览器ie版本号
 */
var $ImageB = $ImageB || {};
$ImageB.browser = $ImageB.browser || {};
$ImageB.browser.uga = navigator.userAgent.toLowerCase();
$ImageB.browser.msie = /msie/.test($ImageB.browser.uga);
$ImageB.check = $ImageB.check || {};
$ImageB.check.isIE6 = !-[1, ] && !window.XMLHttpRequest;
$ImageB.check.isIE7 = $ImageB.browser.uga.indexOf("msie 7.0") > 0;
$ImageB.check.isIE8 = $ImageB.browser.uga.indexOf("msie 8.0") > 0;
$ImageB.check.isIE9 = $ImageB.browser.uga.indexOf("msie 9.0") > 0;
//容器对象
var ImageTrans = function(container, options) {
    this._initialize(container, options);
    this._initMode();
    if (this._support) {
        this._initContainer();
        this._init();
    } else { //模式不支持
        this.onError("not support");
    }
};
ImageTrans.prototype = {
    //初始化程序
    _initialize: function(container, options) {
        var container = this._container = $$(container);
        this._clientWidth = container.clientWidth; //变换区域宽度
        this._clientHeight = container.clientHeight; //变换区域高度
        this._img = new Image(); //图片对象
        this._style = {}; //备份样式
        this._x = this._y = 1; //水平/垂直变换参数
        this.rotateNum = 1; //1是原图没有旋转，宽和高都是原图 0是高和宽对调，就是把原图的高变为宽，宽变为高
        this._radian = 0; //旋转变换参数
        this._support = false; //是否支持变换
        this._init = this._load = this._show = this._dispose = $$.emptyFunction;
        var opt = this._setOptions(options);
        this._zoom = opt.zoom;
        this.onPreLoad = opt.onPreLoad;
        this.onLoad = opt.onLoad;
        this.onError = opt.onError;
        this._LOAD = $$F.bind(function() {
            this.onLoad();
            this._load();
            this.reset();
            this._img.style.visibility = "visible";
        }, this);
        $$CE.fireEvent(this, "init");
    },
    //设置默认属性
    _setOptions: function(options) {
        this.options = { //默认值
            mode: "css3|filter|canvas",
            zoom: .1, //缩放比率
            onPreLoad: function() {}, //图片加载前执行
            onLoad: function() {}, //图片加载后执行
            onError: function(err) {} //出错时执行
        };
        return $$.extend(this.options, options || {});
    },
    //模式设置
    _initMode: function() {
        var modes = ImageTrans.modes;
        this._support = $$A.some(this.options.mode.toLowerCase().split("|"), function(mode) {
            mode = modes[mode];
            if (mode && mode.support) {
                mode.init && (this._init = mode.init); //初始化执行程序
                mode.load && (this._load = mode.load); //加载图片执行程序
                mode.show && (this._show = mode.show); //变换显示程序
                mode.dispose && (this._dispose = mode.dispose); //销毁程序
                //扩展变换方法
                $$A.forEach(ImageTrans.transforms, function(transform, name) {
                    this[name] = function() {
                        transform.apply(this, [].slice.call(arguments));
                        this._show();
                    }
                }, this);
                return true;
            }
        }, this);
    },
    //初始化容器对象
    _initContainer: function() {
        var container = this._container,
            style = container.style,
            position = $$D.getStyle(container, "position");
        this._style = {
            "position": style.position,
            "overflow": style.overflow
        }; //备份样式
        if (position != "relative" && position != "absolute") {
            style.position = "relative";
        }
        style.overflow = "hidden";
        if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
            style.cursor = "move";
        }
        $$CE.fireEvent(this, "initContainer");
    },
    //加载图片
    load: function(src) {
        if (this._support) {
            var img = this._img,
                oThis = this;
            img.onload || (img.onload = this._LOAD);
            img.onerror || (img.onerror = function() {
                oThis.onError("err image");
            });
            img.style.visibility = "hidden";
            img.style.width = "auto"; //更换图片时初始化宽
            img.style.height = "auto"; //更换图片时初始化高
            this.onPreLoad();
            img.src = src;
            img.className = 'ImageTransformJs';
            img.style.cursor = "move";
            this.rotateNum = 1; //更换图片时重新定义
            this._x = this._y = 1; //更换图片时重新定义水平/垂直变换参数
            $(this._img).attr('_y', this._y).attr('_x', this._x);
        }
    },
    //重置
    reset: function() {
        if (this._support) {
            this._x = this._y = 1;
            this._radian = 0;
            this._show();
        }
    },
    //销毁程序
    dispose: function() {
        if (this._support) {
            this._dispose();
            $$CE.fireEvent(this, "dispose");
            $$D.setStyle(this._container, this._style); //恢复样式
            this._container = this._img = this._img.onload = this._img.onerror = this._LOAD = null;
        }
    }
};
//变换模式
ImageTrans.modes = function() {
    var css3Transform; //ccs3变换样式
    //初始化图片对象函数
    function initImg(img, container) {
        $$D.setStyle(img, {
            position: "absolute",
            border: 0,
            padding: 0,
            margin: 0,
            width: "auto",
            height: "auto", //重置样式
            visibility: "hidden" //加载前隐藏
        });
        container.appendChild(img);
    }
    //获取变换参数函数
    function getMatrix(radian, x, y) {
        var Cos = Math.cos(radian),
            Sin = Math.sin(radian);
        return {
            M11: Cos * x,
            M12: -Sin * y,
            M21: Sin * x,
            M22: Cos * y
        };
    }
    return {
        css3: { //css3设置
            support: function() {
                var style = document.createElement("div").style;
                return $$A.some(
                    ["transform", "MozTransform", "webkitTransform", "OTransform"],
                    function(css) {
                        if (css in style) {
                            css3Transform = css;
                            return true;
                        }
                    });
            }(),
            init: function() {
                initImg(this._img, this._container);
            },
            load: function() {
                var img = this._img;
                /*
                 *图片缩放
                 */
                var maxWidth = this._container.clientWidth;
                var maxHeight = this._container.clientHeight;
                var rate = (maxHeight / img.offsetHeight > maxWidth / img.offsetWidth ? maxWidth / img.offsetWidth : maxHeight / img.offsetHeight);
                //console.log( this._container.clientWidth)
                $(img).attr('_imgW', img.offsetWidth).attr('_imgH', img.offsetHeight);
                //设置等比例图片的宽和高以及居中显示
                $$D.setStyle(img, {
                    width: img.offsetWidth * rate + "px",
                    height: img.offsetHeight * rate + "px",
                    top: (maxHeight - img.offsetHeight * rate) / 2 + "px",
                    left: (maxWidth - img.offsetWidth * rate) / 2 + "px",
                    visibility: "visible"
                });
            },
            show: function() {
                var matrix = getMatrix(this._radian, this._y, this._x);
                //设置变形样式
                this._img.style[css3Transform] = "matrix(" + matrix.M11.toFixed(16) + "," + matrix.M21.toFixed(16) + "," + matrix.M12.toFixed(16) + "," + matrix.M22.toFixed(16) + ", 0, 0)";
            },
            dispose: function() {
                this._container.removeChild(this._img);
            }
        },
        filter: { //滤镜设置
            support: function() {
                return "filters" in document.createElement("div");
            }(),
            init: function() {
                initImg(this._img, this._container);
                //设置滤镜
                this._img.style.filter = "progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand')";
            },
            load: function() {
                this._img.onload = null; //防止ie重复加载gif的bug
                this._img.style.visibility = "visible";
                var img = this._img;
                $(img).removeAttr('_imgW').removeAttr('_imgH');
                /*
                 *图片缩放
                 */
                /*var maxWidth = this._container.clientWidth;
                var maxHeight = this._container.clientHeight;
                var rate=(maxHeight/img.offsetHeight>maxWidth/img.offsetWidth?maxWidth/img.offsetWidth:maxHeight/img.offsetHeight); 
               //console.log( this._container.clientWidth)
                $(img).attr('_imgW',img.offsetWidth).attr('_imgH',img.offsetHeight);
                
                //设置等比例图片的宽和高以及居中显示
                $$D.setStyle( img, {
                    width: img.offsetWidth*rate + "px",
                    height: img.offsetHeight*rate + "px"
                });*/
            },
            show: function() {
                var img = this._img;
                //设置滤镜
                $$.extend(
                    img.filters.item("DXImageTransform.Microsoft.Matrix"),
                    getMatrix(this._radian, this._y, this._x)
                );
                var maxWidth = this._container.clientWidth;
                var maxHeight = this._container.clientHeight;
                //判断是否第一次进来,第一次没做任何操作缩放旋转的状态，因为等比例缩放只能运行一次，而这个show一直在运行
                if (!$(img).attr('_imgW') && !$(img).attr('_imgW')) {
                    $(img).attr('_imgW', img.offsetWidth).attr('_imgH', img.offsetHeight).attr('height', img.offsetHeight).attr('width', img.offsetWidth);
                    /*
                     *图片缩放
                     */
                    var maxWidth = this._container.clientWidth;
                    var maxHeight = this._container.clientHeight;
                    var rate = (maxHeight / img.offsetHeight > maxWidth / img.offsetWidth ? maxWidth / img.offsetWidth : maxHeight / img.offsetHeight);
                    //设置等比例图片的宽和高以及居中显示
                    $$D.setStyle(img, {
                        width: img.offsetWidth * rate + "px",
                        height: img.offsetHeight * rate + "px"
                    });
                }
                //设置等比例图片的宽和高以及居中显示
                $$D.setStyle(img, {
                    top: (maxHeight - img.offsetHeight) / 2 + "px",
                    left: (maxWidth - img.offsetWidth) / 2 + "px",
                    visibility: "visible"
                });
            },
            dispose: function() {
                this._container.removeChild(this._img);
            }
        },
        canvas: { //canvas设置
            support: function() {
                return "getContext" in document.createElement('canvas');
            }(),
            init: function() {
                var canvas = this._canvas = document.createElement('canvas'),
                    context = this._context = canvas.getContext('2d');
                //样式设置
                $$D.setStyle(canvas, {
                    position: "absolute",
                    left: 0,
                    top: 0
                });
                canvas.width = this._container.clientWidth;
                canvas.height = this._container.clientHeight;
                this._container.appendChild(canvas);
            },
            show: function() {
                var img = this._img,
                    context = this._context,
                    clientWidth = this._container.clientWidth,
                    clientHeight = this._container.clientHeight;
                //canvas变换
                context.save();
                context.clearRect(0, 0, clientWidth, clientHeight); //清空内容
                context.translate(clientWidth / 2, clientHeight / 2); //中心坐标
                context.rotate(this._radian); //旋转
                context.scale(this._y, this._x); //缩放
                context.drawImage(img, -img.width / 2, -img.height / 2); //居中画图
                context.restore();
            },
            dispose: function() {
                this._container.removeChild(this._canvas);
                this._canvas = this._context = null;
            }
        }
    };
}();
//变换方法
ImageTrans.transforms = {
    //垂直翻转
    vertical: function() {
        this._radian = Math.PI - this._radian;
        this._y *= -1;
    },
    //水平翻转
    horizontal: function() {
        this._radian = Math.PI - this._radian;
        this._x *= -1;
    },
    //根据弧度旋转
    rotate: function(radian) {
        this._radian = radian;
    },
    //向左转90度
    left: function() {
        this._radian -= Math.PI / 2;
        if (this.rotateNum == 1) {
            this.rotateNum = 0;
        } else if (this.rotateNum == 0) {
            this.rotateNum = 1;
        }
        this._img.style.left = ($(this._container).width() - $(this._img).width()) / 2 + "px";
        this._img.style.top = ($(this._container).height() - $(this._img).height()) / 2 + "px";
    },
    //向右转90度
    right: function() {
        this._radian += Math.PI / 2;
        if (this.rotateNum == 1) {
            this.rotateNum = 0;
        } else if (this.rotateNum == 0) {
            this.rotateNum = 1;
        }
        this._img.style.left = ($(this._container).width() - $(this._img).width()) / 2 + "px";
        this._img.style.top = ($(this._container).height() - $(this._img).height()) / 2 + "px";
    },
    //根据角度旋转
    rotatebydegress: function(degress) {
        this._radian = degress * Math.PI / 180;
    },
    //缩放
    scale: function() {
        function getZoom(scale, zoom) {
            return scale > 0 && scale > -zoom ? zoom :
                scale < 0 && scale < zoom ? -zoom : 0;
        }
        return function(zoom) {
            if (zoom) {
                var hZoom = getZoom(this._y, zoom),
                    vZoom = getZoom(this._x, zoom);
                if (hZoom && vZoom) {
                    //缩小的时候图片居中放置和控制图片缩小的最小的比例
                    if (zoom < 0) {
                        //判断图片缩放的大小限制
                        if (this._y < 0.3) {
                            return false;
                        }
                        //图片重新居中
                        this._img.style.left = ($(this._container).width() - $(this._img).width()) / 2 + "px";
                        this._img.style.top = ($(this._container).height() - $(this._img).height()) / 2 + "px";
                    }
                    this._y += hZoom;
                    this._x += vZoom;
                    $(this._img).attr('_y', this._y).attr('_x', this._x);
                }
            }
        }
    }(),
    //放大
    zoomin: function() {
        this.scale(Math.abs(this._zoom));
    },
    //缩小
    zoomout: function() {
        this.scale(-Math.abs(this._zoom));
    }
};
//滚轮缩放扩展
ImageTrans.prototype._initialize = (function() {
    var init = ImageTrans.prototype._initialize,
        mousewheel = $$B.firefox ? "DOMMouseScroll" : "mousewheel",
        methods = {
            "init": function() {
                this._mzZoom = $$F.bind(zoom, this);
            },
            "initContainer": function() {
                $$E.addEvent(this._container, mousewheel, this._mzZoom);
            },
            "dispose": function() {
                $$E.removeEvent(this._container, mousewheel, this._mzZoom);
                this._mzZoom = null;
            }
        };
    //缩放函数
    function zoom(e) {
        this.scale((
            e.wheelDelta ? e.wheelDelta / (-120) : (e.detail || 0) / 3
        ) * Math.abs(this._zoom));
        e.preventDefault();
    };
    return function() {
        var options = arguments[1];
        if (!options || options.mouseZoom !== false) {
            //扩展钩子
            $$A.forEach(methods, function(method, name) {
                $$CE.addEvent(this, name, method);
            }, this);
        }
        init.apply(this, arguments);
    }
})();
//拖动图片扩展
ImageTrans.prototype._initialize = (function() {
    var init = ImageTrans.prototype._initialize,
        methods = {
            "init": function() {
                this._mrX = this._mrY = this._mrRadian = 0;
                this._mrSTART = $$F.bind(start, this);
                this._mrMOVE = $$F.bind(move, this);
                this._mrSTOP = $$F.bind(stop, this);
            },
            "initContainer": function() {
                if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
                    $$E.addEvent(this._container, "mousedown", this._mrSTART);
                } else {
                    $$E.addEvent(this._img, "mousedown", this._mrSTART);
                }
            },
            "dispose": function() {
                if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
                    $$E.removeEvent(this._container, "mousedown", this._mrSTART);
                } else {
                    $$E.removeEvent(this._img, "mousedown", this._mrSTART);
                }
                this._mrSTOP();
                this._mrSTART = this._mrMOVE = this._mrSTOP = null;
            }
        };
    var downX, downY, imgLeft = 0,
        imgTop = 0,
        moveX = 0,
        moveY = 0;
    //开始函数
    function start(e) {
        downX = e.clientX;
        downY = e.clientY;
        //点击拖动开始时判断图片是否旋转反方向，如果是，将图片的宽和高对调
        imgLeft = this._img.offsetLeft + 1;
        imgTop = this._img.offsetTop + 1;
        $$E.addEvent(document, "mousemove", this._mrMOVE);
        $$E.addEvent(document, "mouseup", this._mrSTOP);
        if ($$B.ie) {
            var container = this._container;
            $$E.addEvent(container, "losecapture", this._mrSTOP);
            container.setCapture();
        } else {
            $$E.addEvent(window, "blur", this._mrSTOP);
            e.preventDefault();
        }
    };
    //拖动函数
    function move(e) {
        var _ImgRate, _ImgSW, _ImgSH, _ImgW, _ImgH, _ViewImgW, _ViewImgH, _LeftX, _LeftY;
        _ImgRate = parseFloat($(this._img).attr("_x") || 1).toFixed(1);
        //this.rotateNum = 1的时候图片是横向原始大小，this.rotateNum = 0时，图片是纵向将图片的宽和高对调
        if (this.rotateNum == 1) {
            _ImgSW = parseFloat($(this._img).width());
            _ImgSH = parseFloat($(this._img).height());
        } else if (this.rotateNum == 0) {
            if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
                _ImgSW = parseFloat($(this._img).width());
                _ImgSH = parseFloat($(this._img).height());
            } else {
                _ImgSW = parseFloat($(this._img).height());
                _ImgSH = parseFloat($(this._img).width());
            }
        }
        if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
            _ImgW = _ImgSW;
            _ImgH = _ImgSH;
        } else {
            _ImgW = _ImgSW * _ImgRate;
            _ImgH = _ImgSH * _ImgRate;
        }
        _ViewImgW = parseFloat($(this._container).width());
        _ViewImgH = parseFloat($(this._container).height());
        moveX = e.clientX - downX;
        moveY = e.clientY - downY;
        _LeftX = imgLeft + moveX;
        _LeftY = imgTop + moveY;
        /**
         * 判断图片能否拖动
         * 1.图片的宽度或者高度同时不超过图片显示区域的位置，就不拖动
         * 2.图片宽度不超过div宽度高超过只能向上向下拖动
         * 3.图片高度不超过div高度宽超过只能左右拖动
         */
        if (_ViewImgW >= _ImgW && _ViewImgH >= _ImgH) {
            return false;
        }
        //横向和纵向计算拖动边界方法不同 
        if (this.rotateNum == 1) {
            //判断图片的宽度是否大于可视区域的宽度
            if (_ViewImgW > _ImgW) {
                _LeftX = imgLeft;
            } else {
                //判断左边允许拖拽的边界距离
                if (_LeftX > (_ImgW - _ImgSW) / 2) {
                    _LeftX = (_ImgW - _ImgSW) / 2;
                }
                //判断右边允许拖拽的边界距离
                if (_LeftX < ((_ImgW - _ImgSW) / 2 - (_ImgW - _ViewImgW))) {
                    _LeftX = (_ImgW - _ImgSW) / 2 - (_ImgW - _ViewImgW);
                }
            }
            //判断图片的宽度是否大于可视区域的宽度
            if (_ViewImgH > _ImgH) {
                _LeftY = imgTop;
            } else {
                //判断顶部允许拖拽的边界距离
                if (_LeftY > (_ImgH - _ImgSH) / 2) {
                    _LeftY = (_ImgH - _ImgSH) / 2;
                }
                //判断底部允许拖拽的边界距离
                if (_LeftY < ((_ImgH - _ImgSH) / 2 - (_ImgH - _ViewImgH))) {
                    _LeftY = (_ImgH - _ImgSH) / 2 - (_ImgH - _ViewImgH);
                }
            }
        } else if (this.rotateNum == 0) {
            //判断图片的宽度是否大于可视区域的宽度
            if (_ViewImgW > _ImgW) {
                _LeftX = imgLeft;
            } else {
                //判断左边允许拖拽的边界距离
                if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
                    //判断左边允许拖拽的边界距离
                    if (_LeftX > (_ImgW - _ImgSW) / 2) {
                        _LeftX = (_ImgW - _ImgSW) / 2;
                    }
                    //判断右边允许拖拽的边界距离
                    if (_LeftX < ((_ImgW - _ImgSW) / 2 - (_ImgW - _ViewImgW))) {
                        _LeftX = (_ImgW - _ImgSW) / 2 - (_ImgW - _ViewImgW);
                    }
                } else {
                    if (_LeftX > (_ImgW - _ImgSW) / 2 + (_ImgSW - _ImgSH) / 2) {
                        _LeftX = (_ImgW - _ImgSW) / 2 + (_ImgSW - _ImgSH) / 2;
                    }
                    //判断右边允许拖拽的边界距离
                    if (_LeftX < ((_ImgW - _ImgSW) / 2 - (_ImgW - _ViewImgW) + (_ImgSW - _ImgSH) / 2)) {
                        _LeftX = (_ImgW - _ImgSW) / 2 - (_ImgW - _ViewImgW) + (_ImgSW - _ImgSH) / 2;
                    }
                }
            }
            //判断图片的宽度是否大于可视区域的宽度
            if (_ViewImgH > _ImgH) {
                _LeftY = imgTop;
            } else {
                if ($ImageB.check.isIE6 || $ImageB.check.isIE7 || $ImageB.check.isIE8 || $ImageB.check.isIE9) {
                    //判断顶部允许拖拽的边界距离
                    if (_LeftY > (_ImgH - _ImgSH) / 2) {
                        _LeftY = (_ImgH - _ImgSH) / 2;
                    }
                    //判断底部允许拖拽的边界距离
                    if (_LeftY < ((_ImgH - _ImgSH) / 2 - (_ImgH - _ViewImgH))) {
                        _LeftY = (_ImgH - _ImgSH) / 2 - (_ImgH - _ViewImgH);
                    }
                } else {
                    //判断顶部允许拖拽的边界距离
                    if (_LeftY > (_ImgH - _ImgSH) / 2 - (_ImgSW - _ImgSH) / 2) {
                        _LeftY = (_ImgH - _ImgSH) / 2 - (_ImgSW - _ImgSH) / 2;
                    }
                    //判断底部允许拖拽的边界距离
                    if (_LeftY < ((_ImgH - _ImgSH) / 2 - (_ImgH - _ViewImgH) - (_ImgSW - _ImgSH) / 2)) {
                        _LeftY = (_ImgH - _ImgSH) / 2 - (_ImgH - _ViewImgH) - (_ImgSW - _ImgSH) / 2;
                    }
                }
            }
        }
        this._img.style.left = _LeftX + "px";
        this._img.style.top = _LeftY + "px";
    };
    //停止函数
    function stop() {
        $$E.removeEvent(document, "mousemove", this._mrMOVE);
        $$E.removeEvent(document, "mouseup", this._mrSTOP);
        if ($$B.ie) {
            var container = this._container;
            $$E.removeEvent(container, "losecapture", this._mrSTOP);
            container.releaseCapture();
        } else {
            $$E.removeEvent(window, "blur", this._mrSTOP);
        };
    };
    return function() {
        var options = arguments[1];
        if (!options || options.mouseRotate !== false) {
            //扩展钩子
            $$A.forEach(methods, function(method, name) {
                $$CE.addEvent(this, name, method);
            }, this);
        }
        init.apply(this, arguments);
    }
})();; /*!widget/UserHome.homework/homework.js*/
/*******************************************
 *
 * 交作业逻辑业务功能
 * @authors Du xin li
 * @date    2015-10-12
 * @update  2015-10-27
 * @version $Id$
 *
 *********************************************/
var homeWork = homeWork || {};
//分数图片路径
homeWork.path = '/static/img';
homeWork.url = '/Homework/ajaxStuComment';
(function(hm) {
    /**
     * 缩略图等比例缩放
     * @param  {Object} dom 任意子节点
     */
    hm.imageRate = function(dom) {
        if (!dom) {
            return false;
        }
        //判断多个的情况下---
        /*$(dom).each(function(){
                var samllBox_W = $(this).find('.homework-Thumbnails-img-list li').width();
                var samllBox_H = $(this).find('.homework-Thumbnails-img-list li').height();
                var imgNum = $(this).find('.homework-Thumbnails-img-list li').length;
                var Feedback_flag = $(this).find('.homework-Thumbnails-img-list').find('li').eq(imgNum-1).find('.homework-MaskLayer').length;
                $(this).find('.homework-Thumbnails-img-list li').each(function(index){
                     if( imgNum-1 == index && Feedback_flag == 0 ){
                          return false;
                     }
                     var img_W = $(this).find('img').width();
                     var img_H = $(this).find('img').height();
                     var rate=(samllBox_H/img_H>samllBox_W/img_W?samllBox_W/img_W:samllBox_H/img_H);
                     var _top = (samllBox_H - img_H*rate)/2 +"px";
                     $(this).find('img').width(img_W*rate);
                     $(this).find('img').height(img_H*rate);
                     $(this).find('img').css('marginTop', _top);
                })
        })*/
        $(dom).each(function() {
            var samllBox_W = $(this).find('.homework-Thumbnails-img-list li').width();
            var samllBox_H = $(this).find('.homework-Thumbnails-img-list li').height();
            var imgNum = $(this).find('.homework-Thumbnails-img-list li').length;
            var Feedback_flag = $(this).find('.homework-Thumbnails-img-list').find('li').eq(imgNum - 1).find('.homework-MaskLayer').length;
            $(this).find('.homework-Thumbnails-img-list li').each(function(index) {
                if (imgNum - 1 == index && Feedback_flag == 0) {
                    return false;
                }
                var that = $(this).find('img');
                var _imgs = new Image();
                //_imgs.src = that.attr('src');
                _imgs.onload = function() {
                    hm.showImg(this, samllBox_W, samllBox_H);
                    var _top = (samllBox_H - _imgs.height) / 2 + "px";
                    that.width(_imgs.width);
                    that.height(_imgs.height);
                    that.css('marginTop', _top);
                }
                _imgs.src = that.attr('src');
            })
        })
    }
    /**
     * 图片等比例缩放方法
     * @param  {html|string} img  预加载图片html元素
     * @param  {number} maxWidth  最大宽
     * @param  {number} maxHeight 最大高
     * @return {html|string}   预加载图片html元素       
     */
    hm.showImg = function(img, maxWidth, maxHeight) {
        var rate = (maxHeight / img.height > maxWidth / img.width ? maxWidth / img.width : maxHeight / img.height);
        img.width = img.width * rate;
        img.height = img.height * rate;
        return img;
    }
    /**
     * 作业反馈分数显示事件
     * @param  {number} score 分数d
     */
    hm.score = function(score) {
        if (!score) {
            return false;
        }
        //多个情况下的使用
        $(score).each(function() {
            var _score = $(this).attr('score');
            var _scoreArr = _score.split('');
            var _scoreHtml = '';
            $.each(_scoreArr, function(k, v) {
                _scoreHtml += '<img src="' + 'http://i.xueersi.com/static/img/' + v + '.png" alt="" />';
            });
            $(this).html(_scoreHtml)
        })
    }
    /**
     * 老师评语音播放的相关业务方法
     * @param  {Object} dom 任意子节点
     */
    hm.audio = function(dom) {
        //判断dom元素是否存在
        if (!dom) {
            return false;
        }
        //可能存在多个的情况
        $(dom).each(function() {
            var that = this,
                _audio = $(this).find('.homework-audio-btn-box')[0],
                _ReviewsBox = $(this).find('.homework-Reviews'),
                _audioBg = $(this).find('.homework-audio-box'),
                _audioTime = '';
            //判断是否有音频元素存在
            if (!_audio) {
                return false;
            }
            //默认的时候让所有的音频加载，否则在火狐ie等浏览器下由于jquery插件的存在导致onloadedmetadata事件不响应
            _audio.load();
            //音频加载完成后的一系列操作
            function duration() {
                if (_ReviewsBox.hasClass('homework-audio-loading')) {
                    return false;
                }
                var time = _audio.duration;
                //分钟
                var minute = time / 60;
                var minutes = parseInt(minute);
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                //秒
                var second = time % 60;
                var seconds = Math.round(second);
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                //总共时长的秒数
                var allTime = parseInt(minutes * 60 + seconds);
                //给语音按钮赋值时长
                _audioBg.find('em').text(allTime + ' "');
                _audioTime = parseFloat(_audioBg.find('em').text());
                /**
                 * 判断语音按钮的宽度
                 * 1-5秒宽度100  5-10秒宽度150  >10S的200
                 */
                if (_audioTime > 0 && _audioTime <= 5) {
                    _audioBg.width('100');
                } else if (_audioTime > 5 && _audioTime <= 10) {
                    _audioBg.width('150');
                } else {
                    _audioBg.width('200');
                }
                //判断语音的播放和停止
                $(that).off('click', '.homework-audio-box').on('click', '.homework-audio-box', function() {
                    var _Playing = _ReviewsBox.hasClass('homework-audio-playing');
                    if (!_Playing) {
                        $('body').find('.homework-Reviews').removeClass('homework-audio-playing').addClass('homework-audio-loading');
                        //播放时其他的音频都要重新加载停止
                        $('body').find('.homework-audio-btn-box').each(function(index) {
                            $('body').find('.homework-audio-btn-box')[index].load();
                        })
                        _ReviewsBox.addClass('homework-audio-playing')
                        _audio.play();
                    } else {
                        _ReviewsBox.removeClass('homework-audio-playing').addClass('homework-audio-loading');
                        _audio.load(); //重新加载和暂停是不同的
                    }
                    setTimeout(function() {
                        _ReviewsBox.removeClass('homework-audio-playing');
                    }, _audioTime + '000');
                })
            }
            _audio.onloadedmetadata = duration;
            /*setTimeout(function(){
                    
                 
               }, 1000)*/
        })
    }
    /**
     * 老师评语音播放的相关业务方法
     */
    hm.remind = function() {
        $('body').off('click', '.homework-remind-btn').on('click', '.homework-remind-btn', function() {
            var that = this;
            var _remindFlag = $(this).hasClass('homework-remind-disabled-btn');
            if (_remindFlag) {
                return false;
            } else {
                //提示弹出层显示
                popoverTips.show({
                    dom: that,
                    placement: 'bottom',
                    trigger: 'click',
                    con: '<div class="homework-remid-box">老师会快马加鞭地为你批改哦~</div>'
                });
                setTimeout(function() {
                    popoverTips.destroy(that);
                }, 3000)
                $(that).addClass('homework-remind-disabled-btn');
            }
        })
    }
    /**
     * 星星评分方法
     * @param  {Object} params 参数对象
     */
    hm.starScore = function(params) {
        params = $.extend({
            starBox: null, //星星评分的框架
            className: "on", //星星选中状态类
            scoreNum: null, //显示评分分数的类
            starIndex: 0 //开始默认选择星星
        }, params || {});
        //判断是否存在dom元素
        if (!(params.starBox)) {
            return false;
        }
        //多个的情况下依然可以使用
        $(params.starBox).each(function() {
            var that = this;
            var _starLi = $(this).find('li');
            var i = 0;
            var _starIndex = params.starIndex;
            fnPoint(_starIndex);
            //鼠标滑过星星的效果
            $(this).find('li').hover(function() {
                var _index = $(this).closest('ul').find('li').index(this);
                fnPoint(_index + 1);
            }, function() {
                fnPoint();
            });
            //点击后进行评分处理
            $(this).find('li').click(function() {
                var _index = $(this).closest('ul').find('li').index(this);
                _starIndex = _index + 1;
                $(that).find(params.scoreNum).text(_starIndex);
            })
            //评分处理
            function fnPoint(num) {
                var _iScore = num || _starIndex;
                for (i = 0; i < _starLi.length; i++) {
                    _starLi[i].className = i < _iScore ? params.className : "";
                }
            }
        })
    }
    /**
     * 提交评论方法
     * @param  {Object} dom 任意子节点
     */
    hm.submitComment = function(dom) {
        //判断dom元素是否存在
        if (!dom) {
            return false;
        }
        var _score = $(dom).find('.homework-star-score-num').text();
        var _cont = $.trim($(dom).find('.homework-comment').val());
        var _commitId = $(dom).find('.homework_commit_id').val();
        var _homeworkbox = $(dom).closest('.homework-image-box');
        //判断评星不能为空
        if (_score == 0 || !_score) {
            alert("评星不能为空！");
            return false;
        }
        $.ajax({
            url: hm.url,
            data: {
                score: _score, //评论分数
                cont: encodeURIComponent(_cont), //评论内容
                commitId: _commitId //提交作业自增id
            },
            type: 'post',
            dataType: 'json',
            beforeSend: function() {
                $(dom).find('.homework-submit-btn').addClass('homework-submit-btn-disabled');
            },
            success: function(data) {
                if (data.sign != 1) {
                    alert(data.msg);
                    return false;
                }
                //计算发布日期
                var _d = new Date(),
                    _year = _d.getFullYear(),
                    _month = _d.getMonth() + 1,
                    _day = _d.getDate();
                //月份和天数小于10的前面加0    
                if (_month < 10) {
                    _month = "0" + _month;
                }
                if (_day < 10) {
                    _day = "0" + _day;
                }
                //日期显示方式
                var _date = _year + "-" + _month + "-" + _day;
                //评论成功后删除可评论框
                var _html = '';
                _html += '<div class="homework-comment-box">\
                                <div class="homework-star pull-left">\
                                    <span class="pull-left">评价作业批改</span>\
                                    <div class="homework-star-area pull-left">\
                                        <ul class="pull-left">'
                    //判断选择几颗星
                for (var i = 0; i < _score; i++) {
                    _html += '<li class="on"></li>'
                }
                //未被选择的星星的样式
                for (var i = 0; i < (5 - _score); i++) {
                    _html += '<li></li>'
                }
                _html += '</ul>\
                                        <span class="homework-star-score-num">_score</span>\
                                    </div>\
                                </div>\
                                <p class="homework-comment">' + _cont + '</p>\
                                <p class="homework-date">' + _date + '</p>\
                            </div>'
                $(dom).remove();
                _homeworkbox.append(_html);
            },
            complete: function() {
                $(dom).find('.homework-submit-btn').removeClass('homework-submit-btn-disabled');
            }
        })
    }
    /**
     * 老师评语音播放的相关业务方法
     * @param  {Object} dom 任意子节点
     */
    hm.audioPlay = function(dom) {
        if (!dom) {
            return false;
        }
        //存在多个的情况下
        $(dom).each(function() {
            var that = this;
            var _audio = null; //$(that).find('.homework-audio-btn-style')[0];
            var hasVideo = !!(document.createElement('audio').canPlayType);
            var audio_val = null;
            //点击音频评语按钮效果
            $(that).find('.homework-audio-btn-click').click(function() {
                //点击的时候右侧的音频列表消失
                $(that).find('.homework-audio-list-box').hide('fast');
                $(that).find('.homework-audio').attr('flag', '0');
                //右侧音频列表消失之后删除homework-audio-list-box-display
                if ($(that).find('.homework-audio-list-box').hasClass('homework-audio-list-box-display')) {
                    $(that).find('.homework-audio-list-box').removeClass('homework-audio-list-box-display');
                }
                //判断是否正在播放
                var _Playing = $(this).hasClass('homework-audio-btn-playing');
                if (!_Playing) {
                    audio_val = $.trim($(this).data('val'));
                    var audio_url = $(this).data('audio');
                    $(that).find('.homework-audio-btn-click').removeClass('homework-audio-btn-playing');
                    //判断是否有相同的音频按钮
                    $(that).find('.homework-audio-btn-click').each(function() {
                        var current_audio_val = $.trim($(this).data('val'));
                        if (current_audio_val == audio_val) {
                            $(this).addClass('homework-audio-btn-playing');
                        }
                    })
                    //判断是否支持音频
                    if (hasVideo) {
                        var audio_url = $(this).data('audio');
                        var html = [
                            '<audio class="homework-audio-btn-style" controls="controls" Autoplay="Autoplay" src="' + audio_url + '"> </audio>'
                        ]
                        $(that).find('.homework-audio-btn-style').remove();
                        $(that).find('.homework-bigImg-box').prepend(html.join(''));
                        _audio = $(that).find('.homework-audio-btn-style')[0];
                        //播放结束
                        _audio.addEventListener('ended', function() {
                            //判断当前播放的是哪个按钮点击事件
                            $(that).find('.homework-audio-btn-click').each(function() {
                                var current_audio_val = $.trim($(this).data('val'));
                                if (current_audio_val == audio_val) {
                                    $(this).removeClass('homework-audio-btn-playing');
                                }
                            })
                            _audio.pause();
                        }, false);
                        //播放状态
                        _audio.addEventListener('playing', function() {
                            //判断当前播放的是哪个按钮点击事件
                            $(that).find('.homework-audio-btn-click').each(function() {
                                var current_audio_val = $.trim($(this).data('val'));
                                if (current_audio_val == audio_val) {
                                    if (!$(this).hasClass('homework-audio-btn-playing')) {
                                        $(this).addClass('homework-audio-btn-playing');
                                    }
                                }
                            })
                        }, false);
                    } else {
                        alert("当前浏览器版本过低，不支持语音播放。请更换浏览器或者升级至IE8以上的版本。");
                    }
                } else {
                    //console.log(2)
                    //已经在播放的情况下再次点击否可以暂停
                }
            })
            //音频列表展开收缩效果
            $(that).find('.homework-audio-disabled').click(function() {
                if ($('.homework-audio-list-box').find('li').length > 1) {
                    $('.homework-audio-list-box').toggle()
                }
            })
        })
    }
})(homeWork)
/**
 * 图片轮播插件
 * @param  {Object} params 参数对象
 */
$.fn.imagePage = function(params) {
    //判断dom元素是否存在
    if (!this) {
        return false;
    }
    params = $.extend({
        bigPic: null, //大图框架
        smallPic: null, //小图框架
        prev_btn: null, //小图左箭头
        next_btn: null, //小图右箭头
        delayTime: 800, //切换一张图片时间
        order: 0, //当前显示的图片（从0开始）
        ImageTransform: null, //旋转大图框架
        zoom: null, //放大按钮
        zoomout: null, //缩小按钮
        leftRotate: null, //向左旋转按钮
        rightRotate: null, //向右旋转按钮
        min_picnum: null, //小图显示数量
        isZoom: true, //是否存在旋转缩放
        lookEdit: null //查看改正中图片按钮
    }, params || {});
    var _this = this;
    var picsmall_num = $(this).find(params.smallPic).find('ul li').length;
    var picsmall_w = $(this).find(params.smallPic).find('ul li').outerWidth(true);
    var picsmall_h = $(this).find(params.smallPic).find('ul li').outerHeight(true);
    $(this).find(params.smallPic).find('ul').height(picsmall_num * picsmall_h);
    //判断作业反馈是否存在
    var Feedback_flag = $(this).find(params.smallPic).find('li').eq(0).find('.homework-MaskLayer').length;
    var pictime;
    var tpqhnum = 0; //当前选中图片的个数
    var xtqhnum = 0;
    var popnum = 0;
    var _tabnum = 0;
    var _src;
    var _islast = false;
    // $('.homework-feedback-all').click(function(){
    //  creatAudioList($(this).data('url').split(','))
    // })
    if (params.isZoom) {
        var _ImageTransform = '';
        var _container = $$(params.ImageTransform);
        var _options = {
            onPreLoad: function() {
                _container.style.backgroundImage = "";
            },
            onLoad: function() {
                _container.style.backgroundImage = "";
            },
            onError: function(err) {
                _container.style.backgroundImage = "";
                alert(err);
            }
        };
        _ImageTransform = new ImageTrans(_container, _options);
    }
    //点击小图切换大图
    $(this).find(params.smallPic).find('li').click(function() {
        _islast = true;
        tpqhnum = $(_this).find(params.smallPic).find('li').index(this);
        var audio_url = $(this).data('url').split('|')[$(this).data('url').split('|').length - 1].split(',');
        var data_audio = $(this).data('audio').split(',');
        show(tpqhnum);
        minshow(tpqhnum);
        creatAudioList(audio_url, data_audio);
        lookEditImg(tpqhnum);
    }).eq(params.order).trigger("click");
    //大图切换过程
    function show(tpqhnum) {
        //判断是否存在音频，如果存在音频在切换图片的时候就要停止音频的一系列操作，存在音频就存在homework-Reviews
        if ($(_this).find('.homework-Reviews')) {
            //删除所有播放按钮播放样式
            $(_this).find('.homework-audio-btn-click').removeClass('homework-audio-btn-playing');
            //audio音频停止播放，重新加载
            // $(_this).find('.homework-audio-btn-style').remove();
            /*//右侧的音频列表消失
           if( tpqhnum == 0 && ($(_this).find('.homework-audio-list-box').hasClass('homework-audio-list-box-display')) ){
                
           }else{
                if ($('.homework-audio').length>1) {
                    $('.homework-audio-list-box').show('fast');
                    $('.homework-audio').attr('flag', '1');
                }
                else{
                   $(_this).find('.homework-audio-list-box').hide('fast');
                   $(_this).find('.homework-audio').attr('flag','0');
                }
           }*/
        }
        if (tpqhnum == 0 && Feedback_flag == 0) {
            $(_this).find('.homework-Feedback').show();
            $(_this).find('.homework-Feedback-describe').show();
            $(_this).find('.ImageTransformJs').hide();
        } else {
            $(_this).find('.homework-Feedback').hide();
            $(_this).find('.homework-Feedback-describe').hide();
            $(_this).find('.ImageTransformJs').show();
            _src = $(_this).find(params.bigPic).find('li').eq(tpqhnum).find('img').attr('src');
            bigShow(_src)
        }
        $(_this).find(params.smallPic).find('li').eq(tpqhnum).addClass('homework-current').siblings(this).removeClass("homework-current");
    };
    //生成语音列表
    function creatAudioList(arr_audio, data_audio) {
        var url = [];
        if (!_islast) {
            url = arr_audio;
        } else {
            url = ['0'];
            for (var i = 0; i < data_audio.length; i++) {
                if (data_audio != '') {
                    url.push(data_audio[i]);
                }
            }
        }
        //判断是否正在播放语音,正在播放时移除自动播放属性并重载语音数据
        if ($('.homework-audio-btn-style').hasClass('homework-audio-playing')) {
            $('.homework-audio-btn-style').removeAttr('Autoplay').load();
        }
        var audio_ul = $('.homework-audio-list-box ul');
        audio_ul.html(' '); //语音列表置空
        for (var i = 1; i < url.length; i++) {
            var _html = '<li class="homework-audio-btn-click" data-audio ="' + url[i] + '" data-val="语音"' + i + '><i class="audio-icon"></i><em>语音' + i + '</em></li>'
            audio_ul.html(audio_ul.html() + _html)
        };
        //点击语音列表播放语音
        $('.homework-audio-btn-click').each(function() {
            $(this).click(function() {
                $('.homework-audio-btn-style').attr('src', $(this).data('audio')).attr('Autoplay', 'Autoplay').addClass('homework-audio-playing');
            })
        });
        //arr_audio数组第一个元素为图片信息,后续都是音频信息,若音频数量大于等于一个,将第一个音频写入audio标签;若大于2个,则显示列表,小喇叭按钮点亮
        if (url.length >= 2) {
            if ($('.homework-audio-btn-style').length > 0) {
                $('.homework-audio-btn-style').attr('src', audio_ul.find('li').eq(0).data('audio'))
            } else {
                $('.homework-bigImg-box').prepend('<audio class="homework-audio-btn-style" controls="controls" src="' + audio_ul.find('li').eq(0).data('audio') + '"> </audio>')
            }
            $('.homework-audio-btn-style').show();
            if (url.length == 2) {
                $('.homework-audio-list-box').hide();
                $('.homework-audio-disabled').removeClass('homework-audio');
            }
            if (url.length >= 3) {
                $('.homework-audio-list-box').show();
                $('.homework-audio-disabled').addClass('homework-audio');
            }
        } else {
            $('.homework-audio-btn-style').remove();
            $('.homework-audio-list-box').hide();
            $('.homework-audio-disabled').removeClass('homework-audio');
        }
        _islast = false;
    }
    //大图图片显示的效果
    function bigShow(url) {
        //判断是否存在缩放功能
        if (params.isZoom) {
            _ImageTransform.load(url);
        } else {
            $(_this).find(params.bigPic).find('.ImageTransformJs').remove();
            var _imgHtml = '<img style="position: absolute; border: 0px none; padding: 0px; margin: 0px;" src="' + url + '" class="ImageTransformJs" />';
            $(_this).find(params.bigPic).append(_imgHtml);
            /*
             *图片缩放居中
             */
            var maxWidth = $(_this).find(params.bigPic).width();
            var maxHeight = $(_this).find(params.bigPic).height();
            var imgWidth = $(_this).find(params.bigPic).find('.ImageTransformJs').width();
            var imgHeight = $(_this).find(params.bigPic).find('.ImageTransformJs').height();
            var rate = (maxHeight / imgHeight > maxWidth / imgWidth ? maxWidth / imgWidth : maxHeight / imgHeight);
            $(_this).find(params.bigPic).find('.ImageTransformJs').attr('_imgW', imgWidth).attr('_imgH', imgHeight);
            $(_this).find(params.bigPic).find('.ImageTransformJs').css({
                'width': imgWidth * rate,
                'height': imgHeight * rate,
                'left': (maxWidth - imgWidth * rate) / 2 + "px",
                'top': (maxHeight - imgHeight * rate) / 2 + "px"
            })
        }
    }
    //查看订正过程中的图片效果
    function lookEditImg(tpqhnum) {
        //查看是否有订正图片效果
        if ($(_this).find(params.lookEdit)) {
            //查看是否存在订正图片
            var dataUrl = $(_this).find(params.smallPic).find('li').eq(tpqhnum).data('url');
            //先清空要创建的html上一张下一张按钮
            $(_this).find(params.bigPic).find('.homework-lookEdit-btn').remove();
            //改正过程中的图片存在查看按钮为可编辑，反之相反
            if (dataUrl) {
                $(_this).find(params.lookEdit).addClass('homework-edit-btn');
                //查看订正之前如果存在homework-edit-two-click,先删除homework-edit-two-click，homework-edit-two-click是为了判断可编辑按钮是否已经展开订正图片
                if ($(_this).find('.homework-edit-btn').hasClass('homework-edit-two-click')) {
                    $(_this).find('.homework-edit-btn').removeClass('homework-edit-two-click');
                }
                //滑过提示弹层效果
                $(_this).closest('.homework-wrapper-container').find('.lookEditImg-popover').remove();
                var html = ['<div role="tooltip" class="popover fade top in lookEditImg-popover">',
                    '<div class="arrow" style="left: 50%;"></div>',
                    '<div class="popover-content">',
                    '<div class="lookEditImg-tips-box">点我查看订正过程中的图片</div>',
                    '</div>',
                    '</div>'
                ]
                $(_this).closest('.homework-wrapper-container').append(html.join(''));
                //滑过提示弹层效果
                $(_this).off('mouseover ', '.homework-edit-btn').on('mouseover', '.homework-edit-btn', function() {
                    //判断可编辑按钮是否是二次点击，当展开了订正图片后在滑过编辑按钮没有弹层提示
                    if ($(this).hasClass('homework-edit-two-click')) {
                        return false;
                    }
                    var lookEditImg_popover_w = $(_this).closest('.homework-wrapper-container').find('.lookEditImg-popover').width();
                    var container_w = $(_this).closest('.homework-wrapper-container').width();
                    var popover_left = container_w - lookEditImg_popover_w / 2 - 30 - 54 / 2;
                    if (popover_left < 0) {
                        popover_left = 0;
                    }
                    $(_this).closest('.homework-wrapper-container').find('.lookEditImg-popover').css('left', popover_left);
                    $(_this).closest('.homework-wrapper-container').find('.lookEditImg-popover').show();
                })
                $(_this).off('mouseout ', '.homework-edit-btn').on('mouseout', '.homework-edit-btn', function() {
                        $(_this).closest('.homework-wrapper-container').find('.lookEditImg-popover').hide();
                    })
                    //点击可编辑查看按钮
                $(_this).off('click', '.homework-edit-btn').on('click', '.homework-edit-btn', function() {
                    //判断可编辑按钮是否是二次点击，当展开了订正图片后在点击编辑按钮收缩订正图片，显示初始化的最后一张缩略图的图片
                    if ($(this).hasClass('homework-edit-two-click')) {
                        $(_this).find(params.smallPic).find('li').eq(tpqhnum).trigger("click");
                        return false;
                    }
                    $(this).addClass('homework-edit-two-click');
                    var lookEditNum = 0;
                    var arr_dataUrl = dataUrl.split('|');
                    var dataUrl_Num = arr_dataUrl.length;
                    //点击查看订正图片按钮，默认显示第一张图片
                    var arr_data_url_audio = arr_dataUrl[lookEditNum].split(',');
                    var imgUrl = arr_data_url_audio[0];
                    var imgAudio = arr_data_url_audio[1];
                    creatAudioList(arr_data_url_audio);
                    bigShow(imgUrl);
                    //显示上一张下一张点击按钮
                    $(_this).find(params.bigPic).find('.homework-lookEdit-btn').remove();
                    var lookEdit_html = '';
                    lookEdit_html += '<a href="javascript:void(0)" class="homework-lookEdit-btn homework-lookEdit-prev-btn"></a><a href="javascript:void(0)" class="homework-lookEdit-btn homework-lookEdit-next-btn"></a>';
                    $(_this).find(params.bigPic).append(lookEdit_html);
                    //判断上一张下一张是否可点击
                    if (dataUrl_Num > 1) {
                        $(_this).find(params.bigPic).find('.homework-lookEdit-next-btn').addClass('homework-lookEdit-next-active-btn');
                        //下一张点击按钮
                        $(_this).find(params.bigPic).find('.homework-lookEdit-next-btn').click(function() {
                            if (lookEditNum == dataUrl_Num - 1) {
                                lookEditNum = dataUrl_Num - 1;
                                return false;
                            };
                            lookEditNum++;
                            if (lookEditNum == dataUrl_Num - 1) {
                                $(_this).find(params.bigPic).find('.homework-lookEdit-next-btn').removeClass('homework-lookEdit-next-active-btn');
                            }
                            $(_this).find(params.bigPic).find('.homework-lookEdit-prev-btn').addClass('homework-lookEdit-prev-active-btn');
                            var arr_data_url_audio_next = arr_dataUrl[lookEditNum].split(',');
                            var imgUrl_next = arr_data_url_audio_next[0];
                            var imgAudio_next = arr_data_url_audio_next[1];
                            creatAudioList(arr_data_url_audio_next);
                            bigShow(imgUrl_next);
                        })
                        //上一张点击按钮
                        $(_this).find(params.bigPic).find('.homework-lookEdit-prev-btn').click(function() {
                            if (lookEditNum == 0) {
                                lookEditNum = 0;
                                return false;
                            };
                            lookEditNum--;
                            if (lookEditNum == 0) {
                                $(_this).find(params.bigPic).find('.homework-lookEdit-prev-btn').removeClass('homework-lookEdit-prev-active-btn');
                            }
                            $(_this).find(params.bigPic).find('.homework-lookEdit-next-btn').addClass('homework-lookEdit-next-active-btn');
                            var arr_data_url_audio_prev = arr_dataUrl[lookEditNum].split(',');
                            var imgUrl_prev = arr_data_url_audio_prev[0];
                            var imgAudio_prev = arr_data_url_audio_prev[1];
                            creatAudioList(arr_data_url_audio_prev);
                            bigShow(imgUrl_prev);
                        })
                    }
                })
            } else {
                $(_this).find(params.lookEdit).removeClass('homework-edit-btn');
            }
        }
    }
    //小图切换过程
    function minshow(tpqhnum) {
        var picsmall_h = $(_this).find(params.smallPic).find('ul li').outerHeight(true);
        if (picsmall_num > params.min_picnum) {
            $(_this).find(params.prev_btn).addClass('homework-prev-active').removeClass('homework-prev-disabled');
            $(_this).find(params.next_btn).addClass('homework-next-active').removeClass('homework-next-disabled');
            //判断滚动到最后一个时按钮置灰
            if (tpqhnum == picsmall_num - 1) {
                $(_this).find(params.next_btn).addClass('homework-next-disabled').removeClass('homework-next-active');
            }
            //判断滚动到最后一个时按钮置灰
            if (tpqhnum == 0) {
                $(_this).find(params.prev_btn).addClass('homework-prev-disabled').removeClass('homework-prev-active');
            }
            var _scrollnum = tpqhnum - params.min_picnum + 2;
            var _scrollH = -_scrollnum * picsmall_h;
            _tabnum = _scrollnum;
            if (tpqhnum < params.min_picnum - 1) {
                _scrollH = 0;
                _tabnum = 0;
            } else if (tpqhnum == picsmall_num - 1) {
                _scrollH = -(_scrollnum - 1) * picsmall_h;
                _tabnum = _scrollnum - 1;
            }
            $(_this).find(params.smallPic).find('ul').stop().animate({
                'top': _scrollH
            }, params.delayTime).attr('_topNum', _tabnum);
        } else {
            $(_this).find(params.prev_btn).addClass('homework-prev-disabled').removeClass('homework-prev-active');
            $(_this).find(params.next_btn).addClass('homework-next-disabled').removeClass('homework-next-active');
        }
    }
    //每个缩略图试卷对应一个音频，音频默认显示，但是不播放
    // function audioPage(audio){ 
    //  //判断是否存在音频
    //  var audioUrl = audio;
    //  var hasVideo = !!(document.createElement('audio').canPlayType);
    //  //改正图片中的音频为空时传过来的是''值不是空，所有必须重新判断
    //  if( audioUrl == "''" ){
    //            audioUrl = null;
    //  }
    //  //判断是否支持音频
    //  if( hasVideo ){
    //           if( audioUrl ){
    //            var audioHtml = [
    //                      '<audio class="homework-audio-btn-style" controls="controls" src="'+audioUrl+'"> </audio>'
    //                     ]
    //          $(_this).find('.homework-audio-btn-style').hide();
    //          $(_this).find('.homework-bigImg-box').prepend(audioHtml.join(''));
    //          $(_this).find('.homework-audio-btn-style').show();
    //      }else{
    //          $(_this).find('.homework-audio-btn-style').hide();
    //      } 
    //  }else{
    //      alert("当前浏览器版本过低，不支持语音播放。请更换浏览器或者升级至IE8以上的版本。");
    //  }
    // }  
    //大图左右切换    
    $(this).find(params.prev_btn).click(function() {
        if (picsmall_num > params.min_picnum) {
            if (tpqhnum == 0) {
                tpqhnum = 0;
                return false;
            };
            tpqhnum--;
            _islast = true;
            var _li = $(_this).find(params.smallPic).find('li').eq(tpqhnum);
            var audio_url = _li.data('url').split('|')[_li.data('url').split('|').length - 1].split(',');
            var data_audio = _li.data('audio').split(',');
            console.debug();
            show(tpqhnum);
            minshow(tpqhnum);
            creatAudioList(audio_url, data_audio);
            lookEditImg(tpqhnum);
        } else {
            return false;
        }
    })
    $(this).find(params.next_btn).click(function() {
        if (picsmall_num > params.min_picnum) {
            if (tpqhnum == picsmall_num - 1) {
                tpqhnum = picsmall_num - 1;
                return false;
            };
            tpqhnum++;
            _islast = true;
            var _li = $(_this).find(params.smallPic).find('li').eq(tpqhnum);
            var audio_url = _li.data('url').split('|')[_li.data('url').split('|').length - 1].split(',');
            var data_audio = _li.data('audio').split(',');
            show(tpqhnum);
            minshow(tpqhnum);
            creatAudioList(audio_url, data_audio);
            lookEditImg(tpqhnum);
        } else {
            return false;
        }
    })
    /**
     * (1)点击放大按钮放大大图
     * (2)判断是否存在缩放功能,如果存在缩放功能才有下面的一系列事件
     */
    if (params.isZoom) {
        $(this).find(params.zoom).click(function() {
            _ImageTransform.zoomin();
        })
        //点击缩小按钮缩小大图
        $(this).find(params.zoomout).click(function() {
            _ImageTransform.zoomout();
        })
        //点击向左旋转按钮旋转大图
        $(this).find(params.leftRotate).click(function() {
            _ImageTransform.left();
        })
        //点击向右旋转按钮旋转大图
        $(this).find(params.rightRotate).click(function() {
            _ImageTransform.right();
        })
    }
}; /*!widget/UserHome.homework/homework.nicescroll.min.js*/
/* jquery.nicescroll
-- version 3.5.0 BETA5
-- copyright 2011-12-13 InuYaksa*2013
-- licensed under the MIT
--
-- http://areaaperta.com/nicescroll
-- https://github.com/inuyaksa/jquery.nicescroll
--
*/
(function(jQuery) {
    // globals
    var domfocus = false;
    var mousefocus = false;
    var zoomactive = false;
    var tabindexcounter = 5000;
    var ascrailcounter = 2000;
    var globalmaxzindex = 0;
    var $ = jQuery; // sandbox
    // http://stackoverflow.com/questions/2161159/get-script-path
    function getScriptPath() {
        var scripts = document.getElementsByTagName('script');
        var path = scripts[scripts.length - 1].src.split('?')[0];
        return (path.split('/').length > 0) ? path.split('/').slice(0, -1).join('/') + '/' : '';
    }
    var scriptpath = getScriptPath();
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var setAnimationFrame = window.requestAnimationFrame || false;
    var clearAnimationFrame = window.cancelAnimationFrame || false;
    if (!setAnimationFrame) {
        for (var vx in vendors) {
            var v = vendors[vx];
            if (!setAnimationFrame) setAnimationFrame = window[v + 'RequestAnimationFrame'];
            if (!clearAnimationFrame) clearAnimationFrame = window[v + 'CancelAnimationFrame'] || window[v + 'CancelRequestAnimationFrame'];
        }
    }
    var clsMutationObserver = window.MutationObserver || window.WebKitMutationObserver || false;
    var _globaloptions = {
        zindex: "auto",
        cursoropacitymin: 0,
        cursoropacitymax: 1,
        cursorcolor: "#424242",
        cursorwidth: "5px",
        cursorborder: "1px solid #fff",
        cursorborderradius: "5px",
        scrollspeed: 60,
        mousescrollstep: 8 * 3,
        touchbehavior: false,
        hwacceleration: true,
        usetransition: true,
        boxzoom: false,
        dblclickzoom: true,
        gesturezoom: true,
        grabcursorenabled: true,
        autohidemode: true,
        background: "",
        iframeautoresize: true,
        cursorminheight: 32,
        preservenativescrolling: true,
        railoffset: false,
        bouncescroll: true,
        spacebarenabled: true,
        railpadding: {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        },
        disableoutline: true,
        horizrailenabled: true,
        railalign: "right",
        railvalign: "bottom",
        enabletranslate3d: true,
        enablemousewheel: true,
        enablekeyboard: true,
        smoothscroll: true,
        sensitiverail: true,
        enablemouselockapi: true,
        //      cursormaxheight:false,
        cursorfixedheight: false,
        directionlockdeadzone: 6,
        hidecursordelay: 400,
        nativeparentscrolling: true,
        enablescrollonselection: true,
        overflowx: true,
        overflowy: true,
        cursordragspeed: 0.3,
        rtlmode: false,
        cursordragontouch: false,
        oneaxismousemode: "auto"
    }
    var browserdetected = false;
    var getBrowserDetection = function() {
        if (browserdetected) return browserdetected;
        var domtest = document.createElement('DIV');
        var d = {};
        d.haspointerlock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
        d.isopera = ("opera" in window);
        d.isopera12 = (d.isopera && ("getUserMedia" in navigator));
        d.isoperamini = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");
        d.isie = (("all" in document) && ("attachEvent" in domtest) && !d.isopera);
        d.isieold = (d.isie && !("msInterpolationMode" in domtest.style)); // IE6 and older
        d.isie7 = d.isie && !d.isieold && (!("documentMode" in document) || (document.documentMode == 7));
        d.isie8 = d.isie && ("documentMode" in document) && (document.documentMode == 8);
        d.isie9 = d.isie && ("performance" in window) && (document.documentMode >= 9);
        d.isie10 = d.isie && ("performance" in window) && (document.documentMode >= 10);
        d.isie9mobile = /iemobile.9/i.test(navigator.userAgent); //wp 7.1 mango
        if (d.isie9mobile) d.isie9 = false;
        d.isie7mobile = (!d.isie9mobile && d.isie7) && /iemobile/i.test(navigator.userAgent); //wp 7.0
        d.ismozilla = ("MozAppearance" in domtest.style);
        d.iswebkit = ("WebkitAppearance" in domtest.style);
        d.ischrome = ("chrome" in window);
        d.ischrome22 = (d.ischrome && d.haspointerlock);
        d.ischrome26 = (d.ischrome && ("transition" in domtest.style)); // issue with transform detection (maintain prefix)
        d.cantouch = ("ontouchstart" in document.documentElement) || ("ontouchstart" in window); // detection for Chrome Touch Emulation
        d.hasmstouch = (window.navigator.msPointerEnabled || false); // IE10+ pointer events
        d.ismac = /^mac$/i.test(navigator.platform);
        d.isios = (d.cantouch && /iphone|ipad|ipod/i.test(navigator.platform));
        d.isios4 = ((d.isios) && !("seal" in Object));
        d.isandroid = (/android/i.test(navigator.userAgent));
        d.trstyle = false;
        d.hastransform = false;
        d.hastranslate3d = false;
        d.transitionstyle = false;
        d.hastransition = false;
        d.transitionend = false;
        var check = ['transform', 'msTransform', 'webkitTransform', 'MozTransform', 'OTransform'];
        for (var a = 0; a < check.length; a++) {
            if (typeof domtest.style[check[a]] != "undefined") {
                d.trstyle = check[a];
                break;
            }
        }
        d.hastransform = (d.trstyle != false);
        if (d.hastransform) {
            domtest.style[d.trstyle] = "translate3d(1px,2px,3px)";
            d.hastranslate3d = /translate3d/.test(domtest.style[d.trstyle]);
        }
        d.transitionstyle = false;
        d.prefixstyle = '';
        d.transitionend = false;
        var check = ['transition', 'webkitTransition', 'MozTransition', 'OTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
        var prefix = ['', '-webkit-', '-moz-', '-o-', '-o', '-ms-', '-khtml-'];
        var evs = ['transitionend', 'webkitTransitionEnd', 'transitionend', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'KhtmlTransitionEnd'];
        for (var a = 0; a < check.length; a++) {
            if (check[a] in domtest.style) {
                d.transitionstyle = check[a];
                d.prefixstyle = prefix[a];
                d.transitionend = evs[a];
                break;
            }
        }
        if (d.ischrome26) { // use always prefix
            d.prefixstyle = prefix[1];
        }
        d.hastransition = (d.transitionstyle);
        function detectCursorGrab() {
            var lst = ['-moz-grab', '-webkit-grab', 'grab'];
            if ((d.ischrome && !d.ischrome22) || d.isie) lst = []; // force setting for IE returns false positive and chrome cursor bug
            for (var a = 0; a < lst.length; a++) {
                var p = lst[a];
                domtest.style['cursor'] = p;
                if (domtest.style['cursor'] == p) return p;
            }
            return 'url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize'; // thank you google for custom cursor!
        }
        d.cursorgrabvalue = detectCursorGrab();
        d.hasmousecapture = ("setCapture" in domtest);
        d.hasMutationObserver = (clsMutationObserver !== false);
        domtest = null; //memory released
        browserdetected = d;
        return d;
    }
    var NiceScrollClass = function(myopt, me) {
        var self = this;
        this.version = '3.5.0 BETA5';
        this.name = 'nicescroll';
        this.me = me;
        this.opt = {
            doc: $("body"),
            win: false
        };
        $.extend(this.opt, _globaloptions);
        // Options for internal use
        this.opt.snapbackspeed = 80;
        if (myopt || false) {
            for (var a in self.opt) {
                if (typeof myopt[a] != "undefined") self.opt[a] = myopt[a];
            }
        }
        this.doc = self.opt.doc;
        this.iddoc = (this.doc && this.doc[0]) ? this.doc[0].id || '' : '';
        this.ispage = /BODY|HTML/.test((self.opt.win) ? self.opt.win[0].nodeName : this.doc[0].nodeName);
        this.haswrapper = (self.opt.win !== false);
        this.win = self.opt.win || (this.ispage ? $(window) : this.doc);
        this.docscroll = (this.ispage && !this.haswrapper) ? $(window) : this.win;
        this.body = $("body");
        this.viewport = false;
        this.isfixed = false;
        this.iframe = false;
        this.isiframe = ((this.doc[0].nodeName == 'IFRAME') && (this.win[0].nodeName == 'IFRAME'));
        this.istextarea = (this.win[0].nodeName == 'TEXTAREA');
        this.forcescreen = false; //force to use screen position on events
        this.canshowonmouseevent = (self.opt.autohidemode != "scroll");
        // Events jump table    
        this.onmousedown = false;
        this.onmouseup = false;
        this.onmousemove = false;
        this.onmousewheel = false;
        this.onkeypress = false;
        this.ongesturezoom = false;
        this.onclick = false;
        // Nicescroll custom events
        this.onscrollstart = false;
        this.onscrollend = false;
        this.onscrollcancel = false;
        this.onzoomin = false;
        this.onzoomout = false;
        // Let's start!  
        this.view = false;
        this.page = false;
        this.scroll = {
            x: 0,
            y: 0
        };
        this.scrollratio = {
            x: 0,
            y: 0
        };
        this.cursorheight = 20;
        this.scrollvaluemax = 0;
        this.checkrtlmode = false;
        this.scrollrunning = false;
        this.scrollmom = false;
        this.observer = false;
        this.observerremover = false; // observer on parent for remove detection
        do {
            this.id = "ascrail" + (ascrailcounter++);
        } while (document.getElementById(this.id));
        this.rail = false;
        this.cursor = false;
        this.cursorfreezed = false;
        this.selectiondrag = false;
        this.zoom = false;
        this.zoomactive = false;
        this.hasfocus = false;
        this.hasmousefocus = false;
        this.visibility = true;
        this.locked = false;
        this.hidden = false; // rails always hidden
        this.cursoractive = true; // user can interact with cursors
        this.overflowx = self.opt.overflowx;
        this.overflowy = self.opt.overflowy;
        this.nativescrollingarea = false;
        this.checkarea = 0;
        this.events = []; // event list for unbind
        this.saved = {};
        this.delaylist = {};
        this.synclist = {};
        this.lastdeltax = 0;
        this.lastdeltay = 0;
        this.detected = getBrowserDetection();
        var cap = $.extend({}, this.detected);
        this.canhwscroll = (cap.hastransform && self.opt.hwacceleration);
        this.ishwscroll = (this.canhwscroll && self.haswrapper);
        this.istouchcapable = false; // desktop devices with touch screen support
        //## Check Chrome desktop with touch support
        if (cap.cantouch && cap.ischrome && !cap.isios && !cap.isandroid) {
            this.istouchcapable = true;
            cap.cantouch = false; // parse normal desktop events
        }
        //## Firefox 18 nightly build (desktop) false positive (or desktop with touch support)
        if (cap.cantouch && cap.ismozilla && !cap.isios && !cap.isandroid) {
            this.istouchcapable = true;
            cap.cantouch = false; // parse normal desktop events
        }
        //## disable MouseLock API on user request
        if (!self.opt.enablemouselockapi) {
            cap.hasmousecapture = false;
            cap.haspointerlock = false;
        }
        this.delayed = function(name, fn, tm, lazy) {
            var dd = self.delaylist[name];
            var nw = (new Date()).getTime();
            if (!lazy && dd && dd.tt) return false;
            if (dd && dd.tt) clearTimeout(dd.tt);
            if (dd && dd.last + tm > nw && !dd.tt) {
                self.delaylist[name] = {
                    last: nw + tm,
                    tt: setTimeout(function() {
                        self.delaylist[name].tt = 0;
                        fn.call();
                    }, tm)
                }
            } else if (!dd || !dd.tt) {
                self.delaylist[name] = {
                    last: nw,
                    tt: 0
                }
                setTimeout(function() {
                    fn.call();
                }, 0);
            }
        };
        this.debounced = function(name, fn, tm) {
            var dd = self.delaylist[name];
            var nw = (new Date()).getTime();
            self.delaylist[name] = fn;
            if (!dd) {
                setTimeout(function() {
                    var fn = self.delaylist[name];
                    self.delaylist[name] = false;
                    fn.call();
                }, tm);
            }
        }
        this.synched = function(name, fn) {
            function requestSync() {
                if (self.onsync) return;
                setAnimationFrame(function() {
                    self.onsync = false;
                    for (name in self.synclist) {
                        var fn = self.synclist[name];
                        if (fn) fn.call(self);
                        self.synclist[name] = false;
                    }
                });
                self.onsync = true;
            };
            self.synclist[name] = fn;
            requestSync();
            return name;
        };
        this.unsynched = function(name) {
            if (self.synclist[name]) self.synclist[name] = false;
        }
        this.css = function(el, pars) { // save & set
            for (var n in pars) {
                self.saved.css.push([el, n, el.css(n)]);
                el.css(n, pars[n]);
            }
        };
        this.scrollTop = function(val) {
            return (typeof val == "undefined") ? self.getScrollTop() : self.setScrollTop(val);
        };
        this.scrollLeft = function(val) {
            return (typeof val == "undefined") ? self.getScrollLeft() : self.setScrollLeft(val);
        };
        // derived by by Dan Pupius www.pupius.net
        BezierClass = function(st, ed, spd, p1, p2, p3, p4) {
            this.st = st;
            this.ed = ed;
            this.spd = spd;
            this.p1 = p1 || 0;
            this.p2 = p2 || 1;
            this.p3 = p3 || 0;
            this.p4 = p4 || 1;
            this.ts = (new Date()).getTime();
            this.df = this.ed - this.st;
        };
        BezierClass.prototype = {
            B2: function(t) {
                return 3 * t * t * (1 - t)
            },
            B3: function(t) {
                return 3 * t * (1 - t) * (1 - t)
            },
            B4: function(t) {
                return (1 - t) * (1 - t) * (1 - t)
            },
            getNow: function() {
                var nw = (new Date()).getTime();
                var pc = 1 - ((nw - this.ts) / this.spd);
                var bz = this.B2(pc) + this.B3(pc) + this.B4(pc);
                return (pc < 0) ? this.ed : this.st + Math.round(this.df * bz);
            },
            update: function(ed, spd) {
                this.st = this.getNow();
                this.ed = ed;
                this.spd = spd;
                this.ts = (new Date()).getTime();
                this.df = this.ed - this.st;
                return this;
            }
        };
        if (this.ishwscroll) {
            // hw accelerated scroll
            this.doc.translate = {
                x: 0,
                y: 0,
                tx: "0px",
                ty: "0px"
            };
            //this one can help to enable hw accel on ios6 http://indiegamr.com/ios6-html-hardware-acceleration-changes-and-how-to-fix-them/
            if (cap.hastranslate3d && cap.isios) this.doc.css("-webkit-backface-visibility", "hidden"); // prevent flickering http://stackoverflow.com/questions/3461441/      
            //derived from http://stackoverflow.com/questions/11236090/
            function getMatrixValues() {
                var tr = self.doc.css(cap.trstyle);
                if (tr && (tr.substr(0, 6) == "matrix")) {
                    return tr.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, '').split(/, +/);
                }
                return false;
            }
            this.getScrollTop = function(last) {
                if (!last) {
                    var mtx = getMatrixValues();
                    if (mtx) return (mtx.length == 16) ? -mtx[13] : -mtx[5]; //matrix3d 16 on IE10
                    if (self.timerscroll && self.timerscroll.bz) return self.timerscroll.bz.getNow();
                }
                return self.doc.translate.y;
            };
            this.getScrollLeft = function(last) {
                if (!last) {
                    var mtx = getMatrixValues();
                    if (mtx) return (mtx.length == 16) ? -mtx[12] : -mtx[4]; //matrix3d 16 on IE10
                    if (self.timerscroll && self.timerscroll.bh) return self.timerscroll.bh.getNow();
                }
                return self.doc.translate.x;
            };
            if (document.createEvent) {
                this.notifyScrollEvent = function(el) {
                    var e = document.createEvent("UIEvents");
                    e.initUIEvent("scroll", false, true, window, 1);
                    el.dispatchEvent(e);
                };
            } else if (document.fireEvent) {
                this.notifyScrollEvent = function(el) {
                    var e = document.createEventObject();
                    el.fireEvent("onscroll");
                    e.cancelBubble = true;
                };
            } else {
                this.notifyScrollEvent = function(el, add) {}; //NOPE
            }
            if (cap.hastranslate3d && self.opt.enabletranslate3d) {
                this.setScrollTop = function(val, silent) {
                    self.doc.translate.y = val;
                    self.doc.translate.ty = (val * -1) + "px";
                    self.doc.css(cap.trstyle, "translate3d(" + self.doc.translate.tx + "," + self.doc.translate.ty + ",0px)");
                    if (!silent) self.notifyScrollEvent(self.win[0]);
                };
                this.setScrollLeft = function(val, silent) {
                    self.doc.translate.x = val;
                    self.doc.translate.tx = (val * -1) + "px";
                    self.doc.css(cap.trstyle, "translate3d(" + self.doc.translate.tx + "," + self.doc.translate.ty + ",0px)");
                    if (!silent) self.notifyScrollEvent(self.win[0]);
                };
            } else {
                this.setScrollTop = function(val, silent) {
                    self.doc.translate.y = val;
                    self.doc.translate.ty = (val * -1) + "px";
                    self.doc.css(cap.trstyle, "translate(" + self.doc.translate.tx + "," + self.doc.translate.ty + ")");
                    if (!silent) self.notifyScrollEvent(self.win[0]);
                };
                this.setScrollLeft = function(val, silent) {
                    self.doc.translate.x = val;
                    self.doc.translate.tx = (val * -1) + "px";
                    self.doc.css(cap.trstyle, "translate(" + self.doc.translate.tx + "," + self.doc.translate.ty + ")");
                    if (!silent) self.notifyScrollEvent(self.win[0]);
                };
            }
        } else {
            // native scroll
            this.getScrollTop = function() {
                return self.docscroll.scrollTop();
            };
            this.setScrollTop = function(val) {
                return self.docscroll.scrollTop(val);
            };
            this.getScrollLeft = function() {
                return self.docscroll.scrollLeft();
            };
            this.setScrollLeft = function(val) {
                return self.docscroll.scrollLeft(val);
            };
        }
        this.getTarget = function(e) {
            if (!e) return false;
            if (e.target) return e.target;
            if (e.srcElement) return e.srcElement;
            return false;
        };
        this.hasParent = function(e, id) {
            if (!e) return false;
            var el = e.target || e.srcElement || e || false;
            while (el && el.id != id) {
                el = el.parentNode || false;
            }
            return (el !== false);
        };
        function getZIndex() {
            var dom = self.win;
            if ("zIndex" in dom) return dom.zIndex(); // use jQuery UI method when available
            while (dom.length > 0) {
                if (dom[0].nodeType == 9) return false;
                var zi = dom.css('zIndex');
                if (!isNaN(zi) && zi != 0) return parseInt(zi);
                dom = dom.parent();
            }
            return false;
        };
        //inspired by http://forum.jquery.com/topic/width-includes-border-width-when-set-to-thin-medium-thick-in-ie
        var _convertBorderWidth = {
            "thin": 1,
            "medium": 3,
            "thick": 5
        };
        function getWidthToPixel(dom, prop, chkheight) {
            var wd = dom.css(prop);
            var px = parseFloat(wd);
            if (isNaN(px)) {
                px = _convertBorderWidth[wd] || 0;
                var brd = (px == 3) ? ((chkheight) ? (self.win.outerHeight() - self.win.innerHeight()) : (self.win.outerWidth() - self.win.innerWidth())) : 1; //DON'T TRUST CSS
                if (self.isie8 && px) px += 1;
                return (brd) ? px : 0;
            }
            return px;
        };
        this.getOffset = function() {
            if (self.isfixed) return {
                top: parseFloat(self.win.css('top')),
                left: parseFloat(self.win.css('left'))
            };
            if (!self.viewport) return self.win.offset();
            var ww = self.win.offset();
            var vp = self.viewport.offset();
            return {
                top: ww.top - vp.top + self.viewport.scrollTop(),
                left: ww.left - vp.left + self.viewport.scrollLeft()
            };
        };
        this.updateScrollBar = function(len) {
            if (self.ishwscroll) {
                self.rail.css({
                    height: self.win.innerHeight()
                });
                if (self.railh) self.railh.css({
                    width: self.win.innerWidth()
                });
            } else {
                var wpos = self.getOffset();
                var pos = {
                    top: wpos.top,
                    left: wpos.left
                };
                pos.top += getWidthToPixel(self.win, 'border-top-width', true);
                var brd = (self.win.outerWidth() - self.win.innerWidth()) / 2;
                pos.left += (self.rail.align) ? self.win.outerWidth() - getWidthToPixel(self.win, 'border-right-width') - self.rail.width : getWidthToPixel(self.win, 'border-left-width');
                var off = self.opt.railoffset;
                if (off) {
                    if (off.top) pos.top += off.top;
                    if (self.rail.align && off.left) pos.left += off.left;
                }
                if (!self.locked) self.rail.css({
                    top: pos.top,
                    left: pos.left,
                    height: (len) ? len.h : self.win.innerHeight()
                });
                if (self.zoom) {
                    self.zoom.css({
                        top: pos.top + 1,
                        left: (self.rail.align == 1) ? pos.left - 20 : pos.left + self.rail.width + 4
                    });
                }
                if (self.railh && !self.locked) {
                    var pos = {
                        top: wpos.top,
                        left: wpos.left
                    };
                    var y = (self.railh.align) ? pos.top + getWidthToPixel(self.win, 'border-top-width', true) + self.win.innerHeight() - self.railh.height : pos.top + getWidthToPixel(self.win, 'border-top-width', true);
                    var x = pos.left + getWidthToPixel(self.win, 'border-left-width');
                    self.railh.css({
                        top: y,
                        left: x,
                        width: self.railh.width
                    });
                }
            }
        };
        this.doRailClick = function(e, dbl, hr) {
            var fn, pg, cur, pos;
            //      if (self.rail.drag&&self.rail.drag.pt!=1) return;
            if (self.locked) return;
            //      if (self.rail.drag) return;
            //      self.cancelScroll();       
            self.cancelEvent(e);
            if (dbl) {
                fn = (hr) ? self.doScrollLeft : self.doScrollTop;
                cur = (hr) ? ((e.pageX - self.railh.offset().left - (self.cursorwidth / 2)) * self.scrollratio.x) : ((e.pageY - self.rail.offset().top - (self.cursorheight / 2)) * self.scrollratio.y);
                fn(cur);
            } else {
                //        console.log(e.pageY);
                fn = (hr) ? self.doScrollLeftBy : self.doScrollBy;
                cur = (hr) ? self.scroll.x : self.scroll.y;
                pos = (hr) ? e.pageX - self.railh.offset().left : e.pageY - self.rail.offset().top;
                pg = (hr) ? self.view.w : self.view.h;
                (cur >= pos) ? fn(pg): fn(-pg);
            }
        }
        self.hasanimationframe = (setAnimationFrame);
        self.hascancelanimationframe = (clearAnimationFrame);
        if (!self.hasanimationframe) {
            setAnimationFrame = function(fn) {
                return setTimeout(fn, 15 - Math.floor((+new Date) / 1000) % 16)
            }; // 1000/60)};
            clearAnimationFrame = clearInterval;
        } else if (!self.hascancelanimationframe) clearAnimationFrame = function() {
            self.cancelAnimationFrame = true
        };
        this.init = function() {
            self.saved.css = [];
            if (cap.isie7mobile) return true; // SORRY, DO NOT WORK!
            if (cap.isoperamini) return true; // SORRY, DO NOT WORK!
            if (cap.hasmstouch) self.css((self.ispage) ? $("html") : self.win, {
                '-ms-touch-action': 'none'
            });
            self.zindex = "auto";
            if (!self.ispage && self.opt.zindex == "auto") {
                self.zindex = getZIndex() || "auto";
            } else {
                self.zindex = self.opt.zindex;
            }
            if (!self.ispage && self.zindex != "auto") {
                if (self.zindex > globalmaxzindex) globalmaxzindex = self.zindex;
            }
            if (self.isie && self.zindex == 0 && self.opt.zindex == "auto") { // fix IE auto == 0
                self.zindex = "auto";
            }
            /*      
                  self.ispage = true;
                  self.haswrapper = true;
            //      self.win = $(window);
                  self.docscroll = $("body");
            //      self.doc = $("body");
            */
            if (!self.ispage || (!cap.cantouch && !cap.isieold && !cap.isie9mobile)) {
                var cont = self.docscroll;
                if (self.ispage) cont = (self.haswrapper) ? self.win : self.doc;
                if (!cap.isie9mobile) self.css(cont, {
                    'overflow-y': 'hidden'
                });
                if (self.ispage && cap.isie7) {
                    if (self.doc[0].nodeName == 'BODY') self.css($("html"), {
                        'overflow-y': 'hidden'
                    }); //IE7 double scrollbar issue
                    else if (self.doc[0].nodeName == 'HTML') self.css($("body"), {
                        'overflow-y': 'hidden'
                    }); //IE7 double scrollbar issue
                }
                if (cap.isios && !self.ispage && !self.haswrapper) self.css($("body"), {
                    "-webkit-overflow-scrolling": "touch"
                }); //force hw acceleration
                var cursor = $(document.createElement('div'));
                cursor.css({
                    position: "relative",
                    top: 0,
                    "float": "right",
                    width: self.opt.cursorwidth,
                    height: "0px",
                    'background-color': self.opt.cursorcolor,
                    border: self.opt.cursorborder,
                    'background-clip': 'padding-box',
                    '-webkit-border-radius': self.opt.cursorborderradius,
                    '-moz-border-radius': self.opt.cursorborderradius,
                    'border-radius': self.opt.cursorborderradius
                });
                cursor.hborder = parseFloat(cursor.outerHeight() - cursor.innerHeight());
                self.cursor = cursor;
                var rail = $(document.createElement('div'));
                rail.attr('id', self.id);
                rail.addClass('nicescroll-rails');
                var v, a, kp = ["left", "right"]; //"top","bottom"
                for (var n in kp) {
                    a = kp[n];
                    v = self.opt.railpadding[a];
                    (v) ? rail.css("padding-" + a, v + "px"): self.opt.railpadding[a] = 0;
                }
                rail.append(cursor);
                rail.width = Math.max(parseFloat(self.opt.cursorwidth), cursor.outerWidth()) + self.opt.railpadding['left'] + self.opt.railpadding['right'];
                rail.css({
                    width: rail.width + "px",
                    'zIndex': self.zindex,
                    "background": self.opt.background,
                    cursor: "default"
                });
                rail.visibility = true;
                rail.scrollable = true;
                rail.align = (self.opt.railalign == "left") ? 0 : 1;
                self.rail = rail;
                self.rail.drag = false;
                var zoom = false;
                if (self.opt.boxzoom && !self.ispage && !cap.isieold) {
                    zoom = document.createElement('div');
                    self.bind(zoom, "click", self.doZoom);
                    self.zoom = $(zoom);
                    self.zoom.css({
                        "cursor": "pointer",
                        'z-index': self.zindex,
                        'backgroundImage': 'url(' + scriptpath + 'zoomico.png)',
                        'height': 18,
                        'width': 18,
                        'backgroundPosition': '0px 0px'
                    });
                    if (self.opt.dblclickzoom) self.bind(self.win, "dblclick", self.doZoom);
                    if (cap.cantouch && self.opt.gesturezoom) {
                        self.ongesturezoom = function(e) {
                            if (e.scale > 1.5) self.doZoomIn(e);
                            if (e.scale < 0.8) self.doZoomOut(e);
                            return self.cancelEvent(e);
                        };
                        self.bind(self.win, "gestureend", self.ongesturezoom);
                    }
                }
                // init HORIZ
                self.railh = false;
                if (self.opt.horizrailenabled) {
                    self.css(cont, {
                        'overflow-x': 'hidden'
                    });
                    var cursor = $(document.createElement('div'));
                    cursor.css({
                        position: "relative",
                        top: 0,
                        height: self.opt.cursorwidth,
                        width: "0px",
                        'background-color': self.opt.cursorcolor,
                        border: self.opt.cursorborder,
                        'background-clip': 'padding-box',
                        '-webkit-border-radius': self.opt.cursorborderradius,
                        '-moz-border-radius': self.opt.cursorborderradius,
                        'border-radius': self.opt.cursorborderradius
                    });
                    cursor.wborder = parseFloat(cursor.outerWidth() - cursor.innerWidth());
                    self.cursorh = cursor;
                    var railh = $(document.createElement('div'));
                    railh.attr('id', self.id + '-hr');
                    railh.addClass('nicescroll-rails');
                    railh.height = Math.max(parseFloat(self.opt.cursorwidth), cursor.outerHeight());
                    railh.css({
                        height: railh.height + "px",
                        'zIndex': self.zindex,
                        "background": self.opt.background
                    });
                    railh.append(cursor);
                    railh.visibility = true;
                    railh.scrollable = true;
                    railh.align = (self.opt.railvalign == "top") ? 0 : 1;
                    self.railh = railh;
                    self.railh.drag = false;
                }
                //        
                if (self.ispage) {
                    rail.css({
                        position: "fixed",
                        top: "0px",
                        height: "100%"
                    });
                    (rail.align) ? rail.css({
                        right: "0px"
                    }): rail.css({
                        left: "0px"
                    });
                    self.body.append(rail);
                    if (self.railh) {
                        railh.css({
                            position: "fixed",
                            left: "0px",
                            width: "100%"
                        });
                        (railh.align) ? railh.css({
                            bottom: "0px"
                        }): railh.css({
                            top: "0px"
                        });
                        self.body.append(railh);
                    }
                } else {
                    if (self.ishwscroll) {
                        if (self.win.css('position') == 'static') self.css(self.win, {
                            'position': 'relative'
                        });
                        var bd = (self.win[0].nodeName == 'HTML') ? self.body : self.win;
                        if (self.zoom) {
                            self.zoom.css({
                                position: "absolute",
                                top: 1,
                                right: 0,
                                "margin-right": rail.width + 4
                            });
                            bd.append(self.zoom);
                        }
                        rail.css({
                            position: "absolute",
                            top: 0
                        });
                        (rail.align) ? rail.css({
                            right: 0
                        }): rail.css({
                            left: 0
                        });
                        bd.append(rail);
                        if (railh) {
                            railh.css({
                                position: "absolute",
                                left: 0,
                                bottom: 0
                            });
                            (railh.align) ? railh.css({
                                bottom: 0
                            }): railh.css({
                                top: 0
                            });
                            bd.append(railh);
                        }
                    } else {
                        self.isfixed = (self.win.css("position") == "fixed");
                        var rlpos = (self.isfixed) ? "fixed" : "absolute";
                        if (!self.isfixed) self.viewport = self.getViewport(self.win[0]);
                        if (self.viewport) {
                            self.body = self.viewport;
                            if ((/relative|absolute/.test(self.viewport.css("position"))) == false) self.css(self.viewport, {
                                "position": "relative"
                            });
                        }
                        rail.css({
                            position: rlpos
                        });
                        if (self.zoom) self.zoom.css({
                            position: rlpos
                        });
                        self.updateScrollBar();
                        self.body.append(rail);
                        if (self.zoom) self.body.append(self.zoom);
                        if (self.railh) {
                            railh.css({
                                position: rlpos
                            });
                            self.body.append(railh);
                        }
                    }
                    if (cap.isios) self.css(self.win, {
                        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                        '-webkit-touch-callout': 'none'
                    }); // prevent grey layer on click
                    if (cap.isie && self.opt.disableoutline) self.win.attr("hideFocus", "true"); // IE, prevent dotted rectangle on focused div
                    if (cap.iswebkit && self.opt.disableoutline) self.win.css({
                        "outline": "none"
                    });
                    //          if (cap.isopera&&self.opt.disableoutline) self.win.css({"outline":"0"});  // Opera to test [TODO]
                }
                if (self.opt.autohidemode === false) {
                    self.autohidedom = false;
                    self.rail.css({
                        opacity: self.opt.cursoropacitymax
                    });
                    if (self.railh) self.railh.css({
                        opacity: self.opt.cursoropacitymax
                    });
                } else if (self.opt.autohidemode === true) {
                    self.autohidedom = $().add(self.rail);
                    if (cap.isie8) self.autohidedom = self.autohidedom.add(self.cursor);
                    if (self.railh) self.autohidedom = self.autohidedom.add(self.railh);
                    if (self.railh && cap.isie8) self.autohidedom = self.autohidedom.add(self.cursorh);
                } else if (self.opt.autohidemode == "scroll") {
                    self.autohidedom = $().add(self.rail);
                    if (self.railh) self.autohidedom = self.autohidedom.add(self.railh);
                } else if (self.opt.autohidemode == "cursor") {
                    self.autohidedom = $().add(self.cursor);
                    if (self.railh) self.autohidedom = self.autohidedom.add(self.cursorh);
                } else if (self.opt.autohidemode == "hidden") {
                    self.autohidedom = false;
                    self.hide();
                    self.locked = false;
                }
                if (cap.isie9mobile) {
                    self.scrollmom = new ScrollMomentumClass2D(self);
                    /*
          var trace = function(msg) {
            var db = $("#debug");
            if (isNaN(msg)&&(typeof msg != "string")) {
              var x = [];
              for(var a in msg) {
                x.push(a+":"+msg[a]);
              }
              msg ="{"+x.join(",")+"}";
            }
            if (db.children().length>0) {
              db.children().eq(0).before("<div>"+msg+"</div>");
            } else {
              db.append("<div>"+msg+"</div>");
            }
          }
          window.onerror = function(msg,url,ln) {
            trace("ERR: "+msg+" at "+ln);
          }
*/
                    self.onmangotouch = function(e) {
                        var py = self.getScrollTop();
                        var px = self.getScrollLeft();
                        if ((py == self.scrollmom.lastscrolly) && (px == self.scrollmom.lastscrollx)) return true;
                        //            $("#debug").html('DRAG:'+py);
                        var dfy = py - self.mangotouch.sy;
                        var dfx = px - self.mangotouch.sx;
                        var df = Math.round(Math.sqrt(Math.pow(dfx, 2) + Math.pow(dfy, 2)));
                        if (df == 0) return;
                        var dry = (dfy < 0) ? -1 : 1;
                        var drx = (dfx < 0) ? -1 : 1;
                        var tm = +new Date();
                        if (self.mangotouch.lazy) clearTimeout(self.mangotouch.lazy);
                        if (((tm - self.mangotouch.tm) > 80) || (self.mangotouch.dry != dry) || (self.mangotouch.drx != drx)) {
                            //              trace('RESET+'+(tm-self.mangotouch.tm));
                            self.scrollmom.stop();
                            self.scrollmom.reset(px, py);
                            self.mangotouch.sy = py;
                            self.mangotouch.ly = py;
                            self.mangotouch.sx = px;
                            self.mangotouch.lx = px;
                            self.mangotouch.dry = dry;
                            self.mangotouch.drx = drx;
                            self.mangotouch.tm = tm;
                        } else {
                            self.scrollmom.stop();
                            self.scrollmom.update(self.mangotouch.sx - dfx, self.mangotouch.sy - dfy);
                            var gap = tm - self.mangotouch.tm;
                            self.mangotouch.tm = tm;
                            //              trace('MOVE:'+df+" - "+gap);
                            var ds = Math.max(Math.abs(self.mangotouch.ly - py), Math.abs(self.mangotouch.lx - px));
                            self.mangotouch.ly = py;
                            self.mangotouch.lx = px;
                            if (ds > 2) {
                                self.mangotouch.lazy = setTimeout(function() {
                                    //                  trace('END:'+ds+'+'+gap);                  
                                    self.mangotouch.lazy = false;
                                    self.mangotouch.dry = 0;
                                    self.mangotouch.drx = 0;
                                    self.mangotouch.tm = 0;
                                    self.scrollmom.doMomentum(30);
                                }, 100);
                            }
                        }
                    }
                    var top = self.getScrollTop();
                    var lef = self.getScrollLeft();
                    self.mangotouch = {
                        sy: top,
                        ly: top,
                        dry: 0,
                        sx: lef,
                        lx: lef,
                        drx: 0,
                        lazy: false,
                        tm: 0
                    };
                    self.bind(self.docscroll, "scroll", self.onmangotouch);
                } else {
                    if (cap.cantouch || self.istouchcapable || self.opt.touchbehavior || cap.hasmstouch) {
                        self.scrollmom = new ScrollMomentumClass2D(self);
                        self.ontouchstart = function(e) {
                            if (e.pointerType && e.pointerType != 2) return false;
                            if (!self.locked) {
                                if (cap.hasmstouch) {
                                    var tg = (e.target) ? e.target : false;
                                    while (tg) {
                                        var nc = $(tg).getNiceScroll();
                                        if ((nc.length > 0) && (nc[0].me == self.me)) break;
                                        if (nc.length > 0) return false;
                                        if ((tg.nodeName == 'DIV') && (tg.id == self.id)) break;
                                        tg = (tg.parentNode) ? tg.parentNode : false;
                                    }
                                }
                                self.cancelScroll();
                                var tg = self.getTarget(e);
                                if (tg) {
                                    var skp = (/INPUT/i.test(tg.nodeName)) && (/range/i.test(tg.type));
                                    if (skp) return self.stopPropagation(e);
                                }
                                if (!("clientX" in e) && ("changedTouches" in e)) {
                                    e.clientX = e.changedTouches[0].clientX;
                                    e.clientY = e.changedTouches[0].clientY;
                                }
                                if (self.forcescreen) {
                                    var le = e;
                                    var e = {
                                        "original": (e.original) ? e.original : e
                                    };
                                    e.clientX = le.screenX;
                                    e.clientY = le.screenY;
                                }
                                self.rail.drag = {
                                    x: e.clientX,
                                    y: e.clientY,
                                    sx: self.scroll.x,
                                    sy: self.scroll.y,
                                    st: self.getScrollTop(),
                                    sl: self.getScrollLeft(),
                                    pt: 2,
                                    dl: false
                                };
                                if (self.ispage || !self.opt.directionlockdeadzone) {
                                    self.rail.drag.dl = "f";
                                } else {
                                    var view = {
                                        w: $(window).width(),
                                        h: $(window).height()
                                    };
                                    var page = {
                                        w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                                        h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                                    }
                                    var maxh = Math.max(0, page.h - view.h);
                                    var maxw = Math.max(0, page.w - view.w);
                                    if (!self.rail.scrollable && self.railh.scrollable) self.rail.drag.ck = (maxh > 0) ? "v" : false;
                                    else if (self.rail.scrollable && !self.railh.scrollable) self.rail.drag.ck = (maxw > 0) ? "h" : false;
                                    else self.rail.drag.ck = false;
                                    if (!self.rail.drag.ck) self.rail.drag.dl = "f";
                                }
                                if (self.opt.touchbehavior && self.isiframe && cap.isie) {
                                    var wp = self.win.position();
                                    self.rail.drag.x += wp.left;
                                    self.rail.drag.y += wp.top;
                                }
                                self.hasmoving = false;
                                self.lastmouseup = false;
                                self.scrollmom.reset(e.clientX, e.clientY);
                                if (!cap.cantouch && !this.istouchcapable && !cap.hasmstouch) {
                                    var ip = (tg) ? /INPUT|SELECT|TEXTAREA/i.test(tg.nodeName) : false;
                                    if (!ip) {
                                        if (!self.ispage && cap.hasmousecapture) tg.setCapture();
                                        //                  return self.cancelEvent(e);
                                        return (self.opt.touchbehavior) ? self.cancelEvent(e) : self.stopPropagation(e);
                                    }
                                    if (/SUBMIT|CANCEL|BUTTON/i.test($(tg).attr('type'))) {
                                        pc = {
                                            "tg": tg,
                                            "click": false
                                        };
                                        self.preventclick = pc;
                                    }
                                }
                            }
                        };
                        self.ontouchend = function(e) {
                            if (e.pointerType && e.pointerType != 2) return false;
                            if (self.rail.drag && (self.rail.drag.pt == 2)) {
                                self.scrollmom.doMomentum();
                                self.rail.drag = false;
                                if (self.hasmoving) {
                                    self.hasmoving = false;
                                    self.lastmouseup = true;
                                    self.hideCursor();
                                    if (cap.hasmousecapture) document.releaseCapture();
                                    if (!cap.cantouch) return self.cancelEvent(e);
                                }
                            }
                        };
                        var moveneedoffset = (self.opt.touchbehavior && self.isiframe && !cap.hasmousecapture);
                        self.ontouchmove = function(e, byiframe) {
                            if (e.pointerType && e.pointerType != 2) return false;
                            if (self.rail.drag && (self.rail.drag.pt == 2)) {
                                if (cap.cantouch && (typeof e.original == "undefined")) return true; // prevent ios "ghost" events by clickable elements
                                self.hasmoving = true;
                                if (self.preventclick && !self.preventclick.click) {
                                    self.preventclick.click = self.preventclick.tg.onclick || false;
                                    self.preventclick.tg.onclick = self.onpreventclick;
                                }
                                var ev = $.extend({
                                    "original": e
                                }, e);
                                e = ev;
                                if (("changedTouches" in e)) {
                                    e.clientX = e.changedTouches[0].clientX;
                                    e.clientY = e.changedTouches[0].clientY;
                                }
                                if (self.forcescreen) {
                                    var le = e;
                                    var e = {
                                        "original": (e.original) ? e.original : e
                                    };
                                    e.clientX = le.screenX;
                                    e.clientY = le.screenY;
                                }
                                var ofx = ofy = 0;
                                if (moveneedoffset && !byiframe) {
                                    var wp = self.win.position();
                                    ofx = -wp.left;
                                    ofy = -wp.top;
                                }
                                var fy = e.clientY + ofy;
                                var my = (fy - self.rail.drag.y);
                                var fx = e.clientX + ofx;
                                var mx = (fx - self.rail.drag.x);
                                var ny = self.rail.drag.st - my;
                                if (self.ishwscroll && self.opt.bouncescroll) {
                                    if (ny < 0) {
                                        ny = Math.round(ny / 2);
                                        //                    fy = 0;
                                    } else if (ny > self.page.maxh) {
                                        ny = self.page.maxh + Math.round((ny - self.page.maxh) / 2);
                                        //                    fy = 0;
                                    }
                                } else {
                                    if (ny < 0) {
                                        ny = 0;
                                        fy = 0
                                    }
                                    if (ny > self.page.maxh) {
                                        ny = self.page.maxh;
                                        fy = 0
                                    }
                                }
                                if (self.railh && self.railh.scrollable) {
                                    var nx = self.rail.drag.sl - mx;
                                    if (self.ishwscroll && self.opt.bouncescroll) {
                                        if (nx < 0) {
                                            nx = Math.round(nx / 2);
                                            //                      fx = 0;
                                        } else if (nx > self.page.maxw) {
                                            nx = self.page.maxw + Math.round((nx - self.page.maxw) / 2);
                                            //                      fx = 0;
                                        }
                                    } else {
                                        if (nx < 0) {
                                            nx = 0;
                                            fx = 0
                                        }
                                        if (nx > self.page.maxw) {
                                            nx = self.page.maxw;
                                            fx = 0
                                        }
                                    }
                                }
                                var grabbed = false;
                                if (self.rail.drag.dl) {
                                    grabbed = true;
                                    if (self.rail.drag.dl == "v") nx = self.rail.drag.sl;
                                    else if (self.rail.drag.dl == "h") ny = self.rail.drag.st;
                                } else {
                                    var ay = Math.abs(my);
                                    var ax = Math.abs(mx);
                                    var dz = self.opt.directionlockdeadzone;
                                    if (self.rail.drag.ck == "v") {
                                        if (ay > dz && (ax <= (ay * 0.3))) {
                                            self.rail.drag = false;
                                            return true;
                                        } else if (ax > dz) {
                                            self.rail.drag.dl = "f";
                                            $("body").scrollTop($("body").scrollTop()); // stop iOS native scrolling (when active javascript has blocked)
                                        }
                                    } else if (self.rail.drag.ck == "h") {
                                        if (ax > dz && (ay <= (ax * 0.3))) {
                                            self.rail.drag = false;
                                            return true;
                                        } else if (ay > dz) {
                                            self.rail.drag.dl = "f";
                                            $("body").scrollLeft($("body").scrollLeft()); // stop iOS native scrolling (when active javascript has blocked)
                                        }
                                    }
                                }
                                self.synched("touchmove", function() {
                                    if (self.rail.drag && (self.rail.drag.pt == 2)) {
                                        if (self.prepareTransition) self.prepareTransition(0);
                                        if (self.rail.scrollable) self.setScrollTop(ny);
                                        self.scrollmom.update(fx, fy);
                                        if (self.railh && self.railh.scrollable) {
                                            self.setScrollLeft(nx);
                                            self.showCursor(ny, nx);
                                        } else {
                                            self.showCursor(ny);
                                        }
                                        if (cap.isie10) document.selection.clear();
                                    }
                                });
                                if (cap.ischrome && self.istouchcapable) grabbed = false; //chrome touch emulation doesn't like!
                                if (grabbed) return self.cancelEvent(e);
                            }
                        };
                    }
                    self.onmousedown = function(e, hronly) {
                        if (self.rail.drag && self.rail.drag.pt != 1) return;
                        if (self.locked) return self.cancelEvent(e);
                        self.cancelScroll();
                        self.rail.drag = {
                            x: e.clientX,
                            y: e.clientY,
                            sx: self.scroll.x,
                            sy: self.scroll.y,
                            pt: 1,
                            hr: (!!hronly)
                        };
                        var tg = self.getTarget(e);
                        if (!self.ispage && cap.hasmousecapture) tg.setCapture();
                        if (self.isiframe && !cap.hasmousecapture) {
                            self.saved["csspointerevents"] = self.doc.css("pointer-events");
                            self.css(self.doc, {
                                "pointer-events": "none"
                            });
                        }
                        return self.cancelEvent(e);
                    };
                    self.onmouseup = function(e) {
                        if (self.rail.drag) {
                            if (cap.hasmousecapture) document.releaseCapture();
                            if (self.isiframe && !cap.hasmousecapture) self.doc.css("pointer-events", self.saved["csspointerevents"]);
                            if (self.rail.drag.pt != 1) return;
                            self.rail.drag = false;
                            //if (!self.rail.active) self.hideCursor();
                            return self.cancelEvent(e);
                        }
                    };
                    self.onmousemove = function(e) {
                        if (self.rail.drag) {
                            if (self.rail.drag.pt != 1) return;
                            if (cap.ischrome && e.which == 0) return self.onmouseup(e);
                            self.cursorfreezed = true;
                            if (self.rail.drag.hr) {
                                self.scroll.x = self.rail.drag.sx + (e.clientX - self.rail.drag.x);
                                if (self.scroll.x < 0) self.scroll.x = 0;
                                var mw = self.scrollvaluemaxw;
                                if (self.scroll.x > mw) self.scroll.x = mw;
                            } else {
                                self.scroll.y = self.rail.drag.sy + (e.clientY - self.rail.drag.y);
                                if (self.scroll.y < 0) self.scroll.y = 0;
                                var my = self.scrollvaluemax;
                                if (self.scroll.y > my) self.scroll.y = my;
                            }
                            self.synched('mousemove', function() {
                                if (self.rail.drag && (self.rail.drag.pt == 1)) {
                                    self.showCursor();
                                    if (self.rail.drag.hr) self.doScrollLeft(Math.round(self.scroll.x * self.scrollratio.x), self.opt.cursordragspeed);
                                    else self.doScrollTop(Math.round(self.scroll.y * self.scrollratio.y), self.opt.cursordragspeed);
                                }
                            });
                            return self.cancelEvent(e);
                        }
                        /*              
                                    else {
                                      self.checkarea = true;
                                    }
                        */
                    };
                    if (cap.cantouch || self.opt.touchbehavior) {
                        self.onpreventclick = function(e) {
                            if (self.preventclick) {
                                self.preventclick.tg.onclick = self.preventclick.click;
                                self.preventclick = false;
                                return self.cancelEvent(e);
                            }
                        }
                        //            self.onmousedown = self.ontouchstart;            
                        //            self.onmouseup = self.ontouchend;
                        //            self.onmousemove = self.ontouchmove;
                        self.bind(self.win, "mousedown", self.ontouchstart); // control content dragging
                        self.onclick = (cap.isios) ? false : function(e) {
                            if (self.lastmouseup) {
                                self.lastmouseup = false;
                                return self.cancelEvent(e);
                            } else {
                                return true;
                            }
                        };
                        if (self.opt.grabcursorenabled && cap.cursorgrabvalue) {
                            self.css((self.ispage) ? self.doc : self.win, {
                                'cursor': cap.cursorgrabvalue
                            });
                            self.css(self.rail, {
                                'cursor': cap.cursorgrabvalue
                            });
                        }
                    } else {
                        function checkSelectionScroll(e) {
                            if (!self.selectiondrag) return;
                            if (e) {
                                var ww = self.win.outerHeight();
                                var df = (e.pageY - self.selectiondrag.top);
                                if (df > 0 && df < ww) df = 0;
                                if (df >= ww) df -= ww;
                                self.selectiondrag.df = df;
                            }
                            if (self.selectiondrag.df == 0) return;
                            var rt = -Math.floor(self.selectiondrag.df / 6) * 2;
                            //              self.doScrollTop(self.getScrollTop(true)+rt);
                            self.doScrollBy(rt);
                            self.debounced("doselectionscroll", function() {
                                checkSelectionScroll()
                            }, 50);
                        }
                        if ("getSelection" in document) { // A grade - Major browsers
                            self.hasTextSelected = function() {
                                return (document.getSelection().rangeCount > 0);
                            }
                        } else if ("selection" in document) { //IE9-
                            self.hasTextSelected = function() {
                                return (document.selection.type != "None");
                            }
                        } else {
                            self.hasTextSelected = function() { // no support
                                return false;
                            }
                        }
                        self.onselectionstart = function(e) {
                            if (self.ispage) return;
                            self.selectiondrag = self.win.offset();
                        }
                        self.onselectionend = function(e) {
                            self.selectiondrag = false;
                        }
                        self.onselectiondrag = function(e) {
                            if (!self.selectiondrag) return;
                            if (self.hasTextSelected()) self.debounced("selectionscroll", function() {
                                checkSelectionScroll(e)
                            }, 250);
                        }
                    }
                    if (cap.hasmstouch) {
                        self.css(self.rail, {
                            '-ms-touch-action': 'none'
                        });
                        self.css(self.cursor, {
                            '-ms-touch-action': 'none'
                        });
                        self.bind(self.win, "MSPointerDown", self.ontouchstart);
                        self.bind(document, "MSPointerUp", self.ontouchend);
                        self.bind(document, "MSPointerMove", self.ontouchmove);
                        self.bind(self.cursor, "MSGestureHold", function(e) {
                            e.preventDefault()
                        });
                        self.bind(self.cursor, "contextmenu", function(e) {
                            e.preventDefault()
                        });
                    }
                    if (this.istouchcapable) { //desktop with screen touch enabled
                        self.bind(self.win, "touchstart", self.ontouchstart);
                        self.bind(document, "touchend", self.ontouchend);
                        self.bind(document, "touchcancel", self.ontouchend);
                        self.bind(document, "touchmove", self.ontouchmove);
                    }
                    self.bind(self.cursor, "mousedown", self.onmousedown);
                    self.bind(self.cursor, "mouseup", self.onmouseup);
                    if (self.railh) {
                        self.bind(self.cursorh, "mousedown", function(e) {
                            self.onmousedown(e, true)
                        });
                        self.bind(self.cursorh, "mouseup", function(e) {
                            if (self.rail.drag && self.rail.drag.pt == 2) return;
                            self.rail.drag = false;
                            self.hasmoving = false;
                            self.hideCursor();
                            if (cap.hasmousecapture) document.releaseCapture();
                            return self.cancelEvent(e);
                        });
                    }
                    if (self.opt.cursordragontouch || !cap.cantouch && !self.opt.touchbehavior) {
                        self.rail.css({
                            "cursor": "default"
                        });
                        self.railh && self.railh.css({
                            "cursor": "default"
                        });
                        self.jqbind(self.rail, "mouseenter", function() {
                            if (self.canshowonmouseevent) self.showCursor();
                            self.rail.active = true;
                        });
                        self.jqbind(self.rail, "mouseleave", function() {
                            self.rail.active = false;
                            if (!self.rail.drag) self.hideCursor();
                        });
                        if (self.opt.sensitiverail) {
                            self.bind(self.rail, "click", function(e) {
                                self.doRailClick(e, false, false)
                            });
                            self.bind(self.rail, "dblclick", function(e) {
                                self.doRailClick(e, true, false)
                            });
                            self.bind(self.cursor, "click", function(e) {
                                self.cancelEvent(e)
                            });
                            self.bind(self.cursor, "dblclick", function(e) {
                                self.cancelEvent(e)
                            });
                        }
                        if (self.railh) {
                            self.jqbind(self.railh, "mouseenter", function() {
                                if (self.canshowonmouseevent) self.showCursor();
                                self.rail.active = true;
                            });
                            self.jqbind(self.railh, "mouseleave", function() {
                                self.rail.active = false;
                                if (!self.rail.drag) self.hideCursor();
                            });
                            if (self.opt.sensitiverail) {
                                self.bind(self.railh, "click", function(e) {
                                    self.doRailClick(e, false, true)
                                });
                                self.bind(self.railh, "dblclick", function(e) {
                                    self.doRailClick(e, true, true)
                                });
                                self.bind(self.cursorh, "click", function(e) {
                                    self.cancelEvent(e)
                                });
                                self.bind(self.cursorh, "dblclick", function(e) {
                                    self.cancelEvent(e)
                                });
                            }
                        }
                    }
                    if (!cap.cantouch && !self.opt.touchbehavior) {
                        self.bind((cap.hasmousecapture) ? self.win : document, "mouseup", self.onmouseup);
                        self.bind(document, "mousemove", self.onmousemove);
                        if (self.onclick) self.bind(document, "click", self.onclick);
                        if (!self.ispage && self.opt.enablescrollonselection) {
                            self.bind(self.win[0], "mousedown", self.onselectionstart);
                            self.bind(document, "mouseup", self.onselectionend);
                            self.bind(self.cursor, "mouseup", self.onselectionend);
                            if (self.cursorh) self.bind(self.cursorh, "mouseup", self.onselectionend);
                            self.bind(document, "mousemove", self.onselectiondrag);
                        }
                        if (self.zoom) {
                            self.jqbind(self.zoom, "mouseenter", function() {
                                if (self.canshowonmouseevent) self.showCursor();
                                self.rail.active = true;
                            });
                            self.jqbind(self.zoom, "mouseleave", function() {
                                self.rail.active = false;
                                if (!self.rail.drag) self.hideCursor();
                            });
                        }
                    } else {
                        self.bind((cap.hasmousecapture) ? self.win : document, "mouseup", self.ontouchend);
                        self.bind(document, "mousemove", self.ontouchmove);
                        if (self.onclick) self.bind(document, "click", self.onclick);
                        if (self.opt.cursordragontouch) {
                            self.bind(self.cursor, "mousedown", self.onmousedown);
                            self.bind(self.cursor, "mousemove", self.onmousemove);
                            self.cursorh && self.bind(self.cursorh, "mousedown", self.onmousedown);
                            self.cursorh && self.bind(self.cursorh, "mousemove", self.onmousemove);
                        }
                    }
                    if (self.opt.enablemousewheel) {
                        if (!self.isiframe) self.bind((cap.isie && self.ispage) ? document : self.win /*self.docscroll*/ , "mousewheel", self.onmousewheel);
                        self.bind(self.rail, "mousewheel", self.onmousewheel);
                        if (self.railh) self.bind(self.railh, "mousewheel", self.onmousewheelhr);
                    }
                    if (!self.ispage && !cap.cantouch && !(/HTML|BODY/.test(self.win[0].nodeName))) {
                        if (!self.win.attr("tabindex")) self.win.attr({
                            "tabindex": tabindexcounter++
                        });
                        self.jqbind(self.win, "focus", function(e) {
                            domfocus = (self.getTarget(e)).id || true;
                            self.hasfocus = true;
                            if (self.canshowonmouseevent) self.noticeCursor();
                        });
                        self.jqbind(self.win, "blur", function(e) {
                            domfocus = false;
                            self.hasfocus = false;
                        });
                        self.jqbind(self.win, "mouseenter", function(e) {
                            mousefocus = (self.getTarget(e)).id || true;
                            self.hasmousefocus = true;
                            if (self.canshowonmouseevent) self.noticeCursor();
                        });
                        self.jqbind(self.win, "mouseleave", function() {
                            mousefocus = false;
                            self.hasmousefocus = false;
                        });
                    };
                } // !ie9mobile
                //Thanks to http://www.quirksmode.org !!
                self.onkeypress = function(e) {
                    if (self.locked && self.page.maxh == 0) return true;
                    e = (e) ? e : window.e;
                    var tg = self.getTarget(e);
                    if (tg && /INPUT|TEXTAREA|SELECT|OPTION/.test(tg.nodeName)) {
                        var tp = tg.getAttribute('type') || tg.type || false;
                        if ((!tp) || !(/submit|button|cancel/i.tp)) return true;
                    }
                    if (self.hasfocus || (self.hasmousefocus && !domfocus) || (self.ispage && !domfocus && !mousefocus)) {
                        var key = e.keyCode;
                        if (self.locked && key != 27) return self.cancelEvent(e);
                        var ctrl = e.ctrlKey || false;
                        var shift = e.shiftKey || false;
                        var ret = false;
                        switch (key) {
                            case 38:
                            case 63233: //safari
                                self.doScrollBy(24 * 3);
                                ret = true;
                                break;
                            case 40:
                            case 63235: //safari
                                self.doScrollBy(-24 * 3);
                                ret = true;
                                break;
                            case 37:
                            case 63232: //safari
                                if (self.railh) {
                                    (ctrl) ? self.doScrollLeft(0): self.doScrollLeftBy(24 * 3);
                                    ret = true;
                                }
                                break;
                            case 39:
                            case 63234: //safari
                                if (self.railh) {
                                    (ctrl) ? self.doScrollLeft(self.page.maxw): self.doScrollLeftBy(-24 * 3);
                                    ret = true;
                                }
                                break;
                            case 33:
                            case 63276: // safari
                                self.doScrollBy(self.view.h);
                                ret = true;
                                break;
                            case 34:
                            case 63277: // safari
                                self.doScrollBy(-self.view.h);
                                ret = true;
                                break;
                            case 36:
                            case 63273: // safari                
                                (self.railh && ctrl) ? self.doScrollPos(0, 0): self.doScrollTo(0);
                                ret = true;
                                break;
                            case 35:
                            case 63275: // safari
                                (self.railh && ctrl) ? self.doScrollPos(self.page.maxw, self.page.maxh): self.doScrollTo(self.page.maxh);
                                ret = true;
                                break;
                            case 32:
                                if (self.opt.spacebarenabled) {
                                    (shift) ? self.doScrollBy(self.view.h): self.doScrollBy(-self.view.h);
                                    ret = true;
                                }
                                break;
                            case 27: // ESC
                                if (self.zoomactive) {
                                    self.doZoom();
                                    ret = true;
                                }
                                break;
                        }
                        if (ret) return self.cancelEvent(e);
                    }
                };
                if (self.opt.enablekeyboard) self.bind(document, (cap.isopera && !cap.isopera12) ? "keypress" : "keydown", self.onkeypress);
                self.bind(window, 'resize', self.lazyResize);
                self.bind(window, 'orientationchange', self.lazyResize);
                self.bind(window, "load", self.lazyResize);
                if (cap.ischrome && !self.ispage && !self.haswrapper) { //chrome void scrollbar bug - it persists in version 26
                    var tmp = self.win.attr("style");
                    var ww = parseFloat(self.win.css("width")) + 1;
                    self.win.css('width', ww);
                    self.synched("chromefix", function() {
                        self.win.attr("style", tmp)
                    });
                }
                // Trying a cross-browser implementation - good luck!
                self.onAttributeChange = function(e) {
                    self.lazyResize(250);
                }
                if (!self.ispage && !self.haswrapper) {
                    // redesigned MutationObserver for Chrome18+/Firefox14+/iOS6+ with support for: remove div, add/remove content
                    if (clsMutationObserver !== false) {
                        self.observer = new clsMutationObserver(function(mutations) {
                            mutations.forEach(self.onAttributeChange);
                        });
                        self.observer.observe(self.win[0], {
                            childList: true,
                            characterData: false,
                            attributes: true,
                            subtree: false
                        });
                        self.observerremover = new clsMutationObserver(function(mutations) {
                            mutations.forEach(function(mo) {
                                if (mo.removedNodes.length > 0) {
                                    for (var dd in mo.removedNodes) {
                                        if (mo.removedNodes[dd] == self.win[0]) return self.remove();
                                    }
                                }
                            });
                        });
                        self.observerremover.observe(self.win[0].parentNode, {
                            childList: true,
                            characterData: false,
                            attributes: false,
                            subtree: false
                        });
                    } else {
                        self.bind(self.win, (cap.isie && !cap.isie9) ? "propertychange" : "DOMAttrModified", self.onAttributeChange);
                        if (cap.isie9) self.win[0].attachEvent("onpropertychange", self.onAttributeChange); //IE9 DOMAttrModified bug
                        self.bind(self.win, "DOMNodeRemoved", function(e) {
                            if (e.target == self.win[0]) self.remove();
                        });
                    }
                }
                //
                if (!self.ispage && self.opt.boxzoom) self.bind(window, "resize", self.resizeZoom);
                if (self.istextarea) self.bind(self.win, "mouseup", self.lazyResize);
                self.checkrtlmode = true;
                self.lazyResize(30);
            }
            if (this.doc[0].nodeName == 'IFRAME') {
                function oniframeload(e) {
                    self.iframexd = false;
                    try {
                        var doc = 'contentDocument' in this ? this.contentDocument : this.contentWindow.document;
                        var a = doc.domain;
                    } catch (e) {
                        self.iframexd = true;
                        doc = false
                    };
                    if (self.iframexd) {
                        if ("console" in window) console.log('NiceScroll error: policy restriced iframe');
                        return true; //cross-domain - I can't manage this        
                    }
                    self.forcescreen = true;
                    if (self.isiframe) {
                        self.iframe = {
                            "doc": $(doc),
                            "html": self.doc.contents().find('html')[0],
                            "body": self.doc.contents().find('body')[0]
                        };
                        self.getContentSize = function() {
                            return {
                                w: Math.max(self.iframe.html.scrollWidth, self.iframe.body.scrollWidth),
                                h: Math.max(self.iframe.html.scrollHeight, self.iframe.body.scrollHeight)
                            }
                        }
                        self.docscroll = $(self.iframe.body); //$(this.contentWindow);
                    }
                    if (!cap.isios && self.opt.iframeautoresize && !self.isiframe) {
                        self.win.scrollTop(0); // reset position
                        self.doc.height(""); //reset height to fix browser bug
                        var hh = Math.max(doc.getElementsByTagName('html')[0].scrollHeight, doc.body.scrollHeight);
                        self.doc.height(hh);
                    }
                    self.lazyResize(30);
                    if (cap.isie7) self.css($(self.iframe.html), {
                        'overflow-y': 'hidden'
                    });
                    //self.css($(doc.body),{'overflow-y':'hidden'});
                    self.css($(self.iframe.body), {
                        'overflow-y': 'hidden'
                    });
                    if (cap.isios && self.haswrapper) {
                        self.css($(doc.body), {
                            '-webkit-transform': 'translate3d(0,0,0)'
                        }); // avoid iFrame content clipping - thanks to http://blog.derraab.com/2012/04/02/avoid-iframe-content-clipping-with-css-transform-on-ios/
                        console.log(1);
                    }
                    if ('contentWindow' in this) {
                        self.bind(this.contentWindow, "scroll", self.onscroll); //IE8 & minor
                    } else {
                        self.bind(doc, "scroll", self.onscroll);
                    }
                    if (self.opt.enablemousewheel) {
                        self.bind(doc, "mousewheel", self.onmousewheel);
                    }
                    if (self.opt.enablekeyboard) self.bind(doc, (cap.isopera) ? "keypress" : "keydown", self.onkeypress);
                    if (cap.cantouch || self.opt.touchbehavior) {
                        self.bind(doc, "mousedown", self.ontouchstart);
                        self.bind(doc, "mousemove", function(e) {
                            self.ontouchmove(e, true)
                        });
                        if (self.opt.grabcursorenabled && cap.cursorgrabvalue) self.css($(doc.body), {
                            'cursor': cap.cursorgrabvalue
                        });
                    }
                    self.bind(doc, "mouseup", self.ontouchend);
                    if (self.zoom) {
                        if (self.opt.dblclickzoom) self.bind(doc, 'dblclick', self.doZoom);
                        if (self.ongesturezoom) self.bind(doc, "gestureend", self.ongesturezoom);
                    }
                };
                if (this.doc[0].readyState && this.doc[0].readyState == "complete") {
                    setTimeout(function() {
                        oniframeload.call(self.doc[0], false)
                    }, 500);
                }
                self.bind(this.doc, "load", oniframeload);
            }
        };
        this.showCursor = function(py, px) {
            if (self.cursortimeout) {
                clearTimeout(self.cursortimeout);
                self.cursortimeout = 0;
            }
            if (!self.rail) return;
            if (self.autohidedom) {
                self.autohidedom.stop().css({
                    opacity: self.opt.cursoropacitymax
                });
                self.cursoractive = true;
            }
            if (!self.rail.drag || self.rail.drag.pt != 1) {
                if ((typeof py != "undefined") && (py !== false)) {
                    self.scroll.y = Math.round(py * 1 / self.scrollratio.y);
                }
                if (typeof px != "undefined") {
                    self.scroll.x = Math.round(px * 1 / self.scrollratio.x);
                }
            }
            self.cursor.css({
                height: self.cursorheight,
                top: self.scroll.y
            });
            if (self.cursorh) {
                (!self.rail.align && self.rail.visibility) ? self.cursorh.css({
                    width: self.cursorwidth,
                    left: self.scroll.x + self.rail.width
                }): self.cursorh.css({
                    width: self.cursorwidth,
                    left: self.scroll.x
                });
                self.cursoractive = true;
            }
            if (self.zoom) self.zoom.stop().css({
                opacity: self.opt.cursoropacitymax
            });
        };
        this.hideCursor = function(tm) {
            if (self.cursortimeout) return;
            if (!self.rail) return;
            if (!self.autohidedom) return;
            self.cursortimeout = setTimeout(function() {
                if (!self.rail.active || !self.showonmouseevent) {
                    self.autohidedom.stop().animate({
                        opacity: self.opt.cursoropacitymin
                    });
                    if (self.zoom) self.zoom.stop().animate({
                        opacity: self.opt.cursoropacitymin
                    });
                    self.cursoractive = false;
                }
                self.cursortimeout = 0;
            }, tm || self.opt.hidecursordelay);
        };
        this.noticeCursor = function(tm, py, px) {
            self.showCursor(py, px);
            if (!self.rail.active) self.hideCursor(tm);
        };
        this.getContentSize =
            (self.ispage) ?
            function() {
                return {
                    w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                    h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                }
            } : (self.haswrapper) ?
            function() {
                return {
                    w: self.doc.outerWidth() + parseInt(self.win.css('paddingLeft')) + parseInt(self.win.css('paddingRight')),
                    h: self.doc.outerHeight() + parseInt(self.win.css('paddingTop')) + parseInt(self.win.css('paddingBottom'))
                }
            } : function() {
                return {
                    w: self.docscroll[0].scrollWidth,
                    h: self.docscroll[0].scrollHeight
                }
            };
        this.onResize = function(e, page) {
            if (!self.win) return false;
            if (!self.haswrapper && !self.ispage) {
                if (self.win.css('display') == 'none') {
                    if (self.visibility) self.hideRail().hideRailHr();
                    return false;
                } else {
                    if (!self.hidden && !self.visibility) self.showRail().showRailHr();
                }
            }
            var premaxh = self.page.maxh;
            var premaxw = self.page.maxw;
            var preview = {
                h: self.view.h,
                w: self.view.w
            };
            self.view = {
                w: (self.ispage) ? self.win.width() : parseInt(self.win[0].clientWidth),
                h: (self.ispage) ? self.win.height() : parseInt(self.win[0].clientHeight)
            };
            self.page = (page) ? page : self.getContentSize();
            self.page.maxh = Math.max(0, self.page.h - self.view.h);
            self.page.maxw = Math.max(0, self.page.w - self.view.w);
            if ((self.page.maxh == premaxh) && (self.page.maxw == premaxw) && (self.view.w == preview.w)) {
                // test position        
                if (!self.ispage) {
                    var pos = self.win.offset();
                    if (self.lastposition) {
                        var lst = self.lastposition;
                        if ((lst.top == pos.top) && (lst.left == pos.left)) return self; //nothing to do            
                    }
                    self.lastposition = pos;
                } else {
                    return self; //nothing to do
                }
            }
            if (self.page.maxh == 0) {
                self.hideRail();
                self.scrollvaluemax = 0;
                self.scroll.y = 0;
                self.scrollratio.y = 0;
                self.cursorheight = 0;
                self.setScrollTop(0);
                self.rail.scrollable = false;
            } else {
                self.rail.scrollable = true;
            }
            if (self.page.maxw == 0) {
                self.hideRailHr();
                self.scrollvaluemaxw = 0;
                self.scroll.x = 0;
                self.scrollratio.x = 0;
                self.cursorwidth = 0;
                self.setScrollLeft(0);
                self.railh.scrollable = false;
            } else {
                self.railh.scrollable = true;
            }
            self.locked = (self.page.maxh == 0) && (self.page.maxw == 0);
            if (self.locked) {
                if (!self.ispage) self.updateScrollBar(self.view);
                return false;
            }
            if (!self.hidden && !self.visibility) {
                self.showRail().showRailHr();
            } else if (!self.hidden && !self.railh.visibility) self.showRailHr();
            if (self.istextarea && self.win.css('resize') && self.win.css('resize') != 'none') self.view.h -= 20;
            self.cursorheight = Math.min(self.view.h, Math.round(self.view.h * (self.view.h / self.page.h)));
            self.cursorheight = (self.opt.cursorfixedheight) ? self.opt.cursorfixedheight : Math.max(self.opt.cursorminheight, self.cursorheight);
            self.cursorwidth = Math.min(self.view.w, Math.round(self.view.w * (self.view.w / self.page.w)));
            self.cursorwidth = (self.opt.cursorfixedheight) ? self.opt.cursorfixedheight : Math.max(self.opt.cursorminheight, self.cursorwidth);
            self.scrollvaluemax = self.view.h - self.cursorheight - self.cursor.hborder;
            if (self.railh) {
                self.railh.width = (self.page.maxh > 0) ? (self.view.w - self.rail.width) : self.view.w;
                self.scrollvaluemaxw = self.railh.width - self.cursorwidth - self.cursorh.wborder;
            }
            if (self.checkrtlmode && self.railh) {
                self.checkrtlmode = false;
                if (self.opt.rtlmode && self.scroll.x == 0) self.setScrollLeft(self.page.maxw);
            }
            if (!self.ispage) self.updateScrollBar(self.view);
            self.scrollratio = {
                x: (self.page.maxw / self.scrollvaluemaxw),
                y: (self.page.maxh / self.scrollvaluemax)
            };
            var sy = self.getScrollTop();
            if (sy > self.page.maxh) {
                self.doScrollTop(self.page.maxh);
            } else {
                self.scroll.y = Math.round(self.getScrollTop() * (1 / self.scrollratio.y));
                self.scroll.x = Math.round(self.getScrollLeft() * (1 / self.scrollratio.x));
                if (self.cursoractive) self.noticeCursor();
            }
            if (self.scroll.y && (self.getScrollTop() == 0)) self.doScrollTo(Math.floor(self.scroll.y * self.scrollratio.y));
            return self;
        };
        this.resize = self.onResize;
        this.lazyResize = function(tm) { // event debounce
            tm = (isNaN(tm)) ? 30 : tm;
            self.delayed('resize', self.resize, tm);
            return self;
        }
        // modified by MDN https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/wheel
        function _modernWheelEvent(dom, name, fn, bubble) {
            self._bind(dom, name, function(e) {
                var e = (e) ? e : window.event;
                var event = {
                    original: e,
                    target: e.target || e.srcElement,
                    type: "wheel",
                    deltaMode: e.type == "MozMousePixelScroll" ? 0 : 1,
                    deltaX: 0,
                    deltaZ: 0,
                    preventDefault: function() {
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                        return false;
                    },
                    stopImmediatePropagation: function() {
                        (e.stopImmediatePropagation) ? e.stopImmediatePropagation(): e.cancelBubble = true;
                    }
                };
                if (name == "mousewheel") {
                    event.deltaY = -1 / 40 * e.wheelDelta;
                    e.wheelDeltaX && (event.deltaX = -1 / 40 * e.wheelDeltaX);
                } else {
                    event.deltaY = e.detail;
                }
                return fn.call(dom, event);
            }, bubble);
        };
        this._bind = function(el, name, fn, bubble) { // primitive bind
            self.events.push({
                e: el,
                n: name,
                f: fn,
                b: bubble,
                q: false
            });
            if (el.addEventListener) {
                el.addEventListener(name, fn, bubble || false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + name, fn);
            } else {
                el["on" + name] = fn;
            }
        };
        this.jqbind = function(dom, name, fn) { // use jquery bind for non-native events (mouseenter/mouseleave)
            self.events.push({
                e: dom,
                n: name,
                f: fn,
                q: true
            });
            $(dom).bind(name, fn);
        }
        this.bind = function(dom, name, fn, bubble) { // touch-oriented & fixing jquery bind
            var el = ("jquery" in dom) ? dom[0] : dom;
            if (name == 'mousewheel') {
                if ("onwheel" in self.win) {
                    self._bind(el, "wheel", fn, bubble || false);
                } else {
                    var wname = (typeof document.onmousewheel != "undefined") ? "mousewheel" : "DOMMouseScroll"; // older IE/Firefox
                    _modernWheelEvent(el, wname, fn, bubble || false);
                    if (wname == "DOMMouseScroll") _modernWheelEvent(el, "MozMousePixelScroll", fn, bubble || false); // Firefox legacy
                }
            } else if (el.addEventListener) {
                if (cap.cantouch && /mouseup|mousedown|mousemove/.test(name)) { // touch device support
                    var tt = (name == 'mousedown') ? 'touchstart' : (name == 'mouseup') ? 'touchend' : 'touchmove';
                    self._bind(el, tt, function(e) {
                        if (e.touches) {
                            if (e.touches.length < 2) {
                                var ev = (e.touches.length) ? e.touches[0] : e;
                                ev.original = e;
                                fn.call(this, ev);
                            }
                        } else if (e.changedTouches) {
                            var ev = e.changedTouches[0];
                            ev.original = e;
                            fn.call(this, ev);
                        } //blackberry
                    }, bubble || false);
                }
                self._bind(el, name, fn, bubble || false);
                if (cap.cantouch && name == "mouseup") self._bind(el, "touchcancel", fn, bubble || false);
            } else {
                self._bind(el, name, function(e) {
                    e = e || window.event || false;
                    if (e) {
                        if (e.srcElement) e.target = e.srcElement;
                    }
                    if (!("pageY" in e)) {
                        e.pageX = e.clientX + document.documentElement.scrollLeft;
                        e.pageY = e.clientY + document.documentElement.scrollTop;
                    }
                    return ((fn.call(el, e) === false) || bubble === false) ? self.cancelEvent(e) : true;
                });
            }
        };
        this._unbind = function(el, name, fn, bub) { // primitive unbind
            if (el.removeEventListener) {
                el.removeEventListener(name, fn, bub);
            } else if (el.detachEvent) {
                el.detachEvent('on' + name, fn);
            } else {
                el['on' + name] = false;
            }
        };
        this.unbindAll = function() {
            for (var a = 0; a < self.events.length; a++) {
                var r = self.events[a];
                (r.q) ? r.e.unbind(r.n, r.f): self._unbind(r.e, r.n, r.f, r.b);
            }
        };
        // Thanks to http://www.switchonthecode.com !!
        this.cancelEvent = function(e) {
            var e = (e.original) ? e.original : (e) ? e : window.event || false;
            if (!e) return false;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventManipulation) e.preventManipulation(); //IE10
            e.cancelBubble = true;
            e.cancel = true;
            e.returnValue = false;
            return false;
        };
        this.stopPropagation = function(e) {
            var e = (e.original) ? e.original : (e) ? e : window.event || false;
            if (!e) return false;
            if (e.stopPropagation) return e.stopPropagation();
            if (e.cancelBubble) e.cancelBubble = true;
            return false;
        }
        this.showRail = function() {
            if ((self.page.maxh != 0) && (self.ispage || self.win.css('display') != 'none')) {
                self.visibility = true;
                self.rail.visibility = true;
                self.rail.css('display', 'block');
            }
            return self;
        };
        this.showRailHr = function() {
            if (!self.railh) return self;
            if ((self.page.maxw != 0) && (self.ispage || self.win.css('display') != 'none')) {
                self.railh.visibility = true;
                self.railh.css('display', 'block');
            }
            return self;
        };
        this.hideRail = function() {
            self.visibility = false;
            self.rail.visibility = false;
            self.rail.css('display', 'none');
            return self;
        };
        this.hideRailHr = function() {
            if (!self.railh) return self;
            self.railh.visibility = false;
            self.railh.css('display', 'none');
            return self;
        };
        this.show = function() {
            self.hidden = false;
            self.locked = false;
            return self.showRail().showRailHr();
        };
        this.hide = function() {
            self.hidden = true;
            self.locked = true;
            return self.hideRail().hideRailHr();
        };
        this.toggle = function() {
            return (self.hidden) ? self.show() : self.hide();
        };
        this.remove = function() {
            self.stop();
            if (self.cursortimeout) clearTimeout(self.cursortimeout);
            self.doZoomOut();
            self.unbindAll();
            if (cap.isie9) self.win[0].detachEvent("onpropertychange", self.onAttributeChange); //IE9 DOMAttrModified bug
            if (self.observer !== false) self.observer.disconnect();
            if (self.observerremover !== false) self.observerremover.disconnect();
            self.events = null;
            if (self.cursor) {
                self.cursor.remove();
            }
            if (self.cursorh) {
                self.cursorh.remove();
            }
            if (self.rail) {
                self.rail.remove();
            }
            if (self.railh) {
                self.railh.remove();
            }
            if (self.zoom) {
                self.zoom.remove();
            }
            for (var a = 0; a < self.saved.css.length; a++) {
                var d = self.saved.css[a];
                d[0].css(d[1], (typeof d[2] == "undefined") ? '' : d[2]);
            }
            self.saved = false;
            self.me.data('__nicescroll', ''); //erase all traces
            // memory leak fixed by GianlucaGuarini - thanks a lot!
            // remove the current nicescroll from the $.nicescroll array & normalize array
            var lst = $.nicescroll;
            lst.each(function(i) {
                if (!this) return;
                if (this.id === self.id) {
                    delete lst[i];
                    for (var b = ++i; b < lst.length; b++, i++) lst[i] = lst[b];
                    lst.length--;
                    if (lst.length) delete lst[lst.length];
                }
            });
            for (var i in self) {
                self[i] = null;
                delete self[i];
            }
            self = null;
        };
        this.scrollstart = function(fn) {
            this.onscrollstart = fn;
            return self;
        }
        this.scrollend = function(fn) {
            this.onscrollend = fn;
            return self;
        }
        this.scrollcancel = function(fn) {
            this.onscrollcancel = fn;
            return self;
        }
        this.zoomin = function(fn) {
            this.onzoomin = fn;
            return self;
        }
        this.zoomout = function(fn) {
            this.onzoomout = fn;
            return self;
        }
        this.isScrollable = function(e) {
            var dom = (e.target) ? e.target : e;
            if (dom.nodeName == 'OPTION') return true;
            while (dom && (dom.nodeType == 1) && !(/BODY|HTML/.test(dom.nodeName))) {
                var dd = $(dom);
                var ov = dd.css('overflowY') || dd.css('overflowX') || dd.css('overflow') || '';
                if (/scroll|auto/.test(ov)) return (dom.clientHeight != dom.scrollHeight);
                dom = (dom.parentNode) ? dom.parentNode : false;
            }
            return false;
        };
        this.getViewport = function(me) {
            var dom = (me && me.parentNode) ? me.parentNode : false;
            while (dom && (dom.nodeType == 1) && !(/BODY|HTML/.test(dom.nodeName))) {
                var dd = $(dom);
                var ov = dd.css('overflowY') || dd.css('overflowX') || dd.css('overflow') || '';
                if ((/scroll|auto/.test(ov)) && (dom.clientHeight != dom.scrollHeight)) return dd;
                if (dd.getNiceScroll().length > 0) return dd;
                dom = (dom.parentNode) ? dom.parentNode : false;
            }
            return false;
        };
        function execScrollWheel(e, hr, chkscroll) {
            var px, py;
            var rt = 1;
            if (e.deltaMode == 0) { // PIXEL
                px = -Math.floor(e.deltaX * (self.opt.mousescrollstep / (18 * 3)));
                py = -Math.floor(e.deltaY * (self.opt.mousescrollstep / (18 * 3)));
            } else if (e.deltaMode == 1) { // LINE
                px = -Math.floor(e.deltaX * self.opt.mousescrollstep);
                py = -Math.floor(e.deltaY * self.opt.mousescrollstep);
            }
            if (hr && self.opt.oneaxismousemode && (px == 0) && py) { // classic vertical-only mousewheel + browser with x/y support 
                px = py;
                py = 0;
            }
            if (px) {
                if (self.scrollmom) {
                    self.scrollmom.stop()
                }
                self.lastdeltax += px;
                self.debounced("mousewheelx", function() {
                    var dt = self.lastdeltax;
                    self.lastdeltax = 0;
                    if (!self.rail.drag) {
                        self.doScrollLeftBy(dt)
                    }
                }, 120);
            }
            if (py) {
                if (self.opt.nativeparentscrolling && chkscroll && !self.ispage && !self.zoomactive) {
                    if (py < 0) {
                        if (self.getScrollTop() >= self.page.maxh) return true;
                    } else {
                        if (self.getScrollTop() <= 0) return true;
                    }
                }
                if (self.scrollmom) {
                    self.scrollmom.stop()
                }
                self.lastdeltay += py;
                self.debounced("mousewheely", function() {
                    var dt = self.lastdeltay;
                    self.lastdeltay = 0;
                    if (!self.rail.drag) {
                        self.doScrollBy(dt)
                    }
                }, 120);
            }
            e.stopImmediatePropagation();
            return e.preventDefault();
            //      return self.cancelEvent(e);
        };
        this.onmousewheel = function(e) {
            if (self.locked) {
                self.debounced("checkunlock", self.resize, 250);
                return true;
            }
            if (self.rail.drag) return self.cancelEvent(e);
            if (self.opt.oneaxismousemode == "auto" && e.deltaX != 0) self.opt.oneaxismousemode = false; // check two-axis mouse support (not very elegant)
            if (self.opt.oneaxismousemode && e.deltaX == 0) {
                if (!self.rail.scrollable) {
                    if (self.railh && self.railh.scrollable) {
                        return self.onmousewheelhr(e);
                    } else {
                        return true;
                    }
                }
            }
            var nw = +(new Date());
            var chk = false;
            if (self.opt.preservenativescrolling && ((self.checkarea + 600) < nw)) {
                //        self.checkarea = false;
                self.nativescrollingarea = self.isScrollable(e);
                chk = true;
            }
            self.checkarea = nw;
            if (self.nativescrollingarea) return true; // this isn't my business
            //      if (self.locked) return self.cancelEvent(e);
            var ret = execScrollWheel(e, false, chk);
            if (ret) self.checkarea = 0;
            return ret;
        };
        this.onmousewheelhr = function(e) {
            if (self.locked || !self.railh.scrollable) return true;
            if (self.rail.drag) return self.cancelEvent(e);
            var nw = +(new Date());
            var chk = false;
            if (self.opt.preservenativescrolling && ((self.checkarea + 600) < nw)) {
                //        self.checkarea = false;
                self.nativescrollingarea = self.isScrollable(e);
                chk = true;
            }
            self.checkarea = nw;
            if (self.nativescrollingarea) return true; // this isn't my business
            if (self.locked) return self.cancelEvent(e);
            return execScrollWheel(e, true, chk);
        };
        this.stop = function() {
            self.cancelScroll();
            if (self.scrollmon) self.scrollmon.stop();
            self.cursorfreezed = false;
            self.scroll.y = Math.round(self.getScrollTop() * (1 / self.scrollratio.y));
            self.noticeCursor();
            return self;
        };
        this.getTransitionSpeed = function(dif) {
            var sp = Math.round(self.opt.scrollspeed * 10);
            var ex = Math.min(sp, Math.round((dif / 20) * self.opt.scrollspeed));
            return (ex > 20) ? ex : 0;
        }
        if (!self.opt.smoothscroll) {
            this.doScrollLeft = function(x, spd) { //direct
                var y = self.getScrollTop();
                self.doScrollPos(x, y, spd);
            }
            this.doScrollTop = function(y, spd) { //direct
                var x = self.getScrollLeft();
                self.doScrollPos(x, y, spd);
            }
            this.doScrollPos = function(x, y, spd) { //direct
                var nx = (x > self.page.maxw) ? self.page.maxw : x;
                if (nx < 0) nx = 0;
                var ny = (y > self.page.maxh) ? self.page.maxh : y;
                if (ny < 0) ny = 0;
                self.synched('scroll', function() {
                    self.setScrollTop(ny);
                    self.setScrollLeft(nx);
                });
            }
            this.cancelScroll = function() {}; // direct
        } else if (self.ishwscroll && cap.hastransition && self.opt.usetransition) {
            this.prepareTransition = function(dif, istime) {
                var ex = (istime) ? ((dif > 20) ? dif : 0) : self.getTransitionSpeed(dif);
                var trans = (ex) ? cap.prefixstyle + 'transform ' + ex + 'ms ease-out' : '';
                if (!self.lasttransitionstyle || self.lasttransitionstyle != trans) {
                    self.lasttransitionstyle = trans;
                    self.doc.css(cap.transitionstyle, trans);
                }
                return ex;
            };
            this.doScrollLeft = function(x, spd) { //trans
                var y = (self.scrollrunning) ? self.newscrolly : self.getScrollTop();
                self.doScrollPos(x, y, spd);
            }
            this.doScrollTop = function(y, spd) { //trans
                var x = (self.scrollrunning) ? self.newscrollx : self.getScrollLeft();
                self.doScrollPos(x, y, spd);
            }
            this.doScrollPos = function(x, y, spd) { //trans
                var py = self.getScrollTop();
                var px = self.getScrollLeft();
                if (((self.newscrolly - py) * (y - py) < 0) || ((self.newscrollx - px) * (x - px) < 0)) self.cancelScroll(); //inverted movement detection      
                if (self.opt.bouncescroll == false) {
                    if (y < 0) y = 0;
                    else if (y > self.page.maxh) y = self.page.maxh;
                    if (x < 0) x = 0;
                    else if (x > self.page.maxw) x = self.page.maxw;
                }
                if (self.scrollrunning && x == self.newscrollx && y == self.newscrolly) return false;
                self.newscrolly = y;
                self.newscrollx = x;
                self.newscrollspeed = spd || false;
                if (self.timer) return false;
                self.timer = setTimeout(function() {
                    var top = self.getScrollTop();
                    var lft = self.getScrollLeft();
                    var dst = {};
                    dst.x = x - lft;
                    dst.y = y - top;
                    dst.px = lft;
                    dst.py = top;
                    var dd = Math.round(Math.sqrt(Math.pow(dst.x, 2) + Math.pow(dst.y, 2)));
                    //          var df = (self.newscrollspeed) ? self.newscrollspeed : dd;
                    var ms = (self.newscrollspeed && self.newscrollspeed > 1) ? self.newscrollspeed : self.getTransitionSpeed(dd);
                    if (self.newscrollspeed && self.newscrollspeed <= 1) ms *= self.newscrollspeed;
                    self.prepareTransition(ms, true);
                    if (self.timerscroll && self.timerscroll.tm) clearInterval(self.timerscroll.tm);
                    if (ms > 0) {
                        if (!self.scrollrunning && self.onscrollstart) {
                            var info = {
                                "type": "scrollstart",
                                "current": {
                                    "x": lft,
                                    "y": top
                                },
                                "request": {
                                    "x": x,
                                    "y": y
                                },
                                "end": {
                                    "x": self.newscrollx,
                                    "y": self.newscrolly
                                },
                                "speed": ms
                            };
                            self.onscrollstart.call(self, info);
                        }
                        if (cap.transitionend) {
                            if (!self.scrollendtrapped) {
                                self.scrollendtrapped = true;
                                self.bind(self.doc, cap.transitionend, self.onScrollEnd, false); //I have got to do something usefull!!
                            }
                        } else {
                            if (self.scrollendtrapped) clearTimeout(self.scrollendtrapped);
                            self.scrollendtrapped = setTimeout(self.onScrollEnd, ms); // simulate transitionend event
                        }
                        var py = top;
                        var px = lft;
                        self.timerscroll = {
                            bz: new BezierClass(py, self.newscrolly, ms, 0, 0, 0.58, 1),
                            bh: new BezierClass(px, self.newscrollx, ms, 0, 0, 0.58, 1)
                        };
                        if (!self.cursorfreezed) self.timerscroll.tm = setInterval(function() {
                            self.showCursor(self.getScrollTop(), self.getScrollLeft())
                        }, 60);
                    }
                    self.synched("doScroll-set", function() {
                        self.timer = 0;
                        if (self.scrollendtrapped) self.scrollrunning = true;
                        self.setScrollTop(self.newscrolly);
                        self.setScrollLeft(self.newscrollx);
                        if (!self.scrollendtrapped) self.onScrollEnd();
                    });
                }, 50);
            };
            this.cancelScroll = function() {
                if (!self.scrollendtrapped) return true;
                var py = self.getScrollTop();
                var px = self.getScrollLeft();
                self.scrollrunning = false;
                if (!cap.transitionend) clearTimeout(cap.transitionend);
                self.scrollendtrapped = false;
                self._unbind(self.doc, cap.transitionend, self.onScrollEnd);
                self.prepareTransition(0);
                self.setScrollTop(py); // fire event onscroll
                if (self.railh) self.setScrollLeft(px);
                if (self.timerscroll && self.timerscroll.tm) clearInterval(self.timerscroll.tm);
                self.timerscroll = false;
                self.cursorfreezed = false;
                //self.noticeCursor(false,py,px);
                self.showCursor(py, px);
                return self;
            };
            this.onScrollEnd = function() {
                if (self.scrollendtrapped) self._unbind(self.doc, cap.transitionend, self.onScrollEnd);
                self.scrollendtrapped = false;
                self.prepareTransition(0);
                if (self.timerscroll && self.timerscroll.tm) clearInterval(self.timerscroll.tm);
                self.timerscroll = false;
                var py = self.getScrollTop();
                var px = self.getScrollLeft();
                self.setScrollTop(py); // fire event onscroll        
                if (self.railh) self.setScrollLeft(px); // fire event onscroll left
                self.noticeCursor(false, py, px);
                self.cursorfreezed = false;
                if (py < 0) py = 0
                else if (py > self.page.maxh) py = self.page.maxh;
                if (px < 0) px = 0
                else if (px > self.page.maxw) px = self.page.maxw;
                if ((py != self.newscrolly) || (px != self.newscrollx)) return self.doScrollPos(px, py, self.opt.snapbackspeed);
                if (self.onscrollend && self.scrollrunning) {
                    var info = {
                        "type": "scrollend",
                        "current": {
                            "x": px,
                            "y": py
                        },
                        "end": {
                            "x": self.newscrollx,
                            "y": self.newscrolly
                        }
                    };
                    self.onscrollend.call(self, info);
                }
                self.scrollrunning = false;
            };
        } else {
            this.doScrollLeft = function(x, spd) { //no-trans
                var y = (self.scrollrunning) ? self.newscrolly : self.getScrollTop();
                self.doScrollPos(x, y, spd);
            }
            this.doScrollTop = function(y, spd) { //no-trans
                var x = (self.scrollrunning) ? self.newscrollx : self.getScrollLeft();
                self.doScrollPos(x, y, spd);
            }
            this.doScrollPos = function(x, y, spd) { //no-trans
                var y = ((typeof y == "undefined") || (y === false)) ? self.getScrollTop(true) : y;
                if ((self.timer) && (self.newscrolly == y) && (self.newscrollx == x)) return true;
                if (self.timer) clearAnimationFrame(self.timer);
                self.timer = 0;
                var py = self.getScrollTop();
                var px = self.getScrollLeft();
                if (((self.newscrolly - py) * (y - py) < 0) || ((self.newscrollx - px) * (x - px) < 0)) self.cancelScroll(); //inverted movement detection
                self.newscrolly = y;
                self.newscrollx = x;
                if (!self.bouncescroll || !self.rail.visibility) {
                    if (self.newscrolly < 0) {
                        self.newscrolly = 0;
                    } else if (self.newscrolly > self.page.maxh) {
                        self.newscrolly = self.page.maxh;
                    }
                }
                if (!self.bouncescroll || !self.railh.visibility) {
                    if (self.newscrollx < 0) {
                        self.newscrollx = 0;
                    } else if (self.newscrollx > self.page.maxw) {
                        self.newscrollx = self.page.maxw;
                    }
                }
                self.dst = {};
                self.dst.x = x - px;
                self.dst.y = y - py;
                self.dst.px = px;
                self.dst.py = py;
                var dst = Math.round(Math.sqrt(Math.pow(self.dst.x, 2) + Math.pow(self.dst.y, 2)));
                self.dst.ax = self.dst.x / dst;
                self.dst.ay = self.dst.y / dst;
                var pa = 0;
                var pe = dst;
                if (self.dst.x == 0) {
                    pa = py;
                    pe = y;
                    self.dst.ay = 1;
                    self.dst.py = 0;
                } else if (self.dst.y == 0) {
                    pa = px;
                    pe = x;
                    self.dst.ax = 1;
                    self.dst.px = 0;
                }
                var ms = self.getTransitionSpeed(dst);
                if (spd && spd <= 1) ms *= spd;
                if (ms > 0) {
                    self.bzscroll = (self.bzscroll) ? self.bzscroll.update(pe, ms) : new BezierClass(pa, pe, ms, 0, 1, 0, 1);
                } else {
                    self.bzscroll = false;
                }
                if (self.timer) return;
                if ((py == self.page.maxh && y >= self.page.maxh) || (px == self.page.maxw && x >= self.page.maxw)) self.checkContentSize();
                var sync = 1;
                function scrolling() {
                    if (self.cancelAnimationFrame) return true;
                    self.scrollrunning = true;
                    sync = 1 - sync;
                    if (sync) return (self.timer = setAnimationFrame(scrolling) || 1);
                    var done = 0;
                    var sc = sy = self.getScrollTop();
                    if (self.dst.ay) {
                        sc = (self.bzscroll) ? self.dst.py + (self.bzscroll.getNow() * self.dst.ay) : self.newscrolly;
                        var dr = sc - sy;
                        if ((dr < 0 && sc < self.newscrolly) || (dr > 0 && sc > self.newscrolly)) sc = self.newscrolly;
                        self.setScrollTop(sc);
                        if (sc == self.newscrolly) done = 1;
                    } else {
                        done = 1;
                    }
                    var scx = sx = self.getScrollLeft();
                    if (self.dst.ax) {
                        scx = (self.bzscroll) ? self.dst.px + (self.bzscroll.getNow() * self.dst.ax) : self.newscrollx;
                        var dr = scx - sx;
                        if ((dr < 0 && scx < self.newscrollx) || (dr > 0 && scx > self.newscrollx)) scx = self.newscrollx;
                        self.setScrollLeft(scx);
                        if (scx == self.newscrollx) done += 1;
                    } else {
                        done += 1;
                    }
                    if (done == 2) {
                        self.timer = 0;
                        self.cursorfreezed = false;
                        self.bzscroll = false;
                        self.scrollrunning = false;
                        if (sc < 0) sc = 0;
                        else if (sc > self.page.maxh) sc = self.page.maxh;
                        if (scx < 0) scx = 0;
                        else if (scx > self.page.maxw) scx = self.page.maxw;
                        if ((scx != self.newscrollx) || (sc != self.newscrolly)) self.doScrollPos(scx, sc);
                        else {
                            if (self.onscrollend) {
                                var info = {
                                    "type": "scrollend",
                                    "current": {
                                        "x": sx,
                                        "y": sy
                                    },
                                    "end": {
                                        "x": self.newscrollx,
                                        "y": self.newscrolly
                                    }
                                };
                                self.onscrollend.call(self, info);
                            }
                        }
                    } else {
                        self.timer = setAnimationFrame(scrolling) || 1;
                    }
                };
                self.cancelAnimationFrame = false;
                self.timer = 1;
                if (self.onscrollstart && !self.scrollrunning) {
                    var info = {
                        "type": "scrollstart",
                        "current": {
                            "x": px,
                            "y": py
                        },
                        "request": {
                            "x": x,
                            "y": y
                        },
                        "end": {
                            "x": self.newscrollx,
                            "y": self.newscrolly
                        },
                        "speed": ms
                    };
                    self.onscrollstart.call(self, info);
                }
                scrolling();
                if ((py == self.page.maxh && y >= py) || (px == self.page.maxw && x >= px)) self.checkContentSize();
                self.noticeCursor();
            };
            this.cancelScroll = function() {
                if (self.timer) clearAnimationFrame(self.timer);
                self.timer = 0;
                self.bzscroll = false;
                self.scrollrunning = false;
                return self;
            };
        }
        this.doScrollBy = function(stp, relative) {
            var ny = 0;
            if (relative) {
                ny = Math.floor((self.scroll.y - stp) * self.scrollratio.y)
            } else {
                var sy = (self.timer) ? self.newscrolly : self.getScrollTop(true);
                ny = sy - stp;
            }
            if (self.bouncescroll) {
                var haf = Math.round(self.view.h / 2);
                if (ny < -haf) ny = -haf
                else if (ny > (self.page.maxh + haf)) ny = (self.page.maxh + haf);
            }
            self.cursorfreezed = false;
            py = self.getScrollTop(true);
            if (ny < 0 && py <= 0) return self.noticeCursor();
            else if (ny > self.page.maxh && py >= self.page.maxh) {
                self.checkContentSize();
                return self.noticeCursor();
            }
            self.doScrollTop(ny);
        };
        this.doScrollLeftBy = function(stp, relative) {
            var nx = 0;
            if (relative) {
                nx = Math.floor((self.scroll.x - stp) * self.scrollratio.x)
            } else {
                var sx = (self.timer) ? self.newscrollx : self.getScrollLeft(true);
                nx = sx - stp;
            }
            if (self.bouncescroll) {
                var haf = Math.round(self.view.w / 2);
                if (nx < -haf) nx = -haf
                else if (nx > (self.page.maxw + haf)) nx = (self.page.maxw + haf);
            }
            self.cursorfreezed = false;
            px = self.getScrollLeft(true);
            if (nx < 0 && px <= 0) return self.noticeCursor();
            else if (nx > self.page.maxw && px >= self.page.maxw) return self.noticeCursor();
            self.doScrollLeft(nx);
        };
        this.doScrollTo = function(pos, relative) {
            var ny = (relative) ? Math.round(pos * self.scrollratio.y) : pos;
            if (ny < 0) ny = 0
            else if (ny > self.page.maxh) ny = self.page.maxh;
            self.cursorfreezed = false;
            self.doScrollTop(pos);
        };
        this.checkContentSize = function() {
            var pg = self.getContentSize();
            if ((pg.h != self.page.h) || (pg.w != self.page.w)) self.resize(false, pg);
        };
        self.onscroll = function(e) {
            if (self.rail.drag) return;
            if (!self.cursorfreezed) {
                self.synched('scroll', function() {
                    self.scroll.y = Math.round(self.getScrollTop() * (1 / self.scrollratio.y));
                    if (self.railh) self.scroll.x = Math.round(self.getScrollLeft() * (1 / self.scrollratio.x));
                    self.noticeCursor();
                });
            }
        };
        self.bind(self.docscroll, "scroll", self.onscroll);
        this.doZoomIn = function(e) {
            if (self.zoomactive) return;
            self.zoomactive = true;
            self.zoomrestore = {
                style: {}
            };
            var lst = ['position', 'top', 'left', 'zIndex', 'backgroundColor', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
            var win = self.win[0].style;
            for (var a in lst) {
                var pp = lst[a];
                self.zoomrestore.style[pp] = (typeof win[pp] != "undefined") ? win[pp] : '';
            }
            self.zoomrestore.style.width = self.win.css('width');
            self.zoomrestore.style.height = self.win.css('height');
            self.zoomrestore.padding = {
                w: self.win.outerWidth() - self.win.width(),
                h: self.win.outerHeight() - self.win.height()
            };
            if (cap.isios4) {
                self.zoomrestore.scrollTop = $(window).scrollTop();
                $(window).scrollTop(0);
            }
            self.win.css({
                "position": (cap.isios4) ? "absolute" : "fixed",
                "top": 0,
                "left": 0,
                "z-index": globalmaxzindex + 100,
                "margin": "0px"
            });
            var bkg = self.win.css("backgroundColor");
            if (bkg == "" || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(bkg)) self.win.css("backgroundColor", "#fff");
            self.rail.css({
                "z-index": globalmaxzindex + 101
            });
            self.zoom.css({
                "z-index": globalmaxzindex + 102
            });
            self.zoom.css('backgroundPosition', '0px -18px');
            self.resizeZoom();
            if (self.onzoomin) self.onzoomin.call(self);
            return self.cancelEvent(e);
        };
        this.doZoomOut = function(e) {
            if (!self.zoomactive) return;
            self.zoomactive = false;
            self.win.css("margin", "");
            self.win.css(self.zoomrestore.style);
            if (cap.isios4) {
                $(window).scrollTop(self.zoomrestore.scrollTop);
            }
            self.rail.css({
                "z-index": self.zindex
            });
            self.zoom.css({
                "z-index": self.zindex
            });
            self.zoomrestore = false;
            self.zoom.css('backgroundPosition', '0px 0px');
            self.onResize();
            if (self.onzoomout) self.onzoomout.call(self);
            return self.cancelEvent(e);
        };
        this.doZoom = function(e) {
            return (self.zoomactive) ? self.doZoomOut(e) : self.doZoomIn(e);
        };
        this.resizeZoom = function() {
            if (!self.zoomactive) return;
            var py = self.getScrollTop(); //preserve scrolling position
            self.win.css({
                width: $(window).width() - self.zoomrestore.padding.w + "px",
                height: $(window).height() - self.zoomrestore.padding.h + "px"
            });
            self.onResize();
            self.setScrollTop(Math.min(self.page.maxh, py));
        };
        this.init();
        $.nicescroll.push(this);
    };
    // Inspired by the work of Kin Blas
    // http://webpro.host.adobe.com/people/jblas/momentum/includes/jquery.momentum.0.7.js  
    var ScrollMomentumClass2D = function(nc) {
        var self = this;
        this.nc = nc;
        this.lastx = 0;
        this.lasty = 0;
        this.speedx = 0;
        this.speedy = 0;
        this.lasttime = 0;
        this.steptime = 0;
        this.snapx = false;
        this.snapy = false;
        this.demulx = 0;
        this.demuly = 0;
        this.lastscrollx = -1;
        this.lastscrolly = -1;
        this.chkx = 0;
        this.chky = 0;
        this.timer = 0;
        this.time = function() {
            return +new Date(); //beautifull hack
        };
        this.reset = function(px, py) {
            self.stop();
            var now = self.time();
            self.steptime = 0;
            self.lasttime = now;
            self.speedx = 0;
            self.speedy = 0;
            self.lastx = px;
            self.lasty = py;
            self.lastscrollx = -1;
            self.lastscrolly = -1;
        };
        this.update = function(px, py) {
            var now = self.time();
            self.steptime = now - self.lasttime;
            self.lasttime = now;
            var dy = py - self.lasty;
            var dx = px - self.lastx;
            var sy = self.nc.getScrollTop();
            var sx = self.nc.getScrollLeft();
            var newy = sy + dy;
            var newx = sx + dx;
            self.snapx = (newx < 0) || (newx > self.nc.page.maxw);
            self.snapy = (newy < 0) || (newy > self.nc.page.maxh);
            self.speedx = dx;
            self.speedy = dy;
            self.lastx = px;
            self.lasty = py;
        };
        this.stop = function() {
            self.nc.unsynched("domomentum2d");
            if (self.timer) clearTimeout(self.timer);
            self.timer = 0;
            self.lastscrollx = -1;
            self.lastscrolly = -1;
        };
        this.doSnapy = function(nx, ny) {
            var snap = false;
            if (ny < 0) {
                ny = 0;
                snap = true;
            } else if (ny > self.nc.page.maxh) {
                ny = self.nc.page.maxh;
                snap = true;
            }
            if (nx < 0) {
                nx = 0;
                snap = true;
            } else if (nx > self.nc.page.maxw) {
                nx = self.nc.page.maxw;
                snap = true;
            }
            if (snap) self.nc.doScrollPos(nx, ny, self.nc.opt.snapbackspeed);
        };
        this.doMomentum = function(gp) {
            var t = self.time();
            var l = (gp) ? t + gp : self.lasttime;
            var sl = self.nc.getScrollLeft();
            var st = self.nc.getScrollTop();
            var pageh = self.nc.page.maxh;
            var pagew = self.nc.page.maxw;
            self.speedx = (pagew > 0) ? Math.min(60, self.speedx) : 0;
            self.speedy = (pageh > 0) ? Math.min(60, self.speedy) : 0;
            var chk = l && (t - l) <= 60;
            if ((st < 0) || (st > pageh) || (sl < 0) || (sl > pagew)) chk = false;
            var sy = (self.speedy && chk) ? self.speedy : false;
            var sx = (self.speedx && chk) ? self.speedx : false;
            if (sy || sx) {
                var tm = Math.max(16, self.steptime); //timeout granularity
                if (tm > 50) { // do smooth
                    var xm = tm / 50;
                    self.speedx *= xm;
                    self.speedy *= xm;
                    tm = 50;
                }
                self.demulxy = 0;
                self.lastscrollx = self.nc.getScrollLeft();
                self.chkx = self.lastscrollx;
                self.lastscrolly = self.nc.getScrollTop();
                self.chky = self.lastscrolly;
                var nx = self.lastscrollx;
                var ny = self.lastscrolly;
                var onscroll = function() {
                    var df = ((self.time() - t) > 600) ? 0.04 : 0.02;
                    if (self.speedx) {
                        nx = Math.floor(self.lastscrollx - (self.speedx * (1 - self.demulxy)));
                        self.lastscrollx = nx;
                        if ((nx < 0) || (nx > pagew)) df = 0.10;
                    }
                    if (self.speedy) {
                        ny = Math.floor(self.lastscrolly - (self.speedy * (1 - self.demulxy)));
                        self.lastscrolly = ny;
                        if ((ny < 0) || (ny > pageh)) df = 0.10;
                    }
                    self.demulxy = Math.min(1, self.demulxy + df);
                    self.nc.synched("domomentum2d", function() {
                        if (self.speedx) {
                            var scx = self.nc.getScrollLeft();
                            if (scx != self.chkx) self.stop();
                            self.chkx = nx;
                            self.nc.setScrollLeft(nx);
                        }
                        if (self.speedy) {
                            var scy = self.nc.getScrollTop();
                            if (scy != self.chky) self.stop();
                            self.chky = ny;
                            self.nc.setScrollTop(ny);
                        }
                        if (!self.timer) {
                            self.nc.hideCursor();
                            self.doSnapy(nx, ny);
                        }
                    });
                    if (self.demulxy < 1) {
                        self.timer = setTimeout(onscroll, tm);
                    } else {
                        self.stop();
                        self.nc.hideCursor();
                        self.doSnapy(nx, ny);
                    }
                };
                onscroll();
            } else {
                self.doSnapy(self.nc.getScrollLeft(), self.nc.getScrollTop());
            }
        }
    };
    // override jQuery scrollTop
    var _scrollTop = jQuery.fn.scrollTop; // preserve original function
    jQuery.cssHooks["pageYOffset"] = {
        get: function(elem, computed, extra) {
            var nice = $.data(elem, '__nicescroll') || false;
            return (nice && nice.ishwscroll) ? nice.getScrollTop() : _scrollTop.call(elem);
        },
        set: function(elem, value) {
            var nice = $.data(elem, '__nicescroll') || false;
            (nice && nice.ishwscroll) ? nice.setScrollTop(parseInt(value)): _scrollTop.call(elem, value);
            return this;
        }
    };
    /*  
      $.fx.step["scrollTop"] = function(fx){    
        $.cssHooks["scrollTop"].set( fx.elem, fx.now + fx.unit );
      };
    */
    jQuery.fn.scrollTop = function(value) {
        if (typeof value == "undefined") {
            var nice = (this[0]) ? $.data(this[0], '__nicescroll') || false : false;
            return (nice && nice.ishwscroll) ? nice.getScrollTop() : _scrollTop.call(this);
        } else {
            return this.each(function() {
                var nice = $.data(this, '__nicescroll') || false;
                (nice && nice.ishwscroll) ? nice.setScrollTop(parseInt(value)): _scrollTop.call($(this), value);
            });
        }
    }
    // override jQuery scrollLeft
    var _scrollLeft = jQuery.fn.scrollLeft; // preserve original function
    $.cssHooks.pageXOffset = {
        get: function(elem, computed, extra) {
            var nice = $.data(elem, '__nicescroll') || false;
            return (nice && nice.ishwscroll) ? nice.getScrollLeft() : _scrollLeft.call(elem);
        },
        set: function(elem, value) {
            var nice = $.data(elem, '__nicescroll') || false;
            (nice && nice.ishwscroll) ? nice.setScrollLeft(parseInt(value)): _scrollLeft.call(elem, value);
            return this;
        }
    };
    /*  
      $.fx.step["scrollLeft"] = function(fx){
        $.cssHooks["scrollLeft"].set( fx.elem, fx.now + fx.unit );
      };  
    */
    jQuery.fn.scrollLeft = function(value) {
        if (typeof value == "undefined") {
            var nice = (this[0]) ? $.data(this[0], '__nicescroll') || false : false;
            return (nice && nice.ishwscroll) ? nice.getScrollLeft() : _scrollLeft.call(this);
        } else {
            return this.each(function() {
                var nice = $.data(this, '__nicescroll') || false;
                (nice && nice.ishwscroll) ? nice.setScrollLeft(parseInt(value)): _scrollLeft.call($(this), value);
            });
        }
    }
    var NiceScrollArray = function(doms) {
        var self = this;
        this.length = 0;
        this.name = "nicescrollarray";
        this.each = function(fn) {
            for (var a = 0, i = 0; a < self.length; a++) fn.call(self[a], i++);
            return self;
        };
        this.push = function(nice) {
            self[self.length] = nice;
            self.length++;
        };
        this.eq = function(idx) {
            return self[idx];
        };
        if (doms) {
            for (a = 0; a < doms.length; a++) {
                var nice = $.data(doms[a], '__nicescroll') || false;
                if (nice) {
                    this[this.length] = nice;
                    this.length++;
                }
            };
        }
        return this;
    };
    function mplex(el, lst, fn) {
        for (var a = 0; a < lst.length; a++) fn(el, lst[a]);
    };
    mplex(
        NiceScrollArray.prototype, ['show', 'hide', 'toggle', 'onResize', 'resize', 'remove', 'stop', 'doScrollPos'],
        function(e, n) {
            e[n] = function() {
                var args = arguments;
                return this.each(function() {
                    this[n].apply(this, args);
                });
            };
        }
    );
    jQuery.fn.getNiceScroll = function(index) {
        if (typeof index == "undefined") {
            return new NiceScrollArray(this);
        } else {
            var nice = this[index] && $.data(this[index], '__nicescroll') || false;
            return nice;
        }
    };
    jQuery.extend(jQuery.expr[':'], {
        nicescroll: function(a) {
            return ($.data(a, '__nicescroll')) ? true : false;
        }
    });
    $.fn.niceScroll = function(wrapper, opt) {
        if (typeof opt == "undefined") {
            if ((typeof wrapper == "object") && !("jquery" in wrapper)) {
                opt = wrapper;
                wrapper = false;
            }
        }
        var ret = new NiceScrollArray();
        if (typeof opt == "undefined") opt = {};
        if (wrapper || false) {
            opt.doc = $(wrapper);
            opt.win = $(this);
        }
        var docundef = !("doc" in opt);
        if (!docundef && !("win" in opt)) opt.win = $(this);
        this.each(function() {
            var nice = $(this).data('__nicescroll') || false;
            if (!nice) {
                opt.doc = (docundef) ? $(this) : opt.doc;
                nice = new NiceScrollClass(opt, $(this));
                $(this).data('__nicescroll', nice);
            }
            ret.push(nice);
        });
        return (ret.length == 1) ? ret[0] : ret;
    };
    window.NiceScroll = {
        getjQuery: function() {
            return jQuery
        }
    };
    if (!$.nicescroll) {
        $.nicescroll = new NiceScrollArray();
        $.nicescroll.options = _globaloptions;
    }
})(jQuery);
; /*!widget/UserHome.learning/study-course.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-27 18:15:14
 * @version $Id$
 */
var xue = xue || {};
var study = study || {};
var briefTab = $('.list-title-tabs li');
var briefBox = $('.scrolls-item');
// 大概切换效果
study.briefToggle = function(index) {
    var index = index || 1;
    briefTab.eq(index - 1).addClass('current').siblings().removeClass('current');
    $('#outline' + index).show().siblings().hide();
    // 切换大纲的时候需要重新计算下隐藏部分的高度
    $('#outline1').jScrollPane();
    $('#outline2').jScrollPane();
}
//发布看点
var $btnSub = $('#btnSubmitFocus');
var $one = $('.lookFocusShow');
var $two = $('.lookFocusPush');
function FocusPushItem() {
    if ($btnSub.hasClass('btn_disabled')) {
        return false;
    } else {
        $one.hide();
        $two.show();
        $btnSub.hide();
    }
}
//转换时间
function formatTime(s) {
    var t;
    if (s > -1) {
        hour = Math.floor(s / 3600);
        min = Math.floor(s / 60) % 60;
        sec = s % 60;
        day = parseInt(hour / 24);
        if (day > 0) {
            hour = hour - 24 * day;
            t = day + "day " + hour + ":";
        } else t = hour + ":";
        if (min < 10) {
            t += "0";
        }
        t += min + ":";
        if (sec < 10) {
            t += "0";
        }
        t += sec;
    }
    return t;
}
//parameters:false/true关闭评论和显示评论接口
function showLookFocus(parameters) {
    var that = $('.lookFocusItem');
    if (parameters !== 'ture') {
        that.hide();
    };
    if (parameters !== 'false') {
        that.show();
    };
}
function htmlspecialchars(str) {
    //转换所有的html标签     
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/gi, '&gt;');
    //只转换js的script标签
    //str = str.replace(/<script/g, '&lt;script');  
    //str = str.replace(/<\/script>/gi,'&lt;/script>');
    return str;
}
function showTimeSubTitle(content, time_point, create_name, id) {
    var $con = $('.focusCon'),
        $name = $con.find('.name'),
        $text = $con.find('.text'),
        $reply = $con.find('a.js_reply');
    $name.text(create_name);
    $('<em>：</em>').appendTo($name);
    var strm = htmlspecialchars(content);
    $text.html(strm);
    setTimeout(function() {
        $name.empty();
        $text.empty();
        $reply.hide();
    }, 4600);
    if ($('.focusCon .text').text().length > 0) {
        $reply.show();
    } else {
        $reply.hide();
    }
    //回复
    $('body').on('click', '.js_reply', function() {
        FocusPushItem();
        var c = formatTime(time_point);
        $('.lookFocusPush').find('.timeEnd').text('0' + c).attr('alt', time_point);
        $con.attr('alt', id);
    });
}
//发布评价
$('body').on('click', '#btnSubmitFocus', function() {
    FocusPushItem()
    var a = $('#EncryptPlayer')[0];
    var b = a.videoPlayingTime();
    var c = formatTime(b);
    $('.lookFocusPush').find('.timeEnd').text('0' + c).attr('alt', b);
    $('.focusCon').removeAttr('alt');
});
$('body').on('mouseenter', '#btnSubmitFocus', function() {
    var that = $(this),
        _left = that.offset().left + (that.width() / 2),
        _top = that.offset().top + that.height(),
        _html = $('.contentTxt').html();
    xue.win({
        id: 'focusTips',
        title: false,
        arrow: 'bl',
        follow: that,
        content: _html,
        lock: false,
        close: false,
        submit: false,
        cancel: false
    });
    var _tips = $('#xuebox_focusTips');
    _tips.css({
        'position': 'absolute'
    });
    // 设置弹窗定位
    xue.win('focusTips').position(_left - (_tips.width() / 3), _top - 100);
});
$('body').on('mouseleave', '#btnSubmitFocus', function() {
    if ($('#xuebox_focusTips').length > 0) {
        xue.win('focusTips').close();
    }
});
//取消发布
$('body').on('click', '.lookFocusPush .btn_cancel', function() {
    $btnSub.show();
    $one.show();
    $two.hide();
});
//提交 
$('body').on('click', '.lookFocusPush .btn_submit', function(event) {
    var that = $(this);
    var _con = $.trim(that.prev('input.inputText').val());
    var _len = _con.length;
    var _err = $('.errorTips');
    function tipsErr() {
        setTimeout(function() {
            _err.hide();
        }, 3000);
    }
    if (_len == 0) {
        _err.show().text('少年,什么也不写无法发布哦！');
        tipsErr();
        return false;
    }
    if (_len <= 4) {
        _err.show().text('少年,请至少输入5个字哦！');
        tipsErr();
        return false;
    }
    if (_len > 40) {
        _err.show().text('少年,请不要超过40个字哦！');
        tipsErr();
        return false;
    }
    var $mask = $('<div class="form_submiting"></div>');
    $mask.css({
        width: that.outerWidth(),
        height: that.outerHeight(),
        left: that.offset().left,
        top: that.offset().top,
        background: '#fcfcfc',
        opacity: 0.3,
        filter: 'alpha(opacity=30)',
        zIndex: 100000
    });
    if ($('.form_submiting').length !== 0) {
        $mask.prependTo('body');
    }
    //通过验证以后，使用ajax进行提交数据，成功后返回
    if (_con !== '请输入看点，(5-40个字)') {
        ajaxHighlight();
    } else {
        _err.show().text('少年,什么也不写无法发布哦！');
        tipsErr();
        return false;
    };
});
$(function() {
    // 大纲头部绑定切换效果
    briefTab.off('click', 'a').on('click', 'a', function() {
        var _tab = $(this).parent('li'),
            _index = _tab.index();
        study.briefToggle(_index + 1);
    });
    //签到提示 start
    function showAlert() {
        var dom = $('#sign_in_data').data('value');
        var _day = Number(dom.days),
            _gold = Number(dom.gold),
            _nextgold = Number(dom.nextGold),
            _nextdays = Number(dom.nextDays),
            _rewardGold = Number(dom.rewardGold);
        // 成功后的提一条提示：奖励10金币
        tpl = '<p class="tp">今日签到成功！获得<strong>' + _gold + '</strong>金币</p>';
        // 当额外奖励 > 0时出现下面的第二条信息
        if (_nextgold > 0) {
            tpl += '<p>再连续签到<strong>' + _nextdays + '</strong>天可额外获得<strong>' + _nextgold + '</strong>金币！</p>';
        } else {
            tpl += '<p>连续签到<strong>' + _day + '</strong>天，额外获得<strong>' + _rewardGold + '</strong>金币！</p>';
        }
        $('<li id="singInLayer">' + tpl + '</li>').appendTo('.sideSingInItems ul');
        setTimeout(function() {
            $('#singInLayer').remove();
        }, 3000);
    }
    $('body').on('click', '.sideSingInItems ul li.singIn', function() {
        var that = $(this);
        showAlert()
    });
    $('body').on('mouseenter', '.singInFinish', function() {
        var that = $(this);
        showAlert()
    });
    $('body').on('mouseleave', '.singInFinish', function() {
            $('#singInLayer').remove();
        })
        //签到提示 end
});
/**
 * 弹窗做题时的结构：
 *
    <p class="answer" data-id="1" data-type="input">
        <input />
    </p>
    var ans = $('.answer');
    
    ans.each(function(i){
        $(this).data({
            id:i,
            type:'input'
        });
    });
    xue.use('examination', function(){
    var a = xue.getAnswers('.sub_answer:visible');
    });
 *
 *
 * 增加对JSON数据的序列化方法，
 * 主要用于IE6、7不支持JSON对象的浏览器
 */
study.json = study.json || {};
study.json.stringify = function(obj) {
    //如果是IE8+ 浏览器(ff,chrome,safari都支持JSON对象)，使用JSON.stringify()来序列化
    if (window.JSON) {
        return JSON.stringify(obj);
    }
    var t = typeof(obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        // recurse array or object
        var n, v, json = [],
            arr = (obj && obj.constructor == Array);
        // fix.
        var self = arguments.callee;
        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null)
                // v = jQuery.stringify(v);
                    v = self(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
study.getAnswers = function(wrap, tp) {
    var box = $(wrap);
    if (box.length == 0) {
        return false;
    }
    var list = box.find('.answer:visible');
    // var error = [], answers = {}, obj = { /*isall: false, answer: {} */};
    var error = [],
        answers = {},
        obj = {};
    list.each(function() {
        var that = $(this),
            data = that.data(),
            id = data.id,
            tp = data.type,
            input = null,
            vals = [];
        if (tp == 'radio' || tp == 'checkbox') {
            input = that.find('a.current');
            if (input.length > 0) {
                input.each(function() {
                    vals.push($(this).data('value'));
                });
            } else {
                error.push(that);
            }
        } else if (tp == 'input') {
            input = that.find('input');
            input.each(function() {
                var v = $.trim($(this).val());
                if (v) {
                    vals.push(v);
                } else {
                    if (v == '') {
                        vals.push('');
                    }
                    error.push(that);
                }
            });
        }
        answers[id] = vals;
    });
    obj.isall = error.length > 0 ? false : true;
    obj.answer = study.json.stringify(answers);
    var data = null,
        vals = null,
        tp = null,
        input = null,
        error = null,
        answers = null;
    //console.log(obj);
    return obj;
};
// 试题中单选/多选绑定点击事件
$('body').on('click', '.answer a', function() {
    var that = $(this);
    if (that.length > 0) {
        var tp = that.data('type');
        // 单选的时候只是移出其他的未选的current
        // 多选的时候如果已选则移出
        if (tp == 'radio') {
            that.addClass('current').siblings('a').removeClass('current');
        } else if (tp == 'checkbox') {
            if (that.hasClass('current')) {
                that.removeClass('current');
            } else {
                that.addClass('current');
            }
        }
    }
});
/* 提交讲测评选项 */
//study.submitAnswers = function  (wrap) {
//    var answers = study.getAnswers(wrap);
//    if (answers.isall) {
//        /* 在这里调用ajax方法,将返回的html放入弹出层就好 */
//        alert('调用后台接口，判断是否正确');
//        
//        var result =   '<div class="class_answer class_test"><div class="class_test_sum"><span>测试结果：答对0题 ， 答错6题。要继续努力啊！</span><ul class="test_more"><li><a href="http://www.xueersi.com/MyCourses/courseStudy/20508-55173-158357/8fcbe725a1c6413a7c66a83bfa76ea34">重学本讲</a></li><li><a href="/LearningCenter/wrongQuestion" target="_blank">去错题本</a></li></ul></div><div class="wrong_list_new"><p class="wrong_list_title">题号：1</p><p><img src="http://x02.xesimg.com/test/2014/04/01/PDF1396333751686/pdf_1.jpg"></p><div class="wrong_list_anwser"><p class="wrong_list_anwser"><span>学员答案：<strong>C</strong></span></p><p><span>正确答案：<strong class="red"> B </strong></span></p></div><p class="wrong_list_knowledge">词汇类-词汇</p><p class="wrong_list_analysis"><img src="http://x02.xesimg.com/test/2014/04/01/PDF1396333751686/pdf_2.jpg"></p></div><div class="wrong_list_new"><p class="wrong_list_title">题号：2</p><p><img src="http://r01.xesimg.com/test/2014/04/01/PDF1396333751686/pdf_3.jpg"></p><div class="wrong_list_anwser"><p class="wrong_list_anwser"><span>学员答案：<strong>C</strong></span></p><p><span>正确答案：<strong class="red">B </strong></span></p></div><p class="wrong_list_knowledge">词汇类-词汇</p><p class="wrong_list_analysis"><img src="http://r03.xesimg.com/test/2014/04/01/PDF1396333751686/pdf_4.jpg"></p></div><div class="wrong_list_new"><p class="wrong_list_title">题号：6</p><p><img src="http://x04.xesimg.com/test/2014/04/01/PDF1396333751686/pdf_11.jpg"></p><div class="wrong_list_anwser"><p class="wrong_list_anwser"><span>学员答案：<strong>C</strong></span></p><p><span>正确答案：<strong class="red"> B </strong> </span></p></div><p class="wrong_list_knowledge">词汇类-词汇</p><p class="wrong_list_analysis"> <img src="http://s02.xesimg.com/test/2014/04/01/PDF1396333751686/pdf_12.jpg"></p></div></div>';
//        $('#chapterTestStart').modal('hide');
//        createModal.show({
//            id: "chapterTestResult",
//            width: "848",
//            title: "本讲测试题",
//            content: result,
//            cls: 'testresult'
//        });
//        $('#chapterTestResult').modal('show');
//    } else {
//        alert('你有未完成的试题');
//    }
//
//}
//
///* 弹出讲测评页面 */
// study.chapterTestStart = function () {
//    var con = '<div class="class_test">\
//    <div class="testcon">\
//      <p class="testcon_title">第1题(填空)</p>\
//      <img src="http://s01.xesimg.com/test/2015/03/02/PDF1425279224614/pdf_1.jpg" alt="">\
//      <p class="answer" data-id="147850" data-type="input">\
//        <span>\
//          <em>填写答案：</em>\
//          <input type="text" data-type="input">\
//        </span>\
//      </p>\
//    </div>\
//    <div class="testcon">\
//      <p class="testcon_title">第2题(单选)</p>\
//      <img src="http://r04.xesimg.com/test/2015/03/02/PDF1425279224614/pdf_3.jpg" alt="">\
//      <p class="answer" data-type="radio" data-id="147851">\
//        <span>\
//          <em>选择答案：</em>\
//          <a data-type="radio" data-value="1" href="###">A</a>\
//          <a data-type="radio" data-value="2" href="###">B</a>\
//          <a data-type="radio" data-value="4" href="###">C</a>\
//          <a data-type="radio" data-value="8" href="###">D</a>\
//        </span>\
//      </p>\
//    </div>\
//    <div class="testcon">\
//      <p class="testcon_title">第5题(多选)</p>\
//      <img src="http://r04.xesimg.com/test/2015/03/02/PDF1425279224614/pdf_9.jpg" alt="">\
//      <p class="answer" data-type="radio" data-id="147854">\
//        <span>\
//          <em>选择答案：</em>\
//          <a data-type="checkbox" data-value="1" href="###">A</a>\
//          <a data-type="checkbox" data-value="2" href="###">B</a>\
//          <a data-type="checkbox" data-value="4" href="###">C</a>\
//          <a data-type="checkbox" data-value="8" href="###">D</a>\
//        </span>\
//      </p>\
//    </div>\
//    <input type="hidden" id="type" value="0">\
//    <a href="###" class="btn btn_red btn_small" onclick="study.submitAnswers(\'.class_test\')">提交答案</a>\
//  </div>';
//    createModal.show({
//        id: "chapterTestStart",
//        width: "848",
//        title: "本讲测试题",
//        content: con,
//        cls: 'testAnswer'
//    });
//    $('#chapterTestStart').modal('show');
//     
//
//}
; /*!widget/UserHome.learning/xue.mousewheel.js*/
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ('onwheel' in document || document.documentMode >= 9) ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;
    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }
    var special = $.event.special.mousewheel = {
        version: '3.1.9',
        setup: function() {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },
        teardown: function() {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        },
        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },
        getPageHeight: function(elem) {
            return $(elem).height();
        },
        settings: {
            adjustOldDeltas: true
        }
    };
    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },
        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });
    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';
        // Old school scrollwheel delta
        if ('detail' in orgEvent) {
            deltaY = orgEvent.detail * -1;
        }
        if ('wheelDelta' in orgEvent) {
            deltaY = orgEvent.wheelDelta;
        }
        if ('wheelDeltaY' in orgEvent) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if ('wheelDeltaX' in orgEvent) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }
        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }
        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;
        // New school wheel delta (wheel event)
        if ('deltaY' in orgEvent) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in orgEvent) {
            deltaX = orgEvent.deltaX;
            if (deltaY === 0) {
                delta = deltaX * -1;
            }
        }
        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) {
            return;
        }
        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if (orgEvent.deltaMode === 1) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if (orgEvent.deltaMode === 2) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }
        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                lowestDelta /= 40;
            }
        }
        // Adjust older deltas if necessary
        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }
        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;
        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);
        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) {
            clearTimeout(nullLowestDeltaTimeout);
        }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
    function nullLowestDelta() {
        lowestDelta = null;
    }
    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }
}));
; /*!widget/UserHome.learning/xue.sidescroll.min.js*/
/*!
 * jScrollPane - v2.0.19 - 2013-11-16
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2013 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */
! function(a, b) {
    var c = function(c) {
        return a(c, b)
    };
    "function" == typeof define && define.amd ? define(["jquery"], c) : "object" == typeof exports ? module.exports = c : c(jQuery)
}(function(a, b, c) {
    a.fn.jScrollPane = function(d) {
        function e(d, e) {
            function f(b) {
                var e, h, j, l, m, n, q = !1,
                    r = !1;
                if (P = b, Q === c) m = d.scrollTop(), n = d.scrollLeft(), d.css({
                    overflow: "hidden",
                    padding: 0
                }), R = d.innerWidth() + tb, S = d.innerHeight(), d.width(R), Q = a('<div class="jspPane" />').css("padding", sb).append(d.children()), T = a('<div class="jspContainer" />').css({
                    width: R + "px",
                    height: S + "px"
                }).append(Q).appendTo(d);
                else {
                    if (d.css("width", ""), q = P.stickToBottom && C(), r = P.stickToRight && D(), l = d.innerWidth() + tb != R || d.outerHeight() != S, l && (R = d.innerWidth() + tb, S = d.innerHeight(), T.css({
                            width: R + "px",
                            height: S + "px"
                        })), !l && ub == U && Q.outerHeight() == V) return void d.width(R);
                    ub = U, Q.css("width", ""), d.width(R), T.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
                }
                Q.css("overflow", "auto"), U = b.contentWidth ? b.contentWidth : Q[0].scrollWidth, V = Q[0].scrollHeight, Q.css("overflow", ""), W = U / R, X = V / S, Y = X > 1, Z = W > 1, Z || Y ? (d.addClass("jspScrollable"), e = P.maintainPosition && (ab || db), e && (h = A(), j = B()), g(), i(), k(), e && (y(r ? U - R : h, !1), x(q ? V - S : j, !1)), H(), E(), N(), P.enableKeyboardNavigation && J(), P.clickOnTrack && o(), L(), P.hijackInternalLinks && M()) : (d.removeClass("jspScrollable"), Q.css({
                    top: 0,
                    left: 0,
                    width: T.width() - tb
                }), F(), I(), K(), p()), P.autoReinitialise && !rb ? rb = setInterval(function() {
                    f(P)
                }, P.autoReinitialiseDelay) : !P.autoReinitialise && rb && clearInterval(rb), m && d.scrollTop(0) && x(m, !1), n && d.scrollLeft(0) && y(n, !1), d.trigger("jsp-initialised", [Z || Y])
            }
            function g() {
                Y && (T.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'), a('<div class="jspDragBottom" />'))), a('<div class="jspCap jspCapBottom" />'))), eb = T.find(">.jspVerticalBar"), fb = eb.find(">.jspTrack"), $ = fb.find(">.jspDrag"), P.showArrows && (jb = a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", m(0, -1)).bind("click.jsp", G), kb = a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", m(0, 1)).bind("click.jsp", G), P.arrowScrollOnHover && (jb.bind("mouseover.jsp", m(0, -1, jb)), kb.bind("mouseover.jsp", m(0, 1, kb))), l(fb, P.verticalArrowPositions, jb, kb)), hb = S, T.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function() {
                    hb -= a(this).outerHeight()
                }), $.hover(function() {
                    $.addClass("jspHover")
                }, function() {
                    $.removeClass("jspHover")
                }).bind("mousedown.jsp", function(b) {
                    a("html").bind("dragstart.jsp selectstart.jsp", G), $.addClass("jspActive");
                    var c = b.pageY - $.position().top;
                    return a("html").bind("mousemove.jsp", function(a) {
                        r(a.pageY - c, !1)
                    }).bind("mouseup.jsp mouseleave.jsp", q), !1
                }), h())
            }
            function h() {
                fb.height(hb + "px"), ab = 0, gb = P.verticalGutter + fb.outerWidth(), Q.width(R - gb - tb);
                try {
                    0 === eb.position().left && Q.css("margin-left", gb + "px")
                } catch (a) {}
            }
            function i() {
                Z && (T.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'), a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'), a('<div class="jspDragRight" />'))), a('<div class="jspCap jspCapRight" />'))), lb = T.find(">.jspHorizontalBar"), mb = lb.find(">.jspTrack"), bb = mb.find(">.jspDrag"), P.showArrows && (pb = a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", m(-1, 0)).bind("click.jsp", G), qb = a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", m(1, 0)).bind("click.jsp", G), P.arrowScrollOnHover && (pb.bind("mouseover.jsp", m(-1, 0, pb)), qb.bind("mouseover.jsp", m(1, 0, qb))), l(mb, P.horizontalArrowPositions, pb, qb)), bb.hover(function() {
                    bb.addClass("jspHover")
                }, function() {
                    bb.removeClass("jspHover")
                }).bind("mousedown.jsp", function(b) {
                    a("html").bind("dragstart.jsp selectstart.jsp", G), bb.addClass("jspActive");
                    var c = b.pageX - bb.position().left;
                    return a("html").bind("mousemove.jsp", function(a) {
                        t(a.pageX - c, !1)
                    }).bind("mouseup.jsp mouseleave.jsp", q), !1
                }), nb = T.innerWidth(), j())
            }
            function j() {
                T.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function() {
                    nb -= a(this).outerWidth()
                }), mb.width(nb + "px"), db = 0
            }
            function k() {
                if (Z && Y) {
                    var b = mb.outerHeight(),
                        c = fb.outerWidth();
                    hb -= b, a(lb).find(">.jspCap:visible,>.jspArrow").each(function() {
                        nb += a(this).outerWidth()
                    }), nb -= c, S -= c, R -= b, mb.parent().append(a('<div class="jspCorner" />').css("width", b + "px")), h(), j()
                }
                Z && Q.width(T.outerWidth() - tb + "px"), V = Q.outerHeight(), X = V / S, Z && (ob = Math.ceil(1 / W * nb), ob > P.horizontalDragMaxWidth ? ob = P.horizontalDragMaxWidth : ob < P.horizontalDragMinWidth && (ob = P.horizontalDragMinWidth), bb.width(ob + "px"), cb = nb - ob, u(db)), Y && (ib = Math.ceil(1 / X * hb), ib > P.verticalDragMaxHeight ? ib = P.verticalDragMaxHeight : ib < P.verticalDragMinHeight && (ib = P.verticalDragMinHeight), $.height(ib + "px"), _ = hb - ib, s(ab))
            }
            function l(a, b, c, d) {
                var e, f = "before",
                    g = "after";
                "os" == b && (b = /Mac/.test(navigator.platform) ? "after" : "split"), b == f ? g = b : b == g && (f = b, e = c, c = d, d = e), a[f](c)[g](d)
            }
            function m(a, b, c) {
                return function() {
                    return n(a, b, this, c), this.blur(), !1
                }
            }
            function n(b, c, d, e) {
                d = a(d).addClass("jspActive");
                var f, g, h = !0,
                    i = function() {
                        0 !== b && vb.scrollByX(b * P.arrowButtonSpeed), 0 !== c && vb.scrollByY(c * P.arrowButtonSpeed), g = setTimeout(i, h ? P.initialDelay : P.arrowRepeatFreq), h = !1
                    };
                i(), f = e ? "mouseout.jsp" : "mouseup.jsp", e = e || a("html"), e.bind(f, function() {
                    d.removeClass("jspActive"), g && clearTimeout(g), g = null, e.unbind(f)
                })
            }
            function o() {
                p(), Y && fb.bind("mousedown.jsp", function(b) {
                    if (b.originalTarget === c || b.originalTarget == b.currentTarget) {
                        var d, e = a(this),
                            f = e.offset(),
                            g = b.pageY - f.top - ab,
                            h = !0,
                            i = function() {
                                var a = e.offset(),
                                    c = b.pageY - a.top - ib / 2,
                                    f = S * P.scrollPagePercent,
                                    k = _ * f / (V - S);
                                if (0 > g) ab - k > c ? vb.scrollByY(-f) : r(c);
                                else {
                                    if (!(g > 0)) return void j();
                                    c > ab + k ? vb.scrollByY(f) : r(c)
                                }
                                d = setTimeout(i, h ? P.initialDelay : P.trackClickRepeatFreq), h = !1
                            },
                            j = function() {
                                d && clearTimeout(d), d = null, a(document).unbind("mouseup.jsp", j)
                            };
                        return i(), a(document).bind("mouseup.jsp", j), !1
                    }
                }), Z && mb.bind("mousedown.jsp", function(b) {
                    if (b.originalTarget === c || b.originalTarget == b.currentTarget) {
                        var d, e = a(this),
                            f = e.offset(),
                            g = b.pageX - f.left - db,
                            h = !0,
                            i = function() {
                                var a = e.offset(),
                                    c = b.pageX - a.left - ob / 2,
                                    f = R * P.scrollPagePercent,
                                    k = cb * f / (U - R);
                                if (0 > g) db - k > c ? vb.scrollByX(-f) : t(c);
                                else {
                                    if (!(g > 0)) return void j();
                                    c > db + k ? vb.scrollByX(f) : t(c)
                                }
                                d = setTimeout(i, h ? P.initialDelay : P.trackClickRepeatFreq), h = !1
                            },
                            j = function() {
                                d && clearTimeout(d), d = null, a(document).unbind("mouseup.jsp", j)
                            };
                        return i(), a(document).bind("mouseup.jsp", j), !1
                    }
                })
            }
            function p() {
                mb && mb.unbind("mousedown.jsp"), fb && fb.unbind("mousedown.jsp")
            }
            function q() {
                a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"), $ && $.removeClass("jspActive"), bb && bb.removeClass("jspActive")
            }
            function r(a, b) {
                Y && (0 > a ? a = 0 : a > _ && (a = _), b === c && (b = P.animateScroll), b ? vb.animate($, "top", a, s) : ($.css("top", a), s(a)))
            }
            function s(a) {
                a === c && (a = $.position().top), T.scrollTop(0), ab = a;
                var b = 0 === ab,
                    e = ab == _,
                    f = a / _,
                    g = -f * (V - S);
                (wb != b || yb != e) && (wb = b, yb = e, d.trigger("jsp-arrow-change", [wb, yb, xb, zb])), v(b, e), Q.css("top", g), d.trigger("jsp-scroll-y", [-g, b, e]).trigger("scroll")
            }
            function t(a, b) {
                Z && (0 > a ? a = 0 : a > cb && (a = cb), b === c && (b = P.animateScroll), b ? vb.animate(bb, "left", a, u) : (bb.css("left", a), u(a)))
            }
            function u(a) {
                a === c && (a = bb.position().left), T.scrollTop(0), db = a;
                var b = 0 === db,
                    e = db == cb,
                    f = a / cb,
                    g = -f * (U - R);
                (xb != b || zb != e) && (xb = b, zb = e, d.trigger("jsp-arrow-change", [wb, yb, xb, zb])), w(b, e), Q.css("left", g), d.trigger("jsp-scroll-x", [-g, b, e]).trigger("scroll")
            }
            function v(a, b) {
                P.showArrows && (jb[a ? "addClass" : "removeClass"]("jspDisabled"), kb[b ? "addClass" : "removeClass"]("jspDisabled"))
            }
            function w(a, b) {
                P.showArrows && (pb[a ? "addClass" : "removeClass"]("jspDisabled"), qb[b ? "addClass" : "removeClass"]("jspDisabled"))
            }
            function x(a, b) {
                var c = a / (V - S);
                r(c * _, b)
            }
            function y(a, b) {
                var c = a / (U - R);
                t(c * cb, b)
            }
            function z(b, c, d) {
                var e, f, g, h, i, j, k, l, m, n = 0,
                    o = 0;
                try {
                    e = a(b)
                } catch (p) {
                    return
                }
                for (f = e.outerHeight(), g = e.outerWidth(), T.scrollTop(0), T.scrollLeft(0); !e.is(".jspPane");)
                    if (n += e.position().top, o += e.position().left, e = e.offsetParent(), /^body|html$/i.test(e[0].nodeName)) return;
                h = B(), j = h + S, h > n || c ? l = n - P.horizontalGutter : n + f > j && (l = n - S + f + P.horizontalGutter), isNaN(l) || x(l, d), i = A(), k = i + R, i > o || c ? m = o - P.horizontalGutter : o + g > k && (m = o - R + g + P.horizontalGutter), isNaN(m) || y(m, d)
            }
            function A() {
                return -Q.position().left
            }
            function B() {
                return -Q.position().top
            }
            function C() {
                var a = V - S;
                return a > 20 && a - B() < 10
            }
            function D() {
                var a = U - R;
                return a > 20 && a - A() < 10
            }
            function E() {
                T.unbind(Bb).bind(Bb, function(a, b, c, d) {
                    var e = db,
                        f = ab,
                        g = a.deltaFactor || P.mouseWheelSpeed;
                    return vb.scrollBy(c * g, -d * g, !1), e == db && f == ab
                })
            }
            function F() {
                T.unbind(Bb)
            }
            function G() {
                return !1
            }
            function H() {
                Q.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function(a) {
                    z(a.target, !1)
                })
            }
            function I() {
                Q.find(":input,a").unbind("focus.jsp")
            }
            function J() {
                function b() {
                    var a = db,
                        b = ab;
                    switch (c) {
                        case 40:
                            vb.scrollByY(P.keyboardSpeed, !1);
                            break;
                        case 38:
                            vb.scrollByY(-P.keyboardSpeed, !1);
                            break;
                        case 34:
                        case 32:
                            vb.scrollByY(S * P.scrollPagePercent, !1);
                            break;
                        case 33:
                            vb.scrollByY(-S * P.scrollPagePercent, !1);
                            break;
                        case 39:
                            vb.scrollByX(P.keyboardSpeed, !1);
                            break;
                        case 37:
                            vb.scrollByX(-P.keyboardSpeed, !1)
                    }
                    return e = a != db || b != ab
                }
                var c, e, f = [];
                Z && f.push(lb[0]), Y && f.push(eb[0]), Q.focus(function() {
                    d.focus()
                }), d.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function(d) {
                    if (d.target === this || f.length && a(d.target).closest(f).length) {
                        var g = db,
                            h = ab;
                        switch (d.keyCode) {
                            case 40:
                            case 38:
                            case 34:
                            case 32:
                            case 33:
                            case 39:
                            case 37:
                                c = d.keyCode, b();
                                break;
                            case 35:
                                x(V - S), c = null;
                                break;
                            case 36:
                                x(0), c = null
                        }
                        return e = d.keyCode == c && g != db || h != ab, !e
                    }
                }).bind("keypress.jsp", function(a) {
                    return a.keyCode == c && b(), !e
                }), P.hideFocus ? (d.css("outline", "none"), "hideFocus" in T[0] && d.attr("hideFocus", !0)) : (d.css("outline", ""), "hideFocus" in T[0] && d.attr("hideFocus", !1))
            }
            function K() {
                d.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")
            }
            function L() {
                if (location.hash && location.hash.length > 1) {
                    var b, c, d = escape(location.hash.substr(1));
                    try {
                        b = a("#" + d + ', a[name="' + d + '"]')
                    } catch (e) {
                        return
                    }
                    b.length && Q.find(d) && (0 === T.scrollTop() ? c = setInterval(function() {
                        T.scrollTop() > 0 && (z(b, !0), a(document).scrollTop(T.position().top), clearInterval(c))
                    }, 50) : (z(b, !0), a(document).scrollTop(T.position().top)))
                }
            }
            function M() {
                a(document.body).data("jspHijack") || (a(document.body).data("jspHijack", !0), a(document.body).delegate("a[href*=#]", "click", function(c) {
                    var d, e, f, g, h, i, j = this.href.substr(0, this.href.indexOf("#")),
                        k = location.href;
                    if (-1 !== location.href.indexOf("#") && (k = location.href.substr(0, location.href.indexOf("#"))), j === k) {
                        d = escape(this.href.substr(this.href.indexOf("#") + 1));
                        try {
                            e = a("#" + d + ', a[name="' + d + '"]')
                        } catch (l) {
                            return
                        }
                        e.length && (f = e.closest(".jspScrollable"), g = f.data("jsp"), g.scrollToElement(e, !0), f[0].scrollIntoView && (h = a(b).scrollTop(), i = e.offset().top, (h > i || i > h + a(b).height()) && f[0].scrollIntoView()), c.preventDefault())
                    }
                }))
            }
            function N() {
                var a, b, c, d, e, f = !1;
                T.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function(g) {
                    var h = g.originalEvent.touches[0];
                    a = A(), b = B(), c = h.pageX, d = h.pageY, e = !1, f = !0
                }).bind("touchmove.jsp", function(g) {
                    if (f) {
                        var h = g.originalEvent.touches[0],
                            i = db,
                            j = ab;
                        return vb.scrollTo(a + c - h.pageX, b + d - h.pageY), e = e || Math.abs(c - h.pageX) > 5 || Math.abs(d - h.pageY) > 5, i == db && j == ab
                    }
                }).bind("touchend.jsp", function() {
                    f = !1
                }).bind("click.jsp-touchclick", function() {
                    return e ? (e = !1, !1) : void 0
                })
            }
            function O() {
                var a = B(),
                    b = A();
                d.removeClass("jspScrollable").unbind(".jsp"), d.replaceWith(Ab.append(Q.children())), Ab.scrollTop(a), Ab.scrollLeft(b), rb && clearInterval(rb)
            }
            var P, Q, R, S, T, U, V, W, X, Y, Z, $, _, ab, bb, cb, db, eb, fb, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb, qb, rb, sb, tb, ub, vb = this,
                wb = !0,
                xb = !0,
                yb = !1,
                zb = !1,
                Ab = d.clone(!1, !1).empty(),
                Bb = a.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
            "border-box" === d.css("box-sizing") ? (sb = 0, tb = 0) : (sb = d.css("paddingTop") + " " + d.css("paddingRight") + " " + d.css("paddingBottom") + " " + d.css("paddingLeft"), tb = (parseInt(d.css("paddingLeft"), 10) || 0) + (parseInt(d.css("paddingRight"), 10) || 0)), a.extend(vb, {
                reinitialise: function(b) {
                    b = a.extend({}, P, b), f(b)
                },
                scrollToElement: function(a, b, c) {
                    z(a, b, c)
                },
                scrollTo: function(a, b, c) {
                    y(a, c), x(b, c)
                },
                scrollToX: function(a, b) {
                    y(a, b)
                },
                scrollToY: function(a, b) {
                    x(a, b)
                },
                scrollToPercentX: function(a, b) {
                    y(a * (U - R), b)
                },
                scrollToPercentY: function(a, b) {
                    x(a * (V - S), b)
                },
                scrollBy: function(a, b, c) {
                    vb.scrollByX(a, c), vb.scrollByY(b, c)
                },
                scrollByX: function(a, b) {
                    var c = A() + Math[0 > a ? "floor" : "ceil"](a),
                        d = c / (U - R);
                    t(d * cb, b)
                },
                scrollByY: function(a, b) {
                    var c = B() + Math[0 > a ? "floor" : "ceil"](a),
                        d = c / (V - S);
                    r(d * _, b)
                },
                positionDragX: function(a, b) {
                    t(a, b)
                },
                positionDragY: function(a, b) {
                    r(a, b)
                },
                animate: function(a, b, c, d) {
                    var e = {};
                    e[b] = c, a.animate(e, {
                        duration: P.animateDuration,
                        easing: P.animateEase,
                        queue: !1,
                        step: d
                    })
                },
                getContentPositionX: function() {
                    return A()
                },
                getContentPositionY: function() {
                    return B()
                },
                getContentWidth: function() {
                    return U
                },
                getContentHeight: function() {
                    return V
                },
                getPercentScrolledX: function() {
                    return A() / (U - R)
                },
                getPercentScrolledY: function() {
                    return B() / (V - S)
                },
                getIsScrollableH: function() {
                    return Z
                },
                getIsScrollableV: function() {
                    return Y
                },
                getContentPane: function() {
                    return Q
                },
                scrollToBottom: function(a) {
                    r(_, a)
                },
                hijackInternalLinks: a.noop,
                destroy: function() {
                    O()
                }
            }), f(e)
        }
        return d = a.extend({}, a.fn.jScrollPane.defaults, d), a.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
            d[this] = d[this] || d.speed
        }), this.each(function() {
            var b = a(this),
                c = b.data("jsp");
            c ? c.reinitialise(d) : (a("script", b).filter('[type="text/javascript"],:not([type])').remove(), c = new e(b, d), b.data("jsp", c))
        })
    }, a.fn.jScrollPane.defaults = {
        showArrows: !1,
        maintainPosition: !0,
        stickToBottom: !1,
        stickToRight: !1,
        clickOnTrack: !0,
        autoReinitialise: !1,
        autoReinitialiseDelay: 500,
        verticalDragMinHeight: 0,
        verticalDragMaxHeight: 99999,
        horizontalDragMinWidth: 0,
        horizontalDragMaxWidth: 99999,
        contentWidth: c,
        animateScroll: !1,
        animateDuration: 300,
        animateEase: "linear",
        hijackInternalLinks: !1,
        verticalGutter: 4,
        horizontalGutter: 4,
        mouseWheelSpeed: 3,
        arrowButtonSpeed: 0,
        arrowRepeatFreq: 50,
        arrowScrollOnHover: !1,
        trackClickSpeed: 0,
        trackClickRepeatFreq: 70,
        verticalArrowPositions: "split",
        horizontalArrowPositions: "split",
        enableKeyboardNavigation: !0,
        hideFocus: !1,
        keyboardSpeed: 0,
        initialDelay: 300,
        speed: 30,
        scrollPagePercent: .8
    }
}, this);; /*!widget/UserHome.notice/notice.js*/
function ConfirmDel() {
    if (!confirm("确认要删除？")) {
        window.event.returnValue = false;
    }
}
//左侧导航高度自适应右侧
//document.getElementById("notice-l").style.height=document.getElementById("notice-r").scrollHeight+"px";
var subNav = subNav || {};
subNav.opt = {
    dom: '#sub-nav',
    item: '#sub-nav .list-group-item',
    actCls: 'active'
};
subNav.setActive = function(id) {
    var _dom = $(this.opt.item);
    _dom.each(function() {
        if ($(this).data('id') == id) {
            $(this).addClass(subNav.opt.actCls);
        } else {
            $(this).removeClass(subNav.opt.actCls);
        }
    });
};; /*!widget/UserHome.perfection/areadata_function.js*/
function threeSelect(config) {
    var $s1 = $("#" + config.s1);
    var $s2 = $("#" + config.s2);
    var $s3 = $("#" + config.s3);
    var v1 = config.v1 ? config.v1 : null;
    var v2 = config.v2 ? config.v2 : null;
    var v3 = config.v3 ? config.v3 : null;
    $.each(threeSelectData, function(k, v) {
        appendOptionTo($s1, k, v.val, v1);
    });
    $s1.change(function() {
        $s2.html("");
        $s3.html("");
        if (this.selectedIndex == -1) return;
        var s1_curr_val = this.options[this.selectedIndex].value;
        $.each(threeSelectData, function(k, v) {
            if (s1_curr_val == v.val) {
                if (v.items) {
                    $.each(v.items, function(k, v) {
                        appendOptionTo($s2, k, v.val, v2);
                    });
                }
            }
        });
        if ($s2[0].options.length == 0) {
            appendOptionTo($s2, "...", "", v2);
        }
        $s2.change();
    }).change();
    $s2.change(function() {
        $s3.html("");
        var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
        if (this.selectedIndex == -1) return;
        var s2_curr_val = this.options[this.selectedIndex].value;
        $.each(threeSelectData, function(k, v) {
            if (s1_curr_val == v.val) {
                if (v.items) {
                    $.each(v.items, function(k, v) {
                        if (s2_curr_val == v.val) {
                            $.each(v.items, function(k, v) {
                                appendOptionTo($s3, k, v, v3);
                            });
                        }
                    });
                    if ($s3[0].options.length == 0) {
                        appendOptionTo($s3, "...", "", v3);
                    }
                }
            }
        });
    }).change();
    function appendOptionTo($o, k, v, d) {
        var $opt = $("<option>").text(k).val(v);
        if (v == d) {
            $opt.attr("selected", "selected")
        }
        $opt.appendTo($o);
    };
    $s1.hide().show();
};
/*!widget/UserHome.perfection/perfect-information.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
/* ================= 登陆注册流程中个人设置完善信息 ============= */
// 昵称与姓名相关验证
$(function() {
    // placeholder样式
    $('body').on('focus', '#nickname', function() {
        $('#nickname').siblings('.label-value').css('display', 'none');
    });
    $('body').on('blur', '#nickname', function() {
        $.fn.nickname();
    });
    // 姓名
    $('body').on('focus', '#realname', function() {
        $('#realname').siblings('.label-value').css('display', 'none');
    });
    $('body').on('blur', '#realname', function() {
        $.fn.realname();
    });
});
// 输入框信息验证
var boxs = {
        nickname: '#nickname',
        realname: '#realname',
        addprovince: '#add-province',
        addcity: '#add-city',
        addcountry: '#add-country'
    }
    // 验证昵称
$.fn.nickname = function() {
    var box = $(boxs.nickname),
        val = box.val();
    var text = box.next('.errTips'),
        block = text.addClass('success');
    if (val == '') {
        block.html('请设置昵称');
        $(nickname).siblings('.label-value').css('display', 'block');
        box.parents('.f1').addClass('has-error');
    } else {
        var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,18}$/;
        if (reg.test(val)) {
            $.fn.nicknameajax();
        } else {
            block.html('请输入汉字、数字、字母');
            box.parents('.f1').removeClass('has-success').addClass('has-error');
            return false;
        }
    }
};
// 请求昵称是否相同
$.fn.nicknameajax = function() {
    var box = $(boxs.nickname),
        val = box.val();
    var text = box.next('.errTips'),
        block = text.addClass('success');
    // 昵称与其他用户重复，请重新设置
    var box = $(boxs.nickname),
        val = $.trim(box.val()),
        d_val = $.trim($(box).data('nickname'));
    if ($.trim(val) != d_val) {
        $.ajax({
            url: '/MyInfo/ajaxValidateNickname',
            type: 'post',
            dataType: 'json',
            data: 'nickname=' + $('#nickname').val(),
            success: function(result) {
                if (result.sign == false) {
                    block.html(result.msg);
                    box.parents('.f1').removeClass('has-success').addClass('has-error');
                    return false;
                } else {
                    block.html('');
                    box.parents('.f1').addClass('has-success').removeClass('has-error');
                    $(box).data('nickname', val);
                    return true;
                }
            },
            error: function() {}
        });
    } else {
        block.html('');
        box.parents('.f1').addClass('has-success').removeClass('has-error');
        return false;
    }
}
// 验证真实姓名
$.fn.realname = function() {
    var box = $(boxs.realname),
        val = box.val();
    var text = box.next('.errTips'),
        block = text.addClass('success');
    if (val == '') {
        block.html('请填写姓名');
        $(realname).siblings('.label-value').css('display', 'block');
        box.parents('.f1').addClass('has-error');
    } else {
        // var reg=/[^\x00-\x80]/;
        var reg = /^[\u4e00-\u9fa5]+$/;
        if (!reg.test(val)) {
            block.html('姓名格式有误');
            box.parents('.f1').addClass('has-error').removeClass('has-success');
        } else {
            block.html('');
            box.parents('.f1').addClass('has-success').removeClass('has-error');
        }
    }
};
// 验证性别
$.fn.sex = function() {
    var n = $(".sex-tip input:checked").length;
    // alert(n)
    if (n == 0) {
        $('.sex-tip').parents('.f1').addClass('has-error');
        $('.sex-tip .errTips').html('请选择性别');
    } else {
        $('.sex-tip .errTips').html('')
        $('.sex-tip').parents('.f1').addClass('has-success').removeClass('has-error');
    }
    $('.sex-tip input').on('click', function() {
        $('.sex-tip .errTips').html('');
        $('.sex-tip').parents('.f1').addClass('has-success').removeClass('has-error');
    });
};
//验证地区是否选中
$.fn.areaprovince = function() {
    var box = $(boxs.addprovince),
        val = box.val();
    var text = box.siblings('.area-tips').children('.errTips');
    if (val == '') {
        text.html('请选择所在地');
        box.parents('.f1').addClass('has-error').removeClass('has-success');
        box.addClass('has-error').removeClass('has-success');
    } else {
        text.html('');
        box.parents('.f1').removeClass('has-error').addClass('has-success');
        box.removeClass('has-error').addClass('has-success');
    }
    return this;
};
$.fn.areacity = function() {
    var box = $(boxs.addcity),
        val = box.val();
    var text = box.siblings('.area-tips').children('.errTips');
    if (val == '') {
        text.html('请选择所在地');
        box.parents('.f1').addClass('has-error').removeClass('has-success');
        box.addClass('has-error').removeClass('has-success');
    } else {
        text.html('');
        box.parents('.f1').removeClass('has-error').addClass('has-success');
        box.removeClass('has-error').addClass('has-success');
    }
    return this;
};
$.fn.areacountry = function() {
    var box = $(boxs.addcountry),
        val = box.val();
    var text = box.siblings('.area-tips').children('.errTips');
    if (val == '') {
        text.html('请选择所在地');
        box.parents('.f1').addClass('has-error').removeClass('has-success');
        box.addClass('has-error').removeClass('has-success');
    } else {
        text.html('');
        box.parents('.f1').removeClass('has-error').addClass('has-success');
        box.removeClass('has-error').addClass('has-success');
    }
    return this;
};
$('body').on('blur', boxs.addprovince, function() {
    $.fn.areaprovince();
});
$('body').on('blur', boxs.addcity, function() {
    $.fn.areacity();
});
$('body').on('blur', boxs.addcountry, function() {
    $.fn.areacountry();
});
// 完善信息提交
$('.setting-infor').off('click', '#inforSubmit').on('click', '#inforSubmit', function() {
    $.fn.nickname();
    $.fn.realname();
    $.fn.sex();
    $.fn.areaprovince();
    $.fn.areacity();
    $.fn.areacountry();
    var error = $('.has-error');
    if (error.length > 0) {
        return false;
    } else {
        $.ajax({
            url: '',
            type: 'POST',
            dataType: "json",
            data: 'nickname=' + $('#nickname').val() + 'realname=' + $('#realname').val(),
            timeout: 7000,
            beforeSend: function() {
            },
            success: function(d) {
                var tp = d.sign,
                    msg = d.msg;
                if (tp == 0) {
                    return false;
                } else if (tp == -1) {
                    return false;
                } else {
                    window.location.href = '/Reg/regSuccess';
                }
            },
            complete: function() {
            },
            error: function() {
            }
        });
    }
});
; /*!widget/UserHome.report/report.js*/
$(function() {
    if ($('.studyReport').length == 1) {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var bodyWidth = $('body').width();
        var flag = true;
        var animateFlag = false;
        var lastTime = 0;
        var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀
        var requestAnimationFrame = window.requestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame;
        var prefix;
        //通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
        for (var i = 0; i < prefixes.length; i++) {
            if (requestAnimationFrame && cancelAnimationFrame) {
                break;
            }
            prefix = prefixes[i];
            requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
            cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
        }
        //如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
        if (!requestAnimationFrame || !cancelAnimationFrame) {
            requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                //为了使setTimteout的尽可能的接近每秒60帧的效果
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            cancelAnimationFrame = function(id) {
                window.clearTimeout(id);
            };
        }
        //得到兼容各浏览器的API
        window.requestAnimationFrame = requestAnimationFrame;
        window.cancelAnimationFrame = cancelAnimationFrame;
        function myAnimate_Mob() {
            id = requestAnimationFrame(myAnimate_Mob);
            line.css({
                height: '+=2'
            })
            switch (line.height()) {
                case 40:
                    $('.overview .item:eq(0) .pull-left img').animate({
                        opacity: 1
                    }, speed)
                    $('.overview .item:eq(0) .pull-left .ball').animate({
                        opacity: 1
                    }, speed)
                    $('.overview .item:eq(0) .pull-right p span').eq(0).animate({
                        opacity: 1,
                    }, speed)
                    break;
                case 70:
                    $('.overview .item:eq(0) .line_1').animate({
                        width: 30
                    }, speed)
                    $('.overview .item:eq(0) .pull-right p span').eq(1).animate({
                        opacity: 1,
                    }, speed)
                    break;
                case (interval == 80 ? 94 : 98):
                    $('.overview .item:eq(0) .line_2').animate({
                        width: '58vw'
                    }, speed)
                    break;
                case (40 + interval):
                    $('.overview .item:eq(1) .pull-left img').animate({
                        opacity: 1
                    }, speed)
                    $('.overview .item:eq(1) .pull-left .ball').animate({
                        opacity: 1
                    }, speed)
                    $('.overview .item:eq(1) .pull-right p span').eq(0).animate({
                        opacity: 1,
                    }, speed)
                    break;
                case (70 + interval):
                    $('.overview .item:eq(1) .line_1').animate({
                        width: 30
                    }, speed)
                    $('.overview .item:eq(1) .pull-right p span').eq(1).animate({
                        opacity: 1,
                    }, speed)
                    break;
                case (interval + (interval == 80 ? 94 : 98)):
                    $('.overview .item:eq(1) .line_2').animate({
                        width: '58vw'
                    }, speed)
                    break;
                case (40 + interval * 2):
                    $('.overview .item:eq(2) .pull-left img').animate({
                        opacity: 1
                    }, speed)
                    $('.overview .item:eq(2) .pull-left .ball').animate({
                        opacity: 1
                    }, speed)
                    $('.overview .item:eq(2) .pull-right p span').eq(0).animate({
                        opacity: 1,
                    }, speed)
                    break;
                case (70 + interval * 2):
                    $('.overview .item:eq(2) .line_1').animate({
                        width: 30
                    }, speed)
                    $('.overview .item:eq(2) .pull-right p span').eq(1).animate({
                        opacity: 1,
                    }, speed)
                    cancelAnimationFrame(id);
                    break;
            }
        }
        function stopAnimation(stop) {
            animateFlag = false;
            if (stop) {
                cancelAnimationFrame(id);
            }
            $('.overview .item .pull-right p span').css({
                opacity: 0
            })
            $('.overview .item .pull-left .line_1,.overview .item .pull-left .line_2').css({
                width: 0
            })
            $('.headBall .line').css({
                height: 0
            })
            $($('.overview .item .pull-left img,.overview .item .pull-left .ball')).css({
                opacity: 0
            })
        }
        /* 全屏滚动效果配置项 */
        $('#fullpage').fullpage({
            anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8', 'page9', 'page10', 'page11', 'page12', 'page13', 'page14', 'page15'],
            css3: true,
            continuousVertical: false,
            controlArrow: false,
            loopBottom: false,
            touchSensitivity: 1,
            navigation: bodyWidth < 980 ? false : true,
            navigationColor: '#fff',
            scrollOverflow: true,
            afterLoad: function(anchorLink, index) {
                switch (index) {
                    case 1:
                        stopAnimation(false)
                        break;
                    case 2:
                        myAnimate_Mob();
                        break;
                    case 3:
                        stopAnimation(false)
                        break;
                }
            },
            onLeave: function(index) {
                switch (index) {
                    case 2:
                        stopAnimation(true)
                        break;
                }
            }
        });
        var line = $('.headBall .line');
        var lineH = line.height();
        var speed = 500;
        var interval = 90;
        if ($('.fp-tableCell').height() <= 568) {
            interval = 80;
        }
        $('.section-6 img,.section-7 img').css({
            height: $('body').height() * 0.23
        })
        /* 适配Mac本 */
        if (userAgent.indexOf('Mac OS X') > 0 && bodyWidth > 768) {
            $('body ').addClass('mac')
        }
        /* 图片点击放大效果 */
        $('.section-6 img ').on('click', function() {
            $('.cover').html(' ')
            $(this).clone().css({
                height: $('body').height() * 0.8,
                marginTop: -$('body').height() * 0.4
            }).appendTo($('.cover'))
            $('.cover').fadeIn().on('click', function() {
                $('.cover').fadeOut().html(' ')
                $(this).off('click')
            })
        })
        $('.section-7 img').on('click', function() {
            $('.cover').html(' ')
            $(this).clone().css({
                height: $('body').height() * 0.8,
                marginTop: -$('body').height() * 0.4
            }).appendTo($('.cover'))
            $('.cover').fadeIn().on('click', function() {
                $('.cover').fadeOut().html(' ')
                $(this).off('click')
            })
        })
        $('body').on('click', '.cover .close', function() {
            $('.cover').hide().removeClass('tab')
        })
    }
}); /*!widget/UserHome.sidebar/sidebar.js*/
/**
 * Created by user on 2015/10/21.
 */
var sidebar = sidebar || {};
sidebar.opt = {
    dom: '#module-sidebar',
    item: '#module-sidebar .btn',
    actCls: 'active'
};
sidebar.setActive = function(id) {
    var _dom = $(this.opt.dom).find('.btn');
    //console.log(_dom);
    _dom.each(function() {
        if ($(this).data('id') == id) {
            $(this).addClass(sidebar.opt.actCls);
        } else {
            $(this).removeClass(sidebar.opt.actCls);
        }
    });
};
//定位右侧边栏
function ctrlRight() {
    var _bodyW;
    if (document.documentElement && document.documentElement.clientWidth) {
        _bodyW = document.documentElement.clientWidth;
    } else {
        _bodyW = document.body.clientWidth;
    }
    if ($('#module-sidebar')) {
        if (_bodyW < 1190) {
            $('#module-sidebar').addClass('module-sidebar-right');
        } else {
            $('#module-sidebar').removeClass('module-sidebar-right');
        }
    }
}
$(function() {
    ctrlRight();
    //根据分辨率重新计算图片
    $(window).resize(function() {
        ctrlRight();
    })
})
; /*!widget/UserHome.testShow/testShow.js*/
var testShow = testShow || {};
; /*!widget/UserHome.wrongQues/error_question.js*/
/**
 * Created by user on 2015/10/21.
 */
var select = select || {};
select.opt = {
    pointCur: '.choice-point-cur li',
    point: '.choice-point-cur',
    grade: '.choice-grade-cur li',
    pointShow: '.chocie-point-show',
    subject: '.choice-subject-cur li',
    selector: '.selector',
    choiceHide: '.choiceHide',
    answerShow: '.que-body-show-text',
    imgAnswer: '.stuAns',
};
/*展现 知识点+年级+学科 选择框*/
//$('body').on('click', select.opt.selector, function () {
//    var that = this;
//        /* 选择框已经打开处理分支 */
//    if ($(that).hasClass('showSelect')) {
//      $(that).children('a').html('显示筛选');
//        $(that).children('i').removeClass('fa-angle-up fa-chevron-up').addClass('fa-angle-down fa-chevron-down');
//        $(that).removeClass('showSelect');
//        $(select.opt.choiceHide).slideUp();
//    } else {
//        /* 选择框未打开处理分支 */
//      $(that).children('a').html('收起筛选');
//        $(that).children('i').removeClass('fa-angle-down fa-chevron-down').addClass('fa-angle-up fa-chevron-up');
//        $(that).addClass('showSelect');
//        $(select.opt.choiceHide).slideDown();
//    }
//});
/* 错题本答案交互 */
$('body').on('click', select.opt.answerShow, function() {
    var that = this,
        answer = $(that).parent('.que-body').next('.que-answer');
    /* 答案未展开处理分支 */
    if ($(that).hasClass('showAnswer')) {
        $(that).removeClass('showAnswer');
        $(that).html('展开答案');
        $(that).prev('i').removeClass('fa-angle-up fa-chevron-up').addClass('fa-angle-down fa-chevron-down');
        answer.slideUp();
    } else {
        /* 答案已展开处理分支 */
        $(that).addClass('showAnswer');
        answer.slideDown();
        $(that).html('收起答案');
        $(that).prev('i').removeClass('fa-angle-down fa-chevron-down').addClass('fa-angle-up fa-chevron-up');
    }
});
/* 错题本图片答案交互 */
$('body').on('click', select.opt.imgAnswer, function() {
    var that = $(this),
        /* 图片路径 */
        urlSite = that.data('url') || that.attr('data-url'),
        con = '<img src="' + urlSite + '" style="max-width:754px;"/>';
    createModal.show({
        id: "wrongQuestionFlow",
        width: '784',
        title: '错题本',
        cls: 'wrongQueShow',
        content: con
    })
    $('#wrongQuestionFlow').modal({
        backdrop: 'static',
        keyboard: false,
        show: true
    });
});
; /*!widget/UserHome.courses/coursestudycenter.js*/
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-10-19 23:24:37
 * @version $Id$
 */
// 头像切换封装函数
var courses = courses || {};
courses.avatar = courses.avatar || {};
(function(a) {
    a.box = {
        pic: null,
        list: null,
        btn: null
    };
    a.step = $(".avatar-items li").width();
    a.size = 0;
    a.max = 0;
    a.len = 0;
    a.toggle = function(expr) {
        var btn = $(expr);
        if (btn.length == 0) {
            return;
        }
        var wrap = btn.parent();
        var pic = wrap.hasClass('avatar-roll') ? wrap.siblings('.avatar-items') : wrap.find('.avatar-items');
        if (pic.length == 0) {
            return;
        }
        this.box.pic = pic;
        this.box.list = pic.find('li');
        this.box.btn = btn;
        this.box.prev = btn.hasClass('prev') ? btn : btn.siblings('.prev');
        this.box.next = btn.hasClass('next') ? btn : btn.siblings('.next');
        this.step = $(".avatar-items li").width();
        this.size = this.box.list.length;
        this.max = this.size - 1;
        var list = pic.find('li');
        var left = pic.css('margin-left');
        this.left = Number(left.replace('px', ''));
        if (btn.hasClass('prev')) {
            a.prev();
        } else {
            a.next();
        }
    }
    a.prev = function() {
        if (a.left < 0) {
            a.box.pic.animate({
                marginLeft: '+=' + a.step + 'px'
            }, 500, function() {
                a.left += a.step;
                a.setCls();
                if (a.left >= 0) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };
    a.next = function() {
        var box = a.box.pic,
            left = Number(box.css('margin-left').replace('px', ''));
        if (a.left > -(a.max * a.step)) {
            a.box.pic.animate({
                marginLeft: '-=' + a.step + 'px'
            }, 500, function() {
                a.left -= a.step;
                a.setCls();
                if (a.left <= -(a.max * a.step)) {
                    $(this).clearQueue();
                }
            });
        } else {
            a.box.pic.clearQueue();
        }
    };
    a.setCls = function() {
        var hasNext = Math.abs(a.left) < ((a.box.list.length - 1) * a.step);
        var hasPrev = a.left < 0;
        if (hasNext) {
            a.box.next.removeClass('none');
        } else {
            a.box.next.addClass('none');
        }
        if (hasPrev) {
            a.box.prev.removeClass('none');
        } else {
            a.box.prev.addClass('none');
        }
    };
})(courses.avatar);
// 绑定老师头像切换事件
$(function() {
    $('body').off('click', '.avatar-roll a, .majar-items .prev, .majar-items .next').on('click', '.avatar-roll a, .majar-items .prev, .majar-items .next', function() {
        var that = $(this);
        if (that.hasClass('none')) {
            return false;
        } else {
            courses.avatar.toggle(that)
        }
    });
})
// 随堂测试弹框
function testLive(dom) {
    $(dom).popover({
        placement: 'top',
        html: true,
        trigger: 'hover',
        title: '',
        content: function() {
            var listTest_html = $(this).parents('.amount-show').siblings('.listTest-pop').html();
            return listTest_html;
        }
    });
}
// 直播辅导弹框
function liveHelp(dom) {
    $(dom).popover({
        placement: 'top',
        html: true,
        trigger: 'hover',
        title: '',
        content: function() {
            var listTest_html = $(this).parents('.amount-show').siblings('.list-help-pop').html();
            return listTest_html;
        }
    });
}
//辅导导师头像弹层
function QrCodeInstructor(dom) {
    $(dom).popover({
        placement: 'top',
        html: true,
        trigger: 'hover',
        title: '',
        content: function() {
            var listTest_html = $(this).find('.QR-code-instructor').html();
            return listTest_html;
        }
    });
}
// 讲义资料弹框tab事件
$('body').on('click', '.material-wrap .material-tab li', function() {
        var index = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $('.material-content').eq(index).show().siblings('.material-content').hide();
    })
    // 录播课程
function tabRecord() {
    $('.teacher-tab li').on('click', function() {
        index = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $(this).parents('.teacher-tab').siblings('.tab-record-content').find('.tab-pane').eq(index).addClass('active').siblings().removeClass('active');
    });
};
// 大纲tab切换
function tabProgram() {
    $('.program-tab li').on('click', function() {
        index = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $('.tab-program-content .tab-program-content-general').eq(index).addClass('active').siblings().removeClass('active');
    });
};
$(function() {
    // 退课成功
    $('body').on('click', '.drop-course-detail-inner .drop-course-btn', function() {
        var result = $('.dropCourse-success-wrap').html();
        $('#dropCourse .modal-body').html(result);
        countDown(3, '#dropCourse');
    });
    // var countDownTime=parseInt(3);    //在这里设置时长
    function countDown(countDownTime, courseDownTimeId) {
        $('.setTimeNum').text(countDownTime);
        var timer = setInterval(function() {
            if (countDownTime > 1) {
                countDownTime--;
                $('.setTimeNum').text(countDownTime);
            } else {
                clearInterval(timer);
                $(courseDownTimeId).modal('hide');
                $("#course_lists_label li.active").click();
            }
        }, 1000);
        // 手动关闭弹层时清除计时器
        $(courseDownTimeId).on('hide.bs.modal', function(e) {
            clearInterval(timer);
        });
    }
    // 退课成功
    // $('body').on('click', '.drop-course-detail-inner .drop-charge', function() {
    //     $('.drop-charge-explain-wrap').toggleClass('dropCharge-hide');
    // });
    // 临时调课成功
    $('body').on('click', '.temporary-adjust-course-detail-inner .drop-course-btn', function() {
        var result = $('.temporary-adjust-wrap').html();
        $('#temporaryAdjustCourse .modal-body').html(result);
    });
    // 永久调课确认按钮点击
    $('body').on('click', '.permanent-adjust-course-detail-inner .drop-course-btn', function() {
        var result = $('.permanent-adjust-wrap').html();
        $('#permanentAdjustCourse .modal-body').html(result);
        countDown(3, '#permanentAdjustCourse');
    });
    // 永久调课无课状态下确认按钮点击
    $('body').on('click', '.permanent-adjust-nocourse-detail .drop-course-btn', function() {
        $('#permanentAdjustCourse').modal('hide');
    });
    // 永久调课场次调整点击事件
    $('body').off('click', '.adjust-course-select li a').on('click', '.adjust-course-select li a', function() {
        if ($(this).parent('li').hasClass("adjustActive")) {
            $(this).parent('li').removeClass('adjustActive');
            $('.permanent-adjust-course-detail-inner .ajust-course-btn').attr('disabled', true);
        } else {
            $(this).parent('li').addClass('adjustActive').siblings('li').removeClass('adjustActive');
            $('.permanent-adjust-course-detail-inner .ajust-course-btn').attr('disabled', false);
        }
    })
});
$('.return-course-submint').off().click(function() {
    var params = $(this).data('params');
    //        console.log(params);
    var url = '/MyCourses/ajaxReturnCourse';
    $.ajax({
        url: url,
        data: params,
        type: 'POST',
        dataType: 'html',
        success: function(d) {
            var resData = xue.ajaxCheck.html(d);
            if (resData) {
                $('#dropCourse .modal-body').html(d);
            }
        },
        error: function() {
            alert('数据读取错误..');
        }
    });
});
// 续报
function continueCourse(classId, courseId) {
    var url = '/MyCourses/ajaxCourseContinue';
    // var params = 'classId=' + classId;
    $.ajax({
        type: "POST",
        url: url,
        data: {
            classId: classId,
            courseId: courseId
        },
        dataType: 'html',
        success: function(result) {
            if (result) {
                createModal.show({
                    id: 'delayDate',
                    title: '原班续报课程',
                    cls: 'continuecourse',
                    width: 905,
                    content: result
                });
                $('#delayDate').modal('show')
            }
        },
    });
}
//调课
function courseGroupList(that,urlStr, urlKey) {
    if($(that).hasClass('ajaxRepeatSubmit')){//提交时，检测是否有标识的类名
         return false;
      }
    $(that).addClass('ajaxRepeatSubmit');//增加类名，用来防止ajax提交过程中用户重复点击
    var mask = '<div class="dialog_mask" style="opacity:0;"></div>';
    $('body').append(mask);
    var url = '/MyCourses/ajaxCourseGroupList';
    var params = 'urlStr=' + urlStr + '&urlKey=' + urlKey;
    $.ajax({
        url: url,
        data: params,
        type: "POST",
        dataType: 'html',
        success: function(d) {
            var resData = xue.ajaxCheck.html(d);
            if (resData) {
                createModal.show({
                    id: 'permanentAdjustCourse',
                    title: '调课',
                    cls: 'permanentAdjustCourse',
                    width: 690,
                    content: d
                });
                $('#permanentAdjustCourse').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            }
            $('.dialog_mask').remove();
            setTimeout(function(){
                 $(that).removeClass('ajaxRepeatSubmit');
            },5000)
        },
        error: function() {
            $('.dialog_mask').remove();
            setTimeout(function(){
                 $(that).removeClass('ajaxRepeatSubmit');
            },5000)
        }
    });
}
//退款说明
function refundInstructions(urlStr, urlKey) {
    var _tpl = '<div style="padding:20px;font-size:14px;">退课功能已搬家，”订单管理--<a href="http://account.xueersi.com/MyOrders/show" style="color:#2494be;">我的订单</a>“中申请退课</div>'
    createModal.show({
        id: 'dropCourse',
        title: '退课',
        cls: 'dropCourse',
        width: 400,
        content: _tpl
    });
    $('#dropCourse').modal({
        backdrop: 'static',
        keyboard: false,
        show: true
    });
}
//讲义资料
function courseInformation(urlStr, urlKey) {
    var url = '/MyCourses/ajaxCourseInformation';
    var params = 'urlStr=' + urlStr + '&urlKey=' + urlKey;
    $.ajax({
        url: url,
        data: params,
        type: "POST",
        dataType: 'html',
        success: function(d) {
            var resData = xue.ajaxCheck.html(d);
            if (resData) {
                createModal.show({
                    id: 'courseInformation',
                    title: '学习资料    ',
                    cls: 'courseInformation',
                    width: 770,
                    content: d
                });
                $('#courseInformation').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            }
        },
        error: function() {
            //                    alert('数据读取错误..');
        }
    });
}
function showDelay(stuCourseId, category, urlStr, urlKey) {
    createModal.show({
        id: 'delayDate',
        title: '学习资料    ',
        cls: 'delayDate',
        width: 530,
        content: '<div class="delay-fsd"><img src="http://res14.xesimg.com/i/img/bom-delay.png"></div><div class="delay-detail"><p  class="overTime"></p><p>您可延长45天有效期</p></div>'
    });
    $('.modal-body').addClass('bom-delay');
    $('.delay-detail').append('<a class="btn-danger btn delay-btn"  href="javascript:void(0)" onclick="courseDelay(' + '&quot;' + stuCourseId + '&quot;' + ',' + '&quot;' + category + '&quot;' + ',' + '&quot;' + urlStr + '&quot;' + ',' + '&quot;' + urlKey + '&quot;' + ')"' + 'href="javascript:void(0)">我要延期</a>')
    $('#delayDate').modal({
        backdrop: 'static',
        keyboard: false,
        show: true
    });
    _this = $('#' + stuCourseId);
    var time = '';
    if (category == 6) {
        time = '本课程 ' + _this.find('.endTime span').html();
    } else {
        time = _this.find('.endTime span').html();
    }
    $('.delay-detail .overTime').html(time);
}
//课程延期
function courseDelay(stuCourseId, category, urlStr, urlKey) {
    var url = '/MyCourses/ajaxCourseDelay';
    var params = 'urlStr=' + urlStr + '&urlKey=' + urlKey;
    $.ajax({
        url: url,
        data: params,
        type: "POST",
        dataType: 'json',
        success: function(d) {
            var resData = xue.ajaxCheck.json(d);
            if (!resData) {
                return false;
            }
            alert('延期成功');
            //延期按钮改为已延期按钮
            $('#delayDate').modal('hide');
            $('#' + stuCourseId).find('.delay').remove();
            $('#' + stuCourseId).find('.service').prepend('<a class="delay hoverNone" style="color:#999">已延期</a>');
            //修改课程时间
            if (category == 1) {
                if ($('#' + stuCourseId).find('.endTime span').length > 1) {
                    var day = d.msg.delaydays + Number($('#' + stuCourseId).find('.endTime span').eq(1).html());
                    $('#' + stuCourseId).find('.endTime span').eq(0).text('剩余日期 : ' + day + '天');
                } else {
                    $('#' + stuCourseId).find('.endTime span').eq(0).text('剩余日期 : ' + d.msg.delaydays + '天');
                }
            } else {
                $('#' + stuCourseId).find('.endTime span').eq(0).text('有效期至 : ' + d.msg.delayDate);
            }
        },
        error: function() {
            //                    alert('数据读取错误..');
        }
    });
}
//考试
function testList(url) {
    var that = $(this);
    var url = 'http://i.xueersi.com' + url;
    $.ajax({
        url: url,
        type: "POST",
        dataType: 'html',
        success: function(d) {
            var resData = xue.ajaxCheck.html(d);
            if (resData) {
                createModal.show({
                    id: 'stuCourseExam',
                    title: '考试列表    ',
                    cls: 'stuCourseExam',
                    width: 770,
                    content: d
                });
                $('#stuCourseExam').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            }
        },
        error: function() {
            alert('数据读取错误..');
        }
    });
}
var queryLogisticsFlag = true;
function queryLogistics(urlStr, urlKey) {
    var url = '/MyCourses/ajaxExpressStrackInfo/' + urlStr + '/' + urlKey;
    console.info(queryLogisticsFlag)
    if (queryLogisticsFlag) {
        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            beforeSend: function() {
                queryLogisticsFlag = false;
                console.info(queryLogisticsFlag)
            },
            success: function(d) {
                if (d.sign == -1) {
                    alert(d.msg);
                } else if (d.sign == 2) {
                    location.href = d.msg;
                } else {
                    var order = '<div class="order"><div>货运物品:' + d.send_name + '</div><div>快递公司:' + d.express_company_name + '</div><div>快递单号:' + d.expressNum + '</div></div>';
                    var c = '<div class="closeBtn"><span class="close" data-dismiss="modal" aria-label="Close" aria-hidden="true">关闭</span></div>'
                    var list = '',
                        info = '';
                    for (var i = d.trace.length - 1; i >= 0; i--) {
                        if (i == d.trace.length - 1) {
                            list = '<li><span class="ball active"></span><span>' + d.trace[i].time + ' ' + d.trace[i].content + '</span></li>'
                        } else {
                            list += '<li><span class="ball"></span><span>' + d.trace[i].time + ' ' + d.trace[i].content + '</span></li>'
                        }
                    }
                    info = '<ul class="info"><div class="line"></div>' + list + '</ul>'
                    createModal.show({
                        id: 'logistics',
                        title: '订单跟踪',
                        cls: 'logistics',
                        width: 730,
                        content: order + info + c
                    });
                    $('#logistics').modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true
                    });
                }
            },
            complete: function() {
                queryLogisticsFlag = true;
                console.info(queryLogisticsFlag)
            }
        })
    }
}
// $('.course_monthly_exam').off().click(function () {
//     alert(111)
//     var that = $(this);
//     var url = 'http://i.xueersi.com'+that.data('url');
//     $.ajax({
//         url: url,
//         type: "POST",
//         dataType: 'html',
//         success: function (d) {
//             var resData = xue.ajaxCheck.html(d);
//             if (resData) {
//                 createModal.show({
//                     id: 'stuCourseExam',
//                     title: '考试列表    ',
//                     cls: 'stuCourseExam',
//                     width: 770,
//                     content: d
//                 });
//                 $('#stuCourseExam').modal({backdrop: 'static', keyboard: false, show: true});
//             }
//         },
//         error: function () {
//            alert('数据读取错误..');
//         }
//     });
// });
// function courseGroupList(urlStr, urlKey) {
//     var url = '/MyCourses/ajaxCourseGroupList';
//     var params = 'urlStr=' + urlStr + '&urlKey=' + urlKey;
//     $.ajax({
//         url: url,
//         data: params,
//         type: "POST",
//         dataType: 'html',
//         success: function(d) {
//             var resData = xue.ajaxCheck.html(d);
//             if (resData) {
//                 createModal.show({
//                     id: 'permanentAdjustCourse',
//                     title: '调课',
//                     cls: 'permanentAdjustCourse',
//                     width: 690,
//                     content: d
//                 });
//                 $('#permanentAdjustCourse').modal({
//                     backdrop: 'static',
//                     keyboard: false,
//                     show: true
//                 });
//             }
//         },
//         error: function() {
//             //                alert('数据读取错误..');
//         }
//     });
// }; 
/*!widget/Module.Modal/modal.js*/
/**
 * Created by yangmengyuan on 15/11/17.
 */
var createModal = createModal || {};
createModal.show = function(e) {
    this.opt = {};
    this.target = '';
    $.extend(this.opt, e);
    //console.log(this.opt);
    $('body').append("<div id='" + this.opt.id + "' class='modal fade " + this.opt.cls + "'  role='dialog'><div class='modal-dialog' style='width:" + this.opt.width + "px;' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>" + this.opt.title + "</h4></div><div class='modal-body'>" + this.opt.content + "</div></div>");
    $('.modal').on('hidden.bs.modal', function(e) {
        $(this).remove();
    })
};
/**
 * Created by liuyanbin on 17/08/17.调场次
 */
//调场次第一步
    var melodyForeignTeacher = melodyForeignTeacher || {};
    melodyForeignTeacher.showModal = function(m_data) {
        var msg = m_data || '';
         var con = '';
            con += '<div class="foreign-teacher-inner">';
            con+='<div id="foreignTeacherItem">'
            con += '<p class="foreign-teacher-tips">由于原辅导老师的开班数量有限，临调场次无辅导老师跟课，请谨慎操作。</p>';
            con += '<p class="foreign-step"></p>';
            con += '<p class="foreign-teacher-name">已选场次：<span class="f-t-d"></span><span class="f-t-t"></span><span class="f-t-n"></span></p>';
            con += ' <div class="foreign-teacher-list">';
            con += '<div class="foreign-list-title">';
            con += ' <span class="col-sm-4">当前场次</span>';
            con += '  <span class="col-sm-4">场次名称</span>';
            con += '  <span class="col-sm-4">老师名称</span>';
            con += '</div>';
            con += '<ul style="height:170px;overflow:auto;" class="melody_list">';
              $.each(msg.data,function( k ,v) {
                            con += '<li data-day="'+v.day+'" data-time="'+ v.start_time +'-'+v.end_time+'" data-name="'+v.name+'" data-id="'+v.id+'">';
                            con += ' <span class="col-sm-4">'+v.day+'&nbsp;&nbsp;'+ v.start_time +'-'+v.end_time+'</span>';
                            con += '<span class="col-sm-4">'+v.name+'</span>';
                               con += '<span class="col-sm-4">'+v.teacherName+'</span>';
                            con += '</li>';
                        });
            con += '</ul>';
            con += '</div>';
            con += '  <p class="foreign-teacher-btn-wrap"><button class="foreign-teacher-btn ajust-course-btn f-right disabled" onclick="nextStepTwoAjaxMelody(this,'+msg.stuId+','+msg.stuCouId+')">下一步</button></p>';
            con += '</div>';
            con+='<div id="foreignTeacherTwoItem"></div>'
            con += '</div>';
        createModal.show({
            id: 'melodyForeignTeacher',
            width: '750',
            title: "调场次",
            cls: "melodyForeignTeacher aaa ccc",
            content: con
        })
        $('#melodyForeignTeacher').modal({
            backdrop: 'static',
            keyboard: false
        })
    }
function melodyCourseTime(urlStr, urlKey) {
    var url = '/MyCourses/ajaxChangePlanList/'+ urlStr+ '/'+urlKey;
    $.ajax({
        url: url,
        type: "POST",
        dataType: 'json',
        success: function(res) {
           if(res.planNum == 0){
                alert('暂时无法调场次!');
           }else{
                melodyForeignTeacher.showModal(res)
           }
        }
    });
}
// 调场次第二步
     function nextMelodyForeignTeacher(m_data) {
        var msg = m_data || '';
         var con = '';
            con += '<p class="foreign-teacher-tips">由于原辅导老师的开班数量有限，临调场次无辅导老师跟课，请谨慎操作。</p>';
            con += '<p class="foreign-step foreign-step-two"></p>';
            con += '<p class="foreign-teacher-name">已选场次：<span>'+msg.oldPlanInfo.day+'&nbsp;&nbsp;'+msg.oldPlanInfo.start_time+'-'+msg.oldPlanInfo.end_time+'&nbsp;&nbsp;'+msg.oldPlanInfo.name+'</span><span class="f-t-d" style="display:none;"></span><span class="f-t-t" style="display:none;"></span><span class="f-t-n" style="display:none;"></span></p>';
            con += ' <div class="foreign-teacher-list">';
            con += '<div class="foreign-list-title">';
            con += ' <span class="col-sm-4">当前场次</span>';
            con += '  <span class="col-sm-4">场次名称</span>';
            con += '  <span class="col-sm-4">老师名称</span>';
            con += '</div>';
            if(msg.planNum == 0){
                con +='<div style="height:170px;font-size:22px;text-align:center;line-height:150px;color:#e74c3d;">无可调场次！</div>';
            }else{
               con += '<ul style="height:170px;overflow:auto;" class="melody_list">';
              $.each(msg.data,function( k ,v) {
                            con += '<li data-day="'+v.day+'" data-time="'+ v.start_time +'-'+v.end_time+'" data-name="'+v.name+'" data-id="'+v.id+'" data-isupset="'+ v.is_upset_plan +'">';
                            con += ' <span class="col-sm-4">'+v.day+'&nbsp;&nbsp;'+ v.start_time +'-'+v.end_time+'</span>';
                            con += '<span class="col-sm-4">'+v.name+'</span>';
                              con += '<span class="col-sm-4">'+v.teacherName+'</span>';
                            con += '</li>';
                        });
            con += '</ul>'; 
            }
            con += '</div>';
            con += '<div class="foreign-tips" style="color:#e74c3d;display:none;font-size:14px;">当前选择时间会打乱学习顺序，请谨慎选择哦!</div>'
            con += '  <p class="foreign-teacher-btn-wrap"><button class="foreign-teacher-btn f-left" onclick="upStepOneMelody(this)">上一步</button><button class="foreign-teacher-btn ajust-course-btn f-right disabled" onclick="nextStepThreeAjaxMelody(this,'+msg.stuId+','+msg.stuCouId+','+msg.changePlanId+')">下一步</button></p>';
            $('#foreignTeacherTwoItem').html(con)
    }
function nextStepTwoAjaxMelody(t,stuId,stuCouId){
    var that = $(t);
    if (that.hasClass("disabled")) {
            return false;
        } else {
           var list = that.parents('.foreign-teacher-inner').find('.melody_list li.active');
           var id = list.data('id');
            $.ajax({
                    url: '/MyCourses/ajaxAlternativePlanList',
                    type: 'post',
                    dataType: 'json',
                    data:{
                        planId:id,
                        stuId:stuId,
                        stuCouId:stuCouId
                    },
                    success: function(res) {
                        if(res.stat == 0){
                            alert(res.data);
                        }else{
                            that.parents('#foreignTeacherItem').hide();
                            nextMelodyForeignTeacher(res);
                        }
                    }
            });
       }
}
function upStepOneMelody(t){
     var that = $(t);
      that.parents('#foreignTeacherTwoItem').html('');
      $('#foreignTeacherItem').show();
}
// 调场次第三步
 function threeMelodyForeignTeacher(m_data) {
        var msg = m_data || '';
         var con = '';
            con += '<p class="foreign-teacher-tips">由于原辅导老师的开班数量有限，临调场次无辅导老师跟课，请谨慎操作。</p>';
            con += '<p class="foreign-step foreign-step-three"></p>';
            con += '<div class="foreign-finish-body">';
            con += '<div class="foreign-finish">';
            con += '<p class="f-title">调换成功，按时上课哦！</p>';
            con += '<p class="f-label">由</p>';
            con += '<p class="f-time"><span>'+msg.data.planInfo.day+'&nbsp;&nbsp;&nbsp;'+ msg.data.planInfo.start_time +'-'+msg.data.planInfo.end_time+'</span><span>'+msg.data.planInfo.name+'</span></p> ';
            con += '<p class="f-label">调至</p>';
            con += '<p class="f-time"><span>'+msg.data.temPlanInfo.day+'&nbsp;&nbsp;&nbsp;'+ msg.data.temPlanInfo.start_time +'-'+msg.data.temPlanInfo.end_time+'</span><span>'+msg.data.temPlanInfo.name+'</span></p>';
            con += '</div>';
            con += '</div>';
            $('.foreign-teacher-inner').html(con)
    }
function nextStepThreeAjaxMelody(t,stuId,stuCouId,temPlanId){
     var that = $(t);
    if (that.hasClass("disabled")) {
            return false;
        } else {
           var list = that.parents('#foreignTeacherTwoItem').find('.melody_list li.active');
           var id = list.data('id');
            $.ajax({
                    url: '/MyCourses/ajaxTempPlanChange',
                    type: 'post',
                    dataType: 'json',
                    data:{
                        temPlanId:id,
                        stuId:stuId,
                        stuCouId:stuCouId,
                        planId:temPlanId
                    },
                    success: function(res) {
                        if(res.stat == 0){
                            alert(res.data);
                        }else{
                           threeMelodyForeignTeacher(res);
                        }
                       
                    }
            });
       }
}
// 调课场次调整点击事件 
$('body').off('click', '.melody_list li').on('click', '.melody_list li', function() { 
         var that = $(this);
         var days = that.data('day');
         var time = that.data('time'); 
         var name = that.data('name'); 
         var upset = that.data('isupset'); 
        if ($(this).hasClass("active")) {
              $(this).removeClass('active'); 
              $('.foreign-teacher-inner .ajust-course-btn').addClass('disabled'); 
              $('.foreign-teacher-name .f-t-d').text(''); 
              $('.foreign-teacher-name .f-t-t').text(''); 
              $('.foreign-teacher-name .f-t-n').text(''); 
              if(upset == 1){
                $('.foreign-tips').hide();
              }
      } else { 
            $(this).addClass('active').siblings().removeClass('active'); 
            $('.foreign-teacher-inner .ajust-course-btn').removeClass('disabled');
            $('.foreign-teacher-name .f-t-d').text(days); 
            $('.foreign-teacher-name .f-t-t').text(time); 
            $('.foreign-teacher-name .f-t-n').text(name); 
             if(upset == 1){
                $('.foreign-tips').show();
              }else{
                $('.foreign-tips').hide();
              }
     } 
 })
