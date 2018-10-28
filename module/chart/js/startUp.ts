/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/startUpTemp.html","text!module/chart/views/startUpDetail.html","text!module/chart/views/startUpUpdate.html"],function(startUpTemp,startUpDetail,startUpUpdate){
    // 注册欢迎消息
    class StartUp extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;    // 新增欢迎消息
        $update:JQuery<HTMLElement> = null;    // 更新欢迎消息
        template = { // 模板
            "routerTemp":startUpTemp,
            "detail":startUpDetail,
            "update":startUpUpdate
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
            let self:StartUp = this;
            _load(true);
            // let data = {count:1};
            (<Function>_resource.StartUpList)(JSON.stringify({
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
            this.$el = $(".m-startUp");
            this.$add = this.$el.find(".addNotice");
            this.$update = this.$el.find(".updateNotice");

            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:StartUp = this;

            // 重置新增消息框
            this.$add.find(".btn-reset").on("click",() => {
                (<HTMLFormElement>this.$add.find("form")[0]).reset();
            });

            // 新增消息确定按钮
            this.$add.find(".btn-submit").on("click",function(){
                if(!self.messageCheck(self.$add)) {
                    return;
                };
                
                (<any>window).layer.confirm("是否确认新增公告",function(e){
                    _load(true);
                    (<Function>_resource.addStartUp)(JSON.stringify(self.getMessage(self.$add)),function(data){
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

            // 删除
            this.$el.find(".detail").on("click",".btn-delete",function(){
                let $this:JQuery<HTMLElement> = $(this),
                nid:number = parseInt($this.attr("nid"));
                (<any>window).layer.confirm(`确认删除编号为${nid}的公告么？`,function(e){
                    (<Function>_resource.deleteStartUp)(JSON.stringify({
                        "id":nid,
                        "token":self.mainView.mainView.token
                    }),function(data){
                        // 让本条数据的所有按钮全部不能点击
                        $this.prop("disabled",true).siblings("").prop("disabled",true);
                        (<any>window).layer.msg("删除成功");
                        (<any>window).layer.close(e);
                    });
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
                if(!self.messageCheck(self.$update)) {
                    return;
                };

                (<any>window).layer.confirm("确认更新消息么？",function(e){
                    _load(true);
                    (<Function>_resource.updateSNotice)(JSON.stringify(self.getMessage(self.$update)),function(data){
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
         * 内容数据校验
         * @param {JQuery<HTMLElement>} $JQ [jQuery对象]
         * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
         */
        messageCheck($JQ:JQuery<HTMLElement>) : boolean {
            let tip:string = "";

            if(!(<string>$JQ.find(".reason").val()).replace(/\s/g,"")) {
                tip = "请填写发送的消息内容";
            };

            if(tip) {
                (<any>window).layer.msg(tip);
                return false;
            };

            return true;
        }

        /**
         * 获取需要提交的欢迎消息
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {object} option {提交数据}
         */
        getMessage($JQ:JQuery<HTMLElement>) {
            let option:any = {
                "msg":$JQ.find(".reason").val(),    // 消息内容
                "status":parseInt(<string>$JQ.find(".operation:checked").val()), // 是否启用
                "token":this.mainView.mainView.token
            };

            // 更新消息需要传编号信息
            if($JQ.hasClass("updateNotice")) {
                option["id"] = parseInt(<string>$JQ.find(".nid").val()) // 消息编号
            };

            return option;
        }

        /**
         * 打开更新消息框
         * @param {JQuery<HTMLElement>} $obj [点击的JQ对象]
         */
        showUpdate($obj:JQuery<HTMLElement>) {
            this.initUpdate({
                "nid":parseInt($obj.attr("nid")),
                "msg":$obj.parents("tr").find(".ncontent").text(),
                "status":parseInt($obj.attr("status"))
            });
            
            this.showOrHideByAni(this.$update);
        }

        /**
         * 初始化更新消息框
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
        "nid":number
        /**
         * 消息内容
         */
        "msg":string
        /**
         * 是否启用
         */
        "status":number
    }

    return StartUp;
});