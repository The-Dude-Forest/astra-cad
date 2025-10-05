<script setup lang="ts">
import { computed } from "vue";
import { useSceneManager } from "@/stores/scene-manager";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	User,
	Building2,
	Package,
	Hash,
	Zap,
	Volume2,
	AlertTriangle,
} from "lucide-vue-next";

const sceneManager = useSceneManager();

// NASA Requirements
const NASA_REQUIREMENTS = {
	spaceUsagePercentage: 80, // Max 80% of floor volume
	powerConsumptionPerFloor: 15, // Max 15 kW per floor
	noiseAveragePerFloor: 50, // Max 50 dB average per floor
};

const totalItems = computed(() => {
	if (!sceneManager.hub) return 0;
	return sceneManager.hub.floors.reduce(
		(sum, floor) => sum + floor.items.length,
		0
	);
});

const totalVolume = computed(() => {
	if (!sceneManager.hub) return 0;
	return sceneManager.hub.floors.reduce(
		(sum, floor) => sum + (floor.volume || 0),
		0
	);
});

// Total space usage
const totalSpaceUsed = computed(() => {
	if (!sceneManager.hub) return 0;
	return sceneManager.hub.floors.reduce(
		(sum, floor) =>
			sum +
			floor.items.reduce((itemSum, item) => itemSum + (item.volume || 0), 0),
		0
	);
});

const totalSpacePercentage = computed(() => {
	if (totalVolume.value === 0) return 0;
	return (totalSpaceUsed.value / totalVolume.value) * 100;
});

// Total power consumption
const totalPower = computed(() => {
	if (!sceneManager.hub) return 0;
	return sceneManager.hub.floors.reduce(
		(sum, floor) =>
			sum +
			floor.items.reduce((itemSum, item) => itemSum + (item.power || 0), 0),
		0
	);
});

// Total noise (weighted average)
const totalNoiseAverage = computed(() => {
	if (!sceneManager.hub) return 0;
	let totalNoise = 0;
	let itemCount = 0;

	sceneManager.hub.floors.forEach((floor) => {
		floor.items.forEach((item) => {
			if (item.noise && item.noise > 0) {
				totalNoise += item.noise;
				itemCount++;
			}
		});
	});

	return itemCount > 0 ? totalNoise / itemCount : 0;
});

// Per-floor calculations
const floorMetrics = computed(() => {
	if (!sceneManager.hub) return [];
	return sceneManager.hub.floors.map((floor) => {
		const spaceUsed = floor.items.reduce(
			(sum, item) => sum + (item.volume || 0),
			0
		);
		const spacePercentage = floor.volume ? (spaceUsed / floor.volume) * 100 : 0;
		const power = floor.items.reduce((sum, item) => sum + (item.power || 0), 0);

		let noiseSum = 0;
		let noiseCount = 0;
		floor.items.forEach((item) => {
			if (item.noise && item.noise > 0) {
				noiseSum += item.noise;
				noiseCount++;
			}
		});
		const noiseAverage = noiseCount > 0 ? noiseSum / noiseCount : 0;

		return {
			level: floor.level,
			type: floor.type,
			itemCount: floor.items.length,
			spaceUsed: spaceUsed.toFixed(1),
			spaceCapacity: floor.volume || 0,
			spacePercentage: spacePercentage.toFixed(1),
			power: power.toFixed(1),
			noiseAverage: noiseAverage.toFixed(1),
			errors: {
				space: spacePercentage > NASA_REQUIREMENTS.spaceUsagePercentage,
				power: power > NASA_REQUIREMENTS.powerConsumptionPerFloor,
				noise: noiseAverage > NASA_REQUIREMENTS.noiseAveragePerFloor,
			},
		};
	});
});

