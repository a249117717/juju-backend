window.template.helper('formatDate', function (data, format) {
    var date = new Date();
    date.setTime(data * 1000);
    var dateD = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()).replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
    switch (format) {
        case 1:
            var dateT = (" " + date.getHours() + ":" + date.getMinutes()).replace(/(?<=\s)([0-9])(?=:)|(?<=:)([0-9])$/g, "0$1$2");
            return "" + dateD + dateT;
        default:
            return dateD;
    }
    ;
});
var IndexMain = (function () {
    function IndexMain() {
        this.$el = $(".g-chartDetail");
        this.header = null;
        this.side = null;
        this.detail = null;
        this.changepwd = null;
        this.frozenInfo = null;
        this.givDiamond = null;
        this.token = "";
        this.chartClass = {};
        this.getToken();
        this.initMethod();
    }
    IndexMain.prototype.fetch = function () {
        _conversionAjax(_resource);
        this.render();
    };
    IndexMain.prototype.render = function () {
        this.bindEvent();
    };
    IndexMain.prototype.bindEvent = function () {
        this.windowEvent();
    };
    IndexMain.prototype.initMethod = function () {
        var options = {
            mainView: this
        };
        this.header = new CHeader(options);
        this.header.fetch();
        this.side = new CSide(options);
        this.side.fetch();
        this.detail = new CDetail(options);
        this.detail.fetch();
        this.changepwd = new ChangePWD(options);
        this.frozenInfo = new FrozenInfo(options);
        this.givDiamond = new GivDiamond(options);
    };
    IndexMain.prototype.windowEvent = function () {
        var self = this;
        if (!("onhashchange" in window)) {
            window.layer.alert("您的浏览器版本过低，请升级浏览器或使用Chrome浏览器！");
        }
        ;
        window.onhashchange = function () {
            var hash = window.location.hash.substr(1);
            if (!_router.hasOwnProperty(hash)) {
                var first = "";
                for (var en in _router) {
                    first = en;
                    break;
                }
                ;
                window.location.hash = first;
                return;
            }
            ;
            self.side.setActive("." + hash);
            self.detail.callChartBySide(hash);
        };
        window.onhashchange(null);
    };
    IndexMain.prototype.getToken = function () {
        var token = window.localStorage["jujuBackend"];
        if (!token) {
            window.location.replace("index.html");
        }
        else {
            this.token = token;
        }
        ;
    };
    return IndexMain;
}());
var CHeader = (function () {
    function CHeader(props) {
        this.$el = $(".c-header");
        this.mainView = null;
        this.calendar = null;
        this.$start = this.$el.find(".date-out .start .date");
        this.$end = this.$el.find(".date-out .end .date");
        this.$singleDate = this.$el.find(".singleDate .date");
        this.$search = this.$el.find(".search");
        this.$searchSelect = this.$el.find(".search-select");
        this.template = {
            "searchSelectTemp": "searchSelectTemp"
        };
        $.extend(this, props);
    }
    CHeader.prototype.fetch = function () {
        this.render();
    };
    CHeader.prototype.render = function () {
        this.initDate();
        this.bindEvent();
    };
    CHeader.prototype.bindEvent = function () {
        var _this = this;
        var self = this;
        this.calendar = new window.Calendar({
            submitMethod: function (start, end, obj) {
                if (obj.isSingle) {
                    self.$singleDate.text(start);
                }
                else {
                    self.$start.text(start);
                    self.$end.text(end);
                }
                ;
                self.mainView.detail.currentChart.changeDate(start, end);
            },
            "format": "yyyy-MM-dd",
            "choiceModel": 2,
            "isReset": true,
            "haveSubmit": false
        });
        this.$el.find(".search").on({
            "focus": function () {
                $(this).parents(".search-out").addClass("active");
            },
            "blur": function () {
                $(this).parents(".search-out").removeClass("active");
            },
            "keyup": function (e) {
                if (e.keyCode == 13) {
                    _this.$el.find(".btn-search").click();
                }
                ;
            }
        });
        this.$el.find(".btn-search").on("click", function () {
            var $this = $(this), query = $this.prev(".search").val();
            self.mainView.detail.currentChart.search(query.replace(/\s/g, ""));
        });
        this.$el.find(".date-out").on("click", function () {
            var $this = $(this);
            self.calendar.setSingle(false);
            self.calendar.show($this.find(".start .date").text(), $this.find(".end .date").text());
        });
        this.$el.find(".singleDate").on("click", function () {
            self.calendar.setSingle(true);
            self.calendar.show($(this).find(".date").text());
        });
    };
    CHeader.prototype.initDate = function (isSingle) {
        var date = this.getInitDate(), start = date.start, end = date.end;
        if (isSingle == void 0) {
            this.$singleDate.text(end);
            this.$start.text(start);
            this.$end.text(end);
        }
        else if (isSingle) {
            this.$singleDate.text(end);
        }
        else {
            this.$start.text(start);
            this.$end.text(end);
        }
        ;
    };
    CHeader.prototype.getInitDate = function () {
        var date = new Date(), start = "", end = "";
        date.setDate(date.getDate() - 1);
        end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        date.setDate(date.getDate() - 7);
        start = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        start = start.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
        end = end.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
        return {
            "start": start,
            "end": end
        };
    };
    CHeader.prototype.setTitle = function (title) {
        this.$el.find(".name").text(title);
    };
    CHeader.prototype.setSearch = function (value) {
        this.$search.val(value);
    };
    CHeader.prototype.showSearch = function (isShow) {
        if (isShow === void 0) { isShow = true; }
        if (isShow) {
            this.$search.val("");
            this.setPlaceHolder();
            this.$el.find(".search-out").show();
        }
        else {
            this.$el.find(".search-out").hide();
        }
        ;
    };
    CHeader.prototype.showSelect = function (isShow, arry) {
        var _this = this;
        if (isShow === void 0) { isShow = true; }
        if (isShow) {
            if (!arry.length) {
                window.layer.msg("要显示搜索内容选择框必须键入相应内容！");
                return;
            }
            ;
            this.$searchSelect.html(window.template(this.template.searchSelectTemp, { "data": arry }));
            window.mdui.mutation();
            this.$searchSelect.find(".mdui-select").on("close.mdui.select", function (e, value) {
                _this.mainView.detail.currentChart.changeSearchContent(value.inst.value, value.inst.text);
            });
            this.$searchSelect.show();
        }
        else {
            this.$searchSelect.hide();
        }
        ;
    };
    CHeader.prototype.setPlaceHolder = function (val) {
        if (val === void 0) { val = "Search"; }
        this.$search.attr("placeholder", val);
    };
    CHeader.prototype.showDate = function (isShow) {
        if (isShow === void 0) { isShow = true; }
        if (isShow) {
            this.initDate(false);
            this.$el.find(".date-out").show();
        }
        else {
            this.$el.find(".date-out").hide();
        }
        ;
    };
    CHeader.prototype.showSingleDate = function (isShow) {
        if (isShow === void 0) { isShow = true; }
        if (isShow) {
            this.initDate(true);
            this.$el.find(".singleDate").show();
        }
        else {
            this.$el.find(".singleDate").hide();
        }
        ;
    };
    CHeader.prototype.setMaxDate = function (maxDate) {
        var temp = null;
        if (maxDate && maxDate.length == 10) {
            temp = maxDate.split("-");
            maxDate = temp[0] + "-" + parseInt(temp[1]) + "-" + parseInt(temp[2]);
        }
        ;
        this.calendar.setMaxDate(maxDate);
    };
    CHeader.prototype.showMenu = function (showSearch, showDate, showSingleDate, showSelect) {
        if (showSearch === void 0) { showSearch = false; }
        if (showDate === void 0) { showDate = false; }
        if (showSingleDate === void 0) { showSingleDate = false; }
        if (showSelect === void 0) { showSelect = false; }
        this.showSearch(showSearch);
        this.showDate(showDate);
        this.showSingleDate(showSingleDate);
        this.showSelect(showSelect);
    };
    return CHeader;
}());
var CSide = (function () {
    function CSide(props) {
        this.$el = $(".c-side");
        this.template = "silderMenuTemp";
        this.mainView = null;
        $.extend(this, props);
    }
    CSide.prototype.fetch = function () {
        this.render();
    };
    CSide.prototype.render = function () {
        this.$el.find(".menu-list").html(window.template(this.template, { data: _router }));
        this.bindEvent();
    };
    CSide.prototype.bindEvent = function () {
        var _this = this;
        this.$el.find(".menu-list").on("click", "li", function () {
            var $this = $(this);
            if (!$this.hasClass("active")) {
                $this.addClass("active").siblings(".active").removeClass("active");
            }
            else {
                window.location.reload();
            }
            ;
        });
        this.$el.find(".header .changePwd").on("click", function () {
            _this.mainView.changepwd.show();
        });
    };
    CSide.prototype.setActive = function (dom) {
        this.$el.find(dom).addClass("active").siblings(".active").removeClass("active");
    };
    return CSide;
}());
var CDetail = (function () {
    function CDetail(props) {
        this.$el = $(".c-content");
        this.currentChart = null;
        this.mainView = null;
        this.moduleObject = {};
        this.ajax = new XMLHttpRequest();
        $.extend(this, props);
    }
    CDetail.prototype.fetch = function () {
        this.render();
    };
    CDetail.prototype.render = function () {
        this.bindEvent();
    };
    CDetail.prototype.bindEvent = function () { };
    CDetail.prototype.renderByChildren = function (html) {
        this.$el.html(html);
        this.renderComponent();
    };
    CDetail.prototype.renderComponent = function () {
        var $el = this.$el;
        switch (true) {
            case $el.find("pading").length != 0:
                this.component(Pading);
            default:
                break;
        }
    };
    CDetail.prototype.callChartBySide = function (fileName) {
        var _this = this;
        require([fileName], function (obj) {
            var currentChart = new obj({
                mainView: _this
            });
            _this.mainView.header.showMenu();
            _this.currentChart = currentChart;
            currentChart.fetch();
        });
        this.mainView.header.setTitle(this.mainView.side.$el.find(".active").text());
    };
    CDetail.prototype.component = function (componentClass) {
        var className = componentClass["name"];
        className = className.replace(/^.{1}/, className[0].toLowerCase());
        this.currentChart[className] = new componentClass({
            mainView: this.currentChart
        });
        this.currentChart[className].fetch();
    };
    return CDetail;
}());
var Pading = (function () {
    function Pading(props) {
        this.$el = null;
        this.$selectSize = null;
        this.$selectNo = null;
        this.mainView = null;
        this.template = "padingTemp";
        this.total = 0;
        this.pageNo = 0;
        this.pageSize = _pageSize;
        this.selectSize = null;
        this.selected = null;
        this.state = {
            "home": false,
            "prev": false,
            "next": false,
            "back": false
        };
        this.isFirst = true;
        $.extend(this, props);
    }
    Pading.prototype.fetch = function () {
        this.initSelectByAttr();
        this.initTotalByAttr();
        this.render();
    };
    Pading.prototype.render = function () {
        var $detail = this.mainView.mainView.$el;
        $detail.find("pading")[0].outerHTML = window.template(this.template, {
            select: this.selectSize,
            selected: this.selected
        });
        this.$el = $detail.find(".m-pading:last");
        this.$selectSize = this.$el.find(".selectSize");
        this.$selectNo = this.$el.find(".selectNo");
        this.initTotal("init");
        window.mdui.mutation();
        this.bindEvent();
    };
    Pading.prototype.bindEvent = function () {
        var _this = this;
        var self = this;
        this.$el.find(".home").on("click", function () {
            if (!$(this).attr("disabled")) {
                self.setPageNo(1, "home");
            }
            ;
        });
        this.$el.find(".prev").on("click", function () {
            if (!$(this).attr("disabled")) {
                self.setPageNo(self.pageNo - 1, "prev");
            }
            ;
        });
        this.$el.find(".page").on("click", function () {
            if (!$(this).hasClass("active")) {
                self.setPageNo(parseInt($(this).text()), "page");
            }
            ;
        });
        this.$el.find(".next").on("click", function () {
            if (!$(this).attr("disabled")) {
                self.setPageNo(self.pageNo + 1, "next");
            }
            ;
        });
        this.$el.find(".back").on("click", function () {
            if (!$(this).attr("disabled")) {
                self.setPageNo(self.total, "back");
            }
            ;
        });
        this.$el.find(".pageSize").on("close.mdui.select", function (e, value) {
            var pageSize = parseInt(value.inst.value);
            if (_this.pageSize == pageSize || _this.total == 1) {
                return;
            }
            ;
            _this.pageSize = pageSize;
            _this.setPageNo(1, "home");
        });
    };
    Pading.prototype.initTotalByAttr = function () {
        var $pading = this.mainView.mainView.$el.find("pading");
        this.total = parseInt($pading.attr("total"));
        if (!this.total) {
            var count = $pading.attr("count");
            if (count) {
                this.total = Math.ceil(parseInt($pading.attr("count")) / this.pageSize);
            }
            else {
                this.total = 1;
            }
            ;
            this.total = this.total ? this.total : 1;
        }
        ;
    };
    Pading.prototype.initSelectByAttr = function () {
        var $pading = this.mainView.mainView.$el.find("pading");
        if ($pading.attr("select")) {
            this.selectSize = $pading.attr("select").split(",");
            this.selected = $pading.attr("defaultSelect");
            if (!this.selected || !~this.selectSize.indexOf(this.selected)) {
                this.selected = this.selectSize[0];
            }
            ;
        }
        else {
            this.selectSize = ["10", "20", "30", "50"];
            this.selected = "10";
        }
        ;
        this.pageSize = parseInt(this.selected);
    };
    Pading.prototype.initTotal = function (operation) {
        var total = this.total;
        this.$el.find(".total").text(total);
        switch (operation) {
            case "reset":
                this.$el.find(".page").show();
                this.isFirst = true;
                this.setPageNo(1, "home");
                if (total <= 5) {
                    $.each(this.$el.find(".page"), function (index) {
                        if (index > total - 1) {
                            $(this).hide();
                        }
                        ;
                    });
                }
                ;
                break;
            case "init":
            default:
                this.setPageNo(1, "home");
                if (total <= 5) {
                    $.each(this.$el.find(".page"), function (index) {
                        if (index > total - 1) {
                            $(this).hide();
                        }
                        ;
                    });
                }
                ;
                break;
        }
    };
    Pading.prototype.setPageNo = function (value, operation) {
        this.pageNo = value;
        if (this.isFirst) {
            this.isFirst = false;
        }
        else {
            this.mainView.changePading(value, this.pageSize);
        }
        ;
        if (value < 3) {
            this.disabledHome(true);
            if (value < 2) {
                this.disabledPrev(true);
            }
            else {
                this.disabledPrev(false);
            }
            ;
        }
        else {
            this.disabledPrev(false);
            this.disabledHome(false);
        }
        ;
        if (value > this.total - 2) {
            this.disabledBack(true);
            if (value > this.total - 1) {
                this.disabledNext(true);
            }
            else {
                this.disabledNext(false);
            }
            ;
        }
        else {
            this.disabledNext(false);
            this.disabledBack(false);
        }
        ;
        this.resetNumber(value, operation);
        this.$el.find(".pageNo").text(value);
    };
    Pading.prototype.setTotal = function (count) {
        var total = 0;
        total = Math.ceil(count / this.pageSize);
        if (this.total == total) {
            return;
        }
        ;
        this.total = total;
        this.$el.find(".total").text(total);
        this.initTotal("reset");
    };
    Pading.prototype.resetNumber = function (value, operation) {
        var $page = null;
        if (value < 3 || value > this.total - 2) {
            if (operation == "home") {
                $page = this.$el.find(".page:first");
                $.each(this.$el.find(".page"), function (index) {
                    var temp = index + 1;
                    $(this).attr("no", temp).text(temp);
                });
            }
            else if (operation == "back") {
                $page = this.$el.find(".page:last");
                $.each(this.$el.find(".page"), function (index) {
                    var temp = value - 4 + index;
                    $(this).attr("no", temp).text(temp);
                });
            }
            else {
                $page = this.$el.find(".page[no=" + value + "]");
            }
            ;
        }
        else {
            $page = this.$el.find(".page:eq(2)");
            $.each(this.$el.find(".page"), function (index) {
                var temp = value + (index - 2);
                $(this).attr("no", temp).text(temp);
            });
        }
        ;
        $page.addClass("active").siblings(".active").removeClass("active");
    };
    Pading.prototype.disabledHome = function (isDisabled) {
        if (isDisabled === void 0) { isDisabled = false; }
        if (this.state.home != isDisabled) {
            this.state.home = isDisabled;
            isDisabled ? this.$el.find(".home").attr("disabled", "") : this.$el.find(".home").removeAttr("disabled");
        }
        ;
    };
    Pading.prototype.disabledPrev = function (isDisabled) {
        if (isDisabled === void 0) { isDisabled = false; }
        if (this.state.prev != isDisabled) {
            this.state.prev = isDisabled;
            isDisabled ? this.$el.find(".prev").attr("disabled", "") : this.$el.find(".prev").removeAttr("disabled");
        }
        ;
    };
    Pading.prototype.disabledNext = function (isDisabled) {
        if (isDisabled === void 0) { isDisabled = false; }
        if (this.state.next != isDisabled) {
            this.state.next = isDisabled;
            isDisabled ? this.$el.find(".next").attr("disabled", "") : this.$el.find(".next").removeAttr("disabled");
        }
        ;
    };
    Pading.prototype.disabledBack = function (isDisabled) {
        if (isDisabled === void 0) { isDisabled = false; }
        if (this.state.back != isDisabled) {
            this.state.back = isDisabled;
            isDisabled ? this.$el.find(".back").attr("disabled", "") : this.$el.find(".back").removeAttr("disabled");
        }
        ;
    };
    return Pading;
}());
var ChangePWD = (function () {
    function ChangePWD(props) {
        this.$el = $(".g-changePwd");
        this.mainView = null;
        $.extend(this, props);
        this.fetch();
    }
    ChangePWD.prototype.fetch = function () {
        this.render();
    };
    ChangePWD.prototype.render = function () {
        this.bindEvent();
    };
    ChangePWD.prototype.bindEvent = function () {
        var _this = this;
        this.$el.find(".btn-cancel").on("click", function () {
            _this.hide();
        });
        this.$el.find(".btn-submit").on("click", function () {
            _this.submit();
        });
        this.$el.find(".newPwd").on("keyup", function (e) {
            if (e.keyCode == 13) {
                _this.$el.find(".btn-submit").click();
            }
            ;
        });
    };
    ChangePWD.prototype.submit = function () {
        var self = this;
        if (this.check()) {
            _load(true);
            _resource.changePwd(JSON.stringify({
                "username": this.$el.find(".user").val(),
                "old_password": this.$el.find(".oldPwd").val(),
                "new_password": this.$el.find(".newPwd").val(),
                "token": this.mainView.token
            }), function (data) {
                if (data.code == 0) {
                    window.layer.alert("密码修改成功");
                    self.hide();
                }
                else {
                    window.layer.msg(data.msg);
                }
                ;
                _load(false);
            });
        }
        ;
    };
    ChangePWD.prototype.check = function () {
        var $input = this.$el.find(".input-group"), str = "";
        if (!$input.find(".user").val()) {
            str = "请输入用户名";
        }
        else if (!$input.find(".oldPwd").val()) {
            str = "请输入旧密码";
        }
        else if (!$input.find(".newPwd").val()) {
            str = "请输入新密码";
        }
        else if ($input.find(".newPwd").val() != $input.find(".rePwd").val()) {
            str = "新密码两次输入不相同";
        }
        ;
        if (str) {
            window.layer.msg(str);
            return false;
        }
        else {
            return true;
        }
        ;
    };
    ChangePWD.prototype.show = function () {
        var _this = this;
        this.$el.show();
        setTimeout(function () {
            _this.$el.addClass("active");
        }, 10);
    };
    ChangePWD.prototype.hide = function () {
        var _this = this;
        this.$el.removeClass("active");
        setTimeout(function () {
            _this.$el.hide();
        }, 200);
    };
    return ChangePWD;
}());
var FrozenInfo = (function () {
    function FrozenInfo(props) {
        this.$el = $(".m-frozenInfo");
        this.$select = this.$el.find(".group.select");
        this.mainView = null;
        this.currentDetail = null;
        this.sTime = null;
        $.extend(this, props);
        this.fetch();
    }
    FrozenInfo.prototype.fetch = function () {
        this.render();
    };
    FrozenInfo.prototype.render = function () {
        this.bindEvent();
    };
    FrozenInfo.prototype.bindEvent = function () {
        var _this = this;
        var self = this;
        this.$el.find(".btn-cancel").on("click", function () {
            _this.hide();
        });
        this.$el.find(".btn-submit").on("click", function () {
            var date = new Date(), start_time = parseInt((date.getTime() / 1000)), end_time = 0, option = null;
            if (!self.frozenCheck()) {
                return;
            }
            ;
            switch (self.$el.find(".operation:checked").val()) {
                case "0":
                    end_time = 0;
                    break;
                case "1":
                    date.setDate(date.getDate() + parseInt(self.$select.find(".active").attr("day")));
                    end_time = parseInt((date.getTime() / 1000));
                    break;
            }
            ;
            option = {
                "uid": parseInt(self.$el.find(".uid").val()),
                "start_time": start_time,
                "end_time": end_time,
                "reason": self.$el.find(".reason").val(),
                "token": self.mainView.token
            };
            _load(true);
            if (self.sTime != null) {
                _resource.updateFrozen(JSON.stringify(option), function (data) {
                    window.layer.msg("更新成功！");
                    self.currentDetail.frozen();
                    self.hide();
                    _load(false);
                });
            }
            else {
                _resource.addFrozen(JSON.stringify(option), function (data) {
                    window.layer.msg("冻结成功！");
                    self.currentDetail.frozen();
                    self.hide();
                    _load(false);
                });
            }
        });
        this.$el.find(".operation").on("change", function () {
            var val = $(this).val();
            switch (val) {
                case "0":
                    self.$select.hide();
                    break;
                case "1":
                    self.$select.show();
                    break;
            }
            ;
        });
        this.$select.find(".choice").on("click", function () {
            _this.$select.find(".list").show();
            setTimeout(function () {
                _this.$select.find(".list").addClass("active");
                $(document).on("click", function () {
                    _this.$select.find(".list").removeClass("active");
                    setTimeout(function () {
                        _this.$select.find(".list").hide();
                    }, 200);
                    $(document).unbind("click");
                });
            }, 10);
        });
        this.$select.find(".list").on("click", "li", function () {
            var $this = $(this);
            self.$select.find(".choice").attr("day", $this.attr("day")).text($this.text());
            $this.addClass("active").siblings(".active").removeClass("active");
        });
    };
    FrozenInfo.prototype.initFrozen = function (uid, uname, reason) {
        var $el = this.$el;
        $el.find(".uid").val(uid);
        $el.find(".nickname").val(uname);
        $el.find(".operation:eq(0)").prop("checked", true).trigger("change");
        this.$select.find(".choice").attr("day", "1").text("1天");
        this.$select.find(".list li:eq(0)").addClass("active").siblings(".active").removeClass("active");
        $el.find(".reason").val(reason);
    };
    FrozenInfo.prototype.frozenCheck = function () {
        var str = "";
        if (!this.$el.find(".reason").val().replace(/\s/g, "")) {
            str = "请输入冻结事由";
        }
        ;
        if (str) {
            window.layer.alert(str);
            return false;
        }
        ;
        return true;
    };
    FrozenInfo.prototype.show = function (uid, uname, obj, reason, sTime) {
        var _this = this;
        this.currentDetail = obj;
        this.$el.show();
        setTimeout(function () {
            _this.$el.addClass("active");
        }, 10);
        this.sTime = sTime;
        this.initFrozen(uid, uname, reason);
    };
    FrozenInfo.prototype.hide = function () {
        var _this = this;
        this.$el.removeClass("active");
        setTimeout(function () {
            _this.$el.hide();
        }, 200);
    };
    return FrozenInfo;
}());
var GivDiamond = (function () {
    function GivDiamond(props) {
        this.$el = $(".m-givDiamond");
        this.mainView = null;
        $.extend(this, props);
        this.fetch();
    }
    GivDiamond.prototype.fetch = function () {
        this.render();
    };
    GivDiamond.prototype.render = function () {
        this.bindEvent();
    };
    GivDiamond.prototype.bindEvent = function () {
        var _this = this;
        var self = this;
        this.$el.find(".btn-submit").on("click", function () {
            if (!_this.givingCheck()) {
                return;
            }
            ;
            _load(true);
            _resource.addDiamond(JSON.stringify({
                "uid": parseInt(self.$el.find(".uid").val()),
                "num": parseInt(self.$el.find(".diamondNumber").val()),
                "reason": self.$el.find(".reason").val(),
                "token": _this.mainView.token
            }), function (data) {
                window.layer.msg("赠送成功！");
                self.hide();
                _load(false);
            });
        });
        this.$el.find(".btn-cancel").on("click", function () {
            _this.hide();
        });
        this.$el.find(".diamondNumber").on("input", function () {
            var $this = $(this);
            if (/^\d*$/.test($this.val())) {
                $this.attr("old", $this.val());
            }
            else {
                $this.val($this.attr("old"));
                window.layer.tips('请输入正整数', self.$el.find(".diamondNumber")[0], {
                    tips: [1, '#FF9800'],
                    time: 2000
                });
            }
            ;
        });
    };
    GivDiamond.prototype.initgiving = function (uid) {
        var $el = this.$el;
        $el.find(".uid").val(uid);
        $el.find(".diamondNumber,.reason").val("");
    };
    GivDiamond.prototype.givingCheck = function () {
        var str = "";
        if (!this.$el.find(".diamondNumber").val()) {
            str = "请输入赠送的钻石数量";
        }
        else if (!this.$el.find(".reason").val().replace(/\s/g, "")) {
            str = "请输入赠送事由";
        }
        ;
        if (str) {
            window.layer.alert(str);
            return false;
        }
        ;
        return true;
    };
    GivDiamond.prototype.show = function (uid) {
        var _this = this;
        this.$el.show();
        setTimeout(function () {
            _this.$el.addClass("active");
        }, 10);
        this.initgiving(uid);
    };
    GivDiamond.prototype.hide = function () {
        var _this = this;
        this.$el.removeClass("active");
        setTimeout(function () {
            _this.$el.hide();
        }, 200);
    };
    return GivDiamond;
}());
var ChartBase = (function () {
    function ChartBase(props) {
        this.mainView = null;
        this.$el = null;
        this.pading = null;
        this.completeHtml = false;
        $.extend(this, props);
    }
    ChartBase.prototype.fetch = function (data) {
    };
    ChartBase.prototype.render = function (data) {
    };
    ChartBase.prototype.bindEvent = function () {
    };
    ChartBase.prototype.search = function (query) { };
    ChartBase.prototype.changeSearchContent = function (value, text) {
    };
    ChartBase.prototype.changeDate = function (start, end) { };
    ChartBase.prototype.changePading = function (pageNo, pageSize) { };
    ChartBase.prototype.frozen = function () { };
    ChartBase.prototype.showOrHideByAni = function ($obj, operation) {
        if (operation === void 0) { operation = 1; }
        switch (operation) {
            case 0:
                $obj.removeClass("active");
                setTimeout(function () {
                    $obj.hide();
                }, 200);
                break;
            default:
                $obj.show();
                setTimeout(function () {
                    $obj.addClass("active");
                }, 10);
                break;
        }
        ;
    };
    return ChartBase;
}());
//# sourceMappingURL=charts.js.map