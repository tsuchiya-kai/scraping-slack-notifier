import { urNetClient } from "./client";

const ENDPOINT = "https://chintai.r6.ur-net.go.jp/chintai/api/room/list/";
const DOMAIN = "https://www.ur-net.go.jp";

type RoomRaw = {
  id: string;
  name: string;
  floor: string;
  rent: string;
  type: string;
  urlDetail_sp: string;
};

export type Room = {
  id: string;
  name: string;
  floor: string;
  floorNumber: number;
  rent: string;
  type: string;
  urlDetail: string;
};

export async function fetchRooms(estateId: string): Promise<Room[]> {
  const response = await urNetClient.post<RoomRaw[]>(ENDPOINT, {
    mode: "init",
    name: "pet",
    id: estateId,
  });
  return response.data.map((raw) => ({
    id: raw.id,
    name: raw.name,
    floor: raw.floor,
    floorNumber: parseInt(raw.floor, 10),
    rent: raw.rent,
    type: raw.type,
    urlDetail: DOMAIN + raw.urlDetail_sp,
  }));
}
