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
define(["text!model/chart/views/userListTemp.html", "text!model/chart/views/systemNoticeDetail.html"], function (userListTemp, userListDetail) {
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