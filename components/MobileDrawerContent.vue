<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { useForwardPropsEmits } from "reka-ui";
import { DrawerContent, DrawerPortal } from "vaul-vue";
import { cn } from "@/lib/utils";
import { useSceneManager } from "@/stores/scene-manager";
import { storeToRefs } from "pinia";

const props = defineProps<
	DialogContentProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const drawerHeight = computed(() => {
	if (playMode.value) return "h-0";
	return selectedFloor.value === -1 ? "h-auto" : "h-[40vh]";
});
const { selectedFloor, playMode } = storeToRefs(useSceneManager());
</script>

<template>
	<DrawerPortal>
		<DrawerContent
			data-slot="drawer-content"
			v-bind="forwarded"
			:class="
				cn(
					`group/drawer-content bg-background fixed z-40 flex ${drawerHeight} flex-col pointer-events-auto`,
					`data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg`,
					`data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[70vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg`,
					`data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm`,
					`data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm`,
					props.class
				)
			"
		>
			<slot />
		</DrawerContent>
	</DrawerPortal>
</template>
