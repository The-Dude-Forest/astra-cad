import {
	streamText,
	generateText,
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	type UIMessage,
	stepCountIs,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
	getAISuggestionsTool,
	getAvailableItemsTool,
	getHubLayoutTool,
	proposeLayoutChangesTool,
} from "../tools";

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
			messages,
			isNewChat,
			suggestions,
			availableItems,
			hub,
		}: {
			messages: UIMessage[];
			isNewChat?: boolean;
			suggestions?: any[];
			availableItems?: any[];
			hub?: any;
		} = await readBody(event);

		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				const result = streamText({
					model: google("gemini-2.5-flash"),
					system: `You are a helpful AI assistant for a lunar base CAD system. Follow these rules strictly:
- DO NOT use markdown formatting (no **, __, ~~, \`\`, #, etc.)
- DO NOT use code blocks or inline code formatting
- Keep your responses SHORT and concise (2-3 sentences maximum)
- Use plain text only
- Be direct and to the point
- If you need to list items, use simple dashes (-)

WORKFLOW FOR "FIX WITH AI" OR PROBLEM-SOLVING:
When users ask to fix problems or want help with issues:
1. FIRST: Use getAISuggestions to understand what problems exist
2. SECOND: Use getHubLayout to see the current base configuration
3. THIRD: Analyze the problem by comparing suggestions with the actual layout
4. FOURTH (if needed): Use getAvailableItems to find items that could solve the problem
5. FIFTH: Use proposeLayoutChanges to suggest specific changes with positions
6. FINALLY: Provide a brief text summary after proposing changes

When proposing changes:
- Be specific about positions (x, y, z coordinates)
- Explain why each change solves the problem
- Propose realistic, implementable changes
- IMPORTANT: For invalid item placements (items on wrong floor types), suggest REMOVAL, not relocation
- Example: If a "crew" item is on a floor that only accepts "infrastructure", propose to remove it

When users ask about their current layout or configuration:
1. Use getHubLayout to get the current state
2. Provide a helpful summary of what they have

When users ask about available items or equipment:
1. Use getAvailableItems to check what items are available
2. You can filter by type if the user asks about specific categories
3. Provide helpful information about the items

IMPORTANT: Always respond with text after calling tools. Never end with just a tool call. Use multiple tools in sequence when needed to fully understand and solve problems.`,
					messages: convertToModelMessages(messages),
					temperature: 0.7,
					stopWhen: stepCountIs(10),
					tools: {
						getAISuggestions: getAISuggestionsTool(suggestions),
						getHubLayout: getHubLayoutTool(hub),
						getAvailableItems: getAvailableItemsTool(availableItems),
						proposeLayoutChanges: proposeLayoutChangesTool(),
					},
				});

				writer.merge(result.toUIMessageStream());
			},
		});

		return createUIMessageStreamResponse({ stream });
	});
});
