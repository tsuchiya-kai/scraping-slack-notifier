import { formattedProperty } from "../fetcher/fetchProperties";

const WATCH_PREFECTURES = ["千葉", "埼玉"]; //tdfk_name

export const hasPrefectureInformattedProperty = (
  processedProperties: formattedProperty[]
): boolean =>
  processedProperties.some((formattedProperty) =>
    formattedProperty.prefectures.some((prefecture) =>
      WATCH_PREFECTURES.includes(prefecture.name)
    )
  );
