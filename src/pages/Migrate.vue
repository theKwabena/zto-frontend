<script setup>
import { gsap } from "gsap";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Status from "../components/Status.vue";

import axios from "axios";

import {useAuthStore} from "../store/auth.store.js";
import router from "@/routes/index.js";

const PY_SERVICE_URL = `${import.meta.env.VITE_PY_SERVICE_URL}`;
const ASPNET_CORE_SERVICE_URL = `${import.meta.env.VITE_ASPNET_CORE_SERVICE_URL}`;

console.log(PY_SERVICE_URL)
const pill = ref(null)
const can_migrate = computed(()=> !auth_store.dt_id || !auth_store.et_id )
const can_upload = computed(()=> auth_store.et_status === "SUCCESS" || !auth_store.up_id)
const upload_status_exists = computed(()=> !!auth_store.up_status)
const download_and_extract_status = ref('')
const upload_status = ref('')

const route = useRoute()


const auth_store = useAuthStore()
const downloadAndUploadStream = (dt_id, et_id)=> {
    let str = new EventSource(`${PY_SERVICE_URL}/stream/?dt_id=${dt_id}&et_id=${et_id}`)
    str.addEventListener("new_message", event => {
      const data = JSON.parse(event.data.replace(/'/g, '"'))
      download_and_extract_status.value = event.data
      auth_store.dt_status = data.dt_status
      auth_store.et_status = data.et_status
    }, false)

    str.addEventListener("end_event", async event => {
      const data = JSON.parse(event.data.replace(/'/g, '"'))
      download_and_extract_status.value = event.data
      auth_store.dt_status = data.dt_status
      auth_store.et_status = data.et_status
      if(can_upload && !upload_status_exists){
        //BEGIN UPLOAD
        await axios.post(`${ASPNET_CORE_SERVICE_URL}/api/v1/migrate`,  {username : "nss2022_emma@ytgqc.onmicrosoft.com"})
            .then((resp)=>{
              console.log('fire')
              auth_store.up_id = resp.data.username
              auth_store.up_status = resp.data.status
              uploadStream(resp.data.username)
            })
            .catch((error)=>{
              console.log(error)
            })

      }
      str.close()
    }, false)
}

function uploadStream(userId){
  let str = new EventSource(`${ASPNET_CORE_SERVICE_URL}/api/v1/tasks/sse?userId=nss2022_emma@ytgqc.onmicrosoft.com`)
  str.addEventListener("new_data", event => {
    upload_status.value = event.data
    auth_store.up_status = event.data
    console.log(`upload stream event new data in here ${event.data}`)
  }, false)

  str.addEventListener("end_stream", event => {
    upload_status.value = event.data
    auth_store.up_status = event.data
    console.log(`upload stream end event data in here ${event.data}`)
    str.close()
  }, false)
}
async function beginMigration(){
  await axios.get(`${PY_SERVICE_URL}/begin-migration?username=${auth_store.user}`, {withCredentials: true, credentials:'include'})
      .then((resp)=>{
        auth_store.dt_id = resp.data.dt_id
        auth_store.et_id = resp.data.et_id
        downloadAndUploadStream(resp.data.dt_id, resp.data.et_id)
      })
      .catch((error)=>{
        console.log(error)
      })
}


async function logOut(){
  console.log("logged out clicked")
  await auth_store.logOut()

  await router.push({
    name : 'login'
  })
}



onMounted(()=>{
  // setupStream()
  // gsap.to(pill.value, { width: '100%', duration:5 })

  if(!can_migrate.value){
    downloadAndUploadStream(auth_store.dt_id, auth_store.et_id)
  }

})


</script>

<template>
  <div class="min-h-screen font-lufga flex flex-col items-center mt-10 space-y-6">
<!--    <p class="font-lufgam text-2xl">Zimbra to Office365 Mailbox Migration</p>-->
    <div class="text-center">
      <button v-show="can_migrate" @click="beginMigration" class="relative font-lufgam inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Begin Migration
        </span>
      </button>
      <div>
        <p class="font-bold"> {{auth_store.user}}</p>
      </div>
    </div>
    <div class="min-h-28  rounded-lg w-full  md:w-6/12 p-10 space-y-5">
      <div class="flex flex-col space-y-5 sm:flex-row lg:flex-row justify-between items-center">
        <p class="font-lufgam lg:mt-6"> Current Status by Service</p>
        <div class="flex space-x-5">
          <div class="flex flex-col md:flex-row justify-center items-center space-x-2">
            <img class="w-4" src="../assets/svgs/success.svg" alt="success" />
            <span class="text-sm"> Success</span>
          </div>

          <div class="flex flex-col md:flex-row text-center justify-center items-center space-x-2">
            <img class="w-4" src="../assets/svgs/not_available.svg" alt="not-available">
            <span class="text-sm"> Not Available</span>
          </div>

          <div class="flex flex-col md:flex-row justify-center items-center space-x-2">
            <img class="w-4" src="../assets/svgs/error.svg" alt="error" >
            <span class="text-sm"> Error</span>
          </div>

          <div class="flex flex-col md:flex-row justify-center items-center space-x-2">
            <img class="w-4" src="../assets/svgs/pending.svg" alt="pending">
            <span class="text-sm"> Pending </span>
          </div>

        </div>

      </div>
      <hr>
      <Status status="Download" :body="auth_store.dt_status" type="not-available"/>
      <hr>
      <Status status="Extract" :body="auth_store.et_status" type="not-available"/>
      <hr>
      <Status status="Upload" :body="auth_store.up_status" type="not-available"/>
      <hr>
      <Status status="Cleanup" body="not-available" type="not-available"/>
      <hr>
    </div>
    <div>
      <button type="button" @click="logOut" class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Logout</button>
    </div>
  </div>

</template>

