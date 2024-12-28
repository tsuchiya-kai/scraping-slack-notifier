import axios from "axios";
import cheerio from "cheerio";
import fs from "fs/promises";

// データの型定義
export interface Property {
  name: string;
  price: string;
}

// URLごとの結果型
export interface ScrapingResult {
  url: string;
  data: Property[];
}

export async function scrapePropertyData(): Promise<ScrapingResult[]> {
  try {
    // URLリストを読み込み
    const urlList: string[] = JSON.parse(
      await fs.readFile("./urls.json", "utf-8")
    );
    const results: ScrapingResult[] = [];

    // 各URLを処理
    for (const url of urlList) {
      console.log(`Scraping: ${url}`);
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // 必要なデータを抽出
      const pageData: Property[] = [];
      $(".property-item").each((i, element) => {
        const name = $(element).find(".property-name").text().trim();
        const price = $(element).find(".property-price").text().trim();
        pageData.push({ name, price });
      });

      results.push({ url, data: pageData });
    }

    return results;
  } catch (error) {
    console.error("スクレイピングに失敗しました:", error);
    return [];
  }
}
