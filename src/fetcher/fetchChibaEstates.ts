import {
  fetchBukkenDetails,
  type FormattedBukkenData,
} from "../fetcher/common/fetchBukkenDetails";
import type { FormattedProperty } from "../fetcher/common/fetchProperties";

const TARGET_PREF_LIST = ["千葉", "北海道", "名古屋", "岐阜"];

export const fetchChibaEstates = async (
  properties: FormattedProperty[],
): Promise<FormattedBukkenData[] | undefined> => {
  const allPrefs = properties.flatMap((property) => property.prefectures);

  const targetPrefs = TARGET_PREF_LIST.flatMap((prefName) => {
    const pref = allPrefs.find((p) => p.name === prefName);
    return pref ? [pref] : [];
  });

  if (targetPrefs.length === 0) {
    console.log("対象都道府県のデータが存在しません。");
    return;
  }

  const results = await Promise.all(
    targetPrefs.map((pref) => fetchBukkenDetails(pref.tdfk, pref.name)),
  );

  const estates = results.flat();
  console.log("取得データ:", estates);

  return estates;
};
