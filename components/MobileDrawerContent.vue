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
		<DrawerContent data-slot="drawer-content" v-bind="forwarded">
			<slot />
		</DrawerContent>
	</DrawerPortal>
</template>
