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
define(["text!model/chart/views/diamondTemp.html", "text!model/chart/views/diamondDetail.html"], function (diamondTemp, diamondDetail) {
    var Diamond = (function (_super) {
        __extends(Diamond, _super);
        function Diamond(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": diamondTemp,
                "detail": diamondDetail
            };
            $.extend(_this, props);
            return _this;
        }
        Diamond.prototype.fetch = function (pageNo, pageSize, uid) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            if (uid === void 0) { uid = 0; }
            var self = this;
            _load(true);
            _resource.diamond(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "uid": uid,
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
        Diamond.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-diamond");
            this.bindEvent();
        };
        Diamond.prototype.bindEvent = function () {
        };
        Diamond.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
        };
        Diamond.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        Diamond.prototype.search = function (query) {
            if (!/^\d*$/.test(query)) {
                window.layer.msg("请填写正确的用户编号");
            }
            else {
                this.fetch(undefined, this.pading.pageSize, query ? parseInt(query) : undefined);
            }
            ;
        };
        return Diamond;
    }(ChartBase));
    return Diamond;
});
//# sourceMappingURL=diamond.js.map