<script setup lang="ts">
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import MissionInformation from "@/components/MissionInformation.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSceneManager } from "@/stores/scene-manager";

const sceneManager = useSceneManager();
</script>

<template>
	<ResizablePanelGroup direction="vertical">
		<ResizablePanel :default-size="40" :min-size="15" :max-size="50">
			<ScrollArea class="h-full w-full bg-background p-4">
				<h2
					class="text-lg font-semibold mb-2 text-foreground sticky top-0 w-full py-2 bg-background"
				>
					Mission: {{ sceneManager.hub.title }}
				</h2>
				<MissionInformation />
			</ScrollArea>
		</ResizablePanel>

		<ResizableHandle :with-handle="true" />

		<ResizablePanel :default-size="60" :min-size="0" :collapsible="true">
			<div class="h-full w-full bg-background p-4">
				<h2 class="text-lg font-semibold mb-2 text-foreground">AI Chat</h2>
			</div>
		</ResizablePanel>
	</ResizablePanelGroup>
</template>
