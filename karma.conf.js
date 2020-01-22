var webpackConfig = require('./webpack.config');
module.exports=function(config) {
config.set({
    module: {
      rules: [{
        test: /\.(js|jsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0'],
          },
        },
      }],
    },
    // конфигурация репортов о покрытии кода тестами
    coverageReporter: {
      dir:'tmp/coverage/',
      reporters: [
        { type:'html', subdir: 'report-html' },
        { type:'lcov', subdir: 'report-lcov' }
      ],
      instrumenterOptions: {
        istanbul: { noCompact:true }
      }
    },
    files: [
        'test/**/*.spec.ts'
    ],
    frameworks: [ 'chai', 'jasmine' ],
    reporters: ['mocha', 'coverage'],
    preprocessors: {
        'test/**/*.spec.ts': ['webpack', 'sourcemap']
    },
    plugins: [
        'karma-jasmine', 'karma-mocha',
        'karma-chai', 'karma-coverage',
        'karma-webpack', 'karma-phantomjs-launcher',
        'karma-mocha-reporter', 'karma-sourcemap-loader'
    ],
    // передаем конфигурацию webpack
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo:true
    }
  });
};