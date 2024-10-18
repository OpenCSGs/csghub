
[![WeChatに参加](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)  
[![OpenCSG Slackに参加](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)  
[![OpenCSG Discordに参加](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)  

**[简体中文](README_zh.md) ∙ [日本語](README_jp.md) ∙ [한국어](README_kr.md)**

## CSGHub

CSGHubは、大規模言語モデル（LLM）の資産管理のために設計されたオープンソースプラットフォームであり、データセット、スペース、コードなどのLLM資産を効率的に管理する手段を提供します。CSGHubを利用することで、ユーザーはウェブインターフェース、`git` コマンドライン、自然言語チャットボット、または [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk) を介してLLM資産をアップロード、ダウンロード、保存、検証、および配布できます。

さらに、CSGHubは、既存のシステムとのシームレスな統合を可能にするマイクロサービスのサブモジュールと標準化されたOpenAPIも備えています。CSGHubは、LLMに特化した使いやすい管理プラットフォームを提供し、セキュアなオフライン運用のためにオンプレミスでのデプロイも可能です。事実上、CSGHubはHuggingfaceのプライベートなオンプレミス版と位置付けられます。

![CSGHub](./docs/images/csghub_framework.png)

### 主な特徴

- **LLM資産の統合管理**：モデルファイル、データセット、大規模モデルアプリケーションコードを一元管理するハブ。  
- **開発エコシステムとの互換性**：HTTPSおよびSSHプロトコルをサポートし、Gitコマンドやウェブ操作を円滑に行える。  
- **大規模モデルの能力拡張**：バージョン管理、モデル形式変換、データ自動処理、データセットプレビュー機能をネイティブにサポート。  
- **権限とセキュリティ**：企業ユーザーシステムとの統合、資産の可視性設定、内外部ユーザー向けのゼロトラスト認証インターフェースを提供し、最大限のセキュリティを確保。  
- **プライベートデプロイのサポート**：インターネットやクラウドベンダーに依存せず、ワンクリックでプライベートデプロイを実行可能。  
- **大規模モデルのネイティブ設計**：自然言語インタラクション、ワンクリックモデルデプロイ、AgentやCopilotアプリの資産管理をサポート。

詳細については、CSGHubの[詳細紹介](./docs/detailed_intro_en.md)をご覧ください。

### クイックスタート

- **探索したい方**：[OpenCSGのウェブサイト](https://opencsg.com/models)で、CSGHubの無料SaaS版を試用できます。[クイックスタートガイド](https://opencsg.com/docs/en/intro)を参考にして、CSGHub SaaSインターフェースを使い、LLMやデータセットの管理とLLMアプリケーションのデプロイをお試しください。

- **実践を希望する方**：CSGHubの基本的なローカルインスタンスを迅速にデプロイするには、[インストールガイド](https://github.com/OpenCSGs/csghub-installer/tree/main/docker-compose/csghub)をご参照ください。

- **Kubernetesでのデプロイを希望する方**：KubernetesクラスタでのCSGHubのデプロイについては、[Helm Chartインストールガイド](https://github.com/OpenCSGs/csghub-installer/tree/main/helm-chart)をご覧ください。

### ロードマップ

CSGHubの今後の方向性については、[ロードマップ](./docs/roadmap_en.md)をご確認ください。

### リリースノート

機能改善に関する情報は、[リリースノート](./docs/release_notes.md)を参照してください。

### ミーティングと貢献

[OpenCSGコミュニティ](https://github.com/OpenCSGs/community)をぜひご覧ください。プロジェクトの重要な一員になるための包括的なガイドが見つかります。

- 他のメンバーとの交流やアイデアの共有ができる[コミュニティミーティング](https://github.com/OpenCSGs/community?tab=readme-ov-file#community-meeting)に参加する方法を確認してください。  
- プロジェクトへの貢献方法については、[貢献ガイド](https://github.com/OpenCSGs/community/blob/main/guidelines/CONTRIBUTING_en.md)をご参照ください。  
- 質問や問題がある場合は、[お問い合わせ](https://github.com/OpenCSGs/community?tab=readme-ov-file#questions-and-issues)ください。OpenCSGでの旅がスムーズに進むよう、常にサポートいたします。  
- [開発ガイド](./docs/setup_en.md)を参照して、開発環境をセットアップしてください。
