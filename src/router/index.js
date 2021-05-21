import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from '@/layouts/dashboard'

import DashboardHome from '@/views/Home'
import CollectionBuilder from '@/views/CollectionBuilder'
import PromoChecker from '@/views/PromoChecker'

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
      {
        path: '/promo-checker',
        name: 'promo-checker',
        component: PromoChecker,
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
