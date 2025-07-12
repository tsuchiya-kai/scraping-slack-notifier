import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const postSlackChannel = async (message: string) => {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

  if (!SLACK_WEBHOOK_URL) {
    console.error("Slack Webhook URLが設定されていません。");
    return;
  }

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message,
    });
  } catch (error) {
    console.error("Slack Webhookの送信に失敗しました:", error);
  }
};

export async function notifySlack(message: string): Promise<void> {
  try {
    await postSlackChannel(message);

    console.log("Slack通知を送信しました。");
  } catch (error) {
    console.error("Slack通知の送信に失敗しました:", error);
  }
}
