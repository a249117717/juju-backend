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
define(["text!module/chart/views/startUpTemp.html", "text!module/chart/views/startUpDetail.html", "text!module/chart/views/startUpUpdate.html"], function (startUpTemp, startUpDetail, startUpUpdate) {
    var StartUp = (function (_super) {
        __extends(StartUp, _super);
        function StartUp(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": startUpTemp,
                "detail": startUpDetail,
                "update": startUpUpdate
            };
            return _this;
        }
        StartUp.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.StartUpList(JSON.stringify({
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
        StartUp.prototype.render = function (data) {
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-startUp");
            this.$add = this.$el.find(".addNotice");
            this.$update = this.$el.find(".updateNotice");
            this.bindEvent();
        };
        StartUp.prototype.bindEvent = function () {
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
                window.layer.confirm("是否确认新增公告", function (e) {
                    _load(true);
                    _resource.addStartUp(JSON.stringify(self.getMessage(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("新增成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this), nid = parseInt($this.attr("nid"));
                window.layer.confirm("\u786E\u8BA4\u5220\u9664\u7F16\u53F7\u4E3A" + nid + "\u7684\u516C\u544A\u4E48\uFF1F", function (e) {
                    _resource.deleteStartUp(JSON.stringify({
                        "id": nid,
                        "token": self.mainView.mainView.token
                    }), function (data) {
                        $this.prop("disabled", true).siblings("").prop("disabled", true);
                        window.layer.msg("删除成功");
                        window.layer.close(e);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-update", function () {
                self.showUpdate($(this));
            });
            this.$update.find(".btn-cancel").on("click", function () {
                _this.showOrHideByAni(_this.$update, 0);
            });
            this.$update.on("click", ".btn-submit", function () {
                if (!self.messageCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateStartUp(JSON.stringify(self.getMessage(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
        };
        StartUp.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        StartUp.prototype.messageCheck = function ($JQ) {
            var tip = "";
            if (!$JQ.find(".reason").val().replace(/\s/g, "")) {
                tip = "请填写发送的消息内容";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        StartUp.prototype.getMessage = function ($JQ) {
            var option = {
                "msg": $JQ.find(".reason").val(),
                "status": parseInt($JQ.find(".operation:checked").val()),
                "token": this.mainView.mainView.token
            };
            if ($JQ.hasClass("updateNotice")) {
                option["id"] = parseInt($JQ.find(".nid").val());
            }
            ;
            return option;
        };
        StartUp.prototype.showUpdate = function ($obj) {
            this.initUpdate({
                "nid": parseInt($obj.attr("nid")),
                "msg": $obj.parents("tr").find(".ncontent").text(),
                "status": parseInt($obj.attr("status"))
            });
            this.showOrHideByAni(this.$update);
        };
        StartUp.prototype.initUpdate = function (initData) {
            this.$update.find(".input-group").html(window.template.compile(this.template.update)(initData));
            this.updateBindEvent();
        };
        StartUp.prototype.updateBindEvent = function () {
        };
        StartUp.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return StartUp;
    }(ChartBase));
    return StartUp;
});
//# sourceMappingURL=startUp.js.map