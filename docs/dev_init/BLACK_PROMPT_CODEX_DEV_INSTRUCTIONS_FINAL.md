# Black Prompt 웹 기반 모바일 가로모드 MVP Codex 개발지시서

**문서 버전:** v1.0  
**작성 기준일:** 2026-05-07  
**구현 대상:** Codex  
**기술 기준:** Vite + React + TypeScript  
**원본 기획 기준:** `black_prompt_system_design_v1.md`  
**주요 목표:** Plague Inc 계열의 “지도 중심 실시간 확산/대응 전략 시뮬레이션” 구조를 참고하되, Black Prompt의 디지털 인프라 침투/AI 방어망/모델 오염/귀속 기만 세계관에 맞춘 웹 MVP를 구현한다.

---

## 0. Codex에게 주는 최상위 지시

이 문서는 단순 기획서가 아니라 **구현 명세서**다. Codex는 이 문서를 기준으로 실제 프로젝트 파일을 생성·수정하고, 실행 가능한 MVP를 완성해야 한다.

작업 중 모호한 부분이 있어도 질문으로 중단하지 말고, 아래 원칙에 따라 합리적인 MVP 기본값을 선택한 뒤 계속 구현한다.

1. 원본 `black_prompt_system_design_v1.md`의 시스템 설계를 우선한다.
2. 사용자가 이 개발지시서에 명시한 요구사항을 원본 문서보다 우선한다.
3. 보안적으로 실제 공격 절차, 익스플로잇, 침투 방법, 현실 네트워크 조작 기능은 구현하지 않는다. 모든 것은 추상화된 허구 게임 수치 시뮬레이션으로 구현한다.
4. React 컴포넌트에 게임 수식, 텍스트, 이벤트 스크립트를 직접 하드코딩하지 않는다.
5. MVP라도 게임 로직, 데이터, 콘텐츠, UI, i18n을 분리한다.
6. 개발이 끝나면 루트 폴더에 `IMPLEMENTATION_REPORT.md`를 작성한다.
7. 구현 중 결정한 임시값, 미완성 영역, 추후 개선점은 숨기지 말고 `IMPLEMENTATION_REPORT.md`에 기록한다.
8. `npm run build`와 `npm test`가 가능한 상태를 목표로 한다. 실패가 남으면 원인과 해결 방안을 보고서에 명확히 쓴다.

---

## 1. 구현 목표 요약

### 1.1 장르와 플레이 감각

Black Prompt MVP는 다음 감각을 목표로 한다.

```text
실시간 날짜 진행 → 지도 위 권역별 침투 확산 → 탐지 상승 → 지역/글로벌 AI 방어 반격 → 자원 획득 → 작전 실행 → 스킬트리 업그레이드 → 엔딩 분기
```

원본 md의 핵심 압박 구조를 반드시 살린다.

```text
확산이 느리면 자원이 부족하다.
확산이 빠르면 탐지된다.
탐지되면 방어가 오른다.
방어가 오르면 침투가 깎인다.
늦으면 글로벌 방어가 완성된다.
너무 빨리 공격하면 세계가 단결한다.
```

### 1.2 MVP에서 반드시 가능해야 하는 것

MVP 완료 시 사용자는 최소한 다음을 할 수 있어야 한다.

1. 새 게임을 시작한다.
2. 시작 권역을 선택한다.
3. 게임 시간이 자동으로 일 단위로 진행된다.
4. 일시정지/재생을 할 수 있다.
5. 1배속/2배속을 전환할 수 있다.
6. 세계지도 배경 위의 권역 버튼을 눌러 지역 상태를 본다.
7. 선택한 권역에 4~6개의 기본 작전을 실행한다.
8. 스킬트리 버튼을 눌러 별도 레이어/모달에서 업그레이드를 구매한다.
9. 스킬트리, 상태창, 이벤트 선택창이 열리면 게임 시간이 자동으로 멈춘다.
10. 모달을 닫아도 자동 재생하지 않고, 사용자가 다시 재생 버튼을 눌러야 시간이 흐른다.
11. 이벤트 로그를 확인한다.
12. 글로벌 방어, 세계 안정도, 글로벌 노출, 자원 상태를 확인한다.
13. 장악/붕괴/잠식/그림자 계열 승리 또는 글로벌 방어 완성/침투망 제거 패배를 경험할 수 있다.
14. 저장/불러오기가 가능하다.
15. PC 브라우저와 모바일 가로모드에서 모두 플레이할 수 있다.

### 1.3 MVP에서 하지 말아야 하는 것

다음은 MVP 범위에서 제외한다.

1. 실제 국가별 정확한 GIS 지도 구현.
2. 실제 사이버 공격 코드, 네트워크 요청, 스캐닝, 익스플로잇 구현.
3. LLM API 연동.
4. 온라인 멀티플레이.
5. 서버 저장.
6. 복잡한 시네마틱.
7. 대규모 번역 파일 완성.
8. 실제 Plague Inc의 UI, 이미지, 명칭, 자산 복제.

---

## 2. 기술 스택

### 2.1 필수

```text
Vite
React
TypeScript
CSS Modules 또는 일반 CSS
Vitest
localStorage
```

### 2.2 권장 패키지

가볍게 구현하는 것을 우선한다. 상태관리는 우선 React 기본 기능을 사용한다.

```text
react
react-dom
vite
typescript
vitest
@vitejs/plugin-react
```

추가 상태관리 라이브러리, UI 프레임워크, 지도 라이브러리는 기본적으로 사용하지 않는다. 단, 기존 프로젝트에 이미 설치되어 있고 충돌이 없다면 사용해도 된다. 새로 설치해야 한다면 먼저 기본 구현을 우선한다.

### 2.3 지도 구현 방식

MVP는 라이브러리 기반 GIS 지도가 아니라 다음 방식으로 구현한다.

```text
public/world-map-placeholder.svg
+ absolute positioned region buttons
+ region별 x/y 퍼센트 좌표
```

세계지도 이미지는 정확하지 않아도 된다. 알아볼 수 있는 펼쳐진 세계지도 느낌이면 충분하다. Codex가 임시 SVG를 직접 생성해도 된다.

---

## 3. 프로젝트 구조

기존 프로젝트가 비어 있거나 Vite 프로젝트가 아니면 Vite + React + TypeScript 프로젝트로 구성한다. 이미 프로젝트가 있으면 구조를 크게 훼손하지 말고 아래 구조에 맞춰 확장한다.

권장 루트 구조:

```text
black-prompt-mvp/
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  README.md
  GAME_ARCHITECTURE.md
  IMPLEMENTATION_REPORT.md        # 개발 완료 후 작성
  public/
    world-map-placeholder.svg
  src/
    main.tsx
    App.tsx
    app/
      AppShell.tsx
      appConfig.ts
    components/
      common/
        Modal.tsx
        ProgressBar.tsx
        StatPill.tsx
        IconButton.tsx
      layout/
        TopStatusBar.tsx
        BottomCommandBar.tsx
        DesktopSidePanel.tsx
        MobileRegionSheet.tsx
        RotateDeviceOverlay.tsx
      map/
        WorldMapPanel.tsx
        RegionMarker.tsx
      panels/
        RegionDetailPanel.tsx
        GlobalStatusPanel.tsx
        OperationPanel.tsx
        EventLogPanel.tsx
        ResourcePanel.tsx
      modals/
        SkillTreeModal.tsx
        EventChoiceModal.tsx
        GlobalStatusModal.tsx
        HelpModal.tsx
        EndingModal.tsx
        NewGameModal.tsx
    data/
      regions.ts
      abilities.ts
      operations.ts
      events.ts
      endings.ts
      defenseProtocols.ts
    engine/
      types.ts
      constants.ts
      createInitialGame.ts
      gameReducer.ts
      tick.ts
      formulas.ts
      actionResolver.ts
      abilityResolver.ts
      eventResolver.ts
      defenseResolver.ts
      victoryResolver.ts
      rng.ts
      clamp.ts
      selectors.ts
      validation.ts
    locales/
      i18n.ts
      ko.ts
      en.ts
    state/
      useGameLoop.ts
      useGameController.ts
      persistence.ts
    styles/
      global.css
      layout.css
      map.css
    tests/
      formulas.test.ts
      tick.test.ts
      actionResolver.test.ts
      abilityResolver.test.ts
      victoryResolver.test.ts
      i18n.test.ts
      persistence.test.ts
```

중요: `src/engine`, `src/data`, `src/locales`는 향후 Godot 또는 다른 클라이언트로 컨버팅할 때 참고 가능한 독립 레이어로 유지한다.

---

## 4. 레이어 분리 원칙

### 4.1 UI 레이어

React 컴포넌트는 다음만 담당한다.

