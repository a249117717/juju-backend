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
            this.getToken();
            this.initMethod();
        }
        IndexMain.prototype.fetch = function () {
            this.render();
        };
        IndexMain.prototype.render = function () {
            this.bindEvent();
        };
        IndexMain.prototype.bindEvent = function () {
            var self = this;
            this.windowEvent();
            $("#formReturn").on("load", function () {
                self.detail.currentChart.getFormReturn(this);
            });
        };
        IndexMain.prototype.initMethod = function () {
            var options = {
                mainView: this
            };
            this.header = new CHeader(options);
            this.header.fetch();
            this.side = new CSide(options);
            this.side.fetch();
            this.changepwd = new ChangePWD(options);
            this.frozenInfo = new FrozenInfo(options);
            this.givDiamond = new GivDiamond(options);
            this.detail = new CDetail(options);
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
                    var en = "";
                    for (en in _router) {
                        active = "." + en;
                        type = eval(_router[en]);
                        break;
                    }
                    ;
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
        CHeader.prototype.setMaxDate = function (maxDate) {
            var temp = null;
            if (maxDate && maxDate.length == 10) {
                temp = maxDate.split("-");
                maxDate = temp[0] + "-" + parseInt(temp[1]) + "-" + parseInt(temp[2]);
            }
            ;
            this.calendar.setMaxDate(maxDate);
        };
        CHeader.prototype.showMenu = function (showSearch, showDate, showSingleDate, maxDate) {
            if (showSearch === void 0) { showSearch = false; }
            if (showDate === void 0) { showDate = false; }
            if (showSingleDate === void 0) { showSingleDate = false; }
            if (maxDate === void 0) { maxDate = null; }
            this.showSearch(showSearch);
            this.showDate(showDate);
            this.showSingleDate(showSingleDate);
            this.setMaxDate(maxDate);
        };
        return CHeader;
    }());
    var CSide = (function () {
        function CSide(props) {
            this.$el = $(".c-side");
            this.mainView = null;
            $.extend(this, props);
        }
        CSide.prototype.fetch = function () {
            this.render();
        };
        CSide.prototype.render = function () {
            this.bindEvent();
        };
        CSide.prototype.bindEvent = function () {
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
                if (_this.pageSize == pageSize || _this.total == 1) {
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
        ChartBase.prototype.frozen = function () { };
        ChartBase.prototype.getFormReturn = function (e) { };
        return ChartBase;
    }());
    var StatisticalUser = (function (_super) {
        __extends(StatisticalUser, _super);
        function StatisticalUser(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.maxDate = null;
            _this.chart = null;
            _this.template = {
                "routerTemp": "statisticalTemp",
                "detail": "statisticalDetail"
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
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
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
            this.$el.find(".info").html(window.template(this.template.detail, data));
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
    var UserList = (function (_super) {
        __extends(UserList, _super);
        function UserList(props) {
            var _this = _super.call(this, props) || this;
            _this.$currentForzen = null;
            _this.$el = null;
            _this.template = {
                "routerTemp": "userListTemp",
                "detail": "userListDetail"
            };
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
                if (!self.$el) {
                    self.render(data);
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
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-userList");
            this.bindEvent();
        };
        UserList.prototype.bindEvent = function () {
            var self = this;
            this.$el.find(".info").on("click", ".btn-freeze", function () {
                var $this = $(this);
                self.$currentForzen = $this;
                self.mainView.mainView.frozenInfo.show(parseInt($this.attr("uid")), $this.attr("uname"), self);
            });
            this.$el.find(".info").on("click", ".btn-diamond", function () {
                var $this = $(this);
                self.mainView.mainView.givDiamond.show(parseInt($this.attr("uid")));
            });
        };
        UserList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        UserList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        UserList.prototype.search = function (query) {
            if (!/^\d*$/.test(query)) {
                window.layer.msg("请填写正确的用户编号");
            }
            else {
                this.fetch(undefined, this.pading.pageSize, query ? parseInt(query) : undefined);
            }
            ;
        };
        UserList.prototype.frozen = function () {
            this.$currentForzen.prop("disabled", true);
        };
        return UserList;
    }(ChartBase));
    var PayStatistical = (function (_super) {
        __extends(PayStatistical, _super);
        function PayStatistical(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": "payStatisticalTemp",
                "detail": "payStatisticalDetail"
            };
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
                if (!self.$el) {
                    self.render(data);
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
            _this.$el = null;
            _this.template = {
                "routerTemp": "diamondTemp",
                "detail": "diamondDetail"
            };
            $.extend(_this, props);
            return _this;
        }
        Diamond.prototype.fetch = function (pageNo, pageSize, uid) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            if (uid === void 0) { uid = 0; }
            var self = this;
            _load(true);
            _resource.diamond(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "uid": uid,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    self.render(data);
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        Diamond.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-diamond");
            this.bindEvent();
        };
        Diamond.prototype.bindEvent = function () {
        };
        Diamond.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        Diamond.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        Diamond.prototype.search = function (query) {
            if (!/^\d*$/.test(query)) {
                window.layer.msg("请填写正确的用户编号");
            }
            else {
                this.fetch(undefined, this.pading.pageSize, query ? parseInt(query) : undefined);
            }
            ;
        };
        return Diamond;
    }(ChartBase));
    var FreezeList = (function (_super) {
        __extends(FreezeList, _super);
        function FreezeList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": "freezeListTemp",
                "detail": "freezeListDetail"
            };
            $.extend(_this, props);
            return _this;
        }
        FreezeList.prototype.fetch = function (pageNo, pageSize, uid) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            if (uid === void 0) { uid = 0; }
            var self = this;
            _load(true);
            _resource.freezeList(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "uid": uid,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    self.render(data);
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        FreezeList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-freezeList");
            this.bindEvent();
        };
        FreezeList.prototype.bindEvent = function () {
            var self = this;
            this.$el.find(".info").on("click", ".btn-delFreeze", function () {
                var $this = $(this), uid = $this.attr("uid"), uname = $this.attr("uname");
                window.layer.confirm("\u786E\u8BA4\u89E3\u9664\u7528\u6237\u7F16\u53F7\u4E3A:" + uid + "\uFF0C\u7528\u6237\u540D\u4E3A:" + uname + "\u7684\u51BB\u7ED3\u4E48\uFF1F", {
                    btn: ['确定', '取消']
                }, function (e) {
                    _load(true);
                    _resource.delFrozen(JSON.stringify({
                        "uid": parseInt(uid),
                        "token": self.mainView.mainView.token
                    }), function (data) {
                        window.layer.msg(data.msg);
                        $this.prop("disabled", true);
                        window.layer.close(e);
                        _load(false);
                    });
                }, function (e) {
                    window.layer.close(e);
                });
            });
            this.$el.find(".info").on("click", ".btn-update", function () {
                var $this = $(this);
                self.mainView.mainView.frozenInfo.show(parseInt($this.attr("uid")), $this.attr("uname"), self, $this.parents("tr").find(".reason").text(), parseInt($this.attr("stime")));
            });
        };
        FreezeList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        FreezeList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        FreezeList.prototype.search = function (query) {
            if (!/^\d*$/.test(query)) {
                window.layer.msg("请填写正确的用户编号");
            }
            else {
                this.fetch(undefined, this.pading.pageSize, query ? parseInt(query) : undefined);
            }
            ;
        };
        return FreezeList;
    }(ChartBase));
    var OrderList = (function (_super) {
        __extends(OrderList, _super);
        function OrderList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": "mallListTemp",
                "detail": "mallListDetail"
            };
            $.extend(_this, props);
            return _this;
        }
        OrderList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            self.render({});
        };
        OrderList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-orderList");
            this.bindEvent();
        };
        OrderList.prototype.bindEvent = function () {
        };
        OrderList.prototype.renderDetail = function (data) {
        };
        OrderList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return OrderList;
    }(ChartBase));
    var MallList = (function (_super) {
        __extends(MallList, _super);
        function MallList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": "mallListTemp",
                "detail": "mallListDetail"
            };
            $.extend(_this, props);
            return _this;
        }
        MallList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            self.render({});
        };
        MallList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-mallList");
            this.bindEvent();
        };
        MallList.prototype.bindEvent = function () {
        };
        MallList.prototype.renderDetail = function (data) {
        };
        MallList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return MallList;
    }(ChartBase));
    var RobotList = (function (_super) {
        __extends(RobotList, _super);
        function RobotList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.template = {
                "routerTemp": "robotListTemp",
                "detail": "robotListDetail"
            };
            $.extend(_this, props);
            return _this;
        }
        RobotList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            self.render({});
        };
        RobotList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-robotList");
            this.$add = this.$el.find(".addCurtain");
            this.bindEvent();
        };
        RobotList.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.messageCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认增加机器人弹幕", function (e) {
                    _load(true);
                    _resource.addRobot(JSON.stringify(self.getMessage(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("增加成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            window.laydate.render({
                elem: '.m-addContent .birthday',
                type: 'date',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
        };
        RobotList.prototype.renderDetail = function (data) {
        };
        RobotList.prototype.messageCheck = function ($JQ) {
            var tip = "", phone = $JQ.find(".phone").val();
            if (!$JQ.find(".nickname").val()) {
                tip = "请输入昵称";
            }
            else if (!$JQ.find(".sign").val()) {
                tip = "请输入签名";
            }
            else if (!phone) {
                if (/^\d*$/.test(phone)) {
                    tip = "请输入正确的手机号";
                }
                else {
                    tip = "请输入手机号";
                }
                ;
            }
            else if (!$JQ.find(".birthday").val()) {
                tip = "请选择生日日期";
            }
            else if (!$JQ.find(".reason").val()) {
                tip = "请输入推送内容";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        ;
        RobotList.prototype.getMessage = function ($JQ) {
            var option = {
                "name": $JQ.find(".nickname").val(),
                "sign": $JQ.find(".sign").val(),
                "sex": parseInt($JQ.find(".operation").val()),
                "text": $JQ.find(".reason").val(),
                "head_img": "",
                "phone": parseInt($JQ.find(".phone").val()),
                "birthday": 0,
                "token": this.mainView.mainView.token
            };
            var date = new Date($JQ.find(".birthday").val());
            option.birthday = parseInt((date.getTime() / 1000));
            return option;
        };
        RobotList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        RobotList.prototype.getFormReturn = function (e) {
            var data = e[0].contentWindow.document.body.innerText;
            if (data) {
                data = JSON.parse(data);
            }
            else {
                window.layer.msg("提交失败!");
            }
            ;
        };
        return RobotList;
    }(ChartBase));
    var InfoQuery = (function (_super) {
        __extends(InfoQuery, _super);
        function InfoQuery(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$question = null;
            _this.$detail = null;
            _this.template = {
                "routerTemp": "infoQueryTemp",
                "detail": "infoQueryDetail"
            };
            $.extend(_this, props);
            return _this;
        }
        InfoQuery.prototype.fetch = function (uid) {
            this.render();
        };
        InfoQuery.prototype.render = function () {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template(this.template.routerTemp, {}));
            this.$el = $(".m-infoQuery");
            this.$question = this.$el.find(".question");
            this.$detail = this.$el.find(".detail");
            this.bindEvent();
        };
        InfoQuery.prototype.bindEvent = function () {
        };
        InfoQuery.prototype.renderDetail = function (data) {
            this.$question.hide();
            this.$detail.show();
            this.$detail.find(".info-out").html(window.template(this.template.detail, data));
        };
        InfoQuery.prototype.search = function (query) {
            var self = this;
            if (/^\d*$/.test(query)) {
                _load(true);
                _resource.infoQuery(JSON.stringify({
                    "uid": parseInt(query),
                    "token": this.mainView.mainView.token
                }), function (data) {
                    self.renderDetail(data);
                    _load(false);
                });
            }
            else {
                this.$question.show();
                this.$detail.hide();
                window.layer.msg("请输入正确的用户编号");
            }
            ;
        };
        return InfoQuery;
    }(ChartBase));
    var MessageList = (function (_super) {
        __extends(MessageList, _super);
        function MessageList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.uid = 0;
            _this.template = {
                "routerTemp": "messageListTemp",
                "detail": "messageListDetail"
            };
            return _this;
        }
        MessageList.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.messageList(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "uid": this.uid,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    self.render(data);
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        MessageList.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu(true);
            header.setPlaceHolder("请输入用户编号");
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-messageList");
            this.$add = this.$el.find(".addMessage");
            this.$update = this.$el.find(".updateMessage");
            this.bindEvent();
        };
        MessageList.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.messageCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认增加消息", function (e) {
                    _load(true);
                    _resource.addMessage(JSON.stringify(self.getMessage(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("增加成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            window.laydate.render({
                elem: '.m-addContent .sendTime',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            window.laydate.render({
                elem: '.m-updateContent .sendTime',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            this.$add.find(".operation").on("change", function () {
                var $this = $(this);
                switch ($this.val()) {
                    case "0":
                        self.$add.find(".inputUid").hide().find(".uid").val("");
                        break;
                    case "1":
                        self.$add.find(".inputUid").show().find(".uid").focus();
                        break;
                }
                ;
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this), mid = parseInt($this.attr("mid"));
                window.layer.confirm("\u786E\u8BA4\u5220\u9664\u7F16\u53F7\u4E3A" + mid + "\u7684\u6D88\u606F\u4E48\uFF1F", function (e) {
                    _resource.deleteMessage(JSON.stringify({
                        "id": mid,
                        "token": self.mainView.mainView.token
                    }), function (data) {
                        $this.prop("disabled", true);
                        window.layer.msg("删除成功");
                        window.layer.close(e);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-update", function () {
                var $this = $(this), $tr = $this.parents("tr");
                self.showUpdateMessage(parseInt($this.attr("mid")), parseInt($this.attr("uid")), $tr.find(".mtime").text(), $tr.find(".mcontent").text());
            });
            this.$update.find(".btn-cancel").on("click", function () {
                _this.$update.removeClass("active");
                setTimeout(function () {
                    _this.$update.hide();
                }, 200);
            });
            this.$update.find(".operation").on("change", function () {
                var $this = $(this);
                switch ($this.val()) {
                    case "0":
                        self.$update.find(".inputUid").hide().find(".uid").val("");
                        break;
                    case "1":
                        self.$update.find(".inputUid").show().find(".uid").focus();
                        break;
                }
                ;
            });
            this.$update.on("click", ".btn-submit", function () {
                if (!self.messageCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateMeesage(JSON.stringify(self.getMessage(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
        };
        MessageList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        MessageList.prototype.messageCheck = function ($JQ) {
            var tip = "", uid = $JQ.find(".uid").val().replace(/\s/g, "");
            if ($JQ.find(".operation:checked").val() == "1" && (!uid || !/^\d*$/.test(uid))) {
                if (!uid) {
                    tip = "请输入用户编号";
                }
                else if (!/^\d*$/.test(uid)) {
                    tip = "请填写正确的用户编号";
                }
                ;
            }
            else if (!$JQ.find(".sendTime").val()) {
                tip = "请选择发送时间";
            }
            else if (!$JQ.find(".reason").val().replace(/\s/g, "")) {
                tip = "请填写消息内容";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        MessageList.prototype.getMessage = function ($JQ) {
            var option = null;
            if ($JQ.hasClass("addMessage")) {
                option = {
                    "uid": 0,
                    "content": "",
                    "send_time": 0,
                    "token": this.mainView.mainView.token
                };
            }
            else if ($JQ.hasClass("updateMessage")) {
                option = {
                    "id": parseInt($JQ.find(".mid").val()),
                    "uid": 0,
                    "content": "",
                    "send_time": 0,
                    "token": this.mainView.mainView.token
                };
            }
            ;
            switch ($JQ.find(".operation:checked").val()) {
                case "0":
                    option.uid = 0;
                    break;
                case "1":
                    option.uid = parseInt($JQ.find(".uid").val());
                    break;
            }
            ;
            var date = new Date($JQ.find(".sendTime").val());
            option.send_time = parseInt((date.getTime() / 1000));
            option.content = $JQ.find(".reason").val();
            return option;
        };
        MessageList.prototype.showUpdateMessage = function (mid, uid, send_time, content) {
            var _this = this;
            this.$update.show();
            setTimeout(function () {
                _this.$update.addClass("active");
            }, 10);
            this.initUpdateMessage(mid, uid, send_time, content);
        };
        MessageList.prototype.initUpdateMessage = function (mid, uid, send_time, content) {
            var $update = this.$update;
            $update.find(".mid").val(mid);
            switch (uid) {
                case 0:
                    $update.find(".operation:eq(0)").prop("checked", true).trigger("change");
                    break;
                default:
                    $update.find(".operation:eq(1)").prop("checked", true).trigger("change");
                    $update.find(".uid").val(uid);
                    break;
            }
            ;
            $update.find(".sendTime").val(send_time);
            $update.find(".reason").val(content);
        };
        ;
        MessageList.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        MessageList.prototype.search = function (query) {
            if (!/^\d*$/.test(query)) {
                window.layer.msg("请填写正确的用户编号");
            }
            else {
                if (query) {
                    this.uid = parseInt(query);
                }
                else {
                    this.uid = 0;
                }
                ;
                this.fetch(undefined, undefined);
            }
            ;
        };
        return MessageList;
    }(ChartBase));
    var SystemNotice = (function (_super) {
        __extends(SystemNotice, _super);
        function SystemNotice(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.$add = null;
            _this.$update = null;
            _this.template = {
                "routerTemp": "systemNoticeTemp",
                "detail": "systemNoticeDetail"
            };
            return _this;
        }
        SystemNotice.prototype.fetch = function (pageNo, pageSize) {
            if (pageNo === void 0) { pageNo = 1; }
            if (pageSize === void 0) { pageSize = _pageSize; }
            var self = this;
            _load(true);
            _resource.sNoticeList(JSON.stringify({
                "page_size": pageSize,
                "page_index": pageNo,
                "token": this.mainView.mainView.token
            }), function (data) {
                if (!self.$el) {
                    self.render(data);
                }
                else {
                    self.pading.setTotal(data.count);
                }
                ;
                self.renderDetail(data);
                _load(false);
            });
        };
        SystemNotice.prototype.render = function (data) {
            var header = this.mainView.mainView.header;
            header.showMenu();
            this.mainView.renderByChildren(window.template(this.template.routerTemp, data));
            this.$el = $(".m-systemNotice");
            this.$add = this.$el.find(".addNotice");
            this.$update = this.$el.find(".updateNotice");
            this.bindEvent();
        };
        SystemNotice.prototype.bindEvent = function () {
            var _this = this;
            var self = this;
            this.$add.find(".btn-reset").on("click", function () {
                _this.$add.find("form")[0].reset();
            });
            this.$add.find(".btn-submit").on("click", function () {
                if (!self.noticeCheck(self.$add)) {
                    return;
                }
                ;
                window.layer.confirm("是否确认增加公告", function (e) {
                    _load(true);
                    _resource.addSNotice(JSON.stringify(self.getNotice(self.$add)), function (data) {
                        self.$add.find(".btn-reset").click();
                        self.fetch();
                        window.layer.msg("增加成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            window.laydate.render({
                elem: '.m-addContent .startDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            window.laydate.render({
                elem: '.m-addContent .endDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            window.laydate.render({
                elem: '.m-updateContent .startDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            window.laydate.render({
                elem: '.m-updateContent .endDate',
                type: 'datetime',
                theme: '#42a5f5',
                format: 'yyyy-MM-dd HH:mm'
            });
            this.$add.find(".inter").on("input", function () {
                var $this = $(this), val = $this.val();
                if (/^\d*$/.test(val) && parseInt(val) > 0) {
                    $this.attr("old", $this.val());
                }
                else {
                    $this.val($this.attr("old"));
                    window.layer.tips('请输入大于0的正整数', self.$add.find(".inter")[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                }
                ;
            });
            this.$el.find(".detail").on("click", ".btn-delete", function () {
                var $this = $(this), nid = parseInt($this.attr("nid"));
                window.layer.confirm("\u786E\u8BA4\u5220\u9664\u7F16\u53F7\u4E3A" + nid + "\u7684\u516C\u544A\u4E48\uFF1F", function (e) {
                    _resource.deleteSNotice(JSON.stringify({
                        "id": nid,
                        "token": self.mainView.mainView.token
                    }), function (data) {
                        $this.prop("disabled", true);
                        window.layer.msg("删除成功");
                        window.layer.close(e);
                    });
                });
            });
            this.$el.find(".detail").on("click", ".btn-update", function () {
                var $this = $(this), $tr = $this.parents("tr");
                self.showUpdateNotice(parseInt($this.attr("nid")), $tr.find(".startDate").text(), $tr.find(".endDate").text(), parseInt($tr.find(".inter").text()), $tr.find(".ncontent").text());
            });
            this.$update.find(".btn-cancel").on("click", function () {
                _this.$update.removeClass("active");
                setTimeout(function () {
                    _this.$update.hide();
                }, 200);
            });
            this.$update.on("click", ".btn-submit", function () {
                if (!self.noticeCheck(self.$update)) {
                    return;
                }
                ;
                window.layer.confirm("确认更新消息么？", function (e) {
                    _load(true);
                    _resource.updateSNotice(JSON.stringify(self.getNotice(self.$update)), function (data) {
                        self.$update.find(".btn-cancel").click();
                        self.fetch(self.pading.pageNo, self.pading.pageSize);
                        window.layer.msg("更新成功");
                        window.layer.close(e);
                        _load(false);
                    });
                });
            });
            this.$update.find(".inter").on("input", function () {
                var $this = $(this), val = $this.val();
                if (/^\d*$/.test(val) && parseInt(val) > 0) {
                    $this.attr("old", $this.val());
                }
                else {
                    $this.val($this.attr("old"));
                    window.layer.tips('请输入大于0的正整数', self.$update.find(".inter")[0], {
                        tips: [1, '#FF9800'],
                        time: 2000
                    });
                }
                ;
            });
        };
        SystemNotice.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template(this.template.detail, data));
        };
        SystemNotice.prototype.noticeCheck = function ($JQ) {
            var tip = "", startDate = $JQ.find(".startDate").val(), endDate = $JQ.find(".endDate").val();
            if (!startDate) {
                tip = "请选择开始时间";
            }
            else if (!endDate) {
                tip = "请选择结束时间";
            }
            else if (startDate.replace(/\s|[-]|[:]/g, "") > endDate.replace(/\s|[-]|[:]/g, "")) {
                tip = "开始时间不能大于结束时间，请重新选择";
            }
            else if (!$JQ.find(".inter").val()) {
                tip = "请输入发送间隔";
            }
            else if (!$JQ.find(".reason").val().replace(/\s/g, "")) {
                tip = "请填写消息内容";
            }
            ;
            if (tip) {
                window.layer.msg(tip);
                return false;
            }
            ;
            return true;
        };
        SystemNotice.prototype.initAddNotice = function (isRender) {
            if (isRender === void 0) { isRender = false; }
            this.$add.find(".startDate,.endDate,.inter,.reason").val("");
            if (isRender) {
                this.fetch();
            }
            ;
        };
        SystemNotice.prototype.getNotice = function ($JQ) {
            var option = null;
            if ($JQ.hasClass("addNotice")) {
                option = {
                    "start_time": 0,
                    "end_time": "",
                    "interval": parseInt($JQ.find(".inter").val()),
                    "content": "",
                    "token": this.mainView.mainView.token
                };
            }
            else if ($JQ.hasClass("updateNotice")) {
                option = {
                    "id": parseInt($JQ.find(".nid").val()),
                    "start_time": 0,
                    "end_time": "",
                    "interval": parseInt($JQ.find(".inter").val()),
                    "content": "",
                    "token": this.mainView.mainView.token
                };
            }
            ;
            var date = new Date($JQ.find(".startDate").val());
            option.start_time = parseInt((date.getTime() / 1000));
            date = new Date($JQ.find(".endDate").val());
            option.end_time = parseInt((date.getTime() / 1000));
            option.content = $JQ.find(".reason").val();
            return option;
        };
        SystemNotice.prototype.showUpdateNotice = function (nid, startDate, endDate, inter, content) {
            var _this = this;
            this.$update.show();
            setTimeout(function () {
                _this.$update.addClass("active");
            }, 10);
            this.initUpdateMessage(nid, startDate, endDate, inter, content);
        };
        SystemNotice.prototype.initUpdateMessage = function (nid, startDate, endDate, inter, content) {
            var $update = this.$update;
            $update.find(".nid").val(nid);
            $update.find(".startDate").val(startDate);
            $update.find(".endDate").val(endDate);
            $update.find(".inter").val(inter).attr("old", inter);
            $update.find(".reason").val(content);
        };
        ;
        SystemNotice.prototype.changePading = function (pageNo, pageSize) {
            this.fetch(pageNo, pageSize);
        };
        return SystemNotice;
    }(ChartBase));
    _currentObject = new IndexMain();
    _currentObject.fetch();
}());
//# sourceMappingURL=charts.js.map