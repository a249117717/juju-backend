/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/orderListTemp.html","text!model/chart/views/orderListDetail.html"],function(orderListTemp,orderListDetail){
    // 订单列表
    class OrderList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        select:string = "30,50,100,200"; // 翻页下拉列表
        selected:number = 30;    // 默认翻页

        template = { // 模板
            "routerTemp":orderListTemp,
            "detail":orderListDetail
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         * @param {number} start [开始时间戳，默认为0]
         * @param {number} end [结束时间戳，默认为0]
         */
        fetch(pageNo:number = 1,pageSize:number = this.selected,start?:number,end?:number) {
            let self:OrderList = this;

            _load(true);
            (<Function>_resource.orderList)(JSON.stringify({
                "start_time":start,
                "end_time":end,
                "page_size":pageSize,
                "page_index":pageNo,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(!self.$el) {
                    data["select"] = self.select;
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
         * @param {object} data [数据]
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(false,true);

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-orderList");
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:OrderList = this;

            this.$el.find(".detail").on("click",".btn-elivery",function(){
                let $this:JQuery<HTMLElement> = $(this);

                (<any>window).layer.confirm(`编号为${$this.attr("oid")}的订单是否交货？`,function(e){
                    (<Function>_resource.deliveryOrder)(JSON.stringify({
                        "id":parseInt($this.attr("oid")),
                        "token":self.mainView.mainView.token
                    }),function(){
                        $this.prop("disabled",true);
                        (<any>window).layer.msg("交货成功");
                        (<any>window).layer.close(e);
                    });
                });
            })
        }

        /**
         * 渲染详情
         * @param {Object} data [数据]
         */
        renderDetail(data:any) {
            this.$el.find(".info").html((<any>window).template.compile(this.template.detail)(data));
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

    return OrderList;
});