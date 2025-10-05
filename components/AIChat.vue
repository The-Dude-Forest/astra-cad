<template>
	<div class="flex flex-col h-full bg-background">
		<div class="bg-background px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<h2 class="text-sm font-medium text-foreground">
					<template v-if="chatStore.currentChat?.title">
						{{ chatStore.currentChat.title }}
					</template>
					<template v-else> AI Assistant </template>
				</h2>
				<span
					v-if="chatStore.currentChatId !== 'new'"
					class="text-xs text-muted-foreground"
				>
					({{ messages.length }} messages)
				</span>
			</div>
			<button
				v-if="chatStore.currentChatId !== 'new'"
				class="text-xs text-muted-foreground hover:text-foreground transition-colors"
				@click="createNewChat"
			>
				New Chat
			</button>
		</div>

		<div
			ref="messagesContainer"
			class="flex-1 overflow-y-auto px-4 py-6 space-y-4"
		>
			<div
				v-for="(message, index) in messages"
				:key="message.id || index"
				class="w-full"
			>
				<div v-if="message.role === 'user'" class="flex justify-end">
					<div
						class="max-w-[70%] bg-accent text-foreground rounded-2xl px-4 py-2"
					>
						<p class="text-sm leading-relaxed whitespace-pre-wrap break-words">
							{{ getTextFromMessage(message) }}
						</p>
					</div>
				</div>

				<!-- Assistant Message (Full Width) -->
				<div v-else-if="message.role === 'assistant'" class="w-full space-y-2">
					<!-- Render parts in order -->
					<template v-for="(part, partIndex) in message.parts" :key="partIndex">
						<!-- Text parts -->
						<div
							v-if="part.type === 'text' && part.text"
							class="w-full overflow-x-hidden"
						>
							<p
								class="text-sm leading-relaxed whitespace-pre-wrap break-words max-w-full text-foreground"
							>
								{{ part.text }}
							</p>
						</div>

						<!-- Tool call parts -->
						<Accordion
							v-else-if="part.type.startsWith('tool-')"
							type="multiple"
							class="w-full"
							:disabled="
								isProposedChanges(part) &&
								chatStore.isProposalApplied(message.id, partIndex)
							"
						>
							<AccordionItem
								:value="`tool-${partIndex}`"
								:class="[
									'rounded-lg overflow-hidden border-b-0',
									isProposedChanges(part) &&
									chatStore.isProposalApplied(message.id, partIndex)
										? 'bg-green-500/5 border border-green-500/10 opacity-60'
										: isProposedChanges(part)
											? 'bg-green-500/10 border border-green-500/20'
											: 'bg-primary/10 border border-primary/20',
								]"
							>
								<AccordionTrigger
									:class="[
										'px-3 py-2 hover:no-underline transition-colors',
										chatStore.isProposalApplied(message.id, partIndex)
											? 'cursor-default'
											: isProposedChanges(part)
												? 'hover:bg-green-500/10 [&[data-state=open]]:bg-green-500/10'
												: 'hover:bg-blue-500/10 [&[data-state=open]]:bg-blue-500/10',
									]"
								>
									<div
										class="flex items-center gap-2 text-xs w-full justify-between"
									>
										<span
											:class="[
												'font-medium',
												isProposedChanges(part)
													? 'text-green-600 dark:text-green-400'
													: 'text-primary',
											]"
										>
											{{
												chatStore.isProposalApplied(message.id, partIndex)
													? "✓ Changes Applied"
													: isProposedChanges(part)
														? "✨ Proposed Changes"
														: `🔧 Tool call: ${part.type.split("-")[1] || part.toolCallId}`
											}}
										</span>
										<span
											v-if="chatStore.isProposalApplied(message.id, partIndex)"
											class="text-xs text-green-600 dark:text-green-400"
										>
											Applied
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent class="px-3 pb-3 pt-0">
									<div v-if="isProposedChanges(part)" class="space-y-3">
										<div class="bg-muted/30 rounded p-3 space-y-2">
											<p class="text-sm text-foreground">
												{{ getProposedChangesData(part).explanation }}
											</p>
											<div class="space-y-2">
												<div
													v-for="(change, idx) in getProposedChangesData(part)
														.changes"
													:key="idx"
													class="bg-background/50 rounded p-2 text-xs"
												>
													<div class="font-medium text-foreground mb-1">
														{{ idx + 1 }}. {{ change.action.toUpperCase() }}:
														{{ change.itemTitle }}
													</div>
													<div class="text-muted-foreground">
														{{ change.reason }}
													</div>
													<div
														v-if="change.newPosition"
														class="text-muted-foreground mt-1"
													>
														Position: ({{ change.newPosition.x }},
														{{ change.newPosition.y }},
														{{ change.newPosition.z }})
													</div>
												</div>
											</div>
										</div>
										<Button
											v-if="!chatStore.isProposalApplied(message.id, partIndex)"
											size="sm"
											class="w-full"
											@click="
												applyProposedChanges(
													message.id,
													partIndex,
													getProposedChangesData(part)
												)
											"
										>
											<WandSparkles class="w-4 h-4 mr-1" /> Apply Changes
										</Button>
										<div
											v-else
											class="text-center text-sm text-green-600 dark:text-green-400 py-2"
										>
											✓ Changes have been applied to your layout
										</div>
									</div>

									<!-- Regular tool output -->
									<div v-else class="bg-muted/30 rounded p-2">
										<code
											class="text-xs whitespace-pre-wrap break-words max-w-full text-muted-foreground block font-mono"
										>
											{{
												JSON.stringify(
													part.output.summary ||
														part.output ||
														part.result ||
														part,
													null,
													2
												)
											}}
										</code>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</template>
				</div>
			</div>

			<div v-if="isLoading" class="w-full">
				<div class="flex items-center gap-2 text-muted-foreground">
					<div class="flex gap-1">
						<span
							class="w-1 h-1 bg-current rounded-full animate-bounce"
							style="animation-delay: 0ms"
						></span>
						<span
							class="w-1 h-1 bg-current rounded-full animate-bounce"
							style="animation-delay: 150ms"
						></span>
						<span
							class="w-1 h-1 bg-current rounded-full animate-bounce"
							style="animation-delay: 300ms"
						></span>
					</div>
					<span class="text-sm">Thinking...</span>
				</div>
			</div>
		</div>

		<div class="border-t border-border bg-background pt-2">
			<form class="flex gap-2 max-w-4xl mx-auto" @submit="handleSubmit">
				<textarea
					v-model="input"
					placeholder="Type your message here..."
					rows="1"
					class="flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[200px]"
					:disabled="isLoading"
					@keydown="handleKeyDown"
				/>
				<Button
					type="submit"
					size="icon"
					class="!size-11"
					:disabled="!input.trim() || isLoading"
				>
					<Send v-if="!isLoading" class="h-4 w-4" />
					<Loader2 v-else class="h-4 w-4 animate-spin" />
				</Button>
			</form>
			<div class="flex items-center justify-center gap-4 mt-2">
				<p class="text-xs text-muted-foreground">
					Press Enter to send, Shift+Enter for new line
				</p>
				<button
					v-if="messages.length > 0 && chatStore.currentChatId !== 'new'"
					class="text-xs text-red-500 hover:text-red-600 transition-colors"
					@click="clearChat"
				>
					Delete chat
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import Button from "./ui/button/Button.vue";
import { Send, Loader2, WandSparkles } from "lucide-vue-next";
import { Chat } from "@ai-sdk/vue";
import { DefaultChatTransport } from "ai";
import { useChatStore } from "../stores/chat";
import { useAISuggestions } from "../stores/ai-suggestions";
import { useSceneManager } from "../stores/scene-manager";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

