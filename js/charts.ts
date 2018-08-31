// 注册过滤器，转换时间戳
(<any>window).template.helper('formatDate',function(data,format){
    let date:Date = new Date();
    date.setTime(data*1000);

    let dateD:string = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");
    
    switch(format) {
        case 1: // 转换时间戳到分
            let dateT:string = ` ${date.getHours()}:${date.getMinutes()}`.replace(/(?<=\s)([0-9])(?=:)|(?<=:)([0-9])$/g,"0$1$2");
            return `${dateD}${dateT}`;
        default:
            return dateD;
    };
});

// 主体
class IndexMain {
    $el:JQuery<HTMLElement> = $(".g-chartDetail");    // 主体
    header:CHeader = null;  // 头部
    side:CSide = null;  // 侧栏
    detail:CDetail = null;  // 详情
    changepwd:ChangePWD = null; // 密码变更
    frozenInfo:FrozenInfo = null;   // 冻结信息
    givDiamond:GivDiamond = null;   // 赠送钻石
    token = ""; // token
    chartClass:{    // 目录类
        [index:string]:any
    } = {};

    constructor() {
        this.getToken();
        this.initMethod();
    }

    /**
     * 获取数据
     */
    fetch() {
        this.render();
    }

    /**
     * 页面渲染
     */
    render() {
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:IndexMain = this;

        this.windowEvent();

        // 绑定iframe表单的加载事件
        $("#formReturn").on("load",function(){
            self.detail.currentChart.getFormReturn(this);
        });
    }
    
    /**
     * 一些初始化的操作
     */
    initMethod() {
        let options = {
            mainView:this
        };
        
        // 头部
        this.header = new CHeader(options);
        this.header.fetch();

        // 侧栏
        this.side = new CSide(options);
        this.side.fetch();

        // 变更密码
        this.changepwd = new ChangePWD(options);
        // 冻结信息
        this.frozenInfo = new FrozenInfo(options);
        // 赠送钻石
        this.givDiamond = new GivDiamond(options);

        // 详情
        this.detail = new CDetail(options)
    }

    /**
     * 一些系统事件的监听
     */
    windowEvent() {
        let self:IndexMain = this;

        if(!("onhashchange" in window)) {
            // 如果当前浏览器不支持onhashchange事件，则提示
            (<any>window).layer.alert("您的浏览器版本过低，请升级浏览器或使用Chrome浏览器！");
        };

        // 监听onhashchange事件，地址栏变动
        window.onhashchange = function(){
             let hash:string = window.location.hash.substr(1);
            
            if(!~_router.indexOf(hash)) {// 如果hash不存在，则访问路由中的第一个
                hash = _router[0];
            };
            
            // 左侧菜单显示相应的目录
            self.side.setActive(`.${hash}`);
            // 实例化相应的类
            self.detail.callChartBySide(hash);
        };
        // 设置了监听事件后，立刻执行一遍，因为当前页面可能是刷新出来的
        window.onhashchange(null);
    }

    /**
     * 获取token
     */
    getToken() {
        let token:string = window.localStorage["jujuBackend"];
        if(!token) {
            window.location.replace("index.html");
        } else {
            this.token = token;
            // 清空token
            // delete window.localStorage["jujuBackend"];
        };
    }
}

// 头部
class CHeader {
    $el:JQuery<HTMLElement> = $(".c-header");
    mainView:IndexMain = null;
    calendar:any = null;    // 日期选择控件
    $start:JQuery<HTMLElement> = this.$el.find(".date-out .start .date");    // 开始日期
    $end:JQuery<HTMLElement> = this.$el.find(".date-out .end .date");  // 结束日期
    $singleDate:JQuery<HTMLElement> = this.$el.find(".singleDate .date");   // 单日期
    $search:JQuery<HTMLElement> =  this.$el.find(".search");    // 搜索

    constructor(props:any) {
        $.extend(this,props);
    }

    /**
     * 获取数据
     */
    fetch() {
        this.render();
    }

