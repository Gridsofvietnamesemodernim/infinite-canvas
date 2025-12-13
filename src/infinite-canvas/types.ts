import type * as THREE from "three";

export type MediaItem = {
  url: string;
  type: "image" | "video";
  title?: string;
  artist?: string;
  year?: string;
  link?: string;
  width?: number;
  height?: number;
};

export type InfiniteCanvasProps = {
  media: MediaItem[];
  onReady?: () => void;
};

export type ChunkData = {
  key: string;
  cx: number;
  cy: number;
  cz: number;
};

export type PlaneData = {
  id: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  mediaIndex: number;
};
