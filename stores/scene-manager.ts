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
    const hub = ref<Hub>();
    return { hub };
  },
  {
    persist: [
      {
        pick: ["hub"],
        storage: localStorage,
      },
    ],
  },
);
