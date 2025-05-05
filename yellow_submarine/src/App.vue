<template>
  <YellowSubmarine/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import YellowSubmarine from './components/YellowSubmarine.vue';

export default defineComponent({
  name: 'App',
  components: {
    YellowSubmarine
  }
});
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
