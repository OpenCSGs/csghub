
[![WeChat에 참여하기](https://img.shields.io/badge/wechat-join_chat-white.svg?logo=wechat&style=social)](./docs/images/wechat-assistant-new.png)  
[![OpenCSG Slack에 참여하기](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)  
[![OpenCSG Discord에 참여하기](https://img.shields.io/badge/discord-join_chat-white.svg?logo=discord&style=social)](https://discord.gg/bXnu4C9BkR)  

**[English](README.md) ∙ [简体中文](README_zh.md) ∙ [日本語](README_jp.md)**

## CSGHub

CSGHub는 대규모 언어 모델(LLM) 자산을 관리하기 위해 설계된 오픈 소스 플랫폼으로, 데이터셋, 스페이스, 코드와 같은 LLM 자산을 효율적으로 처리할 수 있는 방법을 제공합니다. CSGHub를 사용하면 웹 인터페이스, `git` 명령어, 자연어 채팅봇 또는 [CSGHub SDK](https://github.com/OpenCSGs/csghub-sdk)를 통해 LLM 자산을 업로드, 다운로드, 저장, 검증 및 배포할 수 있습니다.

또한 CSGHub는 마이크로서비스 하위 모듈과 표준화된 OpenAPI를 제공하여 기존 시스템과의 원활한 통합을 지원합니다. CSGHub는 온프레미스 배포를 통해 안전한 오프라인 운영을 가능하게 하며, 사용자 친화적인 LLM 자산 관리 플랫폼을 제공합니다. 본질적으로, CSGHub는 Huggingface의 온프레미스 버전과 같은 역할을 합니다.

![CSGHub](./docs/images/csghub_framework.png)

### 주요 기능

- **대규모 모델 자산 통합 관리**:  
  모델, 데이터셋 및 코드의 원스톱 관리를 제공하며, 저장, 버전 관리, 수정 및 조회를 지원합니다. 초대형 파일의 업로드와 다운로드를 지원하며, Web 상에서의 온라인 편집 및 미리 보기를 통해 개발 협업 효율을 높입니다.

- **유연하고 호환 가능한 개발 생태계**:  
  HTTPS 및 SSH 프로토콜을 지원하여 사용자가 Git 명령이나 웹 인터페이스를 통해 편리하게 작업할 수 있습니다. Gradio와 Streamlit과 같은 인기 있는 SDK를 통합하여 AI 애플리케이션 개발을 단순화합니다. 또한, ****모델 추론 및 미세 조정 서비스를 원클릭****으로 제공하며, 자동으로 환경을 최적화하여 효율적인 배포와 운영을 보장합니다.

- **대규모 모델 기능 확장**:  
  포괄적인 버전 관리, 모델 형식 변환 및 자동 데이터 처리를 지원합니다. CSV와 JSON 같은 일반적인 데이터 형식을 위한 변환 도구를 제공하며, Parquet 형식 데이터셋을 Web에서 미리 보기하여 빠르게 데이터를 점검할 수 있습니다.

- **애플리케이션 공간 및 자산 관리 도우미(Copilot)**:  
  사용자는 애플리케이션 공간을 통해 모델 성능을 시연하고, 애플리케이션 프로토타입을 구축하며, 유연한 생성, 삭제, 수정 및 조회 작업을 수행할 수 있습니다. Copilot 도우미는 자산 관리를 간소화하며, 기업의 온프레미스 배포를 지원하는 프라이빗 버전도 제공합니다.

- **다중 소스 데이터 동기화 및 추천**:  
  OpenCSG 커뮤니티와 통합되어 커뮤니티 내 모델 및 데이터셋의 동기화를 지원합니다. 비즈니스 시나리오에 따라 개인화된 추천을 제공하여 기업이 적합한 AI 솔루션을 개발할 수 있도록 돕습니다.

- **포괄적인 권한 및 보안 관리**:  
  기업 사용자 시스템과의 통합을 지원하며, 자산의 가시성 설정과 내부·외부 인터페이스 인증을 제공합니다. 라이선스 준수 검사와 추적을 통해 모델이 법적 요구 사항을 충족하도록 보장합니다.

- **온프레미스 배포 지원**:  
  클라우드 서비스에 의존하지 않고 원클릭으로 온프레미스 배포를 가능하게 하여, 기업의 데이터 통제권과 보안을 보장합니다.

- **엔드투엔드 데이터 처리 및 지능형 라벨링 시스템**:  
  사용자 맞춤형 데이터 처리 파이프라인을 제공하여 복잡한 데이터 정제 및 변환을 지원하며, 병렬 처리를 통해 작업 속도를 향상시킵니다. 지능형 라벨링 시스템은 다중 사용자 협업과 검토를 지원하여 데이터 품질을 보장합니다.

- **고가용성과 재해 복구 설계**:  
  고가용성 시스템 아키텍처를 채택하여 부하 분산 및 자원 스케줄링을 지원함으로써 고부하 상황에서도 안정성을 보장합니다. 중복 백업 및 스냅샷 기술을 활용한 재해 복구를 통해 비즈니스 연속성을 보장합니다.

CSGHub에 대한 자세한 내용은 [상세 소개](./docs/detailed_intro_en.md)를 참조하세요.

### 빠른 시작

- **탐색을 원하는 사용자**: [OpenCSG 웹사이트](https://opencsg.com/models)에서 CSGHub의 무료 SaaS 버전을 사용해 보세요. [간단한 빠른 시작 가이드](./docs/csghub_saas_en.md)를 참조하여 CSGHub SaaS 인터페이스로 LLM과 데이터셋을 관리하고 LLM 애플리케이션을 배포해 보세요.
자세한 정보는 [OpenCSG 문서 센터](https://opencsg.com/docs/en/intro)를 참조하세요.

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
