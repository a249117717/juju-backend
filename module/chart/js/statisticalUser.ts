/// <reference path="../../../js/charts.d.ts" />

define(["text!model/chart/views/statisticalTemp.html","text!model/chart/views/statisticalDetail.html"],function(statisticalTemp,statisticalDetail){
    // 统计用户
    class StatisticalUser extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        maxDate:string = null;  // 最大可选择日期
        chart:any = null;   // 图表
        template = { // 模板
            "routerTemp":statisticalTemp,
            "detail":statisticalDetail
        };

        constructor(props:any) {
            super(props);
        }

        /**
         * 获取数据
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数，默认为]
         * @param {number} start [开始时间戳，默认为0]
         * @param {number} end [结束时间戳，默认为0]
         */
        fetch(pageNo:number = 1,pageSize:number = 50,start?:number,end?:number) {
            let self:StatisticalUser = this;
            if(!start) {    // 如果开始日期不存在，则调用changeDate函数，并将初始日期传递过去
                let date = this.mainView.mainView.header.getInitDate();
                this.maxDate = date.end;
                this.changeDate(date.start,date.end);
                return;
            };

            _load(true);
            (<Function>_resource.statisticalUser)(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "start_time":start,
                "end_time":end,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(!self.$el) {
                    self.render(data);
                };
                self.renderDetail(data)
                _load(false);
            });
        }

        /**
         * 页面渲染
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(false,true,false,this.maxDate);
            

            this.mainView.renderByChildren((<any>window).template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-statisticalUser");
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
         * 事件绑定
         */
        bindEvent() {}

        /**
         * 渲染详情
         * @param {Object} data [数据]
         */
        renderDetail(data:any) {
            this.$el.find(".info").html((<any>window).template.compile(this.template.detail)(data));
            this.renderChart(data);
        }

        /**
         * 渲染图表
         * @param {Object} data [数据]
         */
        renderChart(data:any) {
            let chart = this.chart;
            chart.clear();

            // Step 2: 载入数据源
            chart.source(this.formatData(data));
            // 设置坐标轴范围
            chart.scale('value', {
                min: 0
            });
            // 设置提示框
            chart.tooltip(true,{
                itemTpl:"<li><span style='margin:8px 7px 0 0;padding:3px;display:block;float:left;border-radius:100%;background-color:{color}'></span>{name} : {value}人</li>",
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
         * 格式化数据
         * @param {Object} data [数据]
         */
        formatData(data:any) : object {
            let temp:any[] = [],
            date:Date = new Date();

            data.data.forEach(en => {
                date.setTime(en.create_time*1000);
                en.create_time = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
                temp.push({
                    "create_time":en.create_time,
                    "type":"日活跃",
                    "value":parseInt(en.dau)
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"日注册人数",
                    "value":parseInt(en.day_register)
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"月活跃",
                    "value":parseInt(en.mau)
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"七日",
                    "value":parseInt(en.seven_day)
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"三日",
                    "value":parseInt(en.three_day)
                });
                temp.push({
                    "create_time":en.create_time,
                    "type":"两日",
                    "value":parseInt(en.two_day)
                });
            });
            
            return temp;
        }

        /**
         * 日期变更（为了头部选择日期之后进行触发）
         * @param {string} start [开始日期]
         * @param {string} end [结束日期]
         */
        changeDate(start:string|number,end:string|number) {
            start = parseInt(<any>((new Date(`${start} 00:00:00`)).getTime()/1000));
            end = parseInt(<any>((new Date(`${end} 00:00:00`)).getTime()/1000));

            this.fetch(1,50,start,end);
        }
    }

    return StatisticalUser;
});