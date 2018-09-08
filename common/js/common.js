var _domain = "http://39.108.151.200:9999", _router = [
    "statisticalUser",
    "userList",
    "payStatistical",
    "diamond",
    "freezeList",
    "orderList",
    "mallList",
    "robotList",
    "infoQuery",
    "messageList",
    "systemNotice"
], _pageSize = 10;
var _loadObject = null, _resource = {
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
    },
    "payStatistical": {
        "url": _domain + "/v1/backend/stat/stat/list-order-stat"
    },
    "diamond": {
        "url": _domain + "/v1/backend/run/diamond/list-diamond-record"
    },
    "addDiamond": {
        "url": _domain + "/v1/backend/run/diamond/add-diamond-give"
    },
    "freezeList": {
        "url": _domain + "/v1/backend/run/frozen/list-frozen-user"
    },
    "infoQuery": {
        "url": _domain + "/v1/backend/run/frozen/query-user-info"
    },
    "addFrozen": {
        "url": _domain + "/v1/backend/run/frozen/add-frozen-user"
    },
    "delFrozen": {
        "url": _domain + "/v1/backend/run/frozen/delete-frozen-user"
    },
    "updateFrozen": {
        "url": _domain + "/v1/backend/run/frozen/update-frozen-user"
    },
    "messageList": {
        "url": _domain + "/v1/backend/run/msg/list-msg-im"
    },
    "addMessage": {
        "url": _domain + "/v1/backend/run/msg/add-msg-im"
    },
    "deleteMessage": {
        "url": _domain + "/v1/backend/run/msg/delete-msg-im"
    },
    "updateMeesage": {
        "url": _domain + "/v1/backend/run/msg/update-msg-im"
    },
    "sNoticeList": {
        "url": _domain + "/v1/backend/run/msg/list-msg-notice"
    },
    "addSNotice": {
        "url": _domain + "/v1/backend/run/msg/add-msg-notice"
    },
    "deleteSNotice": {
        "url": _domain + "/v1/backend/run/msg/delete-msg-notice"
    },
    "updateSNotice": {
        "url": _domain + "/v1/backend/run/msg/update-msg-notice"
    },
    "robotList": {
        "url": _domain + "/v1/backend/run/push/list-robot-push"
    },
    "addRobot": {
        "url": _domain + "/v1/backend/run/push/add-robot-push"
    },
    "deleteRobot": {
        "url": _domain + "/v1/backend/run/push/delete-robot-push"
    },
    "updateRobot": {
        "url": _domain + "/v1/backend/run/push/update-robot-push"
    },
    "listRobotPic": {
        "url": _domain + "/v1/backend/run/list-robot-photo"
    },
    "uploadRobotPic": {
        "url": _domain + "/v1/backend/run/upload-robot-photo",
        "isAjax": false
    },
    "deleteRobotPic": {
        "url": _domain + "/v1/backend/run/delete-robot-photo"
    },
    "mallList": {
        "url": _domain + "/v1/backend/finance/product/list-product"
    },
    "addMall": {
        "url": _domain + "/v1/backend/finance/product/new-product"
    },
    "updateMall": {
        "url": _domain + "/v1/backend/finance/product/update-product"
    },
    "DeleteMall": {
        "url": _domain + "/v1/backend/finance/product/delete-product"
    },
    "orderList": {
        "url": _domain + "/v1/backend/finance/order/list-order"
    },
    "deliveryOrder": {
        "url": _domain + "/v1/backend/finance/order/delivery"
    },
    "upload": {
        "url": _domain + "/v1/backend/func/upload",
        "isAjax": false
    }
};
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
!(function () {
    for (var en in _resource) {
        _resource[en] = (function (url, type, isAjax) {
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
        }(_resource[en].url, _resource[en].type, _resource[en].isAjax));
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
}());
//# sourceMappingURL=common.js.map