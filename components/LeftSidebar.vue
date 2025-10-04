<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
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
							Habitat Information
						</h2>
					</div>
				</ResizablePanel>

				<ResizableHandle :with-handle="true" />

				<ResizablePanel :default-size="75" :min-size="20">
					<div class="h-full w-full bg-background p-4">
						<h2 class="text-lg font-semibold mb-2 text-foreground">
							Layout Manager
						</h2>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	</div>
</template>
