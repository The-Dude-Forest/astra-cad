<template>
	<div class="p-2 h-full w-full text-foreground bg-background">
		<section class="h-full w-full">BURA ITEM SECME</section>
	</div>
</template>

<script setup lang="ts">
import { useSceneManager } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
const sceneManager = useSceneManager();
const { hub, selectedFloor } = storeToRefs(sceneManager);
</script>
