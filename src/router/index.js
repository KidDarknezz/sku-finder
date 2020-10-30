import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from '@/layouts/dashboard.vue'

import DashboardHome from '@/views/Home.vue'
import CollectionBuilder from '@/views/CollectionBuilder.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '/',
        name: 'dashboard-home',
        component: DashboardHome,
      },
      {
        path: '/collection-builder',
        name: 'collection-builder',
        component: CollectionBuilder,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
