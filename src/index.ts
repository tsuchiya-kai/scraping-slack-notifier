import { fetchProperties } from "./modules/fetchProperties";
import { hasPrefectureInProcessedProperty } from "./modules/checker";
import { notifySlack } from "./slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const data = await fetchProperties();
    console.log({ data });
    if (hasPrefectureInProcessedProperty(data)) {
      console.log("Slackに通知を送信します...");
      await notifySlack("物件あり");
    } else {
      console.log("物件情報はありませんでした");
    }
    console.log("処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
