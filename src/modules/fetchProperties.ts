import axios from "axios";

export interface TdfkData {
  tdfk: string;
  tdfk_name: string;
  tdfk_count: number;
  room: any[];
}

export interface BlockData {
  block_name: string;
  tdfk: TdfkData[];
}

export type ApiResponse = BlockData[];

export async function fetchProperties(): Promise<ApiResponse> {
  const url =
    "https://chintai.r6.ur-net.go.jp/chintai/api/seidolist/init_seidolist/";

  try {
    const response = await axios.post<ApiResponse>(
      url,
      { name: "petg" },
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

    return response.data;
  } catch (error) {
    console.error("APIからのデータ取得に失敗しました:", error);
    throw error;
  }
}
