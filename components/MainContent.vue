<script setup lang="ts">
import { Save, SquareArrowOutUpLeft } from "lucide-vue-next";
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

const handleSave = () => {
	// TODO: Implement save functionality
};

const sceneManager = useSceneManager();

const { selectedFloor } = storeToRefs(sceneManager);
</script>

<template>
	<div class="flex flex-col h-full">
		<nav
			class="flex items-center justify-between px-4 py-2 border-b border-border bg-background h-16"
		>
			<span class="text-foreground">
				{{
					sceneManager.selectedFloor === -1
						? "Hub"
						: sceneManager.selectedFloor === 0
							? "Ground Level"
							: `Level ${sceneManager.selectedFloor}`
				}}
			</span>
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
					<Button @click="handleSave">
						<Save class="w-4 h-4" />
						Save
					</Button>
				</div>
			</div>
		</nav>

		<!-- Main Content Area -->
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
				>
					<Terminal v-if="selectedFloor !== -1" />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	</div>
</template>
