<script setup lang="ts">
import { Plus } from "lucide-vue-next";
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
		type: "inflatable",
		volume: 124,
		acceptedItemTypes: [],
		items: [],
		modelUrl: "models/giriskati.glb",
	});
}
</script>

<template>
	<div class="h-full w-full bg-background flex flex-col">
		<div class="border-b border-border h-16 flex items-center px-4">
			<div class="flex items-center gap-2">
				<img src="/logo/logo.png" alt="AstraCAD" class="size-8" />
				<h1 class="text-xl font-bold text-foreground font-mono">AstraCAD</h1>
			</div>
		</div>
		<div class="flex-1">
			<ResizablePanelGroup direction="vertical">
				<ResizablePanel :default-size="50" :min-size="20" :max-size="75">
					<ScrollArea class="h-full w-full bg-background p-4">
						<div class="h-full w-full bg-background">
							<div
								class="text-lg font-semibold mb-2 text-foreground sticky top-0 w-full py-2 bg-background"
							>
								<h2 class="text-lg font-semibold text-foreground">
									Specifications
								</h2>
								<p class="text-sm text-muted-foreground">
									Specifications must meet the requirements of the mission
									defined by NASA.
								</p>
							</div>

							<AISuggestions />
						</div>
					</ScrollArea>
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