const input = ref("");
const messagesContainer = ref(null);
const chatStore = useChatStore();
const suggestionsStore = useAISuggestions();
const sceneStore = useSceneManager();

// Initialize Chat with AI SDK, loading messages from current chat
const chat = new Chat({
	messages: chatStore.currentMessages,
	transport: new DefaultChatTransport({
		api: "/api/chat",
		body: {
			get isNewChat() {
				return chatStore.currentChatId === "new";
			},
			get suggestions() {
				return suggestionsStore.suggestions;
			},
			get availableItems() {
				return sceneStore.items;
			},
			get hub() {
				return sceneStore.hub;
			},
		},
	}),
	onData: (_dataPart) => {},
	onError(error) {
		console.error("Chat error:", error);
	},
});

// Computed values from chat
const messages = computed(() => chat.messages);
const isLoading = computed(
	() => chat.status === "submitting" || chat.status === "streaming"
);

// Save messages to store whenever they change
watch(
	messages,
	(newMessages) => {
		chatStore.setMessages(newMessages);
	},
	{ deep: true }
);

// Helper to extract text from message parts
const getTextFromMessage = (message) => {
	return message.parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("");
};

// Check if a tool part is proposedLayoutChanges
const isProposedChanges = (part) => {
	return (
		part.toolCallId === "proposeLayoutChanges" ||
		part.toolName === "proposeLayoutChanges" ||
		(part.output && part.output.changes && Array.isArray(part.output.changes))
	);
};

