<template>
  <v-app>
      <router-view />
  </v-app>
</template>

<script>

import Header from "@/components/Header.vue"

export default {
  name: "App",
  components:{
    Header
  },
  computed:{
    
  },
};
</script>
