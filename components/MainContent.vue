<script setup lang="ts">
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import Terminal from "./Terminal.vue";

const key = ref(0);
onMounted(() => (key.value = 1));
</script>

<template>
	<ResizablePanelGroup direction="vertical">
		<ResizablePanel :default-size="75" :min-size="30">
			<SceneView :key="key" />
		</ResizablePanel>

		<ResizableHandle :with-handle="true" />

		<ResizablePanel :default-size="25" :min-size="10" :max-size="50">
			<Terminal />
		</ResizablePanel>
	</ResizablePanelGroup>
</template>
