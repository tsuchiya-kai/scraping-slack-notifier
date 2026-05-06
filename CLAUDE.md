# CLAUDE.md

## プロジェクト概要

UR都市機構の賃貸物件APIをポーリングし、条件に合う空き部屋をSlackに通知するTypeScriptスクリプト。

## ファイル構成

```
src/
├── config.ts          # WATCH_PREFECTURES / MIN_FLOOR（条件変更はここ）
├── index.ts           # main() のみ。ロジックは各モジュールに委譲
├── api/
│   ├── client.ts      # urNetClient（axios）。全APIリクエストはこれを使う
│   ├── properties.ts  # fetchProperties() → Prefecture[]
│   ├── estates.ts     # fetchEstates(prefectures) → Estate[]
│   └── rooms.ts       # fetchRooms(estateId) → Room[]
└── slack/
    ├── formatter.ts   # formatMessage(estatesWithRooms) → string
    └── notifier.ts    # notifySlack(message) → void（SLACK_WEBHOOK_URL必須）
```

## ビルドと実行

```bash
npm run build   # tsc → dist/
npm run start   # node dist/index.js
```

TypeScriptのビルドを通すことでコンパイルエラーを確認できる。変更後は必ずビルドを確認すること。

## 監視条件の変更

- **都道府県を追加・変更**: `src/config.ts` の `WATCH_PREFECTURES` を編集する
  - UR APIが返す `tdfk_name` と完全一致する文字列が必要（例: "千葉"、"岐阜"）
  - "名古屋" は市名のため現状マッチしない可能性がある（"愛知" が正しい可能性）
- **階数フィルターの変更**: `src/config.ts` の `MIN_FLOOR` を編集する

## API仕様（UR賃貸）

すべてPOSTリクエスト。`urNetClient`（`src/api/client.ts`）に共通ヘッダーが設定済み。

| エンドポイント | 用途 | 主なパラメータ |
|---|---|---|
| `/api/seidolist/init_seidolist/` | 都道府県別空き物件数 | `name: "pet"` |
| `/api/bukken/search/system_bukken/` | 都道府県内の物件一覧 | `name: "pet"`, `tdfk` |
| `/api/room/list/` | 物件内の部屋一覧 | `mode: "init"`, `name: "pet"`, `id` |

## 注意事項

- `Room.floorNumber` は `parseInt(floor)` で導出されるため、"地下1階" などは `NaN` になり `MIN_FLOOR` フィルターで除外される（意図した動作）
- 時刻はJST固定（`Intl.DateTimeFormat` + `timeZone: "Asia/Tokyo"`）。サーバーのTZ設定に依存しない
- Slackメッセージは `<!channel>` メンション付き
- このスクリプトはワンショット実行。定期実行にはcronやGitHub Actionsが必要
