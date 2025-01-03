import { fetchProperties } from "./modules/fetchProperties";
import { notifySlack } from "./slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const data = await fetchProperties();
    console.log({ data });
    console.log("Slackに通知を送信します...");
    await notifySlack(data);

    console.log("処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
