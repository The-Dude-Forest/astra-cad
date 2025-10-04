import { defineStore } from "pinia";
import type { Hub } from "./scene-manager";

export type SuggestionType = "info" | "warn" | "error";

export type Suggestion = {
	id: string;
	type: SuggestionType;
	title: string;
	description: string;
	timestamp: number;
};

export const useAISuggestions = defineStore(
	"AISuggestions",
	() => {
		const suggestions = ref<Suggestion[]>([
			{
				id: "1",
				type: "info",
				title: "Optimal Floor Layout",
				description:
					"Your ground floor has a balanced distribution of lab and power facilities. Consider adding ventilation systems.",
				timestamp: Date.now() - 3600000,
			},
			{
				id: "2",
				type: "warn",
				title: "Volume Capacity Warning",
				description:
					"Ground floor is approaching 70% capacity (200/500). Plan for expansion or optimize space usage.",
				timestamp: Date.now() - 1800000,
			},
			{
				id: "3",
				type: "error",
				title: "Safety Compliance Issue",
				description:
					"Power Core and Fusion Lab are too close. Minimum distance of 20 units required for safety regulations.",
				timestamp: Date.now() - 900000,
			},
			{
				id: "4",
				type: "info",
				title: "Energy Efficiency",
				description:
					"Current Power Core placement is optimal for distributing energy across all facilities.",
				timestamp: Date.now() - 600000,
			},
		]);

		const generateSuggestions = (hub: Hub) => {
			const newSuggestions: Suggestion[] = [];
			let idCounter = suggestions.value.length + 1;

			// Check each floor
			hub.floors.forEach((floor) => {
				// Calculate total volume used
				const totalVolume = floor.items.reduce(
					(sum, item) => sum + (item.volume || 0),
					0
				);
				const capacityPercentage = floor.volume
					? (totalVolume / floor.volume) * 100
					: 0;

				// Volume capacity warnings
				if (capacityPercentage > 90) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "error",
						title: `Floor ${floor.level}: Critical Capacity`,
						description: `Floor is at ${capacityPercentage.toFixed(1)}% capacity (${totalVolume}/${floor.volume}). Immediate action required.`,
						timestamp: Date.now(),
					});
				} else if (capacityPercentage > 70) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "warn",
						title: `Floor ${floor.level}: High Capacity`,
						description: `Floor is at ${capacityPercentage.toFixed(1)}% capacity (${totalVolume}/${floor.volume}). Consider planning expansion.`,
						timestamp: Date.now(),
					});
				} else if (capacityPercentage > 0) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "info",
						title: `Floor ${floor.level}: Good Capacity`,
						description: `Floor is at ${capacityPercentage.toFixed(1)}% capacity (${totalVolume}/${floor.volume}). Space is well utilized.`,
						timestamp: Date.now(),
					});
				}

				// Check item proximity (simplified distance check)
				for (let i = 0; i < floor.items.length; i++) {
					for (let j = i + 1; j < floor.items.length; j++) {
						const item1 = floor.items[i];
						const item2 = floor.items[j];
						const distance = Math.sqrt(
							Math.pow(item1.x - item2.x, 2) +
								Math.pow(item1.y - item2.y, 2) +
								Math.pow(item1.z - item2.z, 2)
						);

						if (
							distance < 20 &&
							(item1.type === "power" || item2.type === "power")
						) {
							newSuggestions.push({
								id: String(idCounter++),
								type: "error",
								title: `Safety Distance Violation`,
								description: `${item1.title} and ${item2.title} are only ${distance.toFixed(1)} units apart. Minimum safe distance is 20 units.`,
								timestamp: Date.now(),
							});
						} else if (
							distance < 15 &&
							item1.type === "lab" &&
							item2.type === "lab"
						) {
							newSuggestions.push({
								id: String(idCounter++),
								type: "warn",
								title: `Lab Proximity Warning`,
								description: `${item1.title} and ${item2.title} are ${distance.toFixed(1)} units apart. Consider more spacing for better workflow.`,
								timestamp: Date.now(),
							});
						}
					}
				}

				// Check type compliance
				floor.items.forEach((item) => {
					if (!floor.acceptedItemTypes.includes(item.type)) {
						newSuggestions.push({
							id: String(idCounter++),
							type: "error",
							title: `Invalid Item Placement`,
							description: `${item.title} (type: ${item.type}) is not allowed on Floor ${floor.level}. Accepted types: ${floor.acceptedItemTypes.join(", ")}.`,
							timestamp: Date.now(),
						});
					}
				});
			});

			// General suggestions
			const totalItems = hub.floors.reduce(
				(sum, floor) => sum + floor.items.length,
				0
			);
			const totalFloors = hub.floors.length;

			newSuggestions.push({
				id: String(idCounter++),
				type: "info",
				title: "Hub Overview",
				description: `Your hub "${hub.title}" has ${totalFloors} floor${totalFloors !== 1 ? "s" : ""} with ${totalItems} item${totalItems !== 1 ? "s" : ""} total.`,
				timestamp: Date.now(),
			});

			// Replace all suggestions with new ones
			suggestions.value = newSuggestions;
		};

		const clearSuggestions = () => {
			suggestions.value = [];
		};

		const removeSuggestion = (id: string) => {
			suggestions.value = suggestions.value.filter((s) => s.id !== id);
		};

		return {
			suggestions,
			generateSuggestions,
			clearSuggestions,
			removeSuggestion,
		};
	},
	{
		persist: [
			{
				pick: ["suggestions"],
				storage: localStorage,
			},
		],
	}
);
