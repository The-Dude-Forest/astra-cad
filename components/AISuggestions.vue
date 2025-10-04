<script setup lang="ts">
import type { SuggestionType } from "@/stores/ai-suggestions";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible";
import { useAISuggestions } from "@/stores/ai-suggestions";
import {
	Info,
	AlertTriangle,
	AlertCircle,
	ChevronRight,
} from "lucide-vue-next";

const suggestionsStore = useAISuggestions();

const sortedSuggestions = computed(() => {
	const priorityOrder = { error: 0, warn: 1, info: 2 };
	return [...suggestionsStore.suggestions].sort((a, b) => {
		return priorityOrder[a.type] - priorityOrder[b.type];
	});
});

const getSuggestionIcon = (type: SuggestionType) => {
	switch (type) {
		case "info":
			return Info;
		case "warn":
			return AlertTriangle;
		case "error":
			return AlertCircle;
	}
};

const getSuggestionColor = (type: SuggestionType) => {
	switch (type) {
		case "info":
			return "text-blue-500";
		case "warn":
			return "text-yellow-500";
		case "error":
			return "text-red-500";
	}
};
</script>

<template>
	<div class="flex-1 overflow-y-auto space-y-2">
		<Collapsible
			v-for="suggestion in sortedSuggestions"
			:key="suggestion.id"
			v-slot="{ open }"
			class="border border-border rounded-lg"
		>
			<CollapsibleTrigger
				class="w-full p-3 hover:bg-accent/50 rounded-lg text-foreground transition-colors justify-between flex items-center"
			>
				<div class="flex items-center gap-3">
					<ChevronRight
						:class="[
							'w-4 h-4 transition-transform flex-shrink-0',
							open && 'rotate-90',
						]"
					/>
					<component
						:is="getSuggestionIcon(suggestion.type)"
						:class="[
							'w-5 h-5 flex-shrink-0',
							getSuggestionColor(suggestion.type),
						]"
					/>
					<span class="text-sm font-medium text-left flex-1">
						{{ suggestion.title }}
					</span>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div class="px-3 py-3 pl-11">
					<p class="text-sm text-muted-foreground">
						{{ suggestion.description }}
					</p>
				</div>
			</CollapsibleContent>
		</Collapsible>

		<div
			v-if="suggestionsStore.suggestions.length === 0"
			class="flex flex-col items-center justify-center py-12 text-center"
		>
			<AlertCircle class="w-12 h-12 text-muted-foreground mb-3" />
			<p class="text-sm text-muted-foreground mb-2">No suggestions yet</p>
			<p class="text-xs text-muted-foreground">
				Generate suggestions to analyze your hub design
			</p>
		</div>
	</div>
</template>
