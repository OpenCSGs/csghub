**[English](/docs/readme_en.md) ∙ [简体中文](/docs/readme_cn.md) ∙ [日本語](/docs/readme_ja.md)  ∙ [한국어](/docs/readme_kr.md)**
## CSGHub 説明書

CSGHubは、LLMおよびLLMアプリケーションのライフサイクルに関与する資産（データセット、モデルファイル、コードなど）を管理するためのオープンソースで信頼性の高い大規模モデル資産管理プラットフォームです。

CSGHubを使用すると、Webインターフェース、Gitコマンドライン、または自然言語チャットボットを通じて、LLM資産のアップロード、ダウンロード、保存、検証、および配布を行うことができます。同時に、プラットフォームはマイクロサービスサブモジュールと標準化されたOpenAPIを提供し、ユーザーのシステムと簡単に統合できます。

CSGHubは、大規模モデルにネイティブに設計され、完全にオフラインで動作するオンプレミスで展開できる資産管理プラットフォームをユーザーに提供することを目指しています。CSGHubは、OpenStack Glanceが仮想マシンイメージを管理し、Harborがコンテナイメージを管理し、Sonatype Nexusがアーティファクトを管理する方法に似て、LLM資産を管理するためのプライベート版Huggingfaceに似た機能を提供します。

OpenCSGコミュニティの公式ウェブサイトを通じて、CSGHubの無料SaaS版を試すことができます。https://opencsg.com<br>また、[クイックスタート](#クイックスタート)セクションにジャンプして、ローカルインスタンスを迅速に起動し、CSGHubのすべての機能を探索することもできます。
<kbd>
<img src="/docs/images/project_intro.jpg" width='800'>
</kdb>
### 更新
- [2024.09.15] v0.9.0 CSGHubポータルはGoバージョンに移行しました。GitサーバーはGitalyをサポートし、デフォルトで使用します。コレクション機能が追加され、新しいリソースコンソールページが導入されました。ランスペースエンドポイントの微調整にはもはやドメインが必要ありません。その他のユーザー体験の最適化とバグ修正も行われました。
- [2024.08.15] v0.8.0 大規模リリースで、独立したuser_serverサービスを導入し、ユーザー、組織、トークンの管理をCSGHubからバックエンドサーバーのCSGHub-serverに移動します。アプリケーション空間、モード推論、およびファインチューンの均一なデプロイメントのための独立したstarhub_server_runnerサービスを導入します。リソース管理が強化され、異なる地域の複数のk8sクラスターはサポートされていません。
- [2024.07.15] v0.7.0 重要なリリース：モデルとデータセットの`複数リソース同期`、ワンクリック微調整、リソース使用量の計測をサポート。
- [2024.06.21] v0.6.1 バグ修正とユーザーエクスペリエンスの向上。
- [2024.06.18] v0.6.0 重要なリリース：`専用`モデル推論エンドポイント、`streamlit`スペースのサポート、リポジトリの`いいね`機能、リポジトリの`業界タグ`設定、Git履歴とコミット差分の詳細を強化。
- [2024.05.14] v0.5.0 スペースユーザーエクスペリエンスの向上、リポジトリ（モデル、データセット、コード、スペース）間の`関係`の自動構築、複数ファイルのアップロードをサポート。
- [2024.04.18] v0.4.0 `アプリケーションスペース`（gradioアプリ）の実行を許可、モデル推論を試すためのウィジェットを追加、新しいリポジトリタイプ`コード`のサポート、組織メンバー管理のサポート、WeChatログインのサポート。
- [2024.03.15] v0.3.0 計画：ファイルのオンライン編集、組織の編集、データセットのプレビュー。
- [2024.02.15] v0.2.0 モデルデータセットホスティング機能の改善、新しい組織メンバーの招待機能の追加。
- [2024.01.15] v0.1.0 CSGHub Alphaバージョンリリース、モデルとデータセット管理機能をサポート、詳細な機能は以下の通り。

### コア機能
LLMの時代において、データとモデルは企業や個人ユーザーにとって最も重要なデジタル資産となりつつあります。しかし、現在は管理ツールの分散、管理手段の限界、ローカリゼーションなどの問題があり、これらは安全な運用に潜在的な脅威をもたらすだけでなく、企業規模のモデルの更新と反復を妨げる可能性があります。大規模モデルが今後の革命の主要な推進力になると信じている場合、コア資産（モデル、データ、大規模モデルアプリケーションコード）をより効率的かつ安全に管理する方法を検討しているかもしれません。CSGHubはこれらの問題を解決するために設計されたオープンソースプロジェクトです。

