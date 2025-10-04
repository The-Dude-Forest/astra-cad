<template>
	<div class="p-2 h-full w-full flex-col flex text-foreground bg-background">
		<section class="h-14 w-full">
			<Select v-model="selectedFloor">
				<SelectTrigger class="w-[180px]">
					<SelectValue placeholder="Select a level" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Levels</SelectLabel>
						<SelectItem :value="-1"> Hub </SelectItem>
						<SelectItem v-for="(_, i) in hub.floors" :key="i" :value="i">
							{{ i === 0 ? "Ground Level" : `Level ${i}` }}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</section>
		<section class="bg-blue-800 h-full w-full">BURA ITEM SECME</section>
	</div>
</template>

<script setup lang="ts">
import { useSceneManager } from "@/stores/scene-manager";
const sceneManager = useSceneManager();
const { hub, selectedFloor } = storeToRefs(sceneManager);
</script>
