# Dayglass 要件定義

## コンセプト

Dayglass は、作業セッションの残り時間と予定の流れを砂時計として表現するスケジュールタイマーです。

作業中に細かい予定表を読み続けなくても、残り時間、現在の流れ、次に意識するポイントを確認できる状態を目指します。現在の基本体験は「Setup で予定を整える」「Focus で作業に入る」「必要なときだけ Focus Details を開く」です。

PR #6 の通知機能は、現在の採用範囲には含めません。通知・リマインダーは、Web 版の中心体験が安定したあとに再検討する将来機能として扱います。

## 現在採用している MVP 機能

- 単一セッションの作成・編集
- セッション内イベントの追加・編集・削除
- `localStorage` への保存
- ブラウザ更新時の保存済みセッション読み込み
- 保存データが存在しない、壊れている、読み込めない場合のデフォルトセッションへのフォールバック
- 残り時間、セッション状態、次のポイントを表示する Focus 表示
- 必要なときだけ開く Focus Details
- Setup 内でのタイムライン基本表示
- Focus 内での砂時計仮表示

## MVP に含めない機能

- 通知・リマインダー
- ブラウザ通知
- PWA / iOS 通知
- 高度な砂時計アニメーション
- 砂時計の質感や砂の物理表現の作り込み
- 複数日管理
- カレンダー連携

## 画面状態

### Setup

Setup は編集画面です。セッション名、開始時刻、終了時刻を編集し、イベントの追加・編集・削除を行います。予定を組み立てるための画面なので、イベント一覧やタイムラインプレビューを表示してよい状態です。

### Focus

Focus は作業中の通常表示です。砂時計を中心に、残り時間、セッション状態、次のポイントを最小限に表示します。

Focus 通常表示では、タイムラインバーや予定一覧を常時表示しません。詳細情報はボタンから開きます。

### Focus Details

Focus Details は、Focus から必要なときだけ開く詳細表示です。現在の予定、次の予定、今後の予定など、作業中に追加で確認したい情報を表示します。Focus の通常表示よりも補助的な扱いにします。

## UI 方針

- Setup は編集画面として扱う
- Focus は砂時計中心の最小 UI として扱う
- Focus 通常表示ではタイムラインバーや予定一覧を表示しない
- 詳細はボタンで開く
- 砂時計は現時点では仮表示とし、質感やアニメーションは今後作り込む

## データ構造

### session

`session` は、現在の MVP における 1 つの作業時間帯です。`id`、`date`、`title`、`startTime`、`endTime`、`events` を持ちます。

### event

`event` は、`session` の中に配置される予定ブロックです。`id`、`title`、`type`、`startTime`、任意の `endTime`、任意の `color`、任意の `memo` を持ちます。`type` はラベルや色の基準になります。

### next point

`next point` は、Focus 中に次に意識する時刻や予定です。通常は次のイベント開始時刻を指します。今後のイベントがない場合は、セッション終了時刻を指します。

## コード上の責務

- `src/App.tsx`: 画面 mode、session state、`localStorage` 保存フローを持つ
- `src/features/schedule/scheduleTypes.ts`: スケジュール関連の共有データ型を定義する
- `src/features/schedule/scheduleUtils.ts`: 時刻変換、バリデーション、現在/次イベント取得、タイムライン表示用データ生成、砂時計表示用データ生成を持つ
- `src/features/schedule/storage.ts`: `localStorage` の保存・読み込み、保存データ検証、壊れたデータへのフォールバックを持つ
- `src/components/SetupView.tsx`: Setup 編集画面を構成する
- `src/components/EventForm.tsx`: セッション基本情報の編集とイベント追加/編集を扱う
- `src/components/EventList.tsx`: イベント一覧を表示し、編集・削除操作を上位へ渡す
- `src/components/FocusView.tsx`: Focus 通常表示と Focus Details の開閉を扱う
- `src/components/Timeline.tsx`: `TimelineSegment` を受け取ってタイムラインを表示する
- `src/components/Hourglass.tsx`: 現時点の砂時計仮表示を担当する

## 今後の優先順位

1. タイムライン表示改善
2. レスポンシブ対応
3. PWA 準備
4. 砂時計の質感・アニメーション改善
5. 通知・リマインダー再検討
