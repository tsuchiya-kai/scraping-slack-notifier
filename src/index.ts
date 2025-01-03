import { fetchProperties } from "./fetcher/fetchProperties";
import {
  hasPrefectureInFormattedProperty,
  fetchChibaAndSaitamaData,
} from "./modules/checker";
import { formatBukkenDetailsGroupedByPrefecture } from "./modules/formatter/formatBukkenDetails";
import { notifySlack } from "./slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const data = await fetchProperties();
    console.log({ data });

    if (hasPrefectureInFormattedProperty(data)) {
      console.log("Slackに通知を送信します...");
      const bukkenData = await fetchChibaAndSaitamaData(data);
      if (bukkenData) {
        const dateOrigin = new Date();
        const month = dateOrigin.getMonth() + 1;
        const day = dateOrigin.getDate();
        const hours = String(dateOrigin.getHours()).padStart(2, "0");
        const minutes = String(dateOrigin.getMinutes()).padStart(2, "0");
        const date = `${month}月${day}日 ${hours}時${minutes}分`;

        await notifySlack(
          `\
          🏠 *物件がありました！* ${date} 🏠\n\n${formatBukkenDetailsGroupedByPrefecture(
            [...bukkenData.chiba, ...bukkenData.saitama]
          )}`
        );
      }
    } else {
      console.log("物件情報はありませんでした");
    }
    console.log("処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
