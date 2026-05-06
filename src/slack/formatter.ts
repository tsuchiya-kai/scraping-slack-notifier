import type { Estate } from "../api/estates";
import type { Room } from "../api/rooms";

const CIRCLE_NUMBERS = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];

function getJSTDatetime(): string {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("month")}月${get("day")}日 ${get("hour")}:${get("minute")}`;
}

export type EstateWithRooms = { estate: Estate; rooms: Room[] };

export function formatMessage(estatesWithRooms: EstateWithRooms[]): string {
  const datetime = getJSTDatetime();
  return [
    `<!channel> 🏠 *物件がありました！${datetime}* 🏠`,
    ...estatesWithRooms.map(({ estate, rooms }) =>
      [
        `\n📍 *【${estate.prefectureName}】${estate.name}*`,
        ...rooms.map(
          (room, i) =>
            `${CIRCLE_NUMBERS[i] ?? `${i + 1}.`} *${room.name}*　${room.floor} / ${room.type} / ${room.rent}　<${room.urlDetail}|詳細>`,
        ),
      ].join("\n"),
    ),
  ].join("\n");
}
