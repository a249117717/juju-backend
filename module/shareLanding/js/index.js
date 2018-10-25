var download = {
    "android":"",   // 安卓下载地址
    "iOS":""// iOS下载地址
};   

(function(){
    var search = decodeURI(window.location.search),
    u = navigator.userAgent
    img = new Image();
    search = search.substr(1);
    search = search.split("&");

    // 设置头像
    img.src = search[2];
    img.onload = function(){
        $(".m-user .userImg").attr("src",img.src);
    };
    // 设置推荐码
    $(".m-number .number").val(search[0]);
    // 设置用户名
    $(".m-number .name").text(search[1] + "的推荐码");

    // 下载按钮
    $(".btn-down").on("click",function(){
        if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            // 安卓
            window.location.href = download.android;
        } else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            // iOS
            window.location.href = download.iOS;
        };
    });
}());