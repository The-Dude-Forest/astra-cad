<script setup lang="ts">
import {
	Share,
	SquareStop,
	Play,
	AlertCircle,
	AlertTriangle,
	SquareArrowOutUpLeft,
	Plus,
} from "lucide-vue-next";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Drawer } from "@/components/ui/drawer";
import MobileDrawerContent from "./MobileDrawerContent.vue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Terminal from "./Terminal.vue";
import { useSceneManager } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
import { useAISuggestions } from "@/stores/ai-suggestions";
import { useIsMobile } from "@/composables/useIsMobile";

const key = ref(0);
onMounted(() => (key.value = 1));
const sceneManager = useSceneManager();
const { selectedFloor, playMode, hub } = storeToRefs(sceneManager);
const { SaveLayout } = sceneManager;
const { isMobile } = useIsMobile();

const handleShare = async () => {
	await SaveLayout();
};

const suggestionsStore = useAISuggestions();

const errors = computed(() => {
	return suggestionsStore.getErrors();
});

const warns = computed(() => {
	return suggestionsStore.getWarns();
});

// Floor options for the select
const floorOptions = computed(() => {
	const options = [{ value: "-1", label: "Hub" }];

	if (hub.value?.floors) {
		hub.value.floors.forEach((floor) => {
			const label = floor.level === 0 ? "Ground Level" : `Level ${floor.level}`;
			options.push({ value: String(floor.level), label });
		});
	}

	return options;
});

// Get current floor label
const currentFloorLabel = computed(() => {
	if (selectedFloor.value === -1) return "Hub";
	if (selectedFloor.value === 0) return "Ground Level";
	return `Level ${selectedFloor.value}`;
});

// Handle floor selection
const handleFloorChange = (value: string) => {
	if (value != null) {
		selectedFloor.value =
			typeof value === "string" ? Number(value) : Number(value);
	}
};

const addNewFloor = () => {
	if (!hub.value) return;
	const newLevel = hub.value.floors.length;
	hub.value.floors.push({
		level: newLevel,
		type: "inflatable",
		volume: 124,
		acceptedItemTypes: [],
		items: [],
		modelUrl: "models/giriskati.glb",
	});

	selectedFloor.value = newLevel;
};
</script>

<template>
	<div class="flex flex-col h-full">
		<nav
			class="flex items-center justify-between px-4 py-2 border-b border-border bg-background h-16"
		>
			<div class="flex items-center space-x-4">
				<Select
					:model-value="String(selectedFloor)"
					@update:model-value="handleFloorChange"
				>
					<SelectTrigger
						:class="
							'border border-border ' + (isMobile ? 'w-[120px]' : 'w-[180px]')
						"
					>
						<SelectValue
							:placeholder="currentFloorLabel"
							class="text-foreground"
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem
								v-for="option in floorOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</SelectItem>
						</SelectGroup>
						<Separator class="my-1" />
						<Button
							variant="ghost"
							size="sm"
							class="w-full justify-start gap-2 cursor-pointer"
							@click="addNewFloor"
						>
							<Plus class="w-4 h-4" />
							Create New Level
						</Button>
					</SelectContent>
				</Select>
				<TooltipProvider v-if="!isMobile">
					<div class="flex items-center space-x-4">
						<Tooltip>
							<TooltipTrigger as-child>
								<span class="text-red-500 flex items-center gap-2"
									><AlertCircle class="w-4 h-4" />
									{{ errors.length }} Error(s)</span
								>
							</TooltipTrigger>
							<TooltipContent>
								<ol class="list-decimal pl-3">
									<li v-for="error in errors" :key="error.id">
										<span>{{ error.title }}</span>
									</li>
								</ol>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger as-child>
								<span class="text-yellow-500 flex items-center gap-2"
									><AlertTriangle class="w-4 h-4" />
									{{ warns.length }} Warning(s)</span
								>
							</TooltipTrigger>
							<TooltipContent>
								<ol class="list-decimal pl-3">
									<li v-for="warn in warns" :key="warn.id">
										<span>{{ warn.title }}</span>
									</li>
								</ol>
							</TooltipContent>
						</Tooltip>
					</div>
				</TooltipProvider>
			</div>
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-2">
					<NuxtLink
						to="/community"
						target="_blank"
						class="inline-flex text-muted-foreground"
					>
						<Button variant="ghost">
							<SquareArrowOutUpLeft class="w-4 h-4" />
							Community
						</Button>
					</NuxtLink>
					<Button :size="isMobile ? 'icon' : 'default'" @click="handleShare()">
						<Share class="w-4 h-4" />
						<span v-if="!isMobile">Share</span>
					</Button>

					<Button
						v-if="!playMode"
						:disabled="selectedFloor === -1"
						:size="isMobile ? 'icon' : 'default'"
						class="bg-green-600 hover:bg-green-400"
						@click="playMode = true"
					>
						<Play class="pointer-events-none w-4 h-4" />
						<span v-if="!isMobile">Play</span>
					</Button>

					<Button
						v-if="playMode"
						:size="isMobile ? 'icon' : 'default'"
						class="bg-red-600 hover:bg-red-400"
						@click="playMode = false"
					>
						<SquareStop class="pointer-events-none w-4 h-4" />
						<span v-if="!isMobile">Stop</span>
					</Button>
				</div>
			</div>
		</nav>

		<!-- Desktop Layout -->
		<div v-if="!isMobile" class="flex-1 overflow-hidden">
			<ResizablePanelGroup direction="vertical">
				<ResizablePanel :default-size="65" :min-size="30">
					<div class="aspect-[4/3]">
						<SceneView :key="key" />
					</div>
				</ResizablePanel>

				<ResizableHandle :with-handle="true" />

				<ResizablePanel
					v-auto-animate
					:default-size="35"
					:min-size="10"
					:max-size="50"
					class="flex justify-center items-center"
				>
					<Terminal v-if="selectedFloor !== -1" />
					<Label v-else class="text-2xl text-white">
						Please select a level to view available items...
					</Label>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>

		<!-- Mobile Layout with Drawer -->
		<div v-else class="flex-1 overflow-hidden relative">
			<div class="h-full w-full">
				<SceneView :key="key" />
			</div>

			<Drawer
				:open="true"
				:modal="false"
				:dismissible="false"
				:should-scale-background="false"
			>
				<MobileDrawerContent class="border-t">
					<div
						class="w-12 h-1.5 bg-muted-foreground/40 rounded-full mx-auto mb-4 mt-2 cursor-grab active:cursor-grabbing"
					/>
					<div
						v-auto-animate
						class="flex justify-center items-center px-4 pb-4 max-h-[50vh] overflow-y-auto"
					>
						<Terminal v-if="selectedFloor !== -1" />
						<Label v-else class="text-lg text-white">
							Please select a level to view available items...
						</Label>
					</div>
				</MobileDrawerContent>
			</Drawer>
		</div>
	</div>
</template>
