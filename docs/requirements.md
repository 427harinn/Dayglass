# Dayglass 要件整理

## コンセプト

Dayglassは、作業セッションの残り時間と予定の流れを砂時計として表現するスケジュールタイマーです。

ユーザーが作業中に細かい予定表を読み続けなくても、残り時間、砂時計、次のポイントを一目で確認できる状態を目指します。基本体験は「Setupで予定を整える」「Focusで作業に入る」「必要なときだけ詳細を見る」です。

## 対応プラットフォーム方針

### Web

現在の主対象はWebアプリです。直近のMilestoneではWeb上の基本体験とUI方針を優先します。

### PWA

PWA対応は今後のMilestoneで検討します。現時点では、オフライン利用、インストール可能化、モバイルブラウザでの扱いを妨げる設計を避けますが、PWA実装自体はMilestone 3.5の対象外です。

### 将来的なiPhoneアプリ

将来的にはiPhoneアプリ化も検討します。session、event、next point、Setup、Focus、Focus Detailsといった中心概念は、将来ネイティブアプリに移しやすい粒度で整理します。

## 主要概念

### session

sessionは、作業時間全体を表す単位です。タイトル、日付、開始時刻、終了時刻、event一覧を持ちます。

### event

eventは、session内に配置される予定です。タイトル、種類、開始時刻、任意の終了時刻、任意の色、任意のメモを持ちます。

### next point

next pointは、Focus中に次に意識すべき時刻や予定です。通常は次のevent開始時刻を指し、今後のeventがない場合はsession終了時刻を指します。

## 画面状態

### Setup

Setupは編集画面です。ユーザーはここでsessionの基本情報を設定し、eventの追加、編集、削除を行います。

### Focus

Focusは作業中の最小UIです。砂時計を中心に置き、常時表示する情報を残り時間、砂時計、次のポイント1行、詳細表示ボタンに絞ります。Focus通常表示ではタイムラインバーを表示しません。

### Focus Details

Focus Detailsは、Focusから必要なときだけ開く詳細UIです。現在の予定、次の予定、簡易タイムラインまたは今後の予定一覧を表示します。

## UI方針

Setupは編集画面として扱います。フォーム、event一覧、タイムラインプレビューなど、予定を作るための情報を表示してよい状態です。

Focusは砂時計中心の最小UIとして扱います。砂時計を最も大きな視覚要素にし、作業中に常時読む情報を増やしすぎないようにします。現在の予定カード、詳細な予定一覧、タイムラインバーは常時表示しません。

Focus Detailsは必要なときだけ開く詳細UIとして扱います。現在の予定、次の予定、簡易タイムラインまたは今後の予定一覧を表示できますが、Focusの標準表示にはしません。

## 現在完了しているMilestone

- Milestone 1: Dayglass Webアプリの初期構成
- Milestone 2: sessionとeventのSetup編集フロー
- Milestone 3: 砂時計ベースのFocus表示
- Milestone 3.5: 要件整理とFocus UIの最小表示への整理
- Milestone 4: タイムライン表示の暫定改善
- Milestone 5: 暫定レスポンシブ対応

## 今後のMilestone

- PWA対応
- 砂時計の質感、アニメーション、視覚表現の改善
- 全体UI調整
- スマホ専用UI調整
- 通知・リマインダー再検討
- Web体験が安定した後のiPhoneアプリ検討

## 砂時計描画方針

砂時計の質感やアニメーションは後で作り込みます。現時点では、Focus UIやスケジュールロジックを大きく書き換えずに描画コンポーネントを差し替えられる状態を維持します。

## Timeline UI Note

タイムラインUIは現時点では暫定版です。Setup画面とFocus Details内で、予定の流れを色と長さで把握することを優先し、詳細はTooltipとEventListで確認する方針にしています。細かい余白、Tooltip位置、全体UIとの馴染みは今後の全体UI調整で再度見直します。

## Mobile UI Note

現在のスマホ対応は暫定対応です。現段階では375〜430px幅でSetup / Focus / Focus Detailsが大きく崩れないことを優先します。

最終的にはPC版とスマホ版でUIを分けます。Focus画面はスマホでもスクロールなしで使える構成を目指し、Setup画面やイベント編集画面はスマホでは縦スクロールやボトムシートを許容します。

スマホ専用UIの本格調整は、PWA準備または全体UI調整フェーズで行います。

## 現在採用しているMVP機能

- 単一セッションの作成・編集
- セッション内イベントの追加・編集・削除
- localStorage への保存
- ブラウザ更新時の保存済みセッション読み込み
- 保存データが存在しない、壊れている、読み込めない場合のデフォルトセッションへのフォールバック
- 残り時間、セッション状態、次のポイントを表示する Focus 表示
- 必要なときだけ開く Focus Details
- Setup 内でのタイムライン基本表示
- タイムライン上のイベント Tooltip 表示
- Focus 内での砂時計仮表示
- 375〜430px 幅で大きく崩れない暫定レスポンシブ対応

## MVPに含めない機能

- 通知・リマインダー
- ブラウザ通知
- PWA / iOS 通知
- 高度な砂時計アニメーション
- 砂時計の質感や砂の物理表現の作り込み
- 複数日管理
- カレンダー連携
- PC版とスマホ版を完全に分けた専用UI

通知・リマインダーは一度試作しましたが、現時点ではMVPから外し、コア機能が安定した後に再検討します。

## コード上の責務

- `src/App.tsx`: 画面 mode、session state、localStorage 保存フロー、現在時刻を管理する
- `src/features/schedule/scheduleTypes.ts`: スケジュール関連の共有データ型を定義する
- `src/features/schedule/scheduleUtils.ts`: 時刻変換、バリデーション、現在/次イベント取得、タイムライン表示用データ生成、砂時計表示用データ生成を持つ
- `src/features/schedule/storage.ts`: localStorage の保存・読み込み、保存データ検証、壊れたデータへのフォールバックを持つ
- `src/components/SetupView.tsx`: Setup 編集画面を構成する
- `src/components/EventForm.tsx`: セッション基本情報の編集とイベント追加/編集を扱う
- `src/components/EventList.tsx`: イベント一覧を表示し、編集・削除操作を上位へ渡す
- `src/components/FocusView.tsx`: Focus 通常表示と Focus Details の開閉を扱う
- `src/components/Timeline.tsx`: TimelineSegment を受け取ってタイムラインを表示する
- `src/components/Hourglass.tsx`: 現時点の砂時計仮表示を担当する

## 今後の優先順位

1. PWA 準備
2. 砂時計の質感・アニメーション改善
3. 全体UI調整
4. スマホ専用UI調整
5. 通知・リマインダー再検討
6. Web体験が安定した後の iPhone アプリ検討