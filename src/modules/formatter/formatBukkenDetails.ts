import type { FormattedBukkenData } from "../../fetcher/fetchBukkenDetails";

/**
 * 物件データをSlack通知用のフォーマットに変換する関数
 * @param property 整形済みの物件データ
 * @returns Slack通知用の文字列
 */
export function formatBukkenDetails(property: FormattedBukkenData): string {
  return `\
    *物件名*: ${property.name}  
    *所在地*: ${property.location}  
    *部屋数*: ${property.roomCount}部屋  
    *家賃*: ${property.rent}  
    *共益費*: ${property.commonFee}  
    *アクセス*: \n${property.access.map((line) => `・${line}`).join("\n")}

    ${property.imageUrl}
`;
}

/**
 * 都道府県ごとに物件データをグルーピングしてSlack通知用のフォーマットに変換する関数
 * @param properties 整形済みの物件データリスト
 * @returns 都道府県ごとにグルーピングされたSlack通知用の文字列
 */
export function formatBukkenDetailsGroupedByPrefecture(
  properties: FormattedBukkenData[]
): string {
  const grouped = properties.reduce<Record<string, FormattedBukkenData[]>>(
    (acc, property) => {
      const prefecture = property.location.split(" ")[0]; // 都道府県名を取得
      if (!acc[prefecture]) {
        acc[prefecture] = [];
      }
      acc[prefecture].push(property);
      return acc;
    },
    {}
  );

  return Object.entries(grouped)
    .map(([prefecture, bukkenList]) => {
      const formattedBukken = bukkenList
        .map(formatBukkenDetails)
        .join("\n---\n");
      return `*${grouped[prefecture][0].tdfkName}県${prefecture}の物件*:\n${formattedBukken}`;
    })
    .join("\n\n====================\n\n");
}
