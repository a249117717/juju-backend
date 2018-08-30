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
var PayStatistical = (function (_super) {
    __extends(PayStatistical, _super);
    function PayStatistical(props) {
        var _this = _super.call(this, props) || this;
        _this.$el = null;
        _this.template = {
            "routerTemp": "payStatisticalTemp",
            "detail": "payStatisticalDetail"
        };
        $.extend(_this, props);
        return _this;
    }
    PayStatistical.prototype.fetch = function (pageNo, pageSize) {
        if (pageNo === void 0) { pageNo = 1; }
        if (pageSize === void 0) { pageSize = _pageSize; }
        var self = this;
        _load(true);
        _resource.payStatistical(JSON.stringify({
            "page_size": pageSize,
            "page_index": pageNo,
            "day": 0,
            "token": this.mainView.mainView.token
        }), function (data) {
            if (!this.activation) {
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
    PayStatistical.prototype.render = function (data) {
        var header = this.mainView.mainView.header;
        header.showMenu(false, false, true);
        this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
        this.$el = $(".m-payStatistical");
        this.bindEvent();
    };
    PayStatistical.prototype.renderDetail = function (data) {
        this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
    };
    PayStatistical.prototype.changePading = function (pageNo, pageSize) {
        this.fetch(pageNo, pageSize);
    };
    PayStatistical.prototype.changeDate = function (start, end) {
        this.fetch();
    };
    PayStatistical.prototype.bindEvent = function () {
    };
    return PayStatistical;
}(ChartBase));
window["Process"] = PayStatistical;
//# sourceMappingURL=payStatistical.js.map