<template>
	<div class="p-2 h-full w-full text-foreground bg-background">
		<Select v-model="filterSearch">
			<SelectTrigger class="w-[180px] !bg-secondary">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all"> All </SelectItem>
					<SelectItem v-for="type in ItemTypes" :key="type" :value="type">
						{{ type }}
					</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
		<section
			class="mt-2 p-4 pb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full h-full overflow-y-auto scroll-area"
		>
			<Card
				v-for="(item, i) in items"
				class="cursor-pointer select-none transition-all h-40 pt-2 gap-y-3 border-0"
				:class="
					item.modelUrl === selectedItem?.modelUrl
						? 'bg-gray-200 text-black'
						: 'hover:bg-secondary'
				"
				@click="handleItemSelection(item)"
			>
				<CardHeader class="py-0">
					<CardTitle
						class="flex p-0 text-center justify-start gap-x-1 items-center"
					>
						{{ item.title }}
					</CardTitle>
					<CardDescription class="text-xs">
						<Avatar class="rounded-none m-0 p-0 w-full h-12">
							<AvatarImage
								:src="`https://avatar.vercel.sh/${i}`"
								alt="@unovue"
								class="p-0"
							/>
						</Avatar>
					</CardDescription>
				</CardHeader>
				<CardContent
					class="flex py-0 items-center text-xs text-muted-foreground justify-center"
				>
					{{ item.desc }} <br />
					{{ item.type }}
				</CardContent>
			</Card>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useSceneManager, ItemTypes, type Item } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
const sceneManager = useSceneManager();
const filterSearch = ref("all");

const handleItemSelection = (item: Item) => {
	hub.value.floors[selectedFloor.value].items.push(item);
};

const { hub, selectedFloor, items, selectedItem } = storeToRefs(sceneManager);
</script>

<style scoped>
.scroll-area {
	scrollbar-color: lightgray #3a3a3a; /* thumb (red) + track (light gray) */
}

/* Chrome, Edge, Safari */
.scroll-area::-webkit-scrollbar {
	width: 12px;
}

.scroll-area::-webkit-scrollbar-track {
	background: #f0f0f0; /* track color */
	border-radius: 4px;
}

.scroll-area::-webkit-scrollbar-thumb {
	background-color: gray; /* 🔴 red bar */
	border-radius: 4px;
}

.scroll-area::-webkit-scrollbar-thumb:hover {
	background-color: gray; /* darker red on hover */
}
</style>
