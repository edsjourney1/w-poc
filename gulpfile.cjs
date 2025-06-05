const clean = require('gulp-clean');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const pipeline = require('readable-stream').pipeline;
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const yaml = require('js-yaml');

const devBlockScssPath = './src/blocks/**/*.scss';
const globalCSSPath = ['./src/styles/**/*.scss', '!./src/styles/include/**/*.scss'];
const devBlockJSPath = ['./src/blocks/**/*.js', '!./src/blocks/**/*.test.js'];
const globalScriptsPath = ['./src/scripts/**/*.js', '!./src/scripts/**/*.test.js'];

const deletePaths = ['blocks', 'scripts', 'styles', 'coverage', 'src/coverage'];

const htmlHeadTarget = './head.html';
const toolsJSarget = './src/scripts/tools.js';
const mfaJSarget = './src/blocks/header/login-urls.js';
const externalImageTarget = './src/scripts/externalImage.js';
const envJSTarget = './src/scripts/env.js';

let currentEnv = (process.env.WMK_ENV || 'develop').trim();
let dtmURL = '';
let marketo;
let user;
let portals;
let damApi = '';
let envObject = [];
let loginDetails;

let environments;

const replaceText = (regex, replacedStr, defaultStr) =>
  replace(regex, function handleReplace(match, p1, offset, string) {
    if (match) {
      return replacedStr;
    }
    return defaultStr;
  });

try {
  environments = yaml.load(fs.readFileSync('./env.yaml', 'utf8'));
  const doc = environments.env.find((item) => item.key === currentEnv);
  damApi = doc.dam;
  dtmURL = doc.dtm;
  marketo = doc.marketo;
  user = doc.user;
  portals = doc.portals;
  portals.not_found = '#';

  loginDetails = {
    authUrl: user.auth,
    mfaTrue: user.mfaTrue,
    mfaFalse: user.mfaFalse,
    mfaNA: user.mfaNA,
    loginApiUrl: user.login,
    loginFailApiUrl: user.loginFail,
    cookieApiUrl: user.cookie,
    logoutApiUrl: user.logout,
    recaptchaSiteKey: user.recaptcha,
    profileApiUrl: user.profile,
    portals,
  };

  environments.env.forEach((item) => {
    envObject.push({
      domain: item.domain,
      dynatrace: item.dynatrace,
      munchkin: item.munchkin,
      qualtrics: item.qualtrics,
      qualtricsID: item.qualtricsID,
      rum: item.rum,
    });
  });
} catch (e) {
  console.log(e);
}

gulp.task('clean', () => gulp.src(deletePaths, { read: false, allowEmpty: true }).pipe(clean()));

gulp.task('inject:recaptcha', () =>
  gulp
    .src([htmlHeadTarget])
    .pipe(
      replaceText(
        /<!-- inject:recaptcha -->\s*([\s\S]*?)\s*<!-- endinject -->/gim,
        `<!-- inject:recaptcha -->
<script src="https://www.google.com/recaptcha/api.js?render=${user.recaptcha}"></script>
<!-- endinject -->`,
        `<!-- inject:recaptcha --><!-- endinject -->`,
      ),
    )
    .pipe(gulp.dest('./')),
);

gulp.task('inject:dtm', () =>
  gulp
    .src([htmlHeadTarget])
    .pipe(
      replaceText(
        /<!-- inject:dtm -->\s*([\s\S]*?)\s*<!-- endinject -->/gim,
        `<!-- inject:dtm -->
<script src='${dtmURL}'></script>
<!-- endinject -->`,
        `<!-- inject:dtm --><!-- endinject -->`,
      ),
    )
    .pipe(gulp.dest('./')),
);

gulp.task('inject:marketo-head', () =>
  gulp
    .src([htmlHeadTarget])
    .pipe(
      replaceText(
        /<!-- inject:marketo -->\s*([\s\S]*?)\s*<!-- endinject -->/gim,
        `<!-- inject:marketo -->
<script src='${marketo.src1}'></script>
<script src='${marketo.src3}' id='${marketo.src3Id}'></script>
<script src='${marketo.src4}' id='${marketo.src4Id}'></script>
<!-- endinject -->`,
        `<!-- inject:marketo --><!-- endinject -->`,
      ),
    )
    .pipe(gulp.dest('./')),
);

