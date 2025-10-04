<template>
	<div class="flex flex-col h-full bg-background">
		<div class="bg-background px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<h2 class="text-sm font-medium text-foreground">
					<template v-if="chatStore.currentChat?.title">
						{{ chatStore.currentChat.title }}
					</template>
					<template v-else-if="chatStore.currentChatId !== 'new' && isLoading">
						<span class="text-muted-foreground">Generating title...</span>
					</template>
					<template v-else> New Chat </template>
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
				<div v-else-if="message.role === 'assistant'" class="w-full">
					<div class="w-full overflow-x-hidden">
						<p
							class="text-sm leading-relaxed whitespace-pre-wrap break-words max-w-full text-foreground"
						>
							{{ getTextFromMessage(message) }}
						</p>
					</div>
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
import { Send, Loader2 } from "lucide-vue-next";
import { Chat } from "@ai-sdk/vue";
import { DefaultChatTransport } from "ai";
import { useChatStore } from "../stores/chat";

const input = ref("");
const messagesContainer = ref(null);
const chatStore = useChatStore();

// Initialize Chat with AI SDK, loading messages from current chat
const chat = new Chat({
	messages: chatStore.currentMessages,
	transport: new DefaultChatTransport({
		api: "/api/chat",
		body: {
			get isNewChat() {
				return chatStore.currentChatId === "new";
			},
		},
	}),
	onData: (dataPart) => {
		// Handle title generation
		if (dataPart.type === "data-chat-title") {
			const title = dataPart.data.title;
			if (chatStore.currentChatId !== "new" && chatStore.currentChat && title) {
				chatStore.updateChatTitle(chatStore.currentChatId, title);
			}
		}
	},
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
