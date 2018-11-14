/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/systemConfigTemp.html","text!module/chart/views/systemConfigDetail.html","text!module/chart/views/systemConfigUpdate.html"],function(systemConfigTemp,systemConfigDetail,systemConfigUpdate){
    // 系统配置
    class SystemConfig extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;    // 新增配置
        $update:JQuery<HTMLElement> = null;    // 更新配置
        template = { // 模板
            "routerTemp":systemConfigTemp,
            "detail":systemConfigDetail,
            "update":systemConfigUpdate
        };

        constructor(props:any) {
            super(props);
        }

        /**
         * 获取数据
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize) {
            let self:SystemConfig = this;
            _load(true);
            (<Function>_resource.systemConfigList)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(!self.$el) {
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
            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-systemConfig");
            this.$add = $(".m-addContent");
            this.$update = $(".m-updateContent");

            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:SystemConfig = this;

            // 重置新增消息框
            this.$add.find(".btn-reset").on("click",() => {
                (<HTMLFormElement>this.$add.find("form")[0]).reset();
            });

            // 新增消息确定按钮
            this.$add.find(".btn-submit").on("click",function(){
                if(!self.configCheck(self.$add)) {
                    return;
                };
                
                (<any>window).layer.confirm("是否确认新增配置",function(e){
                    _load(true);
                    (<Function>_resource.addSystemConfig)(JSON.stringify(self.getConfig(self.$add)),function(data){
                        // 重置新增框
                        self.$add.find(".btn-reset").click();
                        // 刷新数据列表
                        self.fetch();
                        (<any>window).layer.msg("新增成功");
                        (<any>window).layer.close(e);
                        _load(false);
                    })
                });
            });

            // 信息
            this.$el.find(".detail").on("click",".btn-info",function(){
                let $this:JQuery<HTMLElement> = $(this),
                nid:number = parseInt($this.attr("nid"));
                (<Function>_resource.SystemConfigInfo)(JSON.stringify({
                    "id":nid,
                    "token":self.mainView.mainView.token
                }),function(data){
                });
            });

            // 更新
            this.$el.find(".detail").on("click",".btn-update",function(){
                self.showUpdate($(this));
            });

            // 取消
            this.$update.find(".btn-cancel").on("click",() => {
                this.showOrHideByAni(this.$update,0);
            });

            // 更新消息确定按钮
            this.$update.on("click",".btn-submit",function(){
                if(!self.configCheck(self.$update)) {
                    return;
                };

                (<any>window).layer.confirm("确认更新消息么？",function(e){
                    _load(true);
                    (<Function>_resource.updateSystemConfig)(JSON.stringify(self.getConfig(self.$update)),function(data){
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo,self.pading.pageSize);
                        (<any>window).layer.msg("更新成功");
                        (<any>window).layer.close(e);
                        _load(false);
                    });
                });
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
         * 配置数据校验
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
         */
        configCheck($JQ:JQuery<HTMLElement>) : boolean {
            let tip:string = "";

            if(!(<string>$JQ.find(".configKey").val()).replace(/\s/g,"")) {
                tip = "请填写键";
            } else if(!(<string>$JQ.find(".configVal").val()).replace(/\s/g,"")) {
                tip = "请填写值";
            };

            if(tip) {
                (<any>window).layer.msg(tip);
                return false;
            };

            return true;
        }

        /**
         * 获取需要提交的配置数据
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {object} option {提交数据}
         */
        getConfig($JQ:JQuery<HTMLElement>) : object {
            let option:any = null;

            if($JQ.hasClass("m-addContent")) {    // 新增消息
                option =  {
                    "key":$JQ.find(".configKey").val(),    // 键
                    "value":$JQ.find(".configVal").val(),   // 值
                    "remark":$JQ.find(".reason").val(),   // 备注
                    "token":this.mainView.mainView.token
                };
            } else if($JQ.hasClass("m-updateContent")) {  // 更新消息
                option = {
                    "id":parseInt(<string>$JQ.find(".nid").val()), // 消息编号
                    "start_time":0,    // 开始时间
                    "end_time":"",   // 结束时间
                    "interval":parseInt(<string>$JQ.find(".inter").val()),  // 发送间隔
                    "content":"",   // 配置内容
                    "token":this.mainView.mainView.token
                };
            };

            return option;
        }

        /**
         * 打开更新配置框
         * @param {JQuery<HTMLElement>} $obj [点击的JQ对象]
         */
        showUpdate($obj:JQuery<HTMLElement>) {
            let $tr:JQuery<HTMLElement> = $obj.parents("tr");

            this.initUpdate({
                "nid":parseInt($obj.attr("nid")),
                "key":"",
                "value":"",
                "content":<string>$tr.find(".ncontent").text()
            });
            
            this.showOrHideByAni(this.$update);
        }

        /**
         * 初始化更新配置框
         * @param {JSON} initData [数据]
         */
        initUpdate(initData:UpdateInitData) {
            this.$update.find(".input-group").html((<any>window).template.compile(this.template.update)(initData));
            this.updateBindEvent();
        }

        /**
         * 更新框的事件绑定
         */
        updateBindEvent() {
            
        }

        /**
         * 页码变更
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        changePading(pageNo:number,pageSize:number) {
            this.fetch(pageNo,pageSize);
        }
    }

    /**
     * 更新框的初始化数据格式
     */
    interface UpdateInitData {
        /**
         * 消息编号
         */
        nid:number
        /**
         * 键
         */
        key:string
        /**
         * 值
         */
        value:string
        /**
         * 消息内容
         */
        content:string
    }

    return SystemConfig;
});