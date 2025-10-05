<script setup lang="ts">
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import LeftSidebar from "@/components/LeftSidebar.vue";
import RightSidebar from "@/components/RightSidebar.vue";
import MainContent from "@/components/MainContent.vue";
import { useIsMobile } from "@/composables/useIsMobile";

const { isMobile } = useIsMobile();
</script>

<template>
	<div class="h-screen w-screen overflow-hidden bg-background">
		<ResizablePanelGroup v-if="!isMobile" direction="horizontal">
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

		<!-- Mobile Layout: Only MainContent (navbar, terminal, and scene view) -->
		<MainContent v-else />
	</div>
</template>
