/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/mallListTemp.html","text!module/chart/views/mallListDetail.html","text!module/chart/views/mallListUpdate.html"],function(mallListTemp,mallListDetail,mallListUpdate){
    // 商城商品
    class MallList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;
        $update:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":mallListTemp,
            "detail":mallListDetail,
            "update":mallListUpdate
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         */
        fetch() {
            let self:MallList = this;

            _load(true);
            (<Function>_resource.mallList)(JSON.stringify({
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(!self.$el) {
                    self.render(data);
                };
                self.renderDetail(data)
                _load(false);
            });
        }

        /**
         * 页面渲染
         * @param {object} data [数据]
         */
        render(data:any) {
            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-mallList");
            this.$add = this.$el.find(".m-addContent");
            this.$update = this.$el.find(".m-updateContent");
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:MallList = this;

            // 新增框的重置按钮
            this.$add.find(".btn-reset").on("click",() => {
                (<HTMLFormElement>this.$add.find("form")[0]).reset();
            });

            // 新增框的确定按钮
            this.$add.find(".btn-submit").on("click",function() {
                if(!self.dataCheck(self.$add)) {
                    return;
                };

                (<any>window).layer.confirm("是否确认新增商城商品",function(e){
                    _load(true);
                    (<Function>_resource.addMall)(JSON.stringify(self.getSubmitData(self.$add)),function(data){
                        // 重置新增框
                        self.$add.find(".btn-reset").click();
                        // 刷新数据列表
                        self.fetch();
                        (<any>window).layer.msg("新增成功");
                        (<any>window).layer.close(e);
                        _load(false);
                    });
                });
            });
            
            // 表单内输入框的正整数校验
            this.$add.find(".gitDiamon,.diamonNumber,.reducePrice,.produceId,.price").on("input",function(){
                let $this:JQuery<HTMLElement> = $(this),
                val:string = <string>$this.val();

                if(/^\d*$/.test(val) && parseInt(val) >= 0) {
                    $this.attr("old",<string>$this.val());
                } else if(!val) {
                    $this.val("");
                } else {
                    $this.val($this.attr("old"));
                    (<any>window).layer.tips('请输入大于等于0的整数', $this[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                };
            });

            // 删除按钮
            this.$el.find(".detail").on("click",".btn-delete",function(){
                let $this:JQuery<HTMLElement> = $(this);

                (<any>window).layer.confirm(`是否删除编号为${$this.attr("mid")}的商品？`,function(e){
                    (<Function>_resource.DeleteMall)(JSON.stringify({
                        "id":parseInt($this.attr("mid")),
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

            // 更新框的取消按钮
            this.$update.find(".btn-cancel").on("click",() => {
                this.showOrHideByAni(this.$update,0);
            });

            // 更新消息确定按钮
            this.$update.on("click",".btn-submit",function(){
                if(!self.dataCheck(self.$update)) {
                    return;
                };

                (<any>window).layer.confirm("确认更新消息么？",function(e){
                    _load(true);
                    (<Function>_resource.updateMall)(JSON.stringify(self.getSubmitData(self.$update)),function(data){
                        self.$update.find(".btn-cancel").click();
                        self.fetch();
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
         * 打开更新框
         * @param {JQuery<HTMLElement>} $obj [点击的JQ对象]
         */
        showUpdate($obj:JQuery<HTMLElement>) {
            let $tr:JQuery<HTMLElement> = $obj.parents("tr"),
            head = $tr.find(".head .pho").attr("src"),
            mid:number = parseInt($obj.attr("mid"));
            // 如果照片为默认，则表示不存在
            head == "common/images/defaultUser.png"?"":head;

            this.initUpdate({
                "mid":mid,
                "type":$obj.attr("mtype"),
                "num":parseInt($tr.find(".num").text()),
                "give_num":parseInt($tr.find(".giveNum").text()),
                "discount_price":parseInt($tr.find(".discount_price").text()),
                "product_id":parseInt($tr.find(".pid").text()),
                "price":parseInt($tr.find(".price").text())
            });

            this.showOrHideByAni(this.$update);
        }

        /**
         * 初始化更新框
         * @param {JSON} initData [数据]
         */
        initUpdate(initData:UpdateInitData) {
            let $update:JQuery<HTMLElement> = this.$update;
            $update.find(".input-group").html((<any>window).template.compile(this.template.update)(initData));
            // 类型
            $update.find(".operation").eq(parseInt(initData.type) - 1).prop("checked",true);
            this.updateBindEvent();
        }

        /**
         * 更新框的事件绑定
         */
        updateBindEvent() {
            // 表单内输入框的正整数校验
            this.$update.find(".gitDiamon,.diamonNumber,.reducePrice,.produceId,.price").on("input",function(){
                let $this:JQuery<HTMLElement> = $(this),
                val:string = <string>$this.val();

                if(/^\d*$/.test(val) && parseInt(val) >= 0) {
                    $this.attr("old",<string>$this.val());
                } else if(!val) {
                    $this.val("");
                } else {
                    $this.val($this.attr("old"));
                    (<any>window).layer.tips('请输入大于等于0的整数', $this[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                };
            });
        }

        /**
         * 消息数据校验
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
         */
        dataCheck($JQ:JQuery<HTMLElement>) : boolean {
            let tip:string = "";

            if(!$JQ.find(".diamonNumber").val()) {
                tip = "请输入钻石数量";
            } else if(!$JQ.find(".produceId").val()) {
                tip = "请输入苹果商品ID";
            } else if(!$JQ.find(".price").val()) {
                tip = "请输入价格";
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
        getSubmitData($JQ:JQuery<HTMLElement>) : any {
            let option:any = {
                "type":parseInt(<string>$JQ.find(".operation:checked").val()), // 类型
                "num":parseInt(<string>$JQ.find(".diamonNumber").val()), // 钻石数量
                "give_num":(parseInt(<string>$JQ.find(".gitDiamon").val())) || 0,    // 钻石数量
                "discount_price":(<number>$JQ.find(".reducePrice").val() * 100) || 0, // 优惠价,要乘以100传到后端
                "product_id":parseInt(<string>$JQ.find(".produceId").val()),   // 苹果对应的商品id
                "price":<number>$JQ.find(".price").val() * 100, // 价格,要乘以100再传到后端来
                "token":this.mainView.mainView.token
            };

            if($JQ.is(".updateProcude")) {
                option["id"] = parseInt(<string>$JQ.find(".mid").val());
            };

            return option;
        }
    }

    interface UpdateInitData {
        /**
         * 商品编号
         */
        mid:number
        /**
         * 类型
         */
        type:string
        /**
         * 钻石数量
         */
        num:number
        /**
         * 钻石数量
         */
        give_num:number
        /**
         * 立减价格
         */
        discount_price:number
        /**
         * 苹果对应的商品id
         */
        product_id:number
        /**
         * 价格
         */
        price:number
    }

    return MallList;
});