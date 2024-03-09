import {defineStore} from "pinia";
import {computed, ref} from "vue";
import axios from "axios";
import Cookie from "js-cookie"

const PY_SERVICE_URL = `${import.meta.env.VITE_PY_SERVICE_URL}`;
export const useAuthStore = defineStore('AuthStore', ()=>{
    const user = ref('')
    const auth_error = ref('')
    const dt_id = ref('')
    const et_id = ref('')
    const dt_status = ref('')
    const et_status = ref('')
    const up_status = ref('')
    const up_id = ref('')

    const getUser = computed(()=> user.value)

    function initStore(){
        auth_error.value = ''
    }
    async function logInUser(credentials){
        await axios.post(
            `${PY_SERVICE_URL}/access-token`, credentials, {withCredentials: true, credentials: 'include'}
        ).then((resp)=>{
            console.log(resp.data)
            user.value = resp.data.user
            dt_id.value = resp.data.dt_id
            et_id.value = resp.data.et_id
            Cookie.set('is_Authenticated', true, { expires: 1 })
            Cookie.set('username' , resp.data.user)

        }).catch((error)=> {
            console.log(error)
            if(error.response){
                if(error.response.status === 401){
                    auth_error.value = "Invalid Credentials"
                }

            }
            else if(error.message){
                auth_error.value = error.message
            }
            else {
                auth_error.value = error.message
            }

        })
    }


    async function logOut(){
        Cookie.remove("is_Authenticated")
    }

   async function getCurrentUser(){
        if (user){
            await axios.get(
                `${PY_SERVICE_URL}/me?username=${user}`, {withCredentials: true, credentials: 'include'}
            ).then((resp) =>{
                user.value = resp.data.user
                return user.value
            }).catch((data)=>{
                user.value = ''
            })
        } else {
            return ''
        }

   }

    return {
        user,  // User
        dt_id,  // Download ID
        et_id,  // Extract ID
        up_id, //  Upload ID
        dt_status, // Download status
        et_status, // Extract status
        up_status, // Upload status
        auth_error, // Auth Error
        initStore, // Initialize store for login
        getCurrentUser, // Get current user
        logInUser, // Login user
        logOut
    }
})