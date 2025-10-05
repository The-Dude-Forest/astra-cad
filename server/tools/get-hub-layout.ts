import { tool } from "ai";
import { z } from "zod";
import type { Hub, Floor } from "../../stores/scene-manager";

export const getHubLayoutTool = (hub?: Hub) =>
	tool({
		name: "Getting current hub layout",
		description:
			"Get the current lunar base (hub) configuration including all floors, placed items, and their specifications. Use this when user asks about their current base layout, what items they have placed, or when analyzing problems with the design. This is ESSENTIAL for understanding the current state before suggesting fixes.",
		inputSchema: z.object({
			includeItemDetails: z
				.boolean()
				.optional()
				.describe(
					"Include detailed specifications for each item (volume, mass, power, noise). Default: true"
				),
		}),
		execute: async ({ includeItemDetails = true }) => {
			if (!hub) {
				return {
					error: "No hub data available",
					summary: "Hub layout is not initialized yet.",
				};
			}

			const totalFloors = hub.floors.length;
			const totalItems = hub.floors.reduce(
				(sum: number, floor: Floor) => sum + floor.items.length,
				0
			);

			// Calculate total power consumption
			const totalPower = hub.floors.reduce(
				(sum: number, floor: Floor) =>
					sum +
					floor.items.reduce((itemSum, item) => itemSum + (item.power || 0), 0),
				0
			);

			// Calculate total volume used
			const totalVolumeUsed = hub.floors.reduce(
				(sum: number, floor: Floor) =>
					sum +
					floor.items.reduce(
						(itemSum, item) => itemSum + (item.volume || 0),
						0
					),
				0
			);

			const totalVolumeCapacity = hub.floors.reduce(
				(sum: number, floor: Floor) => sum + (floor.volume || 0),
				0
			);

			// Group items by type across all floors
			const itemsByType: Record<string, number> = {};
			hub.floors.forEach((floor: Floor) => {
				floor.items.forEach((item) => {
					itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;
				});
			});

			// Build floor summaries
			const floorSummaries = hub.floors.map((floor: Floor) => {
				const floorVolume = floor.items.reduce(
					(sum, item) => sum + (item.volume || 0),
					0
				);
				const floorPower = floor.items.reduce(
					(sum, item) => sum + (item.power || 0),
					0
				);
				const capacityPercentage = floor.volume
					? ((floorVolume / floor.volume) * 100).toFixed(1)
					: "N/A";

				const floorData: any = {
					level: floor.level,
					type: floor.type,
					volumeCapacity: floor.volume,
					volumeUsed: floorVolume,
					capacityPercentage,
					powerConsumption: floorPower,
					itemCount: floor.items.length,
					acceptedTypes: floor.acceptedItemTypes,
				};

				if (includeItemDetails) {
					floorData.items = floor.items.map((item) => ({
						title: item.title,
						type: item.type,
						position: { x: item.x, y: item.y, z: item.z },
						volume: item.volume,
						mass: item.mass,
						power: item.power,
						noise: item.noise,
						notes: item.notes,
					}));
				} else {
					floorData.itemTitles = floor.items.map((item) => item.title);
				}

				return floorData;
			});

			return {
				summary: `Hub "${hub.title}" has ${totalFloors} floor(s) with ${totalItems} items total. Volume: ${totalVolumeUsed.toFixed(1)}/${totalVolumeCapacity}m³ (${((totalVolumeUsed / totalVolumeCapacity) * 100).toFixed(1)}%). Power: ${totalPower.toFixed(1)} kW.`,
				hub: {
					title: hub.title,
					description: hub.desc,
					author: hub.author,
				},
				statistics: {
					totalFloors,
					totalItems,
					totalVolumeUsed: totalVolumeUsed.toFixed(1),
					totalVolumeCapacity,
					volumePercentage: (
						(totalVolumeUsed / totalVolumeCapacity) *
						100
					).toFixed(1),
					totalPowerConsumption: totalPower.toFixed(1),
					itemsByType,
				},
				floors: floorSummaries,
			};
		},
	});
