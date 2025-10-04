<template>
	<div class="p-2 h-full w-full text-foreground bg-background">
		<Select v-model="filterSearch">
			<SelectTrigger class="w-[180px] bg-secondary">
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
		<section class="h-auto mt-2 flex justify-center w-full">
			<Carousel
				class="w-[calc(100%-8rem)]"
				:opts="{
					align: 'start',
				}"
			>
				<CarouselContent class="-ml-1">
					<CarouselItem
						v-for="(item, index) in items"
						:key="index"
						class="pl-1 md:basis-1/2 lg:basis-1/3"
					>
						<div class="p-1">
							<Card
								class="cursor-pointer select-none transition-all h-40 pt-2 gap-y-3"
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
												:src="`https://avatar.vercel.sh/${index}`"
												alt="@unovue"
												class="p-0"
											/>
										</Avatar>
									</CardDescription>
								</CardHeader>
								<CardContent
									class="flex py-0 items-center text-xs text-muted-foreground justify-center"
								>
									{{ item.desc }}
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useSceneManager, ItemTypes, type Item } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
const sceneManager = useSceneManager();
const filterSearch = ref("all");

const handleItemSelection = (item: Item) => {
	if (item.modelUrl === selectedItem.value?.modelUrl)
		selectedItem.value = undefined;
	else selectedItem.value = item;
};

const { hub, selectedFloor, items, selectedItem } = storeToRefs(sceneManager);
</script>
