import { scrapePropertyData } from "./scraper";
import { notifySlack } from "./slackNotifier";

(async function main() {
  console.log("スクレイピングを開始します...");
  const results = await scrapePropertyData();
  await notifySlack(results);
})();