    /**
     * 页面渲染
     */
    render() {
        this.initDate();
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:CHeader = this;

        // 初始化日期选择控件
        this.calendar = new (<any>window).Calendar({
            submitMethod:function(start,end,obj){
                start = start.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");
                // 变更头部显示的日期
                if(obj.isSingle) {
                    self.$singleDate.text(start);
                } else {
                    end = end.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");
                    self.$start.text(start);
                    self.$end.text(end);
                };
                // 触发详情的改变日期函数
                self.mainView.detail.currentChart.changeDate(start,end);
            },
            "choiceModel":2,
            "isReset":true,
            "haveSubmit":false
        });

        // 搜索框
        this.$el.find(".search").on({
            "focus":function(){
                $(this).parents(".search-out").addClass("active");
            },
            "blur":function(){
                $(this).parents(".search-out").removeClass("active");
            },
            "keyup":(e) => {
                if(e.keyCode == 13) {
                    // 当用户在输入框按下回车键，则触发点击搜索按钮
                    this.$el.find(".btn-search").click();
                };
            }
        });

        // 点击搜索按钮
        this.$el.find(".btn-search").on("click",function(){
            let $this:JQuery<HTMLElement> = $(this),
            query:string = <string>$this.prev(".search").val();
            self.mainView.detail.currentChart.search(query.replace(/\s/g,""));
        });

        // 选择开始和截止日期
        this.$el.find(".date-out").on("click",function(){
            let $this:JQuery<HTMLElement> = $(this);
            self.calendar.setSingle(false);
            self.calendar.show($this.find(".start .date").text(),$this.find(".end .date").text());
        });

        // 选择单日日期
        this.$el.find(".singleDate").on("click",function(){
            self.calendar.setSingle(true);
            self.calendar.show($(this).find(".date").text());
        });
    }

    /**
     * 初始化日期（截止日期为昨天，开始日期为截止日期往前推7天）
     * @param {boolean} isSingle [是否为单日期]
     */
    initDate(isSingle?:boolean) {
        let date:any = this.getInitDate(),
        start:string = date.start,
        end:string = date.end;

        if(isSingle == void 0) {
            // 如果传参为undefined，则表示重置所有的日期
            this.$singleDate.text(end);
            this.$start.text(start);
            this.$end.text(end);
        } else if(isSingle) {
            // 重置单日期
            this.$singleDate.text(end);
        } else {
            // 重置日期
            this.$start.text(start);
            this.$end.text(end);
        };
    }

    /**
     * 获取初始日期时间戳（开始日期为昨天，截止日期为开始日期往前推7天）
     * @return {object} obj [start:开始日期,end:截止日期]
     */
    getInitDate() :any {
        let date:Date = new Date(),
        start:string = "",
        end:string = "";
        // 设置截止日期
        date.setDate(date.getDate() - 1);
        end = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        // 设置开始日期
        date.setDate(date.getDate() - 7);
        start = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        start = start.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");
        end = end.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");

        return {
            "start":start,
            "end":end
        };
    }

    /**
     * 设置标题名称
     * @param {string} title [标题名称]
     */
    setTitle(title:string) {
        this.$el.find(".name").text(title);
    }

    /**
     * 是否显示搜索框
     * @param {boolean} isShow [true为显示,false为隐藏，默认true]
     */
    showSearch(isShow:boolean = true) {
        if(isShow) {
            // 每次显示搜索框都会先清空和变更回默认的提示文字
            this.$search.val("");
            this.setPlaceHolder();
            this.$el.find(".search-out").show();
        } else {
            this.$el.find(".search-out").hide();
        };
    }

    /**
     * 设置搜索框的提示文字
     * @param {string} val [提示文字]
     */
    setPlaceHolder(val:string = "Search"){
        this.$search.attr("placeholder",val);
    }

    /**
     * 是否显示日期
     * @param {boolean} isShow [true为显示,false为隐藏，默认true]
     */
    showDate(isShow:boolean = true) {
        if(isShow) {
            this.initDate(false);
            this.$el.find(".date-out").show();
        } else {
            this.$el.find(".date-out").hide();
        };
    }

    /**
     * 是否显示单个日期选择
     * @param {boolean} isShow [true为显示,false为隐藏，默认true]
     */
    showSingleDate(isShow:boolean = true) {
        if(isShow) {
            this.initDate(true);
            this.$el.find(".singleDate").show();
        } else {
            this.$el.find(".singleDate").hide();
        };
    }

