/// <reference path="../../../js/charts.d.ts" />

// 系统公告
class SystemNotice extends ChartBase {
    $el:JQuery<HTMLElement> = null;
    $add:JQuery<HTMLElement> = null;    // 增加公告
    $update:JQuery<HTMLElement> = null;    // 更新公告
    
    template = { // 模板
        "routerTemp":"systemNoticeTemp",
        "detail":"systemNoticeDetail"
    };

    constructor(props:any) {
        super(props);
    }

    /**
     * 获取数据
     * @param {number} pageNo [页码]
     * @param {number} pageSize [每页条数]
     * @param {uid} string [用户编号]
     */
    fetch(pageNo:number = 1,pageSize:number = _pageSize) {
        let self:SystemNotice = this;
        _load(true);
        (<Function>_resource.sNoticeList)(JSON.stringify({
            "page_size":pageSize,
            "page_index":pageNo,
            "token":this.mainView.mainView.token
        }),function(data:any){
            if(!this.activation) {
                self.render(data);
            } else {
                // 设置总页数
                self.pading.setTotal(data.count);
            };
            self.renderDetail(data)
            _load(false);
        });
    }

    /**
     * 页面渲染
     * @param {Object} data [数据]
     */
    render(data:any) {
        let header:CHeader = this.mainView.mainView.header;
        header.showMenu();

        this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
        this.$el = $(".m-systemNotice");
        this.$add = this.$el.find(".addNotice");
        this.$update = this.$el.find(".updateNotice");

        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:SystemNotice = this;

        // 重置增加消息框
        this.$add.find(".btn-reset").on("click",() => {
            (<HTMLFormElement>this.$add.find("form")[0]).reset();
        });

        // 增加消息确定按钮
        this.$add.find(".btn-submit").on("click",function(){
            if(!self.noticeCheck(self.$add)) {
                return;
            };
            
            (<any>window).layer.confirm("是否确认增加公告",function(e){
                _load(true);
                (<Function>_resource.addSNotice)(JSON.stringify(self.getNotice(self.$add)),function(data){
                    // 重置新增框
                    self.$add.find(".btn-reset").click();
                    // 刷新数据列表
                    self.fetch();
                    (<any>window).layer.msg("增加成功");
                    (<any>window).layer.close(e);
                    _load(false);
                })
            });
        });

        // 增加消息开始时间
        (<any>window).laydate.render({
            elem: '.m-addContent .startDate',
            type: 'datetime',
            theme: '#42a5f5',
            format: 'yyyy-MM-dd HH:mm'
        });

        // 增加消息结束时间
        (<any>window).laydate.render({
            elem: '.m-addContent .endDate',
            type: 'datetime',
            theme: '#42a5f5',
            format: 'yyyy-MM-dd HH:mm'
        });

        // 更新消息开始时间
        (<any>window).laydate.render({
            elem: '.m-updateContent .startDate',
            type: 'datetime',
            theme: '#42a5f5',
            format: 'yyyy-MM-dd HH:mm'
        });

        // 更新消息结束时间
        (<any>window).laydate.render({
            elem: '.m-updateContent .endDate',
            type: 'datetime',
            theme: '#42a5f5',
            format: 'yyyy-MM-dd HH:mm'
        });

        // 发送间隔输入
        this.$add.find(".inter").on("input",function(){
            let $this:JQuery<HTMLElement> = $(this),
            val:string = <string>$this.val();

            if(/^\d*$/.test(val) && parseInt(val) > 0) {
                $this.attr("old",<string>$this.val());
            } else {
                $this.val($this.attr("old"));
                (<any>window).layer.tips('请输入大于0的正整数', self.$add.find(".inter")[0], {
                    tips: [1, '#FF9800'],
                    time: 2000
                });
            };
        });

        // 删除
        this.$el.find(".detail").on("click",".btn-delete",function(){
            let $this:JQuery<HTMLElement> = $(this),
            nid:number = parseInt($this.attr("nid"));
            (<any>window).layer.confirm(`确认删除编号为${nid}的公告么？`,function(e){
                (<Function>_resource.deleteSNotice)(JSON.stringify({
                    "id":nid,
                    "token":self.mainView.mainView.token
                }),function(data){
                    $this.prop("disabled",true);
                    (<any>window).layer.msg("删除成功");
                    (<any>window).layer.close(e);
                });
            });
        });

        // 更新
        this.$el.find(".detail").on("click",".btn-update",function(){
            let $this:JQuery<HTMLElement> = $(this),
            $tr:JQuery<HTMLElement> = $this.parents("tr");

            self.showUpdateNotice(parseInt($this.attr("nid")),<string>$tr.find(".startDate").text(),<string>$tr.find(".endDate").text(),parseInt(<string>$tr.find(".inter").text()),<string>$tr.find(".ncontent").text())
        });

        // 取消
        this.$update.find(".btn-cancel").on("click",() => {
            this.$update.removeClass("active");
            setTimeout(() => {
                this.$update.hide()
            },200);
        });

        // 更新消息确定按钮
        this.$update.on("click",".btn-submit",function(){
            if(!self.noticeCheck(self.$update)) {
                return;
            };

            (<any>window).layer.confirm("确认更新消息么？",function(e){
                _load(true);
                (<Function>_resource.updateSNotice)(JSON.stringify(self.getNotice(self.$update)),function(data){
                    self.$update.find(".btn-cancel").click();
                    self.fetch(self.pading.pageNo,self.pading.pageSize);
                    (<any>window).layer.msg("更新成功");
                    (<any>window).layer.close(e);
                    _load(false);
                });
            });
        });

        // 发送间隔输入
        this.$update.find(".inter").on("input",function(){
            let $this:JQuery<HTMLElement> = $(this),
            val:string = <string>$this.val();

            if(/^\d*$/.test(val) && parseInt(val) > 0) {
                $this.attr("old",<string>$this.val());
            } else {
                $this.val($this.attr("old"));
                (<any>window).layer.tips('请输入大于0的正整数', self.$update.find(".inter")[0], {
                    tips: [1, '#FF9800'],
                    time: 2000
                });
            };
        });
    }

