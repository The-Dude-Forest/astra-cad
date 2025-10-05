<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useSceneManager } from "@/stores/scene-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { toast } from "vue-sonner";
import { Info, Rocket, Sparkles, CheckCircle } from "lucide-vue-next";

const router = useRouter();
const sceneManager = useSceneManager();

// Form state
const currentStep = ref(1);
const totalSteps = 3;

// Mission parameters
const crewSize = ref(4);
const missionDays = ref(30);
const objective = ref(
	"Establish a permanent research outpost for long-term habitation studies"
);

// AI-generated content for title/description
const isGeneratingInfo = ref(false);
const hasGeneratedInfo = ref(false);

// User can edit AI-generated content
const missionTitle = ref("");
const missionDescription = ref("");

// Computed
const canProceedStep1 = computed(() => {
	return (
		crewSize.value > 0 &&
		crewSize.value <= 20 &&
		missionDays.value > 0 &&
		missionDays.value <= 365
	);
});

const canProceedStep2 = computed(() => {
	return objective.value.trim().length > 10;
});

const canProceedStep3 = computed(() => {
	return (
		missionTitle.value.trim().length > 0 &&
		missionDescription.value.trim().length > 0
	);
});

const canProceed = computed(() => {
	if (currentStep.value === 1) return canProceedStep1.value;
	if (currentStep.value === 2) return canProceedStep2.value;
	if (currentStep.value === 3) return canProceedStep3.value;
	return false;
});

// Methods
function nextStep() {
	if (currentStep.value === 2 && !hasGeneratedInfo.value) {
		// Generate mission title/description before moving to step 3
		generateMissionInfo();
	} else if (currentStep.value < totalSteps) {
		currentStep.value++;
	}
}

function prevStep() {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
}

async function generateMissionInfo() {
	if (!canProceedStep2.value) return;

	isGeneratingInfo.value = true;

	try {
		const response = await $fetch("/api/generate-mission-info", {
			method: "POST",
			body: {
				crewSize: crewSize.value,
				missionDays: missionDays.value,
				objective: objective.value,
			},
		});

		if (response.success) {
			missionTitle.value = response.title;
			missionDescription.value = response.description;

			hasGeneratedInfo.value = true;
			currentStep.value = 3;
		}
	} catch (error) {
		console.error("Error generating mission info:", error);
		toast.error("Failed to generate mission details", {
			position: "top-right",
			description: "Please try again or adjust your parameters.",
		});
	} finally {
		isGeneratingInfo.value = false;
	}
}

function createMission() {
	if (!canProceedStep3.value) return;

	// Create empty hub structure
	sceneManager.hub = {
		title: missionTitle.value,
		desc: missionDescription.value,
		author: "Mission Control",
		floors: [],
	};

	// Set selected floor to -1 (no floor selected)
	sceneManager.selectedFloor = -1;

	toast.success("Mission launched successfully!", {
		position: "top-right",
		description: "Your mission is ready. Start building your lunar base!",
	});

	// Redirect to main page
	router.push("/");
}
</script>

<template>
	<div
		class="min-h-screen w-screen bg-background flex items-center justify-center p-8"
	>
		<div class="max-w-4xl w-full">
			<div class="text-center mb-8">
				<div class="flex items-center justify-center gap-2 mb-2">
					<img src="/logo/logo.png" alt="AstraCAD" class="size-12" />
					<h1 class="text-4xl font-bold text-foreground">AstraCAD</h1>
				</div>
				<p class="text-muted-foreground">AI-Powered Lunar Mission Planner</p>
			</div>

			<!-- Main Card -->
			<Card class="border-border bg-secondary">
				<CardHeader>
					<CardTitle class="text-2xl">Create New Mission</CardTitle>
					<CardDescription
						>Define your mission parameters and let AI design your lunar
						base</CardDescription
					>
				</CardHeader>

				<CardContent class="space-y-8">
					<Stepper v-model="currentStep" class="flex w-full items-start gap-2">
						<StepperItem
							v-for="step in totalSteps"
							:key="step"
							:step="step"
							class="relative flex w-full flex-col items-center justify-center"
						>
							<StepperSeparator
								v-if="step !== totalSteps"
								class="absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-5 block h-0.5 shrink-0 rounded-full bg-border group-data-[state=completed]:bg-primary"
							/>

							<StepperTrigger as-child>
								<Button
									:variant="
										currentStep === step
											? 'default'
											: currentStep > step
												? 'default'
												: 'outline'
									"
									size="icon"
									class="z-10 rounded-full shrink-0"
									:class="currentStep > step ? 'bg-primary' : ''"
									:disabled="currentStep < step"
								>
									<StepperIndicator>
										{{ step }}
									</StepperIndicator>
								</Button>
							</StepperTrigger>

							<div class="mt-5 flex flex-col items-center text-center">
								<StepperTitle
									:class="
										currentStep >= step
											? 'text-foreground'
											: 'text-muted-foreground'
									"
								>
									{{
										step === 1
											? "Configuration"
											: step === 2
												? "Objective"
												: "Review"
									}}
								</StepperTitle>
								<StepperDescription
									:class="
										currentStep >= step
											? 'text-muted-foreground'
											: 'text-muted-foreground/50'
									"
								>
									{{
										step === 1
											? "Crew & duration"
											: step === 2
												? "Mission goals"
												: "AI generated"
									}}
								</StepperDescription>
							</div>
						</StepperItem>
					</Stepper>

					<!-- Step 1: Mission Configuration -->
					<div
						v-if="currentStep === 1"
						class="space-y-6 animate-in fade-in-50 duration-500"
					>
						<div class="space-y-2">
							<Label for="crew-size">Crew Size</Label>
							<div class="flex items-center gap-4">
								<Input
									id="crew-size"
									v-model.number="crewSize"
									type="number"
									min="1"
									max="20"
									class="bg-background border-border"
								/>
								<span class="text-sm text-muted-foreground">1-20 people</span>
							</div>
							<p class="text-xs text-muted-foreground">
								Number of crew members for this mission
							</p>
						</div>

						<div class="space-y-2">
							<Label for="mission-days">Mission Duration</Label>
							<div class="flex items-center gap-4">
								<Input
									id="mission-days"
									v-model.number="missionDays"
									type="number"
									min="1"
									max="365"
									class="bg-background border-border"
								/>
								<span class="text-sm text-muted-foreground">days</span>
							</div>
							<p class="text-xs text-muted-foreground">
								How long will the mission last? (1-365 days)
							</p>
						</div>

						<div
							class="border border-border rounded-lg p-4 bg-background space-y-2"
						>
							<div class="flex items-start gap-2 flex-col md:flex-row">
								<Info class="size-5 text-primary" />
								<div class="space-y-1">
									<p class="text-sm font-medium">Mission Preview</p>
									<p class="text-xs text-muted-foreground">
										AI will design a lunar base for {{ crewSize }} crew members
										operating for {{ missionDays }} days, with all necessary
										life support, living quarters, and operational facilities.
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Step 2: Mission Objective -->
					<div
						v-if="currentStep === 2"
						class="space-y-6 animate-in fade-in-50 duration-500"
					>
						<div class="space-y-2">
							<Label for="objective">Mission Objective</Label>
							<Textarea
								id="objective"
								v-model="objective"
								placeholder="Describe the primary goals and objectives of this lunar mission... 

