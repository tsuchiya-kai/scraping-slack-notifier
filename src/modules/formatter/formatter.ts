import type { formattedBukkenData } from "../../fetcher/fetchBukkenDetails";

/**
 * 物件データをSlack通知用のフォーマットに変換する関数
 * @param property 整形済みの物件データ
 * @returns Slack通知用の文字列
 */
export function formatBukkenDetails(property: formattedBukkenData): string {
  return `\
*物件名*: ${property.name}  
*所在地*: ${property.location}  
*部屋数*: ${property.roomCount}部屋  
*家賃*: ${property.rent}  
*共益費*: ${property.commonFee}  
*アクセス*:  
${property.access.map((line) => `  - ${line}`).join("\n")}  
*詳細*: <${property.detailUrl}|物件詳細ページ>  
`;
}

/**
 * 複数の物件データをSlack通知用のフォーマットに変換する関数
 * @param properties 整形済みの物件データリスト
 * @returns Slack通知用の文字列リスト
 */
export function formatBukkenDetailsForSlack(
  properties: formattedBukkenData[]
): string {
  return properties.map(formatBukkenDetails).join("\n---\n");
}
