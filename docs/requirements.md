# Dayglass 要件定義

## コンセプト

Dayglass は、作業セッションの残り時間と予定の流れを砂時計として表現するスケジュールタイマーです。

作業中に細かい予定表を読み続けなくても、残り時間、現在の流れ、次に意識するポイントを確認できる状態を目指します。現在の基本体験は「Setup で予定を整える」「Focus で作業に入る」「必要なときだけ Focus Details を開く」です。

PR #6 の通知・リマインダー機能は、現在の採用範囲には含めません。通知・リマインダーは、Web 版の中心体験が安定したあとに再検討する将来機能として扱います。

## 対応プラットフォーム方針

### Web

現在の主対象は Web アプリです。まずは Web 上で、Setup、Focus、Focus Details の基本体験を安定させます。

### PWA

PWA は最低限の土台のみ完了しています。manifest、theme-color、ホーム画面追加に向けた仮アイコンを整備していますが、本格的な PWA 機能はまだ実装しません。

Service Worker、オフライン対応、Push 通知は後続フェーズで検討します。

### 将来的なiPhoneアプリ

iPhone アプリ化や iOS 向けの専用体験は、Web 体験が安定したあとに検討します。現時点では MVP の対象外です。

## 現在採用している MVP 機能

- 単一セッションの作成・編集
- セッション内イベントの追加・編集・削除
- `localStorage` への保存
- ブラウザ更新時の保存済みセッション読み込み
- 保存データが存在しない、壊れている、読み込めない場合のデフォルトセッションへのフォールバック
- 残り時間、セッション状態、次のポイントを表示する Focus 表示
- 必要なときだけ開く Focus Details
- Setup 内でのタイムライン基本表示
- タイムライン上のイベント Tooltip 表示
- Focus 内での砂時計仮表示
- 375〜430px 幅で大きく崩れない暫定レスポンシブ対応
- PWA 準備としての manifest、theme-color、仮アイコン整備

## MVP に含めない機能

- 通知・リマインダー
- ブラウザ通知
- PWA / iOS 通知
- Service Worker
- オフライン対応
- 高度な砂時計アニメーション
- 砂時計の質感や砂の物理表現の作り込み
- 複数日管理
- カレンダー連携
- PC 版とスマホ版を完全に分けた専用 UI
- iPhone アプリ化

通知・リマインダーは一度試作しましたが、現時点では MVP から外し、コア機能が安定した後に再検討します。

## 主要概念

### session

`session` は、現在の MVP における 1 つの作業時間帯です。`id`、`date`、`title`、`startTime`、`endTime`、`events` を持ちます。

### event

`event` は、`session` の中に配置される予定ブロックです。`id`、`title`、`type`、`startTime`、任意の `endTime`、任意の `color`、任意の `memo` を持ちます。`type` はラベルや色の基準になります。

### next point

`next point` は、Focus 表示で次に意識する予定や区切りを示す概念です。
通常は次の `event` の開始時刻を指し、今後の `event` がない場合は `session` の終了時刻を指します。
作業中に予定一覧を読み続けなくても、次に気にするべきポイントを最小限に確認できる状態を目指します。

## 画面状態

### Setup

Setup は編集画面です。セッション名、開始時刻、終了時刻を編集し、イベントの追加・編集・削除を行います。予定を組み立てるための画面なので、イベント一覧やタイムラインプレビューを表示してよい状態です。

### Focus

Focus は作業中の通常表示です。砂時計を中心に、残り時間、セッション状態、次のポイントを最小限に表示します。

Focus 通常表示では、タイムラインバーや予定一覧を常時表示しません。詳細情報は Focus Details で必要なときだけ開きます。

### Focus Details

Focus Details は、Focus から必要なときだけ開く詳細表示です。現在の予定、次の予定、今後の予定など、作業中に追加で確認したい情報を表示します。Focus の通常表示よりも補助的な扱いにします。

## UI 方針

