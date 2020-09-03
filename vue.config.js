const { ContextReplacementPlugin } = require('webpack')
const ForkTsCheckerWebpackPlugin = require('./node_modules/fork-ts-checker-webpack-plugin')

const args = process.argv.slice(2)
// analyzer 실행 여부 체크
const isAnalyze = args.filter(arg => arg === '--analyze').length
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  outputDir: 'dist',
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      css: {
        // css-loader
        // - development 환경에서는 style-loader 사용
        // - production 환경에서는 css-loader 사용
        sourceMap: false,
      },
      postcss: {
        // postcss-loader
        sourceMap: false,
        plugins: [
          // autoprefixer plugin: vue-cli 기본 적용이므로 cssnano 사용을 위해 overwrite
          require('./node_modules/autoprefixer'),
          // cssnano plugin: css/style 압축을 위해 적용 (development mode에서도 사용필요시 isProduction 조건제거)
          isProduction && require('cssnano'),
        ].filter(Boolean),
      },
      sass: {
        // sass-loader
        sourceMap: false,
        additionalData: `
          @import "@/assets/scss/_variables.scss";
        `.trim(),
        sassOptions: {},
      },
    },
  },
  pwa: {
    serviceWorker: true,
  },
  configureWebpack: config => {
    // production / development mode 에 따른 설정
    if (isProduction) {
      // 빌드 퍼포먼스 및 IE대응을 위해 (eval 관련 사용금지)
      config.devtool = false/*'source-map'*/
      // Ignoring unused locales in 'moment' dependency
      config.plugins.push(new ContextReplacementPlugin(/moment[/\\]locale$/, /ko/))
    } else {
      config.devtool = 'cheap-module-source-map'
    }

    // build performance 설정
    config.plugins = config.plugins.map(plugin => {
      if (!!plugin && plugin instanceof ForkTsCheckerWebpackPlugin) {
        const os = require('os')
        const totalMem = Math.floor(os.totalmem() / 1048576) // get OS mem size as MB (totalMem/1024/1024)
        const eslintConfig = process.env.VUE_APP_BUILD_ENV !== 'local' ? {} : {
          eslint: true,
          eslintOptions: require('./node_modules/.cache/lintest/info.json').eslintOptions,
        }
        const nextOption = {
          ...plugin.options,
          ...eslintConfig, // 빌드시 eslint 룰셋 적용한 lint 실행
          workers: 1, // workers는 1일 때 best performance (os.cpus().length),
          // 젠킨스 등 빌드서버 메모리가 작을 경우를 대비, 사용가능 메모리가 2048MB로 고정되어있는 설정 변경함
          memoryLimit: totalMem > 4096 ? 2048 : 1024,
          measureCompilationTime: true,
          ignoreLintWarnings: isProduction,
        }
        return new ForkTsCheckerWebpackPlugin(nextOption)
      } else {
        return plugin
      }
    })

    // import 경로에 /src를 기본 경로로 포함
    //config.resolve.modules.unshift(appPath.src)

    // npm link로 라이브러리 테스트시 false로 설정 필요
    if (process.env.VUE_APP_LIBRARY_TEST_MODE === 'true') {
      config.resolve.symlinks = false
    }

    // Webpack-bundle-analyzer plugin
    if (isAnalyze) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: 'localhost',
        analyzerPort: '8888',
        openAnalyzer: true,
      }))
    }

    // Fix: HMR maximum call stack size exceeded error
    let isFilteredFirstHMR = false
    config.plugins = config.plugins.filter(plugin => {
      if (plugin.constructor.name === 'HotModuleReplacementPlugin' && !isFilteredFirstHMR) {
        isFilteredFirstHMR = true
        return false
      }
      return true
    })
  },
  devServer: {
    allowedHosts: [],
    disableHostCheck: true,
    https: false,
    // proxyTable 설정
    proxy: {
      '^/auth': {
        target: process.env.VUE_APP_API_URI,
        changeOrigin: true,
        secure: false,
      },
      '^/mock/admin': {
        target: process.env.VUE_APP_MOCK_URI,
        pathRewrite: { '^/mock/admin': '' },
        changeOrigin: true,
        secure: false,
      },
    },
    overlay: {
      warnings: false,
      errors: process.env.VUE_APP_BUILD_ENV === 'local',
    },
  },
}
