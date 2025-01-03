import { fetchProperties } from "./fetcher/fetchProperties";
import { hasPrefectureInFormattedProperty } from "./modules/checker";
import { formatBukkenDetailsForSlack } from "./modules/formatter/formatBukkenDetails";
import { notifySlack } from "./slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const data = await fetchProperties();
    console.log({ data });

    if (hasPrefectureInFormattedProperty(data)) {
      console.log("Slackに通知を送信します...");
      await notifySlack(formatBukkenDetailsForSlack(data));
    } else {
      console.log("物件情報はありませんでした");
    }
    console.log("処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
