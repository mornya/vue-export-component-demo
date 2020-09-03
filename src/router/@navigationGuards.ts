import Vue from 'vue';
import { Route } from 'vue-router';
import { INavigationGuards } from '@mornya/vue-helper/dist/router';

export default <INavigationGuards<Vue>>{
  beforeEach (to: Route, from: Route, next: () => void): void { next(); },
  beforeResolve (to: Route, from: Route, next: () => void): void { next(); },
  afterEach (to: Route/*, from: Route*/): void {
    window.gtm && window.gtm.push({ event: 'nuxtRoute', pageType: 'PageView', pageUrl: to.fullPath });
    window.ga && window.ga('send', 'pageview', to.fullPath);

    // API로딩바 완료처리
    //window.app.$events.$emit('LOADING_PROGRESSBAR_FINISH')
  },
};
