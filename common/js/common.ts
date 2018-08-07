const _domain:string = "http://39.108.151.200:9999",
_router:any = {   // 路由器(key:hash值，value:对应调用的类)
    "newUser":"NewUser", // 新增用户
    "activeUser":"ActiveUser",  // 活跃用户
    "statisticalUser":"StatisticalUser", // 统计用户
    "userList":"UserList",  // 用户列表
    "payStatistical":"PayStatistical",  // 付费用户
    "diamond":"Diamond",  // 钻石流水
    "freezeList":"FreezeList",  // 冻结名单
    "infoQuery":"InfoQuery"  // 信息查询
},
_pageSize:number = 10;   // 默认每个详情页面的行数统一为10条

let _loadObject:any = null, // 存储load对象
_resource:any = {  // 服务请求
    "login":{   // 登录
        "url":`${_domain}/v1/backend/public/login`
    },
    "changePwd":{   // 密码变更
        "url":`${_domain}/v1/backend/user/update-user`
    },
    "statisticalUser":{ // 统计用户
        "url":`${_domain}/v1/backend/stat/stat/list-user-stat`
    },
    "userList":{    // 用户列表
        "url":`${_domain}/v1/backend/stat/stat/list-player`
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
    }
};

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
function _error(code:number) {
    let tip:string = "";
    switch(code) {
        case 404:
            tip = "请求服务器的资源不存在!"
        break;
    };

    return tip;
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
                if(data.code == 0) {
                    if(success) {
                        success(data);
                    };
                } else {
                    // 如果服务器返回的code不为0，则表示出现了请求错误，提示用户
                    (<any>window).layer.alert(data.msg);
                    _load(false);
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
}());