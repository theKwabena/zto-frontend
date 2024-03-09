import HeroSection from "../components/HeroSection.vue";
import Migrate from "../pages/Migrate.vue"
import LoginView from "../pages/LoginView.vue"
import SseView from "../pages/SseView.vue";
import {createRouter, createWebHistory} from "vue-router";
import Cookies from "js-cookie";
import {useAuthStore} from "../store/auth.store.js";

const routes = [
    {
        path:"/",
        component: HeroSection,
        name: 'landing-hero',

    },
    {
        path: '/migrate/',
        component: Migrate,
        name: 'migration',
        meta : {
            requiresAuth : true
        }
    },
    {
        path :'/login',
        component: LoginView,
        name: 'login'

    },
    {
        path : '/sse',
        component: SseView,
        name : 'sse'
    }
]


const router = createRouter({
    history : createWebHistory(),
    routes,

})


router.beforeEach(async (to, from, next)=>{
    if (to.meta.requiresAuth){
        const authStore = useAuthStore()
        const authenticated = Cookies.get('is_Authenticated')
        console.log(authStore.user)

        if (!authenticated){
            return next({path : '/login'})
        }
        else {
            if(!authStore.user){
                const currentUser = await authStore.getCurrentUser()
                if(!currentUser){
                    return next({path : '/login'})
                }
                // if (!user){
                //   return next({path: '/login'})
                // }

            }
        }
    }

    return next();
})
export default router