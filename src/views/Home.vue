<template>
  <div>
    <Header />
    <div class="content">
      

    </div>

  </div>
</template>

<script>
import Header from "../components/Header";

export default {
  name: "Home",

  components: {
    Header,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {
  },
};
</script>

<style>

</style>