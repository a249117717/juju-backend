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
define(["text!model/chart/views/orderListTemp.html", "text!model/chart/views/orderListDetail.html"], function (orderListTemp, orderListDetail) {
    var OrderList = (function (_super) {
        __extends(OrderList, _super);
        function OrderList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": orderListTemp,
                "detail": orderListDetail
            };
            $.extend(_this, props);
            return _this;
        }
        OrderList.prototype.fetch = function (pageNo, pageSize, start, end) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
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
        };
        OrderList.prototype.renderDetail = function (data) {
        };
        OrderList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return OrderList;
    }(ChartBase));
    return OrderList;
});
//# sourceMappingURL=orderList.js.map