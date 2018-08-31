"use strict"

/* 
<li>    // 节假日
    <span class="holiday">劳动节</span>
    <span class="day">2</span>
</li>
<li>    // 休
    <span class="rest">休</span>
    <span class="day">2</span>
</li>
<li>    // 班
    <span class="work">班</span>
    <span class="day">2</span>
</li>
<li class="start">  // 开始日期
    <span class="day">2</span>
    <span class="tip">开始</span>
</li>
<li class="include">    // 开始日期和截止日期之间的日期
    <span class="day">2</span>
</li>
<li class="end">        // 截止日期
    <span class="day">2</span>
    <span class="tip">截止</span>
</li>
<li>    // 普通日期
    <span class="day">2</span>
</li> */
!(function(){
    // 获取当前js文件的路径
    var currentSrc = document.currentScript.src;
    currentSrc = currentSrc.substring(0,currentSrc.lastIndexOf("/"));

    // 日期控件
    window.Calendar = (function(){
        var holiday = null, // 节假日
        ajax = new XMLHttpRequest();    // 请求

        /**
         * 1.关于daysTemp的一些描述
         * day="{{ dindex - weekStart[mindex] + 2 }}"
         * 因为dindex本身为下标，从0开始计算，天数为正整数从1开始计算，所以dindex+1为天数
         * weekStart[mindex]为相应月份开始的第一天是星期几，星期一至日从1-7
         * dindex + 1 - weekStart[mindex]则为本月的第一天所在的位置，此时第一天所得到的值为0,
         * 但是因为日期为正整数，应该从1开始计算，所以应该+1，故最终为dindex - weekStart[mindex] + 2
         * 
         * 2.如果原始页面使用了iScroll等禁用系统滚动条滚动的操作，请在打开日期选择插件时将其打开。
         */
        function Calendar(options){
            $.extend(this,options);

            if(!this.startDate) {
                this.startDate = this.getStepDate("",0);
            };
            if(this.endDate == 1) {
                // 如果截止日期为1表示和开始日期相同
                this.endDate = this.startDate;
            } else if(!this.endDate) {
                // 如果截止日期未赋值，则默认为开始日期往后延7天
                this.endDate = this.getStepDate(this.startDate,7);
            };

            // 单例，不允许多次new日历控件
            if(window.CalendarTemp) {
                return window.CalendarTemp;
            } else {
                this.fetch();
                window.CalendarTemp = this;
            };
        };
        $.extend(Calendar.prototype,{
            "$el":null,
            "$header":null,
            "isLoading":true,  // 是否正在加载，默认true
            "isAnimate":true,   // 是否需要动画效果，默认为true
            "isHoliday":"", // 是否需要节假日，如果需要，请传入获取节假日的地址，默认是无
            "isSingle":false,   // 是否为单选模式，及点击一个日期并将这个日期作为开始和截止日期，默认为false
            "isReset":false,    // 是否需要重置控件（每次用户点击取消按钮是否需要重置到打开控件前的状态，默认为false）
            "isChange":false,    // 开始日期或结束日期是否有变动，默认为false
            "firstShow":true,   // 是否为第一次显示控件
            "startDate":"", // 开始日期(格式yyyy-MM-dd)
            "endDate":"",   // 截止日期，不传截止日期默认为开始日期之后的7天为截止日期，传1则表示和开始日期相同(格式yyyy-MM-dd)
            "templateList":{    // 模板
                "calendarTemp":"calendarTemp",   // 主模板
                "daysTemp":"daysTemp"   // 日期模板
            },
            "maxDate":null, // 最大可选择日期，默认为无限制
            "choiceModel":1,    // 日期选择模式
            "haveCancel":true, // 是否需要取消按钮
            "haveSubmit":true,  // 是否需要确定按钮
            "defaultStartDate":"",  // 默认开始日期（用户点击取消按钮，重置到上一次的开始日期）
            "defaultEndDate":"",    // 默认结束日期（用户点击取消按钮，重置到上一次的结束日期）
            "shadeEffective":false, // 点击阴影部分是否有效（相当于点击取消按钮）
            "format":"yyyy-M-d",    // 默认为YYYY-M-d
            "cancelMethod":null,    // 点击取消的触发的事件
            "submitMethod":null,    // 点击确定触发的事件
            "load":function(){} // load函数，当日期控件加载完毕就会执行里面的函数
        });
        
        /**
         * 获取数据
         */
        Calendar.prototype.fetch = function(){
            var self = this;
            this.loadCss();

            $(document).queue("calendar",function(){
                // 读取模板
                ajax.open('get',currentSrc + "/template/calendar.html");
                ajax.send();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState==4) {
                        self.templateList.calendarTemp = ajax.responseText;
                        $(document).dequeue("calendar");
                　　}
                };
            });

            $(document).queue("calendar",function(){
                // 读取模板
                ajax.open('get',currentSrc + "/template/list.html");
                ajax.send();
                ajax.onreadystatechange = function () {
                    if (ajax.readyState==4) {
                        self.templateList.daysTemp = ajax.responseText;
                        // 获取本年的所有日期
                        self.render(self.getDateByYear((new Date()).getFullYear()));
                        $(document).clearQueue("calendar");
                　　}
                };
            });

            $(document).dequeue("calendar");
        };
        /**
         * 页面渲染
         * @param {[Object]} data 
         */
        Calendar.prototype.render = function(data){
            $("body").append(template.compile(this.templateList.calendarTemp)({}));
            ajax = null;    // 释放请求
            this.$el = $(".m-calendar");
            this.$header = $(".m-calendar .header");
            this.$el.find(".content").css("marginTop",-((this.$el.find(".content").height() + this.$header.height() + 15) / 2));
            if(!this.haveCancel) {
                // 是否需要取消按钮
                this.$el.find(".btn-cancel").hide();
            };
            if(!this.haveSubmit || this.choiceModel == 2) {
                // 是否需要确定按钮
                this.$el.find(".btn-submit").hide();
            };
            // 渲染本年度日期
            this.renderDays(false,data);
            // 设置初始值
            this.setInitValue();
            // 看是否需要限制日期
            this.setMaxDate(this.maxDate);
            // 获取节假日
            if(this.isHoliday) {
                this.getHoliday();
            };
            // 事件绑定
            this.bindEvent();
            // 仅绑定一次的事件
            this.bindEventByOne();
            // 加载完毕之后执行加载完毕函数
            this.load();
        };
        /**
         * 事件绑定
         */
        Calendar.prototype.bindEvent = function(){};
        /**
         * 仅绑定一次的事件
         */
        Calendar.prototype.bindEventByOne = function(){
            var self = this;

            // 取消按钮
            this.$header.find(".btn-cancel").bind("click",(function(){
                if(!this.isChange) {    // 用户未改变日期，直接退出控件，不做任何操作
                    this.close();
                    return;
                };

                if(this.isReset) {  // 是否需要重置到打开控件时的状态
                    this.$el.find(".include").removeClass("include");
                    this.setChoiceArea(this.defaultStartDate,this.defaultEndDate);
                };

                if(this.cancelMethod) {
                    this.cancelMethod();
                };
                this.close();
            }).bind(this));

            // 确定按钮
            this.$header.find(".btn-submit").bind("click",(function(){
                if(this.submitMethod) {
                    var $start = this.$el.find(".txtContent .start"),
                    $end = this.$el.find(".txtContent .end");

                    this.submitMethod(this.formatDate($start.parents(".date").attr("years") + "-" + $start.attr("day")),this.formatDate($end.parents(".date").attr("years") + "-" + $end.attr("day")),this);
                };
                this.close();
            }).bind(this));

            // 点击事件
            this.$el.find(".txtContent").on("click",".haveValue",function(){
                var $this = $(this),
                date = "";

                if($this.hasClass("disabled")) {
                    return;
                };

                if(self.choiceModel == 1) {
                    // 如果用户点击的是开始或者结束的标识日期，则不做任何变动
                    if($this.hasClass("start") || $this.hasClass("end")) {
                        return;
                    };
                };
                
                self.isChange = true;   // 设置isChange为true，表示用户已经改变了控件的日期
                date = $(this).parents(".date").attr("years") + "-" + $this.attr("day");

                if(self.isSingle)  {    // 如果是单选模式，则让开始和截止为同一天
                    self.setChoiceArea(date);
                    self.setChoiceArea(date);
                } else {
                    self.setChoiceArea(date);
                };
            });

            if(this.shadeEffective) {
                // 点击阴影部分
                this.$el.find(".shade").bind("touchend",(function(){
                    this.$header.find(".btn-cancel").click();
                }).bind(this));
            };

            // 监听滚动条
            this.$el.find(".txtContent").scroll(function(){
                var scrollTop = 0;

                if(self.isLoading) {
                    return;
                };

                self.renderByScrollTop($(this).scrollTop(),$(this)[0].scrollHeight);
            });
        };
        /**
         * 获取节假日
         */
        Calendar.prototype.getHoliday = function(){
            var self = this;
            // 如果已经有节假日数据，则不再获取取公共数据，否则请求节假日数据
            if(holiday) {
                this.setHoliday();
            } else {
                _ajaxFun({
                    type: 'POST',
                    url: this.isHoliday,
                    data: {},
                    tag:365,
                    dataType: 'json',
                    success:function(data){
                        if(data.resultCode == "0001") {
                            holiday = data.data;
                            self.setHoliday();
                        } else {
                            _instantDialog("获取节假日失败!");
                        };
                    },
                    error: function(request, error, status) {
                        _instantDialog("获取节假日失败!");
                    },
                    complete: function(request, error, status) {
                    }
                })
            };
        };
        /**
         * 设置节假日
         */
        Calendar.prototype.setHoliday = function(){
            var $date = this.$el.find(".txtContent");

            $.each(holiday,function(){
                var $holiday = $date.find("[years=" + this.Time.replace(/-\d{1,2}$/,"") + "] [day=" + this.Time.replace(/^\d{4}-\d{1,2}-/,"") + "]");

                if(this.HolidayName) {
                    $holiday.prepend('<span class="holiday">' + this.HolidayName + '</span>');
                } else if(this.Type == "休") {
                    $holiday.prepend('<span class="rest">休</span>');
                } else if(this.Type == "班") {
                    $holiday.prepend('<span class="work">班</span>');
                };
            });
        };
        /**
         * 加载calendar.css文件
         */
        Calendar.prototype.loadCss = function(){
            if(!$("#calendar-css").length) {
                // 如果日期样式不存在，则加载日期样式
                var css = document.createElement("link"); 
                css.setAttribute("rel","stylesheet"); 
                css.setAttribute("id","calendar-css");
                css.setAttribute("href",currentSrc + "/calendar.css" );
                document.head.appendChild(css);
            };
        };
        /**
         * 根据年份获取相应年份的所有日期
         * @param {[Number]} year [年份]
         */
        Calendar.prototype.getDateByYear = function(year){
            var date = new Date(year,0,1),
            maxDate = null,
            weekStart = 0,
            temp = {
                year:year,
                month:[new Array(31),((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)?new Array(29):new Array(28),new Array(31),new Array(30),new Array(31),new Array(30),new Array(31),new Array(31),new Array(30),new Array(31),new Array(30),new Array(31)],
                weekStart:[],
                maxYear:null,
                maxMonth:null,
                maxDay:null
            };

            if(this.maxDate) {
                maxDate = this.maxDate.split("-");
                temp.maxYear = maxDate[0];
                temp.maxMonth = maxDate[1];
                temp.maxDay = maxDate[2];
            };
            
            // 获得每个月的第一天是星期几
            for(var i = 0;i<12;i++){
                date.setMonth(i);
                weekStart = date.getDay() || 7;
                // 如果是星期日，则date.getDay()为0，此时变更为7
                temp.weekStart.push(weekStart);
                // 增加相应的日期开始时间（因为模板是从0开始算，如果星期不从1开始，则会少相应的天数）
                temp.month[i] = temp.month[i].concat(new Array(weekStart - 1));
            };

            return temp;
        };
        /**
         * 渲染日期
         * @param {[Boolean]} direction [是在内容前增加还是内容后增加,true为前,false为后]
         * @param {[Object]} Data [日期数据]
         */
        Calendar.prototype.renderDays = function(direction,date){
            if(direction) {
                this.$el.find(".txtContent .date:first").before(template.compile(this.templateList.daysTemp)(date));
            } else {
                this.$el.find(".txtContent").append(template.compile(this.templateList.daysTemp)(date));
            };
            this.isLoading = false;
        };
        /**
         * 计算相应间隔之后的日期
         * @param {[Array]} startDate [开始日期[yyyy,MM,dd]，MM从0开始算，可为null]
         * @param {[Number]} step [间隔天数]
         * @return {[String]} date [日期]
         */
        Calendar.prototype.getStepDate = function(startDate,step){
            var date = null;

            if(startDate) {
                date = new Date(startDate);
            } else {
                date = new Date();
            };
            date.setDate(date.getDate() + step);

            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        };
        /**
         * 设置日期的一些初始值
         */
        Calendar.prototype.setInitValue = function(){
            var date = new Date(),
            $currentMonth = this.$el.find(".date[years=" + date.getFullYear() + "-" + (date.getMonth()+1) + "]");
            // 设置今天的显示
            $currentMonth.find(".days>li[day=" + date.getDate() + "] .day").text("今天");
            // 设置开始和截止日期
            this.setChoiceArea(this.startDate,this.endDate);
            
            switch(date.getMonth()) {
                case 0: // 如果当前为1月份则把去年的日期也加载了
                    this.renderByScrollTop(0,0);
                break;
                case 11:    // 如果当前为12月份则把明年的日期也加载了
                    this.renderByScrollTop(100,100);
                break;
            };
        };
        /**
         * 根据滚动条的位置加载相应的日期
         * @param {[Number]} scrollTop [滚动条的位置]
         * @param {[Number]} scrollHeight [滚动条高度]
         */
        Calendar.prototype.renderByScrollTop = function(scrollTop,scrollHeight) {
            if(scrollTop < 100) {
                this.isLoading = true;
                this.renderDays(true,this.getDateByYear(parseInt(this.$el.find(".date:first").attr("years").split("-")[0])-1));
            } else if(scrollTop > scrollHeight - 755) {
                this.isLoading = true;
                this.renderDays(false,this.getDateByYear(parseInt(this.$el.find(".date:last").attr("years").split("-")[0])+1));
            };
        };
        /**
         * 设置选中区域
         * @param {[String]} date [日期，格式yyyy-MM-dd]
         * @param {[String]} endDate [截止日期，如果该参数不为null，则表示第一个参数为开始日期]
         */
        Calendar.prototype.setChoiceArea = function(date,endDate){
            var $start = this.$el.find(".txtContent .start"),
            $end = this.$el.find(".txtContent .end");
            date = date.split("-");

            if(endDate) {
                var isSame = date.join("-") == endDate; // 开始和截止是否为同一天

                endDate = endDate.split("-");
                if($start.length) {
                    $start.removeClass("start").find(".tip").remove();
                };
                if($end.length) {
                    $end.removeClass("end").find(".tip").remove();
                };

                if(isSame) {
                    this.$el.find(".date[years=" + date[0] + "-" + date[1] + "] .days>li[day=" + date[2] + "]").addClass("start end").append('<span class="tip">起/止</span>');
                } else {
                    $start = this.$el.find(".date[years=" + date[0] + "-" + date[1] + "] .days>li[day=" + date[2] + "]");
                    $end = this.$el.find(".date[years=" + endDate[0] + "-" + endDate[1] + "] .days>li[day=" + endDate[2] + "]");

                    $start.addClass("start").append('<span class="tip">开始</span>');
                    $end.addClass("end").append('<span class="tip">截止</span>');

                    var startIndex = $start.index(".txtContent .days .haveValue");
                    // 将开始和截止之间的日期全部包括起来
                    this.$el.find(".txtContent .days .haveValue:gt(" + startIndex + "):lt(" + ($end.index(".txtContent .days .haveValue") - startIndex - 1) +")").addClass("include");
                };
            } else {
                var $current = this.$el.find(".date[years=" + date[0] + "-" + date[1] + "] .days>li[day=" + date[2] + "]"),
                currentIndex = $current.index(".txtContent .days .haveValue"),
                startIndex = $start.index(".txtContent .days .haveValue"),
                endIndex = $end.index(".txtContent .days .haveValue");
                
                switch(this.choiceModel) {
                    case 1:
                        this.firstModel(currentIndex,startIndex,endIndex,$current,$start,$end);
                    break;
                    case 2:
                        this.secondModel(currentIndex,startIndex,endIndex,$current,$start,$end);
                    break;
                };
            };
        };
        /**
         * 日期选择模式1
         * @param {[Number]} currentIndex [当前选择的下标]
         * @param {[Number]} startIndex [开始日期的下标]
         * @param {[Number]} endIndex [结束日期的下标]
         * @param {[jQuery]} $current [当前选择的对象]
         * @param {[jQuery]} $start [开始日期对象]
         * @param {[jQuery]} $end [结束日期对象]
         */
        Calendar.prototype.firstModel = function(currentIndex,startIndex,endIndex,$current,$start,$end){
            if(currentIndex < startIndex) {
                // 比开始日期更早
                $start.removeClass("start").find(".tip").remove();
                $current.addClass("start").append('<span class="tip">开始</span>');
                this.$el.find(".haveValue:gt(" + currentIndex + "):lt(" + (startIndex - currentIndex) +")").addClass("include");
            } else if(currentIndex > endIndex) {
                // 比截止日期更晚
                $end.removeClass("end").find(".tip").remove();
                $current.addClass("end").append('<span class="tip">截止</span>');
                this.$el.find(".haveValue:gt(" + (endIndex - 1) + "):lt(" + (currentIndex - endIndex) +")").addClass("include");
            } else {
                // 在开始和截止日期之间
                if(currentIndex - startIndex <= endIndex - currentIndex) {
                    // 如果当前选择的日期更靠近开始日期，则改变开始日期
                    $start.removeClass("start").find(".tip").remove();
                    $current.addClass("start").append('<span class="tip">开始</span>');
                    this.$el.find(".haveValue.include:lt(" + (currentIndex - startIndex) + ")").removeClass("include");
                    this.$el.find(".haveValue:gt(" + currentIndex + "):lt(" + (endIndex - currentIndex) +")").addClass("include");
                } else {
                    // 否则改变截止日期
                    $end.removeClass("end").find(".tip").remove();
                    $current.addClass("end").append('<span class="tip">截止</span>');
                    this.$el.find(".haveValue.include:gt(" + (currentIndex-startIndex-1) + ")").removeClass("include");
                    this.$el.find(".haveValue:gt(" + startIndex + "):lt(" + (endIndex - currentIndex) +")").addClass("include");
                };
            };
        };
        /**
         * 日期选择模式2
         * @param {[Number]} currentIndex [当前选择的下标]
         * @param {[Number]} startIndex [开始日期的下标]
         * @param {[Number]} endIndex [结束日期的下标]
         * @param {[jQuery]} $current [当前选择的对象]
         * @param {[jQuery]} $start [开始日期对象]
         * @param {[jQuery]} $end [结束日期对象]
         */
        Calendar.prototype.secondModel = function(currentIndex,startIndex,endIndex,$current,$start,$end){
            if($start.length && $end.length) {
                // 如果开始和截止都存在，则去除开始和截止
                $start.removeClass("start").find(".tip").remove();
                $end.removeClass("end").find(".tip").remove();
                $current.addClass("start").append('<span class="tip">开始</span>');
                this.$el.find(".include").removeClass("include");
            } else if($start.length && !$end.length) {
                // 如果开始日期存在，截止日期不存在
                if(startIndex > currentIndex) {
                    // 如果当前点击的日期下标小于已经存在的开始日期的下标，则将开始日期的下标前移
                    $start.removeClass("start").find(".tip").remove();
                    $current.addClass("start").append('<span class="tip">开始</span>');
                } else if(startIndex == currentIndex) {
                    // 如果当前点击的日期和开始日期相同
                    $current.addClass("end").find(".tip").text("起/止");
                    // 增加300ms延迟，不然截止日期还未出现，界面就已经退出了
                    setTimeout((function(){
                        this.$header.find(".btn-submit").trigger("touchend");
                    }).bind(this),300);
                } else {
                    $current.addClass("end").append('<span class="tip">截止</span>');
                    this.$el.find(".haveValue:gt(" + startIndex + "):lt(" + ($current.index(".txtContent .days .haveValue") - startIndex - 1) +")").addClass("include");
                    // 增加300ms延迟，不然截止日期还未出现，界面就已经退出了
                    setTimeout((function(){
                        this.$header.find(".btn-submit").trigger("touchend");
                    }).bind(this),300);
                };
            };
        };
        /**
         * 显示日期选择控件
         * @param {{string}} start [开始日期]
         * @param {[string]} end [结束日期]
         */
        Calendar.prototype.show = function(start,end){
            if(!this.$el) {
                this.load = (function(){
                    this.show(start,end);
                }.bind(this));
                return;
            };

            if(start) {
                start = this.formatDate(start,"yyyy-M-d");
                this.$el.find(".include").removeClass("include");
                if(end) {
                    this.setChoiceArea(start,this.formatDate(end,"yyyy-M-d"));
                } else {
                    this.setChoiceArea(start,start);
                };
            };

            // 每次显示选择控件，先重置掉isChange，表示用户未改变日期
            this.isChange = false;
            // 每次显示选择控件，先记录上当前的开始和结束日期
            this.defaultStartDate = this.startDate;
            this.defaultEndDate = this.endDate;

            if(this.isAnimate) {
                $(".m-calendar .shade").fadeIn(600);
                $(".m-calendar .content").css({
                    "top":"10%",
                    "opacity":0
                });
                $(".m-calendar .content").show();
                setTimeout(function(){
                    $(".m-calendar .content").css({
                        "top":"50%",
                        "opacity":1
                    });
                },200);

                // 优化当日期数据过多，过渡效果卡顿的问题
                $(".txtContent").fadeIn(200);
            } else {
                $(".m-calendar .shade,.m-calendar .content").show();
            };
            
            // 滚动到当天的月份
            if(this.firstShow) {
                this.$el.find(".txtContent .start").parents(".days").prev(".years")[0].scrollIntoView();
                this.firstShow = false;
            };

            if(this.isReset) {
                this.$el.find(".txtContent .start").parents(".days").prev(".years")[0].scrollIntoView();
            };
        };
        /**
         * 显示日期选择控件
         */
        Calendar.prototype.close = function(){
            // 关闭是先隐藏日期数据，不然当日期数据过多，过渡动画会卡顿
            $(".txtContent").hide();
            
            if(this.isAnimate) {
                $(".m-calendar .content").css({
                    "top":"10%",
                    "opacity":0
                });
                $(".m-calendar .shade").fadeOut(600);
                setTimeout(function(){
                    $(".m-calendar .content").hide();
                },600);
            } else {
                $(".m-calendar .shade,.m-calendar .content").hide();
            };
        };
        /**
         * 是否设置为单选模式
         * @param {[Boolean]} choice [true为是，false为否]
         */
        Calendar.prototype.setSingle = function(choice){
            this.isSingle = choice;
        };
        /**
         * 格式化成日期控件需要的格式
         * @param {[string]} date [日期]
         * @param {[boolean]} fmt [格式化格式，如果没传则默认使用this.for]
         */
        Calendar.prototype.formatDate = function(date,fmt){
            if(typeof date == "string") {
                date = new Date(date);
            };
            if(fmt === void 0) { fmt = this.format };

            var o = {   
                "M+" : date.getMonth()+1,                 //月份   
                "d+" : date.getDate(),                    //日   
                "h+" : date.getHours(),                   //小时   
                "m+" : date.getMinutes(),                 //分   
                "s+" : date.getSeconds(),                 //秒   
                "q+" : Math.floor((date.getMonth()+3)/3), //季度   
                "S"  : date.getMilliseconds()             //毫秒   
            };

            if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            };
            for(var k in o) {
                if(new RegExp("("+ k +")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
                };
            }
            return fmt;
        };
        /**
         * 设置最大可选择日期
         * @param {string} date [日期，可不传参表示去除最大日期限制]
         */
        Calendar.prototype.setMaxDate = function(date){
            this.maxDate = date;
            // 如果this.$el找不到，表示当前正处于加载状态
            if(this.maxDate == date || !this.$el) {
                // 如果需要变更的最大日期和默认的相等，则不变动
                return;
            };
            
            if(date) {
                date = date.split("-");
                // 去除所有不可选择的日期
                this.$el.find(".haveValue.disabled").removeClass("disabled");
                // 增加最大可选日期之后的所有日期为不可选日期
                var index = this.$el.find(".date[years=" + date[0] + "-" + date[1] + "] .haveValue[day=" + date[2] + "]").index(".m-calendar .haveValue");
                this.$el.find(".haveValue:gt(" + index + ")").addClass("disabled");
            } else {
                this.$el.find(".disabled").removeClass("disabled");
            };
        }

        return Calendar;
    }());
}(window));