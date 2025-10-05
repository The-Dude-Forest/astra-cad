import { tool } from "ai";
import { z } from "zod";
import type { Item } from "../../stores/scene-manager";

export const getAvailableItemsTool = (items: Item[] = []) =>
	tool({
		name: "Getting available items",
		description:
			"Get the list of available items that can be placed in the lunar base. Use this when user asks about what items are available, what equipment they can use, or what components they can add to their base. After calling this tool, provide a helpful response about the items.",
		inputSchema: z.object({
			type: z
				.enum([
					"command",
					"crew",
					"life-support",
					"airlock",
					"medical",
					"galley",
					"storage",
					"utility",
					"infrastructure",
					"all",
				])
				.optional()
				.describe("Filter items by type. Use 'all' or omit to get all items."),
		}),
		execute: async ({ type }) => {
			const filteredItems =
				!type || type === "all"
					? items
					: items.filter((item: Item) => item.type === type);

			const itemsByType = filteredItems.reduce(
				(acc: Record<string, number>, item: Item) => {
					acc[item.type] = (acc[item.type] || 0) + 1;
					return acc;
				},
				{}
			);

			return {
				summary: `Found ${filteredItems.length} available items${type && type !== "all" ? ` of type '${type}'` : ""}.`,
				itemCount: filteredItems.length,
				itemsByType,
				items: filteredItems.map((item: Item) => ({
					title: item.title,
					desc: item.desc,
					type: item.type,
					volume: item.volume,
					mass: item.mass,
					power: item.power,
					noise: item.noise,
					notes: item.notes,
				})),
			};
		},
	});
