import { ProcessedProperty } from "../fetcher/fetchProperties";

const WATCH_PREFECTURES = ["千葉", "埼玉"]; //tdfk_name

export const hasPrefectureInProcessedProperty = (
  processedProperties: ProcessedProperty[]
): boolean =>
  processedProperties.some((processedProperty) =>
    processedProperty.prefectures.some((prefecture) =>
      WATCH_PREFECTURES.includes(prefecture.name)
    )
  );
