<template>
	<a-scene embedded>
		<a-plane
			position="0 -0.1 -4"
			rotation="-90 0.009 0"
			width="100"
			height="100"
			:src="`${config.public.baseURL}lunartexture1.webp`"
		/>

		<a-sky :src="`${config.public.baseURL}stars.jpg`" radius="1200" />

		<a-entity v-if="selectedFloor === -1" rotation="-0 0 0" position="-5 12 10">
			<a-camera :look-controls-enabled="false" near="1" fov="60" />
		</a-entity>

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
			<a-entity rotation="-90 0 0" position="6 10 -5">
				<a-camera
					v-if="selectedFloor === i"
					:look-controls-enabled="false"
					fov="90"
				/>
			</a-entity>
		</a-entity>
	</a-scene>
</template>

<script setup lang="ts">
import { useSceneManager } from "@/stores/scene-manager";
const sceneManager = useSceneManager();
const { hub, selectedFloor } = storeToRefs(sceneManager);
const config = useRuntimeConfig();
</script>
