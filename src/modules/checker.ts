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
