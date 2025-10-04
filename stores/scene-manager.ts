import { defineStore } from "pinia";

export type ItemType = "lab" | "power" | string; // FIXME: ne bunlar
export type FloorType = "asdf" | string;

export type Item = {
	title: string;
	desc?: string;
	modelUrl?: string;
	imgUrl: string;
	orientation?: number;
	x: number;
	y: number;
	z: number;
	type: ItemType;
	volume?: number;
};

export type Floor = {
	level: number;
	volume?: number;
	type: string;
	acceptedItemTypes: ItemType[];
	items: Item[];
};

export type Hub = {
	title?: string;
	desc: string;
	author?: string;
	floors: Floor[];
};

export const useSceneManager = defineStore(
	"SceneManager",
	() => {
		const hub = ref<Hub>({
			title: "Main Research Hub",
			desc: "A futuristic multi-floor hub for energy and lab experiments.",
			author: "Admin",
			floors: [
				{
					level: 0,
					type: "ground",
					volume: 500,
					acceptedItemTypes: ["lab", "power"],
					items: [
						{
							title: "Fusion Lab",
							desc: "Handles experimental energy reactions.",
							modelUrl: "/models/fusion-lab.glb",
							imgUrl: "/images/fusion-lab.png",
							x: 10,
							y: 0,
							z: 5,
							type: "lab",
							orientation: 90,
							volume: 120,
						},
						{
							title: "Power Core",
							desc: "Provides sustainable energy for the facility.",
							modelUrl: "/models/power-core.glb",
							imgUrl: "/images/power-core.png",
							x: -8,
							y: 0,
							z: 3,
							type: "power",
							orientation: 45,
							volume: 80,
						},
					],
				},
				{
					level: 1,
					type: "upper",
					volume: 300,
					acceptedItemTypes: ["lab"],
					items: [
						{
							title: "Bio Lab",
							desc: "Focuses on organic sample research.",
							modelUrl: "/models/bio-lab.glb",
							imgUrl: "/images/bio-lab.png",
							x: 2,
							y: 10,
							z: 7,
							type: "lab",
							volume: 100,
						},
					],
				},
			],
		});

		const selectedFloor = ref<number>(0);

		return { hub, selectedFloor };
	},
	{
		persist: [
			{
				pick: ["hub", "selectedFloor"],
				storage: localStorage,
			},
		],
	}
);
