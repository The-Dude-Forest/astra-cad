<script setup lang="ts">
import type { SuggestionType } from "@/stores/ai-suggestions";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAISuggestions } from "@/stores/ai-suggestions";
import { Info, AlertTriangle, AlertCircle, Sparkles, X } from "lucide-vue-next";
import { formatTimestamp } from "@/utils/format-timestamp";

const suggestionsStore = useAISuggestions();

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

const getSuggestionBadgeVariant = (type: SuggestionType) => {
	switch (type) {
		case "info":
			return "secondary";
		case "warn":
			return "outline";
		case "error":
			return "destructive";
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

const handleRemoveSuggestion = (id: string) => {
	suggestionsStore.removeSuggestion(id);
};
</script>

<template>
	<div class="flex flex-col gap-4 h-full">
		<div class="flex-1 overflow-y-auto space-y-3">
			<Card
				v-for="suggestion in suggestionsStore.suggestions"
				:key="suggestion.id"
				class="relative"
			>
				<CardHeader class="pb-3">
					<div class="flex items-start justify-between gap-2">
						<div class="flex items-start gap-3 flex-1">
							<component
								:is="getSuggestionIcon(suggestion.type)"
								:class="[
									'w-5 h-5 mt-0.5 flex-shrink-0',
									getSuggestionColor(suggestion.type),
								]"
							/>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<CardTitle class="text-sm">
										{{ suggestion.title }}
									</CardTitle>
									<Badge
										:variant="getSuggestionBadgeVariant(suggestion.type)"
										class="text-xs"
									>
										{{ suggestion.type }}
									</Badge>
								</div>
								<CardDescription class="text-xs">
									{{ suggestion.description }}
								</CardDescription>
							</div>
						</div>
						<Button
							@click="handleRemoveSuggestion(suggestion.id)"
							size="sm"
							variant="ghost"
							class="h-6 w-6 p-0 flex-shrink-0"
						>
							<X class="w-4 h-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent class="pt-0 pl-11">
					<span class="text-xs text-muted-foreground">
						{{ formatTimestamp(suggestion.timestamp) }}
					</span>
				</CardContent>
			</Card>

			<div
				v-if="suggestionsStore.suggestions.length === 0"
				class="flex flex-col items-center justify-center py-12 text-center"
			>
				<Sparkles class="w-12 h-12 text-muted-foreground mb-3" />
				<p class="text-sm text-muted-foreground mb-2">No suggestions yet</p>
				<p class="text-xs text-muted-foreground">
					Click "Generate" to analyze your hub design
				</p>
			</div>
		</div>
	</div>
</template>
