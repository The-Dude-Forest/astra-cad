import { ref, onMounted, onUnmounted } from "vue";

/**
 * Composable to detect if the current device is mobile
 * @param breakpoint - The maximum width in pixels to consider as mobile (default: 768px)
 * @returns A reactive boolean indicating if the device is mobile
 */
export const useIsMobile = (breakpoint: number = 768) => {
	const isMobile = ref(false);

	const checkIsMobile = () => {
		isMobile.value = window.innerWidth < breakpoint;
	};

	onMounted(() => {
		// Check on mount
		checkIsMobile();

		// Add event listener for window resize
		window.addEventListener("resize", checkIsMobile);
	});

	onUnmounted(() => {
		// Clean up event listener
		window.removeEventListener("resize", checkIsMobile);
	});

	return { isMobile };
};
