import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import type { Hub, Item, ItemType } from "../../stores/scene-manager";

export default defineLazyEventHandler(async () => {
	const config = useRuntimeConfig();
	const apiKey = config.geminiApiKey;

	if (!apiKey) {
		throw new Error(
			"Missing Gemini API key. Please set NUXT_GEMINI_API_KEY in your environment variables."
		);
	}

	const google = createGoogleGenerativeAI({ apiKey });

	return defineEventHandler(async (event: any) => {
		const {
			crewSize,
			missionDays,
			objective,
			title,
			description,
			availableItems,
		}: {
			crewSize: number;
			missionDays: number;
			objective: string;
			title: string;
			description: string;
			availableItems: Item[];
		} = await readBody(event);

		// Categorize available items by type
		const itemsByType: Record<string, Item[]> = availableItems.reduce(
			(acc, item) => {
				if (!acc[item.type]) acc[item.type] = [];
				acc[item.type].push(item);
				return acc;
			},
			{} as Record<string, Item[]>
		);

		// Generate hub layout
		const layoutResult = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: z.object({
				floors: z.array(
					z.object({
						level: z.number(),
						type: z.enum(["inflatable", "metallic", "hybrid"]),
						volume: z.number().describe("Floor volume in cubic meters"),
						items: z.array(
							z.object({
								title: z.string(),
								type: z.string(),
								x: z.number(),
								y: z.number(),
								z: z.number(),
								orientation: z.number().optional(),
							})
						),
					})
				),
			}),
			prompt: `Design a lunar base layout for:
- Mission: ${title}
- Description: ${description}
- Crew: ${crewSize} people
- Duration: ${missionDays} days
- Objective: ${objective}

Available items by category:
${Object.entries(itemsByType)
	.map(
		([type, items]) =>
			`${type.toUpperCase()}: ${items.map((i) => `${i.title} (${i.desc || "no description"})`).join(", ")}`
	)
	.join("\n")}

REQUIREMENTS:
1. Create ${crewSize <= 2 ? 1 : crewSize <= 4 ? 2 : 3} floor(s) for this crew size
2. Each floor should be 400-600 m³ volume
3. Essential items for crew size ${crewSize}:
   - ${crewSize} sleeping pods minimum
   - Command consoles for operations
   - Life support systems (oxygen, CO2 scrubber, water recycler, thermal control)
   - Medical facilities
   - Galley/food area with dining
   - Storage for ${missionDays} days
   - Airlock and EVA equipment
   - Power systems
4. Place items with realistic spacing:
   - x, z: -8 to 8 range (floor area)
   - y: 0 for floor items, 1-2.5 for wall-mounted items
   - Avoid overlapping positions
5. Group related items together (e.g., command items in one area, crew quarters in another)
6. Consider noise separation (put noisy life-support away from crew quarters)

Design a complete, functional base layout with specific positions for each item.`,
		});

		// Map generated layout to actual items with full details
		const hubFloors = layoutResult.object.floors.map((floor) => {
			const floorItems = floor.items
				.map((genItem) => {
					// Find the matching item from available items
					const matchingItem = availableItems.find(
						(item) => item.title === genItem.title && item.type === genItem.type
					);

					if (!matchingItem) {
						console.warn(`Item not found: ${genItem.title} (${genItem.type})`);
						return null;
					}

					// Return full item with generated position
					return {
						...matchingItem,
						x: genItem.x,
						y: genItem.y,
						z: genItem.z,
						orientation: genItem.orientation || matchingItem.orientation || 0,
					};
				})
				.filter((item) => item !== null) as Item[];

			return {
				level: floor.level,
				type: floor.type,
				volume: floor.volume,
				modelUrl: "models/lunar_base_main.glb",
				acceptedItemTypes: [
					"command",
					"crew",
					"life-support",
					"airlock",
					"medical",
					"galley",
					"storage",
					"utility",
					"infrastructure",
				] as ItemType[],
				items: floorItems,
			};
		});

		// Create the complete hub
		const hub: Hub = {
			title,
			desc: description,
			author: "AI Mission Planner",
			floors: hubFloors,
		};

		return {
			success: true,
			hub,
			stats: {
				totalFloors: hub.floors.length,
				totalItems: hub.floors.reduce(
					(sum, floor) => sum + floor.items.length,
					0
				),
			},
		};
	});
});
