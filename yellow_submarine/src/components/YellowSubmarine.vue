<template>
  <div>
    <canvas></canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Test } from '@/YellowSubmarine/TestScene';

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
canvas{
  width: 100%;
  height: 100%;
}
</style>
