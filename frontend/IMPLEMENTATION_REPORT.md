# Black Prompt MVP 구현 보고서

## 1. 구현 요약

- Vite + React + TypeScript 프로젝트를 `frontend`에 구성했습니다.
- 8개 권역 지도, 권역 마커, 선택 권역 상세, 글로벌 상태, 이벤트 로그를 구현했습니다.
- 새 게임, 시작 권역 선택, 자동 일 단위 진행, 일시정지/재생, 1x/2x 전환을 구현했습니다.
- 6개 기본 작전, 15개 스킬트리, 10개 이벤트, 5개 방어 프로토콜, 4개 승리/3개 패배 엔딩을 구현했습니다.
- 스킬트리/지역 상세 모바일 시트/글로벌 상태/이벤트 선택/도움말/엔딩/새 게임 모달이 열리면 게임이 자동 일시정지됩니다. 닫아도 자동 재생하지 않습니다.
- localStorage 저장/불러오기와 자동 저장을 구현했습니다.
- `window.render_game_to_text`와 `window.advanceTime(ms)`를 제공해 브라우저 자동 검증이 가능합니다.

## 2. 실행 방법

```bash
npm install
npm run dev -- --host 127.0.0.1
npm test
npm run build
```

실행 확인 결과:

- `npm install`: 완료, 취약점 0개
- `npm run lint`: 통과
- `npm test`: 7개 테스트 파일, 33개 테스트 통과
- `npm run build`: TypeScript build와 Vite production build 통과
- 개발 서버: `http://127.0.0.1:5173/`

## 3. 프로젝트 구조

- `public/world-map-placeholder.svg`: 추상 세계지도 SVG
- `src/data`: 권역/작전/스킬/이벤트/엔딩/방어 프로토콜 정적 데이터
- `src/engine`: 게임 수식과 상태 전이 순수 함수
- `src/locales`: locale catalog와 fallback
- `src/components`: 공통 UI, 레이아웃, 지도, 패널, 모달
- `src/state`: reducer 연결, loop, persistence
- `src/tests`: Vitest 테스트

## 4. 핵심 아키텍처

React 컴포넌트는 계산식을 갖지 않고 `engine` 함수 호출 결과를 렌더링합니다. 데이터에는 사용자 표시 문장 대신 locale key만 저장했습니다. 저장 데이터도 `GameState`만 담고 한국어 문장이나 React UI state는 저장하지 않습니다.

## 5. 게임 루프

`advanceOneDay`는 날짜 증가, 효과 감소, 내부 침투, 권역 간 확산, 탐지, 방어, 침투 제거, 영향력, 자원, 글로벌 노출/방어, 이벤트, 엔딩 판정을 순서대로 처리합니다. 기본 속도는 1초 1일, 2배속은 0.5초 1일입니다.

## 6. UI 레이아웃

PC는 상단 상태바, 중앙 지도, 오른쪽 상세 패널, 하단 커맨드바 구조입니다. 모바일 가로모드는 상세 패널을 숨기고 지도와 하단 작전 중심으로 표시합니다. 모바일 세로모드는 회전 안내 오버레이를 표시합니다.

## 7. i18n 준비 상태

한국어 key는 앱 상태, 리소스, 스탯, 8개 지역, 6개 작전, 15개 스킬, 10개 이벤트, 7개 엔딩, 로그, 에러, 도움말을 포함합니다. 영어 catalog는 일부만 있고 누락 key는 한국어 fallback을 사용합니다.

## 8. 테스트 결과

통과한 테스트:

- `formulas.test.ts`
- `tick.test.ts`
- `actionResolver.test.ts`
- `abilityResolver.test.ts`
- `victoryResolver.test.ts`
- `i18n.test.ts`
- `persistence.test.ts`

브라우저 검증:

- `develop-web-game` Playwright client 실행 완료
- hook 수정 후 `develop-web-game` Playwright client 재실행 완료
- 데스크톱 gameplay flow 자동화 완료: 새 게임, 작전 실행, 스킬트리 pause, 스킬 구매, 모달 닫힘 후 수동 재생 확인
- 모바일 가로 viewport `844x390` 렌더 확인
- 모바일 세로 viewport `390x844` 회전 안내 확인
- 스크린샷: `output/web-game/manual-gameplay.png`, `mobile-landscape.png`, `mobile-portrait.png`

## 9. 주요 결정과 가정

- 지도는 실제 GIS가 아닌 placeholder SVG와 percent 좌표 마커로 구현했습니다.
- 이벤트 확률은 명세 기본값 `0.06`을 사용했습니다.
- 방어 프로토콜은 완전한 범용 룰 엔진 대신 데이터 정의와 명시적 resolver를 함께 사용했습니다.
- 작전 쿨다운은 데이터 타입에 열어두었지만 MVP 작전에는 적용하지 않았습니다.
- 자원은 소수점으로 저장하고 UI에서는 0~1자리로 표시합니다.

## 10. 남은 한계

- 밸런싱은 1차 값입니다. 특정 빌드가 지나치게 빠르거나 느릴 수 있습니다.
- 이벤트 선택지가 발생한 동안 테스트용 `window.advanceTime`을 직접 호출하면 날짜가 강제로 진행될 수 있습니다. 실제 UI loop는 모달 중 진행하지 않습니다.
- 지도는 추상 SVG라 실제 지리 정확도는 없습니다.
- 영어 번역은 fallback 구조만 준비되어 있습니다.
- Godot 컨버팅은 아키텍처 기준을 마련한 수준이며 자동 변환 도구는 없습니다.

## 11. 다음 작업 제안

1. 30~60분 플레이 세션 기준으로 글로벌 방어와 승리 조건 밸런싱 조정
2. 이벤트 발생 조건에 최소 날짜를 추가해 초반 이벤트 밀도 조절
3. 스킬트리를 시각적 그래프 형태로 확장
4. locale을 JSON export 가능하게 변환
5. 저장 슬롯 2~3개와 수동 삭제 UI 추가
