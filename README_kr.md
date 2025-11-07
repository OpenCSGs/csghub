
[![WeChat에 참여하기](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)  
[![OpenCSG Slack에 참여하기](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)  
[![OpenCSG Discord에 참여하기](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)  

**[English](README.md) ∙ [简体中文](README_zh.md) ∙ [日本語](README_jp.md)**

## CSGHub

CSGHub는 대규모 언어 모델(LLM) 자산을 관리하기 위해 설계된 오픈 소스 플랫폼으로, 데이터셋, 스페이스, 코드와 같은 LLM 자산을 효율적으로 처리할 수 있는 방법을 제공합니다. CSGHub를 사용하면 웹 인터페이스, `git` 명령어, 자연어 채팅봇 또는 [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk)를 통해 LLM 자산을 업로드, 다운로드, 저장, 검증 및 배포할 수 있습니다.

또한 CSGHub는 마이크로서비스 하위 모듈과 표준화된 OpenAPI를 제공하여 기존 시스템과의 원활한 통합을 지원합니다. CSGHub는 온프레미스 배포를 통해 안전한 오프라인 운영을 가능하게 하며, 사용자 친화적인 LLM 자산 관리 플랫폼을 제공합니다. 본질적으로, CSGHub는 Huggingface의 온프레미스 버전과 같은 역할을 합니다.

![CSGHub](./docs/images/csghub_framework.png)

### 주요 기능

- 통합된 LLM 관리
- 확장 가능한 개발 프레임워크
- 고급 모델 기능 및 최적화
- 스페이스 및 자산 관리 어시스턴트 (Copilot)
- 다중 소스 데이터 동기화 및 추천
- 엔터프라이즈급 보안 및 액세스 컨트롤
- 온프레미스 배포 솔루션
- 엔드 투 엔드 데이터 처리 및 인텔리전트 어노테이션 시스템
- 탄력적인 고가용성 아키텍처

CSGHub에 대한 자세한 내용은 [상세 소개](./docs/detailed_intro_en.md)를 참조하세요.

### 데모 비디오

CSGHub 를 빠르게 익힐 수 있도록 주요 기능과 사용 방법을 소개하는 데모 비디오를 준비했습니다. 아래에서 보거나 [YouTube](https://www.youtube.com/watch?v=6LwGQ07qBxU)/[Bilibili](https://www.bilibili.com/video/BV1ynmxY3EXz/).
<video width="658" height="432" src="https://github.com/user-attachments/assets/04f9fa17-9294-44c1-8c4a-4d7b9a5c66fa"></video>

### 빠른 시작

- **탐색을 원하는 사용자:** [OpenCSG 웹사이트](https://opencsg.com)에서 CSGHub의 무료 SaaS 버전을 사용해 보세요. [간단한 빠른 시작 가이드](./docs/csghub_saas_en.md)를 참조하여 CSGHub SaaS 인터페이스로 LLM과 데이터셋을 관리하고 LLM 애플리케이션을 배포해 보세요.

- **추가 연습을 원하는 사용자:** [CSGHub 공식 문서](https://opencsg.com/docs/csghub/101/introduction)를 참조하세요. 이 문서는 현재 [Docker Compose](https://opencsg.com/docs/en/csghub/101/install/docker/overview) 및 [Helm Chart](https://opencsg.com/docs/en/csghub/101/install/kubernetes/overview) 를 사용한 설치 방법을 제공합니다.

    _자세한 내용 및 고급 튜토리얼은 [OpenCSG 문서 센터](https://opencsg.com/docs/intro)를 참조하세요._


### 로드맵

CSGHub의 향후 방향에 대해 알아보려면 [로드맵](./docs/roadmap_en.md)을 확인하세요.

### 릴리스 노트

기능 개선에 대한 정보는 [릴리스 노트](./docs/release_notes.md)를 참조하세요.

### 회의 및 기여

[OpenCSG 커뮤니티](https://github.com/OpenCSGs/community)를 탐색해 보세요. 프로젝트의 중요한 일원이 되는 방법에 대한 포괄적인 가이드를 찾을 수 있습니다.

- 다른 멤버들과 소통하고 아이디어를 공유할 수 있는 [커뮤니티 회의](https://github.com/OpenCSGs/community?tab=readme-ov-file#community-meeting)에 참여하는 방법을 알아보세요.  
- 프로젝트에 기여하는 방법에 대해서는 [기여 가이드](https://github.com/OpenCSGs/community/blob/main/guidelines/CONTRIBUTING_en.md)를 참조하세요.  
- 질문이나 문제가 있는 경우 [문의](https://github.com/OpenCSGs/community?tab=readme-ov-file#questions-and-issues)하세요. OpenCSG 여정에서 항상 지원을 받으실 수 있습니다.  
- 개발 환경 설정에 대해서는 [개발 가이드](./docs/setup_en.md)를 참조하세요.
