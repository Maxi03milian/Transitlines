<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
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

  let params = "query=Zürich"
  fetch("http://transport.opendata.ch/v1/locations?" + params)
    .then(res => res.json())
    .then(data => console.log(data))


export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
