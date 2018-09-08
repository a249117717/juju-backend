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
            let data:any = {"code":0,"msg":"成功","count":400,"data":[{"birthday":"704764800","create_time":"1530072005","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"ewjwyo0jiuu3vy_199284","im_token":"52d19ebe7b6947a236e570206fa8bc34","name":"异彩飞杨199","phone":"18825165555","sex":"2","sign":"自由自在，释放自己,1991","text":"机器人弹幕199","uid":"199284"},{"birthday":"704736000","create_time":"1530072005","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"ahl6hwraekmej6_199285","im_token":"0b0d559444ce965c2e6f3489ab425acd","name":"异彩飞杨198","phone":"18825165555","sex":"1","sign":"自由自在，释放自己,198","text":"机器人弹幕198","uid":"199285"},{"birthday":"704736000","create_time":"1530072005","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"vzcqusiycj1fdz_199286","im_token":"b6134329a70628f3a3c6efc8455eb00a","name":"异彩飞杨197","phone":"18825165555","sex":"2","sign":"自由自在，释放自己,197","text":"机器人弹幕197","uid":"199286"},{"birthday":"704736000","create_time":"1530072005","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"mqf2ex9wxthn9z_199287","im_token":"a63b08ed13260a344f8ece2ec0c53cc1","name":"异彩飞杨196","phone":"18825165555","sex":"1","sign":"自由自在，释放自己,196","text":"机器人弹幕196","uid":"199287"},{"birthday":"704736000","create_time":"1530072004","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"woki1qo12hf0a7_199288","im_token":"7dab4df2634d0a9a8cf153e252590504","name":"异彩飞杨195","phone":"18825165555","sex":"2","sign":"自由自在，释放自己,195","text":"机器人弹幕195","uid":"199288"},{"birthday":"704736000","create_time":"1530072004","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"tnglzrpze9nuqs_199289","im_token":"a4e07636a90734f1428ca062ce64905c","name":"异彩飞杨194","phone":"18825165555","sex":"1","sign":"自由自在，释放自己,194","text":"机器人弹幕194","uid":"199289"},{"birthday":"704736000","create_time":"1530072004","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"kiww5u1b7ddzzp_199290","im_token":"a5621b0ffc0afb4f16f13165e5424e0c","name":"异彩飞杨193","phone":"18825165555","sex":"2","sign":"自由自在，释放自己,193","text":"机器人弹幕193","uid":"199290"},{"birthday":"704736000","create_time":"1530072004","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"sormey4bv2vlfo_199291","im_token":"203b08840aa5a67fc1eb11519afbbf34","name":"异彩飞杨192","phone":"18825165555","sex":"1","sign":"自由自在，释放自己,192","text":"机器人弹幕192","uid":"199291"},{"birthday":"704736000","create_time":"1530072004","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"ruqu3akwuegtc8_199292","im_token":"a31d5cc38729056e999565dd6c6c3fa5","name":"异彩飞杨191","phone":"18825165555","sex":"2","sign":"自由自在，释放自己,191","text":"机器人弹幕191","uid":"199292"},{"birthday":"704736000","create_time":"1530072003","head_img":"http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg","im_account":"oirdnkb40hswyj_199293","im_token":"b51c39079d43c9ae885785d2166d9241","name":"异彩飞杨190","phone":"18825165555","sex":"1","sign":"自由自在，释放自己,190","text":"机器人弹幕190","uid":"199293"}]};

            // _load(true);
            // (<Function>_resource.robotList)(JSON.stringify({
            //     "page_size":pageSize,
            //     "page_index":pageNo,
            //     "token":this.mainView.mainView.token
            // }),function(data:any){
                if(!self.$el) {
                    data["token"] = self.mainView.mainView.token;
                    self.render(data);
                } else {
                    // 设置总页数
                    self.pading.setTotal(data.count);
                };
                self.renderDetail(data)
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
            let data:any = {};

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