    /**
     * 渲染详情
     * @param {Object} data [数据]
     */
    renderDetail(data:any) {
        this.$el.find(".info").html((<any>window).template.compile(this.template.detail)(data));
    }

    /**
     * 公告数据校验
     * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
     * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
     */
    noticeCheck($JQ:JQuery<HTMLElement>) : boolean {
        let tip:string = "",
        startDate:string = <string>$JQ.find(".startDate").val(),
        endDate:string = <string>$JQ.find(".endDate").val();

        if(!startDate) {
            // 开始时间
            tip = "请选择开始时间";
        } else if(!endDate) {
            // 结束时间
            tip = "请选择结束时间";
        } else if(startDate.replace(/\s|[-]|[:]/g,"") > endDate.replace(/\s|[-]|[:]/g,"")) {
            // 开始时间不能大于结束时间
            tip = "开始时间不能大于结束时间，请重新选择";
        } else if(!$JQ.find(".inter").val()){
            // 发送间隔
            tip = "请输入发送间隔";
        } else if(!(<string>$JQ.find(".reason").val()).replace(/\s/g,"")) {
            // 消息内容为空
            tip = "请填写消息内容";
        };

        if(tip) {
            (<any>window).layer.msg(tip);
            return false;
        };

        return true;
    }

    /**
     * 初始化增加公告框
     * @param {boolean} isRender [是否渲染列表，默认为false]
     */
    initAddNotice(isRender:boolean = false) {
        // 清空开始时间，结束时间，发送间隔和公告内容
        this.$add.find(".startDate,.endDate,.inter,.reason").val("");

        if(isRender) {
            this.fetch();
        };
    }

    /**
     * 获取需要提交的公告数据
     * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
     * @return {object} option {提交数据}
     */
    getNotice($JQ:JQuery<HTMLElement>) {
        let option:any = null;

        if($JQ.hasClass("addNotice")) {    // 增加消息
            option =  {
                "start_time":0,    // 开始时间
                "end_time":"",   // 结束时间
                "interval":parseInt(<string>$JQ.find(".inter").val()),  // 发送间隔
                "content":"",   // 公告内容
                "token":this.mainView.mainView.token
            };
        } else if($JQ.hasClass("updateNotice")) {  // 更新消息
            option = {
                "id":parseInt(<string>$JQ.find(".nid").val()), // 消息编号
                "start_time":0,    // 开始时间
                "end_time":"",   // 结束时间
                "interval":parseInt(<string>$JQ.find(".inter").val()),  // 发送间隔
                "content":"",   // 公告内容
                "token":this.mainView.mainView.token
            };
        };

        
        // 获取开始时间
        let date:Date = new Date(<string>$JQ.find(".startDate").val());
        option.start_time = parseInt(<any>(date.getTime()/1000));
        // 获取结束时间
        date = new Date(<string>$JQ.find(".endDate").val());
        option.end_time = parseInt(<any>(date.getTime()/1000));

        // 获取消息内容
        option.content = $JQ.find(".reason").val();

        return option;
    }

    /**
     * 打开更新公告框
     * @param {number} nid [消息编号]
     * @param {string} startDate [开始时间]
     * @param {string} endDate [结束时间]
     * @param {number} inter [发送间隔]
     * @param {string} content [消息内容]
     */
    showUpdateNotice(nid:number,startDate:string,endDate:string,inter:number,content:string) {
        this.$update.show();
        setTimeout(() => {
            this.$update.addClass("active");
        },10);

        this.initUpdateMessage(nid,startDate,endDate,inter,content);
    }

    /**
     * 初始化更新公告框
     * @param {number} nid [消息编号]
     * @param {string} startDate [开始时间]
     * @param {string} endDate [结束时间]
     * @param {number} inter [发送间隔]
     * @param {string} content [消息内容]
     */
    initUpdateMessage(nid:number,startDate:string,endDate:string,inter:number,content:string) {
        let $update:JQuery<HTMLElement> = this.$update;

        // 消息编号
        $update.find(".nid").val(nid);
        // 开始时间
        $update.find(".startDate").val(startDate);
        // 结束时间
        $update.find(".endDate").val(endDate);
        // 发送间隔
        $update.find(".inter").val(inter).attr("old",inter);
        // 发送内容
        $update.find(".reason").val(content);
    };

    /**
     * 页码变更
     * @param {number} pageNo [页码]
     * @param {number} pageSize [每页条数]
     */
    changePading(pageNo:number,pageSize:number) {
        this.fetch(pageNo,pageSize);
    }
}

window["Process"] = SystemNotice;