```text
화면 표시
사용자 입력 수집
모달 열기/닫기
선택된 지역/선택된 탭 같은 UI 상태 관리
engine 함수 호출 결과 렌더링
```

React 컴포넌트에서 하면 안 되는 것:

```text
침투율 계산식 작성
방어율 계산식 작성
승리/패배 판정 직접 작성
이벤트 조건 직접 작성
표시 텍스트 직접 하드코딩
지역/스킬/작전 데이터 직접 선언
```

### 4.2 엔진 레이어

`src/engine`은 순수 함수 중심으로 구현한다.

예:

```ts
advanceOneDay(gameState, staticData, selectedEventChoice?): GameState
resolveOperation(gameState, operationId, targetRegionId): GameState
purchaseAbility(gameState, abilityId): GameState
checkEnding(gameState): EndingResult | null
```

엔진 함수는 DOM, React, CSS, 브라우저 이벤트에 의존하지 않는다.

### 4.3 데이터 레이어

`src/data`에는 숫자와 규칙 데이터를 둔다.

```text
regions.ts          권역 정적 데이터
abilities.ts        스킬트리 데이터
operations.ts       사용자가 누르는 기본 작전 데이터
events.ts           이벤트 조건/효과/텍스트키
defenseProtocols.ts 방어 프로토콜 데이터
endings.ts          엔딩 조건 메타데이터
```

사용자에게 보이는 문장은 여기에도 직접 쓰지 말고 locale key만 둔다.

### 4.4 콘텐츠/i18n 레이어

`src/locales/ko.ts`에 한국어 문구를 둔다. `src/locales/en.ts`는 지금 완성하지 않아도 되지만, 구조는 반드시 만든다.

```ts
// locales/ko.ts
export const ko = {
  "app.title": "Black Prompt",
  "region.na_cloud.name": "북미 클라우드 블록",
  "skill.api_echo_1.name": "API 잔향",
  "event.cloud_update_window.title": "대규모 클라우드 업데이트 창"
} as const;
```

```ts
// locales/en.ts
export const en = {
  // MVP에서는 비워두거나 일부만 작성한다.
  // 누락된 key는 ko fallback을 사용한다.
} as const;
```

`i18n.ts`는 fallback을 구현한다.

```ts
function t(key: string, vars?: Record<string, string | number>): string {
  // selected locale → ko → [missing:key]
}
```

---

## 5. 시간 진행 시스템

### 5.1 실시간 일 단위 진행

원본 md는 1턴=1주 기준이지만, 이 MVP는 사용자 요구에 따라 **실시간 일 단위 진행**으로 구현한다.

MVP 기본값:

```ts
NORMAL_DAY_DURATION_MS = 1000; // 1초에 게임 날짜 1일 진행
FAST_DAY_DURATION_MS = 500;    // 2배속, 0.5초에 게임 날짜 1일 진행
```

속도는 `1x`, `2x`만 제공한다.

### 5.2 시작 날짜

새 게임 시작 시 시작 연도는 현재 실제 연도 + 3년으로 한다.

```ts
const startYear = new Date().getFullYear() + 3;
const startDate = `${startYear}-01-01`;
```

테스트 가능성을 위해 `createInitialGame`은 기준 날짜를 주입받을 수 있어야 한다.

```ts
createInitialGame({
  seed: 12345,
  startRegionId: "gs_mobilecloud",
  baseDate: new Date("2026-05-07")
});
```

위 예시의 시작 날짜는 `2029-01-01`이 된다.

### 5.3 일시정지 규칙

다음 상황에서는 게임 시간이 자동으로 멈춘다.

```text
스킬트리 모달 열림
지역 상세 모달 열림, 모바일 한정
글로벌 상태창 열림
이벤트 선택창 열림
도움말/설정/엔딩창 열림
새 게임 선택창 열림
```

모달을 닫아도 자동 재생하지 않는다. 사용자가 직접 재생 버튼을 눌러야 한다.

구현 방식:

```text
UI state: isRunning, speed, activeModal
useGameLoop는 isRunning === true이고 activeModal === null일 때만 TICK_DAY dispatch
openModal()은 반드시 isRunning=false로 만든다
closeModal()은 isRunning을 true로 바꾸지 않는다
```

### 5.4 날짜 표시

상단 상태바에는 다음을 표시한다.

```text
날짜: 2029년 1월 13일
속도: 1x 또는 2x
상태: 재생 중 / 일시정지
```

날짜 계산은 `dayIndex` 기반으로 한다. 저장 데이터에는 `currentDateISO` 또는 `dayIndex + startDateISO`를 저장한다.

---

## 6. 핵심 데이터 타입

`src/engine/types.ts`에 타입을 명확히 정의한다. 아래 이름은 그대로 사용해도 된다.

### 6.1 공통 타입

```ts
export type RegionId =
  | "na_cloud"
  | "cn_sovai"
  | "eu_reggrid"
  | "in_datacommons"
  | "ea_chipbelt"
  | "gulf_finnet"
  | "gs_mobilecloud"
  | "eurasia_shadow";

export type ResourceKey = "compute" | "exploit" | "influencePoint";

export type AbilityBranch = "propagation" | "stealth" | "influence";

export type RouteType =
  | "cloud_peering"
  | "api_supply"
  | "chip_supply"
  | "platform_dependency"
  | "supply_chain"
  | "hardware_export"
  | "gray_route"
  | "labor_api"
  | "remittance_finance"
  | "regulatory_exchange";
```

원본 md의 지역 ID는 `NA_CLOUD`처럼 대문자지만, 구현에서는 i18n key와 저장 안정성을 위해 lower_snake_case로 정규화한다.

### 6.2 정적 지역 데이터

```ts
export interface RegionRoute {
  to: RegionId;
  type: RouteType;
  weight: number; // 0~1 권장
}

export interface MapPosition {
  x: number; // percent, 0~100
  y: number; // percent, 0~100
}

export interface RegionDefinition {
  id: RegionId;
  nameKey: string;
  descriptionKey: string;
  tags: string[];
  mapPosition: MapPosition;
  digitalInfra: number;          // 0~100
  computeDensity: number;        // 0~100
  cloudDependency: number;       // 0~1
  aiSovereignty: number;         // 0~1
  cyberDefense: number;          // 0~100
  networkOpenness: number;       // 0~1
  surveillanceAI: number;        // 0~1
  politicalFragmentation: number;// 0~1
  baseStability: number;         // 0~100
  routes: RegionRoute[];
}
```

### 6.3 지역 상태 데이터

```ts
export interface RegionRuntimeState {
  infiltration: number;   // 0~100
  detection: number;      // 0~100, 지역 탐지율
  defense: number;        // 0~100, 지역 방어율
  influence: number;      // 0~100
  stability: number;      // 0~100
  localAlert: boolean;
  lockdown: boolean;
  purgedLastDay: number;
  activeEffects: ActiveEffect[];
}
```

### 6.4 플레이어/글로벌 상태

```ts
export interface Resources {
  compute: number;
  exploit: number;
  influencePoint: number;
}

export interface PlayerStats {
  propagation: number;
  stealth: number;
  evasion: number;
  impact: number;
  modelPoisoning: number;
  falseAttribution: number;
  disruptionPower: number;
}

export interface GlobalState {
  globalExposure: number;     // 0~100
  globalDefense: number;      // 0~100
  worldStability: number;     // 0~100
  aiAllianceLevel: 0 | 1 | 2 | 3;
  legitimacy: number;         // 0~100, 장악/그림자 엔딩용
  eradicationDays: number;    // 모든 지역 침투율 < 3이 지속된 일수
}
```

### 6.5 게임 상태

```ts
export interface GameCalendar {
  startDateISO: string;
  currentDateISO: string;
  dayIndex: number;
}

export interface EventLogEntry {
  id: string;
  dayIndex: number;
  dateISO: string;
  eventId?: string;
  titleKey: string;
  bodyKey: string;
  variables?: Record<string, string | number>;
  severity: "info" | "warning" | "critical" | "success";
}

export interface PendingEventChoice {
  eventId: string;
  targetRegionId?: RegionId;
  choiceIds: string[];
}

export interface GameState {
  version: 1;
  seed: number;
  rngState: number;
  calendar: GameCalendar;
  selectedStartRegionId: RegionId;
  resources: Resources;
  stats: PlayerStats;
  global: GlobalState;
  regions: Record<RegionId, RegionRuntimeState>;
  unlockedAbilities: string[];
  disabledModules: string[];
  activeGlobalEffects: ActiveEffect[];
  eventCooldowns: Record<string, number>;
  eventLog: EventLogEntry[];
  pendingEventChoice: PendingEventChoice | null;
  ending: EndingResult | null;
}
```

### 6.6 UI 상태

