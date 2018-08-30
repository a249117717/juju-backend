/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/infoQueryTemp.html","text!model/chart/views/infoQueryDetail.html"],function(infoQueryTemp,infoQueryDetail){
    // 信息查询
    class InfoQuery extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $question:JQuery<HTMLElement> = null;
        $detail:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":infoQueryTemp,
            "detail":infoQueryDetail
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         * @param {number} uid [用户编号]
         */
        fetch(uid:number) {
            this.render();
        }

        /**
         * 页面渲染
         */
        render() {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)({}));
            this.$el = $(".m-infoQuery");
            this.$question = this.$el.find(".question");
            this.$detail = this.$el.find(".detail");
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
            this.$question.hide();
            this.$detail.show();
            this.$detail.find(".info-out").html((<any>window).template.compile(this.template.detail)(data));
        }

        /**
         * 搜索
         * @param {string} query [搜索关键字]
         */
        search(query:string) {
            let self:InfoQuery = this;

            if(/^\d*$/.test(query)){
                _load(true);
                (<Function>_resource.infoQuery)(JSON.stringify({
                    "uid":parseInt(query),
                    "token":this.mainView.mainView.token
                }),function(data:any){
                    self.renderDetail(data);
                    _load(false);
                });
            } else {
                this.$question.show();
                this.$detail.hide();
                (<any>window).layer.msg("请输入正确的用户编号");
            };
        }
    }

    return InfoQuery;
});