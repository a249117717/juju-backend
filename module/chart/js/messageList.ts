/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/messageListTemp.html","text!module/chart/views/messageListDetail.html","text!module/chart/views/messageListUpdate.html"],function(messageListTemp,messageListDetail,messageListUpdate){
    // 消息列表
    class MessageList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;    // 新增消息
        $update:JQuery<HTMLElement> = null;    // 更新消息
        uid:number = 0; // 用户编号
        template = { // 模板
            "routerTemp":messageListTemp,
            "detail":messageListDetail,
            "update":messageListUpdate
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
            let self:MessageList = this;
            _load(true);
            (<Function>_resource.messageList)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "uid":this.uid,
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
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-messageList");
            this.$add = this.$el.find(".addMessage");
            this.$update = this.$el.find(".updateMessage");

            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:MessageList = this;

            // 重置新增消息框
            this.$add.find(".btn-reset").on("click",() => {
                (<HTMLFormElement>this.$add.find("form")[0]).reset();
            });

            // 新增消息确定按钮
            this.$add.find(".btn-submit").on("click",function(){
                if(!self.messageCheck(self.$add)) {
                    return;
                };
                
                (<any>window).layer.confirm("是否确认新增消息",function(e){
                    _load(true);
                    (<Function>_resource.addMessage)(JSON.stringify(self.getMessage(self.$add)),function(data){
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

            // 新增消息发送时间
            (<any>window).laydate.render({
                elem: '.m-addContent .sendTime',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });

            // 发送对象选择(新增消息)
            this.$add.find(".operation").on("change",function(){
                let $this:JQuery<HTMLElement> = $(this);

                switch($this.val()) {
                    case "0":
                        self.$add.find(".inputUid").hide().find(".uid").val("");
                    break;
                    case "1":
                        self.$add.find(".inputUid").show().find(".uid").focus();
                    break;
                };
            });

            // 删除
            this.$el.find(".detail").on("click",".btn-delete",function(){
                let $this:JQuery<HTMLElement> = $(this),
                mid:number = parseInt($this.attr("mid"));
                (<any>window).layer.confirm(`确认删除编号为${mid}的消息么？`,function(e){
                    (<Function>_resource.deleteMessage)(JSON.stringify({
                        "id":mid,
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
                self.showUpdate($(this));
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
                if(!self.messageCheck(self.$update)) {
                    return;
                };

                (<any>window).layer.confirm("确认更新消息么？",function(e){
                    _load(true);
                    (<Function>_resource.updateMeesage)(JSON.stringify(self.getMessage(self.$update)),function(data){
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
         * 消息数据校验
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
         */
        messageCheck($JQ:JQuery<HTMLElement>) : boolean {
            let tip:string = "",
            uid:any = (<string>$JQ.find(".uid").val()).replace(/\s/g,"");

            if($JQ.find(".operation:checked").val() == "1" && (!uid || !/^\d*$/.test(uid))){
                // 发送对象为个人且用户编号未填写或者填写的用户编号不为正整数
                if(!uid) {
                    tip = "请输入用户编号";
                } else if(!/^\d*$/.test(uid)) {
                    tip = "请填写正确的用户编号"
                };
            } else if(!$JQ.find(".sendTime").val()) {
                // 发送时间
                tip = "请选择发送时间";
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
         * 获取需要提交的消息数据
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {object} option {提交数据}
         */
        getMessage($JQ:JQuery<HTMLElement>) : any {
            let option:any = null;

            if($JQ.hasClass("addMessage")) {    // 新增消息
                option =  {
                    "uid":0,    // 用户编号,0表示全服
                    "content":"",   // 消息内容
                    "send_time":0,  // 发送时间
                    "token":this.mainView.mainView.token
                };
            } else if($JQ.hasClass("updateMessage")) {  // 更新消息
                option = {
                    "id":parseInt(<string>$JQ.find(".mid").val()), // 消息编号
                    "uid":0,    // 用户编号,0表示全服
                    "content":"",   // 消息内容
                    "send_time":0,  // 发送时间
                    "token":this.mainView.mainView.token
                };
            };

            // 获取用户编号
            switch($JQ.find(".operation:checked").val()) {
                case "0":
                    option.uid = 0;
                break;
                case "1":
                    option.uid = parseInt(<string>$JQ.find(".uid").val());
                break;
            };

            // 获取提交时间
            let date:Date = new Date(<string>$JQ.find(".sendTime").val());
            option.send_time = parseInt(<any>(date.getTime()/1000));
            
            // 获取消息内容
            option.content = $JQ.find(".reason").val();

            return option;
        }

        /**
         * 打开更新消息框
         * @param {JQuery<HTMLElement>} $obj [点击的JQ对象]
         */
        showUpdate($obj:JQuery<HTMLElement>) {
            let $tr:JQuery<HTMLElement> = $obj.parents("tr");

            this.$update.show();
            setTimeout(() => {
                this.$update.addClass("active");
            },10);

            this.initUpdate({
                "mid":parseInt($obj.attr("mid")),
                "uid":parseInt($obj.attr("uid")),
                "send_time":<string>$tr.find(".mtime").text(),
                "content":<string>$tr.find(".mcontent").text()
            });
        }

        /**
         * 初始化更新消息框
         * @param {JSON} initData [数据]
         */
        initUpdate(initData:UpdateInitData) {
            this.$update.find(".input-group").html((<any>window).template.compile(this.template.update)(initData));
            this.updateBindEvent();
            // 操作对象
            switch(initData.uid) {
                case 0:
                    this.$update.find(".operation:eq(0)").prop("checked",true).trigger("change");
                break;
                default:
                    this.$update.find(".operation:eq(1)").prop("checked",true).trigger("change");
                    this.$update.find(".uid").val(initData.uid);
                break;
            };
        };

        /**
         * 更新框的事件绑定
         */
        updateBindEvent() {
            let self:MessageList = this;

            // 发送对象选择(更新消息)
            this.$update.find(".operation").on("change",function(){
                let $this:JQuery<HTMLElement> = $(this);

                switch($this.val()) {
                    case "0":
                        self.$update.find(".inputUid").hide().find(".uid").val("");
                    break;
                    case "1":
                        self.$update.find(".inputUid").show().find(".uid").focus();
                    break;
                };
            });

            // 更新消息发送时间
            (<any>window).laydate.render({
                elem: '.m-updateContent .sendTime',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm',
                value: this.$update.find(".sendTime").val()
            });
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
         * 搜索
         * @param {string} query [搜索关键字]
         */
        search(query:string) {
            if(!/^\d*$/.test(query)) {
                (<any>window).layer.msg("请填写正确的用户编号");
            } else {
                if(query) {
                    this.uid = parseInt(query);
                } else {
                    this.uid = 0;
                };
                this.fetch(undefined,undefined);
            };
        }
    }

    /**
     * 更新框的初始化数据格式
     */
    interface UpdateInitData {
        /**
         * 消息编号
         */
        mid:number
        /**
         * 用户编号,0表示全服,非0表示具体玩家
         */
        uid:number
        /**
         * 发送时间
         */
        send_time:string
        /**
         * 消息内容
         */
        content:string
    }

    return MessageList;
});