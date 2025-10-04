<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useSceneManager } from "@/stores/scene-manager";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Layers, Package, Plus, Trash2 } from "lucide-vue-next";

const sceneManager = useSceneManager();

const accordionValue = ref(
	sceneManager.selectedFloor >= 0
		? `floor-${sceneManager.selectedFloor}`
		: undefined
);

const sortedFloors = computed(() => {
	return [...sceneManager.hub.floors].sort((a, b) => b.level - a.level);
});

watch(accordionValue, (newValue) => {
	if (newValue) {
		const floorLevel = parseInt(newValue.replace("floor-", ""));
		if (!isNaN(floorLevel)) {
			sceneManager.selectedFloor = floorLevel;
		}
	} else {
		sceneManager.selectedFloor = -1;
	}
});

watch(
	() => sceneManager.selectedFloor,
	(newFloor) => {
		if (newFloor >= 0) {
			accordionValue.value = `floor-${newFloor}`;
		} else {
			accordionValue.value = undefined;
		}
	}
);

function updateFloorType(floorLevel: number, value: string) {
	const floor = sceneManager.hub.floors.find((f) => f.level === floorLevel);
	if (floor) {
		floor.type = value;
	}
}

function updateFloorVolume(floorLevel: number, value: number) {
	const floor = sceneManager.hub.floors.find((f) => f.level === floorLevel);
	if (floor) {
		floor.volume = value;
	}
}

function removeItem(floorLevel: number, itemIndex: number) {
	const floor = sceneManager.hub.floors.find((f) => f.level === floorLevel);
	if (floor) {
		floor.items.splice(itemIndex, 1);
	}
}

function removeFloor(floorLevel: number) {
	if (sceneManager.hub.floors.length > 1) {
		const floorIndex = sceneManager.hub.floors.findIndex(
			(f) => f.level === floorLevel
		);
		if (floorIndex !== -1) {
			sceneManager.hub.floors.splice(floorIndex, 1);
			sceneManager.hub.floors.forEach((floor, index) => {
				floor.level = index;
			});
			if (sceneManager.selectedFloor >= sceneManager.hub.floors.length) {
				sceneManager.selectedFloor = sceneManager.hub.floors.length - 1;
			}
		}
	}
}
</script>

<template>
	<div class="h-full w-full overflow-y-auto p-4 bg-background">
		<div class="max-w-4xl mx-auto space-y-4 text-foreground">
			<Accordion
				v-model="accordionValue"
				type="single"
				collapsible
				class="w-full"
			>
				<AccordionItem
					v-for="floor in sortedFloors"
					:key="`floor-${floor.level}`"
					:value="`floor-${floor.level}`"
					class="mb-2"
				>
					<AccordionTrigger
						class="hover:no-underline cursor-pointer data-[state=open]:bg-accent px-4"
					>
						<div class="flex items-center gap-3 flex-1">
							<Layers class="h-4 w-4" />
							<Badge variant="secondary">{{
								floor.level === 0 ? "Ground Level" : `Level ${floor.level}`
							}}</Badge>
							<span class="text-sm text-muted-foreground">
								{{ floor.items.length }} item(s)
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent class="px-4 mt-2">
						<div class="space-y-4 pt-2">
							<div class="grid grid-cols-2 gap-3">
								<div class="space-y-2">
									<Label>Type</Label>
									<Input
										:value="floor.type"
										@input="updateFloorType(floor.level, $event.target.value)"
										placeholder="Floor type"
									/>
								</div>
								<div class="space-y-2">
									<Label>Volume</Label>
									<Input
										:value="floor.volume"
										@input="
											updateFloorVolume(
												floor.level,
												parseFloat($event.target.value) || 0
											)
										"
										type="number"
										placeholder="Volume"
									/>
								</div>
							</div>

							<Separator />

							<div class="space-y-3">
								<div class="flex items-center justify-between">
									<Label class="flex items-center gap-2">
										<Package class="h-4 w-4" />
										Items ({{ floor.items.length }})
									</Label>
								</div>

								<div
									v-for="(item, itemIndex) in floor.items"
									:key="`item-${floor.level}-${itemIndex}`"
									class="space-y-2"
								>
									<div class="flex items-center justify-between">
										<Input
											v-model="item.title"
											placeholder="Item title"
											class="font-semibold flex-1 mr-2"
										/>
										<Button
											@click="removeItem(floor.level, itemIndex)"
											size="sm"
											variant="ghost"
										>
											<Trash2 class="h-4 w-4 text-destructive" />
										</Button>
									</div>

									<Input v-model="item.desc" placeholder="Description" />

									<div class="grid grid-cols-2 gap-2">
										<Input v-model="item.type" placeholder="Type" />
										<Input
											v-model.number="item.volume"
											type="number"
											placeholder="Volume"
										/>
									</div>

									<div class="grid grid-cols-3 gap-2">
										<Input
											v-model.number="item.x"
											type="number"
											placeholder="X"
										/>
										<Input
											v-model.number="item.y"
											type="number"
											placeholder="Y"
										/>
										<Input
											v-model.number="item.z"
											type="number"
											placeholder="Z"
										/>
									</div>

									<Input
										v-model.number="item.orientation"
										type="number"
										placeholder="Orientation (degrees)"
									/>
								</div>

								<div
									v-if="floor.items.length === 0"
									class="text-center text-sm text-muted-foreground py-4"
								>
									No items in this floor. Add an item to get started.
								</div>
							</div>

							<Separator />

							<Button
								@click="removeFloor(floor.level)"
								variant="destructive"
								size="sm"
								class="w-full"
								:disabled="sceneManager.hub.floors.length === 1"
							>
								<Trash2 class="h-4 w-4 mr-2" />
								Remove Floor
							</Button>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</template>
