<template>
  <div>
    <canvas id="mainCanvas"></canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {Game} from "@/YellowSubmarine/Game";
import {Engine, HavokPlugin} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export default defineComponent({
  name: 'YellowSubmarine',
  props: {
    msg: String,
  },
  async mounted() {
      const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
      Engine.ShadersRepository = "../shaders/";
      await HavokPhysics().then((havok) => {
        const havokPlugin = new HavokPlugin(true, havok);
        const game = new Game(canvas, havokPlugin);
      })
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

