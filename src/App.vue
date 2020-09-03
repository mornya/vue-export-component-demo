<template>
  <router-view/>
</template>

<script>
import { mapActions } from 'vuex'
import { axiosDefaultConfig } from '@mornya/restful-libs'

export default {
  name: 'App',
  watch: {
    async $route (nextRoute, prevRoute) {
      // 최초 진입을 제외한 라우트 이동시
      if (prevRoute.fullPath !== '/' && prevRoute.fullPath !== nextRoute.fullPath) {
        await this.CANCEL_API_REQUEST() // API 호출 중지
      }
    },
  },
  created () {
    axiosDefaultConfig({
      defaults: {
        baseURL: process.env.VUE_APP_BUILD_ENV === 'local' ? '' : process.env.VUE_APP_API_URI,
        timeout: this.$env.isProduction ? 5000 : 10000,
      },
      isShowLog: process.env.NODE_ENV === 'development',
      onRequest: (/*config, currReqs*/) => { this.$events.$emit('LOADING_PROGRESSBAR_START') },
      onResponse: (/*response, currReqs*/) => { this.$events.$emit('LOADING_PROGRESSBAR_FINISH') },
      onRequestError: (/*error, currReqs*/) => {
        this.$events.$emit('LOADING_PROGRESSBAR_FAIL')
        this.$events.$emit('LOADING_FINISH')
      },
      onResponseError: (/*error, currReqs*/) => {
        this.$events.$emit('LOADING_PROGRESSBAR_FAIL')
        this.$events.$emit('LOADING_FINISH')
      },
      onInvalidate: (which, error) => {
        // response data는 error.response.data로 확인
        console.info(`${which} error`)
        console.error(error.response.data.message ?? error.message)
      },
    })
  },
  methods: {
    ...mapActions({
      CANCEL_API_REQUEST: 'cancelApiRequest',
    }),
  },
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