- Setup は編集画面として扱う
- Focus は砂時計中心の最小 UI として扱う
- Focus 通常表示ではタイムラインバーや予定一覧を表示しない
- 詳細は Focus Details で必要なときだけ開く
- 砂時計は現時点では仮表示とし、質感やアニメーションは今後作り込む

## Timeline UI Note

タイムライン UI は現時点では暫定版です。Setup 画面と Focus Details 内で、予定の流れを色と長さで把握することを優先し、詳細は Tooltip と EventList で確認する方針にしています。細かい余白、Tooltip 位置、全体 UI との馴染みは今後の全体 UI 調整で再度見直します。

## Mobile UI Note

現在のスマホ対応は暫定対応です。現段階では 375〜430px 幅で Setup / Focus / Focus Details が大きく崩れないことを優先します。

最終的には PC 版とスマホ版で UI を分けます。Focus 画面はスマホでもスクロールなしで使える構成を目指し、Setup 画面やイベント編集画面はスマホでは縦スクロールやボトムシートを許容します。

スマホ専用 UI の本格調整は、PWA 準備または全体 UI 調整フェーズで行います。

## PWA Preparation Note

PWA は最低限の土台のみ完了しています。manifest、theme-color、ホーム画面追加に向けた仮アイコンを整備していますが、本格的な PWA 機能はまだ実装しません。

Service Worker、オフライン対応、Push 通知は後続フェーズで検討します。iPhone アプリ化や iOS 向けの専用体験は、PWA 準備後さらに後続のフェーズで検討します。

## 砂時計描画方針

砂時計は SVG + CSS アニメーションで描画します。見た目は、作業中に見ても邪魔にならない、薄い水色と白を基調にしたやわらかいガラス風を目指します。

現時点では、上の砂、落ちる砂、下の砂を分けて描画します。上の砂はイベント色のレイヤーとして積み上げ、落ちる砂は現在イベントの色、下の砂は経過したイベント色がやわらかく混ざる表現へ拡張できる構造にします。

高度な混色、粒子表現、砂の物理表現は後で作り込みます。現時点では Focus UI やスケジュールロジックを大きく書き換えずに、`Hourglass` コンポーネントを差し替えやすい状態に保ちます。

## コード上の責務

- `src/App.tsx`: 画面 mode、session state、localStorage 保存フロー、現在時刻を管理する
- `src/features/schedule/scheduleTypes.ts`: スケジュール関連の共有データ型を定義する
- `src/features/schedule/scheduleUtils.ts`: 時刻変換、バリデーション、現在/次イベント取得、タイムライン表示用データ生成、砂時計表示用データ生成を持つ
- `src/features/schedule/storage.ts`: localStorage の保存・読み込み、保存データ検証、壊れたデータへのフォールバックを持つ
- `src/components/SetupView.tsx`: Setup 編集画面を構成する
- `src/components/EventForm.tsx`: セッション基本情報の編集とイベント追加/編集を扱う
- `src/components/EventList.tsx`: イベント一覧を表示し、編集・削除操作を上位へ渡す
- `src/components/FocusView.tsx`: Focus 通常表示と Focus Details の開閉を扱う
- `src/components/Timeline.tsx`: `TimelineSegment` を受け取ってタイムラインを表示する
- `src/components/Hourglass.tsx`: 現時点の砂時計仮表示を担当する

## 現在完了している Milestone

- Milestone 1: Dayglass Webアプリの初期構成
- Milestone 2: session と event の保存・編集フロー
- Milestone 3: 砂時計ベースの Focus 表示
- Milestone 3.5: 要件整理と Focus UI の最小表示への整理
- Milestone 4: タイムライン表示の暫定改善
- Milestone 5: 暫定レスポンシブ対応
- Milestone 6: PWA 準備

## 今後の優先順位

1. 砂時計の質感・アニメーション改善
2. 全体UI調整
3. スマホ専用UI調整
4. Service Worker / オフライン対応
5. 通知・リマインダー再検討
6. Web体験が安定した後の iPhone アプリ検討
