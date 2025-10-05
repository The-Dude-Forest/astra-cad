<template>
	<div class="p-2 h-full w-full text-foreground bg-background">
		<div class="flex gap-x-4 w-full px-4 pt-2">
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
			<div class="relative w-full items-center">
				<Input
					v-model="search"
					id="search"
					class="rounded-lg pl-10 w-full !bg-secondary"
					type="text"
					placeholder="Search..."
				/>
				<span
					class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
				>
					<Search class="size-6 text-muted-foreground" />
				</span>
			</div>
		</div>
		<section
			class="mt-2 p-4 pb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full h-full overflow-y-auto scroll-area"
		>
			<Card
				v-for="(item, i) in itemsFiltered"
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
						class="flex p-0 text-center flex-col md:text-sm justify-start gap-y-4 items-center"
					>
						<Avatar class="rounded-lg m-0 p-0 w-18 h-16">
							<AvatarImage :src="item.imgUrl" alt="@unovue" class="p-0" />
						</Avatar>
						{{ item.title }}
					</CardTitle>
				</CardHeader>
				<CardContent
					v-if="item.desc"
					class="flex py-0 items-center text-xs text-muted-foreground justify-center"
				>
					{{
						item.desc?.length > 50 ? item.desc.slice(0, 50) + "…" : item.desc
					}}
				</CardContent>
			</Card>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useSceneManager, ItemTypes, type Item } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
import { Search } from "lucide-vue-next";
import { useAISuggestions } from "@/stores/ai-suggestions";

const itemsFiltered = computed(() =>
	items.value.filter(
		(e) =>
			(e.desc?.toLowerCase().includes(search.value.toLowerCase()) ||
				e.title.toLowerCase().includes(search.value.toLowerCase())) &&
			(filterSearch.value === "all" ? true : filterSearch.value === e.type)
	)
);

const search = ref("");

const sceneManager = useSceneManager();
const filterSearch = ref("all");
const suggestionsStore = useAISuggestions();

const handleItemSelection = (item: Item) => {
	if (!hub.value) return;
	const index = hub.value.floors.findIndex(
		(e) => e.level === selectedFloor.value
	);
	hub.value.floors[index].items.push(item);

	suggestionsStore.generateSuggestions(hub.value);
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
