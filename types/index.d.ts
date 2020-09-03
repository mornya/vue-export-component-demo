import Vue from 'vue';
import { StoreOptions } from 'vuex';

declare global {
  interface Window {
    app: Record<never, any> & Vue;
    gtm: any;
    ga (command: 'send', hitType: 'pageview', page: string): void;
  }

  interface IStoreModule<S> extends StoreOptions<S> {
    namespaced?: boolean;
  }
}
