/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/mallListTemp.html","text!model/chart/views/mallListDetail.html"],function(mallListTemp,mallListDetail){
    // 商城商品
    class MallList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;
        $update:JQuery<HTMLElement> = null;
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

                (<any>window).layer.confirm("是否确认新增机器人弹幕",function(e){
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
                "name":$JQ.find(".nickname").val(), // 昵称
                "sign":$JQ.find(".sign").val(), // 签名
                "sex":parseInt(<string>$JQ.find(".operation").val()),    // 性别
                "text":$JQ.find(".reason").val(),   // 推送内容
                "head_img":"",  // 头像url
                "phone":$JQ.find(".phone").val(),   // 手机
                "birthday":0,  // 生日日期
                "token":this.mainView.mainView.token
            };

            // 获取生日日期
            let date:Date = new Date(<string>$JQ.find(".birthday").val());
            option.birthday = parseInt(<any>(date.getTime()/1000));

            if($JQ.is(".updateCurtain")) {
                option["uid"] = parseInt(<string>$JQ.find(".uid").val());
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