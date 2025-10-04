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

const sceneManager = useSceneManager();

function addFloor() {
	const newLevel = sceneManager.hub.floors.length;
	sceneManager.hub.floors.push({
		level: newLevel,
		type: "custom",
		volume: 100,
		acceptedItemTypes: [],
		items: [],
	});
}
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
				<ResizablePanel :default-size="25" :min-size="10" :max-size="50">
					<div class="h-full w-full bg-background p-4">
						<h2 class="text-lg font-semibold mb-2 text-foreground">
							AI Suggestions
						</h2>
					</div>
					<ScrollArea class="h-full">
						<AISuggestions />
					</ScrollArea>
				</ResizablePanel>

				<ResizableHandle :with-handle="true" />

				<ResizablePanel :default-size="75" :min-size="20">
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
