import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const createStore = () => new Vuex.Store({
  // 使用函数，避免数据污染
  state () {
    return {
      posts: []
    }
  },
  mutations: {
    setPosts (state, posts) {
      state.posts = posts
    }
  },
  actions: {
    // 在服务端渲染期间，务必让 actions 返回一个 Promise
    async getPosts ({ commit }) {
      const { data } = await axios({
        method: 'GET',
        url: 'https://cnodejs.org/api/v1/topics'
      })
      commit('setPosts', data.data)
    }
  }
})