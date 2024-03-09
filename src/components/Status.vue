<template>
  <div>
    <div class="flex justify-between">
      <div class="">
        <p class="font-lufgam"> {{status}}</p>
        <p v-if="body === 'SUCCESS'" class="lowercase font-thin font-lufga"> Completed Successfully </p>
        <p v-else-if="body === 'FAILURE'"> Process failed, please contact administrator </p>
        <p v-else-if="body === 'PENDING'"> Process pending</p>
        <p v-else> Not Available</p>
      </div>

      <img v-if="body === 'SUCCESS'" class="w-6" src="../assets/svgs/success.svg" alt="success" />
      <img v-else-if="body === 'FAILURE'" class="w-6" src="../assets/svgs/error.svg" alt="error">
      <img v-else-if="body === 'PENDING'" class="w-6" src="../assets/svgs/pending.svg" alt="pending">
      <img v-else class="w-6" src="../assets/svgs/not_available.svg" alt="not-available">
    </div>
  </div>
</template>

<script setup>

  defineProps({
  status : {
    type : String,
    required : true
  },
  body : {
    type : String,
    required : true
  },
  type: {
    type : String,
    required : true
  }
})


</script>

<style lang="scss" scoped>

</style>