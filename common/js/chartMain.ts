let _router:{
    [index:string]:string
} = {   // 路由器
    "statisticalUser":"统计用户",
    "userList":"用户列表",
    "payStatistical":"付费用户",
    "diamond":"钻石流水",
    "freezeList":"冻结名单",
    "orderList":"订单列表",  
    "mallList":"商城商品",
    "robotList":"机器人弹幕",
    "infoQuery":"信息查询",
    "messageList":"消息列表",
    "startUp":"注册欢迎消息",
    "systemNotice":"系统公告"
};

_resource = {  // 服务请求
    "changePwd":{   // 密码变更
        "url":`${_domain}/v1/backend/user/update-user`
    },
    "statisticalUser":{ // 统计用户
        "url":`${_domain}/v1/backend/stat/stat/list-user-stat`
    },
    "userList":{    // 用户列表
        "url":`${_domain}/v1/backend/stat/stat/list-player`
    },
    "setSystemUser":{   // 设置玩家为系统用户
        "url":`${_domain}/v1/backend/run/user/update-system-user`
    },
    "payStatistical":{  // 付费统计
        "url":`${_domain}/v1/backend/stat/stat/list-order-stat`
    },
    "diamond":{ // 钻石流水
        "url":`${_domain}/v1/backend/run/diamond/list-diamond-record`
    },
    "addDiamond":{  // 赠送钻石
        "url":`${_domain}/v1/backend/run/diamond/add-diamond-give`
    },
    "freezeList":{    // 冻结名单
        "url":`${_domain}/v1/backend/run/frozen/list-frozen-user`
    },
    "infoQuery":{    // 信息查询
        "url":`${_domain}/v1/backend/run/frozen/query-user-info`
    },
    "addFrozen":{   // 添加玩家id进冻结名单
        "url":`${_domain}/v1/backend/run/frozen/add-frozen-user`
    },
    "delFrozen":{   // 删除冻结名单里的玩家
        "url":`${_domain}/v1/backend/run/frozen/delete-frozen-user`
    },
    "updateFrozen":{    // 更新玩家id进冻结名单
        "url":`${_domain}/v1/backend/run/frozen/update-frozen-user`
    },
    "messageList":{ // 消息列表
        "url":`${_domain}/v1/backend/run/msg/list-msg-im`
    },
    "addMessage":{  // 增加消息
        "url":`${_domain}/v1/backend/run/msg/add-msg-im`
    },
    "deleteMessage":{   // 删除消息
        "url":`${_domain}/v1/backend/run/msg/delete-msg-im`
    },
    "updateMeesage":{ // 更新消息
        "url":`${_domain}/v1/backend/run/msg/update-msg-im`
    },
    "sNoticeList":{ // 系统公告列表
        "url":`${_domain}/v1/backend/run/msg/list-msg-notice`
    },
    "addSNotice":{   // 增加系统公告
        "url":`${_domain}/v1/backend/run/msg/add-msg-notice`
    },
    "deleteSNotice":{   // 删除系统公告
        "url":`${_domain}/v1/backend/run/msg/delete-msg-notice`
    },
    "updateSNotice":{ // 更新系统公告
        "url":`${_domain}/v1/backend/run/msg/update-msg-notice`
    },
    "addStartUp":{    // 新增用户注册时欢迎消息
        "url":`${_domain}/v1/backend/run/msg/add-startup-msg`
    },
    "StartUpList":{    // 用户注册欢迎消息列表
        "url":`${_domain}/v1/backend/run/msg/list-startup-msg`
    },
    "deleteStartUp":{    // 删除用户注册时欢迎消息
        "url":`${_domain}/v1/backend/run/msg/delete-startup-msg`
    },
    "updateStartUp":{    // 更新用户注册时欢迎消息
        "url":`${_domain}/v1/backend/run/msg/update-startup-msg`
    },
    "robotList":{   // 机器人弹幕列表
        "url":`${_domain}/v1/backend/run/push/list-robot-push`
    },
    "addRobot":{    // 新增机器人弹幕
        "url":`${_domain}/v1/backend/run/push/add-robot-push`
    },
    "deleteRobot":{ // 删除机器人弹幕
        "url":`${_domain}/v1/backend/run/push/delete-robot-push`
    },
    "updateRobot":{ // 更新机器人弹幕
        "url":`${_domain}/v1/backend/run/push/update-robot-push`
    },
    "listRobotPic":{  // 机器人图片列表
        "url":`${_domain}/v1/backend/run/list-robot-photo`
    },
    "uploadRobotPic":{  // 上传机器人图片
        "url":`${_domain}/v1/backend/run/upload-robot-photo`,
        "isAjax":false
    },
    "deleteRobotPic":{  // 删除机器人图片
        "url":`${_domain}/v1/backend/run/delete-robot-photo`
    },
    "mallList":{    // 商城商品列表
        "url":`${_domain}/v1/backend/finance/product/list-product`
    },
    "addMall":{    // 增加商城商品售卖数量及价格
        "url":`${_domain}/v1/backend/finance/product/new-product`
    },
    "updateMall":{    // 更新商城商品售卖数量及价格
        "url":`${_domain}/v1/backend/finance/product/update-product`
    },
    "DeleteMall":{    // 删除商城商品售卖数量及价格
        "url":`${_domain}/v1/backend/finance/product/delete-product`
    },
    "orderList":{   // 订单列表
        "url":`${_domain}/v1/backend/finance/order/list-order`
    },
    "deliveryOrder":{   // 订单交货
        "url":`${_domain}/v1/backend/finance/order/delivery`
    },
    "upload":{  // 通用上传文件或图片
        "url":`${_domain}/v1/backend/func/upload`,
        "isAjax":false
    }
};

requirejs.config({
    "baseUrl":"./",
    "paths":{
        "charts":"js/charts",
        "text":"lib/requirejs/text/text",
        "statisticalUser":"module/chart/js/statisticalUser",
        "userList":"module/chart/js/userList",
        "payStatistical":"module/chart/js/payStatistical",
        "diamond":"module/chart/js/diamond",
        "freezeList":"module/chart/js/freezeList",
        "orderList":"module/chart/js/orderList",
        "mallList":"module/chart/js/mallList",
        "robotList":"module/chart/js/robotList",
        "infoQuery":"module/chart/js/infoQuery",
        "messageList":"module/chart/js/messageList",
        "systemNotice":"module/chart/js/systemNotice",
        "startUp":"module/chart/js/startUp"
    }
});

require(["text","charts"],function(text,charts){
    (new IndexMain()).fetch();
});