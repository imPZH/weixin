const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglyfly = require('gulp-uglyfly');


gulp.task( 'clean', () => {
    return del([
        'dist/js/*'
    ])
});

gulp.task( 'js', ['clean'], () => {
    return gulp.src('public/js/*.js')
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(uglyfly())
            .pipe(gulp.dest('dist/js'));
});

gulp.task( 'default', ['js'], ()=>{});