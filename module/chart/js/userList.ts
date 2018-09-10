/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/userListTemp.html","text!module/chart/views/userListDetail.html"],function(userListTemp,userListDetail){
    // 用户列表
    class UserList extends ChartBase {
        $currentForzen:JQuery<HTMLElement> = null;  // 当前需要冻结的对象
        $el:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":userListTemp,
            "detail":userListDetail
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
        fetch(pageNo:number = 1,pageSize:number = _pageSize,uid:number = 0) {
            let self:UserList = this;
            
            _load(true);
            (<Function>_resource.userList)(JSON.stringify({
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
         * @param {Object} data [数据]
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-userList");

            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:UserList = this;

            // 冻结
            this.$el.find(".info").on("click",".btn-freeze",function(){
                let $this:JQuery<HTMLElement> = $(this),
                $td:JQuery<HTMLElement> = $this.parent("td");

                self.$currentForzen = $this;
                self.mainView.mainView.frozenInfo.show(parseInt($td.attr("uid")),$td.attr("uname"),self);
            });

            // 赠送钻石
            this.$el.find(".info").on("click",".btn-diamond",function(){
                let $td:JQuery<HTMLElement> = $(this).parent("td");
                self.mainView.mainView.givDiamond.show(parseInt($td.attr("uid")));
            });

            // 设置玩家为系统用户
            this.$el.find(".info").on("click",".btn-system",function(){
                let $this:JQuery<HTMLElement> = $(this),
                $td:JQuery<HTMLElement> = $(this).parent("td");

                if($this.hasClass("btn-red")) {
                    (<any>window).layer.confirm(`是否设置编号${$td.attr("uid")}的玩家为非系统用户？`,function(e){
                        (<Function>_resource.setSystemUser)(JSON.stringify({
                            "uid":parseInt($td.attr("uid")),
                            "is_sys_user":0,
                            "token":self.mainView.mainView.token
                        }),function(){
                            (<any>window).layer.msg("设置成功");
                            $this.removeClass("btn-red").text("设置权限");
                            (<any>window).layer.close(e);
                        });
                    });
                } else {
                    (<any>window).layer.confirm(`是否设置编号${$td.attr("uid")}的玩家为系统用户？`,function(e){
                        (<Function>_resource.setSystemUser)(JSON.stringify({
                            "uid":parseInt($td.attr("uid")),
                            "is_sys_user":1,
                            "token":self.mainView.mainView.token
                        }),function(){
                            (<any>window).layer.msg("设置成功");
                            $this.addClass("btn-red").text("取消权限");
                            (<any>window).layer.close(e);
                        });
                    });
                };
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

        /**
         * 冻结
         */
        frozen() {
            this.$currentForzen.prop("disabled",true);
        }
    }

    return UserList;
});