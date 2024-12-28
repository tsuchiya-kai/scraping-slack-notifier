import axios from "axios";
import { ScrapingResult } from "./scraper";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";

export async function notifySlack(results: ScrapingResult[]): Promise<void> {
  if (!results.length) {
    console.log("新しい情報はありません。");
    return;
  }

  let message = "新しい物件情報:\n";
  for (const { url, data } of results) {
    message += `\n🔗 *${url}*\n`;
    message += data.map((p) => `🏠 ${p.name}: ${p.price}`).join("\n");
  }

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
    });
    console.log("Slack通知を送信しました。");
  } catch (error) {
    console.error("Slack通知に失敗しました:", error);
  }
}
