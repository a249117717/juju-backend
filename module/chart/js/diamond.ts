/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/diamondTemp.html","text!module/chart/views/diamondDetail.html"],function(diamondTemp,diamondDetail){
    // 钻石流水
    class Diamond extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":diamondTemp,
            "detail":diamondDetail
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         * @param {uid} string [用户编号]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize,uid:number = 0) {
            let self:Diamond = this;

            _load(true);
            (<Function>_resource.diamond)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "uid":uid,
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
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-diamond");
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
         * 搜索
         * @param {string} query [搜索关键字]
         */
        search(query:string) {
            if(!/^\d*$/.test(query)) {
                (<any>window).layer.msg("请填写正确的用户编号");
            } else {
                this.fetch(undefined,this.pading.pageSize,query?parseInt(query):undefined);
            };
        }
    }

    return Diamond;
});