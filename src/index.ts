import { fetchProperties } from "./fetcher/common/fetchProperties";
import { fetchChibaEstates } from "./fetcher/fetchChibaEstates";
import { fetchEstateDetailList } from "./fetcher/common/fetchEstateDetailList";
import { hasPrefectureInFormattedProperty } from "./modules/checker";
import { notifySlack } from "./modules/slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const properties = await fetchProperties();
    console.log(
      "物件情報を取得しました。",
      JSON.stringify(properties, null, 2),
    );

    const isIncludedTargetProperty =
      hasPrefectureInFormattedProperty(properties);

    console.log(
      "対象都道府県の物件が含まれているか:",
      isIncludedTargetProperty,
    );

    if (!isIncludedTargetProperty) return;

    const estates = await fetchChibaEstates(properties);
    if (!estates || estates.length === 0) return;

    console.log(JSON.stringify(estates, null, 2));

    const estateDetails = await Promise.all(
      estates.map(async (estate) => {
        const rooms = await fetchEstateDetailList(estate.id);
        return { estate, rooms };
      }),
    );

    const MIN_FLOOR = 3;
    const estatesWithRooms = estateDetails
      .map(({ estate, rooms }) => ({
        estate,
        rooms: rooms.filter((room) => {
          const floor = parseInt(room.floor, 10);
          return !isNaN(floor) && floor >= MIN_FLOOR;
        }),
      }))
      .filter(({ rooms }) => rooms.length > 0);
    if (estatesWithRooms.length === 0) return;

    const parts = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "";
    const datetime = `${get("month")}月${get("day")}日 ${get("hour")}:${get("minute")}`;
    console.log("Slackに通知を送信します...");

    const NUMBERS = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];

    const message = [
      `<!channel> 🏠 *物件がありました！${datetime}* 🏠`,
      ...estatesWithRooms.map(({ estate, rooms }) =>
        [
          `\n📍 *【${estate.tdfkName}】${estate.name}*`,
          ...rooms.map(
            (room, i) =>
              `${NUMBERS[i] ?? `${i + 1}.`} *${room.name}*　${room.floor} / ${room.type} / ${room.rent}　<${room.urlDetail}|詳細>`,
          ),
        ].join("\n"),
      ),
    ].join("\n");

    await notifySlack(message);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