    /**
     * 设置最大可选择日期
     * @param {string} maxDate [日期，可不传参表示去除最大日期限制]
     */
    setMaxDate(maxDate:string) {
        let temp:string[] = null;

        if(maxDate && maxDate.length == 10) {
            temp = maxDate.split("-");
            maxDate = `${temp[0]}-${parseInt(temp[1])}-${parseInt(temp[2])}`;
        };
        this.calendar.setMaxDate(maxDate);
    }

    /**
     * 头部选择控件控制
     * @param {boolean} showSearch [是否显示搜索框，默认false]
     * @param {boolean} showDate [是否显示开始和截止日期选择，默认false]
     * @param {boolean} showSingleDate [是否显示单日日期选择，默认false]
     * @param {string} maxDate [最大可选择日期]
     */
    showMenu(showSearch:boolean = false,showDate:boolean = false,showSingleDate:boolean = false,maxDate:string = null) {
        this.showSearch(showSearch);
        this.showDate(showDate);
        this.showSingleDate(showSingleDate);
        this.setMaxDate(maxDate);
    }
}

// 侧栏
class CSide {
    $el:JQuery<HTMLElement> = $(".c-side");
    mainView:IndexMain = null;

    constructor(props:any) {
        $.extend(this,props);
    }

    /**
     * 获取数据
     */
    fetch() {
        this.render();
    }

    /**
     * 页面渲染
     */
    render() {
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        // 左侧菜单栏点击
        this.$el.find(".menu-list").on("click","li",function(){
            let $this:JQuery<HTMLElement> = $(this);

            if(!$this.hasClass("active")) {
                $this.addClass("active").siblings(".active").removeClass("active");
            };
        });

        // 点击修改密码
        this.$el.find(".header .changePwd").on("click",() => {
            this.mainView.changepwd.show();
        });
    }

    /**
     * 设置具体某个菜单处于活跃状态
     * @param {string} dom [dom标签]
     */
    setActive(dom:string) {
        this.$el.find(dom).addClass("active").siblings(".active").removeClass("active");
    }
}

// 详情
class CDetail {
    $el:JQuery<HTMLElement> = $(".c-content");
    currentChart:ChartBase = null; // 当前的图表
    mainView:IndexMain = null;
    moduleObject:{  // 模块对象
        [index:string]:ChartBase
    } = {};
    ajax:XMLHttpRequest = new XMLHttpRequest();    // 请求

    constructor(props:any) {
        $.extend(this,props);
    }

    /**
     * 数据获取
     */
    fetch(){
        this.render();
    }

    /**
     * 页面渲染
     */
    render(){
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent(){}

    /**
     * 根据子对象渲染内容
     * @param {string} html [内容]
     */
    renderByChildren(html:string) {
        this.$el.html(html);
        this.renderComponent();
    }

    /**
     * 渲染组件
     */
    renderComponent() {
        let $el:JQuery<HTMLElement> = this.$el;
        switch(true) {
            case $el.find("pading").length != 0:
                this.component(Pading);
            default:
            break;
        }
    }

    /**
     * 根据侧栏调用相应的类
     * @param {string} fileName [文件名]
     */
    callChartBySide(fileName:string) {
        // 实例化相应的目录对象
        require([fileName],(obj) => {
            var currentChart = new obj({
                mainView:this
            });
            this.currentChart = currentChart;
            currentChart.fetch();
        });

        // if(this.moduleObject[fileName]) {
        //     // 将上一个激活对象设置为非激活
        //     if(this.currentChart) {
        //         this.currentChart.activation = false;
        //     };
        //     // 如果目录对象存在，则直接调用fetch
        //     this.moduleObject[fileName].fetch();
        //     // 设置当前对象为激活状态
        //     this.moduleObject[fileName].activation = true;
        //     // 变更当前激活对象
        //     this.currentChart = this.moduleObject[fileName];
        // } else {
        //     // 如果目录对象不存在，则先请求相应的js，然后实例化对象
        //     this.introductionJS(fileName);
        // };

        // 设置详情内容的左侧标题
        this.mainView.header.setTitle(this.mainView.side.$el.find(".active").text());
    }

    /**
     * 调用组件
     * @param {Class} componentClass [组件]
     */
    component(componentClass:any) {
        let className:string = componentClass["name"];
        className = className.replace(/^.{1}/,className[0].toLowerCase());

        this.currentChart[className] = new componentClass({
            mainView:this.currentChart
        });
        this.currentChart[className].fetch();
    }
}

// 翻页
class Pading {
    $el:JQuery<HTMLElement> = null;
    $selectSize:JQuery<HTMLElement> = null; // 下拉选项
    $selectNo:JQuery<HTMLElement> = null;   // 翻页 
    mainView:ChartBase = null;
    template:string = "padingTemp";
    total:number = 0;   // 总页数
    pageNo:number = 0;  // 当前页码
    pageSize:number = _pageSize;    // 每页条数
    selectSize:Array<string> = null; // 下拉选项
    selected:string = null; // 下拉选项默认选中的值
    state = { // 状态
        "home":false,   // 首页
        "prev":false,   // 上一页
        "next":false,   // 下一页
        "back":false    // 尾页
    };
    isFirst:boolean = true; // 是否为第一次加载，默认为true

