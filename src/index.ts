import { WATCH_PREFECTURES, MIN_FLOOR } from "./config";
import { fetchProperties } from "./api/properties";
import { fetchEstates } from "./api/estates";
import { fetchRooms } from "./api/rooms";
import { formatMessage } from "./slack/formatter";
import { notifySlack } from "./slack/notifier";

async function main() {
  const prefectures = await fetchProperties();
  const targets = prefectures.filter((p) => WATCH_PREFECTURES.includes(p.name));

  if (targets.length === 0) {
    console.log("対象都道府県の空き物件が見つかりませんでした。");
    return;
  }

  const estates = await fetchEstates(targets);
  if (estates.length === 0) return;

  const estateDetails = await Promise.all(
    estates.map(async (estate) => ({
      estate,
      rooms: (await fetchRooms(estate.id)).filter(
        (room) => room.floorNumber >= MIN_FLOOR,
      ),
    })),
  );

  const estatesWithRooms = estateDetails.filter(({ rooms }) => rooms.length > 0);
  if (estatesWithRooms.length === 0) return;

  await notifySlack(formatMessage(estatesWithRooms));
}

main().catch(console.error);
