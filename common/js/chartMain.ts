requirejs.config({
    "baseUrl":"./",
    "paths":{
        "charts":"js/charts",
        "text":"lib/requirejs/text/text",
        "statisticalUser":"model/chart/js/statisticalUser",
        "userList":"model/chart/js/userList",
        "payStatistical":"model/chart/js/payStatistical",
        "diamond":"model/chart/js/diamond",
        "freezeList":"model/chart/js/freezeList",
        "orderList":"model/chart/js/orderList",
        "mallList":"model/chart/js/mallList",
        "robotList":"model/chart/js/robotList",
        "infoQuery":"model/chart/js/infoQuery",
        "messageList":"model/chart/js/messageList",
        "systemNotice":"model/chart/js/systemNotice"
    }
});

require(["text","charts"],function(text,charts){
    (new IndexMain()).fetch();
});