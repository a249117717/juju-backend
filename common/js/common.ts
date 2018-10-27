const _domain:string = "http://39.108.151.200:9999",
_pageSize:number = 10;   // 默认每个详情页面的行数统一为10条

let _loadObject:any = null; // 存储load对象

/**
 * 显示加载
 * @param {boolean} isShow [是否显示]
 */
function _load(isShow:boolean) {
    let temp:any = <any>window;
    if(isShow) {
        _loadObject = temp.layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
    } else if(_loadObject) {
        temp.layer.close(_loadObject);
    };
}

/**
 * 请求错误提示
 * @param {number} code [错误代码]
 */
function _error(code:number) : string {
    let tip:string = "";
    switch(code) {
        case 404:
            tip = "请求服务器的资源不存在"
        break;
    };

    return tip;
}

/**
 * 服务器返回错误号
 * @param {number} code [错误号]
 * @param {string} msg [错误信息]
 */
function _resourceError(code:number,msg:string) {
    switch(code) {
        case 401:
            (<any>window).layer.alert(msg,{
                "cancel":function(){  // 点击关闭按钮也是返回首页
                    window.location.replace("index.html");
                }
            },function(){   // 点击确定按钮返回首页
                window.location.replace("index.html");
            });
        break;
        default:
            (<any>window).layer.alert(msg);
        break;
    };
    _load(false);
}

/**
 * 转换ajax为jQuery请求
 * @param {object} ajaxResource [需要转换的ajax数据]
 */
function _conversionAjax(ajaxResource) {
    for(let en in ajaxResource) {
        ajaxResource[en] = (function(url:string,type:string = "post",isAjax:boolean = true){
            if(isAjax) {
                return function(data?:any,success?:Function,error?:Function) {
                    ajax(url,type,data,success,error);
                };
            } else {
                // 如果isAjax为false，表示不需要ajax化，直接返回地址
                return url;
            };
        }(ajaxResource[en].url,ajaxResource[en].type,ajaxResource[en].isAjax));
    };

    function ajax(url:string,type:string,data?:any,success?:Function,error?:Function) {
        $.ajax({
            "url":url,
            "type":type,
            "data":data,
            "success":function(data:any){
                if(data.code == 0) {
                    if(success) {
                        success(data);
                    };
                } else {
                    _resourceError(data.code,data.msg);
                };
            },
            "error":function(request,response) {
                if(error) {
                    error(request,response);
                } else {
                    (<any>window).layer.msg(_error(request.status));
                    _load(false);
                };
            }
        })
    }
}