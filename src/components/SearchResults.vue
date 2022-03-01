<template>
  <div>
      <div v-for="station in stations" :key="station.id" class="stationItem">
          <div class="itemContent">
            <font-awesome-icon v-if="station.icon == 'train'" icon="fa-solid fa-train-subway" size="2x" class="customIcons"/>
            <font-awesome-icon v-if="station.icon == 'bus'" icon="fa-solid fa-bus" size="2x" class="customIcons"/>
            <font-awesome-icon v-if="station.icon == 'tram'" icon="fa-solid fa-bus" size="2x" class="customIcons"/>
            <font-awesome-icon v-if="station.icon == null" icon="fa-solid fa-train-tram" size="2x" class="customIcons"/>
            <div class="itemText"> 
                {{station.name}}
            </div>
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
.itemContent{
    margin: 5px;
        display: flex;
    align-items: center;
}

.customIcons{
    width: 50px;
}
</style>
