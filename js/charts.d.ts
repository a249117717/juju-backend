declare namespace Charts {
    // 主体
    class IndexMain {
        $el:JQuery<HTMLElement>;    // 主体
        header:CHeader;  // 头部
        side:CSide;  // 侧栏
        detail:CDetail;  // 详情
        token; // token

        /**
         * 获取数据
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数，默认为]
         * @param {number} start [开始时间戳，默认为0]
         * @param {number} end [结束时间戳，默认为0]
         */
        fetch(pageNo:number,pageSize:number,start?:number,end?:number)
    }

    // 头部
    class CHeader {
        $el:JQuery<HTMLElement>;
        mainView:IndexMain;
        $start:JQuery<HTMLElement>;    // 开始日期
        $end:JQuery<HTMLElement>;  // 结束日期
        $singleDate:JQuery<HTMLElement>;   // 单日期
        $search:JQuery<HTMLElement>;    // 搜索

        /**
         * 获取数据
         */
        fetch()

        /**
         * 初始化日期（截止日期为昨天，开始日期为截止日期往前推7天）
         * @param {boolean} isSingle [是否为单日期]
         */
        initDate(isSingle?:boolean)

        /**
         * 获取初始日期时间戳（开始日期为昨天，截止日期为开始日期往前推7天）
         * @return {object} obj [start:开始日期,end:截止日期]
         */
        getInitDate() :any

        /**
         * 设置标题名称
         * @param {string} title [标题名称]
         */
        setTitle(title:string)

        /**
         * 是否显示搜索框
         * @param {boolean} isShow [true为显示,false为隐藏，默认true]
         */
        showSearch(isShow:boolean)

        /**
         * 设置搜索框的提示文字
         * @param {string} val [提示文字]
         */
        setPlaceHolder (val:string)

        /**
         * 是否显示日期
         * @param {boolean} isShow [true为显示,false为隐藏，默认true]
         */
        showDate(isShow:boolean)

        /**
         * 是否显示单个日期选择
         * @param {boolean} isShow [true为显示,false为隐藏，默认true]
         */
        showSingleDate(isShow:boolean)

        /**
         * 设置最大可选择日期
         * @param {string} maxDate [日期，可不传参表示去除最大日期限制]
         */
        setMaxDate(maxDate:string)

        /**
         * 头部选择控件控制
         * @param {boolean} showSearch [是否显示搜索框，默认false]
         * @param {boolean} showDate [是否显示开始和截止日期选择，默认false]
         * @param {boolean} showSingleDate [是否显示单日日期选择，默认false]
         * @param {string} maxDate [最大可选择日期]
         */
        showMenu(showSearch:boolean,showDate:boolean,showSingleDate:boolean,maxDate:string)
    }

    // 侧栏
    class CSide {
        $el:JQuery<HTMLElement>;
        mainView:IndexMain;

        /**
         * 获取数据
         */
        fetch()

        /**
         * 设置具体某个菜单处于活跃状态
         * @param {string} dom [dom标签]
         */
        setActive(dom:string)
    }

    // 详情
    class CDetail {
        $el:JQuery<HTMLElement>;
        currentChart:ChartBase;
        mainView:IndexMain;

        /**
         * 数据获取
         */
        fetch()

        /**
         * 根据子对象渲染内容
         * @param {string} html [内容]
         */
        renderByChildren(html:string)

        /**
         * 渲染组件
         */
        renderComponent()

        /**
         * 根据侧栏调用相应的类
         * @param {any} chartClass [类]
         */
        callChartBySide(chartClass:any)

        /**
         * 调用组件
         * @param {Class} componentClass [组件]
         */
        component(componentClass:any)
    }

    // 翻页
    class Pading {
        $el:JQuery<HTMLElement>;
        $selectSize:JQuery<HTMLElement>; // 下拉选项
        $selectNo:JQuery<HTMLElement>;   // 翻页 
        mainView:ChartBase;
        template:string;
        total:number;   // 总页数
        pageNo:number;  // 当前页码
        pageSize:number;    // 每页条数
        selectSize:Array<string>; // 下拉选项
        selected:string; // 下拉选项默认选中的值
        state;
        isFirst:boolean; // 是否为第一次加载，默认为true

        /**
         * 获取数据
         */
        fetch()

        /**
         * 设置总页数
         * @param {number} count [总条数]
         */
        setTotal(count:number)
    }

    // 图表
    class ChartBase {
        mainView:CDetail;
        $el:JQuery<HTMLElement>;
        pading:Pading;   // 翻页控件

        constructor(props:any)

        /**
         * 数据获取
         */
        fetch(data?:any)

        /**
         * 搜索（为了点击头部的搜索按钮进行搜索）
         * @param {string} query [搜索关键字]
         */
        search(query:string)

        /**
         * 日期变更（为了头部选择日期之后进行触发）
         * @param {string} start [开始日期]
         * @param {string} end [结束日期]
         */
        changeDate(start:string,end:string)

        /**
         * 页码变更
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        changePading(pageNo:number,pageSize:number)

        /**
         * 冻结用户
         */
        frozen()

        /**
         * 获取表单提交的返回信息
         * @param {HTMLElement} e [表单元素]
         */
        getFormReturn(e:HTMLElement)
    }
}