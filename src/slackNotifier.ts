import axios from "axios";
import dotenv from "dotenv";
import { ProcessedProperty } from "./modules/processProperties";

dotenv.config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function notifySlack(
  properties: ProcessedProperty[]
): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.error("Slack Webhook URLが設定されていません。");
    return;
  }

  if (properties.length === 0) {
    console.log("通知する物件情報がありません。");
    return;
  }

  const message = properties
    .map(
      (property) =>
        `*${property.blockName}*\n` +
        property.prefectures
          .map((pref) => `• ${pref.name}: 空室数 ${pref.vacantCount}`)
          .join("\n")
    )
    .join("\n\n");

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `🏠 *新しい物件情報* 🏠\n\n${message}`,
    });
    console.log("Slack通知を送信しました。");
  } catch (error) {
    console.error("Slack通知の送信に失敗しました:", error);
  }
}
