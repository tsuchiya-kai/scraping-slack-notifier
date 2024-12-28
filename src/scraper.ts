import axios from "axios";
import cheerio from "cheerio";
import fs from "fs/promises";

interface PropertyData {
  area: string; // 札幌市豊平区などの地域名
  name: string; // サンラフレ平岸（札幌市豊平区）などの物件名
  vacantCount: string; // 空室数
  rentRange: string; // 家賃範囲
  commonFee: string; // 共益費
  stations: string[]; // 最寄り駅情報
}

export interface ScrapingResult {
  url: string;
  data: PropertyData[];
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
      const data = await scrapeProperties(url);

      results.push({ url, data });
    }

    return results;
  } catch (error) {
    console.error("スクレイピングに失敗しました:", error);
    return [];
  }
}

export async function scrapeProperties(url: string): Promise<PropertyData[]> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const properties: PropertyData[] = [];

    $("div.module_tables_apartment").each((_i, element) => {
      const area = $(element).find(".js-bukken-shikutyoson-name").text().trim();

      $(element)
        .find("tbody.js-bukken-wrap > tr.js-bukken")
        .each((_j, row) => {
          const name = $(row).find(".item_name.js-bukken-name").text().trim();
          const vacantCount = $(row)
            .find(".tables_apartment_number.js-bukken-room")
            .text()
            .trim();
          const rentRange = $(row)
            .find(".tables_apartment_rentrange.js-bukken-rent")
            .text()
            .trim();
          const commonFee = $(row)
            .find(".tables_apartment_rentcom.js-bukken-commonfee")
            .text()
            .trim();

          const stations: string[] = [];
          $(row)
            .find(".tables_apartment_access.js-bukken-access li")
            .each((_k, station) => {
              stations.push($(station).text().trim());
            });

          properties.push({
            area,
            name,
            vacantCount,
            rentRange,
            commonFee,
            stations,
          });
        });
    });

    return properties;
  } catch (error) {
    console.error("スクレイピングに失敗しました:", error);
    return [];
  }
}
