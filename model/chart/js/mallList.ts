/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/mallListTemp.html","text!model/chart/views/mallListDetail.html"],function(mallListTemp,mallListDetail){
    // 商城商品
    class MallList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":mallListTemp,
            "detail":mallListDetail
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
            // (<Function>_resource.robotList)(JSON.stringify({
            //     "page_size":pageSize,
            //     "page_index":pageNo,
            //     "token":this.mainView.mainView.token
            // }),function(data:any){
            //     if(!self.$el) {
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
            this.$el = $(".m-mallList");
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
        }

        /**
         * 渲染详情
         * @param {Object} data [数据]
         */
        renderDetail(data:any) {
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