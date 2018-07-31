let _domain:string = "http://39.108.151.200:9999",
_loadObject:any = null, // 存储load对象
_resource:any = {  // 服务请求
    "login":{   // 登录
        "url":_domain + "/v1/backend/public/login"
    },
    "changePwd":{   // 密码变更
        "url":_domain + "/v1/backend/user/update-user"
    },
    "statisticalUser":{ // 统计用户
        "url":_domain + "/v1/backend/stat/stat/list-user-stat"
    },
    "userList":{    // 用户列表
        "url":_domain + "/v1/backend/stat/stat/list-player"
    }
};
const _pageSize:number = 10;   // 默认每个详情页面的行数统一为10条

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
    } else {
        temp.layer.close(_loadObject);
    };
}

!(function(){   // 服务器请求
    let temp = {};
    for(let en in _resource) {
        temp[en] = (function(url:string,type:string = "post"){
            return function(data?:{},success?:Function,error?:Function) {
                ajax(url,type,data,success,error);
            };
        }(_resource[en].url,_resource[en].type));
    };
    _resource = temp;

    function ajax(url:string,type:string,data?:any,success?:Function,error?:Function) {
        $.ajax({
            "url":url,
            "type":type,
            "data":data,
            "success":function(data:any){
                success(data);
            },
            "error":function(request,response) {
                error(request,response);
            }
        })
    }
}());