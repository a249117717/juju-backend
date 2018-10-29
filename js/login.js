_resource = {
    "login": {
        "url": _domain + "/v1/backend/public/login"
    }
};
(function () {
    var _currentObject = null;
    var Login = (function () {
        function Login() {
            this.$el = $(".g-login");
            this.bindEventByOne();
            ;
        }
        Login.prototype.fetch = function () {
            _conversionAjax(_resource);
            this.render();
        };
        Login.prototype.render = function () {
            this.bindEvent();
        };
        Login.prototype.bindEvent = function () {
        };
        Login.prototype.bindEventByOne = function () {
            var _this = this;
            var self = this;
            this.$el.find(".btn-submit").on("click", function () {
                self.login();
                $(this).blur();
            });
            this.$el.find(".pwd").on("keyup", function (e) {
                if (e.keyCode == 13) {
                    _this.$el.find(".btn-submit").click();
                    $("input:focus").blur();
                }
                ;
            });
        };
        Login.prototype.login = function () {
            if (this.check()) {
                _load(true);
                _resource.login(JSON.stringify({
                    "username": this.$el.find(".user").val(),
                    "password": this.$el.find(".pwd").val()
                }), function (data) {
                    if (data.code == 0) {
                        window.localStorage["jujuBackend"] = data.token;
                        window.layer.alert("登录成功", {
                            "closeBtn": 0
                        }, function () {
                            window.location.href = "charts.html";
                        });
                    }
                    else {
                        window.layer.msg(data.msg);
                        _load(false);
                    }
                    ;
                });
            }
            ;
        };
        Login.prototype.check = function () {
            var $input = this.$el.find(".input-group"), str = "";
            if (!$input.find(".user").val()) {
                str = "请输入用户名";
            }
            else if (!$input.find(".pwd").val()) {
                str = "请输入密码";
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
        return Login;
    }());
    _currentObject = new Login();
    _currentObject.fetch();
}());
//# sourceMappingURL=login.js.map