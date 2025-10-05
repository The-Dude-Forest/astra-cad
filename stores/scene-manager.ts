import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";

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
				modelUrl: "models/biomonitor1.glb",
				x: 2,
				y: 0,
				z: 3,
				type: "command",
				mass: 85,
				noise: 45,
				orientation: 0,
				power: 0.8,
				volume: 1.2,
				notes:
					"Primary control interface. Should be centrally located in command module with clear sightlines. Requires stable power supply.",
			},
			{
				title: "Workstation",
				desc: "Secondary control console for operations and data tracking.",
				imgUrl: "/images/WORKSTATION.jpeg",
				modelUrl: "models/workstationglb.glb",
				x: 3,
				y: 0,
				z: 2,
				type: "command",
				mass: 65,
				noise: 42,
				orientation: 0,
				power: 0.6,
				volume: 0.9,
				notes:
					"Secondary workstation for parallel operations. Should be positioned near command console for crew coordination.",
			},
			{
				title: "Main Display Screen",
				desc: "Mission data and base overview display.",
				imgUrl: "/images/WALLDISPLAY.jpeg",
				modelUrl: "models/walldisplayglb.glb",
				x: 0,
				y: 1.5,
				z: 0,
				type: "command",
				mass: 25,
				noise: 35,
				orientation: 0,
				power: 0.3,
				volume: 0.4,
				notes:
					"Wall-mounted display. Should be visible from command consoles. Consider glare from other light sources.",
			},
			{
				title: "Communication Panel",
				desc: "Handles internal and external comms.",
				imgUrl: "/images/BIOMONITOR.jpeg",
				modelUrl: "models/biomonitor1.glb",
				x: -1,
				y: 1.2,
				z: 2,
				type: "command",
				mass: 18,
				noise: 38,
				orientation: 0,
				power: 0.4,
				volume: 0.3,
				notes:
					"Communications hub for Earth and EVA contact. Needs clear signal path, avoid placement near heavy machinery interference.",
			},
			{
				title: "Server Rack",
				desc: "Core computing and mission processing unit.",
				imgUrl: "/images/LOCKER.jpeg",
				modelUrl: "models/lockerglb.glb",
				x: 1,
				y: 0,
				z: -2,
				type: "command",
				mass: 120,
				noise: 58,
				orientation: 0,
				power: 2.5,
				volume: 1.8,
				notes:
					"High power consumption and heat generation. Should be near thermal control systems. Noise may affect nearby crew quarters.",
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
				mass: 15,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.5,
				notes:
					"Ergonomic seating for extended console operation. Position for optimal reach to command console and workstation.",
			},

			// 🛏️ CREW QUARTERS
			{
				title: "Sleeping Pod",
				desc: "Compact sleeping area for one crew member.",
				imgUrl: "/images/BED.jpeg",
				modelUrl: "models/bunkbed.glb",
				x: -3,
				y: 0,
				z: 4,
				type: "crew",
				mass: 45,
				noise: 0,
				orientation: 0,
				power: 0.05,
				volume: 2.5,
				notes:
					"Crew rest area requiring acoustic isolation from noisy systems. Should be away from high-traffic zones and machinery.",
			},
			{
				title: "Storage Locker",
				desc: "Personal locker for clothing and small gear.",
				imgUrl: "/images/LOCKER.jpeg",
				modelUrl: "models/lockerglb.glb",
				x: -2,
				y: 0,
				z: 4,
				type: "crew",
				mass: 30,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.8,
				notes:
					"Personal storage for each crew member. Should be adjacent to sleeping pods for easy access.",
			},
			{
				title: "Reading Light",
				desc: "Small personal light attached to bunk.",
				imgUrl: "/images/WALLLIGHT.jpeg",
				modelUrl: "models/walllightglb.glb",
				x: -3,
				y: 1.5,
				z: 4,
				type: "crew",
				mass: 2,
				noise: 0,
				orientation: 0,
				power: 0.02,
				volume: 0.05,
				notes:
					"Low-power individual lighting. Minimal power draw, allows personal illumination without disturbing others.",
			},

			// 🌬️ LIFE SUPPORT & UTILITY BAY
			{
				title: "Oxygen Generator",
				desc: "Produces breathable oxygen from recycled materials.",
				imgUrl: "/images/GENERATOR.jpg",
				modelUrl: "models/generator.glb",
				x: 0,
				y: 0,
				z: -2,
				type: "life-support",
				mass: 180,
				noise: 65,
				orientation: 0,
				power: 3.2,
				volume: 2.8,
				notes:
					"Critical life support system with high power demand. Noise level requires distance from crew quarters. Should be redundant.",
			},
			{
				title: "CO₂ Scrubber",
				desc: "Removes carbon dioxide from cabin air.",
				imgUrl: "/images/GENERATOR.jpeg",
				/* no exact model in folder — using generator as closest life-support placeholder */
				modelUrl: "models/generator.glb",
				x: 1,
				y: 0,
				z: -3,
				type: "life-support",
				mass: 150,
				noise: 62,
				orientation: 0,
				power: 2.8,
				volume: 2.4,
				notes:
					"Essential for air quality. Continuous operation required. Fan noise impacts nearby areas. Needs regular maintenance access.",
			},
			{
				title: "Water Recycler",
				desc: "Filters and recycles water for reuse.",
				imgUrl: "/images/CRYOTUBE.jpeg",
				/* using cryotube.glb as a lab-like placeholder */
				modelUrl: "models/cryotube.glb",
				x: 2,
				y: 0,
				z: -2,
				type: "life-support",
				mass: 220,
				noise: 58,
				orientation: 0,
				power: 2.5,
				volume: 3.5,
				notes:
					"Heavy system with significant water mass. Should be near galley and medical facilities. Requires drainage and plumbing access.",
			},
			{
				title: "Thermal Control Unit",
				desc: "Regulates temperature throughout the base.",
				imgUrl: "/images/GENERATOR.jpeg",
				/* reused generator as placeholder for thermal unit */
				modelUrl: "models/generator.glb",
				x: 1,
				y: 0,
				z: -4,
				type: "life-support",
				mass: 195,
				noise: 60,
				orientation: 0,
				power: 3.5,
				volume: 2.6,
				notes:
					"Manages heat from equipment and environmental extremes. High power consumption. Should be central to distribute conditioned air.",
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
				mass: 450,
				noise: 35,
				orientation: 0,
				power: -5.0,
				volume: 1.5,
				notes:
					"Heavy energy storage unit. Acts as power buffer during peak demand. Negative power indicates energy storage capacity. Should be protected and accessible.",
			},
			{
				title: "System Control Panel",
				desc: "Shows vital system gauges and lights.",
				imgUrl: "/images/control-panel.png",
				modelUrl: "models/biomonitor1.glb",
				x: 1,
				y: 1.5,
				z: -2,
				type: "life-support",
				mass: 12,
				noise: 32,
				orientation: 0,
				power: 0.15,
				volume: 0.2,
				notes:
					"Monitoring station for life support vitals. Should be visible from command console and accessible from utility bay.",
			},

			// 🚪 AIRLOCK / EVA PREP AREA
			{
				title: "Airlock Chamber",
				desc: "Main entry with inner and outer door.",
				imgUrl: "/images/airlock-chamber.png",
				/* no specific airlock .glb present — using generic create glb as placeholder */
				modelUrl: "models/create glb.glb",
				x: -5,
				y: 0,
				z: 1,
				type: "airlock",
				mass: 850,
				noise: 75,
				orientation: 0,
				power: 1.8,
				volume: 8.0,
				notes:
					"Primary entry/exit point with dual pressure doors. High noise during depressurization. Must be isolated from main habitat during EVA operations.",
			},
			{
				title: "EVA Suit Rack",
				desc: "Holds and secures EVA suits.",
				imgUrl: "/images/eva-suit-rack.png",
				modelUrl: "models/create glb.glb",
				x: -5,
				y: 0,
				z: 2,
				type: "airlock",
				mass: 95,
				noise: 0,
				orientation: 0,
				power: 0.1,
				volume: 1.2,
				notes:
					"Stores EVA suits with climate control. Should be immediately adjacent to airlock for rapid access during emergencies.",
			},
			{
				title: "Oxygen Refill Port",
				desc: "Recharges suit oxygen tanks.",
				imgUrl: "/images/oxygen-port.png",
				modelUrl: "models/create glb.glb",
				x: -4,
				y: 1,
				z: 2,
				type: "airlock",
				mass: 25,
				noise: 48,
				orientation: 0,
				power: 0.4,
				volume: 0.3,
				notes:
					"High-pressure oxygen connection. Must be near main oxygen supply line. Safety concern - keep away from ignition sources.",
			},
			{
				title: "Tool Rack",
				desc: "Storage hooks for EVA tools.",
				imgUrl: "/images/tool-rack.png",
				modelUrl: "models/lockerglb.glb",
				x: -5,
				y: 1,
				z: 0,
				type: "airlock",
				mass: 35,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.4,
				notes:
					"EVA equipment storage. Easy access required for pre-EVA preparation. Organize by mission priority.",
			},
			{
				title: "Decontamination System",
				desc: "Removes lunar dust before re-entry.",
				imgUrl: "/images/decon-system.png",
				modelUrl: "models/cryotube.glb",
				x: -6,
				y: 0,
				z: 1,
				type: "airlock",
				mass: 78,
				noise: 55,
				orientation: 0,
				power: 1.2,
				volume: 1.8,
				notes:
					"Critical for preventing abrasive lunar dust from entering habitat. Should be in airlock chamber or immediately adjacent transition area.",
			},

			// 🏥 MEDICAL / EMERGENCY BAY
			{
				title: "Medical Cot",
				desc: "Bed for treatment and examination.",
				imgUrl: "/images/BED.jpeg",
				modelUrl: "models/medstation.glb",
				x: 0,
				y: 0,
				z: 0,
				type: "medical",
				mass: 55,
				noise: 0,
				orientation: 0,
				power: 0.08,
				volume: 2.0,
				notes:
					"Emergency medical treatment area. Requires quick access from all modules. Should have privacy screen and good lighting.",
			},
			{
				title: "First Aid Cabinet",
				desc: "Stores essential medical kits.",
				imgUrl: "/images/first-aid.png",
				/* reusing medstation as close fit */
				modelUrl: "models/medstation.glb",
				x: 1,
				y: 1.2,
				z: 0,
				type: "medical",
				mass: 28,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.4,
				notes:
					"Essential emergency supplies. Must be accessible within seconds from any location. Consider multiple units throughout base.",
			},
			{
				title: "Diagnostic Scanner",
				desc: "Portable health monitoring unit.",
				imgUrl: "/images/diagnostic-scanner.png",
				modelUrl: "models/biomonitor1.glb",
				x: 0.5,
				y: 0,
				z: 1,
				type: "medical",
				mass: 18,
				noise: 38,
				orientation: 0,
				power: 0.25,
				volume: 0.3,
				notes:
					"Vital signs monitoring equipment. Should be near medical cot. Requires clear space for operation.",
			},
			{
				title: "Sterilization Sink",
				desc: "For cleaning and medical prep.",
				imgUrl: "/images/sink.png",
				modelUrl: "models/cryotube.glb",
				x: 1,
				y: 0,
				z: 1,
				type: "medical",
				mass: 42,
				noise: 45,
				orientation: 0,
				power: 0.5,
				volume: 0.6,
				notes:
					"Medical hygiene station. Needs water recycler connection. Important for infection control and surgical prep.",
			},

			// 🍽️ GALLEY / FOOD AREA
			{
				title: "Food Dispenser",
				desc: "Rehydrates and dispenses packaged meals.",
				imgUrl: "/images/food-dispenser.png",
				modelUrl: "models/create large.glb",
				x: 4,
				y: 0,
				z: -1,
				type: "galley",
				mass: 48,
				noise: 50,
				orientation: 0,
				power: 1.5,
				volume: 0.8,
				notes:
					"Food preparation system with heating element. Needs water recycler connection. Central to crew morale and nutrition.",
			},
			{
				title: "Water Tap",
				desc: "Filtered water outlet for drinking or rehydration.",
				imgUrl: "/images/water-tap.png",
				modelUrl: "models/create glb.glb",
				x: 4,
				y: 0,
				z: -2,
				type: "galley",
				mass: 8,
				noise: 35,
				orientation: 0,
				power: 0.1,
				volume: 0.1,
				notes:
					"Potable water access point. Must be connected to water recycler. Consider multiple taps for convenience.",
			},
			{
				title: "Food Storage Locker",
				desc: "Stores meal packs and rations.",
				imgUrl: "/images/food-locker.png",
				modelUrl: "models/lockerglb.glb",
				x: 3,
				y: 0,
				z: -2,
				type: "galley",
				mass: 120,
				noise: 0,
				orientation: 0,
				power: 0.2,
				volume: 2.5,
				notes:
					"Temperature-controlled food storage. Heavy when fully stocked. Requires inventory management and rotation system.",
			},
			{
				title: "Folding Table",
				desc: "Compact dining and prep surface.",
				imgUrl: "/images/TABLE.jpeg",
				modelUrl: "models/table.glb",
				x: 3,
				y: 0,
				z: -1,
				type: "galley",
				mass: 22,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 1.0,
				notes:
					"Crew dining and social area. Important for crew morale and team cohesion. Should accommodate all crew simultaneously.",
			},
			{
				title: "Waste Bin",
				desc: "Disposes of food and packaging waste.",
				imgUrl: "/images/waste-bin.png",
				modelUrl: "models/create glb.glb",
				x: 4,
				y: 0,
				z: 0,
				type: "galley",
				mass: 15,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.4,
				notes:
					"Waste management for galley area. Should be accessible but out of main traffic flow. Requires regular emptying.",
			},

			// 📦 STORAGE BAY
			{
				title: "Cargo Crate",
				desc: "Heavy storage for supplies and tools.",
				imgUrl: "/images/cargo-crate.png",
				modelUrl: "models/create glb.glb",
				x: -2,
				y: 0,
				z: -3,
				type: "storage",
				mass: 180,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 3.0,
				notes:
					"Bulk supply storage. Heavy when loaded. Should be near airlock for resupply missions. Consider floor load distribution.",
			},
			{
				title: "Tool Rack",
				desc: "Wall-mounted rack for tools.",
				imgUrl: "/images/tool-rack.png",
				modelUrl: "models/lockerglb.glb",
				x: -3,
				y: 0,
				z: -2,
				type: "storage",
				mass: 32,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.35,
				notes:
					"Maintenance and repair tools. Should be centrally located for quick access. Organize by function and usage frequency.",
			},
			{
				title: "Workshop Table",
				desc: "Bench for equipment repair and assembly.",
				imgUrl: "/images/TABLE.jpeg",
				modelUrl: "models/briefing table.glb",
				x: -2,
				y: 0,
				z: -2,
				type: "storage",
				mass: 85,
				noise: 55,
				orientation: 0,
				power: 0.4,
				volume: 1.5,
				notes:
					"Equipment maintenance area. Noise from repairs may disturb other areas. Needs good lighting and tool access.",
			},
			{
				title: "Spare Suit Locker",
				desc: "Backup EVA suit storage.",
				imgUrl: "/images/spare-suit-locker.png",
				modelUrl: "models/lockerglb.glb",
				x: -2,
				y: 0,
				z: -1,
				type: "storage",
				mass: 65,
				noise: 0,
				orientation: 0,
				power: 0.08,
				volume: 1.0,
				notes:
					"Redundant EVA suit storage for emergencies. Climate controlled. Should be separate from primary airlock suits.",
			},

			// 🔧 PASSAGEWAYS / INFRASTRUCTURE
			{
				title: "Bulkhead Door",
				desc: "Connects pressurized modules.",
				imgUrl: "/images/door.png",
				modelUrl: "models/create glb.glb",
				x: 0,
				y: 0,
				z: 5,
				type: "infrastructure",
				mass: 320,
				noise: 52,
				orientation: 0,
				power: 0.3,
				volume: 4.0,
				notes:
					"Pressure-sealed door for module connections. Can isolate sections in emergency. Heavy and requires structural support.",
			},
			{
				title: "Light Strip",
				desc: "Illuminates corridors.",
				imgUrl: "/images/WALLLIGHT.jpeg",
				modelUrl: "models/walllightglb.glb",
				x: 0,
				y: 2,
				z: 3,
				type: "infrastructure",
				mass: 5,
				noise: 0,
				orientation: 0,
				power: 0.08,
				volume: 0.15,
				notes:
					"Corridor lighting for navigation and safety. Low power consumption. Should provide even illumination throughout base.",
			},
			{
				title: "Ventilation Duct",
				desc: "Air circulation duct through passageway.",
				imgUrl: "/images/duct.png",
				modelUrl: "models/create glb.glb",
				x: 0,
				y: 2.5,
				z: 2,
				type: "infrastructure",
				mass: 28,
				noise: 48,
				orientation: 0,
				power: 0.6,
				volume: 1.2,
				notes:
					"Air distribution system. Constant low noise from airflow. Critical for air quality and temperature distribution.",
			},
			{
				title: "Power Cable Conduits",
				desc: "Visible cabling for realism.",
				imgUrl: "/images/cables.png",
				modelUrl: "models/create glb.glb",
				x: 0,
				y: 0,
				z: 1,
				type: "infrastructure",
				mass: 45,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.8,
				notes:
					"Electrical distribution network. No power consumption (passive). Should be accessible for maintenance but protected from damage.",
			},
			{
				title: "Fire Extinguisher",
				desc: "Mounted emergency safety unit.",
				imgUrl: "/images/extinguisher.png",
				modelUrl: "models/create glb.glb",
				x: 1,
				y: 1,
				z: 4,
				type: "infrastructure",
				mass: 12,
				noise: 0,
				orientation: 0,
				power: 0,
				volume: 0.08,
				notes:
					"Emergency fire suppression. Should be distributed throughout base at regular intervals. Critical safety equipment.",
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

		const playMode = ref<boolean>(false);

		const savedHub = ref<Hub>();

		const selectedFloor = ref<number>(-1);

		function calculateFloorVolumePercentage(floorNumber: number) {
			if (floorNumber === -1) {
				// Return total hub's volume percentage
				const totalVolume = hub.value.floors.reduce(
					(acc, floor) => acc + (floor.volume || 0),
					0
				);
				const totalItemVolume = hub.value.floors.reduce(
					(acc, floor) =>
						acc +
						floor.items.reduce((acc, item) => acc + (item.volume || 0), 0),
					0
				);
				return (totalItemVolume / totalVolume) * 100;
			}

			const floor = hub.value.floors.find((f) => f.level === floorNumber);
			if (!floor) return 0;
			if (!floor.volume) return 0;
			const totalVolume = floor.items.reduce(
				(acc, item) => acc + (item.volume || 0),
				0
			);
			return (totalVolume / floor.volume) * 100;
		}

		const baseApiUrl = "https://astra-cad-api.yomuhoudai.club";

		const SaveLayout = (): Promise<any> => {
			const fetcher = $fetch.create({
				baseURL: baseApiUrl,
				onResponse({ response }) {
					if (!response.ok) return;
					toast.success(response._data.message, {
						position: "top-right",
					});
				},
				onResponseError({ response }) {
					toast.error(response._data.message, {
						position: "top-right",
					});
				},
			});
			return fetcher("/save-layout", {
				method: "POST",
				body: hub.value,
			});
		};

		const communityHubs = ref<Hub[]>([]);

		const GetLayouts = (): Promise<any> => {
			const fetcher = $fetch.create({
				baseURL: baseApiUrl,
				onResponse({ response }) {
					if (!response.ok) return;
					communityHubs.value = response._data.data;
					toast.success(response._data.message, {
						position: "top-right",
					});
				},
				onResponseError({ response }) {
					toast.error(response._data.message, {
						position: "top-right",
					});
				},
			});
			return fetcher("/layouts", {
				method: "GET",
			});
		};

		return {
			SaveLayout,
			GetLayouts,
			hub,
			selectedFloor,
			items,
			selectedItem,
			playMode,
			calculateFloorVolumePercentage,
			savedHub,
		};
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
