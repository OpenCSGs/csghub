**[English](/docs/readme_en.md) ∙ [简体中文](/docs/readme_cn.md) ∙ [日本語](/docs/readme_ja.md)  ∙ [한국어](/docs/readme_kr.md)**
## CSGHub 설명 문서

CSGHub는 오픈 소스, 신뢰할 수 있는 대규모 모델 자산 관리 플랫폼으로, LLM 및 LLM 응용 프로그램의 수명 주기에 관련된 자산(데이터 세트, 모델 파일, 코드 등)을 관리하는 데 도움을 줍니다. CSGHub를 통해 사용자는 웹 인터페이스, Git 명령 줄 또는 자연어 Chatbot 등을 사용하여 모델 파일, 데이터 세트, 코드 등의 자산을 업로드, 다운로드, 저장, 검증 및 배포할 수 있습니다. 또한 플랫폼은 마이크로서비스 하위 모듈과 표준화된 API를 제공하여 사용자가 자신의 시스템과 쉽게 통합할 수 있습니다.

CSGHub는 대규모 모델에 원천적으로 설계된, 온프레미스 배포 및 오프라인 실행이 가능한 자산 관리 플랫폼을 제공하는 것을 목표로 합니다. CSGHub는 Huggingface와 같은 기능을 제공하며, OpenStack Glance로 가상 머신 이미지를 관리하고, Harbor로 컨테이너 이미지를 관리하고, Sonatype Nexus로 제품을 관리하는 방식과 유사하게 LLM 자산을 관리합니다.

OpenCSG 커뮤니티를 통해 SaaS 버전 기능을 체험할 수 있습니다：https://opencsg.com <br>또한 [쾌속사용](#快速使用) 섹션의 지침에 따라 로컬 서비스를 빠르게 시작하여 CSGHub의 모든 기능을 탐색할 수 있습니다.
<img src="/docs/images/project_intro.png" width='800'>
### 업데이트
- [2024.09.15] v0.9.0 CSGHub 포털이 Go 버전으로 마이그레이션되었습니다. Git 서버는 Gitaly를 지원하며 기본적으로 사용합니다. 컬렉션 기능이 추가되었고, 새로운 리소스 콘솔 페이지가 도입되었습니다. 런스페이스 엔드포인트의 미세 조정에는 더 이상 도메인이 필요하지 않습니다. 기타 사용자 경험 최적화 및 버그 수정도 이루어졌습니다.
- [2024.08.15] v0.8.0 대규모 릴리스로 독립적인 user_server 서비스를 소개하고 사용자, 조직, 토큰 관리를 CSGHub에서 백엔드 서버 CSGHub-server로 이동합니다. 애플리케이션 공간, 모드 추론 및 파인튜닝의 통일된 배포를 위한 독립형 starhub_server_runner 서비스를 도입합니다. 리소스 관리가 향상되었으며, 다른 지역의 여러 k8s 클러스터를 지원하지 않습니다.
- [2024.07.15] v0.7.0 주요 업데이트: 모델 및 데이터셋의 **다중 소스 동기화**, 모델 **원클릭 미세 조정**, 컴퓨팅 리소스 사용 **측정** 지원.
- [2024.06.21] v0.6.1 버그를 수정하고 사용자 경험을 개선했습니다.
- [2024.06.18] v0.6.0 주요 업데이트: 전용 모델 추론 배포 지원, **streamlit** 애플리케이션 공간 지원, 사용자가 **즐겨찾기** 또는 **산업 태그**를 설정할 수 있는 기능 추가, git 기록 및 차이 세부 정보 개선.
- [2024.05.14] v0.5.0 공간 사용자 경험 개선, 저장소(모델, 데이터셋, 코드 및 공간) 간 **관계 자동 구축**, 다중 파일 업로드 지원.
- [2024.04.18] v0.4.0 **애플리케이션 공간**(gradio 애플리케이션) 실행 허용, 모델 추론 시험용 위젯 추가, 새로운 저장소 유형 코드 지원, 조직 구성원 관리 지원, 위챗 로그인 지원.
- [2024.03.15] v0.3 Plan: 파일 온라인 생성 및 편집, 조직 정보 편집, 데이터셋 미리보기.
- [2024.02.15] v0.2 모델 데이터셋 호스팅 기능 개선, 조직 구성원 초대 기능 추가.
- [2024.01.15] v0.1 CSGHub 알파 버전 출시, 모델 및 데이터셋 관리 기능 지원, 자세한 기능 설명은 아래를 참조하세요.

