import { fetchProperties } from "./fetcher/common/fetchProperties";
import { fetchChibaEstates } from "./fetcher/fetchChibaEstates";
import { fetchEstateDetailList } from "./fetcher/common/fetchEstateDetailList";
import { formatBukkenDetailsGroupedByPrefecture } from "./modules/formatter/formatBukkenDetails";
import { hasPrefectureInFormattedProperty } from "./modules/checker";
import { notifySlack } from "./modules/slackNotifier";

const TARGET_ESTATE_ID = "30_5960"; // 千葉県の物件ID

(async function main() {
  try {
    console.log("APIから物件情報を取得します...");
    const properties = await fetchProperties();
    console.log(
      "物件情報を取得しました。",
      JSON.stringify(properties, null, 2),
    );

    const isIncludedTargetProperty =
      hasPrefectureInFormattedProperty(properties);

    if (!isIncludedTargetProperty) return;

    const estates = await fetchChibaEstates(properties);

    const hasTargetEstate = !!estates?.some(
      ({ id }) => id === TARGET_ESTATE_ID,
    );

    if (hasTargetEstate) {
      const estateDetailList = await fetchEstateDetailList(TARGET_ESTATE_ID);
      const hasTargetSpecificEstate = estateDetailList.some(({ floor }) => {
        return (
          floor === "3階" ||
          floor === "4階" ||
          floor === "5階" ||
          floor === "6階"
        );
      });

      if (hasTargetSpecificEstate) {
        const dateOrigin = new Date();
        const month = dateOrigin.getMonth() + 1;
        const day = dateOrigin.getDate();
        const date = `${month}月${day}日`;
        console.log("Slackに通知を送信します...");

        await notifySlack(
          `\
          🏠 *物件がありました！* ${date} 🏠\n\n
          ${estateDetailList
            .map((ed, i) => {
              return `\

*物件${i + 1}* ====================

物件名: ${ed.name}\n
階: ${ed.floor}\n
家賃: ${ed.rent}\n
間取り: ${ed.type}\n
リンク: ${ed.urlDetail}\n
====================
`;
            })
            .join("\n")}
          `,
        );
      }
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
})();
