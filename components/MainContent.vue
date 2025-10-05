<script setup lang="ts">
import { Share, SquareStop, Play, SquareArrowOutUpLeft } from "lucide-vue-next";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import Terminal from "./Terminal.vue";
import { useSceneManager } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";

const key = ref(0);
onMounted(() => (key.value = 1));
const sceneManager = useSceneManager();
const { selectedFloor, playMode } = storeToRefs(sceneManager);
const { SaveLayout } = sceneManager;

const handleShare = async () => {
	await SaveLayout();
};

function getPercentageColor(percentage: number) {
	if (percentage > 75) return "text-red-500";
	if (percentage > 40) return "text-yellow-500";
	return "text-green-500";
}

function getPercentageColorBackground(percentage: number) {
	if (percentage > 75) return "bg-red-500";
	if (percentage > 40) return "bg-yellow-500";
	return "bg-green-500";
}

const floorVolume = computed(() => {
	return sceneManager.calculateFloorVolumePercentage(selectedFloor.value);
});
</script>

<template>
	<div class="flex flex-col h-full">
		<nav
			class="flex items-center justify-between px-4 py-2 border-b border-border bg-background h-16"
		>
			<div class="flex items-center space-x-4">
				<span class="text-foreground">
					{{
						sceneManager.selectedFloor === -1
							? "Hub"
							: sceneManager.selectedFloor === 0
								? "Ground Level"
								: `Level ${sceneManager.selectedFloor}`
					}}
				</span>
				<div class="flex items-center space-x-2">
					<span class="text-muted-foreground">Volume usage:</span>
					<div
						class="size-2 rounded-full"
						:class="getPercentageColorBackground(floorVolume)"
					/>
					<span :class="getPercentageColor(floorVolume)"
						>{{ floorVolume.toFixed(2) }}%</span
					>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-2">
					<NuxtLink
						to="/community"
						target="_blank"
						class="inline-flex text-muted-foreground"
					>
						<Button variant="ghost">
							<SquareArrowOutUpLeft class="w-4 h-4" />
							Community
						</Button>
					</NuxtLink>
					<Button @click="handleShare()">
						<Share class="w-4 h-4" />
						Share
					</Button>

					<Button
						v-if="!playMode"
						:disabled="selectedFloor === -1"
						class="bg-green-600 hover:bg-green-400"
						@click="playMode = true"
					>
						<Play class="pointer-events-none w-4 h-4" />
						Play
					</Button>

					<Button
						v-if="playMode"
						class="bg-red-600 hover:bg-red-400"
						@click="playMode = false"
					>
						<SquareStop class="pointer-events-none w-4 h-4" />
						Stop
					</Button>
				</div>
			</div>
		</nav>

		<div class="flex-1 overflow-hidden">
			<ResizablePanelGroup direction="vertical">
				<ResizablePanel :default-size="65" :min-size="30">
					<div class="aspect-[4/3]">
						<SceneView :key="key" />
					</div>
				</ResizablePanel>

				<ResizableHandle :with-handle="true" />

				<ResizablePanel
					v-auto-animate
					:default-size="35"
					:min-size="10"
					:max-size="50"
					class="flex justify-center items-center"
				>
					<Terminal v-if="selectedFloor !== -1" />
					<Label v-else class="text-2xl text-white">
						Please select a level to view available items...
					</Label>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	</div>
</template>
