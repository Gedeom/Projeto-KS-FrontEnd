import Vue from 'vue'
import App from './App.vue'
import 'vuetify/dist/vuetify.css'
import '/src/assets/css/main.css'
import Vuetify from 'vuetify'
import router from './router'
import Axios from 'axios'
import store from './store'

router.beforeEach((to, from, next) => {
    let isLogado = localStorage.getItem('token') != null
    if (!isLogado && to.name != 'Login' && to.name != 'Home' && to.name != 'Cadastro') {
        next({name: 'Login'});
    }

    next();
});

Vue.prototype.$http = Axios;
Vue.config.productionTip = false
Vue.use(Vuetify);

new Vue({
    vuetify: new Vuetify(),
    router,
    store,
    render: h => h(App)
}).$mount('#app')
