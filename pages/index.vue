<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import LeftSidebar from "@/components/LeftSidebar.vue";
import RightSidebar from "@/components/RightSidebar.vue";
import MainContent from "@/components/MainContent.vue";
import { useSceneManager } from "@/stores/scene-manager";

const router = useRouter();
const sceneManager = useSceneManager();

// Check if hub exists in localStorage on mount
onMounted(() => {
	// Check if hub exists and has floors
	if (
		!sceneManager.hub ||
		!sceneManager.hub.floors ||
		sceneManager.hub.floors.length === 0
	) {
		router.push("/new");
	}
});
</script>

<template>
	<div class="h-screen w-screen overflow-hidden bg-background">
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel :default-size="25" :min-size="0" :max-size="30">
				<LeftSidebar />
			</ResizablePanel>

			<ResizableHandle :with-handle="true" />

			<ResizablePanel :default-size="50" :min-size="10">
				<MainContent />
			</ResizablePanel>

			<ResizableHandle :with-handle="true" />

			<ResizablePanel :default-size="25" :min-size="0" :max-size="30">
				<RightSidebar />
			</ResizablePanel>
		</ResizablePanelGroup>
	</div>
</template>
