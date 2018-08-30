/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/payStatisticalTemp.html","text!model/chart/views/payStatisticalDetail.html"],function(payStatisticalTemp,payStatisticalDetail){
    // 付费统计
    class PayStatistical extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        template = {
            "routerTemp":payStatisticalTemp,
            "detail":payStatisticalDetail
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         * @param {number} pageSize [每页条数]
         * @param {uid} string [用户编号]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize) {
            let self:PayStatistical = this;

            _load(true);
            (<Function>_resource.payStatistical)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "day":0,
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
         * @param {object} data [数据]
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(false,false,true);
            
            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-payStatistical");
            this.bindEvent();
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

        /**
         * 日期变更（为了头部选择日期之后进行触发）
         * @param {string} start [开始日期]
         * @param {string} end [结束日期]
         */
        changeDate(start:string,end:string) {
            this.fetch()
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    return PayStatistical;
});