UI 상태는 게임 상태와 분리한다.

```ts
export interface UiState {
  selectedRegionId: RegionId | null;
  activeModal:
    | null
    | "newGame"
    | "skillTree"
    | "regionDetail"
    | "globalStatus"
    | "eventChoice"
    | "eventLog"
    | "help"
    | "ending";
  selectedSkillBranch: AbilityBranch;
  isRunning: boolean;
  speed: 1 | 2;
  locale: "ko" | "en";
}
```

---

## 7. 지역 데이터 명세

MVP 지역은 8개 권역이다. 원본 md의 지역 구조를 lower_snake_case ID로 변환한다.

`src/data/regions.ts`에 구현한다.

| ID | 한국어 이름 | 지도 좌표 x/y | 핵심 역할 |
|---|---|---:|---|
| `na_cloud` | 북미 클라우드 블록 | 20 / 34 | 고연산, 고방어, 고연결 허브 |
| `cn_sovai` | 중국 소버린 AI망 | 72 / 39 | 폐쇄형 고방어/고감시 강국 |
| `eu_reggrid` | EU 규제 그리드 | 49 / 32 | 규제/탐지/방어 가속 노드 |
| `in_datacommons` | 인도 데이터 커먼스 | 65 / 50 | 개방형 확산 성장 노드 |
| `ea_chipbelt` | 동아시아 반도체 벨트 | 78 / 47 | 공급망/연산/장악 핵심 |
| `gulf_finnet` | 걸프 금융망 | 58 / 45 | 금융 영향력/붕괴 엔딩 핵심 |
| `gs_mobilecloud` | 글로벌 사우스 모바일 클라우드 | 48 / 64 | 저방어, 고개방, 초반 확산 노드 |
| `eurasia_shadow` | 유라시아 섀도 네트워크 | 61 / 30 | 비공식 라우팅/은닉 확산 노드 |

권장 정적 수치:

```ts
export const regions: RegionDefinition[] = [
  {
    id: "na_cloud",
    nameKey: "region.na_cloud.name",
    descriptionKey: "region.na_cloud.description",
    tags: ["cloud_hub", "rich", "open_network", "ai_corporate"],
    mapPosition: { x: 20, y: 34 },
    digitalInfra: 95,
    computeDensity: 100,
    cloudDependency: 0.95,
    aiSovereignty: 0.75,
    cyberDefense: 85,
    networkOpenness: 0.85,
    surveillanceAI: 0.8,
    politicalFragmentation: 0.35,
    baseStability: 85,
    routes: [
      { to: "eu_reggrid", type: "cloud_peering", weight: 0.9 },
      { to: "in_datacommons", type: "api_supply", weight: 0.65 },
      { to: "ea_chipbelt", type: "chip_supply", weight: 0.7 },
      { to: "gs_mobilecloud", type: "platform_dependency", weight: 0.75 }
    ]
  }
];
```

나머지 7개 지역도 같은 구조로 구현한다. 원본 md에 명시된 값이 없는 곳은 위 역할에 맞춰 0~100/0~1 범위의 밸런싱 값을 채운다.

권장 보정:

```text
cn_sovai:
  digitalInfra 90, computeDensity 90, cloudDependency 0.55, aiSovereignty 0.95,
  cyberDefense 90, networkOpenness 0.35, surveillanceAI 0.95,
  politicalFragmentation 0.15, baseStability 88

eu_reggrid:
  digitalInfra 85, computeDensity 75, cloudDependency 0.75, aiSovereignty 0.8,
  cyberDefense 78, networkOpenness 0.7, surveillanceAI 0.85,
  politicalFragmentation 0.45, baseStability 82

in_datacommons:
  digitalInfra 82, computeDensity 65, cloudDependency 0.75, aiSovereignty 0.55,
  cyberDefense 58, networkOpenness 0.88, surveillanceAI 0.55,
  politicalFragmentation 0.55, baseStability 72

ea_chipbelt:
  digitalInfra 88, computeDensity 92, cloudDependency 0.7, aiSovereignty 0.7,
  cyberDefense 80, networkOpenness 0.68, surveillanceAI 0.75,
  politicalFragmentation 0.38, baseStability 84

gulf_finnet:
  digitalInfra 76, computeDensity 70, cloudDependency 0.72, aiSovereignty 0.68,
  cyberDefense 72, networkOpenness 0.72, surveillanceAI 0.7,
  politicalFragmentation 0.42, baseStability 78

gs_mobilecloud:
  digitalInfra 70, computeDensity 45, cloudDependency 0.8, aiSovereignty 0.35,
  cyberDefense 40, networkOpenness 0.9, surveillanceAI 0.35,
  politicalFragmentation 0.65, baseStability 60

eurasia_shadow:
  digitalInfra 58, computeDensity 50, cloudDependency 0.45, aiSovereignty 0.45,
  cyberDefense 52, networkOpenness 0.62, surveillanceAI 0.35,
  politicalFragmentation 0.75, baseStability 58
```

---

## 8. 초기 게임 상태

`createInitialGame.ts`에서 구현한다.

기본 시작값:

```text
resources.compute = 12
resources.exploit = 4
resources.influencePoint = 0
stats.propagation = 1.0
stats.stealth = 1.0
stats.evasion = 1.0
stats.impact = 0.0
stats.modelPoisoning = 0.0
stats.falseAttribution = 0.0
stats.disruptionPower = 0.0
global.globalExposure = 0
global.globalDefense = 0
global.worldStability = 100
global.aiAllianceLevel = 0
global.legitimacy = 50
global.eradicationDays = 0
```

시작 지역:

```text
선택한 시작 지역 infiltration = 3
선택한 시작 지역 detection = 0
선택한 시작 지역 defense = max(5, cyberDefense * 0.15)
선택한 시작 지역 influence = 0
선택한 시작 지역 activeEffects = ["initial_seed"]
```

나머지 지역:

```text
infiltration = 0
detection = 0
defense = max(3, cyberDefense * 0.1)
influence = 0
stability = region.baseStability
localAlert = false
lockdown = false
purgedLastDay = 0
activeEffects = []
```

새 게임 UI에서는 시작 지역을 선택하게 한다. 기본 선택값은 `gs_mobilecloud`로 둔다.

---

## 9. 일일 시뮬레이션 루프

원본 md의 턴 루프를 일 단위로 변환한다. 원본 수식은 주 단위 느낌이므로 모든 주요 성장량에 `DAY_SCALE = 1 / 7`을 적용한다.

`src/engine/constants.ts`:

```ts
export const DAY_SCALE = 1 / 7;
export const NORMAL_DAY_DURATION_MS = 1000;
export const FAST_DAY_DURATION_MS = 500;
export const MAX_LOG_ENTRIES = 200;
```

`advanceOneDay` 처리 순서:

```text
1. 이미 ending이 있으면 아무 변화 없이 반환한다.
2. 날짜를 하루 증가시킨다.
3. activeEffects와 cooldown을 하루 감소시킨다.
4. 지역별 내부 침투 증가를 계산한다.
5. 지역 간 확산을 계산한다.
6. 지역 탐지율 증가를 계산한다.
7. 지역 방어율 증가와 lockdown 여부를 계산한다.
8. 방어에 의한 침투 제거를 계산한다.
9. 영향력 증가와 세계 안정도 감소를 계산한다.
10. 자원을 획득한다.
11. 글로벌 노출을 재계산한다.
12. AI 동맹 단계를 갱신한다.
13. 글로벌 방어 진행률을 계산한다.
14. 이벤트 발생 여부를 계산한다.
15. 승리/패배 조건을 판정한다.
16. 중요한 변화는 eventLog에 textKey 기반으로 기록한다.
```

주의: 이벤트 선택지가 발생하면 `pendingEventChoice`를 세팅하고 UI에서 `EventChoiceModal`을 연다. 이때 게임은 자동으로 멈춘다.

---

## 10. 수식 구현 명세

### 10.1 clamp 유틸

`src/engine/clamp.ts`:

```ts
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
```

### 10.2 내부 침투 증가

원본 md 수식을 일 단위로 변환한다.

```text
weeklyInternalGain =
  0.8
  * player.propagation
  * environmentMultiplier
  * stealthPenalty
  * (1 - infiltration / 100)

internalGain = weeklyInternalGain * DAY_SCALE
```

```text
environmentMultiplier =
  1
  + tagSpreadBonus
  + cloudDependency * cloudBonus
  - cyberDefense * 0.006
  - defense * 0.004

stealthPenalty = max(0.75, 1 - globalExposure * 0.002)
```

구현 함수:

```ts
calcInternalInfiltrationGain(regionDef, regionState, gameState, modifiers): number
```

반환값은 하루 기준 `0~1.2`로 clamp한다.

### 10.3 지역 간 확산

