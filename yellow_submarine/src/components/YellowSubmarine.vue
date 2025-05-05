<template>
  <div>
    <canvas></canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Test } from '@/YellowSubmarine/Game';

export default defineComponent({
  name: 'YellowSubmarine',
  props: {
    msg: String,
  },
  mounted() {
      const canvas = document.querySelector("canvas")!;
      new Test(canvas);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>

