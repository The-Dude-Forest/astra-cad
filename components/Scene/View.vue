<template>
	<main
		class="w-[100vw] text-4xl h-[100vh] flex gap-5 flex-col justify-center items-center"
	>
		<section class="w-full h-full bg-slate-400 text-7xl text-white">
			<a-scene embedded>
				<a-plane
					position="0 0 -4"
					rotation="-90 0.009 0"
					width="100"
					height="100"
					:src="`${config.public.baseURL}lunartexture1.webp`"
				/>

				<a-sky :src="`${config.public.baseURL}stars.jpg`" radius="1200" />

				<a-camera
					v-if="selectedFloor === -1"
					fov="90"
					rotation="-55 0 0"
					position="-5 9 10"
				/>

				<a-box poisition="3 0 3" />

				<a-entity
					v-for="(floor, i) in hub.floors"
					:key="`${i}${floor.modelUrl}`"
					shadow="receive: true; cast: false"
					rotation="0 -270 0"
					:position="`${floor.offset?.x ?? 0} ${i * 2.6 + (floor?.offset?.y ?? 0)} ${floor.offset?.z ?? 0}`"
					scale="1 1 1"
					:gltf-model="`${config.public.baseURL}${floor.modelUrl}`"
				>
					<a-camera
						v-if="selectedFloor === i"
						fov="90"
						rotation="-90 0 0"
						position="0 10 0"
					/>
				</a-entity>
			</a-scene>
		</section>
	</main>
</template>

<script setup lang="ts">
import { useSceneManager } from "@/stores/scene-manager";
const sceneManager = useSceneManager();
const { hub, selectedFloor } = storeToRefs(sceneManager);
const config = useRuntimeConfig();
</script>
