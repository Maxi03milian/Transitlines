<template>
  <div class="app">
    <v-app-bar color="#262626 accent-4" dark>
      <div class="brand">
        <a href="/"><img src="../assets/logo.png" alt="Logo" /></a>
      </div>
      <v-toolbar-title>Transitlines</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="nav-mobile">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      width="300"
      style="position: fixed; top: 0; right: 0; overflow-y: scroll"
    >
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="#262626 text--accent-4"
        >
          <v-list-item href="/">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item href="/connections">
            <v-list-item-title>Connections</v-list-item-title>
          </v-list-item>

          <v-list-item href="/stationBoard">
            <v-list-item-title>Stationboard</v-list-item-title>
          </v-list-item>

          <v-list-item href="/settings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: () => ({
    drawer: false,
    group: null,
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  height: 60px;
  padding-top: 5px;
}
.app {
  width: 100%;
  overflow: hidden !important;
  position: fixed;
  z-index: 2;
}
</style>
