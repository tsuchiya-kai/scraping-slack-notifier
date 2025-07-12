import type { FormattedProperty } from "../fetcher/common/fetchProperties";

const WATCH_PREFECTURES = ["千葉"]; //tdfk_name

export const hasPrefectureInFormattedProperty = (
  processedProperties: FormattedProperty[]
): boolean =>
  processedProperties.some((FormattedProperty) =>
    FormattedProperty.prefectures.some((prefecture) =>
      WATCH_PREFECTURES.includes(prefecture.name)
    )
  );

// interface FetchChibaAndSaitamaData {
//   chiba: FormattedBukkenData[];
//   // saitama: FormattedBukkenData[];
// }

// export async function fetchChibaAndSaitamaData(
//   properties: FormattedProperty[]
// ): Promise<FetchChibaAndSaitamaData | undefined> {
//   const chiba = properties
//     .find((property) =>
//       property.prefectures.some((pref) => pref.name === "千葉")
//     )
//     ?.prefectures.find((p) => p.name === "千葉");
//   // const saitama = properties
//   //   .find((property) =>
//   //     property.prefectures.some((pref) => pref.name === "埼玉")
//   //   )
//   //   ?.prefectures.find((p) => p.name === "埼玉");

//   if (
//     chiba
//     // || saitama
//   ) {
//     console.log("千葉県のデータを取得します。");
//     const data: FetchChibaAndSaitamaData = {
//       chiba: [],
//       //  saitama: []
//     };

//     if (chiba) {
//       const chibaData = await fetchBukkenDetails(chiba.tdfk, chiba.name);
//       data.chiba = chibaData;
//       console.log("千葉データ:", chibaData);
//     }

//     // if (saitama) {
//     //   const saitamaData = await fetchBukkenDetails(saitama.tdfk, saitama.name);
//     //   data.saitama = saitamaData;
//     //   console.log("埼玉データ:", saitamaData);
//     // }

//     return data;
//   } else {
//     console.log("千葉県のデータが存在しません。");
//   }
// }
