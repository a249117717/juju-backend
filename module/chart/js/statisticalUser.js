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
define(["text!module/chart/views/statisticalTemp.html", "text!module/chart/views/statisticalDetail.html"], function (statisticalTemp, statisticalDetail) {
    var StatisticalUser = (function (_super) {
        __extends(StatisticalUser, _super);
        function StatisticalUser(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.maxDate = null;
            _this.chart = null;
            _this.template = {
                "routerTemp": statisticalTemp,
                "detail": statisticalDetail
            };
            return _this;
        }
        StatisticalUser.prototype.fetch = function (pageNo, pageSize, start, end) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = 50; }
            var self = this;
            if (!start) {
                var date = this.mainView.mainView.header.getInitDate();
                this.maxDate = date.end;
                this.changeDate(date.start, date.end);
                return;
            }
            ;
            _load(true);
            _resource.statisticalUser(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "start_time": start,
                "end_time": end,
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
        StatisticalUser.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(false, true, false, this.maxDate);
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-statisticalUser");
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
        StatisticalUser.prototype.bindEvent = function () { };
        StatisticalUser.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
            this.renderChart(data);
        };
        StatisticalUser.prototype.renderChart = function (data) {
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
        StatisticalUser.prototype.formatData = function (data) {
            var temp = [], date = new Date();
            data.data.forEach(function (en) {
                date.setTime(en.create_time * 1000);
                en.create_time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                temp.push({
                    "create_time": en.create_time,
                    "type": "日活跃",
                    "value": parseInt(en.dau)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "日注册人数",
                    "value": parseInt(en.day_register)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "月活跃",
                    "value": parseInt(en.mau)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "七日",
                    "value": parseInt(en.seven_day)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "三日",
                    "value": parseInt(en.three_day)
                });
                temp.push({
                    "create_time": en.create_time,
                    "type": "两日",
                    "value": parseInt(en.two_day)
                });
            });
            return temp;
        };
        StatisticalUser.prototype.changeDate = function (start, end) {
            start = parseInt(((new Date(start + " 00:00:00")).getTime() / 1000));
            end = parseInt(((new Date(end + " 00:00:00")).getTime() / 1000));
            this.fetch(1, 50, start, end);
        };
        return StatisticalUser;
    }(ChartBase));
    return StatisticalUser;
});
//# sourceMappingURL=statisticalUser.js.map