    constructor(props:any) {
        $.extend(this,props);
    }

    /**
     * 获取数据
     */
    fetch() {
        let $pading:JQuery<HTMLElement> = this.mainView.mainView.$el.find("pading");
        this.total = parseInt($pading.attr("total"));
        if(!this.total) {
            // 允许用户传递总个数，当总页数不存在的时候
            this.total = Math.ceil(parseInt($pading.attr("count")) / this.pageSize);
            // 如果总页数小于1，则设置为1
            this.total = this.total?this.total:1;
        };

        // 下拉选项
        this.selectSize = $pading.attr("select")?$pading.attr("select").split(","):null;
        // 下拉选项的默认选中
        this.selected = $pading.attr("defaultSelect")?$pading.attr("defaultSelect"):null;

        this.render();
    }

    /**
     * 页面渲染
     */
    render() {
        let $detail = this.mainView.mainView.$el;

        $detail.find("pading")[0].outerHTML = (<any>window).template(this.template,{});
        this.$el = $detail.find(".m-pading:last");
        this.$selectSize = this.$el.find(".selectSize");
        this.$selectNo = this.$el.find(".selectNo");

        this.initTotal("init");
        this.initSelectSize();
        // 初始化mdui组件
        (<any>window).mdui.mutation();

        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:Pading = this;

        // 点击回到首页
        this.$el.find(".home").on("click",function(){
            if(!$(this).attr("disabled")) {
                self.setPageNo(0,"home");
            };
        });

        // 上一页
        this.$el.find(".prev").on("click",function(){
            if(!$(this).attr("disabled")) {
                self.setPageNo(self.pageNo - 1,"prev");
            };
        });

        // 点击页码
        this.$el.find(".page").on("click",function(){
            if(!$(this).hasClass("active")) {
                self.setPageNo(parseInt($(this).text()),"page");
            };
        });

        // 下一页
        this.$el.find(".next").on("click",function(){
            if(!$(this).attr("disabled")) {
                self.setPageNo(self.pageNo + 1,"next");
            };
        });

        // 尾页
        this.$el.find(".back").on("click",function(){
            if(!$(this).attr("disabled")) {
                self.setPageNo(self.total,"back");
            };
        });

        // 下拉选择控件
        this.$el.find(".pageSize").on("close.mdui.select",(e,value) => {
            let pageSize:number = parseInt(value.inst.value);
            if(this.pageSize == pageSize || this.total == 1) {
                // 如果选择的每页条数不变，则不执行下列函数，或者当前总页数只有1页
                return;
            };
            this.pageSize = pageSize;
            this.setPageNo(1,"home");
        });
    }

    /**
     * 初始化下拉选项
     */
    initSelectSize() {
        let html:string = "";

        if(this.selectSize) {   // 如果存在下拉选项，则根据其改变，否则使用默认
            this.selectSize.forEach(en => {
                if(en == this.selected) {
                    html += `<option value='${en}' selected>${en}</option>`;
                } else {
                    html += `<option value='${en}'>${en}</option>`;
                };
            });
            this.$selectSize.find(".pageSize").html(html);
        };
    }

