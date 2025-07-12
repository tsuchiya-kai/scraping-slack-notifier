import {
  fetchBukkenDetails,
  type FormattedBukkenData,
} from "../fetcher/common/fetchBukkenDetails";
import type { FormattedProperty } from "../fetcher/common/fetchProperties";

export const fetchChibaEstates = async (
  properties: FormattedProperty[]
): Promise<FormattedBukkenData[] | undefined> => {
  const chiba = properties
    .find((property) =>
      property.prefectures.some((pref) => pref.name === "千葉")
    )
    ?.prefectures.find((p) => p.name === "千葉");

  if (!chiba) {
    console.log("千葉県のデータが存在しません。");
    return;
  }

  const chibaEstates = await fetchBukkenDetails(chiba.tdfk, chiba.name);
  console.log("千葉データ:", chibaEstates);

  return chibaEstates;
};
