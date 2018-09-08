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
define(["text!module/chart/views/orderListTemp.html", "text!module/chart/views/orderListDetail.html"], function (orderListTemp, orderListDetail) {
    var OrderList = (function (_super) {
        __extends(OrderList, _super);
        function OrderList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.select = "30,50,100,200";
            _this.selected = 30;
            _this.template = {
                "routerTemp": orderListTemp,
                "detail": orderListDetail
            };
            $.extend(_this, props);
            return _this;
        }
        OrderList.prototype.fetch = function (pageNo, pageSize, start, end) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = this.selected; }
            var self = this;
            _load(true);
            _resource.orderList(JSON.stringify({
                "start_time": start,
                "end_time": end,
                "page_size": pageSize,
                "page_index": pageNo,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    data["select"] = self.select;
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
        OrderList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(false, true);
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-orderList");
            this.bindEvent();
        };
        OrderList.prototype.bindEvent = function () {
            var self = this;
            this.$el.find(".detail").on("click", ".btn-elivery", function () {
                var $this = $(this);
                window.layer.confirm("\u7F16\u53F7\u4E3A" + $this.attr("oid") + "\u7684\u8BA2\u5355\u662F\u5426\u4EA4\u8D27\uFF1F", function (e) {
                    _resource.deliveryOrder(JSON.stringify({
                        "id": parseInt($this.attr("oid")),
                        "token": self.mainView.mainView.token
                    }), function () {
                        $this.prop("disabled", true);
                        window.layer.msg("交货成功");
                        window.layer.close(e);
                    });
                });
            });
        };
        OrderList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        OrderList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return OrderList;
    }(ChartBase));
    return OrderList;
});
//# sourceMappingURL=orderList.js.map