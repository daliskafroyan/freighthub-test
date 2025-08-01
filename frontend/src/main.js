import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import views and components
import Home from './views/Home.vue'
import OrdersList from './views/OrdersList.vue'
import OrderForm from './components/OrderForm.vue'
import OrderDetails from './views/OrderDetails.vue'

// Create router
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/orders', name: 'OrdersList', component: OrdersList },
  { path: '/orders/create', name: 'CreateOrder', component: OrderForm },
  { path: '/orders/:id', name: 'OrderDetails', component: OrderDetails, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create Pinia store
const pinia = createPinia()

// Create and mount app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app') 