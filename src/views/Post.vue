<template>
  <div>
    <h1>Post List</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Post',
  metaInfo: {
    title: 'Post'
  },
  data () {
    return {
      // posts: []
    }
  },
  computed: {
    ...mapState(['posts'])
  },
  methods: {
    ...mapActions(['getPosts'])
  },
  // vue SSR 为服务端渲染提供的生命周期钩子函数
  // 在渲染之前进行调用
  // 必须返回 Promise
  serverPrefetch () {
    return this.getPosts()
  }
}
</script>

<style>

</style>