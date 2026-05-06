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

    const estatesWithRooms = estateDetails.filter(
      ({ rooms }) => rooms.length > 0,
    );
    if (estatesWithRooms.length === 0) return;

    const dateOrigin = new Date();
    const month = dateOrigin.getMonth() + 1;
    const day = dateOrigin.getDate();
    const date = `${month}月${day}日`;
    console.log("Slackに通知を送信します...");

    const NUMBERS = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩"];

    const message = [
      `🏠 *物件がありました！${date}* 🏠`,
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
