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
define(["text!model/chart/views/robotListTemp.html", "text!model/chart/views/robotListDetail.html"], function (robotListTemp, robotListDetail) {
    var RobotList = (function (_super) {
        __extends(RobotList, _super);
        function RobotList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.template = {
                "routerTemp": robotListTemp,
                "detail": robotListDetail
            };
            $.extend(_this, props);
            return _this;
        }
        RobotList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            self.render({});
        };
        RobotList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-robotList");
            this.$add = this.$el.find(".addCurtain");
            this.bindEvent();
        };
        RobotList.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.messageCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认增加机器人弹幕", function (e) {
                    _load(true);
                    _resource.addRobot(JSON.stringify(self.getMessage(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("增加成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            window.laydate.render({
                elem: '.m-addContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
        };
        RobotList.prototype.renderDetail = function (data) {
        };
        RobotList.prototype.messageCheck = function ($JQ) {
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
        RobotList.prototype.getMessage = function ($JQ) {
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
            return option;
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