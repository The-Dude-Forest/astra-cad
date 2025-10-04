import { defineStore } from "pinia";
import { ref } from "vue";

export type ItemType =
	| "command"
	| "crew"
	| "life-support"
	| "airlock"
	| "medical"
	| "galley"
	| "storage"
	| "utility"
	| "infrastructure";

export const ItemTypes = [
	"command",
	"crew",
	"life-support",
	"airlock",
	"medical",
	"galley",
	"storage",
	"utility",
	"infrastructure",
] as const;

type FloorType = "ground" | "upper" | "sub" | string;

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
	mass?: number;
	power?: number;
	noise?: number;
	notes?: string;
};

export type Floor = {
	level: number;
	volume?: number;
	offset?: {
		x?: number;
		y?: number;
		z?: number;
	};
	type: FloorType;
	modelUrl: string;
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
		const selectedItem = ref<Item>();

		const items = ref<Item[]>([
			// 🛰️ COMMAND / OPERATIONS MODULE
			{
				title: "Command Console",
				desc: "Main control and monitoring console.",
				imgUrl: "/images/BIOMONITOR.jpeg",
				modelUrl: "models/command-console.glb",
				x: 2,
				y: 0,
				z: 3,
				type: "command",
			},
			{
				title: "Workstation",
				desc: "Secondary control console for operations and data tracking.",
				imgUrl: "/images/WORKSTATION.jpeg",
				modelUrl: "models/workstation.glb",
				x: 3,
				y: 0,
				z: 2,
				type: "command",
			},
			{
				title: "Main Display Screen",
				desc: "Mission data and base overview display.",
				imgUrl: "/images/WALLDISPLAY.jpeg",
				modelUrl: "models/main-display.glb",
				x: 0,
				y: 1.5,
				z: 0,
				type: "command",
			},
			{
				title: "Communication Panel",
				desc: "Handles internal and external comms.",
				imgUrl: "/images/BIOMONITOR.jpeg",
				modelUrl: "models/comm-panel.glb",
				x: -1,
				y: 1.2,
				z: 2,
				type: "command",
			},
			{
				title: "Server Rack",
				desc: "Core computing and mission processing unit.",
				imgUrl: "/images/LOCKER.jpeg",
				modelUrl: "models/server-rack.glb",
				x: 1,
				y: 0,
				z: -2,
				type: "command",
			},
			{
				title: "Anchored Chair",
				desc: "Low-gravity secured operator chair.",
				imgUrl: "/images/CHAIR.jpeg",
				modelUrl: "models/chair.glb",
				x: 2,
				y: 0,
				z: 2,
				type: "command",
			},

			// 🛏️ CREW QUARTERS
			{
				title: "Sleeping Pod",
				desc: "Compact sleeping area for one crew member.",
				imgUrl: "/images/BED.jpeg",
				modelUrl: "models/sleeping-pod.glb",
				x: -3,
				y: 0,
				z: 4,
				type: "crew",
			},
			{
				title: "Storage Locker",
				desc: "Personal locker for clothing and small gear.",
				imgUrl: "/images/LOCKER.jpeg",
				modelUrl: "models/locker.glb",
				x: -2,
				y: 0,
				z: 4,
				type: "crew",
			},
			{
				title: "Reading Light",
				desc: "Small personal light attached to bunk.",
				imgUrl: "/images/WALLLIGHT.jpeg",
				modelUrl: "models/reading-light.glb",
				x: -3,
				y: 1.5,
				z: 4,
				type: "crew",
			},

			// 🌬️ LIFE SUPPORT & UTILITY BAY
			{
				title: "Oxygen Generator",
				desc: "Produces breathable oxygen from recycled materials.",
				imgUrl: "/images/GENERATOR.jpg",
				modelUrl: "models/oxygen-generator.glb",
				x: 0,
				y: 0,
				z: -2,
				type: "life-support",
			},
			{
				title: "CO₂ Scrubber",
				desc: "Removes carbon dioxide from cabin air.",
				imgUrl: "/images/GENERATOR.jpeg",
				modelUrl: "models/co2-scrubber.glb",
				x: 1,
				y: 0,
				z: -3,
				type: "life-support",
			},
			{
				title: "Water Recycler",
				desc: "Filters and recycles water for reuse.",
				imgUrl: "/images/CRYOTUBE.jpeg",
				modelUrl: "models/water-recycler.glb",
				x: 2,
				y: 0,
				z: -2,
				type: "life-support",
			},
			{
				title: "Thermal Control Unit",
				desc: "Regulates temperature throughout the base.",
				imgUrl: "/images/GENERATOR.jpeg",
				modelUrl: "models/thermal-unit.glb",
				x: 1,
				y: 0,
				z: -4,
				type: "life-support",
			},
			{
				title: "Power Battery",
				desc: "Stores electrical energy for life support systems.",
				imgUrl: "/images/BATTERY.jpeg",
				modelUrl: "models/battery.glb",
				x: 0,
				y: 0,
				z: -3,
				type: "utility",
			},
			{
				title: "System Control Panel",
				desc: "Shows vital system gauges and lights.",
				imgUrl: "/images/control-panel.png",
				modelUrl: "models/control-panel.glb",
				x: 1,
				y: 1.5,
				z: -2,
				type: "life-support",
			},

			// 🚪 AIRLOCK / EVA PREP AREA
			{
				title: "Airlock Chamber",
				desc: "Main entry with inner and outer door.",
				imgUrl: "/images/airlock-chamber.png",
				modelUrl: "models/airlock-chamber.glb",
				x: -5,
				y: 0,
				z: 1,
				type: "airlock",
			},
			{
				title: "EVA Suit Rack",
				desc: "Holds and secures EVA suits.",
				imgUrl: "/images/eva-suit-rack.png",
				modelUrl: "models/eva-suit-rack.glb",
				x: -5,
				y: 0,
				z: 2,
				type: "airlock",
			},
			{
				title: "Oxygen Refill Port",
				desc: "Recharges suit oxygen tanks.",
				imgUrl: "/images/oxygen-port.png",
				modelUrl: "models/oxygen-port.glb",
				x: -4,
				y: 1,
				z: 2,
				type: "airlock",
			},
			{
				title: "Tool Rack",
				desc: "Storage hooks for EVA tools.",
				imgUrl: "/images/tool-rack.png",
				modelUrl: "models/tool-rack.glb",
				x: -5,
				y: 1,
				z: 0,
				type: "airlock",
			},
			{
				title: "Decontamination System",
				desc: "Removes lunar dust before re-entry.",
				imgUrl: "/images/decon-system.png",
				modelUrl: "models/decon-system.glb",
				x: -6,
				y: 0,
				z: 1,
				type: "airlock",
			},

			// 🏥 MEDICAL / EMERGENCY BAY
			{
				title: "Medical Cot",
				desc: "Bed for treatment and examination.",
				imgUrl: "/images/BED.jpeg",
				modelUrl: "models/medical-cot.glb",
				x: 0,
				y: 0,
				z: 0,
				type: "medical",
			},
			{
				title: "First Aid Cabinet",
				desc: "Stores essential medical kits.",
				imgUrl: "/images/first-aid.png",
				modelUrl: "models/first-aid.glb",
				x: 1,
				y: 1.2,
				z: 0,
				type: "medical",
			},
			{
				title: "Diagnostic Scanner",
				desc: "Portable health monitoring unit.",
				imgUrl: "/images/diagnostic-scanner.png",
				modelUrl: "models/diagnostic-scanner.glb",
				x: 0.5,
				y: 0,
				z: 1,
				type: "medical",
			},
			{
				title: "Sterilization Sink",
				desc: "For cleaning and medical prep.",
				imgUrl: "/images/sink.png",
				modelUrl: "models/sink.glb",
				x: 1,
				y: 0,
				z: 1,
				type: "medical",
			},

			// 🍽️ GALLEY / FOOD AREA
			{
				title: "Food Dispenser",
				desc: "Rehydrates and dispenses packaged meals.",
				imgUrl: "/images/food-dispenser.png",
				modelUrl: "models/food-dispenser.glb",
				x: 4,
				y: 0,
				z: -1,
				type: "galley",
			},
			{
				title: "Water Tap",
				desc: "Filtered water outlet for drinking or rehydration.",
				imgUrl: "/images/water-tap.png",
				modelUrl: "models/water-tap.glb",
				x: 4,
				y: 0,
				z: -2,
				type: "galley",
			},
			{
				title: "Food Storage Locker",
				desc: "Stores meal packs and rations.",
				imgUrl: "/images/food-locker.png",
				modelUrl: "models/food-locker.glb",
				x: 3,
				y: 0,
				z: -2,
				type: "galley",
			},
			{
				title: "Folding Table",
				desc: "Compact dining and prep surface.",
				imgUrl: "/images/TABLE.jpeg",
				modelUrl: "models/folding-table.glb",
				x: 3,
				y: 0,
				z: -1,
				type: "galley",
			},
			{
				title: "Waste Bin",
				desc: "Disposes of food and packaging waste.",
				imgUrl: "/images/waste-bin.png",
				modelUrl: "models/waste-bin.glb",
				x: 4,
				y: 0,
				z: 0,
				type: "galley",
			},

			// 📦 STORAGE BAY
			{
				title: "Cargo Crate",
				desc: "Heavy storage for supplies and tools.",
				imgUrl: "/images/cargo-crate.png",
				modelUrl: "models/cargo-crate.glb",
				x: -2,
				y: 0,
				z: -3,
				type: "storage",
			},
			{
				title: "Tool Rack",
				desc: "Wall-mounted rack for tools.",
				imgUrl: "/images/tool-rack.png",
				modelUrl: "models/tool-rack.glb",
				x: -3,
				y: 0,
				z: -2,
				type: "storage",
			},
			{
				title: "Workshop Table",
				desc: "Bench for equipment repair and assembly.",
				imgUrl: "/images/TABLE.jpeg",
				modelUrl: "models/workshop-table.glb",
				x: -2,
				y: 0,
				z: -2,
				type: "storage",
			},
			{
				title: "Spare Suit Locker",
				desc: "Backup EVA suit storage.",
				imgUrl: "/images/spare-suit-locker.png",
				modelUrl: "models/spare-suit-locker.glb",
				x: -2,
				y: 0,
				z: -1,
				type: "storage",
			},

			// 🔧 PASSAGEWAYS / INFRASTRUCTURE
			{
				title: "Bulkhead Door",
				desc: "Connects pressurized modules.",
				imgUrl: "/images/door.png",
				modelUrl: "models/door.glb",
				x: 0,
				y: 0,
				z: 5,
				type: "infrastructure",
			},
			{
				title: "Light Strip",
				desc: "Illuminates corridors.",
				imgUrl: "/images/WALLLIGHT.jpeg",
				modelUrl: "models/light-strip.glb",
				x: 0,
				y: 2,
				z: 3,
				type: "infrastructure",
			},
			{
				title: "Ventilation Duct",
				desc: "Air circulation duct through passageway.",
				imgUrl: "/images/duct.png",
				modelUrl: "models/duct.glb",
				x: 0,
				y: 2.5,
				z: 2,
				type: "infrastructure",
			},
			{
				title: "Power Cable Conduits",
				desc: "Visible cabling for realism.",
				imgUrl: "/images/cables.png",
				modelUrl: "models/cables.glb",
				x: 0,
				y: 0,
				z: 1,
				type: "infrastructure",
			},
			{
				title: "Fire Extinguisher",
				desc: "Mounted emergency safety unit.",
				imgUrl: "/images/extinguisher.png",
				modelUrl: "models/extinguisher.glb",
				x: 1,
				y: 1,
				z: 4,
				type: "infrastructure",
			},
		]);

		const hub = ref<Hub>({
			title: "Lunar Research Hub",
			desc: "A modular lunar base for crewed operations and research.",
			author: "Mission Control",
			floors: [
				{
					level: 0,
					modelUrl: "models/lunar_base_main.glb",
					type: "ground",
					volume: 500,
					acceptedItemTypes: [
						"command",
						"crew",
						"life-support",
						"airlock",
						"medical",
						"galley",
						"storage",
						"utility",
						"infrastructure",
					],
					items: items.value,
				},
			],
		});

		const selectedFloor = ref<number>(-1);

		function calculateFloorVolume(floorNumber: number) {
			const floor = hub.value.floors.find((f) => f.level === floorNumber);
			if (!floor) return 0;
			return floor.items.reduce((acc, item) => acc + (item.volume || 0), 0);
		}

		return { hub, selectedFloor, items, selectedItem, calculateFloorVolume };
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
