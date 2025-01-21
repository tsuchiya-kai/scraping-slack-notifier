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
        const filterd = [...bukkenData.chiba, ...bukkenData.saitama.filter(s => s.name !== "東坂戸")]
        if(filterd.length === 0) return

        const dateOrigin = new Date();
        const month = dateOrigin.getMonth() + 1;
        const day = dateOrigin.getDate();
        const date = `${month}月${day}日`;

        await notifySlack(
          `\
          🏠 *物件がありました！* ${date} 🏠\n\n${formatBukkenDetailsGroupedByPrefecture(filterd)}`
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
