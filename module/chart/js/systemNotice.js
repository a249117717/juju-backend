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
define(["text!module/chart/views/systemNoticeTemp.html", "text!module/chart/views/systemNoticeDetail.html", "text!module/chart/views/systemNoticeUpdate.html"], function (systemNoticeTemp, systemNoticeDetail, systemNoticeUpdate) {
    var SystemNotice = (function (_super) {
        __extends(SystemNotice, _super);
        function SystemNotice(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": systemNoticeTemp,
                "detail": systemNoticeDetail,
                "update": systemNoticeUpdate
            };
            return _this;
        }
        SystemNotice.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.sNoticeList(JSON.stringify({
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
        SystemNotice.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-systemNotice");
            this.$add = this.$el.find(".addNotice");
            this.$update = this.$el.find(".updateNotice");
            this.bindEvent();
        };
        SystemNotice.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.noticeCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认新增公告", function (e) {
                    _load(true);
                    _resource.addSNotice(JSON.stringify(self.getNotice(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("新增成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            window.laydate.render({
                elem: '.m-addContent .startDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            window.laydate.render({
                elem: '.m-addContent .endDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            this.$add.find(".inter").on("input", function () {
                var $this = $(this), val = $this.val();
                if (/^\d*$/.test(val) && parseInt(val) > 0) {
                    $this.attr("old", $this.val());
                }
                else {
                    $this.val($this.attr("old"));
                    window.layer.tips('请输入大于0的正整数', $this[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                }
                ;
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this), nid = parseInt($this.attr("nid"));
                window.layer.confirm("\u786E\u8BA4\u5220\u9664\u7F16\u53F7\u4E3A" + nid + "\u7684\u516C\u544A\u4E48\uFF1F", function (e) {
                    _resource.deleteSNotice(JSON.stringify({
                        "id": nid,
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
                if (!self.noticeCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateSNotice(JSON.stringify(self.getNotice(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
        };
        SystemNotice.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        SystemNotice.prototype.noticeCheck = function ($JQ) {
            var tip = "", startDate = $JQ.find(".startDate").val(), endDate = $JQ.find(".endDate").val();
            if (!startDate) {
                tip = "请选择开始时间";
            }
            else if (!endDate) {
                tip = "请选择结束时间";
            }
            else if (startDate.replace(/\s|[-]|[:]/g, "") > endDate.replace(/\s|[-]|[:]/g, "")) {
                tip = "开始时间不能大于结束时间，请重新选择";
            }
            else if (!$JQ.find(".inter").val()) {
                tip = "请输入发送间隔";
            }
            else if (!$JQ.find(".reason").val().replace(/\s/g, "")) {
                tip = "请填写消息内容";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        SystemNotice.prototype.initAddNotice = function (isRender) {
            if (isRender === void 0) { isRender = false; }
            this.$add.find(".startDate,.endDate,.inter,.reason").val("");
            if (isRender) {
                this.fetch();
            }
            ;
        };
        SystemNotice.prototype.getNotice = function ($JQ) {
            var option = null;
            if ($JQ.hasClass("addNotice")) {
                option = {
                    "start_time": 0,
                    "end_time": "",
                    "interval": parseInt($JQ.find(".inter").val()),
                    "content": "",
                    "token": this.mainView.mainView.token
                };
            }
            else if ($JQ.hasClass("updateNotice")) {
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
            var date = new Date($JQ.find(".startDate").val());
            option.start_time = parseInt((date.getTime() / 1000));
            date = new Date($JQ.find(".endDate").val());
            option.end_time = parseInt((date.getTime() / 1000));
            option.content = $JQ.find(".reason").val();
            return option;
        };
        SystemNotice.prototype.showUpdate = function ($obj) {
            var _this = this;
            var $tr = $obj.parents("tr");
            this.$update.show();
            setTimeout(function () {
                _this.$update.addClass("active");
            }, 10);
            this.initUpdate({
                "nid": parseInt($obj.attr("nid")),
                "startDate": $tr.find(".startDate").text(),
                "endDate": $tr.find(".endDate").text(),
                "inter": parseInt($tr.find(".inter").text()),
                "content": $tr.find(".ncontent").text()
            });
        };
        SystemNotice.prototype.initUpdate = function (initData) {
            this.$update.find(".input-group").html(window.template.compile(this.template.update)(initData));
            this.updateBindEvent();
        };
        SystemNotice.prototype.updateBindEvent = function () {
            var self = this;
            this.$update.find(".inter").on("input", function () {
                var $this = $(this), val = $this.val();
                if (/^\d*$/.test(val) && parseInt(val) > 0) {
                    $this.attr("old", $this.val());
                }
                else {
                    $this.val($this.attr("old"));
                    window.layer.tips('请输入大于0的正整数', self.$update.find(".inter")[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                }
                ;
            });
            window.laydate.render({
                elem: '.m-updateContent .startDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm',
                value: this.$update.find(".startDate").val()
            });
            window.laydate.render({
                elem: '.m-updateContent .endDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm',
                value: this.$update.find(".endDate").val()
            });
        };
        SystemNotice.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return SystemNotice;
    }(ChartBase));
    return SystemNotice;
});
//# sourceMappingURL=systemNotice.js.map