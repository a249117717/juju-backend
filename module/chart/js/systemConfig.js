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
define(["text!module/chart/views/systemConfigTemp.html", "text!module/chart/views/systemConfigDetail.html", "text!module/chart/views/systemConfigUpdate.html"], function (systemConfigTemp, systemConfigDetail, systemConfigUpdate) {
    var SystemConfig = (function (_super) {
        __extends(SystemConfig, _super);
        function SystemConfig(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": systemConfigTemp,
                "detail": systemConfigDetail,
                "update": systemConfigUpdate
            };
            return _this;
        }
        SystemConfig.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.systemConfigList(JSON.stringify({
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
        SystemConfig.prototype.render = function (data) {
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-systemConfig");
            this.$add = $(".m-addContent");
            this.$update = $(".m-updateContent");
            this.bindEvent();
        };
        SystemConfig.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.configCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认新增配置", function (e) {
                    _load(true);
                    _resource.addSystemConfig(JSON.stringify(self.getConfig(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("新增成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-info", function () {
                var $this = $(this), nid = parseInt($this.attr("nid"));
                _resource.SystemConfigInfo(JSON.stringify({
                    "id": nid,
                    "token": self.mainView.mainView.token
                }), function (data) {
                });
            });
            this.$el.find(".detail").on("click", ".btn-update", function () {
                self.showUpdate($(this));
            });
            this.$update.find(".btn-cancel").on("click", function () {
                _this.showOrHideByAni(_this.$update, 0);
            });
            this.$update.on("click", ".btn-submit", function () {
                if (!self.configCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateSystemConfig(JSON.stringify(self.getConfig(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
        };
        SystemConfig.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        SystemConfig.prototype.configCheck = function ($JQ) {
            var tip = "";
            if (!$JQ.find(".configKey").val().replace(/\s/g, "")) {
                tip = "请填写键";
            }
            else if (!$JQ.find(".configVal").val().replace(/\s/g, "")) {
                tip = "请填写值";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        SystemConfig.prototype.getConfig = function ($JQ) {
            var option = null;
            if ($JQ.hasClass("m-addContent")) {
                option = {
                    "key": $JQ.find(".configKey").val(),
                    "value": $JQ.find(".configVal").val(),
                    "remark": $JQ.find(".reason").val(),
                    "token": this.mainView.mainView.token
                };
            }
            else if ($JQ.hasClass("m-updateContent")) {
                option = {
                    "id": parseInt($JQ.find(".nid").val()),
                    "start_time": 0,
                    "end_time": "",
                    "interval": parseInt($JQ.find(".inter").val()),
                    "content": "",
                    "token": this.mainView.mainView.token
                };
            }
            ;
            return option;
        };
        SystemConfig.prototype.showUpdate = function ($obj) {
            var $tr = $obj.parents("tr");
            this.initUpdate({
                "nid": parseInt($obj.attr("nid")),
                "key": "",
                "value": "",
                "content": $tr.find(".ncontent").text()
            });
            this.showOrHideByAni(this.$update);
        };
        SystemConfig.prototype.initUpdate = function (initData) {
            this.$update.find(".input-group").html(window.template.compile(this.template.update)(initData));
            this.updateBindEvent();
        };
        SystemConfig.prototype.updateBindEvent = function () {
        };
        SystemConfig.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return SystemConfig;
    }(ChartBase));
    return SystemConfig;
});
//# sourceMappingURL=systemConfig.js.map