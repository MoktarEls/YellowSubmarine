<template>
  <div>
    <div v-show="isLoading" id="loadingScreen" :class="{ 'fade-out': isFadingOut }">
      <img :src="getLogoSrc()" alt="Logo" class="logo" />
      <p class="fullscreen-tip">Pour une meilleure expérience, activez le plein écran via la touche F11.</p>
      <h1 class="wave-text">
        <span
            v-for="(letter, index) in loadingText"
            :key="index"
            class="letter"
            :style="{ animationDelay: `${index * 0.1}s` }"
        >
          {{ letter }}
        </span>
      </h1>
    </div>

    <canvas id="mainCanvas"></canvas>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Game } from "@/YellowSubmarine/Game";
import { Effect, Engine, HavokPlugin } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export default defineComponent({
  name: 'YellowSubmarine',
  setup() {
    const isLoading = ref(true);
    const isFadingOut = ref(false);
    const loadingText = 'Chargement...'.split('');

    const getLogoSrc = () => {
      return process.env.NODE_ENV === "production"
          ? "/YellowSubmarine/logo.png"
          : "/logo.png";
    };

    return { isLoading, isFadingOut, loadingText, getLogoSrc };
  },
  async mounted() {
    const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
    Effect.ShadersRepository = process.env.NODE_ENV === "production"
        ? "/YellowSubmarine/shaders/"
        : "/shaders/";
    Engine.ShadersRepository = process.env.NODE_ENV === "production"
        ? "/YellowSubmarine/shaders/"
        : "/shaders/";

    const havok = await HavokPhysics();
    const havokPlugin = new HavokPlugin(true, havok);
    const game = new Game(canvas, havokPlugin);

    await game.init();

    setTimeout(() => {
      this.isFadingOut = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, 500);
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

.fullscreen-tip {
  font-size: 1rem;
  color: #cccccc;
  margin-bottom: 20px;
  text-align: center;
  max-width: 80%;
}


#loadingScreen {
  position: fixed;
  top: 0;
  left: 0;
  background: #0b1c1b;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 1s ease;
  gap: 30px; /* espace entre logo et texte */
}

.fade-out {
  opacity: 0;
  pointer-events: none;
}

.logo {
  width: 400px;
  height: auto;
}

.wave-text {
  font-size: 2.5rem;
  display: flex;
  gap: 4px;
  justify-content: center;
}

.letter {
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
