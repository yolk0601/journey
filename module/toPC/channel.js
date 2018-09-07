// 判断是否是PC端
function isClient() {
    return navigator.userAgent.toLocaleLowerCase().indexOf('xescef') != -1;
}
// 注册
function registerFunction() {
    if (isClient()) {
        if (typeof QCefClient == 'undefined') {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = 'qrc:///qtwebchannel/qwebchannel.js';
            head.appendChild(script);
            script.onload = function () {
                new QWebChannel(qt.webChannelTransport, function (channel) {
                    window.bridges = channel.objects.bridges;
                });
            };
        } else {
            QCefClient.addEventListener("invokeJsFunction", onInvokeJsFunction);
        }
    }
}

function onInvokeQtFunction(method, args) {
    if (isClient()) {
        args = args || '';
        if (typeof QCefClient == 'undefined') {
            if (window.bridges !== undefined) {
                window.bridges.invokeMethod(method, args);
            } else {
                var maxTry = 5;
                var timer = setInterval(function () {
                    if (window.bridges === undefined) {
                        maxTry--;
                    } else if (maxTry === 0) {
                        clearInterval(timer);
                        console.warn('onInvokeQtFunction(' + method + ') timeout, failed!');
                    } else {
                        clearInterval(timer);
                        window.bridges.invokeMethod(method, args);
                    }
                }, 500);
            }
        } else {
            QCefClient.invokeMethod(method, args);
        }
    }
}

function onInvokeJsFunction(event) {
    if (isClient()) {
        if (typeof QCefClient == 'undefined') {
            return;
        }
        if (event.type == 'function') {
            eval(event.data);
        }
    }
}