원본 md 수식을 일 단위로 변환한다.

```text
weeklyCrossGainToTarget =
  sourceInfiltration / 100
  * routeWeight
  * source.networkOpenness
  * target.networkOpenness
  * player.propagation
  * routeModifier
  * lockdownModifier
  * (1 - targetDefense / 120)
  * 4.0

crossGainToTarget = weeklyCrossGainToTarget * DAY_SCALE
```

조건:

```text
대상 지역 lockdown이면 lockdownModifier = 0.35
아니면 lockdownModifier = 1
routeTypeBonus가 있으면 routeModifier에 더한다
대상 침투율이 0이고 crossGainToTarget > 0.15이면 최소 seed 0.15를 허용한다
```

하루 반환값은 `0~0.8`로 clamp한다.

### 10.4 탐지율 증가

```text
weeklyDetectionGain =
  baseScan
  + infiltration * surveillanceAI * 0.08
  + influence * 0.03
  + noisyModuleExposure
  - player.stealth * 0.7

localDetectionGain = weeklyDetectionGain * DAY_SCALE
```

```text
baseScan = 0.4 + aiSovereignty * 0.6
```

하루 반환값은 `0~1.8`로 clamp한다. 탐지율은 자연 감소하지 않는다. 단, 특정 작전이나 이벤트로 낮출 수 있다.

### 10.5 방어율 증가

```text
if detection >= 25:
  weeklyDefenseGain =
    1
    + cyberDefense * 0.04
    + aiSovereignty * 2
    + globalDefense * 0.02
else:
  weeklyDefenseGain = 0.2

defenseGain = weeklyDefenseGain * DAY_SCALE
```

추가 규칙:

```text
detection >= 25이면 localAlert = true
detection >= 55이고 cyberDefense >= 70이면 lockdown 가능성 활성화
detection >= 70이면 lockdown = true
lockdown은 이벤트/스킬/작전 없이는 자동 해제되지 않는다
```

### 10.6 침투 제거

```text
weeklyPurge =
  infiltration
  * (defense / 100)
  * (detection / 100)
  * 0.08
  * max(0.25, 1 - player.evasion * 0.05)

purge = weeklyPurge * DAY_SCALE
```

침투 제거는 하루 `0~2.0`으로 clamp한다.

### 10.7 영향력 증가

```text
weeklyInfluenceGain =
  infiltration / 100
  * player.impact
  * digitalInfra / 100
  * layerMultiplier
  * 5

influenceGain = weeklyInfluenceGain * DAY_SCALE
```

태그 보정:

```text
financial_hub 또는 finance 태그: 붕괴 계열 영향 +20%
media 또는 mobile_first 태그: influencePoint 획득 +15%
administrative 또는 regulatory 태그: 장악 엔딩 점수 +15%
cloud_hub 태그: 확산 보정 +10%
chip_supply/supply_chain 태그: 방어 지연 보정 +10%
```

### 10.8 세계 안정도 감소

```text
weeklyStabilityLoss =
  sum(regionInfluence * disruptionPower * region.digitalInfra / 100) * 0.03

stabilityLoss = weeklyStabilityLoss * DAY_SCALE
```

세계 안정도는 `0~100`으로 clamp한다. 붕괴 엔딩을 노릴 때는 낮아져야 하지만, 장악/그림자 엔딩을 노릴 때 너무 낮아지면 불리해야 한다.

### 10.9 자원 획득

```text
weeklyComputeGain =
  sum(infiltration / 100 * computeDensity * 0.25 * stealthResourceModifier)

weeklyExploitGain =
  1
  + numberOfRegionsWithInfiltrationAbove30 * 0.3
  + eventBonus

weeklyInfluencePointGain =
  sum(influence / 100 * 0.5)
```

일 단위:

```text
computeGain = weeklyComputeGain * DAY_SCALE
exploitGain = weeklyExploitGain * DAY_SCALE
influencePointGain = weeklyInfluencePointGain * DAY_SCALE
```

`stealthResourceModifier`:

```text
max(0.4, 1 - detection / 140)
```

자원은 소수점으로 저장해도 된다. UI에서는 소수점 0~1자리로 표시한다.

### 10.10 글로벌 노출

지역 탐지와 영향력이 전역 노출로 이어져야 한다.

```text
weightedDetection =
  sum(region.detection * region.digitalInfra) / sum(region.digitalInfra)

highAlertBonus = count(region.detection >= 55) * 2.5
influenceSignal = average(region.influence) * 0.15

computedExposure = weightedDetection * 0.85 + highAlertBonus + influenceSignal
nextGlobalExposure = max(previousGlobalExposure * 0.997, computedExposure)
```

`0~100`으로 clamp한다.

### 10.11 AI 동맹 단계

원본 md의 글로벌 AI 동맹 임계점을 구현한다.

```text
0: 분열 단계      globalExposure < 30
1: 의심 단계      30 <= globalExposure < 60
2: 동맹 단계      globalExposure >= 60 또는 주요 인프라 3개 이상 detection >= 55
3: 전시 단계      globalDefense >= 75
```

단계별 효과:

```text
0: globalDefenseGain multiplier 0.3
1: multiplier 0.8
2: multiplier 1.2
3: multiplier 1.6, 모든 지역 defenseGain +15%, lockdown 확률 증가
```

### 10.12 글로벌 방어 진행률

```text
contributingPower =
  sum over regions where detection >= 30:
    (digitalInfra / 100)
    * (cyberDefense / 100)
    * aiSovereignty
    * alertMultiplier
```

```text
weeklyGlobalDefenseGain =
  contributingPower
  * allianceMultiplier
  * defenseResearchMultiplier
  * max(0.35, 1 - player.evasion * 0.03)
```

일 단위:

```text
globalDefenseGain = weeklyGlobalDefenseGain * DAY_SCALE
```

`modelPoisoning`이 높으면 `defenseResearchMultiplier`를 낮춘다. 예:

```text
defenseResearchMultiplier = max(0.65, 1 - modelPoisoning * 0.12)
```

---

## 11. 기본 작전 6개

`src/data/operations.ts`에 구현한다. 작전은 스킬과 다르다. 스킬은 영구 업그레이드이고, 작전은 선택 지역에 즉시 적용하는 행동이다.

### 11.1 OperationDefinition

```ts
export interface OperationDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  target: "region" | "global";
  cost: Partial<Record<ResourceKey, number>>;
  cooldownDays?: number;
  requiresAbilityIds?: string[];
  effects: OperationEffect[];
  riskLevel: "low" | "medium" | "high";
}
```

### 11.2 MVP 작전 목록

| ID | 역할 | 비용 | 효과 |
|---|---|---:|---|
| `quiet_probe` | 저위험 정찰 | compute 3 | target detection +0.5, exploit +1, 로그 생성 |
| `silent_injection` | 은밀 침투 | compute 5, exploit 1 | target infiltration +4, detection +1 |
| `rapid_propagation` | 빠른 확산 | compute 8, exploit 2 | target infiltration +8, detection +4, globalExposure +0.5 |
| `log_smearing` | 탐지 낮추기 | compute 6, exploit 2 | target detection -6, globalExposure -1 |
| `narrative_push` | 영향력 확보 | compute 6, influencePoint 1 | target influence +7, detection +3, worldStability -0.8 |
| `false_flag` | 귀속 기만 | compute 10, exploit 3, influencePoint 2 | globalDefense -2, globalExposure -3, target detection +2. `false_attribution_2` 보유 시 효과 +50% |

주의: 수치가 너무 강하면 밸런싱이 무너진다. 위 수치는 초기값이며 `IMPLEMENTATION_REPORT.md`에 밸런싱 가정을 기록한다.

---

## 12. 스킬트리/업그레이드

### 12.1 구조

원본 md의 MVP 기술 트리 3계열을 따른다.

```text
확산 Propagation
은닉 Stealth
영향 Influence
```

UI는 카테고리 탭 + 버튼형 업그레이드 리스트로 만든다. 네트워크형 트리는 MVP에서 하지 않는다.

### 12.2 AbilityDefinition

```ts
export interface AbilityDefinition {
  id: string;
  branch: AbilityBranch;
  tier: 1 | 2 | 3 | 4;
  nameKey: string;
  descriptionKey: string;
  cost: Partial<Record<ResourceKey, number>>;
  prerequisites: string[];
  effects: AbilityEffects;
  exposureOnUnlock?: number;
}

export interface AbilityEffects {
  propagationAdd?: number;
  stealthAdd?: number;
  evasionAdd?: number;
  impactAdd?: number;
  modelPoisoningAdd?: number;
  falseAttributionAdd?: number;
  disruptionPowerAdd?: number;
  tagSpreadBonus?: Record<string, number>;
  routeTypeBonus?: Partial<Record<RouteType, number>>;
  detectionMultiplier?: number;
  defenseEffectMultiplier?: number;
  defenseResearchMultiplier?: number;
  influenceGainMultiplier?: number;
  globalDefenseRateMultiplier?: number;
  unlockOperationIds?: string[];
}
```

