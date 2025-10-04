<template>
  <main
    class="w-[100vw] h-[100vh] flex gap-5 flex-col justify-center items-center"
  >
    {{ hub }}
    <section class="w-full h-full bg-slate-400 text-7xl text-white">
      <a-scene embedded>
        <a-plane
          position="0 0 -4"
          rotation="-90 0 0"
          width="100"
          height="100"
          :src="`${config.public.baseURL}lunartexture1.webp`"
        />

        <a-sky :src="`${config.public.baseURL}stars.jpg`" radius="1200" />

        <a-camera id="camera" position="0 3 1" />

        <a-box poisition="3 0 3" />

        <a-entity
          v-if="true"
          shadow="receive: true; cast: false"
          rotation="0 -270 0"
          position="-5.69 0 0.926"
          scale="1 1 1"
          :gltf-model="`${config.public.baseURL}giriskati.glb`"
        >
          <a-box scale="0.5 0.2 0.5" position="2.5 3.76 3.5" color="#454545" />
        </a-entity>
      </a-scene>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useSceneManager } from "@/stores/scene-manager";
const sceneManager = useSceneManager();
const { hub } = storeToRefs(sceneManager);
const config = useRuntimeConfig();
</script>
