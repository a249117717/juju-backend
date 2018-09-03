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
define(["text!model/chart/views/payStatisticalTemp.html", "text!model/chart/views/payStatisticalDetail.html"], function (payStatisticalTemp, payStatisticalDetail) {
    var PayStatistical = (function (_super) {
        __extends(PayStatistical, _super);
        function PayStatistical(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.chart = null;
            _this.template = {
                "routerTemp": payStatisticalTemp,
                "detail": payStatisticalDetail
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
        PayStatistical.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(false, false, true);
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-payStatistical");
            this.chart = new window.G2.Chart({
                container: 'diagram',
                height: 400,
                forceFit: true,
                padding: ['auto', 50, 'auto', 'auto'],
                background: {
                    fill: "#fff"
                }
            });
            this.bindEvent();
        };
        PayStatistical.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
            this.renderChart(data);
        };
        PayStatistical.prototype.renderChart = function (data) {
            var chart = this.chart;
            chart.clear();
            chart.source(this.formatData(data));
            chart.scale('value', {
                min: 0
            });
            chart.tooltip(true, {
                itemTpl: "<li><span style='margin:8px 7px 0 0;padding:3px;display:block;float:left;border-radius:100%;background-color:{color}'></span>{name} : {value}人</li>",
                crosshairs: {
                    type: 'line'
                }
            });
            chart.axis('value', {
                line: {
                    stroke: '#BDBDBD'
                }
            });
            chart.axis('create_time', {
                line: {
                    stroke: '#BDBDBD'
                }
            });
            chart.legend(true);
            chart.line().position('create_time*value').color("type");
            chart.point().position('create_time*value').color("type").size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        };
        PayStatistical.prototype.formatData = function (data) {
            var temp = [], date = new Date();
            data.data.forEach(function (en) {
                date.setTime(en.create_time * 1000);
                en.create_time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                temp.push({
                    "create_time": en.create_time,
                    "type": "累计订单总额",
                    "value": parseInt(en.total_cash)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "累计付费用户数",
                    "value": parseInt(en.total_user)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "累计购买钻石总额",
                    "value": parseInt(en.total_diamond_cash)
                });
            });
            return temp;
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
    return PayStatistical;
});
//# sourceMappingURL=payStatistical.js.map