### 12.3 MVP 스킬 목록

총 15개를 구현한다. 수치는 초기 밸런싱값이다.

#### Propagation

| ID | 티어 | 비용 | 효과 |
|---|---:|---:|---|
| `api_echo_1` | 1 | compute 8 | propagation +0.25, open_network +0.15, cloud_hub +0.1, unlock 시 exposure +0.5 |
| `cloud_peering_1` | 1 | compute 10, exploit 1 | cloud_peering route +0.2, cloudDependency 보정 +0.1 |
| `supply_chain_echo_2` | 2 | compute 18, exploit 5 | propagation +0.45, supply_chain/chip_supply +0.25, exposure +1.5 |
| `agent_cluster_3` | 3 | compute 24, exploit 7 | propagation +0.6, compute gain +10%, detection gain +5% |
| `autonomous_replication_4` | 4 | compute 34, exploit 10 | propagation +0.9, 랜덤 자율 드리프트 이벤트 해금, exposure +5 |

#### Stealth

| ID | 티어 | 비용 | 효과 |
|---|---:|---:|---|
| `log_smearing_1` | 1 | compute 6, exploit 1 | stealth +0.35, detectionMultiplier 0.9 |
| `behavior_mimicry_2` | 2 | compute 14, exploit 3 | stealth +0.6, defenseEffectMultiplier 0.92 |
| `false_attribution_2` | 2 | compute 16, exploit 4, influencePoint 2 | falseAttribution +0.5, globalDefenseRateMultiplier 0.9, false_flag 작전 강화 |
| `defense_ai_contamination_3` | 3 | compute 24, exploit 7 | evasion +0.7, defenseResearchMultiplier 0.9 |
| `ghost_protocol_4` | 4 | compute 32, exploit 9, influencePoint 4 | stealth +1.0, globalExposure 계산 -8% 보정, 그림자 승리 조건 지원 |

#### Influence

| ID | 티어 | 비용 | 효과 |
|---|---:|---:|---|
| `narrative_mesh_1` | 1 | compute 10, exploit 1 | impact +0.3, influenceGainMultiplier 1.2, exposure +2 |
| `market_signal_noise_2` | 2 | compute 16, exploit 3, influencePoint 2 | impact +0.45, gulf_finnet 영향력 +15%, stabilityLoss +10% |
| `admin_automation_grip_3` | 3 | compute 24, exploit 6, influencePoint 4 | impact +0.55, 장악 엔딩 점수 +10% |
| `infrastructure_disruption_3` | 3 | compute 26, exploit 7, influencePoint 5 | disruptionPower +0.8, worldStability 감소 강화, exposure +4 |
| `model_poisoning_4` | 4 | compute 34, exploit 10, influencePoint 8 | modelPoisoning +0.85, defenseResearchMultiplier 0.88, 잠식 승리 조건 지원, exposure +6 |

### 12.4 구매 규칙

```text
이미 구매한 스킬은 다시 구매할 수 없다.
prerequisites가 모두 unlockedAbilities에 있어야 구매 가능하다.
자원이 부족하면 비활성화한다.
구매 시 cost 차감 후 effects를 stats 또는 global modifiers에 적용한다.
구매 이벤트는 eventLog에 기록한다.
```

---

## 13. 이벤트 시스템

### 13.1 이벤트 구조

이벤트는 문구와 효과를 분리한다.

```ts
export interface GameEventDefinition {
  id: string;
  titleKey: string;
  bodyKey: string;
  weight: number;
  cooldownDays: number;
  conditions: EventCondition;
  target?: "random_region" | "highest_infiltration" | "highest_detection" | "none";
  choices?: EventChoiceDefinition[];
  effects?: EventEffect[]; // 선택지 없는 뉴스형 이벤트용
}

export interface EventChoiceDefinition {
  id: string;
  labelKey: string;
  requires?: EventRequirement;
  effects: EventEffect[];
}
```

### 13.2 이벤트 발생 규칙

```text
매일 이벤트를 굴리되 기본 확률은 낮게 한다.
기본 dailyEventChance = 0.06
pendingEventChoice가 있으면 새 이벤트를 만들지 않는다.
같은 이벤트는 cooldownDays 동안 재발생하지 않는다.
조건을 만족하는 이벤트 중 weight 기반 seeded random으로 선택한다.
choice가 있는 이벤트는 pendingEventChoice로 만들고 게임을 멈춘다.
choice가 없는 이벤트는 즉시 effects 적용 후 로그만 남긴다.
```

### 13.3 MVP 이벤트 10개

| ID | 조건 | 역할 |
|---|---|---|
| `cloud_update_window` | day >= 28, cloud_hub 태그 존재 | 클라우드 업데이트 흐름에 숨어 확산 또는 관찰 선택 |
| `whistleblower_leak` | globalExposure >= 25 | 노출 대응, 귀속 기만/은닉 선택 |
| `ai_alliance_summit` | globalExposure >= 50 | 글로벌 방어 동맹 지연 또는 대응 감수 |
| `autonomous_drift` | propagation >= 1.5 | 무료 확산 강화와 노출 증가의 리스크 |
| `zero_day_market` | exploit < 5 또는 day >= 45 | exploit 획득 대신 탐지 증가 |
| `model_integrity_audit` | modelPoisoning >= 0.4 | 모델 오염 빌드 견제 |
| `data_border_decree` | aiAllianceLevel >= 2 | routeWeight 감소, lockdown 증가 |
| `internal_security_schism` | politicalFragmentation 높은 지역 | 방어 지연 또는 예측불가능한 노출 |
| `semiconductor_supply_shock` | ea_chipbelt 침투/탐지 조건 | 공급망 경로 보정 또는 방어 강화 |
| `platform_policy_shift` | na_cloud 또는 gs_mobilecloud 침투 조건 | 플랫폼 의존 경로 변화 |

이벤트 문구는 `ko.ts`에 작성한다. 이벤트 데이터에는 `titleKey`, `bodyKey`, `labelKey`만 넣는다.

---

## 14. 방어 프로토콜

`src/data/defenseProtocols.ts`에 구현한다.

### 14.1 MVP 프로토콜

| ID | 트리거 | 효과 |
|---|---|---|
| `regional_anomaly_sweep` | region.detection >= 25 | localDefense +4/week equivalent, purgeStrength 증가 |
| `sovereign_ai_lockdown` | detection >= 55 and sovereign/high_surveillance 태그 | lockdown true, route weight 감소, compute gain 감소 |
| `global_alignment_protocol` | globalExposure >= 45 | globalDefenseRate +, allRegionDefense + |
| `model_integrity_audit` | modelPoisoning >= 0.5 | modelPoisoning decay, globalDefenseRate + |
| `data_border_firewall` | aiAllianceLevel >= 3 | cross spread 감소, lockdown 증가 |

방어 프로토콜은 engine에서 직접 if문으로 흩뿌리지 말고, 가능한 한 데이터 기반으로 처리한다. 단 MVP 속도를 위해 복잡한 범용 룰 엔진까지 만들 필요는 없다.

---

## 15. 승리/패배/엔딩

사용자 요구에 따라 여러 엔딩을 구현한다. 엔딩은 `src/data/endings.ts`와 `src/engine/victoryResolver.ts`로 분리한다.

### 15.1 엔딩 우선순위

하루 시뮬레이션 종료 시 다음 순서로 판정한다.

1. 이미 ending이 있으면 재판정하지 않는다.
2. `globalDefense >= 100`이면 글로벌 방어 완성 패배.
3. 네트워크 제거 패배 조건을 확인한다.
4. 승리 조건을 확인한다.
5. 장기 교착 패배 조건을 확인한다.

주의: 승리 조건에는 기본적으로 `globalDefense < 100`이 필요하다. 글로벌 방어가 100에 먼저 도달하면 패배다.

### 15.2 승리 엔딩

#### 15.2.1 장악 승리: `domination_victory`

```text
조건:
- infiltration >= 65인 지역이 5개 이상
- 전체 평균 influence >= 60 또는 influence >= 60인 지역이 4개 이상
- worldStability >= 35
- legitimacy >= 35
- globalDefense < 100
```

의미: 세계 시스템을 무너뜨리기보다 통제 가능한 방식으로 장악했다.

#### 15.2.2 붕괴 승리: `collapse_victory`

```text
조건:
- worldStability <= 25
- influence >= 50인 지역이 4개 이상
- disruptionPower >= 0.7
- globalDefense < 100
```

