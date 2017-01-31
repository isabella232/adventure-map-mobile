// Karma configuration
// Generated on Mon Jan 30 2017 16:18:13 GMT+0200 (SAST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '../www/lib/ionic/js/ionic.bundle.js',
      '../www/lib/angular-mocks/angular-mocks.js',
      '../www/js/**/*.js',
      'specs/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      '../www/js/**/*.js': ['coverage']
    },
    reporters: ['mocha', 'coverage', 'progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    plugins: [
      'karma-coverage',
      'karma-mocha-reporter',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],
    singleRun: false,
    concurrency: Infinity,
    coverageReporter: {
      type : 'html',
      dir : '../coverage/'
    }
  });
};
