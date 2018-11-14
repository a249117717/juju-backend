const _domain:string = "http://39.108.151.200:9999",
_pageSize:number = 10;   // 默认每个详情页面的行数统一为10条

let _resource:resource = null,
_loadObject:any = null; // 存储load对象

/**
 * 服务请求接口
 */
interface resource {
    /**
     * 登录
     */
    "login"?:postUrl|Function
    /**
     * 密码变更
     */
    "changePwd"?:postUrl|Function
    /**
     * 统计用户
     */
    "statisticalUser"?:postUrl|Function
    /**
     * 用户列表
     */
    "userList"?:postUrl|Function
    /**
     * 设置玩家为系统用户
     */
    "setSystemUser"?:postUrl|Function
    /**
     * 付费统计
     */
    "payStatistical"?:postUrl|Function
    /**
     * 钻石流水
     */
    "diamond"?:postUrl|Function
    /**
     * 赠送钻石
     */
    "addDiamond"?:postUrl|Function
    /**
     * 冻结名单
     */
    "freezeList"?:postUrl|Function
    /**
     * 信息查询
     */
    "infoQuery"?:postUrl|Function
    /**
     * 添加玩家id进冻结名单
     */
    "addFrozen"?:postUrl|Function
    /**
     * 删除冻结名单里的玩家
     */
    "delFrozen"?:postUrl|Function
    /**
     * 更新玩家id进冻结名单
     */
    "updateFrozen"?:postUrl|Function
    /**
     * 消息列表
     */
    "messageList"?:postUrl|Function
    /**
     * 增加消息
     */
    "addMessage"?:postUrl|Function
    /**
     * 删除消息
     */
    "deleteMessage"?:postUrl|Function
    /**
     * 更新消息
     */
    "updateMeesage"?:postUrl|Function
    /**
     * 系统公告列表
     */
    "sNoticeList"?:postUrl|Function
    /**
     * 增加系统公告
     */
    "addSNotice"?:postUrl|Function
    /**
     * 删除系统公告
     */
    "deleteSNotice"?:postUrl|Function
    /**
     * 新增用户注册时欢迎消息
     */
    "addStartUp"?:postUrl|Function
    /**
     * 用户注册欢迎消息列表
     */
    "StartUpList"?:postUrl|Function
    /**
     * 删除用户注册时欢迎消息
     */
    "deleteStartUp"?:postUrl|Function
    /**
     * 更新用户注册时欢迎消息
     */
    "updateStartUp"?:postUrl|Function
    /**
     * 更新系统公告
     */
    "updateSNotice"?:postUrl|Function
    /**
     * 机器人弹幕列表
     */
    "robotList"?:postUrl|Function
    /**
     * 新增机器人弹幕
     */
    "addRobot"?:postUrl|Function
    /**
     * 删除机器人弹幕
     */
    "deleteRobot"?:postUrl|Function
    /**
     * 更新机器人弹幕
     */
    "updateRobot"?:postUrl|Function
    /**
     * 机器人相片列表
     */
    "listRobotPic"?:postUrl|Function
    /**
     * 上传机器人图片（一次只能上传一张，最多上传6张）
     */
    "uploadRobotPic"?:postUrl|Function
    /**
     * 删除相片
     */
    "deleteRobotPic"?:postUrl|Function
    /**
     * 商城商品列表
     */
    "mallList"?:postUrl|Function
    /**
     * 增加商城商品售卖数量及价格
     */
    "addMall"?:postUrl|Function
    /**
     * 更新商城商品售卖数量及价格
     */
    "updateMall"?:postUrl|Function
    /**
     * 删除商城商品售卖数量及价格
     */
    "DeleteMall"?:postUrl|Function
    /**
     * 订单列表
     */
    "orderList"?:postUrl|Function
    /**
     * 订单交货
     */
    "deliveryOrder"?:postUrl|Function
    /**
     * 通用上传文件或图片
     */
    "upload"?:postUrl|Function
    /**
     * 系统配置列表
     */
    "systemConfigList"?:postUrl|Function
     /**
     * 新增系统配置
     */
    "addSystemConfig"?:postUrl|Function
     /**
     * 系统配置信息
     */
    "SystemConfigInfo"?:postUrl|Function
     /**
     * 更新系统配置
     */
    "updateSystemConfig"?:postUrl|Function
}

/**
 * 接口参数
 */
interface postUrl {
    /**
     * 请求地址
     */
    "url":string;
    /**
     * 请求类型
     */
    "type"?:string;
    /**
     * 是否需要ajax化，默认为true
     */
    "isAjax"?:boolean
}

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