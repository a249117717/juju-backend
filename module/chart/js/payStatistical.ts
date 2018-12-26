/// <reference path="../../../js/charts.d.ts" />

define(["text!module/chart/views/payStatisticalTemp.html","text!module/chart/views/payStatisticalDetail.html"],function(payStatisticalTemp,payStatisticalDetail){
    // 付费统计
    class PayStatistical extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        chart:any = null;
        dayInfo:{
            "day":string    // 日期
            "timestamp":number  // 时间戳
        } = {
            "day":"0",
            "timestamp":0
        };
        template = {
            "routerTemp":payStatisticalTemp,
            "detail":payStatisticalDetail
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         * @param {number} pageSize [每页条数]
         * @param {uid} string [用户编号]
         * @param {number} day [时间戳]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize,day:number = this.dayInfo.timestamp) {
            let self:PayStatistical = this;

            _load(true);
            (<Function>_resource.payStatistical)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "day":day,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(!self.$el) {
                    self.render(data);
                } else {
                    // 设置总页数
                    self.pading.setTotal(data.count);
                };
                self.renderDetail(data)
                _load(false);
            });
        }

        /**
         * 页面渲染
         * @param {object} data [数据]
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            
            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-payStatistical");
            this.chart = new (<any>window).G2.Chart({
                container: 'diagram', // 指定图表容器 ID
                height : 400, // 指定图表高度
                forceFit: true, // 自适应宽度
                padding:['auto',50,'auto','auto'],
                background:{
                    fill:"#fff"
                }
            });

            this.bindEvent();
        }

        /**
         * 渲染详情
         * @param {Object} data [数据]
         */
        renderDetail(data:any) {
            if(data.data) {
                this.$el.find(".info").html((<any>window).template.compile(this.template.detail)(data));
                if(data.data.length == 1) { // 单个数据用柱状图
                    this.renderChartForColumn(data);
                } else {    // 多个数据用折线图
                    this.renderChart(data);
                };
            } else {
                (<any>window).layer.msg(`暂无${this.dayInfo.day}的数据`);
            };
        }

        /**
         * 渲染图表
         * @param {Object} data [数据]
         */
        renderChart(data:any) {
            let chart = this.chart;
            chart.clear();

            // Step 2: 载入数据源
            chart.source(this.formatData(data,1));
            // 设置坐标轴范围
            chart.scale('value', {
                min: 0
            });
            // 设置提示框
            chart.tooltip(true,{
                itemTpl:"<li><span style='margin:8px 7px 0 0;padding:3px;display:block;float:left;border-radius:100%;background-color:{color}'></span>{name} : {value}</li>",
                crosshairs: {
                    type: 'line'
                }
            });
            // 设置坐标轴
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
            // 设置图例
            chart.legend(true);
            // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
            chart.line().position('create_time*value').color("type");
            chart.point().position('create_time*value').color("type").size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            // Step 4: 渲染图表
            chart.render();
        }

        /**
         * 渲染图标（柱状图）
         * @param {Object} data [数据]
         */
        renderChartForColumn(data:any) {
            let chart = this.chart;
            chart.clear();

            // Step 2: 载入数据源
            chart.source(this.formatData(data,2));
            // 设置坐标轴范围
            chart.scale('value', {
                min: 0
            });
            // 设置提示框
            chart.tooltip(true,{
                itemTpl:"<li><span style='margin:8px 7px 0 0;padding:3px;display:block;float:left;border-radius:100%;background-color:{color}'></span>{name} : {value}</li>",
                crosshairs: {
                    type: 'line'
                }
            });
            // 设置坐标轴
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
            // 设置图例
            chart.legend(true);
            // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
            chart.interval().position('create_time*value').color('type').adjust([{
                type: 'dodge',
                marginRatio: 1 / 32
            }]);
            // Step 4: 渲染图表
            chart.render();
        }

        /**
         * 格式化数据
         * @param {Object} data [数据]
         * @param {number} operation [操作，1为折线图，2为柱状图]
         */
        formatData(data:any,operation:number) : object {
            let temp:any[] = [],
            date:Date = new Date(),
            str = operation == 1?"":" ";

            data.data.forEach(en => {
                date.setTime(en.create_time*1000);
                en.create_time = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}${str}`;
                temp.push({
                    "create_time":en.create_time,
                    "type":"累计订单总额",
                    "value":parseInt(en.total_cash) / 100
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"累计付费用户数",
                    "value":parseInt(en.total_user)
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"累计购买钻石总额",
                    "value":parseInt(en.total_diamond_cash) / 100
                });
            });
            
            return temp;
        }

        /**
         * 页码变更
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        changePading(pageNo:number,pageSize:number) {
            this.fetch(pageNo,pageSize);
        }

        /**
         * 日期变更（为了头部选择日期之后进行触发）
         * @param {string} start [开始日期]
         */
        changeDate(start:string) {
            this.dayInfo.day = start;
            this.dayInfo.timestamp = parseInt(<any>((new Date(`${start} 00:00:00`)).getTime()/1000));
            this.fetch();
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    return PayStatistical;
});