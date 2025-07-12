import axios from "axios";

const ENDPOINT = "https://chintai.r6.ur-net.go.jp/chintai/api/room/list/";

type Params = {
  mode: string;
  name: string;
  id: string;
};

/**
 * @note 物件の詳細データ
 * [
 *   {
 *     "id": "000000305",
 *     "year": null,
 *     "name": "305号室",
 *     "shikikin": null,
 *     "requirement": null,
 *     "madori": "https://chintai.r6.ur-net.go.jp/chintai/img_madori/30/30_596/30_596_0-00-0000_F_RA_01_00003.gif",
 *     "rent": "146,400円",
 *     "rent_normal": "",
 *     "rent_normal_css": null,
 *     "commonfee": "（5,700円）",
 *     "commonfee_sp": "共益費：5,700円",
 *     "status": "1LDK / 61&#13217; / 3階",
 *     "type": "1LDK",
 *     "floorspace": "61&#13217;",
 *     "floor": "3階",
 *     "urlDetail": "/chintai/kanto/chiba/30_5960_room.html?JKSS=000000305",
 *     "urlDetail_sp": "/chintai/sp/kanto/chiba/30_5960_room.html?JKSS=000000305",
 *     "feature": null
 *   }
 * ]
 */

type EstateDetail = {
  id: string;
  year: string | null;
  name: string;
  shikikin: string | null;
  requirement: string | null;
  madori: string;
  rent: string;
  rent_normal: string;
  rent_normal_css: string | null;
  commonfee: string;
  commonfee_sp: string;
  status: string;
  type: string;
  floorspace: string;
  floor: string;
  urlDetail: string;
  urlDetail_sp: string;
  feature: string | null;
};

type ExtractEstateDetail = {
  name: string;
  floor: string;
  rent: string;
  type: string;
};

/**
 * 物件の詳細データ（家賃や間取りなど）を取得する関数
 * @param tdfk 都道府県コード
 * @returns 整形済みの物件データリスト
 */
export async function fetchBukkenDetails(
  id: string
): Promise<ExtractEstateDetail[]> {
  const params: Params = {
    mode: "init",
    name: "pet",
    id, // note: 30_5960など
  };

  try {
    const response = await axios.post<EstateDetail[]>(ENDPOINT, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Origin: "https://www.ur-net.go.jp",
        Referer: "https://www.ur-net.go.jp/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });

    return response.data.map(({ name, floor, rent, type }) => ({
      name,
      floor,
      rent,
      type,
    }));
  } catch (error) {
    console.error("物件データの取得に失敗しました:", error);
    throw error;
  }
}
