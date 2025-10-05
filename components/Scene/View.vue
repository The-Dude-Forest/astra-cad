<template>
	<main class="text-white font-bold w-full h-full relative">
		<Label
			v-if="selectedFloor !== -1"
			class="-translate-y-3 text-xl absolute top-6 w-[100px] text-center z-10 left-12"
			for="zoom"
		>
			Zoom:</Label
		>
		<Slider
			v-if="selectedFloor !== -1"
			id="zoom"
			class="absolute top-6 w-[100px] z-10 left-28"
			:max="6"
			:step="0.2"
			:min="-5"
			:model-value="[zoom]"
			@update:model-value="(e) => e && (zoom = e[0])"
		/>

		<!-- Drawer Toggle Button -->
		<Button
			v-if="drawerOpen !== undefined"
			size="icon"
			class="absolute bottom-4 left-4 z-10 rounded-full w-12 h-12 shadow-md"
			@click="toggleDrawer"
		>
			<Plus class="w-5 h-5" />
		</Button>
		<a-scene :key="`${selectedFloor}${playMode}`" embedded>
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
				v-for="(floor, i) in [...hub.floors.sort((a, b) => b.level - a.level)]"
				:key="`${i}${floor.modelUrl}`"
				:visible="selectedFloor === floor.level || selectedFloor === -1"
				shadow="receive: true; cast: false"
				rotation="0 -270 0"
				:position="`${floor.offset?.x ?? 0} ${i * 2.6 + (floor?.offset?.y ?? 0)} ${floor.offset?.z ?? 0}`"
				scale="1 1 1"
				:gltf-model="`${config.public.baseURL}${floor.modelUrl}`"
			>
				<a-entity rotation="-90 0 0" :position="`6 ${10 - zoom} -5`">
					<a-camera
						:active="selectedFloor === floor.level"
						:look-controls-enabled="false"
						near="1"
						fov="90"
					/>
				</a-entity>

				<a-entity rotation="0 0 0" :position="`6 0 -5`">
					<a-camera
						:active="
							selectedFloor === floor.level && playMode && selectedFloor !== -1
						"
						:look-controls-enabled="true"
						:wasd-controls-enabled="true"
						near="0.1"
						fov="90"
					/>
				</a-entity>

				<a-entity
					v-for="(item, index) in floor.items"
					:key="index"
					shadow="receive: true; cast: false"
					:position="`${(item.x ?? 0) + 5.736} ${item.y ?? 0} ${(item.z ?? 0) - 6.268}`"
					:orientation="`0 ${item.orientation ?? 0} 0`"
					rotation="0 0 0"
					scale="0.7 0.7 0.7"
					:gltf-model="`${config.public.baseURL}${item.modelUrl}`"
				/>
			</a-entity>
		</a-scene>
	</main>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { useSceneManager } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";

const sceneManager = useSceneManager();
const { hub, selectedFloor, playMode } = storeToRefs(sceneManager);

const zoom = ref(-2);

watch(selectedFloor, () => {
	zoom.value = 0;
});

const config = useRuntimeConfig();

// Drawer toggle props
const props = defineProps({
	drawerOpen: {
		type: Boolean,
		default: undefined,
	},
});

const emit = defineEmits(["toggleDrawer"]);

const toggleDrawer = () => {
	emit("toggleDrawer");
};
</script>
