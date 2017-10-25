var gulp = require("gulp"),
minifyCss = require("gulp-clean-css"),
uglify = require("gulp-uglify"),
ejs = require('gulp-ejs'),
livereload = require("gulp-livereload");
var webServer = require("gulp-webserver")
// gulp-sass
// gulp-webserver

// 定义任务，压缩CSS
gulp.task("css", function(){
gulp.src("src/public/stylesheets/style.css")
    .pipe(minifyCss())
    .pipe(gulp.dest("dist/public/stylesheets"));
});

// 定义任务，压缩js
gulp.task("js", ()=>{
gulp.src("**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/routes","dist/utils"));
});
//定义任务，压缩ejs
gulp.task("ejs",()=>{
    gulp.src("src/views/*.ejs")
        .pipe(ejs())
        .pipe(gulp.dest("dist/views"))
});

gulp.task("webServer",function(){
	gulp.src("./")      //表示当前文件夹
	.pipe(webServer({
		livereload:true,    // 浏览器自动刷新，更新数据，类似热替换
		port:3000,          // 自定义端口号
		host:"127.0.0.1",    // 主机,可以更换成电脑IP
		directoryListing:{   // 要不要在浏览器中显示你开发环境得项目目录,便于开发使用，如果上线，就必须设置为false
			enable:true ,     //true 显示 默认false
			path:"./"         //作用的文件目录范围
		}
	}))
})

// 配置监视任务
// gulp.task("watch", function() {
//     livereload.listen();
//     // 监听到 .scss 文件的修改，自动编译
//     gulp.watch("src/views/*.ejs",["ejs"]);
//     // 监听到 css 文件修改，自动压缩
//     gulp.watch("src/public/stylesheets/style.css", ["css"]);

//     gulp.watch("**/*.js",["js"])//匹配当前目录及其子目录下所有文件
// });


// gulp.task('default',[]);

// gulp.task("csehi",[]);

// gulp.task("develop",[]);