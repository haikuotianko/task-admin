import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      showTab: true
    },
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/taskList',
    name: 'taskList',
    component: () => import(/* webpackChunkName: "TaskList" */ '../views/TaskList.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
