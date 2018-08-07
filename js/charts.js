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
!(function () {
    var _currentObject = null;
    window.template.helper('formatData', function (data, format) {
        var date = new Date();
        date.setTime(data * 1000);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    });
    var IndexMain = (function () {
        function IndexMain() {
            this.$el = $(".g-chartDetail");
            this.header = null;
            this.side = null;
            this.detail = null;
            this.changepwd = null;
            this.token = "";
            this.getToken();
            this.initMethod();
            this.bindEventByOne();
        }
        IndexMain.prototype.fetch = function () {
            this.render();
        };
        IndexMain.prototype.render = function () {
            this.bindEvent();
        };
        IndexMain.prototype.bindEvent = function () {
        };
        IndexMain.prototype.bindEventByOne = function () {
            this.windowEvent();
        };
        IndexMain.prototype.initMethod = function () {
            var options = {
                mainView: this
            };
            this.header = new CHeader(options);
            this.header.fetch();
            this.detail = new CDetail(options);
            this.side = new CSide(options);
            this.side.fetch();
            this.changepwd = new ChangePWD(options);
            this.changepwd.fetch();
        };
        IndexMain.prototype.windowEvent = function () {
            var self = this;
            if (!("onhashchange" in window)) {
                window.layer.alert("您的浏览器版本过低，可能体验会较差！");
            }
            ;
            window.onhashchange = function () {
                var active = "", type = null, hash = window.location.hash.substr(1);
                if (hash in _router) {
                    active = "." + hash;
                    type = eval(_router[hash]);
                }
                else {
                    active = ".newUser";
                    type = NewUser;
                }
                ;
                self.side.setActive(active);
                self.detail.callChartBySide(type);
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
            this.setPlaceHolder = function (val) {
                if (val === void 0) { val = "Search"; }
                this.$search.attr("placeholder", val);
            };
            $.extend(this, props);
            this.bindEventByOne();
        }
        CHeader.prototype.fetch = function () {
            this.render();
        };
        CHeader.prototype.render = function () {
            this.initDate();
            this.bindEvent();
        };
        CHeader.prototype.bindEvent = function () {
        };
        CHeader.prototype.bindEventByOne = function () {
            var _this = this;
            var self = this;
            this.calendar = new window.Calendar({
                submitMethod: function (start, end, obj) {
                    start = start.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
                    if (obj.isSingle) {
                        self.$singleDate.text(start);
                    }
                    else {
                        end = end.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
                        self.$start.text(start);
                        self.$end.text(end);
                    }
                    ;
                    self.mainView.detail.currentChart.changeDate(start, end);
                },
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
                self.mainView.detail.currentChart.search(query);
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
            var date = new Date(), start = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), end = "";
            date.setDate(date.getDate() - 7);
            end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            start = start.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
            end = end.replace(/(?<=-)([0-9])(?=-)|(?<=-)([0-9])$/g, "0$1$2");
            if (isSingle == void 0) {
                this.$singleDate.text(start);
                this.$start.text(start);
                this.$end.text(end);
            }
            else if (isSingle) {
                this.$singleDate.text(start);
            }
            else {
                this.$start.text(start);
                this.$end.text(end);
            }
            ;
        };
        CHeader.prototype.setTitle = function (title) {
            this.$el.find(".name").text(title);
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
        CHeader.prototype.showMenu = function (showSearch, showDate, showSingleDate) {
            if (showSearch === void 0) { showSearch = false; }
            if (showDate === void 0) { showDate = false; }
            if (showSingleDate === void 0) { showSingleDate = false; }
            this.showSearch(showSearch);
            this.showDate(showDate);
            this.showSingleDate(showSingleDate);
        };
        return CHeader;
    }());
    var CSide = (function () {
        function CSide(props) {
            this.$el = $(".c-side");
            this.mainView = null;
            $.extend(this, props);
            this.bindEventByOne();
        }
        CSide.prototype.fetch = function () {
            this.render();
        };
        CSide.prototype.render = function () {
            this.bindEvent();
        };
        CSide.prototype.bindEvent = function () {
        };
        CSide.prototype.bindEventByOne = function () {
            var _this = this;
            this.$el.find(".menu-list").on("click", "li", function () {
                var $this = $(this);
                if (!$this.hasClass("active")) {
                    $this.addClass("active").siblings(".active").removeClass("active");
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
        CDetail.prototype.callChartBySide = function (chartClass) {
            this.currentChart = new chartClass({
                "mainView": this
            });
            this.currentChart.fetch();
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
            var $pading = this.mainView.mainView.$el.find("pading");
            this.total = parseInt($pading.attr("total"));
            if (!this.total) {
                this.total = Math.ceil(parseInt($pading.attr("count")) / this.pageSize);
                this.total = this.total ? this.total : 1;
            }
            ;
            this.selectSize = $pading.attr("select") ? $pading.attr("select").split(",") : null;
            this.selected = $pading.attr("defaultSelect") ? $pading.attr("defaultSelect") : null;
            this.render();
        };
        Pading.prototype.render = function () {
            var $detail = this.mainView.mainView.$el;
            $detail.find("pading")[0].outerHTML = window.template(this.template, {});
            this.$el = $detail.find(".m-pading:last");
            this.$selectSize = this.$el.find(".selectSize");
            this.$selectNo = this.$el.find(".selectNo");
            this.initTotal("init");
            this.initSelectSize();
            window.mdui.mutation();
            this.bindEvent();
        };
        Pading.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$el.find(".home").on("click", function () {
                if (!$(this).attr("disabled")) {
                    self.setPageNo(0, "home");
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
                if (_this.pageSize == pageSize) {
                    return;
                }
                ;
                _this.pageSize = pageSize;
                _this.setPageNo(1, "home");
            });
        };
        Pading.prototype.initSelectSize = function () {
            var _this = this;
            var html = "";
            if (this.selectSize) {
                this.selectSize.forEach(function (en) {
                    if (en == _this.selected) {
                        html += "<option value='" + en + "' selected>" + en + "</option>";
                    }
                    else {
                        html += "<option value='" + en + "'>" + en + "</option>";
                    }
                    ;
                });
                this.$selectSize.find(".pageSize").html(html);
            }
            ;
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
            console.log(1);
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
            this.bindEventByOne();
        }
        ChangePWD.prototype.fetch = function () {
            this.render();
        };
        ChangePWD.prototype.render = function () {
            this.bindEvent();
        };
        ChangePWD.prototype.bindEvent = function () {
        };
        ChangePWD.prototype.bindEventByOne = function () {
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
    var ChartBase = (function () {
        function ChartBase(props) {
            this.mainView = null;
            this.$el = null;
            this.pading = null;
            var parent = null;
            $.extend(this, props);
            parent = this.mainView.mainView;
            parent.header.setTitle(parent.side.$el.find(".active").text());
        }
        ChartBase.prototype.fetch = function (data) {
        };
        ChartBase.prototype.render = function (data) {
        };
        ChartBase.prototype.bindEvent = function () {
        };
        ChartBase.prototype.search = function (query) { };
        ChartBase.prototype.changeDate = function (start, end) { };
        ChartBase.prototype.changePading = function (pageNo, pageSize) { };
        return ChartBase;
    }());
    var NewUser = (function (_super) {
        __extends(NewUser, _super);
        function NewUser(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "newUserTemp"
            };
            $.extend(_this, props);
            return _this;
        }
        NewUser.prototype.fetch = function () {
            this.render();
        };
        NewUser.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, {}));
            this.bindEvent();
        };
        NewUser.prototype.bindEvent = function () {
        };
        return NewUser;
    }(ChartBase));
    var ActiveUser = (function (_super) {
        __extends(ActiveUser, _super);
        function ActiveUser(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "detail": "activeUserTemp"
            };
            $.extend(_this, props);
            return _this;
        }
        ActiveUser.prototype.fetch = function () {
            this.render();
        };
        ActiveUser.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.detail, {}));
            this.$el = $(".m-activeUser");
            this.renderChart();
            this.bindEvent();
        };
        ActiveUser.prototype.bindEvent = function () {
            this.$el.find(".g-chart .menu").on("click", "li", function () {
                var $this = $(this);
                if (!$this.hasClass("active")) {
                    $this.addClass("active").siblings(".active").removeClass("active");
                }
                ;
            });
        };
        ActiveUser.prototype.renderChart = function () {
            var data = [{
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
            var chart = new window.G2.Chart({
                container: 'diagram',
                width: 600,
                height: 300,
                forceFit: true,
                padding: ["auto", "auto", 45, 45],
                background: {
                    fill: "#fff"
                }
            });
            chart.source(data);
            chart.scale('value', {
                min: 0
            });
            chart.scale('year', {
                range: [0, 1]
            });
            chart.line().position('year*value');
            chart.point().position('year*value').size(4).shape('circle').style({
                stroke: '#fff',
                lineWidth: 1
            });
            chart.render();
        };
        return ActiveUser;
    }(ChartBase));
    var StatisticalUser = (function (_super) {
        __extends(StatisticalUser, _super);
        function StatisticalUser(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "statisticalTemp",
                "detail": "statisticalDetail"
            };
            _this.$el = null;
            _this.firstLoad = true;
            return _this;
        }
        StatisticalUser.prototype.fetch = function (pageNo, pageSize, day) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = 50; }
            if (day === void 0) { day = 0; }
            var self = this;
            _load(true);
            _resource.statisticalUser(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "day": day,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (self.firstLoad) {
                    self.render(data);
                    self.firstLoad = false;
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        StatisticalUser.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(false, false, true);
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-statisticalUser");
            this.bindEvent();
        };
        StatisticalUser.prototype.bindEvent = function () { };
        StatisticalUser.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        StatisticalUser.prototype.changeDate = function (start, end) {
            this.fetch(1, 50, parseInt(((new Date(start + " 00:00:00")).getTime() / 1000)));
        };
        StatisticalUser.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return StatisticalUser;
    }(ChartBase));
    var UserList = (function (_super) {
        __extends(UserList, _super);
        function UserList(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "userListTemp",
                "detail": "userListDetail"
            };
            _this.$el = null;
            _this.$frozen = null;
            _this.$select = null;
            _this.firstLoad = true;
            return _this;
        }
        UserList.prototype.fetch = function (pageNo, pageSize, uid) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            if (uid === void 0) { uid = 0; }
            var self = this;
            _load(true);
            _resource.userList(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "uid": uid,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (self.firstLoad) {
                    self.render(data);
                    self.firstLoad = false;
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        UserList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("uid");
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-userList");
            this.$frozen = this.$el.find(".frozenInfo");
            this.$select = this.$frozen.find(".group.select");
            this.bindEvent();
        };
        UserList.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$el.find(".info").on("click", ".btn-freeze", function () {
                var $this = $(this);
                self.$frozen.show();
                setTimeout(function () {
                    self.$frozen.addClass("active");
                }, 10);
                self.initFrozen($this.attr("uid"), $this.attr("uname"));
            });
            this.$frozen.find(".btn-cancel").on("click", function () {
                _this.$frozen.removeClass("active");
                setTimeout(function () {
                    _this.$frozen.hide();
                }, 200);
            });
            this.$frozen.find(".btn-submit").on("click", function () {
                var date = new Date(), start_time = parseInt((date.getTime() / 1000)), end_time = 0;
                if (!self.frozenCheck()) {
                    return;
                }
                ;
                switch (self.$frozen.find(".operation:checked").val()) {
                    case "0":
                        end_time = 0;
                        break;
                    case "1":
                        date.setDate(date.getDate() + parseInt(self.$select.find(".active").attr("day")));
                        end_time = parseInt((date.getTime() / 1000));
                        break;
                }
                ;
                _load(true);
                _resource.addFrozen(JSON.stringify({
                    "uid": parseInt(self.$frozen.find(".uid").val()),
                    "start_time": start_time,
                    "end_time": end_time,
                    "reason": self.$frozen.find(".reason").val(),
                    "token": self.mainView.mainView.token
                }), function (data) {
                    window.layer.msg("冻结成功！");
                    self.$frozen.find(".btn-cancel").trigger("click");
                    _load(false);
                });
            });
            this.$frozen.find(".operation").on("change", function () {
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
        UserList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        UserList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        UserList.prototype.search = function (query) {
            if (/^\d*$/.test(query)) {
                this.fetch(undefined, this.mainView.pading.pageSize, query ? parseInt(query) : undefined);
            }
            else {
                window.layer.msg("请输入正确的用户编号");
            }
            ;
        };
        UserList.prototype.initFrozen = function (uid, uname) {
            var $frozen = this.$frozen;
            $frozen.find(".uid").val(uid);
            $frozen.find(".nickname").val(uname);
            $frozen.find(".operation:eq(0)").prop("checked", true).trigger("change");
            this.$select.find(".choice").attr("day", "1").text("1天");
            this.$select.find(".list li:eq(0)").addClass("active").siblings(".active").removeClass("active");
            $frozen.find(".reason").val("");
        };
        UserList.prototype.frozenCheck = function () {
            var str = "";
            if (!this.$frozen.find(".reason").val().replace(/\s/g, "")) {
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
        return UserList;
    }(ChartBase));
    var PayStatistical = (function (_super) {
        __extends(PayStatistical, _super);
        function PayStatistical(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "payStatisticalTemp",
                "detail": "payStatisticalDetail"
            };
            _this.$el = null;
            _this.firstLoad = true;
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
                if (self.firstLoad) {
                    self.render(data);
                    self.firstLoad = false;
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
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-payStatistical");
            this.bindEvent();
        };
        PayStatistical.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
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
    var Diamond = (function (_super) {
        __extends(Diamond, _super);
        function Diamond(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "newUserTemp"
            };
            $.extend(_this, props);
            return _this;
        }
        Diamond.prototype.fetch = function () {
            this.render();
        };
        Diamond.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, {}));
            this.bindEvent();
        };
        Diamond.prototype.bindEvent = function () {
        };
        return Diamond;
    }(ChartBase));
    var FreezeList = (function (_super) {
        __extends(FreezeList, _super);
        function FreezeList(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "newUserTemp"
            };
            $.extend(_this, props);
            return _this;
        }
        FreezeList.prototype.fetch = function () {
            this.render();
        };
        FreezeList.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, {}));
            this.bindEvent();
        };
        FreezeList.prototype.bindEvent = function () {
        };
        return FreezeList;
    }(ChartBase));
    var InfoQuery = (function (_super) {
        __extends(InfoQuery, _super);
        function InfoQuery(props) {
            var _this = _super.call(this, props) || this;
            _this.template = {
                "routerTemp": "newUserTemp"
            };
            $.extend(_this, props);
            return _this;
        }
        InfoQuery.prototype.fetch = function () {
            this.render();
        };
        InfoQuery.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, {}));
            this.bindEvent();
        };
        InfoQuery.prototype.bindEvent = function () {
        };
        return InfoQuery;
    }(ChartBase));
    _currentObject = new IndexMain();
    _currentObject.fetch();
}());
//# sourceMappingURL=charts.js.map