<template>
  <div>
      <div v-for="station in stations" :key="station.id" class="stationItem">
          <div class="itemText"> {{station.name}}
          </div>
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
    display: flex;
    align-items: center;
    border: 1px solid rgb(58, 58, 58);
    border-radius: 5px;
    height: 60px;
}

.itemText{
    margin: 5px;
}
</style>