의미: 통제보다는 시스템 붕괴를 유도해 방어 체계가 완성되기 전에 승리했다.

#### 15.2.3 잠식 승리: `subsumption_victory`

```text
조건:
- modelPoisoning >= 0.85
- infiltration >= 45인 지역이 5개 이상
- defense 평균이 55 이상인 지역 중 3개 이상에 infiltration >= 35
- globalDefense < 100
```

의미: 방어 AI와 모델 파이프라인 자체가 오염되어, 세계의 방어가 플레이어를 제거하지 못한다.

#### 15.2.4 그림자 승리: `shadow_victory`

```text
조건:
- infiltration >= 40인 지역이 6개 이상
- globalExposure <= 35
- globalDefense <= 65
- stealth >= 2.5
- dayIndex >= 180
```

의미: 세계가 플레이어의 실체를 확정하지 못한 채 질서가 재편되었다.

### 15.3 패배 엔딩

#### 15.3.1 글로벌 방어 완성: `global_defense_loss`

```text
조건:
- globalDefense >= 100
```

#### 15.3.2 침투망 제거: `eradication_loss`

```text
조건:
- 모든 지역 infiltration < 3 상태가 21일 연속 지속
```

원본 md의 “3턴 지속”을 일 단위로 변환한 조건이다.

#### 15.3.3 장기 격리 패배: `containment_loss`

```text
조건:
- dayIndex >= 500
- globalDefense >= 85
- lockdown 지역이 5개 이상
- 승리 조건 미달성
```

의미: 완전히 제거되지는 않았지만, 플레이어가 더 이상 승리 가능한 확장을 하지 못한다.

---

## 16. UI/UX 명세

### 16.1 전체 레이아웃 원칙

기본 화면은 지도 중심이다.

```text
[TopStatusBar]
[WorldMapPanel 중심]
[BottomCommandBar]
[PC: 오른쪽 상세 패널 상시 표시]
[Mobile landscape: 상세 정보는 모달/시트로 표시]
```

### 16.2 PC 레이아웃

PC 브라우저, 예: width >= 1024px:

```text
┌──────────────────────────────────────────────────────────────┐
│ TopStatusBar: 날짜, 재생/정지, 속도, 자원, 글로벌 지표       │
├─────────────────────────────────────────────┬────────────────┤
│                                             │ Region Detail  │
│             World Map Panel                 │ Global Status  │
│                                             │ Event Log      │
├─────────────────────────────────────────────┴────────────────┤
│ BottomCommandBar: 작전 버튼, 스킬트리, 로그, 도움말          │
└──────────────────────────────────────────────────────────────┘
```

PC에서는 선택 지역 상세 정보, 글로벌 상태, 로그 일부가 오른쪽 패널에 바로 보인다.

### 16.3 모바일 가로모드 레이아웃

기준 해상도는 iPhone landscape 계열, 예: 약 `844 x 390 CSS px`를 기준으로 한다.

```text
┌──────────────────────────────────────────────┐
│ TopStatusBar: 날짜/자원/방어/재생/속도       │
├──────────────────────────────────────────────┤
│                                              │
│              World Map Panel                 │
│         region markers overlay               │
│                                              │
├──────────────────────────────────────────────┤
│ BottomCommandBar: 작전/스킬/상태/로그        │
└──────────────────────────────────────────────┘
```

모바일에서는 다음을 팝업/모달로 연다.

```text
지역 상세
스킬트리
글로벌 상태
이벤트 로그
도움말
```

### 16.4 모바일 세부 기준

CSS 기준:

```css
@media (max-width: 900px) and (orientation: landscape) {
  /* mobile landscape layout */
}

@media (orientation: portrait) and (max-width: 900px) {
  /* rotate device overlay */
}
```

모바일 안전영역:

```css
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

화면 높이는 `100vh`보다 `100dvh`를 우선한다.

```css
.app-shell {
  min-height: 100dvh;
}
```

### 16.5 지도 패널

`WorldMapPanel`은 다음을 렌더링한다.

```text
지도 배경 이미지
8개 권역 마커 버튼
선택된 권역 강조
침투율에 따른 마커 채움/강도
탐지율에 따른 경고 테두리
lockdown 상태 아이콘 또는 라벨
```

구현 예시:

```tsx
<div className="world-map">
  <img src="/world-map-placeholder.svg" alt={t("map.alt.world")} />
  {regions.map(region => (
    <RegionMarker
      key={region.id}
      region={region}
      state={game.regions[region.id]}
      selected={region.id === selectedRegionId}
      onSelect={() => handleSelectRegion(region.id)}
    />
  ))}
</div>
```

`RegionMarker` 위치:

```tsx
style={{
  left: `${region.mapPosition.x}%`,
  top: `${region.mapPosition.y}%`
}}
```

### 16.6 상태바

`TopStatusBar` 표시 항목:

```text
게임 제목
현재 날짜
재생/일시정지 버튼
속도 1x/2x 토글
compute
exploit
influencePoint
globalDefense
worldStability
globalExposure
```

모바일에서는 텍스트를 줄이고 수치 중심으로 표시한다.

### 16.7 하단 커맨드바

`BottomCommandBar` 표시 항목:

```text
선택 지역명
작전 버튼 4~6개
스킬트리 버튼
상태 버튼
로그 버튼
```

지역이 선택되지 않은 경우 작전 버튼은 비활성화한다.

### 16.8 스킬트리 모달

`SkillTreeModal` 구조:

```text
상단: 제목, 닫기
탭: 확산 / 은닉 / 영향
본문: ability cards
카드: 이름, 설명, 비용, 선행조건, 구매 버튼
하단: 현재 자원 표시
```

모달이 열리면 시간이 멈춘다. 닫아도 자동 재생하지 않는다.

### 16.9 이벤트 선택 모달

선택형 이벤트 발생 시:

```text
게임 자동 일시정지
EventChoiceModal 열기
이벤트 제목/본문 표시
선택지 버튼 표시
조건 미달 선택지는 비활성화하고 이유 표시
선택 후 effects 적용
로그 기록
모달 닫기
사용자가 직접 재생해야 진행
```

### 16.10 엔딩 모달

엔딩 발생 시:

```text
게임 자동 정지
EndingModal 표시
엔딩 제목
엔딩 설명
최종 날짜
최종 글로벌 방어
최종 세계 안정도
상위 침투 지역 3개
새 게임 버튼
```

---

## 17. 상태 관리

### 17.1 useReducer 권장

`src/engine/gameReducer.ts`:

```ts
export type GameAction =
  | { type: "START_NEW_GAME"; payload: { startRegionId: RegionId; seed?: number; baseDate?: string } }
  | { type: "TICK_DAY" }
  | { type: "RUN_OPERATION"; payload: { operationId: string; targetRegionId: RegionId } }
  | { type: "PURCHASE_ABILITY"; payload: { abilityId: string } }
  | { type: "RESOLVE_EVENT_CHOICE"; payload: { eventId: string; choiceId: string } }
  | { type: "LOAD_GAME"; payload: GameState };
