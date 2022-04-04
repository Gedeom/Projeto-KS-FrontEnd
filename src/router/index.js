import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/pages/Home/HomeComponent'
import marca from '@/components/pages/Marca/MarcaComponent'
import login from '@/components/pages/Login/LoginComponent'
import modelo from '@/components/pages/Modelo/ModeloComponent'
import versao from '@/components/pages/Versao/VersaoComponent'
import veiculo from '@/components/pages/Veiculo/VeiculoComponent'
import dicas from '@/components/pages/Dicas/DicasComponent'
import cadastro from '@/components/pages/Cadastro/CadastroComponent'

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home
    },
    {
        path: '/marca',
        name: 'Marca',
        component: marca
    },
    {
        path: '/modelo',
        name: 'Modelo',
        component: modelo
    },
    {
        path: '/versao',
        name: 'Versao',
        component: versao
    },
    {
        path: '/veiculo',
        name: 'Veiculo',
        component: veiculo
    },
    {
        path: '/dicas',
        name: 'Dicas',
        component: dicas
    },
    {
        path: '/login',
        name: 'Login',
        component: login
    },
    {
        path: '/cadastro',
        name: 'Cadastro',
        component: cadastro
    }
];


export default new Router({
    routes
})