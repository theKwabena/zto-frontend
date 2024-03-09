<template>
  <div>

  </div>
</template>

<script setup>
import {useSSE} from "@/composables/migrate.js";
import {onMounted} from "vue";

const setupStream = (dt_id, et_id)=> {
  console.log("Setting up stream")
  let str = new EventSource(`https://localhost:8443/api/v1/tasks/sse?userId=nss2022_emma@ytgqc.onmicrosoft.com`)
  str.addEventListener("new_data", event => {
    console.log("new-data in")
    console.log(event.data)

  }, false)

  str.addEventListener("end_stream", event => {
    console.log("end_stream now")
    console.log(event.data)
    str.close()
  }, false)
}


onMounted(()=>{
  setupStream()
})

</script>

<style lang="scss" scoped>

</style>