import { tool } from "ai";
import { z } from "zod";

export const proposeLayoutChangesTool = () =>
	tool({
		name: "Proposing layout changes",
		description:
			"Propose specific changes to the lunar base layout. Use this after analyzing problems and determining solutions. The user will see these proposed changes and can choose to apply them. You should provide clear explanations for each change.",
		inputSchema: z.object({
			explanation: z
				.string()
				.describe(
					"Clear explanation of why these changes solve the identified problems"
				),
			changes: z.array(
				z.object({
					action: z
						.enum(["add", "remove", "move", "modify"])
						.describe("Type of change to make"),
					itemTitle: z.string().describe("Title of the item being changed"),
					floorLevel: z
						.number()
						.describe("Floor level where the change occurs"),
					currentPosition: z
						.object({
							x: z.number(),
							y: z.number(),
							z: z.number(),
						})
						.optional()
						.describe("Current position (for move/remove actions)"),
					newPosition: z
						.object({
							x: z.number(),
							y: z.number(),
							z: z.number(),
						})
						.optional()
						.describe("New position (for add/move actions)"),
					itemType: z
						.string()
						.optional()
						.describe("Item type (for add actions)"),
					reason: z.string().describe("Specific reason for this change"),
				})
			),
		}),
		execute: async ({ explanation, changes }) => {
			// Validate that we have at least one change
			if (!changes || changes.length === 0) {
				return {
					success: false,
					error: "No changes proposed",
				};
			}

			// Return the proposed changes for the frontend to display
			return {
				success: true,
				message: "Layout changes proposed successfully",
				explanation,
				changes,
				changeCount: changes.length,
			};
		},
	});
