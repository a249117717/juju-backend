/// <reference path="../../../js/charts.d.ts" />

define([
    "text!module/chart/views/robotListTemp.html",
    "text!module/chart/views/robotListDetail.html",
    "text!module/chart/views/robotListUpdate.html",
    "text!module/chart/views/robotListAlbum.html"
],function(robotListTemp,robotListDetail,robotListUpdate,robotListAlbum){
    // 机器人弹幕
    class RobotList extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;
        $update:JQuery<HTMLElement> = null;
        $album:JQuery<HTMLElement> = null;
        template = { // 模板
            "routerTemp":robotListTemp,
            "detail":robotListDetail,
            "update":robotListUpdate,
            "album":robotListAlbum
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
            let self:RobotList = this;

            _load(true);
            (<Function>_resource.robotList)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(!self.$el) {
                    data["token"] = self.mainView.mainView.token;
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
            header.showMenu();

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-robotList");
            this.$add = this.$el.find(".addRobot");
            this.$update = this.$el.find(".updateRobot");
            this.$album = this.$el.find(".albumRobot");
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:RobotList = this;

            // 新增弹幕的重置按钮
            this.$add.find(".btn-reset").on("click",() => {
                this.$add.wrap('<form onsubmit="return false;">');
                (<HTMLFormElement>this.$add.parent("form")[0]).reset();
                this.$add.find(".avatar").attr("finshpic","");
                this.$add.find(".avatarUrl").attr("src","common/images/defaultUser.png");
                this.$add.unwrap();
            });

            // 新增弹幕的确定按钮
            this.$add.find(".btn-submit").on("click",function() {
                if(!self.dataCheck(self.$add)) {
                    return;
                };

                (<any>window).layer.confirm("是否确认新增机器人弹幕",function(e){
                    _load(true);
                    (<Function>_resource.addRobot)(JSON.stringify(self.getSubmitData(self.$add)),function(data){
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

            // 上传头像url
            this.$add.find(".avatar").on("change",function(){
                let file:File = (<HTMLInputElement>this).files[0],
                fileUrl = window.URL.createObjectURL(file);
                self.$add.find(".uploadPic").wrap(`<form id="uploadPic" action="${_resource.upload}" method="post" enctype="multipart/form-data">`);

                if(file.size > 512000) {
                    // 限制选择的图片不能大于500k
                    (<any>window).layer.msg("选择的图片过大，请重新选择（500k以内的图片）");
                    return;
                };
                // 预览图片
                self.$add.find(".avatarUrl").attr("src",fileUrl);

                _load(true);
                // 提交表单
                (<any>$("#uploadPic")).ajaxSubmit({
                    "success":function(data){
                        _load(false);
                        // 设置返回的地址
                        self.$add.find(".avatar").attr("finshPic",data.data);
                    },
                    "error":function(){
                        _load(false);
                        // 如果上传失败，则切换回默认图片或者之前已经上传成功的图片
                        self.$add.find(".avatarUrl").attr("src",self.$add.find(".avatar").attr("finshPic") || "./common/images/defaultUser.png");
                        // 释放掉已经存在的URL对象
                        window.URL.revokeObjectURL(fileUrl);
                    },
                    "complete":function(){  // 完成请求
                        // 去掉提交图片的表单
                        self.$add.find(".uploadPic").unwrap();
                    }
                });
            });

            // 新增消息生日日期
            (<any>window).laydate.render({
                elem: '.m-addContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd'
            });

            // 删除按钮
            this.$el.find(".detail").on("click",".btn-delete",function(){
                let $this:JQuery<HTMLElement> = $(this),
                $td:JQuery<HTMLElement> = $this.parent("td");

                (<any>window).layer.confirm(`是否删除昵称为${$td.attr("uname")}的机器人弹幕？`,function(e){
                    (<Function>_resource.deleteRobot)(JSON.stringify({
                        "uid":parseInt($td.attr("uid")),
                        "token":self.mainView.mainView.token
                    }),function(data){
                        $this.prop("disabled",true);
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
                this.$update.removeClass("active");
                setTimeout(() => {
                    this.$update.hide()
                },200);
            });

            // 更新消息确定按钮
            this.$update.on("click",".btn-submit",function(){
                if(!self.dataCheck(self.$update)) {
                    return;
                };

                (<any>window).layer.confirm("确认更新消息么？",function(e){
                    _load(true);
                    (<Function>_resource.updateRobot)(JSON.stringify(self.getSubmitData(self.$update)),function(data){
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo,self.pading.pageSize);
                        (<any>window).layer.msg("更新成功");
                        (<any>window).layer.close(e);
                        _load(false);
                    });
                });
            });

            // 相册
            this.$el.find(".detail").on("click",".btn-album",function(){
                self.showAlbum($(this));
            });

            // 相册的取消按钮
            this.$album.find(".btn-cancel").on("click",() => {
                this.$album.removeClass("active");
                setTimeout(() => {
                    this.$album.hide()
                },200);
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
         * 消息数据校验
         * @param {JQuery<HTMLElement>} $JQ [JQuery对象]
         * @return {Boolean} bool [校验是否通过,true为通过,false为失败]
         */
        dataCheck($JQ:JQuery<HTMLElement>) : boolean {
            let tip:string = "";

            if(!$JQ.find(".nickname").val()) {
                tip = "请输入昵称";
            } else if(!$JQ.find(".avatar").attr("finshPic")) {
                tip = "请选择头像";
            } else if(!$JQ.find(".sign").val()) {
                tip = "请输入签名";
            } else if(!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(<string>$JQ.find(".phone").val())) {
                tip = "请输入正确的手机号";
            } else if(!$JQ.find(".birthday").val()) {
                tip = "请选择生日日期";
            } else if(!$JQ.find(".reason").val()) {
                tip = "请输入推送内容";
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
                "name":$JQ.find(".nickname").val(), // 昵称
                "sign":$JQ.find(".sign").val(), // 签名
                "sex":parseInt(<string>$JQ.find(".operation:checked").val()),    // 性别
                "text":$JQ.find(".reason").val(),   // 推送内容
                "head_img":$JQ.find(".avatar").attr("finshPic"),  // 头像url
                "phone":$JQ.find(".phone").val(),   // 手机
                "birthday":0,  // 生日日期
                "token":this.mainView.mainView.token
            };

            // 获取生日日期
            let date:Date = new Date(<string>$JQ.find(".birthday").val());
            option.birthday = parseInt(<any>(date.getTime()/1000));

            if($JQ.is(".updateRobot")) {
                option["uid"] = parseInt(<string>$JQ.find(".uid").val());
            };

            return option;
        }

        /**
         * 打开更新框
         * @param {JQuery<HTMLElement>} $obj [点击的JQ对象]
         */
        showUpdate($obj:JQuery<HTMLElement>) {
            let $tr:JQuery<HTMLElement> = $obj.parents("tr"),
            head = $tr.find(".head .pho").attr("src");
            // 如果照片为默认，则表示不存在
            head == "common/images/defaultUser.png"?"":head;

            this.$update.show();
            setTimeout(() => {
                this.$update.addClass("active");
            },10);

            this.initUpdate({
                "uid":parseInt($obj.parent("td").attr("uid")),
                "nickname":$tr.find(".nickname").text(),
                "sign":$tr.find(".sign").text(),
                "sex":parseInt($tr.find(".sex").attr("sex")),
                "text":$tr.find(".reason").text(),
                "head_img":head,
                "phone":$tr.find(".phone").text(),
                "birthday":$tr.find(".birthday").text(),
                "token":this.mainView.mainView.token
            });
        }

        /**
         * 初始化更新框
         * @param {JSON} initData [数据]
         */
        initUpdate(iniData:UpdateInitData) {
            let $update:JQuery<HTMLElement> = this.$update;
            $update.find(".input-group").html((<any>window).template.compile(this.template.update)(iniData));
            $update.find(".operation").eq(iniData.sex==0?2:(iniData.sex-1)).prop("checked",true);
            this.updateBindEvent();
        }

        /**
         * 更新框的事件绑定
         */
        updateBindEvent() {
            let self:RobotList = this;

            // 生日日期
            (<any>window).laydate.render({
                elem: '.m-updateContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd',
                value: this.$update.find(".birthday").val()
            });

            // 上传头像
            this.$update.find(".avatar").on({
                "change":function(){
                    let file:File = (<HTMLInputElement>this).files[0];
                    self.$update.find(".uploadPic").wrap(`<form id="uploadPicUpdate" target="formReturn" novalidate="novalidate" onkeydown="if(event.keyCode==13) {return false;}" action="${_resource.upload}" method="post" enctype="multipart/form-data">`);

                    if(file.size > 512000) {
                        // 限制选择的图片不能大于500k
                        (<any>window).layer.msg("选择的图片过大，请重新选择（500k以内的图片）");
                        return;
                    };
                    // 预览图片
                    self.$update.find(".avatarUrl").attr("src",window.URL.createObjectURL(file));

                    _load(true);
                    // 提交表单
                    (<any>$("#uploadPicUpdate")).ajaxSubmit({
                        "success":function(data){
                            _load(false);
                            // 设置返回的地址
                            self.$update.find(".avatar").attr("finshPic",data.data);
                        },
                        "error":function(requres){
                            _load(false);
                            // 如果上传失败，则切换回默认图片或者之前已经上传成功的图片
                            self.$update.find(".avatarUrl").attr("src",self.$update.find(".avatar").attr("finshPic"));
                        },
                        "complete":function(){  // 完成请求
                            // 去掉提交图片的表单
                            self.$update.find(".uploadPic").unwrap();
                        }
                    });
                },
            });
        }

        /**
         * 打开相册
         * @param {JQuery<HTMLElement>} $obj [点击的JQ对象]
         */
        showAlbum($obj:JQuery<HTMLElement>) {
            this.$album.show();
            setTimeout(() => {
                this.$album.addClass("active");
            },10);
            this.initAlbum(parseInt($obj.parent("td").attr("uid")));
        }

        /**
         * 初始化相册
         * @param {number} uid [用户编号]
         */
        initAlbum(uid:number) {
            let self:RobotList = this,
            token:string = this.mainView.mainView.token;

            (<any>_resource.listRobotPic)(JSON.stringify({
                "uid":uid,
                "token":token
            }),function(data){
                data["token"] = token;
                data["notpic"] = new Array(6 - (data.data.photo?data.data.photo.length:0));
                self.$album.find(".photograph").html((<any>window).template.compile(self.template.album)(data));
                self.albumBindEvent();
            });
        }

        /**
         * 相册事件绑定
         */
        albumBindEvent() {
            // 查看照片
            this.$album.find(".btn-check").on("click",function(){
                (<any>window).layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    area: '516px',
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: `<img id="albumShow" src="${$(this).parent(".btn-group").prev(".pic").attr("src")}"/>`
                });
            });

            // 删除照片
            this.$album.find(".btn-delete").on("click",function(){
                let $li:JQuery<HTMLElement> = $(this).parents(".has");

                (<any>window).layer.confirm(`是否删除第${$li.index() + 1}张照片？`,function(e){
                    (<Function>_resource.deleteRobotPic)(JSON.stringify({
                        "id":parseInt($li.attr("pid")),
                        "token":$li.find("input[name=token]").val()
                    }),function(){
                        $li.removeClass("has").find(".pic").attr("src","./common/images/notpic.png");
                        (<any>window).layer.msg("删除成功");
                        (<any>window).layer.close(e);
                    });
                });
            });
            
            // 上传相册图片
            this.$album.find(".upload").on("change",function(){
                let $this:JQuery<HTMLElement> = $(this),
                file:File = (<HTMLInputElement>this).files[0],
                fileUrl = window.URL.createObjectURL(file);

                if(file.size > 1024000) {
                    // 限制选择的图片不能大于1M
                    (<any>window).layer.msg("选择的图片过大，请重新选择（1M以内的图片）");
                    return;
                };
                
                // 增加表单
                $this.parent("li").wrap(`<form id="uploadPic" action="${_resource.uploadRobotPic}" method="post" enctype="multipart/form-data">`);
                // 预览图片
                $this.prevAll(".pic").attr("src",fileUrl);

                _load(true);
                // 提交表单
                (<any>$("#uploadPic")).ajaxSubmit({
                    "success":function(data){
                        _load(false);
                        (<any>window).layer.msg("上传成功");
                        $this.parent("li").addClass("has");
                        // 替换为上传成功的地址
                        $this.prevAll(".pic").attr("src",`${data.data.oss_pre}${data.data.oss_post}`);
                    },
                    "error":function(){
                        _load(false);
                        // 如果上传失败，则切换回默认图片或者之前已经上传成功的图片
                        $this.prevAll(".pic").attr("src","./common/images/notpic.png");
                        // 释放掉已经存在的URL对象
                        window.URL.revokeObjectURL(fileUrl);
                    },
                    "complete":function(){  // 完成请求
                        // 去掉提交图片的表单
                        $this.parent("li").unwrap();
                    }
                });
            });
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

    /**
     * 更新框的初始化数据格式
     */
    interface UpdateInitData {
        /**
         * 机器人编号
         */
        uid?:number
        /**
         * 昵称
         */
        nickname:string
        /**
         * 签名
         */
        sign:string
        /**
         * 性别
         */
        sex:number
        /**
         * 推送内容
         */
        text:string
        /**
         * 头像url
         */
        head_img:string
        /**
         * 手机号
         */
        phone:string
        /**
         * 出生日期
         */
        birthday:string
        /**
         * token
         */
        token:string
    }

    return RobotList;
});