<template>
	<main class="text-white font-bold w-full h-full relative">
		<Label
			v-if="selectedFloor !== -1"
			class="translate-y-2 text-xl absolute bottom-6 w-[100px] text-center z-10 left-12"
			for="zoom"
		>
			Zoom:</Label
		>
		<Slider
			v-if="selectedFloor !== -1"
			id="zoom"
			class="absolute bottom-6 w-[100px] z-10 left-28"
			:max="6"
			:step="0.2"
			:min="-5"
			:model-value="[zoom]"
			@update:model-value="(e) => (zoom = e[0])"
		/>
		<a-scene :key="selectedFloor" embedded>
			<a-plane
				position="0 -0.1 -4"
				rotation="-90 0.009 0"
				width="100"
				height="100"
				:src="`${config.public.baseURL}lunartexture1.webp`"
			/>

			<a-sky :src="`${config.public.baseURL}stars.jpg`" radius="1200" />

			<a-entity rotation="-30 0 0" position="-5 12 10">
				<a-camera
					:active="selectedFloor === -1"
					:look-controls-enabled="false"
					near="1"
					fov="90"
				/>
			</a-entity>

			<a-entity
				shadow="receive: true; cast: false"
				rotation="0 0 0"
				position="0 0 0"
				scale="1 1 1"
				:gltf-model="`${config.public.baseURL}models/bunkbed.glb`"
			/>

			<a-entity
				v-for="(floor, i) in hub.floors"
				:key="`${i}${floor.modelUrl}`"
				:visible="selectedFloor === i || selectedFloor === -1"
				shadow="receive: true; cast: false"
				rotation="0 -270 0"
				:position="`${floor.offset?.x ?? 0} ${i * 2.6 + (floor?.offset?.y ?? 0)} ${floor.offset?.z ?? 0}`"
				scale="1 1 1"
				:gltf-model="`${config.public.baseURL}${floor.modelUrl}`"
			>
				<a-entity rotation="-90 0 0" :position="`6 ${10 - zoom} -5`">
					<a-camera
						:active="selectedFloor === i"
						:look-controls-enabled="false"
						near="1"
						fov="90"
					/>
				</a-entity>
			</a-entity>
		</a-scene>
	</main>
</template>

<script setup lang="ts">
import { useSceneManager } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
const sceneManager = useSceneManager();
const { hub, selectedFloor } = storeToRefs(sceneManager);

const zoom = ref(-2);

watch(selectedFloor, () => {
	zoom.value = 0;
});

const config = useRuntimeConfig();
</script>