CSGHubのコア機能（定期的に更新）：
- **LLM資産の統一管理**：モデルファイル、データセット、大規模モデルアプリケーションコードの統一管理を行うワンストップHub。
- **開発エコシステムの互換性**：GitコマンドとWebインターフェース操作の両方でHTTPSおよびSSHプロトコルをサポートし、異なるユーザーに便利な使用を保証。
- **大規模モデルの能力拡張**：バージョン管理、モデル形式変換、自動データ処理、データセットプレビュー機能をネイティブにサポート。
- **権限とセキュリティ**：企業ユーザーシステムとの統合、資産の可視性設定、外部および内部ユーザー向けのゼロトラスト認証インターフェース設計をサポートし、セキュリティを最大化。
- **プライベートデプロイメントのサポート**：インターネットやクラウドベンダーに依存せず、ワンクリックでプライベートデプロイメントを開始。
- **大規模モデルのネイティブデザイン**：自然言語インタラクション、ワンクリックモデルデプロイメント、エージェントおよびコパイロットアプリの資産管理をサポート。

### 技術設計
CSGHubの技術設計は次のとおりです：
- CSGHubは、Gitサーバー、Git LFS（大ファイルストレージ）プロトコル、オブジェクトストレージサービス（OSS）などの複数の技術を統合し、信頼性の高いデータストレージ層、柔軟なインフラストラクチャアクセス層、および広範な開発ツールのサポートを提供します。
- サービス指向アーキテクチャを利用して、CSGHubはCSGHubサーバーを通じてバックエンドサービスを提供し、CSGHub Webサービスを通じて管理インターフェースを提供します。一般ユーザーは、Docker composeまたはKubernetes Helm Chartを使用してサービスを迅速に開始し、企業レベルの資産管理を実現できます。社内開発能力を持つユーザーは、CSGHubサーバーを利用して二次開発を行い、管理機能を外部システムに統合したり、高度な機能をカスタマイズしたりできます。
- Apache ArrowやDuckDBなどの優れたオープンソースプロジェクトを活用して、CSGHubはParquetデータファイル形式のプレビューをサポートし、研究者や一般ユーザーのローカライズされたデータセット管理を支援します。
- CSGHubは直感的なWebインターフェースと企業組織構造向けの権限設計を提供します。ユーザーはWeb UIを通じてバージョン管理、オンライン閲覧およびダウンロードを実現し、データセットおよびモデルファイルの可視性範囲を設定してデータセキュリティの分離を実現し、モデルおよびデータセットに関するトピックディスカッションを開始することもできます。

私たちのR&Dチームは長い間AI + DevOpsに焦点を当てており、CSGHubプロジェクトを通じて大規模モデルの開発プロセスにおける痛点を解決することを目指しています。高品質の開発および運用保守ドキュメントの貢献を奨励し、プラットフォームを共同で改善し、大規模モデル資産がより追跡可能で効率的になるようにしましょう。

