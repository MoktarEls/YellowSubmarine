<template>
  <div>

    <div v-show="isLoading" id="loadingScreen">
      <h1>Chargement...</h1>
    </div>

    <canvas id="mainCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Game } from "@/YellowSubmarine/Game";
import { Engine, HavokPlugin } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export default defineComponent({
  name: 'YellowSubmarine',
  setup() {
    const isLoading = ref(true);
    return { isLoading };
  },
  async mounted() {
    const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
    Engine.ShadersRepository = "../shaders/";

    const havok = await HavokPhysics();
    const havokPlugin = new HavokPlugin(true, havok);

    const game = new Game(canvas, havokPlugin);

    await game.init();
    this.isLoading = false;
  },
});
</script>

<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
}

#loadingScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
