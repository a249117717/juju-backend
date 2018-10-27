var _domain = "http://39.108.151.200:9999", _pageSize = 10;
var _loadObject = null;
function _load(isShow) {
    var temp = window;
    if (isShow) {
        _loadObject = temp.layer.load(1, {
            shade: [0.1, '#fff']
        });
    }
    else if (_loadObject) {
        temp.layer.close(_loadObject);
    }
    ;
}
function _error(code) {
    var tip = "";
    switch (code) {
        case 404:
            tip = "请求服务器的资源不存在";
            break;
    }
    ;
    return tip;
}
function _resourceError(code, msg) {
    switch (code) {
        case 401:
            window.layer.alert(msg, {
                "cancel": function () {
                    window.location.replace("index.html");
                }
            }, function () {
                window.location.replace("index.html");
            });
            break;
        default:
            window.layer.alert(msg);
            break;
    }
    ;
    _load(false);
}
function _conversionAjax(ajaxResource) {
    for (var en in ajaxResource) {
        ajaxResource[en] = (function (url, type, isAjax) {
            if (type === void 0) { type = "post"; }
            if (isAjax === void 0) { isAjax = true; }
            if (isAjax) {
                return function (data, success, error) {
                    ajax(url, type, data, success, error);
                };
            }
            else {
                return url;
            }
            ;
        }(ajaxResource[en].url, ajaxResource[en].type, ajaxResource[en].isAjax));
    }
    ;
    function ajax(url, type, data, success, error) {
        $.ajax({
            "url": url,
            "type": type,
            "data": data,
            "success": function (data) {
                if (data.code == 0) {
                    if (success) {
                        success(data);
                    }
                    ;
                }
                else {
                    _resourceError(data.code, data.msg);
                }
                ;
            },
            "error": function (request, response) {
                if (error) {
                    error(request, response);
                }
                else {
                    window.layer.msg(_error(request.status));
                    _load(false);
                }
                ;
            }
        });
    }
}
//# sourceMappingURL=common.js.map