<template>
  <v-app>
      <router-view />
  </v-app>
</template>

<script>
/*   let params = "query=Zürich"
  const Http = new XMLHttpRequest();
  Http.responseType = "json";
  const url='http://transport.opendata.ch/v1/locations';
  Http.open("GET", url+"?"+params, true);
  Http.send();

  Http.onreadystatechange=(e)=>{
    let result = Http.response
    if(result == null)
      return;
    console.log(result.stations[0].name);
    console.log("------------------------------");
  } */


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
