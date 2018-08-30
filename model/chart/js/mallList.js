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
var MallList = (function (_super) {
    __extends(MallList, _super);
    function MallList(props) {
        var _this = _super.call(this, props) || this;
        _this.$el = null;
        _this.template = {
            "routerTemp": "mallListTemp",
            "detail": "mallListDetail"
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
        this.bindEvent();
    };
    MallList.prototype.bindEvent = function () {
    };
    MallList.prototype.renderDetail = function (data) {
    };
    MallList.prototype.changePading = function (pageNo, pageSize) {
        this.fetch(pageNo, pageSize);
    };
    return MallList;
}(ChartBase));
window["Process"] = MallList;
//# sourceMappingURL=mallList.js.map