import { ApiResponse } from "./fetchProperties";

export interface ProcessedProperty {
  blockName: string;
  prefectures: {
    name: string;
    vacantCount: number;
  }[];
}

export function processProperties(data: ApiResponse): ProcessedProperty[] {
  return data.map((block) => ({
    blockName: block.block_name,
    prefectures: block.tdfk.map((pref) => ({
      name: pref.tdfk_name,
      vacantCount: pref.tdfk_count,
    })),
  }));
}
