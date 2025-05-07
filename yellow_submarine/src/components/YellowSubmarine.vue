<template>
  <div>
    <canvas id="mainCanvas"></canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Game} from "@/YellowSubmarine/Game";
import {Engine} from "@babylonjs/core";

export default defineComponent({
  name: 'YellowSubmarine',
  props: {
    msg: String,
  },
  mounted() {
      const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
      Engine.ShadersRepository = "../shaders/";
      const game = new Game(canvas);
      game.init();
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

