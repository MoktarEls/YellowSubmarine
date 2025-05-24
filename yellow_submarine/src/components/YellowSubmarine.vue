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
import {Debug} from "@babylonjs/core/Legacy/legacy";

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

        /*setTimeout(() => {
          const physicsViewer = new Debug.PhysicsViewer();
          for (const mesh of Game.scene.meshes) {
            if (mesh.physicsBody) {
              physicsViewer.showBody(mesh.physicsBody);
            }
          }
        }, 3000);*/

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

