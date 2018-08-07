!(function(){
    let _currentObject:IndexMain = null;

    // 注册过滤器，转换时间戳
    (<any>window).template.helper('formatData',function(data,format){
        var date = new Date();
        date.setTime(data*1000);
        return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    });

    // 主体
    class IndexMain {
        $el:JQuery<HTMLElement> = $(".g-chartDetail");    // 主体
        header:CHeader = null;  // 头部
        side:CSide = null;  // 侧栏
        detail:CDetail = null;  // 详情
        changepwd:ChangePWD = null; // 密码变更
        token = ""; // token

        constructor() {
            this.getToken();
            this.initMethod();
            this.bindEventByOne();
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
            
        }

        /**
         * 单次事件绑定
         */
        bindEventByOne() {
            this.windowEvent();
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

            this.detail = new CDetail(options)

            // 侧栏
            this.side = new CSide(options);
            this.side.fetch();

            // 变更密码
            this.changepwd = new ChangePWD(options);
            this.changepwd.fetch();
        }

        /**
         * 一些系统事件的监听
         */
        windowEvent() {
            let self:IndexMain = this;

            if(!("onhashchange" in window)) {
                // 如果当前浏览器不支持onhashchange事件，则提示
                (<any>window).layer.alert("您的浏览器版本过低，可能体验会较差！");
            };

            // 监听onhashchange事件，地址栏变动
            window.onhashchange = function(){
                let active:string = "",
                type:any = null,
                hash:string = window.location.hash.substr(1);

                // 如果路由存在相应的hash则访问相应的类
                if(hash in _router) {
                    active = `.${hash}`;
                    type = eval(_router[hash]);
                } else {    // 如果hash不存在，则默认访问新增用户
                    active = ".newUser";
                    type = NewUser;
                };

                self.side.setActive(active);
                self.detail.callChartBySide(type);
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
            this.bindEventByOne();
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
            
        }

        /**
         * 单次事件绑定
         */
        bindEventByOne() {
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
                self.mainView.detail.currentChart.search(query);
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
         * 初始化日期（截止日期为今天，开始日期为截止日期往前推7天）
         * @param {boolean} isSingle [是否为单日期]
         */
        initDate(isSingle?:boolean) {
            let date:Date = new Date(),
            start:string = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
            end:string = "";
            // 设置开始日期
            date.setDate(date.getDate() - 7);
            end = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            start = start.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");
            end = end.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g,"0$1$2");

            if(isSingle == void 0) {
                // 如果传参为undefined，则表示重置所有的日期
                this.$singleDate.text(start);
                this.$start.text(start);
                this.$end.text(end);
            } else if(isSingle) {
                // 重置单日期
                this.$singleDate.text(start);
            } else {
                // 重置日期
                this.$start.text(start);
                this.$end.text(end);
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
        setPlaceHolder = function(val:string = "Search"){
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
         * 头部选择控件控制
         * @param {boolean} showSearch [是否显示搜索框，默认false]
         * @param {boolean} showDate [是否显示开始和截止日期选择，默认false]
         * @param {boolean} showSingleDate [是否显示单日日期选择，默认false]
         */
        showMenu(showSearch:boolean = false,showDate:boolean = false,showSingleDate:boolean = false) {
            this.showSearch(showSearch);
            this.showDate(showDate);
            this.showSingleDate(showSingleDate);
        }
    }

    // 侧栏
    class CSide {
        $el:JQuery<HTMLElement> = $(".c-side");
        mainView:IndexMain = null;

        constructor(props:any) {
            $.extend(this,props);
            this.bindEventByOne();
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
            
        }

        /**
         * 单次事件绑定
         */
        bindEventByOne() {
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
         * @param {any} chartClass [类]
         */
        callChartBySide(chartClass:any) {
            this.currentChart = new chartClass({
                "mainView":this
            });
            this.currentChart.fetch();
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
                if(this.pageSize == pageSize) {
                    // 如果选择的每页条数不变，则不执行下列函数
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
            console.log(1);
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
            this.bindEventByOne();
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
        }

        /**
         * 单次事件绑定
         */
        bindEventByOne() {
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
                _resource.changePwd(JSON.stringify({
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

    // 图表
    class ChartBase {
        mainView:CDetail = null;
        $el:JQuery<HTMLElement> = null;
        pading:Pading = null;   // 翻页控件

        constructor(props:any) {
            let parent:IndexMain = null;
            $.extend(this,props);

            // 设置详情内容的左侧标题
            parent = this.mainView.mainView;
            parent.header.setTitle(parent.side.$el.find(".active").text());
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
    }

    // 新增用户
    class NewUser extends ChartBase {
        template = { // 模板
            "routerTemp":"newUserTemp"
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         */
        fetch() {
            this.render();
        }

        /**
         * 页面渲染
         */
        render() {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu();

            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,{}));
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    // 活跃用户
    class ActiveUser extends ChartBase {
        template = { // 模板
            "detail":"activeUserTemp"
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         */
        fetch() {
            this.render();
        }

        /**
         * 页面渲染
         */
        render() {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu();

            this.mainView.renderByChildren((<any>window).template(this.template.detail,{}));
            this.$el = $(".m-activeUser");
            this.renderChart();
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            this.$el.find(".g-chart .menu").on("click","li",function(){
                let $this:JQuery<HTMLElement> = $(this);

                if(!$this.hasClass("active")) {
                    $this.addClass("active").siblings(".active").removeClass("active");
                };
            });
        }

        /**
         * 渲染图表
         */
        renderChart() {
            let data = [{
                year: '1991',
                value: 3
              }, {
                year: '1992',
                value: 4
              }, {
                year: '1993',
                value: 3.5
              }, {
                year: '1994',
                value: 5
              }, {
                year: '1995',
                value: 4.9
              }, {
                year: '1996',
                value: 6
              }, {
                year: '1997',
                value: 7
              }, {
                year: '1998',
                value: 9
              }, {
                year: '1999',
                value: 13
              }];

              let chart = new (<any>window).G2.Chart({
                container: 'diagram', // 指定图表容器 ID
                width : 600, // 指定图表宽度
                height : 300, // 指定图表高度
                forceFit: true, // 自适应宽度
                padding:["auto","auto",45,45],
                background:{
                    fill:"#fff"
                }
              });
              // Step 2: 载入数据源
              chart.source(data);
              chart.scale('value', {
                min: 0
              });
              chart.scale('year', {
                range: [0, 1]
              });
              // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
              chart.line().position('year*value');
              chart.point().position('year*value').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
              });
              // Step 4: 渲染图表
              chart.render();
        }
    }

    // 统计用户
    class StatisticalUser extends ChartBase {
        template = { // 模板
            "routerTemp":"statisticalTemp",
            "detail":"statisticalDetail"
        };
        $el:JQuery<HTMLElement> = null;
        firstLoad:boolean = true;   // 是否为第一次加载

        constructor(props:any) {
            super(props);
        }

        /**
         * 获取数据
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数，默认为]
         * @param {number} day [时间戳，默认为0]
         */
        fetch(pageNo:number = 1,pageSize:number = 50,day:number = 0) {
            let self:StatisticalUser = this;

            _load(true);
            _resource.statisticalUser(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "day":day,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(self.firstLoad) {
                    self.render(data);
                    self.firstLoad = false;
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
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(false,false,true);

            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,data));
            this.$el = $(".m-statisticalUser");

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
            this.$el.find(".info").html((<any>window).template(this.template.detail,data));
        }

        /**
         * 日期变更（为了头部选择日期之后进行触发）
         * @param {string} start [开始日期]
         * @param {string} end [结束日期]
         */
        changeDate(start:string,end:string) {
            this.fetch(1,50,parseInt(<any>((new Date(`${start} 00:00:00`)).getTime()/1000)));
        }

        /**
         * 页码变更
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         */
        changePading(pageNo:number,pageSize:number) {
            this.fetch(pageNo,pageSize);
        }
    }

    // 用户列表
    class UserList extends ChartBase {
        template = { // 模板
            "routerTemp":"userListTemp",
            "detail":"userListDetail"
        };
        $el:JQuery<HTMLElement> = null;
        $frozen:JQuery<HTMLElement> = null; // 冻结提示框
        $select:JQuery<HTMLElement> = null; // 冻结时限下拉框
        firstLoad = true;   // 是否为第一次加载

        constructor(props:any) {
            super(props);
        }

        /**
         * 获取数据
         * @param {number} pageNo [页码]
         * @param {number} pageSize [每页条数]
         * @param {uid} string [用户编号]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize,uid:number = 0) {
            let self:UserList = this;
            
            _load(true);
            _resource.userList(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "uid":uid,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(self.firstLoad) {
                    self.render(data);
                    self.firstLoad = false;
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
         * @param {Object} data [数据]
         */
        render(data:any) {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("uid");

            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,data));
            this.$el = $(".m-userList");
            this.$frozen = this.$el.find(".frozenInfo");
            this.$select = this.$frozen.find(".group.select")

            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {
            let self:UserList = this;

            // 冻结
            this.$el.find(".info").on("click",".btn-freeze",function(){
                let $this:JQuery<HTMLElement> = $(this);

                self.$frozen.show();
                setTimeout(() => {
                    self.$frozen.addClass("active");
                },10);

                self.initFrozen($this.attr("uid"),$this.attr("uname"));
            });

            // 取消冻结
            this.$frozen.find(".btn-cancel").on("click",() => {
                this.$frozen.removeClass("active");
                setTimeout(() => {
                    this.$frozen.hide()
                },200);
            });

            // 确定冻结
            this.$frozen.find(".btn-submit").on("click",function(){
                let date:Date = new Date(),
                start_time:number = parseInt(<any>(date.getTime()/1000)),
                end_time:number = 0;

                // 如果数据校验不通过，则退出函数
                if(!self.frozenCheck()) {
                    return;
                };

                // 获取冻结截止时间
                switch(self.$frozen.find(".operation:checked").val()) {
                    case "0":
                        end_time = 0;
                    break;
                    case "1":
                        date.setDate(date.getDate() + parseInt(self.$select.find(".active").attr("day")));
                        end_time = parseInt(<any>(date.getTime()/1000));
                    break;
                };

                _load(true);
                _resource.addFrozen(JSON.stringify({
                    "uid":parseInt(<string>self.$frozen.find(".uid").val()),
                    "start_time":start_time,
                    "end_time":end_time,
                    "reason":self.$frozen.find(".reason").val(),
                    "token":self.mainView.mainView.token
                }),function(data){
                    (<any>window).layer.msg("冻结成功！");
                    // 关闭冻结提示框
                    self.$frozen.find(".btn-cancel").trigger("click");
                    _load(false);
                });
            });

            // 冻结操作
            this.$frozen.find(".operation").on("change",function(){
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
         * 渲染详情
         * @param {Object} data [数据]
         */
        renderDetail(data:any) {
            this.$el.find(".info").html((<any>window).template(this.template.detail,data));
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
         * 搜索
         * @param {string} query [搜索关键字]
         */
        search(query:string) {
            if(/^\d*$/.test(query)){
                this.fetch(undefined,(<any>this.mainView).pading.pageSize,query?parseInt(query):undefined);
            } else {
                (<any>window).layer.msg("请输入正确的用户编号");
            };
        }

        /**
         * 初始化冻结提示框
         * @param {string} uid [用户编号]
         * @param {string} uname [用户名]
         */
        initFrozen(uid:string,uname:string) {
            let $frozen:JQuery<HTMLElement> = this.$frozen;
            // 设置用户编号
            $frozen.find(".uid").val(uid);
            // 设置用户昵称
            $frozen.find(".nickname").val(uname);
            // 初始化冻结操作
            $frozen.find(".operation:eq(0)").prop("checked",true).trigger("change");
            // 初始化冻结天数
            this.$select.find(".choice").attr("day","1").text("1天");
            this.$select.find(".list li:eq(0)").addClass("active").siblings(".active").removeClass("active");
            // 清空冻结事由
            $frozen.find(".reason").val("");
        }

        /**
         * 冻结数据校验
         * @return {boolean} bool [是否校验通过]
         */
        frozenCheck() : boolean {
            let str:string = "";

            if(!(<string>this.$frozen.find(".reason").val()).replace(/\s/g,"")) {
                str = "请输入冻结事由";
            };

            if(str) {
                (<any>window).layer.alert(str);
                return false;
            };

            return true;
        }
    }

    // 付费统计
    class PayStatistical extends ChartBase {
        template = {
            "routerTemp":"payStatisticalTemp",
            "detail":"payStatisticalDetail"
        };
        $el:JQuery<HTMLElement> = null;
        firstLoad = true;   // 是否为第一次加载

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         * @param {number} pageSize [每页条数]
         * @param {uid} string [用户编号]
         */
        fetch(pageNo:number = 1,pageSize:number = _pageSize) {
            let self:PayStatistical = this;

            _load(true);
            _resource.payStatistical(JSON.stringify({
                "page_size":pageSize,
                "page_index":pageNo,
                "day":0,
                "token":this.mainView.mainView.token
            }),function(data:any){
                if(self.firstLoad) {
                    self.render(data);
                    self.firstLoad = false;
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
            header.showMenu(false,false,true);
            
            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,data));
            this.$el = $(".m-payStatistical");
            this.bindEvent();
        }

        /**
         * 渲染详情
         * @param {Object} data [数据]
         */
        renderDetail(data:any) {
            this.$el.find(".info").html((<any>window).template(this.template.detail,data));
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
         * @param {string} end [结束日期]
         */
        changeDate(start:string,end:string) {
            this.fetch()
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    // 钻石流水
    class Diamond extends ChartBase {
        template = { // 模板
            "routerTemp":"newUserTemp"
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         */
        fetch() {
            this.render();
        }

        /**
         * 页面渲染
         */
        render() {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu();

            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,{}));
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    // 冻结名单
    class FreezeList extends ChartBase {
        template = { // 模板
            "routerTemp":"newUserTemp"
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         */
        fetch() {
            this.render();
        }

        /**
         * 页面渲染
         */
        render() {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu();

            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,{}));
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    // 信息查询
    class InfoQuery extends ChartBase {
        template = { // 模板
            "routerTemp":"newUserTemp"
        };

        constructor(props:any) {
            super(props);
            $.extend(this,props);
        }

        /**
         * 数据获取
         */
        fetch() {
            this.render();
        }

        /**
         * 页面渲染
         */
        render() {
            let header:CHeader = this.mainView.mainView.header;
            header.showMenu();

            this.mainView.renderByChildren((<any>window).template(this.template.routerTemp,{}));
            this.bindEvent();
        }

        /**
         * 事件绑定
         */
        bindEvent() {

        }
    }

    _currentObject = new IndexMain();
    _currentObject.fetch();
}());