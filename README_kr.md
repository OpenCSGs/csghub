
[![WeChat에 참여하기](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)  
[![OpenCSG Slack에 참여하기](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)  
[![OpenCSG Discord에 참여하기](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)  

**[简体中文](README_zh.md) ∙ [日本語](README_jp.md) ∙ [한국어](README_kr.md)**

## CSGHub

CSGHub는 대규모 언어 모델(LLM) 자산을 관리하기 위해 설계된 오픈 소스 플랫폼으로, 데이터셋, 스페이스, 코드와 같은 LLM 자산을 효율적으로 처리할 수 있는 방법을 제공합니다. CSGHub를 사용하면 웹 인터페이스, `git` 명령어, 자연어 채팅봇 또는 [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk)를 통해 LLM 자산을 업로드, 다운로드, 저장, 검증 및 배포할 수 있습니다.

또한 CSGHub는 마이크로서비스 하위 모듈과 표준화된 OpenAPI를 제공하여 기존 시스템과의 원활한 통합을 지원합니다. CSGHub는 온프레미스 배포를 통해 안전한 오프라인 운영을 가능하게 하며, 사용자 친화적인 LLM 자산 관리 플랫폼을 제공합니다. 본질적으로, CSGHub는 Huggingface의 온프레미스 버전과 같은 역할을 합니다.

![CSGHub](./docs/images/csghub_framework.png)

### 주요 기능

- **LLM 자산 통합 관리**: 모델 파일, 데이터셋, 대규모 모델 애플리케이션 코드를 통합 관리하는 원스톱 허브.  
- **개발 에코시스템 호환성**: HTTPS와 SSH 프로토콜을 지원하여 다양한 사용자들이 Git 명령어와 웹 인터페이스를 편리하게 사용할 수 있습니다.  
- **대규모 모델 기능 확장**: 버전 관리, 모델 형식 변환, 자동 데이터 처리, 데이터셋 미리보기 기능을 네이티브로 지원합니다.  
- **권한 및 보안**: 기업 사용자 시스템과의 통합, 자산 가시성 설정, 외부 및 내부 사용자 모두를 위한 제로 트러스트 인증 인터페이스를 제공합니다.  
- **프라이빗 배포 지원**: 인터넷과 클라우드 벤더에 의존하지 않고 원클릭으로 프라이빗 배포를 시작할 수 있습니다.  
- **대규모 모델을 위한 네이티브 설계**: 자연어 인터랙션, 원클릭 모델 배포 및 Agent와 Copilot 앱의 자산 관리 기능을 지원합니다.

CSGHub에 대한 자세한 내용은 [상세 소개](./docs/detailed_intro_en.md)를 참조하세요.

### 빠른 시작

- **탐색을 원하는 사용자**: [OpenCSG 웹사이트](https://opencsg.com/models)에서 CSGHub의 무료 SaaS 버전을 사용해 보세요. [간단한 빠른 시작 가이드](https://opencsg.com/docs/en/intro)를 참조하여 CSGHub SaaS 인터페이스로 LLM과 데이터셋을 관리하고 LLM 애플리케이션을 배포해 보세요.

- **실습을 원하는 사용자**: [설치 가이드](https://github.com/OpenCSGs/csghub-installer/tree/main/docker-compose/csghub)를 따라 CSGHub의 기본 로컬 인스턴스를 신속하게 배포해 보세요.

- **Kubernetes에 배포하려는 사용자**: [Helm Chart 설치 가이드](https://github.com/OpenCSGs/csghub-installer/tree/main/helm-chart)를 참조하여 단계별 지침을 따르세요.

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
