<template>
  <div>
      <div v-for="station in stations" :key="station.id" class="stationItem">
          <p>{{station.name}}</p>
      </div>

  </div>
</template>

<script>

export default {
  name: "SearchResults",
    props:{
        "stations": Array,
    },
  components: {
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style>

.stationItem{
    border: 2px solid black;
}
</style>
