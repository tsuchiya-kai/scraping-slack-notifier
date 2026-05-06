import { urNetClient } from "./client";

const ENDPOINT =
  "https://chintai.r6.ur-net.go.jp/chintai/api/seidolist/init_seidolist/";

type PrefectureRaw = {
  tdfk: string;
  tdfk_name: string;
  tdfk_count: number;
};

type BlockRaw = {
  block_name: string;
  tdfk: PrefectureRaw[];
};

export type Prefecture = {
  name: string;
  vacantCount: number;
  tdfk: string;
};

export async function fetchProperties(): Promise<Prefecture[]> {
  const response = await urNetClient.post<BlockRaw[]>(ENDPOINT, {
    name: "pet",
  });
  return response.data.flatMap((block) =>
    block.tdfk.map((pref) => ({
      name: pref.tdfk_name,
      vacantCount: pref.tdfk_count,
      tdfk: pref.tdfk,
    })),
  );
}