### デモビデオ
CSGHubの機能と使用方法を迅速に理解するために、デモビデオを録画しました。このビデオを視聴することで、このプログラムの主要な機能と操作手順を迅速に理解できます。
- CSGHubのデモビデオは以下の通りです。また、[YouTube](https://www.youtube.com/watch?v=SFDISpqowXs)または[Bilibili](https://www.bilibili.com/video/BV1wk4y1X7G7/)で確認することもできます。
<video width="658" height="432" src="https://github-production-user-asset-6210df.s3.amazonaws.com/3232817/296556812-205d07f2-de9d-4a7f-b3f5-83514a71453e.mp4"></video>

### ロードマップ
- **資産管理**
  - [x] 組み込みコードリポジトリ：モデル、データセット、スペースアプリケーションのコードを関連付けるための組み込みコードリポジトリ管理機能。
  - [x] マルチソースデータ同期：リモートリポジトリの構成と有効化、データの自動同期、OpenCSGコミュニティ、Huggingfaceなどのリモートソースをサポート。
- **AIの強化**
  - [x] ワンクリック微調整：OpenCSG llm-finetuneツールとの統合をサポートし、ワンクリックでモデルの微調整トレーニングを開始。
  - [x] ワンクリック推論：OpenCSG llm-inferenceツールとの統合をサポートし、ワンクリックでモデル推論サービスを開始。
- **LLMアプリおよび企業機能**
  - [x] アプリスペース：Gradio/StreamlitアプリケーションのホスティングとApp Spaceへの公開をサポート。
  - [x] 細粒度の権限制御：企業アーキテクチャ向けの細粒度の権限およびアクセス制御設定。
- **セキュリティコンプライアンス**
  - [ ] GitServerアダプター：アダプターモードを通じて複数の主要なGitリポジトリタイプをサポートする汎用GitServerアダプター。
  - [x] 資産メタデータ：カスタマイズされたメタデータタイプと対応するAutoTagルールをサポートする資産メタデータ管理メカニズム。

詳細なロードマップは次のとおりです：[完全なロードマップ](/docs/roadmap_en.md)

### アーキテクチャ
CSGHubは、ポータルとサーバーの2つの典型的な部分で構成されています。このリポジトリはCSGHubポータルに対応しており、CSGHubサーバーはGolangで実装された高性能なバックエンドプロジェクトです。

CSGHubサーバーの詳細を深く掘り下げるか、サーバーを独自のフロントエンドシステムに統合するか、またはその他の目的で使用する場合は、[CSGHubサーバーのオープンソースプロジェクト](https://github.com/OpenCSGs/csghub-server)を確認できます。

#### CSGHubポータルアーキテクチャ
<img src="/docs/images/portal_tech_graph.png" width='800'>

#### CSGHubサーバーアーキテクチャ
<img src="/docs/images/server_tech_graph.png" width='800'>

### クイックスタート
次のコマンドを使用して、ポータル/サーバーおよびその他の関連依存関係を含むCSGHubインスタンスを迅速に環境にデプロイできます：
```shell
# [IP Address]を自分のLAN/WLAN IPアドレスに置き換えてください
export SERVER_DOMAIN=[IP Address]
curl -L https://raw.githubusercontent.com/OpenCSGs/csghub/main/all-in-one.yml -o all-in-one.yml
docker compose -f all-in-one.yml up -d
```

中国にいる場合やdockerhubのネットワーク接続の問題が発生した場合は、次のコマンドを使用して、aliyun dockerレジストリアルタナティブバージョンを試すことができます：
```shell
# [IP Address]を自分のLAN/WLAN IPアドレスに置き換えてください
export SERVER_DOMAIN=[IP Address]
curl -L https://raw.githubusercontent.com/OpenCSGs/csghub/main/all-in-one-CN.yml -o all-in-one-CN.yml
docker compose -f all-in-one-CN.yml up -d
```

または、Githubのネットワーク接続の問題が引き続き発生する場合は、次のコマンドを試すことができます：
```shell
# [IP Address]を自分のLAN/WLAN IPアドレスに置き換えてください
export SERVER_DOMAIN=[IP Address]
curl -L https://opencsg-public-resource.oss-cn-beijing.aliyuncs.com/csghub/all-in-one-CN.yml -o all-in-one-CN.yml
docker compose -f all-in-one-CN.yml up -d
```

その後、Webブラウザを使用して`http://[IP Address]`にアクセスして、この新しいCSHubインスタンスにアクセスできます。初期管理者アカウント：admin001/admin001を使用してすべての機能を試すことができます。
詳細なユーザーガイド情報については、[ユーザーガイド](https://opencsg.com/docs/)を確認できます。

**注意：**

* `SERVER_DOMAIN`（[IP Address]）は、ターゲットホストのIPアドレスまたはドメイン名である必要があります。`127.0.0.1`または`localhost`の使用は避けてください。
* リリースされたコンテナイメージはx86_64アーキテクチャ専用であり、Linux/WindowsおよびMac環境でテストされています。Mac Siliconユーザーの場合、Docker Desktopの[Rosetta for x86/AMD64 emulation Feature](https://docs.docker.com/desktop/settings/mac/#general)を有効にする必要があります。
* **警告：このクイックスタートは試用テスト専用であり、プロダクションレベルのデプロイメントをサポートしていません。** このall-in-oneスクリプトでデプロイされたCSGHubインスタンスは、ユーザーデータを効果的に永続化しません。`docker compose up`コマンドを使用してサービスを再読み込みする際にエラーが発生する可能性があります。この場合、`docker compose down -v`コマンドを使用してインスタンスを完全に削除してから再起動できます。通常のサービスデプロイメントには、常に[ステップバイステップデプロイメントガイド](/script/all_in_one/README.md)に従ってください。
* **警告：クイックスタートにはスペースアプリケーションのデプロイメントが含まれていません。** CSGHhub v0.4.0以降、スペース機能がサポートされています。追加のKubernetesおよびその他のサービスが必要なため、[完全なデプロイメントガイド](/docs/full_deployment_en.md)を参照してください。

#### 詳細な技術ドキュメント
- [開発環境のセットアップ](/docs/setup_en.md)

### 貢献
私たちは、すべてのレベルの開発者がオープンソースプロジェクトCSGHubに貢献することを歓迎します。参加したい場合は、[貢献ガイドライン](/docs/CONTRIBUTING_en.md)を参照してください。皆様の参加と提案をお待ちしております。

### 謝辞
このプロジェクトは、Rails、Vue3、Tailwind CSS、Administrate、Postgresql、Apache Arrow、DuckDB、およびGoGinに基づいており、これらのオープンソースの貢献に深く感謝しています！

### お問い合わせ
使用中に問題が発生した場合は、次のいずれかの方法でお問い合わせください：
1. githubでissueを発行する
2. WeChatヘルパーのQRコードをスキャンしてWeChatグループに参加する
3. 公式のDiscordチャンネルに参加する：[OpenCSG Discord Channel](https://discord.gg/bXnu4C9BkR)
4. Slackワークスペースに参加する：[OpenCSG Slack Channel](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
<div style="display:inline-block">
<img src="/docs/images/wechat-assistant-new.png" width='200'>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/discord-qrcode.png" width='200'>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/slack-qrcode.png" width='200'>
</div>