    /**
     * 初始化或重置总页数
     * @param {string} operation [操作，init或reset]
     */
    initTotal(operation) {
        let total:number = this.total;
        // 设置总页数
        this.$el.find(".total").text(total);

        switch(operation) {
            case "reset":
                this.$el.find(".page").show();
                this.isFirst = true;
                this.setPageNo(1,"home");
                if(total <= 5) {    // 如果总页码小于等于5，则根据个数显示相应的可点击页码
                    $.each(this.$el.find(".page"),function(index){
                        if(index > total-1) {
                            $(this).hide();
                        };
                    });
                };
            break;
            case "init":
            default:
                this.setPageNo(1,"home");
                if(total <= 5) {    // 如果总页码小于等于5，则根据个数显示相应的可点击页码
                    $.each(this.$el.find(".page"),function(index){
                        if(index > total-1) {
                            $(this).hide();
                        };
                    });
                };
            break;
        }
    }

    /**
     * 设置当前页码
     * @param {number} value [页码]
     * @param {string} operation [操作]
     */
    setPageNo(value:number,operation:string) {
        this.pageNo = value;
        if(this.isFirst) {
            this.isFirst = false;
        } else {    // 第一次加载不调用变更函数
            this.mainView.changePading(value,this.pageSize);
        };

        if(value < 3) { // 当前页码小于3，禁用首页
            this.disabledHome(true);
            if(value < 2) { // 当前页码小于2，禁用上一页
                this.disabledPrev(true);
            } else {    // 当前页码大于等于2，开启上一页
                this.disabledPrev(false);    
            };
        } else {    // 当前页码大于等于3，开启首页和上一页
            this.disabledPrev(false);
            this.disabledHome(false);
        };

        if(value > this.total - 2) {    // 当前页码大于总页码-2，禁用尾页
            this.disabledBack(true);
            if(value > this.total - 1) {    // 当前页码大于总页码-1，禁用下一页
                this.disabledNext(true);
            } else {
                this.disabledNext(false);
            };
        } else {    // 当前页码小于等于2，开启下一页和尾页
            this.disabledNext(false);
            this.disabledBack(false);
        };
        
        this.resetNumber(value,operation);
        this.$el.find(".pageNo").text(value);
    }

    /**
     * 设置总页数
     * @param {number} count [总条数]
     */
    setTotal(count:number) {
        let total:number = 0;
        total = Math.ceil(count / this.pageSize);
        if(this.total == total) {
            // 如果总页数不变，则不执行下列函数
            return;
        };
        this.total = total;

        // 设置总页数
        this.$el.find(".total").text(total);
        this.initTotal("reset");
    }

    /**
     * 重置可点击的页码
     * @param {number} value [页码]
     * @param {string} operation [操作]
     */
    resetNumber(value:number,operation:string) {
        let $page:JQuery<HTMLElement> = null;
        if(value < 3 || value > this.total - 2) {
            // 当用户点击的页码小于3或者大于总页码-2
            if(operation == "home") {
                // 如果当前点击的是首页
                $page = this.$el.find(".page:first");
                // 将页码重置为12345
                $.each(this.$el.find(".page"),function(index){ 
                    let temp:number = index+1;
                    $(this).attr("no",temp).text(temp);
                });
            } else if(operation == "back") {
                // 如果当前点击的是尾页
                $page = this.$el.find(".page:last");
                // 将页码重置为总页码-4，-3，-2，-1
                $.each(this.$el.find(".page"),function(index){
                    let temp:number = value-4+index;
                    $(this).attr("no",temp).text(temp);
                });
            } else {
                $page = this.$el.find(".page[no=" + value + "]");
            };
        } else {
            // 当用户点击的页码在3和总页码-2之间
            $page = this.$el.find(".page:eq(2)");
        
            // 改变相应的左右页码
            $.each(this.$el.find(".page"),function(index){
                let temp:number = value + (index - 2); 
                $(this).attr("no",temp).text(temp);
            });
        };

        $page.addClass("active").siblings(".active").removeClass("active");
    }

    /**
     * 是否需要禁用回到首页
     * @param {boolean} isDisabled [true为禁止,false为开启，默认为false]
     */
    disabledHome(isDisabled:boolean = false) {
        if(this.state.home != isDisabled) {
            this.state.home = isDisabled;
            isDisabled?this.$el.find(".home").attr("disabled",""):this.$el.find(".home").removeAttr("disabled");
        };
    }

