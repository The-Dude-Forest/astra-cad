<script setup lang="ts">
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import Terminal from "./Terminal.vue";
</script>

<template>
	<ResizablePanelGroup direction="vertical">
		<ResizablePanel :default-size="75" :min-size="30">
			<SceneView />
		</ResizablePanel>

		<ResizableHandle :with-handle="true" />

		<ResizablePanel :default-size="25" :min-size="10" :max-size="50">
			<Terminal />
		</ResizablePanel>
	</ResizablePanelGroup>
</template>
