/// <reference path="../../../js/charts.d.ts" />

// 机器人弹幕
class RobotList extends ChartBase {
    $el:JQuery<HTMLElement> = null;
    $add:JQuery<HTMLElement> = null;
    template = { // 模板
        "routerTemp":"robotListTemp",
        "detail":"robotListDetail"
    };

    constructor(props:any) {
        super(props);
        $.extend(this,props);
    }

    /**
     * 数据获取
     * @param {number} pageNo [页码]
     * @param {number} pageSize [每页条数]
     */
    fetch(pageNo:number = 1,pageSize:number = _pageSize) {
        let self:FreezeList = this;
        self.render({});

        // _load(true);
        // (<Function>_resource.robotList)(JSON.stringify({
        //     "page_size":pageSize,
        //     "page_index":pageNo,
        //     "token":this.mainView.mainView.token
        // }),function(data:any){
        //     if(!this.activation) {
                // self.render(data);
        //     } else {
        //         // 设置总页数
        //         self.pading.setTotal(data.count);
        //     };
        //     self.renderDetail(data)
        //     _load(false);
        // });
    }

    /**
     * 页面渲染
     * @param {object} data [数据]
     */
    render(data:any) {
        let header:CHeader = this.mainView.mainView.header;
        header.showMenu();

        this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
        this.$el = $(".m-robotList");
        this.$add = this.$el.find(".addCurtain")
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:RobotList = this;

        // 新增弹幕的重置按钮
        this.$add.find(".btn-reset").on("click",() => {
            (<HTMLFormElement>this.$add.find("form")[0]).reset();
        });

        // 新增弹幕的确定按钮
        this.$add.find(".btn-submit").on("click",function() {
            if(!self.messageCheck(self.$add)) {
                return;
            };

            (<any>window).layer.confirm("是否确认增加机器人弹幕",function(e){
                _load(true);
                (<Function>_resource.addRobot)(JSON.stringify(self.getMessage(self.$add)),function(data){
                    // 重置新增框
                    self.$add.find(".btn-reset").click();
                    // 刷新数据列表
                    self.fetch();
                    (<any>window).layer.msg("增加成功");
                    (<any>window).layer.close(e);
                    _load(false);
                });
            });
        });

        // 增加消息生日日期
        (<any>window).laydate.render({
            elem: '.m-addContent .birthday',
            type: 'date',
            theme: '#42a5f5',
            format: 'yyyy-MM-dd HH:mm'
        });
    }

    /**
     * 渲染详情
     * @param {Object} data [数据]
     */
    renderDetail(data:any) {
    }

    /**
     * 消息数据校验
     * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
     * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
     */
    messageCheck($JQ:JQuery<HTMLElement>) : boolean {
        let tip:string = "";

        if(!$JQ.find(".nickname").val()) {
            tip = "请输入昵称";
        } else if(!$JQ.find(".sign").val()) {
            tip = "请输入签名";
        } else if(!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(<string>$JQ.find(".phone").val())) {
            tip = "请输入正确的手机号";
        } else if(!$JQ.find(".birthday").val()) {
            tip = "请选择生日日期";
        } else if(!$JQ.find(".reason").val()) {
            tip = "请输入推送内容";
        };

        if(tip) {
            (<any>window).layer.msg(tip);
            return false;
        };

        return true;
    };

    /**
     * 获取需要提交的消息数据
     * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
     * @return {object} option {提交数据}
     */
    getMessage($JQ:JQuery<HTMLElement>) : any {
        let option:any = {
            "name":$JQ.find(".nickname").val(), // 昵称
            "sign":$JQ.find(".sign").val(), // 签名
            "sex":parseInt(<string>$JQ.find(".operation").val()),    // 性别
            "text":$JQ.find(".reason").val(),   // 推送内容
            "head_img":"",  // 头像url
            "phone":$JQ.find(".phone").val(),   // 手机
            "birthday":0,  // 生日日期
            "token":this.mainView.mainView.token
        };

        // 获取生日日期
        let date:Date = new Date(<string>$JQ.find(".birthday").val());
        option.birthday = parseInt(<any>(date.getTime()/1000));

        return option;
    }

    /**
     * 页码变更
     * @param {number} pageNo [页码]
     * @param {number} pageSize [每页条数]
     */
    changePading(pageNo:number,pageSize:number) {
        this.fetch(pageNo,pageSize);
    }

    /**
     * 获取表单提交的返回信息
     * @param {HTMLElement} e [表单元素]
     */
    getFormReturn(e:HTMLElement) {
        var data = e[0].contentWindow.document.body.innerText;
        if(data) {
            data = JSON.parse(data);
        } else {
            (<any>window).layer.msg("提交失败!");
        };
    }
}

window["Process"] = RobotList;