    /**
     * 是否需要禁用上一页
     * @param {boolean} isDisabled [true为禁止,false为开启，默认为false]
     */
    disabledPrev(isDisabled:boolean = false) {
        if(this.state.prev != isDisabled) {
            this.state.prev = isDisabled;
            isDisabled?this.$el.find(".prev").attr("disabled",""):this.$el.find(".prev").removeAttr("disabled");
        };
    }

    /**
     * 是否需要禁用下一页
     * @param {boolean} isDisabled [true为禁止,false为开启，默认为false]
     */
    disabledNext(isDisabled:boolean = false) {
        if(this.state.next != isDisabled) {
            this.state.next = isDisabled;
            isDisabled?this.$el.find(".next").attr("disabled",""):this.$el.find(".next").removeAttr("disabled");
        };
    }

    /**
     * 是否需要禁用前进到尾页
     * @param {boolean} isDisabled [true为禁止,false为开启，默认为false]
     */
    disabledBack(isDisabled:boolean = false) {
        if(this.state.back != isDisabled) {
            this.state.back = isDisabled;
            isDisabled?this.$el.find(".back").attr("disabled",""):this.$el.find(".back").removeAttr("disabled");
        };
    }
}

// 密码变更
class ChangePWD {
    $el:JQuery<HTMLElement> = $(".g-changePwd");
    mainView:IndexMain = null;

    constructor(props:any) {
        $.extend(this,props);
        this.fetch();
    }

    /**
     * 数据获取
     */
    fetch() {
        this.render();
    }

    /**
     * 渲染
     */
    render() {
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        // 取消
        this.$el.find(".btn-cancel").on("click",() => {
            this.hide();
        });

        // 确定
        this.$el.find(".btn-submit").on("click",() => {
            this.submit();
        });

        // 新密码输入框键盘点击事件
        this.$el.find(".newPwd").on("keyup",(e) => {
            if(e.keyCode == 13) {
                // 当用户在密码输入框按下回车键，则触发点击Login按钮
                this.$el.find(".btn-submit").click();
            };
        });
    }

    /**
     * 确定
     */
    submit() {
        let self:ChangePWD = this;

        if(this.check()) {
            _load(true);
            // 变更密码
            (<Function>_resource.changePwd)(JSON.stringify({
                "username":this.$el.find(".user").val(),
                "old_password":this.$el.find(".oldPwd").val(),
                "new_password":this.$el.find(".newPwd").val(),
                "token":this.mainView.token
            }),function(data:any){
                if(data.code == 0) {
                    (<any>window).layer.alert("密码修改成功");
                    self.hide();
                } else {
                    (<any>window).layer.msg(data.msg);
                };
                _load(false);
            });
        };
    }

    /**
     * 校验用户名和密码
     */
    check():boolean {
        let $input:JQuery<HTMLElement> = this.$el.find(".input-group"),
        str:string = "";

        if(!$input.find(".user").val()) {
            str = "请输入用户名";
        } else if(!$input.find(".oldPwd").val()) {
            str = "请输入旧密码";
        } else if(!$input.find(".newPwd").val()) {
            str = "请输入新密码";
        } else if($input.find(".newPwd").val() != $input.find(".rePwd").val()) {
            str = "新密码两次输入不相同";
        };

        if(str) {
            (<any>window).layer.msg(str);
            return false;
        } else {
            return true;
        };
    }

    /**
     * 显示
     */
    show() {
        this.$el.show();
        setTimeout(() => {
            this.$el.addClass("active")
        },10);
    }

    /**
     * 隐藏
     */
    hide() {
        this.$el.removeClass("active");
        setTimeout(() => {
            this.$el.hide()
        },200);
    }
}

// 冻结用户
class FrozenInfo {
    $el:JQuery<HTMLElement> = $(".m-frozenInfo"); // 冻结提示框
    $select:JQuery<HTMLElement> = this.$el.find(".group.select"); // 冻结提示框
    mainView:IndexMain = null;
    currentDetail:ChartBase = null;   // 当前的详情
    sTime:number = null;   // 开始时间（更新状态才会有这个时间）

    constructor(props:any) {
        $.extend(this,props);
        this.fetch();
    }

    /**
     * 数据获取
     */
    fetch() {
        this.render();
    }

