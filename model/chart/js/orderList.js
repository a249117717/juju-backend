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
var OrderList = (function (_super) {
    __extends(OrderList, _super);
    function OrderList(props) {
        var _this = _super.call(this, props) || this;
        _this.$el = null;
        _this.template = {
            "routerTemp": "mallListTemp",
            "detail": "mallListDetail"
        };
        $.extend(_this, props);
        return _this;
    }
    OrderList.prototype.fetch = function (pageNo, pageSize) {
        if (pageNo === void 0) { pageNo = 1; }
        if (pageSize === void 0) { pageSize = _pageSize; }
        var self = this;
        self.render({});
    };
    OrderList.prototype.render = function (data) {
        var header = this.mainView.mainView.header;
        header.showMenu();
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
window["Process"] = OrderList;
//# sourceMappingURL=orderList.js.map