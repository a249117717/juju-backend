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
define(["text!module/chart/views/messageListTemp.html", "text!module/chart/views/messageListDetail.html", "text!module/chart/views/messageListUpdate.html"], function (messageListTemp, messageListDetail, messageListUpdate) {
    var MessageList = (function (_super) {
        __extends(MessageList, _super);
        function MessageList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.uid = 0;
            _this.template = {
                "routerTemp": messageListTemp,
                "detail": messageListDetail,
                "update": messageListUpdate
            };
            return _this;
        }
        MessageList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.messageList(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "uid": this.uid,
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
        MessageList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-messageList");
            this.$add = this.$el.find(".addMessage");
            this.$update = this.$el.find(".updateMessage");
            this.bindEvent();
        };
        MessageList.prototype.bindEvent = function () {
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
                window.layer.confirm("是否确认新增消息", function (e) {
                    _load(true);
                    _resource.addMessage(JSON.stringify(self.getMessage(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("新增成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            window.laydate.render({
                elem: '.m-addContent .sendTime',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            this.$add.find(".operation").on("change", function () {
                var $this = $(this);
                switch ($this.val()) {
                    case "0":
                        self.$add.find(".inputUid").hide().find(".uid").val("");
                        break;
                    case "1":
                        self.$add.find(".inputUid").show().find(".uid").focus();
                        break;
                }
                ;
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this), mid = parseInt($this.attr("mid"));
                window.layer.confirm("\u786E\u8BA4\u5220\u9664\u7F16\u53F7\u4E3A" + mid + "\u7684\u6D88\u606F\u4E48\uFF1F", function (e) {
                    _resource.deleteMessage(JSON.stringify({
                        "id": mid,
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
                if (!self.messageCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateMeesage(JSON.stringify(self.getMessage(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
        };
        MessageList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        MessageList.prototype.messageCheck = function ($JQ) {
            var tip = "", uid = $JQ.find(".uid").val().replace(/\s/g, "");
            if ($JQ.find(".operation:checked").val() == "1" && (!uid || !/^\d*$/.test(uid))) {
                if (!uid) {
                    tip = "请输入用户编号";
                }
                else if (!/^\d*$/.test(uid)) {
                    tip = "请填写正确的用户编号";
                }
                ;
            }
            else if (!$JQ.find(".sendTime").val()) {
                tip = "请选择发送时间";
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
        MessageList.prototype.getMessage = function ($JQ) {
            var option = null;
            if ($JQ.hasClass("addMessage")) {
                option = {
                    "uid": 0,
                    "content": "",
                    "send_time": 0,
                    "token": this.mainView.mainView.token
                };
            }
            else if ($JQ.hasClass("updateMessage")) {
                option = {
                    "id": parseInt($JQ.find(".mid").val()),
                    "uid": 0,
                    "content": "",
                    "send_time": 0,
                    "token": this.mainView.mainView.token
                };
            }
            ;
            switch ($JQ.find(".operation:checked").val()) {
                case "0":
                    option.uid = 0;
                    break;
                case "1":
                    option.uid = parseInt($JQ.find(".uid").val());
                    break;
            }
            ;
            var date = new Date($JQ.find(".sendTime").val());
            option.send_time = parseInt((date.getTime() / 1000));
            option.content = $JQ.find(".reason").val();
            return option;
        };
        MessageList.prototype.showUpdate = function ($obj) {
            var _this = this;
            var $tr = $obj.parents("tr");
            this.$update.show();
            setTimeout(function () {
                _this.$update.addClass("active");
            }, 10);
            this.initUpdate({
                "mid": parseInt($obj.attr("mid")),
                "uid": parseInt($obj.attr("uid")),
                "send_time": $tr.find(".mtime").text(),
                "content": $tr.find(".mcontent").text()
            });
        };
        MessageList.prototype.initUpdate = function (initData) {
            this.$update.find(".input-group").html(window.template.compile(this.template.update)(initData));
            this.updateBindEvent();
            switch (initData.uid) {
                case 0:
                    this.$update.find(".operation:eq(0)").prop("checked", true).trigger("change");
                    break;
                default:
                    this.$update.find(".operation:eq(1)").prop("checked", true).trigger("change");
                    this.$update.find(".uid").val(initData.uid);
                    break;
            }
            ;
        };
        ;
        MessageList.prototype.updateBindEvent = function () {
            var self = this;
            this.$update.find(".operation").on("change", function () {
                var $this = $(this);
                switch ($this.val()) {
                    case "0":
                        self.$update.find(".inputUid").hide().find(".uid").val("");
                        break;
                    case "1":
                        self.$update.find(".inputUid").show().find(".uid").focus();
                        break;
                }
                ;
            });
            window.laydate.render({
                elem: '.m-updateContent .sendTime',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm',
                value: this.$update.find(".sendTime").val()
            });
        };
        MessageList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        MessageList.prototype.search = function (query) {
            if (!/^\d*$/.test(query)) {
                window.layer.msg("请填写正确的用户编号");
            }
            else {
                if (query) {
                    this.uid = parseInt(query);
                }
                else {
                    this.uid = 0;
                }
                ;
                this.fetch(undefined, undefined);
            }
            ;
        };
        return MessageList;
    }(ChartBase));
    return MessageList;
});
//# sourceMappingURL=messageList.js.map