    /**
     * 渲染
     */
    render() {
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:FrozenInfo = this;

        // 取消冻结
        this.$el.find(".btn-cancel").on("click",() => {
            this.hide();
        });

        // 确定冻结
        this.$el.find(".btn-submit").on("click",function(){
            let date:Date = new Date(),
            start_time:number = parseInt(<any>(date.getTime()/1000)),
            end_time:number = 0,
            option:{} = null;

            // 如果数据校验不通过，则退出函数
            if(!self.frozenCheck()) {
                return;
            };

            // 获取冻结截止时间
            switch(self.$el.find(".operation:checked").val()) {
                case "0":
                    end_time = 0;
                break;
                case "1":
                    date.setDate(date.getDate() + parseInt(self.$select.find(".active").attr("day")));
                    end_time = parseInt(<any>(date.getTime()/1000));
                break;
            };

            option = {
                "uid":parseInt(<string>self.$el.find(".uid").val()),
                "start_time":start_time,
                "end_time":end_time,
                "reason":self.$el.find(".reason").val(),
                "token":self.mainView.token
            };

            _load(true);
            if(self.sTime != null) {    // 更新
                (<Function>_resource.updateFrozen)(JSON.stringify(option),function(data){
                    (<any>window).layer.msg("更新成功！");
                    // 调用相应详情的冻结函数
                    self.currentDetail.frozen();
                    // 关闭冻结提示框
                    self.hide();
                    _load(false);
                });
            } else {    // 新增
                (<Function>_resource.addFrozen)(JSON.stringify(option),function(data){
                    (<any>window).layer.msg("冻结成功！");
                    // 调用相应详情的冻结函数
                    self.currentDetail.frozen();
                    // 关闭冻结提示框
                    self.hide();
                    _load(false);
                });
            }
        });

        // 冻结操作
        this.$el.find(".operation").on("change",function(){
            let val:string = <string>$(this).val();

            switch(val) {
                case "0":
                    self.$select.hide();
                break;
                case "1":
                    self.$select.show();
                break;
            };
        });

        // 冻结时限
        this.$select.find(".choice").on("click",() => {
            this.$select.find(".list").show();
            setTimeout(() => {
                this.$select.find(".list").addClass("active");

                $(document).on("click",() => {
                    this.$select.find(".list").removeClass("active");

                    setTimeout(() => {
                        this.$select.find(".list").hide()
                    },200);
                    $(document).unbind("click");
                });
            },10);
        });

        // 选择冻结时限
        this.$select.find(".list").on("click","li",function(){
            let $this:JQuery<HTMLElement> = $(this);

            self.$select.find(".choice").attr("day",$this.attr("day")).text($this.text());
            $this.addClass("active").siblings(".active").removeClass("active");
        });
    }

    /**
     * 初始化冻结提示框
     * @param {number} uid [用户编号]
     * @param {string} uname [用户名]
     * @param {string} reason [事由，可为空]
     */
    initFrozen(uid:number,uname:string,reason?:string) {
        let $el:JQuery<HTMLElement> = this.$el;
        // 设置用户编号
        $el.find(".uid").val(uid);
        // 设置用户昵称
        $el.find(".nickname").val(uname);
        // 初始化冻结操作
        $el.find(".operation:eq(0)").prop("checked",true).trigger("change");
        // 初始化冻结天数
        this.$select.find(".choice").attr("day","1").text("1天");
        this.$select.find(".list li:eq(0)").addClass("active").siblings(".active").removeClass("active");
        // 清空冻结事由
        $el.find(".reason").val(reason);
    }

    /**
     * 冻结数据校验
     * @return {boolean} bool [是否校验通过]
     */
    frozenCheck() : boolean {
        let str:string = "";

        if(!(<string>this.$el.find(".reason").val()).replace(/\s/g,"")) {
            str = "请输入冻结事由";
        };

        if(str) {
            (<any>window).layer.alert(str);
            return false;
        };

        return true;
    }

    /**
     * 显示冻结提示框
     * @param {number} uid [用户编号]
     * @param {string} uname [用户名]
     * @param {ChartBase} obj [当前详情]
     * @param {string} reason [事由，可为空]
     * @param {number} sTime [冻结开始时间戳]
     */
    show(uid:number,uname:string,obj,reason?:string,sTime?:number) {
        this.currentDetail = obj;
        this.$el.show();
        setTimeout(() => {
            this.$el.addClass("active");
        },10);

        this.sTime = sTime;
        this.initFrozen(uid,uname,reason);
    }

