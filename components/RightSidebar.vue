<script setup lang="ts">
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import MissionInformation from "@/components/MissionInformation.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
</script>

<template>
	<ResizablePanelGroup direction="vertical">
		<ResizablePanel :default-size="30" :min-size="15" :max-size="50">
			<div class="h-full w-full bg-background p-4">
				<h2 class="text-lg font-semibold mb-2 text-foreground">
					Mission Information
				</h2>
			</div>
			<ScrollArea class="h-full">
				<MissionInformation />
			</ScrollArea>
		</ResizablePanel>

		<ResizableHandle :with-handle="true" />

		<ResizablePanel :default-size="70" :min-size="0" :collapsible="true">
			<div class="h-full w-full bg-background p-4">
				<h2 class="text-lg font-semibold mb-2 text-foreground">AI Chat</h2>
			</div>
		</ResizablePanel>
	</ResizablePanelGroup>
</template>
