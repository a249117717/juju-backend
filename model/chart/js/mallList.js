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
define(["text!model/chart/views/mallListTemp.html", "text!model/chart/views/mallListDetail.html"], function (mallListTemp, mallListDetail) {
    var MallList = (function (_super) {
        __extends(MallList, _super);
        function MallList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": mallListTemp,
                "detail": mallListDetail
            };
            $.extend(_this, props);
            return _this;
        }
        MallList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            self.render({});
        };
        MallList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-mallList");
            this.$add = this.$el.find(".m-addContent");
            this.$update = this.$el.find(".m-updateContent");
            this.bindEvent();
        };
        MallList.prototype.bindEvent = function () {
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
                    _resource.addMall(JSON.stringify(self.getSubmitData(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("新增成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            this.$add.find(".operation").on("change", function () {
            });
        };
        MallList.prototype.renderDetail = function (data) {
        };
        MallList.prototype.dataCheck = function ($JQ) {
            var tip = "";
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        ;
        MallList.prototype.getSubmitData = function ($JQ) {
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
        MallList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return MallList;
    }(ChartBase));
    return MallList;
});
//# sourceMappingURL=mallList.js.map