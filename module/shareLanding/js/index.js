var download = {
    "android":"https://a.app.qq.com/o/simple.jsp?pkgname=com.wayou.juju",   // 安卓下载地址
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
    $(".m-number .number").val(search[0]).attr("old",search[0]);
    // 设置用户名
    $(".m-number .name").text(search[1] + "的推荐码");

    // 检测输入框，不允许用户变更输入框内容
    $(".m-number .number").on("input",function(){
        var $this = $(this);
        $this.val($this.attr("old"));
    });

    // 按钮特效
    $(".btn").on({
        "touchstart":function(){
            $(this).addClass("active");
        },
        "touchend":function(){
            $(this).removeClass("active");
        }
    });

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

    // 复制
    (function(){
        var clipboard = new ClipboardJS('.btn-copy',{
            text:function() {
                return $(".m-number .number").val();
            }
        });
        clipboard.on('success', function(e) {
            layer.msg("复制成功");
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            layer.msg("非常抱歉，复制失败，你可能尝试自行复制");
        });
    }());
}());