### 핵심 이념
다양한 대규모 모델 시대에서 데이터와 모델은 점차 기업과 개인 사용자에게 가장 중요한 디지털 자산이 되고 있습니다. 그러나 현재 관리 도구의 분산, 단일 관리 방법, 단일 기계화 등의 문제에 직면해 있어, 이는 안전한 운영에 잠재적 위협이 될 뿐만 아니라 기업의 대규모 모델 능력 업데이트와 반복을 방해할 수 있습니다. 만약 대규모 모델이 정보 혁명의 주요 동력이 될 것이라고 생각하신다면, 아마도 핵심 자산인 모델, 데이터, 대규모 모델 애플리케이션 코드를 더 효율적이고 안전하게 관리하는 방법을 고려하고 계실 것입니다. CSGHub는 바로 이러한 문제를 해결하기 위해 설계된 오픈소스 프로젝트입니다.

CSGHub의 기능 특징은 다음과 같습니다（지속적인 개선）：
- **자산 통합 관리**： 일일 허브는 모델 파일, 데이터 세트, 대규모 모델 애플리케이션 코드를 통합 관리합니다.
- **연구 생태 호환**： HTTPS 및 SSH 프로토콜을 지원하는 Git 명령 및 Web 인터페이스 작업을 통해 다양한 사용자가 편리하게 사용할 수 있습니다.
- **대규모 모델 능력 확장**： 버전화된 관리, 모델 형식 변환, 데이터 자동 전처리, 데이터 세트 미리보기 등의 기능을 원시적으로 지원합니다.
- **권한 및 보안**： 기업 사용자 시스템과 통합 지원, 자산 가시 범위 설정, 내부 및 외부 인터페이스 인증 설계, 기업 보안 요구 충족.
- **사설 배포 지원**： 인터넷 또는 클라우드 업체 종속성 없이 한 번의 클릭으로 사설 배포를 시작할 수 있습니다.
- **대규모 모델 원천 설계**： 자연어 상호 작용, 모델 원클릭 배포, Agent 및 Copilot App 등의 자산 관리를 지원합니다.

### 기술 특징
CSGHub의 기술 특징은 ：
- CSGHub는 다중 소스 Git Server, Git LFS 대형 파일 저장 프로토콜 및 객체 저장소 OSS와 같은 기술을 통합하여 신뢰할 수 있는 데이터 저장층, 유연한 인프라 접근층 및 높은 호환성의 개발 도구 지원을 제공합니다.
- 서비스 지향 아키텍처를 통해 CSGHub는 CSGHub 서버 백엔드 서비스와 CSGHub 웹 서비스 관리 인터페이스를 제공합니다. 일반 사용자는 Docker compose나 Kubernetes Helm Chart를 사용하여 빠르게 서비스를 시작하고 생산 수준의 자산 관리를 구현할 수 있습니다. 자체 개발 능력을 갖춘 사용자는 CSGHub 서버를 활용하여 2차 개발을 수행하고 관리 기능을 외부 시스템에 통합하거나 고급 기능을 사용자 정의할 수 있습니다.
- CSGHub는 Apache Arrow와 DuckDB 등의 우수한 오픈소스 프로젝트를 활용하여 Parquet 데이터 파일 형식의 미리보기를 지원하여 알고리즘 연구원과 애호가들이 로컬화된 데이터셋 관리를 수행할 수 있도록 합니다.
- CSGHub는 직관적인 웹 인터페이스와 기업 조직 구조를 위한 권한 설계를 제공합니다. 사용자는 웹 UI를 통해 버전 제어 관리, 온라인 브라우징 및 다운로드를 구현할 수 있으며, 데이터셋과 모델 파일의 가시 범위를 설정하여 데이터 보안 격리를 실현할 수 있고, 모델과 데이터셋에 대한 토픽 토론을 시작할 수 있습니다.

OpenCSG 팀은 대규모 모델 영역에 집중하며, CSGHub 프로젝트를 통해 대규모 모델 개발 과정의 문제점을 해결하고자 합니다. 우리는 모든 분들이 고품질의 개발 및 운영 문서를 기여하고, 함께 이 플랫폼을 개선하여 대규모 모델의 관리가 "근거가 있고 추적 가능"하도록 만들어 나가기를 장려합니다.

