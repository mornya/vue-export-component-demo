import { VueConstructor } from 'vue';
import { PluginObject, PluginFunction } from 'vue/types/plugin';
import Vuex from 'vuex';
import { DynamicLoad } from '@mornya/dynamic-load-libs';
import root from '@/store';

type KeyValue<T> = {
  [key: string]: T;
};
type KeyValueComponent = KeyValue<VueConstructor['component']>;
type KeyValuePlugins<T = any> = {
  plugin: PluginObject<T> | PluginFunction<T>;
  options?: T;
};

interface IExporterOptions {
  name: string;
  components?: KeyValueComponent;
  plugins?: KeyValuePlugins[];
}

// Setup Vue, Vuex and components
function setup (Vue: VueConstructor, options: IExporterOptions) {
  // use components
  if (options.components) {
    for (const [key, value] of Object.entries(options.components)) {
      Vue.component(key, value);
    }
  }

  // use plugins
  Vue.use(Vuex); // vuex default
  // additional plugins
  if (options.plugins) {
    for (const plugin of options.plugins) {
      Vue.use(plugin.plugin, plugin.options);
    }
  }

  // store 등에서 vm을 접근할 수 있게 하기 위해 window 객체에 vue 인스턴스 저장
  window[options.name] = new Vue({
    store: new Vuex.Store(root || {}),
  }).$mount(`#${options.name}`);
}

export function exporter (options: IExporterOptions) {
  // Dynamic load Vue
  const Vue = (window || global || {}).Vue;
  if (!Vue) {
    DynamicLoad.script({
      id: `${options.name}-deps-vue`,
      src: 'https://unpkg.com/vue@2.6.11/dist/vue.min.js',
      crossOrigin: 'anonymous',
    }).then(() => setup(window.Vue, options)).catch();
  } else {
    setup(Vue, options);
  }
}
