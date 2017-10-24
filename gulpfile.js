var gulp = require("gulp"),
minifyCss = require("gulp-clean-css"),
uglify = require("gulp-uglify"),
ejs = require('gulp-ejs'),
browserSync = require("browser-sync");

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
})



// 配置监视任务
gulp.task("watch", function() {
    // 监听到 .scss 文件的修改，自动编译
    gulp.watch("src/views/*.ejs",["ejs"]);
    // 监听到 css 文件修改，自动压缩
    gulp.watch("src/public/stylesheets/style.css", ["css"]);

    gulp.watch("**/*.js",["js"])//匹配当前目录及其子目录下所有文件
});