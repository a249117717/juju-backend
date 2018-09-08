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
        "systemNotice":"module/chart/js/systemNotice"
    }
});

require(["text","charts"],function(text,charts){
    (new IndexMain()).fetch();
});