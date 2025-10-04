import {
	streamText,
	generateText,
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	type UIMessage,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

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
		}: { messages: UIMessage[]; isNewChat?: boolean } = await readBody(event);

		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				// Generate title for new chat based on first message
				if (isNewChat && messages.length === 1 && messages[0].role === "user") {
					try {
						const userMessage = messages[0].parts
							.filter((p) => p.type === "text")
							.map((p) => (p as any).text)
							.join(" ");

						const { text: title } = await generateText({
							model: google("gemini-2.5-flash"),
							system: `You are a title generator for a chat conversation.
Generate a short, descriptive title based on the user's first message.
Rules:
- Maximum 40 characters
- Be concise and descriptive
- No quotes, colons, or special punctuation
- Plain text only, no markdown
- Capture the essence of the question/topic`,
							prompt: userMessage,
						});

						// Send title as custom data
						writer.write({
							type: "data-chat-title",
							data: { title: title.trim() },
						});
					} catch (error) {
						console.error("Error generating title:", error);
					}
				}

				// Stream the chat response
				const result = streamText({
					model: google("gemini-2.5-flash"),
					system: `You are a helpful AI assistant. Follow these rules strictly:
- DO NOT use markdown formatting (no **, __, ~~, \`\`, #, etc.)
- DO NOT use code blocks or inline code formatting
- Keep your responses SHORT and concise (2-3 sentences maximum)
- Use plain text only
- Be direct and to the point
- If you need to list items, use simple dashes (-)`,
					messages: convertToModelMessages(messages),
					temperature: 0.7,
				});

				writer.merge(result.toUIMessageStream());
			},
		});

		return createUIMessageStreamResponse({ stream });
	});
});
