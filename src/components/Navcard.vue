<template>
  <div class="cardContainer">
    <a :href="link">
      <v-card elevation="2">
        <v-card-title>{{title}}</v-card-title>
        <v-card-text>{{text}}</v-card-text>
      </v-card>
    </a>
  </div>
</template>

<script>
export default {
  name: "Navcard",
  props: {
    title: String,
    text: String,
    link: String,
  },

  components: {},
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {},
};
</script>

<style>
/*remove all link styling*/
a {
  text-decoration: none;
}
.cardContainer {
  margin-bottom: 1rem;
}
</style>