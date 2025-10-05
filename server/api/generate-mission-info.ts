import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

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
		}: {
			crewSize: number;
			missionDays: number;
			objective: string;
		} = await readBody(event);

		// Generate mission title and description only
		const result = await generateObject({
			model: google("gemini-2.5-flash"),
			schema: z.object({
				title: z.string().describe("A compelling mission title"),
				description: z
					.string()
					.describe(
						"A detailed mission description (2-3 sentences) that captures the mission's purpose and goals"
					),
			}),
			prompt: `Generate a lunar mission title and description for:
- Crew Size: ${crewSize} people
- Mission Duration: ${missionDays} days
- Objective: ${objective}

Create a realistic and inspiring mission title and description that reflects the mission's goals and scope.`,
		});

		return {
			success: true,
			title: result.object.title,
			description: result.object.description,
		};
	});
});
