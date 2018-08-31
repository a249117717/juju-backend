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
define(["text!model/chart/views/robotListTemp.html", "text!model/chart/views/robotListDetail.html", "text!model/chart/views/robotListUpdate.html"], function (robotListTemp, robotListDetail, robotListUpdate) {
    var RobotList = (function (_super) {
        __extends(RobotList, _super);
        function RobotList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": robotListTemp,
                "detail": robotListDetail,
                "update": robotListUpdate
            };
            $.extend(_this, props);
            return _this;
        }
        RobotList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.robotList(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    self.render(data);
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        RobotList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-robotList");
            this.$add = this.$el.find(".addCurtain");
            this.$update = this.$el.find(".updateCurtain");
            this.bindEvent();
        };
        RobotList.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
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
            window.laydate.render({
                elem: '.m-addContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd'
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this);
                window.layer.confirm("\u662F\u5426\u5220\u9664\u6635\u79F0\u4E3A" + $this.attr("uname") + "\u7684\u673A\u5668\u4EBA\u5F39\u5E55\uFF1F", function (e) {
                    _resource.deleteRobot(JSON.stringify({
                        "uid": parseInt($this.attr("uid")),
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
        };
        RobotList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        RobotList.prototype.dataCheck = function ($JQ) {
            var tip = "";
            if (!$JQ.find(".nickname").val()) {
                tip = "请输入昵称";
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
                "sex": parseInt($JQ.find(".operation").val()),
                "text": $JQ.find(".reason").val(),
                "head_img": "",
                "phone": $JQ.find(".phone").val(),
                "birthday": 0,
                "token": this.mainView.mainView.token
            };
            var date = new Date($JQ.find(".birthday").val());
            option.birthday = parseInt((date.getTime() / 1000));
            if ($JQ.is(".updateCurtain")) {
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
                "uid": parseInt($obj.attr("uid")),
                "nickname": $tr.find(".nickname").text(),
                "sign": $tr.find(".sign").text(),
                "sex": parseInt($tr.find(".sex").attr("sex")),
                "text": $tr.find(".reason").text(),
                "head_img": head,
                "phone": $tr.find(".phone").text(),
                "birthday": $tr.find(".birthday").text()
            });
        };
        RobotList.prototype.initUpdate = function (iniData) {
            var $update = this.$update;
            $update.find(".input-group").html(window.template.compile(this.template.update)(iniData));
            $update.find(".operation").eq(iniData.sex == 0 ? 2 : (iniData.sex - 1)).prop("checked", true);
            this.updateBindEvent();
        };
        RobotList.prototype.updateBindEvent = function () {
            window.laydate.render({
                elem: '.m-updateContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd',
                value: this.$update.find(".birthday").val()
            });
        };
        RobotList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        RobotList.prototype.getFormReturn = function (e) {
            var data = e[0].contentWindow.document.body.innerText;
            if (data) {
                data = JSON.parse(data);
            }
            else {
                window.layer.msg("提交失败!");
            }
            ;
        };
        return RobotList;
    }(ChartBase));
    return RobotList;
});
//# sourceMappingURL=robotList.js.map