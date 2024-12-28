import axios from "axios";
import { ScrapingResult } from "./scraper";
import dotenv from "dotenv";

dotenv.config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function notifySlack(
  ScrapingResults: ScrapingResult[]
): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.error("Slack Webhook URLが設定されていません。");
    return;
  }

  if (ScrapingResults.length === 0) {
    console.log("物件情報がありません。");
    return;
  }

  const message = ScrapingResults.map((result) => {
    return `
      スクレイピング先: ${result.url}

      [ 結果 ] 
       ${result.data.map((d, i) => {
         return `
        [ 結果${i + 1} ] 
        *エリア*: ${d.area}
        *物件名*: ${d.name}
        *空室数*: ${d.vacantCount}
        *家賃範囲*: ${d.rentRange}
        *共益費*: ${d.commonFee}
        *最寄駅*: ${d.stations.join(", ")}
        `;
       })}

`;
  }).join("\n---\n");

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `🏠 *新しい物件情報* 🏠\n\n${message}`,
    });
    console.log("Slack通知を送信しました。");
  } catch (error) {
    console.error("Slack通知の送信に失敗しました:", error);
  }
}
