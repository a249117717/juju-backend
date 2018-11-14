var _router = {
    "statisticalUser": "统计用户",
    "userList": "用户列表",
    "payStatistical": "付费用户",
    "diamond": "钻石流水",
    "freezeList": "冻结名单",
    "orderList": "订单列表",
    "mallList": "商城商品",
    "robotList": "机器人弹幕",
    "infoQuery": "信息查询",
    "messageList": "消息列表",
    "startUp": "注册欢迎消息",
    "systemNotice": "系统公告",
    "systemConfig": "系统配置"
};
_resource = {
    "changePwd": {
        "url": _domain + "/v1/backend/user/update-user"
    },
    "statisticalUser": {
        "url": _domain + "/v1/backend/stat/stat/list-user-stat"
    },
    "userList": {
        "url": _domain + "/v1/backend/stat/stat/list-player"
    },
    "setSystemUser": {
        "url": _domain + "/v1/backend/run/user/update-system-user"
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
    "addStartUp": {
        "url": _domain + "/v1/backend/run/msg/add-startup-msg"
    },
    "StartUpList": {
        "url": _domain + "/v1/backend/run/msg/list-startup-msg"
    },
    "deleteStartUp": {
        "url": _domain + "/v1/backend/run/msg/delete-startup-msg"
    },
    "updateStartUp": {
        "url": _domain + "/v1/backend/run/msg/update-startup-msg"
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
    },
    "systemConfigList": {
        "url": _domain + "/v1/backend/operation/system/list-system-conf"
    },
    "addSystemConfig": {
        "url": _domain + "/v1/backend/operation/system/new-system-conf"
    },
    "SystemConfigInfo": {
        "url": _domain + "/v1/backend/operation/system/system-conf-info"
    },
    "updateSystemConfig": {
        "url": _domain + "/v1/backend/operation/system/update-system-conf"
    }
};
requirejs.config({
    "baseUrl": "./",
    "paths": {
        "charts": "js/charts",
        "text": "lib/requirejs/text/text",
        "statisticalUser": "module/chart/js/statisticalUser",
        "userList": "module/chart/js/userList",
        "payStatistical": "module/chart/js/payStatistical",
        "diamond": "module/chart/js/diamond",
        "freezeList": "module/chart/js/freezeList",
        "orderList": "module/chart/js/orderList",
        "mallList": "module/chart/js/mallList",
        "robotList": "module/chart/js/robotList",
        "infoQuery": "module/chart/js/infoQuery",
        "messageList": "module/chart/js/messageList",
        "startUp": "module/chart/js/startUp",
        "systemNotice": "module/chart/js/systemNotice",
        "systemConfig": "module/chart/js/systemConfig"
    }
});
require(["text", "charts"], function (text, charts) {
    (new IndexMain()).fetch();
});
//# sourceMappingURL=chartMain.js.map