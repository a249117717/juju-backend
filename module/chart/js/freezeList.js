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
define(["text!model/chart/views/freezeListTemp.html", "text!model/chart/views/freezeListDetail.html"], function (freezeListTemp, freezeListDetail) {
    var FreezeList = (function (_super) {
        __extends(FreezeList, _super);
        function FreezeList(props) {
            var _this = _super.call(this, props) || this;
            _this.$el = null;
            _this.template = {
                "routerTemp": freezeListTemp,
                "detail": freezeListDetail
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
            this.mainView.renderByChildren(window.template.compile(this.template.routerTemp)(data));
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
            this.$el.find(".info").html(window.template.compile(this.template.detail)(data));
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
    return FreezeList;
});
//# sourceMappingURL=freezeList.js.map