gulp.task('inject:envJSTarget-js', () =>
  gulp
    .src([envJSTarget])
    .pipe(
      replaceText(
        /\/\* inject:envscripts \*\/\s*([\s\S]*?)\s*\/\* endinject \*\//gim,
        `/* inject:envscripts */
const envObj = ${JSON.stringify(envObject)} || {};
/* endinject */`,
        `/* inject:envscripts *//* endinject */`,
      ),
    )
    .pipe(gulp.dest('./src/scripts')),
);

gulp.task('inject:dam-js', () =>
  gulp
    .src([externalImageTarget])
    .pipe(
      replaceText(
        /\/\* inject:dam-js \*\/\s*([\s\S]*?)\s*\/\* endinject \*\//gim,
        `/* inject:dam-js */
      const damURL = '${damApi}';
      /* endinject */`,
        `/* inject:dam-js *//* endinject */`,
      ),
    )
    .pipe(gulp.dest('./src/scripts')),
);

gulp.task('inject:marketo-js', () =>
  gulp
    .src([toolsJSarget])
    .pipe(
      replaceText(
        /\/\* inject:marketo \*\/\s*([\s\S]*?)\s*\/\* endinject \*\//gim,
        `/* inject:marketo */
      window.MktoForms2.loadForm('${marketo.js1}', '${marketo.js1Id}', formId);
      /* endinject */`,
        `/* inject:marketo *//* endinject */`,
      ),
    )
    .pipe(gulp.dest('./src/scripts')),
);

gulp.task('inject:login-api', () =>
  gulp
    .src([mfaJSarget])
    .pipe(
      replaceText(
        /\/\* inject:mfaurls \*\/\s*([\s\S]*?)\s*\/\* endinject \*\//gim,
        `/* inject:mfaurls */
const loginURLs = '${JSON.stringify(loginDetails)}';
/* endinject */`,
        `/* inject:mfaurls *//* endinject */`,
      ),
    )
    .pipe(gulp.dest('./src/blocks/header')),
);

gulp.task('buildBlockStyles', () =>
  gulp
    .src(devBlockScssPath)
    .pipe(
      sass({
        style: 'compressed',
        silenceDeprecations: [
          'legacy-js-api',
          'mixed-decls',
          'import',
          'color-functions',
          'global-builtin',
        ],
      }).on('error', sass.logError),
    )
    .pipe(gulp.dest('./blocks')),
);

gulp.task('buildGlobalStyles', () =>
  gulp
    .src(globalCSSPath)
    .pipe(
      sass({
        style: 'compressed',
        silenceDeprecations: [
          'legacy-js-api',
          'mixed-decls',
          'import',
          'color-functions',
          'global-builtin',
        ],
      }).on('error', sass.logError),
    )
    .pipe(gulp.dest('./styles')),
);

gulp.task('buildBlocksJS', (cb) =>
  pipeline(gulp.src(devBlockJSPath), uglify(), gulp.dest('./blocks'), cb),
);

gulp.task('buildGlobalJS', (cb) =>
  pipeline(gulp.src(globalScriptsPath), uglify(), gulp.dest('./scripts'), cb),
);

gulp.task('watch', () => {
  gulp.watch(devBlockScssPath, gulp.series('buildBlockStyles'));
  gulp.watch(globalCSSPath, gulp.series('buildGlobalStyles'));
  gulp.watch(devBlockJSPath, gulp.series('buildBlocksJS'));
  gulp.watch(globalScriptsPath, gulp.series('buildGlobalJS'));
});

gulp.task(
  'build',
  gulp.series(
    'inject:recaptcha',
    'inject:envJSTarget-js',
    'inject:dam-js',
    'inject:dtm',
    'inject:marketo-head',
    'inject:marketo-js',
    'inject:login-api',
    'clean',
    'buildBlockStyles',
    'buildGlobalStyles',
    'buildBlocksJS',
    'buildGlobalJS',
  ),
);

gulp.task(
  'default',
  gulp.series(
    'inject:recaptcha',
    'inject:envJSTarget-js',
    'inject:dam-js',
    'inject:dtm',
    'inject:marketo-head',
    'inject:marketo-js',
    'inject:login-api',
    'buildBlockStyles',
    'buildGlobalStyles',
    'buildBlocksJS',
    'buildGlobalJS',
    'watch',
  ),
);
