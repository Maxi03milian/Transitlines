<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="connection in connections.connections"
        :key="connection.id"
      >
        <v-expansion-panel-header> Item </v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "ConnectionResults",

  components: {},
  props: {
    connections: Object,
  },
  computed: {
    state() {
      return this.$store.state;
    },
  },
  methods: {},
};
</script>

<style>
</style>