import { urNetClient } from "./client";
import type { Prefecture } from "./properties";

const ENDPOINT =
  "https://chintai.r6.ur-net.go.jp/chintai/api/bukken/search/system_bukken/";

type EstateRaw = {
  id: string;
  name: string;
  skcs: string;
  roomCount: number;
  rent: string;
  commonfee: string;
  access: string;
  image: string;
  bukkenUrl: string;
};

export type Estate = {
  id: string;
  name: string;
  prefectureName: string;
  location: string;
  roomCount: number;
  rent: string;
  commonFee: string;
  access: string[];
  imageUrl: string;
  detailUrl: string;
};

async function fetchEstatesByPrefecture(
  prefecture: Prefecture,
): Promise<Estate[]> {
  const response = await urNetClient.post<EstateRaw[]>(ENDPOINT, {
    name: "pet",
    tdfk: prefecture.tdfk,
  });
  return response.data.map((raw) => ({
    id: raw.id,
    name: raw.name,
    prefectureName: prefecture.name,
    location: raw.skcs,
    roomCount: raw.roomCount,
    rent: raw.rent,
    commonFee: raw.commonfee,
    access: raw.access
      .split("</li>")
      .filter((item) => item.trim())
      .map((item) => item.replace(/<li>/g, "").trim()),
    imageUrl: raw.image,
    detailUrl: `https://chintai.r6.ur-net.go.jp${raw.bukkenUrl}`,
  }));
}

export async function fetchEstates(
  prefectures: Prefecture[],
): Promise<Estate[]> {
  const results = await Promise.all(
    prefectures.map(fetchEstatesByPrefecture),
  );
  return results.flat();
}
