var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define([
    "text!module/chart/views/robotListTemp.html",
    "text!module/chart/views/robotListDetail.html",
    "text!module/chart/views/robotListUpdate.html",
    "text!module/chart/views/robotListAlbum.html"
], function (robotListTemp, robotListDetail, robotListUpdate, robotListAlbum) {
    var RobotList = (function (_super) {
        __extends(RobotList, _super);
        function RobotList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.$album = null;
            _this.template = {
                "routerTemp": robotListTemp,
                "detail": robotListDetail,
                "update": robotListUpdate,
                "album": robotListAlbum
            };
            $.extend(_this, props);
            return _this;
        }
        RobotList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            var data = { "code": 0, "msg": "成功", "count": 400, "data": [{ "birthday": "704764800", "create_time": "1530072005", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "ewjwyo0jiuu3vy_199284", "im_token": "52d19ebe7b6947a236e570206fa8bc34", "name": "异彩飞杨199", "phone": "18825165555", "sex": "2", "sign": "自由自在，释放自己,1991", "text": "机器人弹幕199", "uid": "199284" }, { "birthday": "704736000", "create_time": "1530072005", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "ahl6hwraekmej6_199285", "im_token": "0b0d559444ce965c2e6f3489ab425acd", "name": "异彩飞杨198", "phone": "18825165555", "sex": "1", "sign": "自由自在，释放自己,198", "text": "机器人弹幕198", "uid": "199285" }, { "birthday": "704736000", "create_time": "1530072005", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "vzcqusiycj1fdz_199286", "im_token": "b6134329a70628f3a3c6efc8455eb00a", "name": "异彩飞杨197", "phone": "18825165555", "sex": "2", "sign": "自由自在，释放自己,197", "text": "机器人弹幕197", "uid": "199286" }, { "birthday": "704736000", "create_time": "1530072005", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "mqf2ex9wxthn9z_199287", "im_token": "a63b08ed13260a344f8ece2ec0c53cc1", "name": "异彩飞杨196", "phone": "18825165555", "sex": "1", "sign": "自由自在，释放自己,196", "text": "机器人弹幕196", "uid": "199287" }, { "birthday": "704736000", "create_time": "1530072004", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "woki1qo12hf0a7_199288", "im_token": "7dab4df2634d0a9a8cf153e252590504", "name": "异彩飞杨195", "phone": "18825165555", "sex": "2", "sign": "自由自在，释放自己,195", "text": "机器人弹幕195", "uid": "199288" }, { "birthday": "704736000", "create_time": "1530072004", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "tnglzrpze9nuqs_199289", "im_token": "a4e07636a90734f1428ca062ce64905c", "name": "异彩飞杨194", "phone": "18825165555", "sex": "1", "sign": "自由自在，释放自己,194", "text": "机器人弹幕194", "uid": "199289" }, { "birthday": "704736000", "create_time": "1530072004", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "kiww5u1b7ddzzp_199290", "im_token": "a5621b0ffc0afb4f16f13165e5424e0c", "name": "异彩飞杨193", "phone": "18825165555", "sex": "2", "sign": "自由自在，释放自己,193", "text": "机器人弹幕193", "uid": "199290" }, { "birthday": "704736000", "create_time": "1530072004", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "sormey4bv2vlfo_199291", "im_token": "203b08840aa5a67fc1eb11519afbbf34", "name": "异彩飞杨192", "phone": "18825165555", "sex": "1", "sign": "自由自在，释放自己,192", "text": "机器人弹幕192", "uid": "199291" }, { "birthday": "704736000", "create_time": "1530072004", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "ruqu3akwuegtc8_199292", "im_token": "a31d5cc38729056e999565dd6c6c3fa5", "name": "异彩飞杨191", "phone": "18825165555", "sex": "2", "sign": "自由自在，释放自己,191", "text": "机器人弹幕191", "uid": "199292" }, { "birthday": "704736000", "create_time": "1530072003", "head_img": "http://i1.umei.cc/uploads/tu/201806/9999/d3738a0d75.jpg", "im_account": "oirdnkb40hswyj_199293", "im_token": "b51c39079d43c9ae885785d2166d9241", "name": "异彩飞杨190", "phone": "18825165555", "sex": "1", "sign": "自由自在，释放自己,190", "text": "机器人弹幕190", "uid": "199293" }] };
            if (!self.$el) {
                data["token"] = self.mainView.mainView.token;
                self.render(data);
            }
            else {
                self.pading.setTotal(data.count);
            }
            ;
            self.renderDetail(data);
        };
        RobotList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-robotList");
            this.$add = this.$el.find(".addRobot");
            this.$update = this.$el.find(".updateRobot");
            this.$album = this.$el.find(".albumRobot");
            this.bindEvent();
        };
        RobotList.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.wrap('<form onsubmit="return false;">');
                _this.$add.parent("form")[0].reset();
                _this.$add.find(".avatar").attr("finshpic", "");
                _this.$add.find(".avatarUrl").attr("src", "common/images/defaultUser.png");
                _this.$add.unwrap();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.dataCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认新增机器人弹幕", function (e) {
                    _load(true);
                    _resource.addRobot(JSON.stringify(self.getSubmitData(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("新增成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            this.$add.find(".avatar").on("change", function () {
                var file = this.files[0], fileUrl = window.URL.createObjectURL(file);
                self.$add.find(".uploadPic").wrap("<form id=\"uploadPic\" action=\"" + _resource.upload + "\" method=\"post\" enctype=\"multipart/form-data\">");
                if (file.size > 512000) {
                    window.layer.msg("选择的图片过大，请重新选择（500k以内的图片）");
                    return;
                }
                ;
                self.$add.find(".avatarUrl").attr("src", fileUrl);
                _load(true);
                $("#uploadPic").ajaxSubmit({
                    "success": function (data) {
                        _load(false);
                        self.$add.find(".avatar").attr("finshPic", data.data);
                    },
                    "error": function () {
                        _load(false);
                        self.$add.find(".avatarUrl").attr("src", self.$add.find(".avatar").attr("finshPic") || "./common/images/defaultUser.png");
                        window.URL.revokeObjectURL(fileUrl);
                    },
                    "complete": function () {
                        self.$add.find(".uploadPic").unwrap();
                    }
                });
            });
            window.laydate.render({
                elem: '.m-addContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd'
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this), $td = $this.parent("td");
                window.layer.confirm("\u662F\u5426\u5220\u9664\u6635\u79F0\u4E3A" + $td.attr("uname") + "\u7684\u673A\u5668\u4EBA\u5F39\u5E55\uFF1F", function (e) {
                    _resource.deleteRobot(JSON.stringify({
                        "uid": parseInt($td.attr("uid")),
                        "token": self.mainView.mainView.token
                    }), function (data) {
                        $this.prop("disabled", true);
                        window.layer.msg("删除成功");
                        window.layer.close(e);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-update", function () {
                self.showUpdate($(this));
            });
            this.$update.find(".btn-cancel").on("click", function () {
                _this.$update.removeClass("active");
                setTimeout(function () {
                    _this.$update.hide();
                }, 200);
            });
            this.$update.on("click", ".btn-submit", function () {
                if (!self.dataCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateRobot(JSON.stringify(self.getSubmitData(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-album", function () {
                self.showAlbum($(this));
            });
            this.$album.find(".btn-cancel").on("click", function () {
                _this.$album.removeClass("active");
                setTimeout(function () {
                    _this.$album.hide();
                }, 200);
            });
        };
        RobotList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        RobotList.prototype.dataCheck = function ($JQ) {
            var tip = "";
            if (!$JQ.find(".nickname").val()) {
                tip = "请输入昵称";
            }
            else if (!$JQ.find(".avatar").attr("finshPic")) {
                tip = "请选择头像";
            }
            else if (!$JQ.find(".sign").val()) {
                tip = "请输入签名";
            }
            else if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test($JQ.find(".phone").val())) {
                tip = "请输入正确的手机号";
            }
            else if (!$JQ.find(".birthday").val()) {
                tip = "请选择生日日期";
            }
            else if (!$JQ.find(".reason").val()) {
                tip = "请输入推送内容";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        ;
        RobotList.prototype.getSubmitData = function ($JQ) {
            var option = {
                "name": $JQ.find(".nickname").val(),
                "sign": $JQ.find(".sign").val(),
                "sex": parseInt($JQ.find(".operation:checked").val()),
                "text": $JQ.find(".reason").val(),
                "head_img": $JQ.find(".avatar").attr("finshPic"),
                "phone": $JQ.find(".phone").val(),
                "birthday": 0,
                "token": this.mainView.mainView.token
            };
            var date = new Date($JQ.find(".birthday").val());
            option.birthday = parseInt((date.getTime() / 1000));
            if ($JQ.is(".updateRobot")) {
                option["uid"] = parseInt($JQ.find(".uid").val());
            }
            ;
            return option;
        };
        RobotList.prototype.showUpdate = function ($obj) {
            var _this = this;
            var $tr = $obj.parents("tr"), head = $tr.find(".head .pho").attr("src");
            head == "common/images/defaultUser.png" ? "" : head;
            this.$update.show();
            setTimeout(function () {
                _this.$update.addClass("active");
            }, 10);
            this.initUpdate({
                "uid": parseInt($obj.parent("td").attr("uid")),
                "nickname": $tr.find(".nickname").text(),
                "sign": $tr.find(".sign").text(),
                "sex": parseInt($tr.find(".sex").attr("sex")),
                "text": $tr.find(".reason").text(),
                "head_img": head,
                "phone": $tr.find(".phone").text(),
                "birthday": $tr.find(".birthday").text(),
                "token": this.mainView.mainView.token
            });
        };
        RobotList.prototype.initUpdate = function (iniData) {
            var $update = this.$update;
            $update.find(".input-group").html(window.template.compile(this.template.update)(iniData));
            $update.find(".operation").eq(iniData.sex == 0 ? 2 : (iniData.sex - 1)).prop("checked", true);
            this.updateBindEvent();
        };
        RobotList.prototype.updateBindEvent = function () {
            var self = this;
            window.laydate.render({
                elem: '.m-updateContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd',
                value: this.$update.find(".birthday").val()
            });
            this.$update.find(".avatar").on({
                "change": function () {
                    var file = this.files[0];
                    self.$update.find(".uploadPic").wrap("<form id=\"uploadPicUpdate\" target=\"formReturn\" novalidate=\"novalidate\" onkeydown=\"if(event.keyCode==13) {return false;}\" action=\"" + _resource.upload + "\" method=\"post\" enctype=\"multipart/form-data\">");
                    if (file.size > 512000) {
                        window.layer.msg("选择的图片过大，请重新选择（500k以内的图片）");
                        return;
                    }
                    ;
                    self.$update.find(".avatarUrl").attr("src", window.URL.createObjectURL(file));
                    _load(true);
                    $("#uploadPicUpdate").ajaxSubmit({
                        "success": function (data) {
                            _load(false);
                            self.$update.find(".avatar").attr("finshPic", data.data);
                        },
                        "error": function (requres) {
                            _load(false);
                            self.$update.find(".avatarUrl").attr("src", self.$update.find(".avatar").attr("finshPic"));
                        },
                        "complete": function () {
                            self.$update.find(".uploadPic").unwrap();
                        }
                    });
                },
            });
        };
        RobotList.prototype.showAlbum = function ($obj) {
            var _this = this;
            this.$album.show();
            setTimeout(function () {
                _this.$album.addClass("active");
            }, 10);
            this.initAlbum(parseInt($obj.parent("td").attr("uid")));
        };
        RobotList.prototype.initAlbum = function (uid) {
            var self = this, token = this.mainView.mainView.token;
            var data = {};
            _resource.listRobotPic(JSON.stringify({
                "uid": uid,
                "token": token
            }), function (data) {
                data["token"] = token;
                data["notpic"] = new Array(6 - (data.data.photo ? data.data.photo.length : 0));
                self.$album.find(".photograph").html(window.template.compile(self.template.album)(data));
                self.albumBindEvent();
            });
        };
        RobotList.prototype.albumBindEvent = function () {
            this.$album.find(".btn-check").on("click", function () {
                window.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    area: '516px',
                    skin: 'layui-layer-nobg',
                    shadeClose: true,
                    content: "<img id=\"albumShow\" src=\"" + $(this).parent(".btn-group").prev(".pic").attr("src") + "\"/>"
                });
            });
            this.$album.find(".btn-delete").on("click", function () {
                var $li = $(this).parents(".has");
                window.layer.confirm("\u662F\u5426\u5220\u9664\u7B2C" + ($li.index() + 1) + "\u5F20\u7167\u7247\uFF1F", function (e) {
                    _resource.deleteRobotPic(JSON.stringify({
                        "id": parseInt($li.attr("pid")),
                        "token": $li.find("input[name=token]").val()
                    }), function () {
                        $li.removeClass("has").find(".pic").attr("src", "./common/images/notpic.png");
                        window.layer.msg("删除成功");
                        window.layer.close(e);
                    });
                });
            });
            this.$album.find(".upload").on("change", function () {
                var $this = $(this), file = this.files[0], fileUrl = window.URL.createObjectURL(file);
                if (file.size > 1024000) {
                    window.layer.msg("选择的图片过大，请重新选择（1M以内的图片）");
                    return;
                }
                ;
                $this.parent("li").wrap("<form id=\"uploadPic\" action=\"" + _resource.uploadRobotPic + "\" method=\"post\" enctype=\"multipart/form-data\">");
                $this.prevAll(".pic").attr("src", fileUrl);
                _load(true);
                $("#uploadPic").ajaxSubmit({
                    "success": function (data) {
                        _load(false);
                        window.layer.msg("上传成功");
                        $this.parent("li").addClass("has");
                        $this.prevAll(".pic").attr("src", "" + data.data.oss_pre + data.data.oss_post);
                    },
                    "error": function () {
                        _load(false);
                        $this.prevAll(".pic").attr("src", "./common/images/notpic.png");
                        window.URL.revokeObjectURL(fileUrl);
                    },
                    "complete": function () {
                        $this.parent("li").unwrap();
                    }
                });
            });
        };
        RobotList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return RobotList;
    }(ChartBase));
    return RobotList;
});
//# sourceMappingURL=robotList.js.map