### 데모 비디오
CSGHub의 기능과 사용 방법을 더 직관적으로 이해하실 수 있도록 데모 비디오를 녹화했습니다. 비디오를 통해 이 프로젝트의 주요 특징과 작동 과정을 빠르게 파악하실 수 있습니다.
- CSGHub 기능 데모는 다음과 같습니다. 외부 비디오 웹사이트를 통해서도 확인하실 수 있습니다: [YouTube](https://www.youtube.com/watch?v=SFDISpqowXs) [Bilibili](https://www.bilibili.com/video/BV1wk4y1X7G7/)
<video width="658" height="432" src="https://github-production-user-asset-6210df.s3.amazonaws.com/3232817/296556812-205d07f2-de9d-4a7f-b3f5-83514a71453e.mp4"></video>

### 최근 로드맵
- **자산 관리**
  - [x] 내장 코드 저장소：내장 코드 Repo 관리 기능, 모델, 데이터셋, Space 공간 애플리케이션의 코드를 연결할 수 있습니다.
  - [x] 다중 소스 데이터 동기화：구성 및 활성화 가능한 원격 저장소, 자동 데이터 동기화, OpenCSG 커뮤니티, Huggingface 등의 원격 소스 지원.
- **AI 능력 강화**
  - [x] 원클릭 마이크로 조정: OpenCSG llm-finetune와 통합, 한 번의 클릭으로 모델 마이크로 조정 훈련을 시작할 수 있습니다.
  - [x] 원클릭 추론: OpenCSG llm-inference와 통합, 한 번의 클릭으로 모델 추론 서비스를 시작할 수 있습니다.
- **애플리케이션 및 기업 기능**
  - [x] 애플리케이션 공간: Gradio/Streamlit 애플리케이션 호스팅 및 Space 애플리케이션 공간에 발행 지원
  - [x] 세분화된 권한 제어: 기업 구조를 위한 세분화된 권한 및 접근 제어 설정
- **보안 및 규정 준수**
  - [ ] GitServer 어댑터: 범용 GitServer 어댑터, Adaptor 패턴을 통해 여러 주류 Git 저장소 백엔드 지원 구현.
  - [x] 자산 메타데이터: 자산 메타데이터 관리 메커니즘, 사용자 정의 메타데이터 유형 및 해당 AutoTag 규칙 지원.

자세한 로드맵 설계는 다음을 참조하세요: [전체 로드맵](/docs/roadmap.md)

### 상세 아키텍처
CSGHub는 Portal과 Server 두 부분의 서비스로 구성되며, 이 프로젝트 코드는 CSGHub Portal에 해당합니다. CSGHub Server는 golang으로 구현된 고성능 백엔드입니다.

CSGHub Server에 대해 자세히 알아보거나 Server를 자체 프론트엔드 시스템에 통합하거나 2차 개발을 수행하고 싶다면 [CSGHub Server 오픈소스 프로젝트](https://github.com/OpenCSGs/csghub-server)를 확인하세요。
#### CSGHub Portal 아키텍처 다이어그램
<img src="/docs/images/portal_tech_graph.png" width='800'>

#### CSGHub 서버 아키텍처
<img src="/docs/images/server_tech_graph.png" width='800'>

### 빠른 사용
기본 기능을 갖춘 CSGHub 인스턴스를 배포하려면 배포 [도움말 문서](/deploy/all_in_one/README.md)를 참조하세요.

### 상세 기술 문서
- [개발 환경 설정](/docs/setup.md)

### 기여 가이드
우리는 모든 수준의 개발자가 CSGHub 오픈소스 프로젝트에 기여할 수 있도록 환영합니다. 기여하고 싶다면 [기여 가이드](/CONTRIBUTING.md)를 참조하세요.

### 감사의 말
이 프로젝트는 Rails, Vue3, Tailwind CSS, Administrate, Postgresql, Apache Arrow, DuckDB, GoGin을 기반으로 합니다. 이들의 오픈소스 기여에 깊은 감사를 표합니다!

### 연락처
사용 중 문제가 있으면 다음 중 하나를 통해 문의하세요：
1. GitHub 에서 이슈를 생성하세요
2. 아래 왼쪽 위치에 있는 WeChat QR 코드를 스캔하여 추가하고 "开源" 또는 "open source"를 입력하여 우리의 웹채팅 그룹에 가입하세요.
3. 우리의 Discord 채널에 가입하세요: [OpenCSG Discord Channel](https://discord.gg/bXnu4C9BkR)
4. 우리의 Slack 채널에 가입하세요: [OpenCSG Slack Channel](https://join.slack.com/t/opencsghq/shared_invite/zt-2fmtem7hs-s_RmMeoOIoF1qzslql2q~A)
<div style="display:inline-block">
<img src="/docs/images/wechat-assistant-new.png" width='200'>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/discord-qrcode.png" width='200'>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="/docs/images/slack-qrcode.png" width='200'>
</div>
