<template>
	<main class="h-screen w-screen overflow-hidden bg-background">
		<section
			class="mt-2 p-4 pb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full h-full overflow-y-auto scroll-area"
		>
			<Card
				v-for="(item, i) in communityHubs"
				class="cursor-pointer select-none max-w-sm transition-all h-40 pt-2 gap-y-3 border-0"
				@click="handleItemSelection(item)"
			>
				<CardHeader class="py-0">
					<CardTitle
						class="flex p-0 text-center flex-col md:text-sm justify-start gap-y-4 items-center"
					>
						{{ item.title }}
					</CardTitle>
					<CardDescription class="flex flex-col gap-y-2">
						<Label> Author: {{ item.author }}</Label>
						<Label> Levels: {{ item.structure.floors.length }}</Label>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Avatar class="rounded-lg m-0 p-0 w-18 h-16">
						<AvatarImage
							:src="`${config.public.baseURL}cover.png`"
							alt="@unovue"
							class="p-0"
						/>
					</Avatar>
				</CardContent>
			</Card>
		</section>

		{{ communityHubs }}
	</main>
</template>
<script setup lang="ts">
import { useSceneManager, ItemTypes, type Item } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
const scene = useSceneManager();
const { communityHubs, hub } = storeToRefs(scene);
const { GetLayouts } = scene;
const handleItemSelection = (hubNew: Hub) => {
	console.log(hubNew);
	hub.value = {
		...hubNew,
		desc: hubNew.structure?.desc,
		floors: hubNew.structure?.floors,
	};
	navigateTo("/");
};
onMounted(async () => {
	await GetLayouts();
});

const config = useRuntimeConfig();
</script>
