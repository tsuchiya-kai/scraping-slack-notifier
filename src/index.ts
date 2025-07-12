import { fetchProperties } from "./fetcher/fetchProperties";
import {
  hasPrefectureInFormattedProperty,
  fetchChibaEstates,
} from "./modules/checker";
import { formatBukkenDetailsGroupedByPrefecture } from "./modules/formatter/formatBukkenDetails";
import { notifySlack } from "./modules/slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const properties = await fetchProperties();

    const isIncludedTargetProperty =
      hasPrefectureInFormattedProperty(properties);

    if (!isIncludedTargetProperty) return;

    const estates = await fetchChibaEstates(properties);
    if (estates && estates.length > 0) {
      const dateOrigin = new Date();
      const month = dateOrigin.getMonth() + 1;
      const day = dateOrigin.getDate();
      const date = `${month}月${day}日`;

      console.log("Slackに通知を送信します...");
      await notifySlack(
        `\
          🏠 *物件がありました！* ${date} 🏠\n\n${formatBukkenDetailsGroupedByPrefecture(
          estates
        )}`
      );
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
