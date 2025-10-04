<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";
</script>

<template>
	<div class="h-full w-full bg-background flex flex-col">
		<div class="p-4 border-b border-border">
			<div class="flex items-center gap-2">
				<Sparkles class="h-6 w-6 text-primary" />
				<h1 class="text-xl font-bold text-foreground">AstraCAD</h1>
			</div>
		</div>
		<div class="flex-1 p-4">
			<!-- Sidebar content goes here -->
		</div>
	</div>
</template>
