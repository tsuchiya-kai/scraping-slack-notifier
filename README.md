# scraping-slack-notifier

UR都市機構（UR賃貸住宅）の空き物件を定期的にスクレイピングし、条件に合う物件をSlackに通知するツールです。

## 機能

- 指定した都道府県の空き物件一覧を取得
- 指定階数以上の部屋のみをフィルタリング
- 条件に合う物件をSlack Incoming Webhookで通知

## セットアップ

### 必要なもの

- Node.js 18以上
- Slack Incoming Webhook URL

### インストール

```bash
npm install
```

### 環境変数

`.env` ファイルをプロジェクトルートに作成してください。

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

## 設定

`src/config.ts` で監視条件を変更できます。

```ts
// 監視する都道府県名（UR APIの tdfk_name に一致する文字列）
export const WATCH_PREFECTURES: string[] = ["千葉", "北海道", "岐阜"];

// 通知対象の最低階数
export const MIN_FLOOR = 3;
```

## 実行

```bash
# ビルド
npm run build

# 実行
npm run start
```

## 定期実行

このツールは1回実行で終了するスクリプトです。定期実行にはcronやGitHub Actionsなどのスケジューラーが別途必要です。

GitHub Actionsでの例：

```yaml
on:
  schedule:
    - cron: '0 * * * *'  # 毎時実行
```

## アーキテクチャ

```
src/
├── config.ts          # 監視条件の定数
├── index.ts           # エントリーポイント（オーケストレーション）
├── api/
│   ├── client.ts      # 共通axiosインスタンス
│   ├── properties.ts  # 都道府県別空き物件数の取得
│   ├── estates.ts     # 物件一覧の取得
│   └── rooms.ts       # 部屋詳細の取得
└── slack/
    ├── formatter.ts   # Slackメッセージの整形
    └── notifier.ts    # Slack Webhook送信
```

### 処理フロー

```
fetchProperties()          # 全都道府県の空き物件数を取得
  └─ WATCH_PREFECTURESでフィルタ
      └─ fetchEstates()    # 対象都道府県の物件一覧を取得
          └─ fetchRooms()  # 各物件の部屋詳細を取得（並列）
              └─ MIN_FLOORでフィルタ
                  └─ notifySlack()  # Slack通知
```
