var readline = require("readline"),
gulp = require("gulp"),
uglify = require("gulp-uglify"),    // 压缩js
minifyCss = require("gulp-minify-css"),   // 压缩css
minifyHtml = require("gulp-minify-html"),   // 压缩html
imagemin = require('gulp-imagemin'),    // 压缩图片
pngquant = require('imagemin-pngquant'),    // png压缩
rename = require("gulp-rename"), // 重命名
replace = require("gulp-replace"),  // 替换
rimraf = require('rimraf'), // 删除文件夹
fs = require("fs"); // 文件类

const rl = readline.createInterface({
  input: process.stdin, // 键盘输入到缓存区的内容
  output: process.stdout
});

gulp.task("default",function(){
    // rl.question('输入需要压缩的项目路径：', (src) => {
        // exists("E:/nmoa/webApp/module/meeting");
        // minify("C:/Users/sam/Desktop/demo");
    //     rl.close();
    // });

    exists("E:/star-backstage");
});

/**
 * 复制文件(将相应项目下面的文件全复制)
 * @param {string} src [项目路径]
 * @param {string} dst [目标路径]
 */
function copyFile(src,dst) {
    fs.readdir(src,function(err,paths) {
        if(err) {   // 抛出异常
            throw err;
        };

        paths.forEach(function(path){   // 复制项目
            var _src=src+'/'+path,
            _dst=dst+'/'+path,
            readable,
            writable;
            
            fs.stat(_src,function(err,st){
                if(err){
                    throw err;
                };
                
                if(st.isFile()){    // 如果是文件，则直接拷贝
                    var _dstDir = _dst.substr(0,_dst.lastIndexOf("/"));
                    if(/.js$/.test(_src)) { // 压缩js
                    // if(/[^min].js$/.test(_src)) { // 压缩js
                        gulp.src(_src)
                        .pipe(uglify())
                        // .pipe(rename(_dstDir + _dst.substring(_dst.lastIndexOf("/"),_dst.lastIndexOf(".js")) + ".min.js"))  // 变更为压缩名字
                        .pipe(gulp.dest(_dstDir));   
                    } else if(/.css$/.test(_src)) { // 压缩css
                    // } else if(/[^min].css$/.test(_src)) { // 压缩css
                        gulp.src(_src)
                        .pipe(minifyCss())
                        // .pipe(rename(_dstDir + _dst.substring(_dst.lastIndexOf("/"),_dst.lastIndexOf(".css")) + ".min.css"))    // 变更为压缩名字
                        .pipe(gulp.dest(_dstDir));
                    } else if(/.html$/.test(_src)){  // 压缩html
                        gulp.src(_src)
                        // .pipe(replace(/\<(script|link).*\>/g,function(match){
                        //     if(~match.indexOf("nouglify")) {
                        //         return match;
                        //     } else {
                        //         return match.replace(/(\.min)?\.(css|js)/,".min.$2");
                        //     };
                        // }))
                        .pipe(minifyHtml({
                            removeComments: true, //清除HTML注释
                            removeEmptyAttributes: true, // 删除所有空格作为属性值
                            minifyJS: true,  // 压缩页面中的js
                            minifyCSS: true //压缩页面CSS
                        }))
                        .pipe(gulp.dest(_dstDir));
                    } else if(/.png$/.test(_src)){  // 压缩图片
                        gulp.src(_src)
                        .pipe(imagemin({
                            progressive: true,
                            use: [pngquant()] //使用pngquant来压缩png图片
                        }))
                        .pipe(gulp.dest(_dstDir));
                    } else if(!/.(scss)|(psd)|(ts)|(psd)|(map)|(md)|(json)|(DS_Store)$/.test(_src)) {
                        readable = fs.createReadStream(_src);//创建读取流
                        writable = fs.createWriteStream(_dst);//创建写入流
                        readable.pipe(writable);
                    };
                } else if(st.isDirectory()){    // 如果是文件夹，则创建一个同名文件夹
                    if(!/(.git)|(node_modules)/.test(path)) {
                        fs.mkdir(_dst);

                        if(/(lib)/.test(path)) {
                            onlyCopy(_src,_dst);
                        } else {
                            copyFile(_src,_dst);
                        };
                    };
                };
            });
        });
    });
};

/**
 * 仅复制，不压缩文件
 * @param {string} src [项目路径]
 * @param {string} dst [目标路径]
 */
function onlyCopy(src,dst) {
    fs.readdir(src,function(err,paths) {
        if(err) {   // 抛出异常
            throw err;
        };

        paths.forEach(function(path){   // 复制项目
            var _src=src+'/'+path,
            _dst=dst+'/'+path,
            readable,
            writable;
            
            fs.stat(_src,function(err,st){
                if(err){
                    throw err;
                };
                
                if(st.isFile()){    // 如果是文件，则直接拷贝
                    readable = fs.createReadStream(_src);//创建读取流
                    writable = fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                } else if(st.isDirectory()){    // 如果是文件夹，则创建一个同名文件夹
                    fs.mkdir(_dst);
                    onlyCopy(_src,_dst);
                };
            });
        });
    });
}

/**
 * 校验某个路径是否存在
 * @param {string} src [项目路径]
 */
function exists(src) {
    var dst = "C:/Users/sam/Desktop";
    dst += src.substring(src.lastIndexOf("/"));

    // 校验路径是否有效
    fs.stat(src,function(err,stats){
        if(err) {
            console.log("项目路径");
            throw err;
        };
        
        fs.stat(dst,function(err,stats){
            if(err) {// 目标文件夹已经存在，则删除
                fs.mkdir(dst);
                copyFile(src,dst);
                return;
            };

            rimraf(dst,function(err){
                fs.mkdir(dst);
                copyFile(src,dst);
            });

        });
    });
};