    /**
     * 隐藏冻结提示框
     */
    hide() {
        this.$el.removeClass("active");
        setTimeout(() => {
            this.$el.hide()
        },200);
    }
}

// 赠送钻石
class GivDiamond {
    $el:JQuery<HTMLElement> = $(".m-givDiamond"); // 冻结提示框
    mainView:IndexMain = null;

    constructor(props:any) {
        $.extend(this,props);
        this.fetch();
    }

    /**
     * 数据获取
     */
    fetch() {
        this.render();
    }

    /**
     * 渲染
     */
    render() {
        this.bindEvent();
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        let self:GivDiamond = this;

        // 确定
        this.$el.find(".btn-submit").on("click",() => {
            if(!this.givingCheck()) {
                return;
            };

            _load(true);
            (<Function>_resource.addDiamond)(JSON.stringify({
                "uid":parseInt(<string>self.$el.find(".uid").val()),
                "num":parseInt(<string>self.$el.find(".diamondNumber").val()),
                "reason":self.$el.find(".reason").val(),
                "token":this.mainView.token
            }),function(data){
                (<any>window).layer.msg("赠送成功！");
                // 关闭赠送提示框
                self.hide();
                _load(false);
            });
        });

        // 取消
        this.$el.find(".btn-cancel").on("click",() => {
            this.hide();
        });

        // 钻石数量输入
        this.$el.find(".diamondNumber").on("input",function(){
            let $this:JQuery<HTMLElement> = $(this);

            if(/^\d*$/.test(<string>$this.val())) {
                $this.attr("old",<string>$this.val());
            } else {
                $this.val($this.attr("old"));
                (<any>window).layer.tips('请输入正整数', self.$el.find(".diamondNumber")[0], {
                    tips: [1, '#FF9800'],
                    time: 2000
                });
            };
        });
    }

    /**
     * 初始化赠送提示框
     * @param {number} uid [用户编号]
     */
    initgiving(uid:number) {
        let $el:JQuery<HTMLElement> = this.$el;
        $el.find(".uid").val(uid);
        $el.find(".diamondNumber,.reason").val("");
    }

    /**
     * 赠送数据校验
     * @return {boolean} bool [是否校验通过]
     */
    givingCheck() : boolean {
        let str:string = "";

        if(!<string>this.$el.find(".diamondNumber").val()) {
            str = "请输入赠送的钻石数量";
        } else if(!(<string>this.$el.find(".reason").val()).replace(/\s/g,"")) {
            str = "请输入赠送事由";
        };

        if(str) {
            (<any>window).layer.alert(str);
            return false;
        };

        return true;
    }

    /**
     * 显示冻结提示框
     * @param {number} uid [用户编号]
     */
    show(uid:number) {
        this.$el.show();
        setTimeout(() => {
            this.$el.addClass("active");
        },10);

        this.initgiving(uid);
    }

    /**
     * 隐藏冻结提示框
     */
    hide() {
        this.$el.removeClass("active");
        setTimeout(() => {
            this.$el.hide()
        },200);
    }
}

// 图表
class ChartBase {
    mainView:CDetail = null;
    $el:JQuery<HTMLElement> = null;
    pading:Pading = null;   // 翻页控件
    completeHtml:boolean = false; // 是否载入html完成，默认为false

    constructor(props:any) {
        $.extend(this,props);
    }

    /**
     * 数据获取
     */
    fetch(data?:any) {

    }

    /**
     * 页面渲染
     */
    render(data?:any) {

    }

    /**
     * 事件绑定
     */
    bindEvent() {

    }

    /**
     * 搜索（为了点击头部的搜索按钮进行搜索）
     * @param {string} query [搜索关键字]
     */
    search(query:string) {}

    /**
     * 日期变更（为了头部选择日期之后进行触发）
     * @param {string} start [开始日期]
     * @param {string} end [结束日期]
     */
    changeDate(start:string,end:string) {}

    /**
     * 页码变更
     * @param {number} pageNo [页码]
     * @param {number} pageSize [每页条数]
     */
    changePading(pageNo:number,pageSize:number) {}

    /**
     * 冻结用户
     */
    frozen(){}

    /**
     * 获取表单提交的返回信息
     * @param {HTMLElement} e [表单元素]
     */
    getFormReturn(e:HTMLElement){}
}