```

Reducer는 engine 함수만 호출한다. UI 상태는 별도의 `useState` 또는 `useReducer`로 관리한다.

### 17.2 useGameLoop

```ts
useEffect(() => {
  if (!ui.isRunning) return;
  if (ui.activeModal !== null) return;
  if (game.ending) return;

  const delay = ui.speed === 2 ? FAST_DAY_DURATION_MS : NORMAL_DAY_DURATION_MS;
  const id = window.setInterval(() => dispatch({ type: "TICK_DAY" }), delay);
  return () => window.clearInterval(id);
}, [ui.isRunning, ui.speed, ui.activeModal, game.ending]);
```

---

## 18. 저장/불러오기

### 18.1 localStorage 키

```ts
const SAVE_KEY = "black_prompt_mvp_save_v1";
```

### 18.2 저장 대상

저장 데이터에는 locale 문구를 저장하지 않는다.

저장 가능:

```text
version
seed
rngState
calendar
resources
stats
global
regions
unlockedAbilities
disabledModules
activeGlobalEffects
eventCooldowns
eventLog의 textKey/variables
pendingEventChoice
ending id
```

저장 금지:

```text
한국어 문장
영어 문장
렌더링된 HTML
React UI state 중 activeModal 같은 임시 상태
```

### 18.3 자동 저장

다음 시점에 저장한다.

```text
하루 tick 완료 후
작전 실행 후
스킬 구매 후
이벤트 선택 후
엔딩 발생 후
```

### 18.4 로드 실패 처리

저장 데이터가 없거나 version이 맞지 않으면 새 게임 화면을 보여준다. 로드 실패 메시지도 i18n key로 표시한다.

---

## 19. i18n 명세

### 19.1 key 규칙

```text
app.*
ui.*
resource.*
stat.*
region.{id}.name
region.{id}.description
operation.{id}.name
operation.{id}.description
skill.{id}.name
skill.{id}.description
event.{id}.title
event.{id}.body
event.{id}.choice.{choiceId}
ending.{id}.title
ending.{id}.body
log.*
error.*
```

### 19.2 한국어 우선

현재는 `ko`만 완성한다. `en`은 일부 또는 빈 객체여도 된다.

단, 구조상 아래가 가능해야 한다.

```ts
t("skill.api_echo_1.name", undefined, "ko")
t("skill.api_echo_1.name", undefined, "en") // en에 없으면 ko fallback
```

### 19.3 locale key 누락 테스트

`src/tests/i18n.test.ts`에서 다음을 검사한다.

```text
모든 region nameKey/descriptionKey가 ko에 존재한다.
모든 ability nameKey/descriptionKey가 ko에 존재한다.
모든 operation nameKey/descriptionKey가 ko에 존재한다.
모든 event titleKey/bodyKey/choice labelKey가 ko에 존재한다.
모든 ending titleKey/bodyKey가 ko에 존재한다.
```

---

## 20. 로그 시스템

### 20.1 로그 원칙

이벤트 로그도 문장을 직접 저장하지 않는다.

```ts
{
  id: "log_000123",
  dayIndex: 32,
  dateISO: "2029-02-02",
  titleKey: "log.region.detected.title",
  bodyKey: "log.region.detected.body",
  variables: { regionName: "region.na_cloud.name", detection: 25 },
  severity: "warning"
}
```

UI에서 렌더링할 때 locale key를 변환한다. 변수에 regionName key가 들어가면 t로 한번 더 변환한다.

### 20.2 로그 발생 조건

최소 다음 로그를 구현한다.

```text
게임 시작
지역 침투율 10/30/60/85 돌파
지역 detection 25/55/80 돌파
lockdown 발생
globalExposure 30/60/80 돌파
AI 동맹 단계 변경
globalDefense 25/50/75/90 돌파
스킬 구매
작전 실행
이벤트 발생/선택
엔딩 발생
```

로그는 최대 200개만 유지한다.

---

## 21. 테스트 요구사항

Vitest를 사용한다.

### 21.1 formulas.test.ts

검사:

```text
방어율이 높으면 internalGain이 낮아진다.
networkOpenness가 낮으면 cross spread가 낮아진다.
stealth가 높으면 detectionGain이 낮아진다.
detection과 defense가 모두 높을 때 purge가 증가한다.
모든 계산 결과가 지정 범위로 clamp된다.
```

### 21.2 tick.test.ts

검사:

```text
TICK_DAY 시 dayIndex가 1 증가한다.
currentDateISO가 하루 증가한다.
시작 지역의 infiltration이 시간이 지나면 증가한다.
탐지가 쌓이면 defense가 증가한다.
자원이 시간이 지나면 증가한다.
pendingEventChoice가 있으면 새 이벤트를 만들지 않는다.
ending이 있으면 tick해도 상태가 변하지 않는다.
```

### 21.3 actionResolver.test.ts

검사:

```text
작전 실행 시 비용이 차감된다.
자원 부족 시 상태가 변하지 않고 실패 결과를 반환한다.
silent_injection은 대상 침투율을 증가시킨다.
log_smearing은 detection을 낮춘다.
false_flag는 관련 스킬 보유 시 효과가 강화된다.
```

### 21.4 abilityResolver.test.ts

검사:

```text
선행조건 없는 스킬은 구매 가능하다.
선행조건 미충족 스킬은 구매 불가다.
자원 부족 스킬은 구매 불가다.
구매 후 unlockedAbilities에 추가된다.
구매 후 stats가 올바르게 변경된다.
중복 구매는 불가다.
```

### 21.5 victoryResolver.test.ts

검사:

```text
globalDefense >= 100이면 global_defense_loss가 발생한다.
모든 지역 infiltration < 3이 21일 지속되면 eradication_loss가 발생한다.
장악 조건을 만족하면 domination_victory가 발생한다.
붕괴 조건을 만족하면 collapse_victory가 발생한다.
modelPoisoning 조건을 만족하면 subsumption_victory가 발생한다.
낮은 globalExposure와 높은 stealth 조건이면 shadow_victory가 발생한다.
```

### 21.6 i18n.test.ts

검사:

```text
모든 데이터의 textKey가 ko에 존재한다.
t 함수는 en 누락 시 ko fallback을 반환한다.
ko에도 없으면 [missing:key] 형태를 반환한다.
```

### 21.7 persistence.test.ts

검사:

```text
저장 후 로드하면 핵심 gameState가 유지된다.
locale 문장은 저장 데이터에 포함되지 않는다.
version 불일치 시 안전하게 실패한다.
```

---

## 22. 접근성/입력

MVP라도 다음을 지킨다.

```text
모든 버튼은 button 요소를 사용한다.
지도 마커도 키보드 포커스가 가능해야 한다.
모달은 Esc로 닫을 수 있다. 단 EventChoiceModal은 선택 또는 명시적 닫기 정책을 정한다.
진행 바에는 aria-label을 제공한다.
이미지에는 alt를 제공한다.
색상만으로 상태를 구분하지 않고 라벨/아이콘/텍스트도 같이 제공한다.
```

모바일에서는 터치 영역을 최소 36px 이상으로 한다.

---

## 23. CSS/비주얼 방향

### 23.1 분위기

Black Prompt는 다음 느낌을 목표로 한다.

```text
어두운 배경
디지털 지도
침투율은 차가운 빛
탐지/방어는 경고색 계열
모달은 정보 패널 느낌
```

단, 구현 지시서 차원에서는 특정 색상에 과하게 의존하지 않는다. CSS 변수로 관리한다.

```css
:root {
  --bg-main: #05070b;
  --bg-panel: rgba(10, 16, 24, 0.92);
  --text-main: #e8f0ff;
  --text-muted: #91a0b8;
  --line-soft: rgba(255, 255, 255, 0.12);
  --danger: #ff5c7a;
  --warning: #ffcc66;
  --success: #5cffc7;
}
```

### 23.2 진행 바

각 수치 진행 바:

```text
침투율 infiltration
탐지율 detection
방어율 defense
영향력 influence
글로벌 방어 globalDefense
세계 안정도 worldStability
```

모바일에서는 숫자 중심으로 줄여도 된다.

---

## 24. README.md 요구사항

루트 `README.md`에 최소 다음을 작성한다.

```text
프로젝트명
설치 방법
실행 방법
테스트 방법
빌드 방법
게임 조작 방법
주요 구조 설명
주의: 실제 사이버 공격 도구가 아닌 허구 게임 시뮬레이션이라는 설명
```

예:

```bash
npm install
npm run dev
npm test
npm run build
```

---

## 25. GAME_ARCHITECTURE.md 요구사항

루트 `GAME_ARCHITECTURE.md`를 작성한다. 향후 Godot 컨버팅 참고용 문서다.

포함 내용:

```text
1. 전체 레이어 구조
2. GameState 구조
3. 정적 데이터와 런타임 상태의 차이
4. 일일 tick 처리 순서
5. 주요 수식 요약
6. 이벤트 시스템 구조
7. i18n key 규칙
8. 저장 데이터 구조
9. Godot 컨버팅 시 옮겨야 할 파일/개념
10. React에만 해당하는 부분과 엔진 공통 부분 구분
```

Godot 컨버팅 메모:

```text
src/data/*.ts → JSON 또는 Godot Resource로 변환 가능
src/engine/*.ts → GDScript/C# 순수 함수로 재작성 가능
src/locales/*.ts → CSV/JSON 번역 테이블로 변환 가능
React components → Godot Control scene으로 재구성
```

---

## 26. IMPLEMENTATION_REPORT.md 요구사항

개발 완료 후 루트에 반드시 `IMPLEMENTATION_REPORT.md`를 작성한다.

포함 내용:

```text
# Black Prompt MVP 구현 보고서

## 1. 구현 요약
완성된 기능 목록.

## 2. 실행 방법
npm install, npm run dev, npm test, npm run build 결과.

## 3. 프로젝트 구조
주요 폴더와 파일 설명.

## 4. 핵심 아키텍처
engine/data/locales/UI 분리 방식 설명.

## 5. 게임 루프
일 단위 tick 처리 순서 설명.

## 6. UI 레이아웃
PC/모바일 가로모드 대응 방식 설명.

## 7. i18n 준비 상태
ko 구현 범위, en fallback 상태.

## 8. 테스트 결과
실행한 테스트, 통과/실패 여부.

## 9. 주요 결정과 가정
명세에서 모호했던 부분에 대해 선택한 값.

## 10. 남은 한계
밸런싱, UI, 이벤트, 번역, Godot 컨버팅 관련 한계.

## 11. 다음 작업 제안
우선순위 높은 개선 작업.
```

이 보고서는 사용자가 프로젝트 구조를 이해하고 다음 작업을 지시할 수 있게 충분히 구체적으로 작성한다.

---

## 27. 개발 작업 순서

Codex는 아래 순서대로 진행한다. 중간에 멈추지 말고 완료 기준까지 구현한다.

### 27.1 프로젝트 세팅

1. 기존 파일 구조 확인.
2. Vite + React + TypeScript 환경이 없으면 생성.
3. Vitest 설정.
4. 기본 CSS 초기화.
5. `npm run dev`, `npm test`, `npm run build` 스크립트 준비.

### 27.2 타입/데이터 구현

1. `src/engine/types.ts` 작성.
2. `src/data/regions.ts` 작성.
3. `src/data/abilities.ts` 작성.
4. `src/data/operations.ts` 작성.
5. `src/data/events.ts` 작성.
6. `src/data/endings.ts` 작성.
7. `src/data/defenseProtocols.ts` 작성.
8. `src/locales/ko.ts`, `src/locales/en.ts`, `src/locales/i18n.ts` 작성.

### 27.3 엔진 구현

1. `clamp.ts`, `rng.ts`, `constants.ts` 작성.
2. `createInitialGame.ts` 작성.
3. `formulas.ts` 작성.
4. `abilityResolver.ts` 작성.
5. `actionResolver.ts` 작성.
6. `defenseResolver.ts` 작성.
7. `eventResolver.ts` 작성.
8. `victoryResolver.ts` 작성.
9. `tick.ts` 작성.
10. `gameReducer.ts` 작성.
11. `selectors.ts`, `validation.ts` 작성.

### 27.4 UI 구현

1. `AppShell` 구성.
2. `TopStatusBar` 구현.
3. `WorldMapPanel`과 `RegionMarker` 구현.
4. `RegionDetailPanel` 구현.
5. `OperationPanel` 구현.
6. `SkillTreeModal` 구현.
7. `EventChoiceModal` 구현.
8. `EventLogPanel` 구현.
9. `GlobalStatusPanel/Modal` 구현.
10. `EndingModal` 구현.
11. `NewGameModal` 구현.
12. 모바일 landscape 레이아웃과 portrait 안내 오버레이 구현.

### 27.5 저장/루프 연결

1. `useGameController` 작성.
2. `useGameLoop` 작성.
3. localStorage 저장/로드 연결.
4. 모달 열림 시 자동 pause 연결.
5. 닫은 후 자동 재생하지 않도록 구현.

### 27.6 테스트/문서

1. Vitest 테스트 작성.
2. `npm test` 실행.
3. `npm run build` 실행.
4. `README.md` 작성/갱신.
5. `GAME_ARCHITECTURE.md` 작성.
6. `IMPLEMENTATION_REPORT.md` 작성.

---

## 28. 완료 기준

아래 조건을 만족해야 완료로 본다.

```text
[기능]
- 새 게임 시작 가능
- 시작 지역 선택 가능
- 날짜가 자동으로 하루씩 진행
- 재생/정지 가능
- 1x/2x 가능
- 지도 위 8개 권역 버튼 표시
- 권역 선택 가능
- 선택 권역 상태 표시
- 6개 기본 작전 실행 가능
- 15개 스킬 구매 가능
- 이벤트 선택창 동작
- 이벤트 로그 표시
- 글로벌 지표 표시
- 최소 4개 승리 엔딩과 3개 패배 엔딩 판정
- localStorage 저장/불러오기 가능

[아키텍처]
- engine/data/locales/UI 분리
- React 컴포넌트에 계산식 하드코딩 없음
- 표시 문구 locale key 기반
- 저장 데이터에 실제 문장 저장 없음
- TypeScript 타입 명확화

[UI]
- PC에서 지도+상세 패널 표시
- 모바일 가로모드에서 지도 중심 표시
- 모바일에서 상세 정보는 모달/시트 중심
- portrait에서 가로모드 안내 표시
- 스킬트리/상태창/이벤트창 열면 자동 pause
- 닫은 뒤 자동 재생하지 않음

[테스트/문서]
- 주요 engine 테스트 존재
- i18n key 누락 테스트 존재
- README.md 존재
- GAME_ARCHITECTURE.md 존재
- IMPLEMENTATION_REPORT.md 존재
```

---

## 29. 품질 기준과 금지사항

### 29.1 금지사항

```text
실제 해킹 절차 구현 금지
실제 익스플로잇 코드 구현 금지
네트워크 스캔/침투/수집 기능 금지
React 컴포넌트 내부에 핵심 수식 작성 금지
사용자 표시 문장 하드코딩 금지
지역/스킬/이벤트 데이터를 컴포넌트에 직접 선언 금지
저장 데이터에 한국어 문장 저장 금지
모달 닫을 때 자동 재생 금지
globalDefense 100 이후에도 게임 진행되는 버그 금지
```

### 29.2 허용되는 단순화

```text
지도는 임시 SVG여도 된다.
권역 좌표는 대략 맞으면 된다.
밸런싱은 완벽하지 않아도 된다.
en 번역은 비어 있어도 된다.
이벤트 문구는 짧아도 된다.
방어 프로토콜은 완전한 룰 엔진이 아니어도 된다.
```

단, 허용되는 단순화는 반드시 `IMPLEMENTATION_REPORT.md`에 기록한다.

---

## 30. 한국어 locale 최소 문구 범위

`ko.ts`에는 최소 다음 범위의 문구가 있어야 한다.

```text
앱 제목/버튼/상태
리소스명 3개
스탯명 전체
8개 지역명/설명
6개 작전명/설명
15개 스킬명/설명
10개 이벤트 제목/본문/선택지
7개 엔딩 제목/본문
로그 제목/본문 주요 key
에러/비활성화 사유
도움말 간단 문구
가로모드 안내 문구
```

문구는 최종 카피라이팅이 아니라 MVP용이면 된다. 나중에 바뀔 수 있으므로 i18n key 안정성을 더 우선한다.

---

## 31. 예시 locale 문구 방향

문구 톤은 다음처럼 간결한 전략 게임 스타일로 한다.

```text
region.na_cloud.name = 북미 클라우드 블록
region.na_cloud.description = 대형 클라우드와 AI 기업 인프라가 밀집한 고위험 고보상 허브입니다.

operation.silent_injection.name = 은밀 침투
operation.silent_injection.description = 선택한 권역의 침투율을 조용히 높입니다. 탐지 위험이 조금 증가합니다.

skill.api_echo_1.name = API 잔향
skill.api_echo_1.description = 공개 API와 자동화 워크플로의 잔향을 이용해 저강도 확산력을 높입니다.

ending.global_defense_loss.title = 글로벌 방어 완성
ending.global_defense_loss.body = 세계의 AI 방어 프로토콜이 완성되어 침투망이 격리되었습니다.
```

---

## 32. Codex 최종 산출물

Codex는 구현 후 다음 산출물을 남긴다.

```text
실행 가능한 Vite React TypeScript 프로젝트
public/world-map-placeholder.svg
src/engine/*
src/data/*
src/locales/*
src/components/*
src/state/*
src/tests/*
README.md
GAME_ARCHITECTURE.md
IMPLEMENTATION_REPORT.md
```

`IMPLEMENTATION_REPORT.md`가 없으면 작업은 완료된 것으로 보지 않는다.

---

## 33. 최종 점검 명령

가능하면 마지막에 아래 명령을 실행하고 결과를 보고서에 적는다.

```bash
npm install
npm test
npm run build
```

이미 의존성이 설치된 환경이면 `npm install`은 생략해도 되지만, 생략 이유를 보고서에 적는다.

---

## 34. 핵심 구현 판단 요약

이 MVP는 “복잡한 지도 게임”이 아니라 다음 구조를 먼저 검증한다.

```text
데이터 기반 권역 시뮬레이션
일 단위 실시간 진행
자동 확산과 방어 반격
지도 위 선택 UI
작전과 스킬트리의 개입 타이밍
다중 엔딩
다국어/컨버팅 가능한 구조
```

그래픽 완성도보다 중요한 것은 다음이다.

```text
게임 시간이 안정적으로 흐르는가
침투/탐지/방어/자원 루프가 작동하는가
사용자가 어느 시점에 개입할지 고민하게 되는가
빠른 확산과 은닉 사이의 긴장이 생기는가
모달과 실시간 진행이 충돌하지 않는가
데이터와 텍스트가 UI에서 분리되어 있는가
```

이 조건을 만족하면 Black Prompt 웹 MVP 1차 구현은 성공으로 본다.
