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
define(["text!module/chart/views/userListTemp.html", "text!module/chart/views/userListDetail.html"], function (userListTemp, userListDetail) {
    var UserList = (function (_super) {
        __extends(UserList, _super);
        function UserList(props) {
            var _this = _super.call(this, props) || this;
            _this.$currentForzen = null;
            _this.$el = null;
            _this.template = {
                "routerTemp": userListTemp,
                "detail": userListDetail
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
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
            this.$el = $(".m-userList");
            this.bindEvent();
        };
        UserList.prototype.bindEvent = function () {
            var self = this;
            this.$el.find(".info").on("click", ".btn-freeze", function () {
                var $this = $(this), $td = $this.parent("td");
                self.$currentForzen = $this;
                self.mainView.mainView.frozenInfo.show(parseInt($td.attr("uid")), $td.attr("uname"), self);
            });
            this.$el.find(".info").on("click", ".btn-diamond", function () {
                var $td = $(this).parent("td");
                self.mainView.mainView.givDiamond.show(parseInt($td.attr("uid")));
            });
            this.$el.find(".info").on("click", ".btn-system", function () {
                var $this = $(this), $td = $(this).parent("td");
                if ($this.hasClass("btn-red")) {
                    window.layer.confirm("\u662F\u5426\u8BBE\u7F6E\u7F16\u53F7" + $td.attr("uid") + "\u7684\u73A9\u5BB6\u4E3A\u975E\u7CFB\u7EDF\u7528\u6237\uFF1F", function (e) {
                        _resource.setSystemUser(JSON.stringify({
                            "uid": parseInt($td.attr("uid")),
                            "is_sys_user": 0,
                            "token": self.mainView.mainView.token
                        }), function () {
                            window.layer.msg("设置成功");
                            $this.removeClass("btn-red").text("设置权限");
                            window.layer.close(e);
                        });
                    });
                }
                else {
                    window.layer.confirm("\u662F\u5426\u8BBE\u7F6E\u7F16\u53F7" + $td.attr("uid") + "\u7684\u73A9\u5BB6\u4E3A\u7CFB\u7EDF\u7528\u6237\uFF1F", function (e) {
                        _resource.setSystemUser(JSON.stringify({
                            "uid": parseInt($td.attr("uid")),
                            "is_sys_user": 1,
                            "token": self.mainView.mainView.token
                        }), function () {
                            window.layer.msg("设置成功");
                            $this.addClass("btn-red").text("取消权限");
                            window.layer.close(e);
                        });
                    });
                }
                ;
            });
        };
        UserList.prototype.renderDetail = function (data) {
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
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
    return UserList;
});
//# sourceMappingURL=userList.js.map