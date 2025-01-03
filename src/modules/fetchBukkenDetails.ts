import axios from "axios";

/**
 * @note 物件のデータ
 */
export interface ProcessedPropertyDetail {
  id: string;
  name: string;
  location: string;
  roomCount: number;
  rent: string;
  commonFee: string;
  access: string[];
  imageUrl: string;
  detailUrl: string;
}

interface BukkenData {
  id: string;
  name: string;
  skcs: string;
  roomCount: number;
  rent: string;
  commonfee: string;
  access: string;
  image: string;
  bukkenUrl: string;
}

/**
 * 物件データを整形する関数
 * @param data APIから取得した生データ
 * @returns 整形済みの物件データ
 */
const processBukkenDetails = (data: BukkenData[]): ProcessedPropertyDetail[] =>
  data.map((bukken) => ({
    id: bukken.id,
    name: bukken.name,
    location: bukken.skcs,
    roomCount: bukken.roomCount,
    rent: bukken.rent,
    commonFee: bukken.commonfee,
    access: bukken.access
      .split("</li>")
      .filter((item) => item.trim())
      .map((item) => item.replace(/<li>/g, "").trim()),
    imageUrl: bukken.image,
    detailUrl: `https://chintai.r6.ur-net.go.jp${bukken.bukkenUrl}`,
  }));

/**
 * 物件データを取得する関数
 * @param tdfk 都道府県コード
 * @returns 整形済みの物件データリスト
 */
export async function fetchBukkenDetails(
  tdfk: string
): Promise<ProcessedPropertyDetail[]> {
  const url =
    "https://chintai.r6.ur-net.go.jp/chintai/api/bukken/search/system_bukken/";

  try {
    const response = await axios.post<BukkenData[]>(
      url,
      { name: "pet", tdfk },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json, text/javascript, */*; q=0.01",
          Origin: "https://www.ur-net.go.jp",
          Referer: "https://www.ur-net.go.jp/",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
      }
    );

    return processBukkenDetails(response.data);
  } catch (error) {
    console.error("物件データの取得に失敗しました:", error);
    throw error;
  }
}
