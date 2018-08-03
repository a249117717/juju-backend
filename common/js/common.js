var _domain = "http://39.108.151.200:9999", _loadObject = null, _resource = {
    "login": {
        "url": _domain + "/v1/backend/public/login"
    },
    "changePwd": {
        "url": _domain + "/v1/backend/user/update-user"
    },
    "statisticalUser": {
        "url": _domain + "/v1/backend/stat/stat/list-user-stat"
    },
    "userList": {
        "url": _domain + "/v1/backend/stat/stat/list-player"
    }
};
var _pageSize = 10;
function _load(isShow) {
    var temp = window;
    if (isShow) {
        _loadObject = temp.layer.load(1, {
            shade: [0.1, '#fff']
        });
    }
    else {
        temp.layer.close(_loadObject);
    }
    ;
}
function _error(code) {
    var tip = "";
    switch (code) {
        case 404:
            tip = "请求服务器的资源不存在!";
            break;
    }
    ;
    return tip;
}
!(function () {
    var temp = {};
    for (var en in _resource) {
        temp[en] = (function (url, type) {
            if (type === void 0) { type = "post"; }
            return function (data, success, error) {
                ajax(url, type, data, success, error);
            };
        }(_resource[en].url, _resource[en].type));
    }
    ;
    _resource = temp;
    function ajax(url, type, data, success, error) {
        $.ajax({
            "url": url,
            "type": type,
            "data": data,
            "success": function (data) {
                if (success) {
                    success(data);
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
}());
//# sourceMappingURL=common.js.map