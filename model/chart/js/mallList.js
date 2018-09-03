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
define(["text!model/chart/views/mallListTemp.html", "text!model/chart/views/mallListDetail.html", "text!model/chart/views/mallListUpdate.html"], function (mallListTemp, mallListDetail, mallListUpdate) {
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
        };
        MallList.prototype.renderDetail = function (data) {
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
                "product_id": parseInt($JQ.find(".produceId").val()),
                "price": $JQ.find(".price").val() * 100,
                "token": this.mainView.mainView.token
            };
            switch ($JQ.find(".operation:checked").val()) {
                case "1":
                    option.give_num = parseInt($JQ.find(".gitDiamon").val());
                    break;
                case "2":
                    option.give_num = $JQ.find(".reducePrice").val() * 100;
                    break;
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