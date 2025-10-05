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
				title: "Life Support Systems",
				description:
					"Your life support systems are positioned together. Ensure oxygen generators and CO2 scrubbers have redundancy for safety.",
				timestamp: Date.now() - 3600000,
			},
			{
				id: "2",
				type: "warn",
				title: "Volume Capacity Warning",
				description:
					"Ground floor is approaching 70% capacity. Consider optimizing space usage or planning additional modules.",
				timestamp: Date.now() - 1800000,
			},
			{
				id: "3",
				type: "error",
				title: "Noise Level Warning",
				description:
					"High noise equipment detected near crew quarters. Life support systems should be isolated from sleeping areas.",
				timestamp: Date.now() - 900000,
			},
			{
				id: "4",
				type: "info",
				title: "Power Distribution",
				description:
					"Power battery placement is adequate for current load. Monitor high-consumption systems like thermal control and oxygen generation.",
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
						description: `Floor is at ${capacityPercentage.toFixed(1)}% capacity (${totalVolume.toFixed(1)}m³/${floor.volume}m³). Immediate action required.`,
						timestamp: Date.now(),
					});
				} else if (capacityPercentage > 70) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "warn",
						title: `Floor ${floor.level}: High Capacity`,
						description: `Floor is at ${capacityPercentage.toFixed(1)}% capacity (${totalVolume.toFixed(1)}m³/${floor.volume}m³). Consider planning expansion.`,
						timestamp: Date.now(),
					});
				} else if (capacityPercentage > 0) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "info",
						title: `Floor ${floor.level}: Good Capacity`,
						description: `Floor is at ${capacityPercentage.toFixed(1)}% capacity (${totalVolume.toFixed(1)}m³/${floor.volume}m³). Space is well utilized.`,
						timestamp: Date.now(),
					});
				}

				// Calculate power consumption
				const totalPower = floor.items.reduce(
					(sum, item) => sum + (item.power || 0),
					0
				);

				if (totalPower > 15) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "warn",
						title: `High Power Consumption`,
						description: `Total power consumption is ${totalPower.toFixed(1)} kW. Ensure battery and power generation systems can handle the load.`,
						timestamp: Date.now(),
					});
				}

				// Check for noisy equipment near crew quarters
				const noisyItems = floor.items.filter((item) => (item.noise || 0) > 55);
				const crewItems = floor.items.filter((item) => item.type === "crew");

				noisyItems.forEach((noisy) => {
					crewItems.forEach((crew) => {
						const distance = Math.sqrt(
							Math.pow(noisy.x - crew.x, 2) +
								Math.pow(noisy.y - crew.y, 2) +
								Math.pow(noisy.z - crew.z, 2)
						);

						if (distance < 8) {
							newSuggestions.push({
								id: String(idCounter++),
								type: "error",
								title: `Noise Pollution Alert`,
								description: `${noisy.title} (${noisy.noise}dB) is only ${distance.toFixed(1)}m from ${crew.title}. Crew rest areas require acoustic isolation from machinery.`,
								timestamp: Date.now(),
							});
						} else if (distance < 12) {
							newSuggestions.push({
								id: String(idCounter++),
								type: "warn",
								title: `Noise Level Concern`,
								description: `${noisy.title} (${noisy.noise}dB) is ${distance.toFixed(1)}m from ${crew.title}. Consider increasing distance for better crew comfort.`,
								timestamp: Date.now(),
							});
						}
					});
				});

				// Check for life support system proximity to medical
				const lifeSupportItems = floor.items.filter(
					(item) => item.type === "life-support"
				);
				const medicalItems = floor.items.filter(
					(item) => item.type === "medical"
				);

				if (lifeSupportItems.length > 0 && medicalItems.length > 0) {
					lifeSupportItems.forEach((lifeSupport) => {
						medicalItems.forEach((medical) => {
							const distance = Math.sqrt(
								Math.pow(lifeSupport.x - medical.x, 2) +
									Math.pow(lifeSupport.y - medical.y, 2) +
									Math.pow(lifeSupport.z - medical.z, 2)
							);

							if (distance > 15) {
								newSuggestions.push({
									id: String(idCounter++),
									type: "info",
									title: `Medical Bay Positioning`,
									description: `${medical.title} is ${distance.toFixed(1)}m from ${lifeSupport.title}. Medical facilities should be accessible from all critical areas.`,
									timestamp: Date.now(),
								});
							}
						});
					});
				}

				// Check airlock isolation
				const airlockItems = floor.items.filter(
					(item) => item.type === "airlock"
				);
				if (airlockItems.length > 0) {
					const otherItems = floor.items.filter(
						(item) => item.type !== "airlock"
					);
					airlockItems.forEach((airlock) => {
						const tooClose = otherItems.filter((item) => {
							const distance = Math.sqrt(
								Math.pow(airlock.x - item.x, 2) +
									Math.pow(airlock.y - item.y, 2) +
									Math.pow(airlock.z - item.z, 2)
							);
							return distance < 3 && item.type !== "infrastructure";
						});

						if (tooClose.length > 2) {
							newSuggestions.push({
								id: String(idCounter++),
								type: "warn",
								title: `Airlock Congestion`,
								description: `${airlock.title} has multiple items nearby. Airlock should be isolated during EVA operations for safety.`,
								timestamp: Date.now(),
							});
						}
					});
				}

				// Check heavy items for load distribution
				const heavyItems = floor.items.filter((item) => (item.mass || 0) > 300);
				if (heavyItems.length > 0) {
					const heavyPositions = new Map<string, number>();
					heavyItems.forEach((item) => {
						const gridKey = `${Math.floor(item.x / 3)},${Math.floor(item.z / 3)}`;
						heavyPositions.set(gridKey, (heavyPositions.get(gridKey) || 0) + 1);
					});

					heavyPositions.forEach((count, position) => {
						if (count > 1) {
							newSuggestions.push({
								id: String(idCounter++),
								type: "warn",
								title: `Load Distribution Warning`,
								description: `Multiple heavy items detected in same area (grid ${position}). Consider floor load distribution and structural support.`,
								timestamp: Date.now(),
							});
						}
					});
				}

				// Check for critical systems redundancy
				const oxygenGenerators = floor.items.filter((item) =>
					item.title.includes("Oxygen")
				);
				if (oxygenGenerators.length < 2) {
					newSuggestions.push({
						id: String(idCounter++),
						type: "warn",
						title: `Life Support Redundancy`,
						description: `Only ${oxygenGenerators.length} oxygen generation system detected. Critical life support systems should have redundancy.`,
						timestamp: Date.now(),
					});
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
				description: `Lunar base "${hub.title}" has ${totalFloors} module${totalFloors !== 1 ? "s" : ""} with ${totalItems} item${totalItems !== 1 ? "s" : ""} total.`,
				timestamp: Date.now(),
			});

			// Check for essential systems presence
			const hasCommand = hub.floors.some((f) =>
				f.items.some((i) => i.type === "command")
			);
			const hasLifeSupport = hub.floors.some((f) =>
				f.items.some((i) => i.type === "life-support")
			);
			const hasCrew = hub.floors.some((f) =>
				f.items.some((i) => i.type === "crew")
			);
			const hasMedical = hub.floors.some((f) =>
				f.items.some((i) => i.type === "medical")
			);

			if (!hasCommand) {
				newSuggestions.push({
					id: String(idCounter++),
					type: "error",
					title: "Missing Command Systems",
					description:
						"No command/control systems detected. Base requires operational command center.",
					timestamp: Date.now(),
				});
			}

			if (!hasLifeSupport) {
				newSuggestions.push({
					id: String(idCounter++),
					type: "error",
					title: "Missing Life Support",
					description:
						"No life support systems detected. Critical for crew survival.",
					timestamp: Date.now(),
				});
			}

			if (!hasCrew && hasCommand) {
				newSuggestions.push({
					id: String(idCounter++),
					type: "warn",
					title: "No Crew Quarters",
					description:
						"No crew quarters detected. Add sleeping pods and personal storage for crew well-being.",
					timestamp: Date.now(),
				});
			}

			if (!hasMedical) {
				newSuggestions.push({
					id: String(idCounter++),
					type: "warn",
					title: "No Medical Facilities",
					description:
						"No medical bay detected. Medical facilities are essential for crew health and emergencies.",
					timestamp: Date.now(),
				});
			}

			// Replace all suggestions with new ones
			suggestions.value = newSuggestions;
		};

		const getErrors = () => {
			return suggestions.value.filter((s) => s.type === "error");
		};

		const getWarns = () => {
			return suggestions.value.filter((s) => s.type === "warn");
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
			getErrors,
			getWarns,
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
