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
define(["text!module/chart/views/infoQueryTemp.html", "text!module/chart/views/infoQueryDetail.html"], function (infoQueryTemp, infoQueryDetail) {
    var InfoQuery = (function (_super) {
        __extends(InfoQuery, _super);
        function InfoQuery(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$question = null;
            _this.$detail = null;
            _this.template = {
                "routerTemp": infoQueryTemp,
                "detail": infoQueryDetail
            };
            $.extend(_this, props);
            return _this;
        }
        InfoQuery.prototype.fetch = function (uid) {
            this.render();
        };
        InfoQuery.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)({}));
            this.$el = $(".m-infoQuery");
            this.$question = this.$el.find(".question");
            this.$detail = this.$el.find(".detail");
            this.bindEvent();
        };
        InfoQuery.prototype.bindEvent = function () {
        };
        InfoQuery.prototype.renderDetail = function (data) {
            this.$question.hide();
            this.$detail.show();
            this.$detail.find(".info-out").html(window.template.compile(this.template.detail)(data));
        };
        InfoQuery.prototype.search = function (query) {
            var self = this;
            if (/^\d*$/.test(query)) {
                _load(true);
                _resource.infoQuery(JSON.stringify({
                    "uid": parseInt(query),
                    "token": this.mainView.mainView.token
                }), function (data) {
                    self.renderDetail(data);
                    _load(false);
                });
            }
            else {
                this.$question.show();
                this.$detail.hide();
                window.layer.msg("请输入正确的用户编号");
            }
            ;
        };
        return InfoQuery;
    }(ChartBase));
    return InfoQuery;
});
//# sourceMappingURL=infoQuery1.js.map