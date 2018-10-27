/// <reference path="../../../js/charts.d.ts" />

define([],function(){
    // 注册欢迎消息
    class StartUp extends ChartBase {
        $el:JQuery<HTMLElement> = null;
        $add:JQuery<HTMLElement> = null;    // 新增欢迎消息
        $update:JQuery<HTMLElement> = null;    // 更新欢迎消息
        template = { // 模板
        };

        constructor(props:any) {
            super(props);
        }

        /**
         * 获取数据
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize) {
        }

        /**
         * 页面渲染
         * @param {Object} data [数据]
         */
        render(data:any) {
        }

        /**
         * 事件绑定
         */
        bindEvent() {
        }
    }
});