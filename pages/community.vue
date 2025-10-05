<template>
	<main class="h-screen w-screen overflow-hidden bg-background flex flex-col">
		<!-- Navbar -->
		<nav class="border-b border-border backdrop-blur-sm sticky top-0 z-50">
			<div class="container mx-auto px-4 py-3 flex items-center gap-3">
				<img
					src="/logo/logo.png"
					alt="AstroCAD Logo"
					class="h-8 w-8 object-contain"
				/>
				<span
					class="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
				>
					AstroCAD
				</span>
			</div>
		</nav>

		<!-- Main Content -->
		<div class="flex-1 overflow-y-auto">
			<div class="container mx-auto px-4 py-8 max-w-7xl">
				<!-- Hero Section -->
				<div class="mb-8 space-y-4">
					<div class="space-y-2">
						<h1 class="text-4xl font-bold tracking-tight text-foreground">
							Community Hub Gallery
						</h1>
						<p class="text-muted-foreground text-lg max-w-3xl">
							Explore and discover amazing space habitats designed by the
							AstroCAD community. Find inspiration for your next lunar base or
							share your own creative designs.
						</p>
					</div>

					<div class="w-full">
						<div class="relative">
							<Input
								v-model="searchQuery"
								type="text"
								placeholder="Search hubs by title or author..."
								class="pl-10 w-full border-border text-foreground"
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Community Hubs Grid -->
				<section
					class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8"
				>
					<Card
						v-for="(item, i) in filteredHubs"
						:key="i"
						class="cursor-pointer select-none transition-all hover:shadow-lg duration-200 overflow-hidden group border-border"
						@click="handleItemSelection(item)"
					>
						<CardHeader>
							<CardTitle
								class="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors"
							>
								{{ item.title }}
							</CardTitle>
							<CardDescription class="flex flex-col gap-1 mt-2">
								<Label class="text-sm"> Author: {{ item.author }}</Label>
								<Label class="text-sm">
									Levels:
									{{
										(item.structure?.floors || item.floors)?.length || 0
									}}</Label
								>
							</CardDescription>
						</CardHeader>
						<CardContent class="pb-4">
							<Avatar class="rounded-lg w-full h-40">
								<AvatarImage
									:src="`${config.public.baseURL}cover.png`"
									alt="Hub preview"
									class="object-cover"
								/>
							</Avatar>
						</CardContent>
					</Card>
				</section>

				<!-- Empty State -->
				<div
					v-if="filteredHubs.length === 0"
					class="text-center py-12 space-y-3"
				>
					<div class="flex items-center w-full justify-center">
						<Search class="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 class="text-lg font-semibold text-foreground">No hubs found</h3>
					<p class="text-muted-foreground">Try adjusting your search query</p>
				</div>
			</div>
		</div>
	</main>
</template>
<script setup lang="ts">
import { useSceneManager, type Hub } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
const scene = useSceneManager();
const { communityHubs, hub } = storeToRefs(scene);
const { GetLayouts } = scene;

const searchQuery = ref("");

const filteredHubs = computed(() => {
	if (!searchQuery.value.trim()) {
		return communityHubs.value;
	}

	const query = searchQuery.value.toLowerCase();
	return communityHubs.value.filter((hubItem: Hub) => {
		return (
			hubItem.title?.toLowerCase().includes(query) ||
			hubItem.author?.toLowerCase().includes(query)
		);
	});
});

const handleItemSelection = (hubNew: any) => {
	hub.value = {
		title: hubNew.title,
		author: hubNew.author,
		desc: hubNew.structure?.desc || hubNew.desc,
		floors: hubNew.structure?.floors || hubNew.floors,
	};
	navigateTo("/");
};

onMounted(async () => {
	await GetLayouts();
});

const config = useRuntimeConfig();
</script>
