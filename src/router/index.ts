import { createRouter, createWebHashHistory } from 'vue-router'
import RouterNames from './name'

const routes = [
  {
    path: '/',
    name: RouterNames.home,
    component: () => import('@/views/Home.vue')
  },


  {
    path: '/:catchAll(.*)',
    name: RouterNames.page404,
    component: () => import('@/views/Home.vue')
  }
]
export default createRouter({
  history: createWebHashHistory(),
  routes
})
