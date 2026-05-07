# Black Prompt MVP Game Architecture

## 1. 레이어 구조

MVP는 `data -> engine -> state -> UI` 순서로 의존합니다. `src/data`, `src/engine`, `src/locales`는 React에 의존하지 않습니다. React 컴포넌트는 상태 표시, 사용자 입력, 모달 제어, dispatch 호출만 담당합니다.

## 2. GameState

`src/engine/types.ts`의 `GameState`가 저장 가능한 전체 게임 상태입니다. 주요 필드는 `calendar`, `resources`, `stats`, `global`, `regions`, `unlockedAbilities`, `eventLog`, `pendingEventChoice`, `ending`입니다. UI 상태인 선택 권역, 활성 모달, 재생 여부, 속도, locale은 `UiState`로 분리했습니다.

## 3. 정적 데이터와 런타임 상태

정적 권역 데이터는 `src/data/regions.ts`의 `RegionDefinition`입니다. 좌표, 연결 경로, 방어 성향, 감시 성향, 인프라 밀도처럼 변하지 않는 값을 둡니다.

런타임 권역 상태는 `RegionRuntimeState`입니다. 침투율, 탐지율, 방어율, 영향력, 안정도, 경보, 락다운, 활성 효과를 저장합니다.

## 4. 일일 Tick 순서

`src/engine/tick.ts`의 `advanceOneDay`가 하루 진행을 처리합니다.

1. 엔딩이 있으면 진행하지 않음
2. 날짜 1일 증가
3. 효과와 이벤트 쿨다운 감소
4. 권역 내부 침투 증가
5. 권역 간 경로 확산
6. 탐지 증가
7. 방어 증가와 지역 경보/락다운 처리
8. 방어에 의한 침투 제거
9. 영향력 증가
10. 자원 획득
11. 세계 안정도, 글로벌 노출, AI 동맹, 글로벌 방어 계산
12. 방어 프로토콜 적용
13. 임계치 로그 기록
14. 이벤트 발생 판정
15. 엔딩 판정

## 5. 주요 수식

수식은 `src/engine/formulas.ts`에 모았습니다. 내부 침투는 확산력, 지역 태그, 클라우드 의존도, 사이버 방어, 지역 방어, 글로벌 노출로 결정됩니다. 권역 간 확산은 source 침투율, route weight, 양쪽 network openness, target defense, lockdown modifier를 사용합니다.

탐지는 침투율, 감시 AI, 영향력, noisy module 계열 스탯, 은닉력으로 계산합니다. 글로벌 방어는 탐지 30 이상 권역의 인프라/방어/AI 주권 기여도와 AI 동맹 단계에 따라 증가합니다.

## 6. 이벤트 시스템

이벤트 정의는 `src/data/events.ts`에 있고, 실제 판정은 `src/engine/eventResolver.ts`에 있습니다. 매일 낮은 확률로 조건을 만족하는 이벤트를 weight 기반 seeded random으로 선택합니다. 선택형 이벤트는 `pendingEventChoice`를 설정하고 UI에서 자동 일시정지합니다.

## 7. i18n 규칙

사용자 표시 문구는 locale key로만 데이터에 저장합니다. 한국어 구현은 `src/locales/ko.ts`, 영어 fallback은 `src/locales/en.ts`, 변환 함수는 `src/locales/i18n.ts`입니다. 저장 데이터에는 한국어 문장을 저장하지 않습니다.

## 8. 저장 구조

`src/state/persistence.ts`가 `black_prompt_mvp_save_v1` localStorage 키를 사용합니다. 저장 대상은 `GameState`입니다. React UI state는 저장하지 않습니다. version 불일치나 파싱 실패는 안전하게 실패합니다.

## 9. Godot 컨버팅 메모

- `src/data/*.ts`: JSON 또는 Godot Resource로 변환 가능
- `src/engine/*.ts`: GDScript/C# 순수 함수로 재작성 가능
- `src/locales/*.ts`: CSV/JSON 번역 테이블로 변환 가능
- React 컴포넌트: Godot Control scene과 signal 기반 UI로 재구성

## 10. React 전용 부분

`src/components`, `src/app`, `src/state/useGameLoop.ts`, `src/state/useGameController.ts`는 React 전용입니다. `src/data`, `src/engine`, `src/locales`는 다른 클라이언트로 옮길 수 있는 공통 설계 레이어입니다.
