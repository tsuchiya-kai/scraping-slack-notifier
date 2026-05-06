import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function notifySlack(message: string): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("SLACK_WEBHOOK_URL が設定されていません。");
  }
  await axios.post(webhookUrl, { text: message });
  console.log("Slack通知を送信しました。");
}
