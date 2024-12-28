import { fetchProperties } from "./modules/fetchProperties";
import { processProperties } from "./modules/processProperties";
import { notifySlack } from "./slackNotifier";

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const rawData = await fetchProperties();
    console.log({ rawData });

    console.log("データを整形しています...");
    const processedData = processProperties(rawData);

    console.log("Slackに通知を送信します...");
    await notifySlack(processedData);

    console.log("処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
