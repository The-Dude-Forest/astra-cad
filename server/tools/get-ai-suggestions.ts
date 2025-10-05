import { tool } from "ai";
import { z } from "zod";
import type { Suggestion } from "../../stores/ai-suggestions";

export const getAISuggestionsTool = (suggestions: Suggestion[] = []) =>
	tool({
		name: "Getting your specifications",
		description:
			"Get current AI-generated suggestions, warnings, and errors about the lunar base design. Use this when user asks about problems, issues, fixes, errors, or warnings. After calling this tool, you MUST provide a text response to the user explaining what you found.",
		inputSchema: z.object({}),
		execute: async () => {
			const suggestionsList = suggestions || [];
			const errorCount = suggestionsList.filter(
				(s: Suggestion) => s.type === "error"
			).length;
			const warnCount = suggestionsList.filter(
				(s: Suggestion) => s.type === "warn"
			).length;
			const infoCount = suggestionsList.filter(
				(s: Suggestion) => s.type === "info"
			).length;

			return {
				summary: `Found ${suggestionsList.length} total suggestions: ${errorCount} errors, ${warnCount} warnings, ${infoCount} info items.`,
				suggestions: suggestionsList.map((s: Suggestion) => ({
					type: s.type,
					title: s.title,
					description: s.description,
				})),
				count: suggestionsList.length,
				errorCount,
				warnCount,
				infoCount,
			};
		},
	});
