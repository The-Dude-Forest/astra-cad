<script setup lang="ts">
import { Sparkles, Plus } from "lucide-vue-next";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import LayoutManager from "@/components/LayoutManager.vue";
import AISuggestions from "@/components/AISuggestions.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSceneManager } from "@/stores/scene-manager";
import { useAISuggestions } from "@/stores/ai-suggestions";

const sceneManager = useSceneManager();
const suggestionsStore = useAISuggestions();

function addFloor() {
	const newLevel = sceneManager.hub.floors.length;
	sceneManager.hub.floors.push({
		level: newLevel,
		type: "custom",
		volume: 100,
		acceptedItemTypes: [],
		items: [],
		modelUrl: "models/giriskati.glb",
	});
}

const handleGenerateSuggestions = () => {
	suggestionsStore.generateSuggestions(sceneManager.hub);
};
</script>

<template>
	<div class="h-full w-full bg-background flex flex-col">
		<div class="p-4 border-b border-border">
			<div class="flex items-center gap-2">
				<Sparkles class="h-6 w-6 text-primary" />
				<h1 class="text-xl font-bold text-foreground">AstraCAD</h1>
			</div>
		</div>
		<div class="flex-1">
			<ResizablePanelGroup direction="vertical">
				<ResizablePanel :default-size="50" :min-size="20" :max-size="75">
					<div class="h-full w-full bg-background py-4">
						<div class="px-4 flex items-center justify-between w-full">
							<h2 class="text-lg font-semibold mb-2 text-foreground">
								AI Suggestions
							</h2>
							<Button
								size="sm"
								variant="default"
								class="gap-2"
								@click="handleGenerateSuggestions"
							>
								<Sparkles class="w-4 h-4" />
								Generate
							</Button>
						</div>
						<ScrollArea class="h-full px-4 mt-4">
							<AISuggestions />
						</ScrollArea>
					</div>
				</ResizablePanel>

				<ResizableHandle :with-handle="true" />

				<ResizablePanel :default-size="50" :min-size="20">
					<div class="h-full w-full bg-background py-4">
						<div class="px-4 flex items-center justify-between w-full">
							<h2 class="text-lg font-semibold mb-2 text-foreground">
								Layout Manager
							</h2>
							<Button size="sm" @click="addFloor">
								<Plus class="h-4 w-4 mr-1" />
								Add floor
							</Button>
						</div>
						<ScrollArea class="h-full">
							<LayoutManager />
						</ScrollArea>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	</div>
</template>
