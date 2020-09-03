# vue-export-component-demo
Vue.js Export Component Demo

### Project setup
```bash
$ npm install
```

### Compiles and hot-reloads for development
```bash
$ npm run serve
```

### Compiles and minifies for production
```bash
$ npm run build
```

### Export Vue Components
각 서비스별 Vue 컴포넌트를 export 한다.<br>
`{SERVICE}` 항목에 해당 서비스명을 사용한다 (ex. sample).
```bash
$ npm run export:{SERVICE}
```

### Run your tests
[lintest](https://www.npmjs.com/package/@lintest/cli) 모듈을 사용하여 테스트 수행.<br>
> npm install -g \@lintest/cli
```bash
# test
$ npm run test
# test with watch
$ npm run test:watch
# generate test coverage data
$ npm run test:coverage
```

### Lints and fixes files
[lintest](https://www.npmjs.com/package/@lintest/cli) 모듈을 사용하며 린트 수행.<br>
> npm install -g \@lintest/cli
```bash
# lint
$ npm run lint
# lint with auto fix
$ npm run lint:fix
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
