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
define(["text!module/chart/views/mallListTemp.html", "text!module/chart/views/mallListDetail.html", "text!module/chart/views/mallListUpdate.html"], function (mallListTemp, mallListDetail, mallListUpdate) {
    var MallList = (function (_super) {
        __extends(MallList, _super);
        function MallList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": mallListTemp,
                "detail": mallListDetail,
                "update": mallListUpdate
            };
            $.extend(_this, props);
            return _this;
        }
        MallList.prototype.fetch = function () {
            var self = this;
            _load(true);
            _resource.mallList(JSON.stringify({
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    self.render(data);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        MallList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
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
                window.layer.confirm("是否确认新增商城商品", function (e) {
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
                var $this = $(this);
                switch ($this.val()) {
                    case "1":
                        self.$add.find(".reducePrice-out").hide();
                        self.$add.find(".gitDiamon-out").show();
                        break;
                    case "2":
                        self.$add.find(".gitDiamon-out").hide();
                        self.$add.find(".reducePrice-out").show();
                        break;
                }
            });
            this.$add.find(".gitDiamon,.diamonNumber,.reducePrice,.produceId,.price").on("input", function () {
                var $this = $(this), val = $this.val();
                if (/^\d*$/.test(val) && parseInt(val) >= 0) {
                    $this.attr("old", $this.val());
                }
                else {
                    $this.val($this.attr("old"));
                    window.layer.tips('请输入大于等于0的整数', $this[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                }
                ;
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this);
                window.layer.confirm("\u662F\u5426\u5220\u9664\u7F16\u53F7\u4E3A" + $this.attr("mid") + "\u7684\u5546\u54C1\uFF1F", function (e) {
                    _resource.DeleteMall(JSON.stringify({
                        "id": parseInt($this.attr("mid")),
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
                    _resource.updateMall(JSON.stringify(self.getSubmitData(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch();
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
        };
        MallList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        MallList.prototype.showUpdate = function ($obj) {
            var _this = this;
            var $tr = $obj.parents("tr"), head = $tr.find(".head .pho").attr("src"), mid = parseInt($obj.attr("mid"));
            head == "common/images/defaultUser.png" ? "" : head;
            this.$update.show();
            setTimeout(function () {
                _this.$update.addClass("active");
            }, 10);
            this.initUpdate({
                "mid": mid,
                "type": $obj.attr("mtype"),
                "num": parseInt($tr.find(".num").text()),
                "give_num": mid == 1 ? parseInt($tr.find(".giveNum").text()) : parseInt($tr.find(".discount_price").text()),
                "product_id": parseInt($tr.find(".pid").text()),
                "price": parseInt($tr.find(".price").text())
            });
        };
        MallList.prototype.initUpdate = function (initData) {
            var $update = this.$update;
            $update.find(".input-group").html(window.template.compile(this.template.update)(initData));
            $update.find(".operation").eq(parseInt(initData.type) - 1).prop("checked", true);
            switch (initData.type) {
                case "1":
                    $update.find(".reducePrice-out").hide();
                    $update.find(".gitDiamon").attr("old", initData.give_num).val(initData.give_num);
                    break;
                case "2":
                    $update.find(".gitDiamon-out").hide();
                    $update.find(".reducePrice").attr("old", initData.give_num / 100).val(initData.give_num);
                    break;
            }
            ;
            this.updateBindEvent();
        };
        MallList.prototype.updateBindEvent = function () {
            var self = this;
            this.$update.find(".operation").on("change", function () {
                var $this = $(this);
                switch ($this.val()) {
                    case "1":
                        self.$update.find(".reducePrice-out").hide();
                        self.$update.find(".gitDiamon-out").show();
                        break;
                    case "2":
                        self.$update.find(".gitDiamon-out").hide();
                        self.$update.find(".reducePrice-out").show();
                        break;
                }
            });
            this.$update.find(".gitDiamon,.diamonNumber,.reducePrice,.produceId,.price").on("input", function () {
                var $this = $(this), val = $this.val();
                if (/^\d*$/.test(val) && parseInt(val) >= 0) {
                    $this.attr("old", $this.val());
                }
                else {
                    $this.val($this.attr("old"));
                    window.layer.tips('请输入大于等于0的整数', $this[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                }
                ;
            });
        };
        MallList.prototype.dataCheck = function ($JQ) {
            var tip = "";
            if (!$JQ.find(".diamonNumber").val()) {
                tip = "请输入钻石数量";
            }
            else if ($JQ.find(".operation:checked").val() == 1 && !$JQ.find(".gitDiamon").val()) {
                tip = "请输入赠送钻石数量";
            }
            else if ($JQ.find(".operation:checked").val() == 2 && !$JQ.find(".reducePrice").val()) {
                tip = "请输入立减价格";
            }
            else if (!$JQ.find(".produceId").val()) {
                tip = "请输入苹果商品ID";
            }
            else if (!$JQ.find(".price").val()) {
                tip = "请输入价格";
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
        MallList.prototype.getSubmitData = function ($JQ) {
            var option = {
                "type": parseInt($JQ.find(".operation:checked").val()),
                "num": parseInt($JQ.find(".diamonNumber").val()),
                "give_num": 0,
                "discount_price": 0,
                "product_id": parseInt($JQ.find(".produceId").val()),
                "price": $JQ.find(".price").val() * 100,
                "token": this.mainView.mainView.token
            };
            switch ($JQ.find(".operation:checked").val()) {
                case "1":
                    option.give_num = parseInt($JQ.find(".gitDiamon").val());
                    break;
                case "2":
                    option.discount_price = $JQ.find(".reducePrice").val() * 100;
                    break;
            }
            ;
            if ($JQ.is(".updateProcude")) {
                option["id"] = parseInt($JQ.find(".mid").val());
            }
            ;
            return option;
        };
        return MallList;
    }(ChartBase));
    return MallList;
});
//# sourceMappingURL=mallList.js.map