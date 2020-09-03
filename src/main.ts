import Vue, { ComponentOptions, CreateElement, VNode } from 'vue';
import { DefaultData } from 'vue/types/options';
import Vuex from 'vuex';
import { Platform } from '@mornya/platform-libs';
import { Maintainer } from '@mornya/vue-helper';
import plugins from '@/plugins'; // maintainer
import routes from '@/router'; // maintainer
import navigationGuards from '@/router/@navigationGuards'; // maintainer
import root from '@/store'; // maintainer
import '@/assets/scss/_reset.scss';
// 순서주의: 스타일 로딩 후 앱 로드
import App from '@/App.vue';

// ========== Maintainer ===========
const { buildEnv, router, store } = Maintainer.initialize(Vue, {
  showLogEnvs: ['local', 'dev', 'stg', 'qa'],
  // 라우터 등록
  router: {
    navigationGuards,
    routes,
    fallback: {
      // fallback to 404
      path: '/*',
      name: 'application.404',
      component: () => import(/* webpackChunkName: "application.404" */ '@/views/PageNotFound.vue'),
    },
    option: {
      scrollBehavior () {
        return { x: 0, y: 0 };
      },
    },
  },
  // 스토어 등록
  store: {
    vuex: Vuex,
    root,
  },
  // 플러그인 등록
  plugins: plugins as any,
  // 서비스워커 등록
  serviceWorker: process.env.NODE_ENV === 'production' ? {
    base: '/',
    file: 'service-worker.js',
  } : null,
  // 필터 정의
  filter: {},
  // 프로토타입 정의 (정상 처리되지만 IDE 미인식으로 사용안함)
  prototype: null,
  // 공통 사용 컴포넌트 등록 (정상 처리되지만 IDE 미인식으로 사용안함)
  component: null,
});
// ========== Maintainer ===========

// 프로토타입 정의
Vue.config.productionTip = false;
Vue.prototype.$appName = process.env.VUE_APP_NAME_FULL;
Vue.prototype.$appDesc = process.env.VUE_APP_DESCRIPTION;
Vue.prototype.$env = buildEnv; // Maintainer에서 Vue.prototype.$env 설정됨.
Vue.prototype.$platform = Platform.getInfo(navigator.userAgent);

console.log(
  `\n%c${process.env.VUE_APP_NAME_FULL}\n`,
  'margin-bottom:4px;color:#1ab394;font-size:14px;font-weight:bold;line-height:1.2em;border-bottom:2px solid #1ab394',
);
if (process.env.NODE_ENV !== 'production') {
  console.log('Environment variables: ', process.env);
}

window.app = new Vue({
  router,
  store,
  render: (h: CreateElement): VNode => h(App),
} as ComponentOptions<Vue, DefaultData<Vue>>).$mount('#app');