// Get proposed changes data from tool part
const getProposedChangesData = (part) => {
	return part.output || part.result || {};
};

// Apply proposed changes to the scene
const applyProposedChanges = (messageId, partIndex, data) => {
	if (!data.changes || data.changes.length === 0) {
		console.error("No changes to apply");
		return;
	}

	try {
		data.changes.forEach((change) => {
			const floor = sceneStore.hub.floors.find(
				(f) => f.level === change.floorLevel
			);
			if (!floor) {
				console.warn(`Floor ${change.floorLevel} not found`);
				return;
			}

			switch (change.action) {
				case "move": {
					const item = floor.items.find((i) => i.title === change.itemTitle);
					if (item && change.newPosition) {
						item.x = change.newPosition.x;
						item.y = change.newPosition.y;
						item.z = change.newPosition.z;
					}
					break;
				}
				case "remove": {
					const index = floor.items.findIndex(
						(i) => i.title === change.itemTitle
					);
					if (index !== -1) {
						floor.items.splice(index, 1);
					}
					break;
				}
				case "add": {
					const templateItem = sceneStore.items.find(
						(i) => i.title === change.itemTitle
					);
					if (templateItem && change.newPosition) {
						floor.items.push({
							...templateItem,
							x: change.newPosition.x,
							y: change.newPosition.y,
							z: change.newPosition.z,
						});
					}
					break;
				}
				case "modify": {
					const item = floor.items.find((i) => i.title === change.itemTitle);
					if (item && change.newPosition) {
						item.x = change.newPosition.x;
						item.y = change.newPosition.y;
						item.z = change.newPosition.z;
					}
					break;
				}
			}
		});

		// Mark proposal as applied in chat store
		chatStore.markProposalAsApplied(messageId, partIndex);
		suggestionsStore.generateSuggestions(sceneStore.hub);
	} catch (error) {
		console.error("Error applying changes:", error);
		alert("Failed to apply changes. Check console for details.");
	}
};

// Scroll to bottom when new messages arrive
const scrollToBottom = async () => {
	await nextTick();
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

// Watch for new messages and scroll
watch(
	messages,
	() => {
		scrollToBottom();
	},
	{ deep: true }
);

// Handle form submission
const handleSubmit = (e) => {
	e.preventDefault();
	if (!input.value.trim() || isLoading.value) return;

	chat.sendMessage({
		text: input.value,
	});
	input.value = "";
	scrollToBottom();
};

// Create new chat
const createNewChat = () => {
	chatStore.setCurrentChat("new");
	location.reload();
};

// Clear current chat history
const clearChat = () => {
	if (confirm("Are you sure you want to clear this chat?")) {
		chatStore.clearCurrentChat();
		location.reload();
	}
};

// Handle keyboard shortcuts
const handleKeyDown = (e) => {
	if (e.key === "Enter" && !e.shiftKey) {
		e.preventDefault();
		handleSubmit(e);
	}
};

// Auto-resize textarea
const autoResizeTextarea = (textarea) => {
	textarea.style.height = "auto";
	textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
};

watch(input, () => {
	const textarea = document.querySelector("textarea");
	if (textarea) {
		autoResizeTextarea(textarea);
	}
});

// Watch for pending messages from other components
watch(
	() => chatStore.pendingMessage,
	(newMessage) => {
		if (newMessage) {
			// Create a new chat and send the message
			chatStore.setCurrentChat("new");
			input.value = newMessage;
			chatStore.setPendingMessage(""); // Clear after using

			// Auto-submit the message
			nextTick(() => {
				if (!isLoading.value) {
					chat.sendMessage({
						text: input.value,
					});
					input.value = "";
					scrollToBottom();
				}
			});
		}
	}
);

onMounted(() => {
	scrollToBottom();
});
</script>

<style scoped>
/* Custom scrollbar */
:deep(*) {
	scrollbar-width: thin;
	scrollbar-color: hsl(var(--muted)) transparent;
}

:deep(*::-webkit-scrollbar) {
	width: 8px;
}

:deep(*::-webkit-scrollbar-track) {
	background: transparent;
}

:deep(*::-webkit-scrollbar-thumb) {
	background-color: hsl(var(--muted));
	border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
	background-color: hsl(var(--muted-foreground) / 0.5);
}
</style>