// Check if total requirements are met
const hasErrors = computed(() => {
	return floorMetrics.value.some(
		(floor) => floor.errors.space || floor.errors.power || floor.errors.noise
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
				</div>

				<Separator />

				<!-- Total Metrics -->
				<div class="space-y-3">
					<p class="text-sm font-semibold">Total Resources</p>

					<!-- Total Space Usage -->
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Hash class="h-4 w-4" />
							<span>Space Usage</span>
						</div>
						<Badge variant="outline">
							{{ totalSpaceUsed.toFixed(1) }} / {{ totalVolume }} m³
							<span class="ml-1 text-xs text-muted-foreground">
								({{ totalSpacePercentage.toFixed(1) }}%)
							</span>
						</Badge>
					</div>

					<!-- Total Power -->
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Zap class="h-4 w-4" />
							<span>Power Consumption</span>
						</div>
						<Badge variant="outline">{{ totalPower.toFixed(1) }} kW</Badge>
					</div>

					<!-- Total Noise -->
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2 text-muted-foreground">
							<Volume2 class="h-4 w-4" />
							<span>Avg. Noise Level</span>
						</div>
						<Badge variant="outline"
							>{{ totalNoiseAverage.toFixed(1) }} dB</Badge
						>
					</div>
				</div>

				<Separator />

				<!-- Floor Breakdown -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<p class="text-sm font-semibold">Floor Breakdown</p>
						<Badge v-if="hasErrors" variant="destructive" class="text-xs">
							<AlertTriangle class="h-3 w-3 mr-1" />
							NASA Violations
						</Badge>
					</div>

					<div class="space-y-3">
						<div
							v-for="metric in floorMetrics"
							:key="metric.level"
							class="rounded-lg border border-border p-3 space-y-2"
							:class="{
								'border-destructive bg-destructive/5':
									metric.errors.space ||
									metric.errors.power ||
									metric.errors.noise,
							}"
						>
							<!-- Floor Header -->
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<Badge variant="secondary" class="text-xs">
										{{ metric.level === 0 ? "Ground" : `L${metric.level}` }}
									</Badge>
									<span class="text-xs text-muted-foreground capitalize">
										{{ metric.type }}
									</span>
								</div>
								<span class="text-xs text-muted-foreground">
									{{ metric.itemCount }} items
								</span>
							</div>

							<!-- Floor Metrics -->
							<div class="space-y-1.5">
								<!-- Space Usage -->
								<div class="flex items-center justify-between text-xs">
									<div class="flex items-center gap-1.5">
										<Hash class="h-3 w-3 text-muted-foreground" />
										<span class="text-muted-foreground">Space</span>
									</div>
									<div class="flex items-center gap-1">
										<Badge
											:variant="metric.errors.space ? 'destructive' : 'outline'"
											class="text-xs"
										>
											{{ metric.spaceUsed }} / {{ metric.spaceCapacity }} m³ ({{
												metric.spacePercentage
											}}%)
										</Badge>
										<AlertTriangle
											v-if="metric.errors.space"
											class="h-3 w-3 text-destructive"
										/>
									</div>
								</div>

								<!-- Power Consumption -->
								<div class="flex items-center justify-between text-xs">
									<div class="flex items-center gap-1.5">
										<Zap class="h-3 w-3 text-muted-foreground" />
										<span class="text-muted-foreground">Power</span>
									</div>
									<div class="flex items-center gap-1">
										<Badge
											:variant="metric.errors.power ? 'destructive' : 'outline'"
											class="text-xs"
										>
											{{ metric.power }} kW
										</Badge>
										<AlertTriangle
											v-if="metric.errors.power"
											class="h-3 w-3 text-destructive"
										/>
									</div>
								</div>

								<!-- Noise Level -->
								<div class="flex items-center justify-between text-xs">
									<div class="flex items-center gap-1.5">
										<Volume2 class="h-3 w-3 text-muted-foreground" />
										<span class="text-muted-foreground">Noise</span>
									</div>
									<div class="flex items-center gap-1">
										<Badge
											:variant="metric.errors.noise ? 'destructive' : 'outline'"
											class="text-xs"
										>
											{{ metric.noiseAverage }} dB
										</Badge>
										<AlertTriangle
											v-if="metric.errors.noise"
											class="h-3 w-3 text-destructive"
										/>
									</div>
								</div>
							</div>

							<!-- Error Messages -->
							<div
								v-if="
									metric.errors.space ||
									metric.errors.power ||
									metric.errors.noise
								"
								class="pt-2 border-t border-destructive/20"
							>
								<div class="space-y-1">
									<p
										v-if="metric.errors.space"
										class="text-xs text-destructive"
									>
										⚠️ Space exceeds NASA limit ({{
											NASA_REQUIREMENTS.spaceUsagePercentage
										}}%)
									</p>
									<p
										v-if="metric.errors.power"
										class="text-xs text-destructive"
									>
										⚠️ Power exceeds NASA limit ({{
											NASA_REQUIREMENTS.powerConsumptionPerFloor
										}}
										kW)
									</p>
									<p
										v-if="metric.errors.noise"
										class="text-xs text-destructive"
									>
										⚠️ Noise exceeds NASA limit ({{
											NASA_REQUIREMENTS.noiseAveragePerFloor
										}}
										dB)
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
