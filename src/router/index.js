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
    path: '/taskList', // 任务列表
    name: 'taskList',
    meta: {
      showTab: true
    },
    component: () => import(/* webpackChunkName: "TaskList" */ '../views/TaskList.vue')
  },
  {
    path: '/taskFeedback/:id', // 任务反馈
    name: 'taskFeedback',
    component: () => import(/* webpackChunkName: "TaskList" */ '../views/TaskFeedback.vue')
  },
  {
    path: '/TaskItemDetails/:id', // 任务详情
    name: 'TaskItemDetails',
    component: () => import(/* webpackChunkName: "TaskList" */ '../views/TaskItemDetails.vue')
  },
  {
    path: '/workOrder', // 工单
    name: 'workOrder',
    meta: {
      showTab: true
    },
    component: () => import(/* webpackChunkName: "workOrder" */ '../views/WorkOrder.vue')
  },
  {
    path: '/workFeedback', // 发起工单
    name: 'workFeedback',
    component: () => import(/* webpackChunkName: "workOrder" */ '../views/WorkFeedback.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
