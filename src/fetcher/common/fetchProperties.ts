import axios from "axios";
/**
 * @note 地域のデータ
 */
export interface FormattedProperty {
  blockName: string;
  prefectures: {
    name: string;
    vacantCount: number;
    tdfk: string;
  }[];
}

interface TdfkData {
  tdfk: string;
  tdfk_name: string;
  tdfk_count: number;
  room: any[];
}
export interface BlockData {
  block_name: string;
  tdfk: TdfkData[];
}

const processProperties = (data: BlockData[]): FormattedProperty[] =>
  data.map((block) => ({
    blockName: block.block_name,
    prefectures: block.tdfk.map((pref) => ({
      name: pref.tdfk_name,
      vacantCount: pref.tdfk_count,
      tdfk: pref.tdfk,
    })),
  }));

export async function fetchProperties(): Promise<FormattedProperty[]> {
  const url =
    "https://chintai.r6.ur-net.go.jp/chintai/api/seidolist/init_seidolist/";

  try {
    const response = await axios.post<BlockData[]>(
      url,
      { name: "pet" },
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

    return processProperties(response.data);
  } catch (error) {
    console.error("APIからのデータ取得に失敗しました:", error);
    throw error;
  }
}
