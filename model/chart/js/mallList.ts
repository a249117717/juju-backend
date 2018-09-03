/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/mallListTemp.html","text!model/chart/views/mallListDetail.html","text!model/chart/views/mallListUpdate.html"],function(mallListTemp,mallListDetail,mallListUpdate){
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
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize) {
            let self:MallList = this;
            self.render({});

            // _load(true);
            // (<Function>_resource.mallList)(JSON.stringify({
            //     "page_size":pageSize,
            //     "page_index":pageNo,
            //     "token":this.mainView.mainView.token
            // }),function(data:any){
            //     if(!self.$el) {
            //         self.render(data);
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

            // 新增框的类型选择
            this.$add.find(".operation").on("change",function(){
                let $this:JQuery<HTMLElement> = $(this);
                
                // 切换商品类型
                switch($this.val()) {
                    case "1":   // 类型为钻石，则显示赠送钻石输入框
                        self.$add.find(".reducePrice-out").hide();
                        self.$add.find(".gitDiamon-out").show();
                    break;
                    case "2":   // 类型为会员，则显示钻石数量框
                        self.$add.find(".gitDiamon-out").hide();
                        self.$add.find(".reducePrice-out").show();
                    break;
                }
            });
            
            // 表单内输入框的正整数校验
            this.$add.find(".gitDiamon,.diamonNumber,.reducePrice,.produceId,.price").on("input",function(){
                let $this:JQuery<HTMLElement> = $(this),
                val:string = <string>$this.val();

                if(/^\d*$/.test(val) && parseInt(val) >= 0) {
                    $this.attr("old",<string>$this.val());
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
        dataCheck($JQ:JQuery<HTMLElement>) : boolean {
            let tip:string = "";

            if(!$JQ.find(".diamonNumber").val()) {
                tip = "请输入钻石数量";
            } else if($JQ.find(".operation:checked").val() == 1 && !$JQ.find(".gitDiamon").val()) {
                tip = "请输入赠送钻石数量";
            } else if($JQ.find(".operation:checked").val() == 2 && !$JQ.find(".reducePrice").val()) {
                tip = "请输入立减价格";
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
                "give_num":0,    // 当type=1时，give_num是赠送的钻石数量,当type=2时,give_num是优惠价,要乘以100传到后端
                "product_id":parseInt(<string>$JQ.find(".produceId").val()),   // 苹果对应的商品id
                "price":<number>$JQ.find(".price").val() * 100, // 价格,要乘以100再传到后端来
                "token":this.mainView.mainView.token
            };
            
            // 商品类型
            switch($JQ.find(".operation:checked").val()) {
                case "1":   // 钻石：赠送的钻石数量
                    option.give_num = parseInt(<string>$JQ.find(".gitDiamon").val());
                break;
                case "2":   // 会员：立减价格
                    option.give_num = <number>$JQ.find(".reducePrice").val() * 100;
                break;
            };

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
    }

    return MallList;
});