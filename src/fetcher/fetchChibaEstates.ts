import {
  fetchBukkenDetails,
  type FormattedBukkenData,
} from "../fetcher/common/fetchBukkenDetails";
import type { FormattedProperty } from "../fetcher/common/fetchProperties";

import { WATCH_PREFECTURES } from "../modules/checker";

export const fetchChibaEstates = async (
  properties: FormattedProperty[],
): Promise<FormattedBukkenData[] | undefined> => {
  const allPrefs = properties.flatMap((property) => property.prefectures);

  const targetPrefs = WATCH_PREFECTURES.flatMap((prefName) => {
    const pref = allPrefs.find((p) => p.name === prefName);
    return pref ? [pref] : [];
  });

  if (targetPrefs.length === 0) {
    console.log("対象都道府県のデータが存在しません。");
    return;
  }

  console.log("対象都道府県のデータ:", targetPrefs);

  const results = await Promise.all(
    targetPrefs.map((pref) => fetchBukkenDetails(pref.tdfk, pref.name)),
  );

  const estates = results.flat();
  console.log("取得データ:", estates);

  return estates;
};
