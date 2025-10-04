<script setup lang="ts">
import { computed } from "vue";
import { useSceneManager } from "@/stores/scene-manager";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Package, Hash } from "lucide-vue-next";

const sceneManager = useSceneManager();

const totalItems = computed(() => {
	return sceneManager.hub.floors.reduce(
		(sum, floor) => sum + floor.items.length,
		0
	);
});

const totalVolume = computed(() => {
	return sceneManager.hub.floors.reduce(
		(sum, floor) => sum + (floor.volume || 0),
		0
	);
});
</script>

<template>
	<div class="flex flex-col gap-4 h-full text-foreground">
		<div class="space-y-2">
			<div class="space-y-4">
				<p class="text-sm text-muted-foreground">{{ sceneManager.hub.desc }}</p>

				<Separator />

				<div class="space-y-3">
					<p class="text-sm font-semibold">Mission Details</p>

					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<User class="h-4 w-4" />
							<span>Author</span>
						</div>
						<Badge variant="outline">{{
							sceneManager.hub.author || "Unknown"
						}}</Badge>
					</div>

					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Building2 class="h-4 w-4" />
							<span>Floors</span>
						</div>
						<Badge variant="outline">{{
							sceneManager.hub.floors.length
						}}</Badge>
					</div>

					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Package class="h-4 w-4" />
							<span>Total Items</span>
						</div>
						<Badge variant="outline">{{ totalItems }}</Badge>
					</div>

					<!-- Total Volume -->
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Hash class="h-4 w-4" />
							<span>Total Volume</span>
						</div>
						<Badge variant="outline">{{ totalVolume }} m³</Badge>
					</div>
				</div>

				<Separator />

				<!-- Floor Breakdown -->
				<div class="space-y-3">
					<p class="text-sm font-semibold">Floor Breakdown</p>
					<div class="space-y-2">
						<div
							v-for="floor in sceneManager.hub.floors"
							:key="floor.level"
							class="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50"
						>
							<div class="flex items-center gap-2">
								<Badge variant="secondary" class="text-xs">
									{{ floor.level === 0 ? "Ground" : `L${floor.level}` }}
								</Badge>
								<span class="text-muted-foreground capitalize">{{
									floor.type
								}}</span>
							</div>
							<div
								class="flex items-center gap-3 text-xs text-muted-foreground"
							>
								<span>{{ floor.items.length }} items</span>
								<span v-if="floor.volume">{{ floor.volume }} m³</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
