/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/freezeListTemp.html","text!module/chart/views/freezeListDetail.html"],function(freezeListTemp,freezeListDetail){
    // 冻结名单
    class FreezeList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":freezeListTemp,
            "detail":freezeListDetail
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
            let self:FreezeList = this;

            _load(true);
            (<Function>_resource.freezeList)(JSON.stringify({
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
            header.showSearch();
            header.setPlaceHolder("请输入用户编号");

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-freezeList");
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:FreezeList = this;

            // 解冻
            this.$el.find(".info").on("click",".btn-delFreeze",function(){
                let $this:JQuery<HTMLElement> = $(this),
                uid:string = $this.attr("uid"),
                uname:string = $this.attr("uname");

                (<any>window).layer.confirm(`确认解除用户编号为:${uid}，用户名为:${uname}的冻结么？`,{
                    btn:['确定','取消']
                },function(e){
                    _load(true);
                    (<Function>_resource.delFrozen)(JSON.stringify({
                        "uid":parseInt(uid),
                        "token":self.mainView.mainView.token
                    }),function(data:any){
                        (<any>window).layer.msg(data.msg);
                        $this.prop("disabled",true);
                        (<any>window).layer.close(e);
                        _load(false);
                    });
                },function(e){
                    (<any>window).layer.close(e);
                });
            });

            // 更新
            this.$el.find(".info").on("click",".btn-update",function(){
                let $this:JQuery<HTMLElement> = $(this);
                self.mainView.mainView.frozenInfo.show(parseInt($this.attr("uid")),$this.attr("uname"),self,<string>$this.parents("tr").find(".reason").text(),parseInt($this.attr("stime")));
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

    return FreezeList;
});