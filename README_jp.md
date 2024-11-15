
[![WeChatに参加](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)  
[![OpenCSG Slackに参加](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)  
[![OpenCSG Discordに参加](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)  

**[English](README.md) ∙ [简体中文](README_zh.md) ∙ [한국어](README_kr.md)**

## CSGHub

CSGHubは、大規模言語モデル（LLM）の資産管理のために設計されたオープンソースプラットフォームであり、データセット、スペース、コードなどのLLM資産を効率的に管理する手段を提供します。CSGHubを利用することで、ユーザーはウェブインターフェース、`git` コマンドライン、自然言語チャットボット、または [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk) を介してLLM資産をアップロード、ダウンロード、保存、検証、および配布できます。

さらに、CSGHubは、既存のシステムとのシームレスな統合を可能にするマイクロサービスのサブモジュールと標準化されたOpenAPIも備えています。CSGHubは、LLMに特化した使いやすい管理プラットフォームを提供し、セキュアなオフライン運用のためにオンプレミスでのデプロイも可能です。事実上、CSGHubはHuggingfaceのプライベートなオンプレミス版と位置付けられます。

![CSGHub](./docs/images/csghub_framework.png)

### 主な特徴

- LLMの統合管理
- 拡張可能な開発フレームワーク
- 高度なモデル機能と最適化
- スペースと資産管理アシスタント（Copilot）
- マルチソースデータの同期と推奨
- エンタープライズレベルのセキュリティとアクセス制御
- オンプレミス展開ソリューション
- エンドツーエンドのデータ処理とインテリジェントアノテーションシステム
- 高可用性の堅牢なアーキテクチャ

詳細については、CSGHubの[詳細紹介](./docs/detailed_intro_en.md)をご覧ください。

### デモ動画

CSGHub の主要な機能と使い方を素早く理解していただくために、デモ動画を作成しました。下記または [YouTube](https://www.youtube.com/watch?v=6LwGQ07qBxU)/[Bilibili](https://www.bilibili.com/video/BV1ynmxY3EXz/) でご覧いただけます。  
<video width="658" height="432" src="https://github.com/user-attachments/assets/04f9fa17-9294-44c1-8c4a-4d7b9a5c66fa"></video>

### クイックスタート

- **探索したい方：** [OpenCSGのウェブサイト](https://opencsg.com)で、CSGHubの無料SaaS版を試用できます。[クイックスタートガイド](./docs/csghub_saas_en.md)を参考にして、CSGHub SaaSインターフェースを使い、LLMやデータセットの管理とLLMアプリケーションのデプロイをお試しください。
詳細については、[OpenCSG ドキュメントセンター](https://opencsg.com/docs/en/intro)をご参照ください。

- **さらに実践を希望するユーザーへ：** ローカル環境（Linux/MacOS/Windows）で CSGHub を迅速に起動したい場合は、[Docker ワンクリックデプロイ](https://github.com/OpenCSGs/csghub-installer/tree/main/docker)を使用して CSGHub インスタンスをセットアップできます。簡単なコマンドでオールインワンコンテナを起動し、CSGHub のコア機能をすぐに体験することができます。

- **Kubernetesでのデプロイを希望する方：** KubernetesクラスタでのCSGHubのデプロイについては、[Helm Chartインストールガイド](https://github.com/OpenCSGs/csghub-installer/tree/main/helm-chart)をご覧ください。

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
