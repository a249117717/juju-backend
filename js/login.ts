!(function(){
    let _currentObject:Login = null;

    // 登陆
    class Login {
        $el:JQuery<HTMLElement> = $(".g-login");

        constructor() {
            this.bindEventByOne();;
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
            // 登录
            this.$el.find(".btn-submit").on("click",() => {
                this.login();
            });

            // 密码输入框键盘点击事件
            this.$el.find(".pwd").on("keyup",(e) => {
                if(e.keyCode == 13) {
                    // 当用户在密码输入框按下回车键，则触发点击Login按钮
                    this.$el.find(".btn-submit").click();
                };             
            });
        }

        /**
         * 登录
         */
        login() {
            if(this.check()) {
                _load(true);
                
                _resource.login(JSON.stringify({
                    "username":this.$el.find(".user").val(),
                    "password":this.$el.find(".pwd").val()
                }),function(data:any){
                    if(data.code == 0) {
                        // 存储token
                        window.localStorage["jujuBackend"] = data.token;
                        // 去掉输入框焦点
                        $("input").blur();
                        (<any>window).layer.alert("登录成功",{
                            "closeBtn":0
                        },function(){
                            window.location.href = "charts.html";
                        });
                    } else {
                        (<any>window).layer.msg(data.msg);
                        _load(false);
                    };
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
            } else if(!$input.find(".pwd").val()) {
                str = "请输入密码";
            };

            if(str) {
                (<any>window).layer.msg(str);
                return false;
            } else {
                return true;
            };
        }
    }

    _currentObject = new Login();
    _currentObject.fetch();
}());