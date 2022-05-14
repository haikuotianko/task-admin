import { createRouter, createWebHashHistory } from 'vue-router'
import TaskList from '../views/TaskList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      showTab: true,
      keepAlive: true
    },
    redirect: '/taskList',
    // component: TaskList
  },
  {
    path: '/taskList', // 任务列表
    name: 'taskList',
    meta: {
      showTab: true,
      keepAlive: true
    },
    component: TaskList
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
      showTab: true,
      // keepAlive: true
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