Examples:
- Conduct geological surveys of the South Pole region
- Establish a permanent research outpost for long-term habitation studies
- Test new life support systems and ISRU technologies
- Perform lunar ice mining and water extraction experiments"
								rows="8"
								class="bg-background border-border resize-none"
							/>
							<p class="text-xs text-muted-foreground">
								{{ objective.length }}/500 characters - Be specific about what
								this mission aims to accomplish
							</p>
						</div>

						<div
							v-if="objective.length > 0"
							class="border border-border rounded-lg p-4 bg-background space-y-2"
						>
							<div class="flex items-start gap-2 flex-col md:flex-row">
								<Sparkles class="size-5 text-primary" />
								<div class="space-y-1">
									<p class="text-sm font-medium">AI Will Generate</p>
									<ul class="text-xs text-muted-foreground space-y-1">
										<li>• Mission title and detailed description</li>
										<li>• Complete base layout with multiple floors</li>
										<li>
											• Strategic placement of all essential equipment and
											systems
										</li>
										<li>• Optimized crew quarters and operational spaces</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<!-- Step 3: Review & Edit -->
					<div
						v-if="currentStep === 3"
						class="space-y-6 animate-in fade-in-50 duration-500"
					>
						<div
							v-if="!hasGeneratedInfo"
							class="flex flex-col items-center justify-center py-12 space-y-4"
						>
							<Icon
								name="lucide:loader-2"
								class="size-12 text-primary animate-spin"
							/>
							<p class="text-muted-foreground">
								AI is generating mission details...
							</p>
						</div>

						<div v-else class="space-y-6">
							<div class="space-y-2">
								<Label for="mission-title">Mission Title</Label>
								<Input
									id="mission-title"
									v-model="missionTitle"
									placeholder="Mission title"
									class="bg-background border-border"
								/>
								<p class="text-xs text-muted-foreground">
									AI generated - you can edit this
								</p>
							</div>

							<div class="space-y-2">
								<Label for="mission-desc">Mission Description</Label>
								<Textarea
									id="mission-desc"
									v-model="missionDescription"
									placeholder="Mission description"
									rows="4"
									class="bg-background border-border resize-none"
								/>
								<p class="text-xs text-muted-foreground">
									AI generated - you can edit this
								</p>
							</div>

							<div
								class="border border-border rounded-lg p-4 bg-background space-y-3"
							>
								<div class="flex items-start gap-2 flex-col md:flex-row">
									<CheckCircle class="size-5 text-primary mt-0.5" />
									<div class="space-y-2 flex-1">
										<p class="text-sm font-medium">Ready to Launch</p>
										<p class="text-xs text-muted-foreground">
											Your mission is configured for {{ crewSize }} crew members
											over {{ missionDays }} days. Click Launch Mission to start
											building your lunar base.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>

				<CardFooter class="flex justify-between">
					<Button
						v-if="currentStep > 1 && !isGeneratingInfo"
						variant="outline"
						@click="prevStep"
					>
						Previous
					</Button>
					<div v-else></div>

					<Button
						v-if="currentStep < totalSteps"
						:disabled="!canProceed || isGeneratingInfo"
						@click="nextStep"
					>
						<span v-if="currentStep === 2 && !hasGeneratedInfo">
							<Icon
								v-if="isGeneratingInfo"
								name="lucide:loader-2"
								class="size-4 mr-2 animate-spin"
							/>
							{{ isGeneratingInfo ? "Generating..." : "Generate Details" }}
						</span>
						<span v-else>Next</span>
					</Button>
					<Button
						v-else
						class="bg-primary hover:bg-primary/90"
						:disabled="!canProceed"
						@click="createMission"
					>
						<Rocket class="size-4 mr-2" />
						Launch Mission
					</Button>
				</CardFooter>
			</Card>
		</div>
	</div>
</template>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-in {
	animation: fade-in 0.5s ease-out;
}
</style>
