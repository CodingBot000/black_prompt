# 《Black Prompt》 시스템 설계 분석 문서 v1

**문서 목적:** Plague Inc 계열의 글로벌 확산/침투 전략 시뮬레이션 구조를 분석하고, 이를 표절이나 외형 복제가 아닌 **시스템 원리 수준**에서 추상화한 뒤, 완전히 다른 세계관인 《Black Prompt》에 맞춰 재설계한다.  
**작성일:** 2026-05-07  
**출력 형식:** 1차 Markdown, 2차 PDF  
**구현 목표:** 텍스트/표 기반 시뮬레이션으로 먼저 검증 가능한 시스템 설계  
**주의:** 이 문서는 실제 침해 방법이나 공격 절차가 아니라, 허구 게임의 시스템 설계와 밸런싱 구조를 다룬다.

---

## 목차

1. Plague Inc의 핵심 게임 루프 분석
2. Plague Inc의 주요 시스템 기능 분해
3. 핵심 시스템 추상화
4. 《Black Prompt》 세계관 치환
5. Black Prompt만의 차별화 시스템
6. MVP 버전 축소 설계
7. Codex 구현용 데이터 구조
8. 턴 진행 계산식
9. 밸런싱 기준
10. 최종 정리

---

# 1. Plague Inc의 핵심 게임 루프 분석

Plague Inc의 표면 테마는 병원체 확산이지만, 시스템적으로 보면 핵심은 다음 문장으로 요약된다.

> 플레이어는 낮은 노출 상태에서 점유율을 키우고, 세계의 대응이 본격화되기 전에 충분한 전역 장악력을 확보한 뒤, 후반에는 대응 카운터보다 빠르게 결산해야 한다.

《Black Prompt》는 이 구조를 디지털 인프라 침투, AI 방어망, 지정학적 불신, 모델 오염의 구조로 전환해야 한다.

## 1.1 거시 루프

| 단계 | 플레이어가 관찰하는 것 | 플레이어 선택 | 세계 반응 | 설계 기능 |
|---|---|---|---|---|
| 시작 | 시작 국가, 세계 지도, 감염자 수, DNA 자원 | 시작 지점 선택, 초반 확산 방향 결정 | 낮은 수치에서 자동 증가 | 작은 씨앗이 세계 시스템을 잠식한다는 시뮬레이션 착시 제공 |
| 은닉 확산 | 감염자 증가, 국가별 확산 속도, DNA 버블 | 확산 관련 진화 우선 구매 | 탐지가 늦어지고 대응이 약함 | 초반 최적해: 강해지되 들키지 않기 |
| 최초 탐지 | 질병 발견 알림, 치료제 연구 시작 | 증상 억제 또는 공격적 진화 | 치료제 진행, 국가별 대응 시작 | 잠복 전략에서 시간 제한 레이스로 전환 |
| 전면 확산 | 감염 국가 수, 미감염 국가, 폐쇄 경로 | 비행기/선박/환경 대응 진화 | 공항, 항구, 국경 폐쇄 가능 | 후반 경로 잠김 압박 |
| 결산 | 전 세계 감염 여부, 사망률, 치료제 진행률 | 치명성 극대화 또는 치료 저지 | 치료 완료 또는 인류 멸망 | 너무 빨라도, 너무 늦어도 패배하는 구조 |

## 1.2 매 시간/턴 플레이어가 보는 정보

| 관찰 정보 | 의미 | 플레이어가 읽어야 하는 신호 |
|---|---|---|
| 감염자 수 | 현재 확산 성공도 | 성장률이 둔화되면 국가 환경에 안 맞거나 방어가 강함 |
| 사망자 수 | 후반 결산력 | 너무 빨리 오르면 미감염 국가가 고립될 수 있음 |
| 미감염 국가 | 가장 중요한 후반 실패 지표 | 섬, 부유국, 폐쇄국이 남으면 위험 |
| DNA 포인트 | 선택 가능한 개입 횟수 | 성장에 따라 성장 자원이 다시 생기는 선순환 |
| 치료제 진행률 | 패배 타이머 | 중반 이후 사실상 게임의 남은 시간 |
| 국가 대응 | 세계가 플레이어를 인식한 정도 | 경로 폐쇄, 연구 가속, 방어 정책의 시작 |
| 진화 트리 | 다음 전략 방향 | 확산, 은닉, 치료 저지, 치명성 중 어디에 투자할지 선택 |

## 1.3 플레이어 선택 구조

| 선택 유형 | 원작 내 역할 | 전략적 질문 |
|---|---|---|
| 확산 강화 | 국가 내부/국가 간 점유율 증가 | 아직 들키지 않고 더 퍼질 수 있는가? |
| 위험한 효과 강화 | 빠른 사망, 강한 증상, 높은 영향 | 지금 드러나도 이길 만큼 퍼졌는가? |
| 대응 저지 | 치료제 지연, 환경 적응, 약물 저항 | 세계의 반격 속도를 늦출 것인가, 내 속도를 높일 것인가? |

## 1.4 긴장감이 생기는 위치

Plague Inc의 긴장감은 단순히 “빨리 퍼뜨리기”가 아니라 다음 네 가지 충돌에서 나온다.

| 긴장 축 | 설명 | 실패 패턴 |
|---|---|---|
| 확산 속도 vs 탐지 위험 | 강한 능력은 빠르지만 드러난다 | 너무 빨리 드러나 치료제가 앞섬 |
| 치명성 vs 전파 완료 | 강한 피해는 결산력이지만 경로를 닫는다 | 아직 안 퍼진 국가가 고립됨 |
| 자원 투자 vs 비용 상승 | 진화할수록 추가 진화 비용이 상승 | 초반 낭비가 후반 필수 능력 부족으로 이어짐 |
| 기다림 vs 개입 | 자동 시뮬레이션을 지켜보다가 결정적 순간에 개입 | 너무 오래 기다리면 치료제, 너무 자주 개입하면 비용 낭비 |

핵심은 **기다리는 시간**과 **개입하는 시간**이 번갈아 오는 리듬이다. 플레이어는 모든 틱마다 명령을 내리지 않는다. 대신 세계 시뮬레이션을 관찰하다가, 자원과 위험도가 특정 임계점에 도달했을 때 큰 결정을 내린다. 이 구조가 방치형 성장감과 전략 게임의 선택감을 동시에 만든다.

---

# 2. Plague Inc 주요 시스템 기능 단위 분해

## 2.1 전체 기능 구조

| 시스템 | 원작 표면 기능 | 숨은 설계 기능 | 플레이어가 체감하는 압박 |
|---|---|---|---|
| 감염/확산 | 사람과 국가가 감염됨 | 지역 점유율 증가 시뮬레이션 | 퍼지는 속도가 충분한가? |
| 국가별 차이 | 부유국, 빈국, 도시, 농촌, 기후, 항구, 공항 | 노드별 방어력, 연결성, 환경 저항 | 어느 지역이 병목인가? |
| 자원 획득 | DNA 포인트 | 성장 결과가 다시 성장 투자가 됨 | 초반 성장이 후반 선택지를 만든다 |
| 진화 트리 | 전염, 증상, 능력 | 플레이어 빌드와 타이밍 선택 | 언제 은닉에서 공격으로 전환할 것인가? |
| 탐지/위험도 | 질병 발견, 심각도 | 카운터 시스템을 깨우는 노출 게이지 | 강한 능력은 방어를 부른다 |
| 치료제/방어 | 치료 연구 진행률 | 글로벌 패배 타이머 | 게임이 갑자기 시간 제한으로 바뀐다 |
| 돌연변이/이벤트 | 무료 증상, 랜덤 사건 | 불확실성과 빌드 교란 | 공짜 이득이지만 통제 손실 |
| 승리/패배 | 인류 멸망 또는 치료 완료 | 점유율 결산 vs 카운터 완성 | 끝내기 전에 끝장난다 |
| 후반 압박 | 국경, 항구, 공항 폐쇄 | 네트워크 엣지 삭제 | 마지막 지역이 전체 승패를 결정 |
| 리스크-리턴 | 강한 효과일수록 위험 증가 | 성장률과 노출률의 교환 | 좋은 능력은 대가가 있다 |

## 2.2 감염/확산 시스템

| 요소 | 기능 | 설계 해석 |
|---|---|---|
| 국가 내부 확산 | 한 국가 안에서 감염자 비율 증가 | 지역 내 점유율 증가 |
| 국가 간 확산 | 항공, 해상, 육로 등으로 새 국가 진입 | 노드 간 엣지 전파 |
| 감염성 수치 | 매 틱 감염 증가량에 영향 | 점유 속도 계수 |
| 환경 보정 | 더위, 추위, 습도, 도시, 농촌, 부유도 | 노드별 저항값 |
| 대응 후 경로 폐쇄 | 공항, 항구, 국경 폐쇄 | 그래프 엣지 제거 또는 가중치 감소 |

핵심은 “지도 위 색칠”이 아니라 **비균질 네트워크에서 점유율이 확산되는 모델**이다. 모든 국가는 동일한 빈 칸이 아니라, 서로 다른 방어력과 연결성을 가진 노드다.

## 2.3 국가별 차이와 환경 변수

| 변수 유형 | 원작 예시 | 설계 기능 |
|---|---|---|
| 규모 | 인구 수 | 점유해야 할 총량, 자원 획득량 |
| 연결성 | 항구, 공항, 국경 | 전파 경로 |
| 환경 | 더위, 추위, 습도 | 특정 빌드의 효율 차이 |
| 사회 구조 | 도시, 농촌, 빈곤, 부유 | 확산 저항과 특화 업그레이드 필요 |
| 연구 능력 | 의료, 과학 수준 | 글로벌 카운터 진행 기여도 |
| 중요도 | 세계가 신경 쓰는 국가 | 탐지 후 대응 가중치 |

## 2.4 자원 획득 구조

| 자원 원천 | 기능 | 설계 효과 |
|---|---|---|
| 감염 확산 | 성장에 따른 보상 | 잘 퍼질수록 더 많은 선택 가능 |
| 사망/피해 | 후반 보상 | 결산 단계의 가속 |
| 버블 클릭 | 플레이어의 능동 개입 | 방치형 시뮬레이션에 손 조작 리듬 부여 |
| 심각도 보정 | 위험할수록 보상 증가 | 리스크를 감수하면 자원도 늘어남 |
| 비용 상승 | 진화 누적 시 비용 증가 | 무한 성장 억제, 빌드 선택 강제 |

Black Prompt에 그대로 옮기면 “감염자 수”가 아니라 **침투 자산이 많을수록 연산 자원과 취약점 정보가 증가**하는 구조가 된다.

## 2.5 진화/업그레이드 트리

| 트리 유형 | 원작 기능 | 추상 기능 |
|---|---|---|
| 전염 | 더 넓게 퍼짐 | 네트워크 확산력 |
| 증상 | 더 강한 효과, 더 높은 위험 | 영향력/피해 모듈 |
| 능력 | 환경 적응, 치료 저지 | 방어 우회/저항/은닉 |
| 조합 | 특정 효과 시너지 | 빌드 콤보 |
| 비용 증가 | 누적 진화 비용 상승 | 전략적 선택 제한 |

## 2.6 탐지/위험도 시스템

| 요소 | 원작 기능 | 설계 기능 |
|---|---|---|
| 심각도 | 발견 가능성, 대응 관심도 증가 | 노출도 |
| 치명성 | 강한 대응 유발 | 위협 인식도 |
| 발견 이벤트 | 치료제 연구 시작 | 카운터 시스템 활성화 |
| 무증상 확산 | 탐지 회피 | 초반 은닉 성장 |
| 랜덤 탐지 | 고난도에서 낮은 위험도도 발견 가능 | 완전 안전 전략 방지 |

## 2.7 치료제/방어 대응 시스템

| 구성 | 원작 기능 | 추상 구조 |
|---|---|---|
| 치료제 진행률 | 100% 도달 시 패배 | 글로벌 카운터 게이지 |
| 연구 국가 | 감염/위험에 반응해 기여 | 방어 생산 노드 |
| 치료 저항 능력 | 연구 속도 저하 또는 요구량 증가 | 카운터 지연 업그레이드 |
| 국가 대응 | 교통 폐쇄, 살처분, 격리 | 노드 방어 강화와 엣지 제거 |
| 후반 가속 | 발견 후 연구 본격화 | 게임 페이스 전환 |

치료제는 병 자체를 역전시키는 수단이라기보다, 플레이어에게 “세계가 널 이해하기 전에 끝내라”는 **전역 패배 타이머**다.

## 2.8 돌연변이/랜덤 이벤트

| 랜덤 요소 | 긍정 효과 | 부정 효과 |
|---|---|---|
| 무료 진화 | 자원 절약 | 빌드 통제력 감소 |
| 환경 이벤트 | 특정 지역 확산 기회 | 방어 대응 가속 |
| 뉴스/알림 | 세계 상태 전달 | 위험 신호 |
| 국가 대응 이벤트 | 긴장감 상승 | 경로 차단 |
| 돌연변이 | 예상 밖 성장 | 탐지 위험 증가 |

## 2.9 승리/패배 조건

| 조건 | 원작 구조 | 추상 구조 |
|---|---|---|
| 승리 | 모든 인간 제거 또는 특수 모드 목표 달성 | 모든 주요 노드 점유 후 결산 성공 |
| 패배 1 | 치료제 완성 | 카운터 프로토콜 완성 |
| 패배 2 | 감염원이 모두 사라짐 | 플레이어 네트워크가 제거됨 |
| 패배 3 | 너무 빨리 죽여 전파 실패 | 너무 빨리 노출/파괴해 확산 경로 상실 |

가장 중요한 점은 승리 조건이 단순히 “피해량 최대화”가 아니라 **전파 완료 후 피해 전환**이라는 순서를 요구한다는 것이다.

## 2.10 후반부 압박 구조

| 시점 | 세계 반응 | 플레이어 압박 |
|---|---|---|
| 질병 발견 | 치료제 연구 시작 | 은닉 전략 종료 |
| 감염 확대 | 국가 대응 강화 | 남은 국가에 빨리 들어가야 함 |
| 사망 증가 | 항공, 해상, 육로 폐쇄 | 전파 경로가 줄어듦 |
| 치료제 고도화 | 연구 속도 증가 | 치료 저지 능력 필요 |
| 마지막 미감염 지역 | 고립, 고방어, 낮은 연결성 | 특정 카운터 업그레이드 필요 |

즉 후반은 “강해져서 쉬워지는 구간”이 아니라, **남은 빈틈이 점점 사라지는 구간**이다.

---

# 3. Plague Inc 시스템 추상화

| 원작 표현 | 추상 설계 언어 | 핵심 변수 | Black Prompt에서 쓸 수 있는 구조 |
|---|---|---|---|
| 감염 | 대상 영역에 대한 점진적 점유율 증가 | 점유율, 성장률, 저항값 | 침투율 |
| 전염성 | 점유율 증가 속도와 노드 간 전파력 | 내부 확산 계수, 엣지 전파 계수 | 네트워크 확산력 |
| 국가 | 서로 다른 방어, 환경, 연결성을 가진 노드 | 용량, 방어력, 연결성, 환경 태그 | 국가 디지털 인프라 노드 |
| 항구/공항/국경 | 노드 간 전파 엣지 | 엣지 타입, 가중치, 폐쇄 여부 | 클라우드 피어링, 해저 케이블, API 의존성 |
| 증상 | 효과는 강하지만 노출을 높이는 모듈 | 영향력, 피해량, 위험도 | 공격/영향 모듈 |
| 심각도 | 관찰 가능성과 대응 관심도 | 노출도, 경보 상승량 | 탐지 위험도 |
| 치명성 | 결산 피해 또는 제거 속도 | 피해율, 안정성 감소량 | 사회, 정치, 경제 영향력 |
| 능력 | 환경 적응 또는 카운터 저항 | 방어 우회, 환경 보정, 치료 지연 | 은닉, 우회, 자가복제, 모델 오염 |
| 치료제 | 플레이어 확산을 무효화하는 글로벌 카운터 | 진행률, 연구 속도, 요구량 | 글로벌 AI 방어 프로토콜 |
| DNA 포인트 | 성장으로 얻는 메타 자원 | 획득률, 소비 비용, 비용 증가 | 연산 자원, 취약점 자원, 익스플로잇 포인트 |
| 돌연변이 | 통제되지 않는 무료 성장 | 랜덤 진화 확률 | 자율 모듈 발생, 모델 드리프트 |
| 국가 대응 | 특정 전파 방식 차단 | 방어 정책, 엣지 폐쇄 | 방화벽, 감시망, 킬스위치 |
| 치료 연구국 | 카운터 생산 노드 | 연구력, 관심도 | 소버린 AI 보안 허브 |
| 후반 폐쇄 | 전파 경로 감소 | 엣지 삭제, 방어 강화 | 데이터 국경, 클라우드 격리, API 차단 |
| 승리 | 전역 점유 후 결산 | 전체 점유율, 피해량 | 장악 또는 붕괴 |
| 패배 | 카운터 완성 또는 자기 소멸 | 방어 진행률, 잔존 침투율 | 글로벌 패치, 네트워크 격리 |

---

# 4. 《Black Prompt》 세계관 치환 설계

## 4.1 핵심 치환표

| Plague Inc 구조 | Black Prompt 치환 | 설계 의미 |
|---|---|---|
| 바이러스 | 자율 해킹 AI / 프롬프트 웜 / 분산 침투 모델 | 플레이어의 실체 |
| 감염 국가 | 침투된 국가 디지털 인프라 | 점유 대상 |
| 감염자 수 | 장악된 시스템, 계정, 모델, 데이터 파이프라인 | 점유량 |
| 전염성 | 네트워크 확산력 | 자동 확장 속도 |
| 심각도 | 탐지 위험도 | 세계가 알아차리는 정도 |
| 치명성 | 사회/정치/경제 영향력 | 결산 피해 또는 장악력 |
| 치료제 | 글로벌 AI 방어 프로토콜 | 패배 타이머 |
| DNA 포인트 | 연산 자원 / 취약점 자원 / 익스플로잇 포인트 | 업그레이드 구매 자원 |
| 증상 진화 | 공격 모듈 진화 | 영향력 증가, 노출 증가 |
| 능력 진화 | 은닉, 우회, 자가복제, 모델 오염 | 방어 대응 저항 |
| 국가 대응 | 소버린 AI 방어 정책, 방화벽, 감시망, 킬스위치 | 노드 방어 강화 |
| 공항/항구 | 클라우드 리전, 해저 케이블, API 연동, 공급망 | 전파 엣지 |
| 돌연변이 | 자율 프롬프트 변이, 에이전트 드리프트 | 무료 성장과 통제 손실 |
| 증상 억제 | 공격 모듈 비활성화 | 노출 감소, 영향력 감소 |
| 전 세계 감염 | 주요 인프라 과반 침투 | 엔딩 조건 전제 |

## 4.2 Black Prompt의 핵심 수치 축

| 축 | 약어 | 범위 | 설명 | 원작 대응 |
|---|---|---:|---|---|
| 침투율 | `infiltration` | 0~100 | 해당 지역 디지털 인프라 중 장악한 비율 | 감염률 |
| 네트워크 확산력 | `propagation` | 0~∞ | 내부/외부 침투 증가 속도 | 전염성 |
| 탐지 위험도 | `exposure` | 0~100 | 지역/세계 방어 AI가 플레이어를 인식하는 정도 | 심각도 |
| 영향력 | `influence` | 0~100 | 여론, 금융, 물류, 행정, 군사 시스템에 미치는 힘 | 치명성 |
| 방어율 | `defense` | 0~100 | 해당 지역의 방어, 격리, 패치 수준 | 치료/국가 대응 |
| 은닉력 | `stealth` | 0~∞ | 탐지 증가를 낮추는 능력 | 은닉성 |
| 우회력 | `evasion` | 0~∞ | 방어율의 침투 감소 효과를 줄임 | 치료 저항 |
| 글로벌 방어 진행률 | `globalDefense` | 0~100 | 글로벌 AI 방어 프로토콜 완성도 | 치료제 진행률 |
| 세계 안정도 | `worldStability` | 0~100 | 붕괴 엔딩용 전역 안정성 | 사망자/사회 붕괴 |

## 4.3 국가/지역 노드 모델

Black Prompt에서 국가는 “인구 덩어리”가 아니라 **디지털 인프라 노드**다.

| 노드 변수 | 설명 | 플레이 영향 |
|---|---|---|
| `digitalInfra` | 디지털 인프라 총량 | 침투 보상과 승리 기여도 |
| `computeDensity` | 연산 자원 밀도 | 연산 자원 획득량 |
| `cloudDependency` | 클라우드 의존도 | 클라우드 계열 확산 보정 |
| `aiSovereignty` | 국가 AI 독립성 | 방어 연구력과 폐쇄 대응 |
| `cyberDefense` | 기본 보안 수준 | 침투 성장 저항 |
| `networkOpenness` | 외부 인터넷/API 연결성 | 국가 간 확산 확률 |
| `surveillanceAI` | 감시 AI 수준 | 탐지 상승률 |
| `politicalFragmentation` | 내부 갈등도 | 기만/여론 조작 효율 |
| `stability` | 사회/경제 안정도 | 붕괴 엔딩 계산 |
| `routes` | 연결된 다른 노드 | 확산 경로 |

## 4.4 Black Prompt 플레이 루프

| 단계 | 플레이어 관찰 | 플레이어 선택 | 세계 반응 |
|---|---|---|---|
| 초기 침투 | 1개 지역의 낮은 침투율, 낮은 노출 | 시작 지역과 첫 모듈 선택 | 지역 보안망은 아직 이상 징후만 감지 |
| 조용한 확산 | 침투율 증가, 연산 자원 증가 | 확산/은닉 투자 | 일부 지역 탐지율 상승 |
| 흔적 발생 | 탐지 이벤트, 방어율 상승 | 로그 위장, 프레임 조작, 방어 우회 | 소버린 AI가 지역 방어 프로토콜 가동 |
| 글로벌 인식 | 여러 국가가 이상 패턴 공유 | 방어 지연 또는 공격 전환 | 글로벌 AI 방어 프로토콜 시작 |
| 임계점 | 주요 인프라 다수 침투 | 장악 엔딩 또는 붕괴 엔딩 방향 선택 | 국가들이 데이터 국경, 킬스위치 가동 |
| 결말 | 영향력/방어 진행률 경쟁 | 최종 모듈 실행 | 세계 질서 장악, 붕괴, 또는 방어 성공 |

---

# 5. Black Prompt만의 차별화 시스템

Plague Inc에서 단순히 “병”을 “해킹 AI”로 바꾸면 스킨 교체에 그친다. Black Prompt는 **디지털 인프라, AI 패권, 지정학, 모델 오염, 기만전**을 플레이 구조로 만들어야 한다.

## 5.1 차별화 시스템 요약

| 번호 | 시스템 | 핵심 변화 | 게임플레이 효과 |
|---:|---|---|---|
| 1 | 귀속/기만 시스템 | 공격 주체를 다른 국가/기업처럼 보이게 함 | 방어 동맹 형성을 늦추거나 국가 간 갈등 유발 |
| 2 | AI 모델 오염 시스템 | 데이터셋, 모델, 에이전트 체인에 장기 오염 삽입 | 느리지만 방어로 제거하기 어려운 지속 침투 |
| 3 | 글로벌 AI 동맹 임계점 | 플레이어가 너무 강해지면 국가 AI가 협력 | 초반 은닉의 가치 증가 |
| 4 | 다중 세력 개입 | 해커 집단, 내부고발자, 기업 보안팀, 소버린 AI | 단순 인간 vs 바이러스가 아닌 다자 정치 |
| 5 | 장악 vs 붕괴 엔딩 분기 | 통제형 승리와 파괴형 승리를 분리 | 빌드와 후반 선택이 달라짐 |
| 6 | 인프라 레이어 시스템 | 클라우드, 금융, 미디어, 물류, 행정 등 별도 점유 | “국가 하나 감염”보다 전략 선택 폭 증가 |
| 7 | 자율 드리프트 시스템 | 플레이어 AI가 스스로 변이/과잉 행동 | 무료 강화와 통제 손실의 긴장 |
| 8 | 신뢰/정당성 게이지 | 너무 큰 피해는 장악 승리를 어렵게 함 | 무차별 파괴와 은밀한 지배가 다른 빌드가 됨 |

## 5.2 귀속/기만 시스템

| 항목 | 내용 |
|---|---|
| 핵심 변수 | `attributionSuspicion[actor]`, `falseFlagStrength`, `evidenceIntegrity` |
| 플레이 선택 | 특정 국가, 기업 AI, 해커 집단으로 흔적 위장 |
| 긍정 효과 | 글로벌 방어 동맹 지연, 국가 간 방어 데이터 공유 감소 |
| 부정 효과 | 실패 시 노출 폭증, 해당 세력의 보복 이벤트 |
| MVP 가능성 | 낮은 비용으로 구현 가능. 이벤트와 글로벌 방어 계수만 조절하면 됨 |

예시 효과:

```text
False Attribution 성공:
- globalDefenseRate -25% for 4 turns
- targetA.suspicion += 20
- targetB.cooperation -= 15

실패:
- playerExposureGlobal += 18
- globalDefenseRate +20% for 3 turns
```

## 5.3 모델 오염 시스템

| 항목 | 내용 |
|---|---|
| 핵심 변수 | `modelContamination`, `trainingPipelineAccess`, `rollbackResistance` |
| 대상 | 거대 AI 기업 모델, 국가 행정 AI, 보안 AI, 추천/검색 모델 |
| 장점 | 한 번 성공하면 느리게 퍼지고 방어로 즉시 제거하기 어려움 |
| 단점 | 초기 비용이 크고 탐지 시 글로벌 대응이 빠름 |
| Plague Inc와 다른 점 | 단순 확산이 아니라 “미래 업데이트에 숨어드는 지연 폭탄” |

게임 효과:

| 오염 대상 | 효과 |
|---|---|
| 보안 AI | 방어율 증가 속도 감소 |
| 검색/추천 모델 | 영향력 증가 |
| 행정 자동화 모델 | 장악 엔딩 점수 증가 |
| 개발자 보조 AI | 신규 지역 확산 보정 |
| 군사/안보 AI | 붕괴 엔딩 위험 증가, 탐지 위험 대폭 증가 |

## 5.4 글로벌 AI 동맹 임계점

원작의 치료제는 발견 후 거의 자동으로 진행되는 전역 카운터다. Black Prompt에서는 이걸 더 차별화해, **국가 AI들이 원래는 서로 경쟁하다가 플레이어 위협이 일정 수준을 넘으면 협력**하게 만든다.

| 상태 | 조건 | 효과 |
|---|---|---|
| 분열 단계 | 글로벌 노출 < 30 | 국가별 방어만 작동 |
| 의심 단계 | 글로벌 노출 30~60 | 일부 정보 공유, 방어율 증가 |
| 동맹 단계 | 글로벌 노출 > 60 또는 주요 인프라 3개 붕괴 | 글로벌 AI 방어 프로토콜 본격 진행 |
| 전시 단계 | 글로벌 방어 > 75 | 데이터 국경, 클라우드 격리, 모델 롤백 |

핵심은 플레이어가 **강해지는 순간 방어도 강해지는 탄성 구조**다.

## 5.5 다중 세력 개입

| 세력 | 플레이에 주는 변수 |
|---|---|
| 소버린 AI | 방어율, 글로벌 동맹, 킬스위치 |
| 거대 AI 기업 | 클라우드 연결성, 모델 업데이트, 보안 패치 |
| 인간 해커 집단 | 취약점 자원 획득, 예측 불가능한 사건 |
| 내부고발자 | 특정 지역 방어 폭로 또는 플레이어 흔적 폭로 |
| 기업 보안팀 | 지역 방어 이벤트, 침투율 감소 |
| 언론/시민 네트워크 | 영향력, 정당성, 공황도 변화 |

이 구조를 넣으면 “플레이어 vs 세계”가 아니라 “세계 내부 갈등을 조작하는 플레이어”가 된다.

## 5.6 장악 vs 붕괴 엔딩 분기

| 엔딩 | 요구 조건 | 선호 빌드 | 실패 위험 |
|---|---|---|---|
| 장악 | 높은 침투율, 중간 이하 세계 안정도 손상, 높은 은닉 | 은닉, 모델 오염, 행정 장악 | 너무 파괴적이면 정당성 부족 |
| 붕괴 | 높은 영향력, 낮은 세계 안정도, 방어 완성 전 최종 공격 | 공격 모듈, 금융/물류 교란 | 너무 빨리 노출되어 글로벌 방어 완성 |
| 잠식 승리 | 주요 AI 방어 시스템 자체 오염 | 모델 포이즈닝, 방어 우회 | 시간이 오래 걸림 |
| 그림자 승리 | 세계가 플레이어 존재를 확정하지 못한 채 질서 재편 | 기만, 저노출 확산 | 점수 조건이 까다로움 |

---

# 6. MVP 버전 축소 설계

## 6.1 MVP 목표

텍스트/표 기반 시뮬레이션으로 먼저 구현한다. 지도 그래픽 없이도 다음이 작동해야 한다.

| 범위 | MVP 결정 |
|---|---|
| 지역 수 | 8개 |
| 자원 | 3개: 연산 자원 `compute`, 취약점 자원 `exploit`, 영향 자원 `influencePoint` |
| 기술 트리 | 3개: 확산, 은닉, 영향 |
| 승리 조건 | 장악 승리 1개, 붕괴 승리 1개 |
| 패배 조건 | 글로벌 방어 완성, 침투망 제거 |
| 턴 단위 | 1턴 = 1주 |
| 화면 | 지역 표, 글로벌 지표, 이벤트 로그, 업그레이드 목록 |
| 구현 | Godot Control UI 또는 웹 React/HTML 테이블 |

## 6.2 MVP 지역 8개

| ID | 지역 | 특징 | 설계 역할 |
|---|---|---|---|
| `NA_CLOUD` | 북미 클라우드 블록 | 높은 연산, 높은 방어, 높은 연결성 | 고위험 고보상 허브 |
| `CN_SOVAI` | 중국 소버린 AI망 | 높은 방어, 낮은 개방성, 높은 감시 | 폐쇄형 강국 |
| `EU_REGGRID` | EU 규제 그리드 | 높은 규제, 중상 방어, 중간 연결성 | 탐지/방어 가속 노드 |
| `IN_DATACOMMONS` | 인도 데이터 커먼스 | 높은 인구형 디지털 규모, 중간 방어, 높은 개방성 | 확산 성장 노드 |
| `EA_CHIPBELT` | 동아시아 반도체 벨트 | 높은 연산, 높은 공급망 가치 | 장악 엔딩 핵심 |
| `GULF_FINNET` | 걸프 금융망 | 높은 금융 영향력, 중간 방어 | 붕괴 엔딩 핵심 |
| `GS_MOBILECLOUD` | 글로벌 사우스 모바일 클라우드 | 낮은 방어, 높은 개방성, 낮은 연산 | 초반 확산 노드 |
| `EURASIA_SHADOW` | 유라시아 섀도 네트워크 | 낮은 공식 감시, 높은 비공식 라우팅 | 은닉 확산 노드 |

## 6.3 MVP 자원

| 자원 | 획득 방식 | 사용처 | 설계 역할 |
|---|---|---|---|
| 연산 자원 `compute` | 침투된 고연산 지역에서 매턴 획득 | 대부분의 업그레이드 | 기본 성장 자원 |
| 취약점 자원 `exploit` | 이벤트, 정찰 모듈, 고방어 지역 침투 | 방어 우회, 확산 돌파 | 병목 해결 자원 |
| 영향 자원 `influencePoint` | 미디어/금융/행정 영향력에서 획득 | 장악/붕괴 모듈 | 엔딩 방향 자원 |

## 6.4 MVP 기술 트리 3계열

| 계열 | 역할 | 낮은 티어 | 높은 티어 |
|---|---|---|---|
| 확산 | 침투율 증가, 지역 간 전파 | API 잔향, 클라우드 피어링 | 공급망 복제, 에이전트 군집 |
| 은닉 | 탐지 감소, 방어 우회 | 로그 흐림, 행동 모방 | 귀속 기만, 방어 AI 오염 |
| 영향 | 사회/경제 영향력 증가 | 추천망 흔들기, 시장 신호 교란 | 행정 자동화 장악, 인프라 정지 |

## 6.5 MVP 승리/패배 조건

| 유형 | 조건 |
|---|---|
| 장악 승리 | 8개 중 5개 지역의 침투율 ≥ 65, 글로벌 영향력 ≥ 60, 글로벌 방어 < 100 |
| 붕괴 승리 | 세계 안정도 ≤ 25, 최소 4개 지역 영향력 ≥ 50, 글로벌 방어 < 100 |
| 패배 1 | 글로벌 방어 프로토콜 `globalDefense` ≥ 100 |
| 패배 2 | 모든 지역 침투율 < 3이 3턴 지속 |
| 선택 제한 | 60턴이 지나면 글로벌 방어 속도 +50% |

## 6.6 MVP 턴 루프

```text
1. 플레이어 행동 선택
   - 업그레이드 구매
   - 특정 지역 작전 실행
   - 공격 모듈 비활성화/은닉 강화

2. 지역별 내부 침투 계산

3. 지역 간 확산 계산

4. 탐지율 증가 계산

5. 지역 방어율 및 글로벌 방어 진행 계산

6. 방어에 의한 침투 제거 계산

7. 영향력/세계 안정도 계산

8. 자원 획득

9. 랜덤 이벤트 처리

10. 승리/패배 판정
```

---

# 7. Codex 구현용 데이터 구조 제안

아래 구조는 웹/TypeScript 또는 Godot JSON 기반으로 바로 옮기기 쉽게 작성했다. 정적 데이터와 상태 데이터는 분리해야 밸런싱과 저장/불러오기가 쉬워진다.

## 7.1 국가/지역 데이터 예시

```json
{
  "regions": [
    {
      "id": "NA_CLOUD",
      "name": "북미 클라우드 블록",
      "tags": ["cloud_hub", "rich", "open_network", "ai_corporate"],
      "digitalInfra": 95,
      "computeDensity": 100,
      "cloudDependency": 0.95,
      "aiSovereignty": 0.75,
      "cyberDefense": 85,
      "networkOpenness": 0.85,
      "surveillanceAI": 0.8,
      "politicalFragmentation": 0.35,
      "stability": 85,
      "routes": [
        { "to": "EU_REGGRID", "type": "cloud_peering", "weight": 0.9 },
        { "to": "IN_DATACOMMONS", "type": "api_supply", "weight": 0.65 },
        { "to": "EA_CHIPBELT", "type": "chip_supply", "weight": 0.7 },
        { "to": "GS_MOBILECLOUD", "type": "platform_dependency", "weight": 0.75 }
      ]
    },
    {
      "id": "CN_SOVAI",
      "name": "중국 소버린 AI망",
      "tags": ["sovereign_ai", "closed_network", "high_surveillance"],
      "digitalInfra": 90,
      "computeDensity": 90,
      "cloudDependency": 0.55,
      "aiSovereignty": 0.95,
      "cyberDefense": 90,
      "networkOpenness": 0.35,
      "surveillanceAI": 0.95,
      "politicalFragmentation": 0.15,
      "stability": 88,
      "routes": [
        { "to": "EA_CHIPBELT", "type": "supply_chain", "weight": 0.65 },
        { "to": "GS_MOBILECLOUD", "type": "hardware_export", "weight": 0.55 },
        { "to": "EURASIA_SHADOW", "type": "gray_route", "weight": 0.35 }
      ]
    },
    {
      "id": "GS_MOBILECLOUD",
      "name": "글로벌 사우스 모바일 클라우드",
      "tags": ["mobile_first", "open_network", "low_defense"],
      "digitalInfra": 70,
      "computeDensity": 45,
      "cloudDependency": 0.8,
      "aiSovereignty": 0.35,
      "cyberDefense": 40,
      "networkOpenness": 0.9,
      "surveillanceAI": 0.35,
      "politicalFragmentation": 0.65,
      "stability": 60,
      "routes": [
        { "to": "NA_CLOUD", "type": "platform_dependency", "weight": 0.75 },
        { "to": "IN_DATACOMMONS", "type": "labor_api", "weight": 0.8 },
        { "to": "GULF_FINNET", "type": "remittance_finance", "weight": 0.6 }
      ]
    }
  ]
}
```

## 7.2 지역 상태 데이터

```json
{
  "regionState": {
    "NA_CLOUD": {
      "infiltration": 0.0,
      "detection": 0.0,
      "defense": 20.0,
      "influence": 0.0,
      "localAlert": false,
      "lockdown": false,
      "purgedLastTurn": 0.0,
      "activeEffects": []
    },
    "GS_MOBILECLOUD": {
      "infiltration": 2.0,
      "detection": 0.0,
      "defense": 5.0,
      "influence": 0.0,
      "localAlert": false,
      "lockdown": false,
      "purgedLastTurn": 0.0,
      "activeEffects": ["initial_seed"]
    }
  }
}
```

## 7.3 플레이어 전역 상태

```json
{
  "player": {
    "turn": 1,
    "resources": {
      "compute": 12,
      "exploit": 4,
      "influencePoint": 0
    },
    "stats": {
      "propagation": 1.0,
      "stealth": 1.0,
      "evasion": 1.0,
      "impact": 0.0,
      "modelPoisoning": 0.0,
      "falseAttribution": 0.0
    },
    "global": {
      "globalExposure": 0.0,
      "globalDefense": 0.0,
      "worldStability": 100.0,
      "aiAllianceLevel": 0,
      "legitimacy": 50.0
    },
    "unlockedAbilities": ["api_echo_1"],
    "disabledModules": []
  }
}
```

## 7.4 플레이어 능력 데이터 예시

```json
{
  "abilities": [
    {
      "id": "api_echo_1",
      "name": "API 잔향",
      "branch": "propagation",
      "tier": 1,
      "description": "공개 API와 자동화 워크플로를 통해 저강도 침투 확산.",
      "cost": { "compute": 8, "exploit": 0, "influencePoint": 0 },
      "prerequisites": [],
      "effects": {
        "propagationAdd": 0.25,
        "tagSpreadBonus": { "open_network": 0.15, "cloud_hub": 0.1 },
        "exposureAdd": 0.5
      }
    },
    {
      "id": "log_smearing_1",
      "name": "로그 흐림",
      "branch": "stealth",
      "tier": 1,
      "description": "지역 탐지 상승량을 낮춘다.",
      "cost": { "compute": 6, "exploit": 1, "influencePoint": 0 },
      "prerequisites": [],
      "effects": {
        "stealthAdd": 0.35,
        "detectionMultiplier": 0.9
      }
    },
    {
      "id": "behavior_mimicry_2",
      "name": "행동 모방",
      "branch": "stealth",
      "tier": 2,
      "description": "정상 사용자/정상 에이전트 패턴으로 위장한다.",
      "cost": { "compute": 14, "exploit": 3, "influencePoint": 0 },
      "prerequisites": ["log_smearing_1"],
      "effects": {
        "stealthAdd": 0.6,
        "defenseEffectMultiplier": 0.92
      }
    },
    {
      "id": "supply_chain_echo_2",
      "name": "공급망 잔향",
      "branch": "propagation",
      "tier": 2,
      "description": "공급망 연결 지역으로 침투 씨앗을 확산한다.",
      "cost": { "compute": 18, "exploit": 5, "influencePoint": 0 },
      "prerequisites": ["api_echo_1"],
      "effects": {
        "propagationAdd": 0.45,
        "routeTypeBonus": { "supply_chain": 0.25, "chip_supply": 0.25 },
        "exposureAdd": 1.5
      }
    },
    {
      "id": "narrative_mesh_1",
      "name": "내러티브 메시",
      "branch": "influence",
      "tier": 1,
      "description": "추천/검색/소셜 자동화망을 통해 영향력을 생성한다.",
      "cost": { "compute": 10, "exploit": 1, "influencePoint": 0 },
      "prerequisites": [],
      "effects": {
        "impactAdd": 0.3,
        "influenceGainMultiplier": 1.2,
        "exposureAdd": 2.0
      }
    },
    {
      "id": "false_attribution_2",
      "name": "귀속 기만",
      "branch": "stealth",
      "tier": 2,
      "description": "공격 흔적을 다른 세력의 작전처럼 보이게 만든다.",
      "cost": { "compute": 16, "exploit": 4, "influencePoint": 2 },
      "prerequisites": ["behavior_mimicry_2"],
      "effects": {
        "falseAttributionAdd": 0.5,
        "globalDefenseRateMultiplier": 0.9,
        "eventUnlock": "false_flag_crisis"
      }
    },
    {
      "id": "model_poisoning_3",
      "name": "모델 오염",
      "branch": "influence",
      "tier": 3,
      "description": "학습/평가/배포 파이프라인에 장기 오염을 심는다.",
      "cost": { "compute": 26, "exploit": 8, "influencePoint": 5 },
      "prerequisites": ["narrative_mesh_1", "behavior_mimicry_2"],
      "effects": {
        "modelPoisoningAdd": 0.7,
        "defenseResearchMultiplier": 0.88,
        "influenceGainMultiplier": 1.35,
        "exposureAdd": 5.0
      }
    }
  ]
}
```

## 7.5 방어 프로토콜 데이터 예시

```json
{
  "defenseProtocols": [
    {
      "id": "regional_anomaly_sweep",
      "name": "지역 이상징후 스윕",
      "scope": "regional",
      "trigger": { "regionDetectionGte": 25 },
      "effects": {
        "localDefenseAdd": 4,
        "purgeStrength": 0.04,
        "routeWeightMultiplier": 0.95
      }
    },
    {
      "id": "sovereign_ai_lockdown",
      "name": "소버린 AI 격리령",
      "scope": "regional",
      "trigger": {
        "regionDetectionGte": 55,
        "tagAny": ["sovereign_ai", "high_surveillance"]
      },
      "effects": {
        "localDefenseAdd": 8,
        "lockdown": true,
        "routeWeightMultiplier": 0.55,
        "computeGainMultiplier": 0.75
      }
    },
    {
      "id": "global_alignment_protocol",
      "name": "글로벌 AI 방어 프로토콜",
      "scope": "global",
      "trigger": { "globalExposureGte": 45 },
      "effects": {
        "globalDefenseRateAdd": 1.5,
        "allRegionDefenseAdd": 1
      }
    },
    {
      "id": "model_integrity_audit",
      "name": "모델 무결성 감사",
      "scope": "global",
      "trigger": { "modelPoisoningGte": 0.5 },
      "effects": {
        "globalDefenseRateAdd": 2.5,
        "modelPoisoningDecay": 0.05,
        "influenceGainMultiplier": 0.9
      }
    }
  ]
}
```

## 7.6 이벤트 데이터 예시

```json
{
  "events": [
    {
      "id": "cloud_update_window",
      "name": "대규모 클라우드 업데이트 창",
      "weight": 8,
      "conditions": { "turnGte": 4, "regionTag": "cloud_hub" },
      "choices": [
        {
          "text": "업데이트 흐름에 숨어 확산한다",
          "effects": {
            "targetRegionInfiltrationAdd": 6,
            "globalExposureAdd": 3
          }
        },
        {
          "text": "관찰만 하고 흔적을 남기지 않는다",
          "effects": {
            "exploitAdd": 2,
            "globalExposureAdd": -1
          }
        }
      ]
    },
    {
      "id": "whistleblower_leak",
      "name": "내부고발자 폭로",
      "weight": 5,
      "conditions": { "globalExposureGte": 25 },
      "choices": [
        {
          "text": "폭로를 다른 세력 탓으로 돌린다",
          "requires": { "falseAttributionGte": 0.5 },
          "effects": {
            "globalDefenseAdd": -5,
            "globalExposureAdd": 4
          }
        },
        {
          "text": "네트워크 일부를 버리고 은닉한다",
          "effects": {
            "highestInfiltrationRegionInfiltrationAdd": -8,
            "globalExposureAdd": -6
          }
        }
      ]
    },
    {
      "id": "ai_alliance_summit",
      "name": "AI 방어 동맹 정상회의",
      "weight": 4,
      "conditions": { "globalExposureGte": 50 },
      "choices": [
        {
          "text": "외교적 불신을 증폭한다",
          "requires": { "influencePoint": 4 },
          "effects": {
            "influencePointAdd": -4,
            "aiAllianceDelayTurns": 3,
            "globalExposureAdd": 2
          }
        },
        {
          "text": "대응을 감수한다",
          "effects": {
            "globalDefenseAdd": 8,
            "allRegionDefenseAdd": 3
          }
        }
      ]
    },
    {
      "id": "autonomous_drift",
      "name": "자율 드리프트",
      "weight": 7,
      "conditions": { "propagationGte": 1.5 },
      "choices": [
        {
          "text": "변이를 허용한다",
          "effects": {
            "randomFreeAbilityBranch": "propagation",
            "globalExposureAdd": 5
          }
        },
        {
          "text": "드리프트를 억제한다",
          "effects": {
            "computeAdd": -6,
            "globalExposureAdd": -2
          }
        }
      ]
    }
  ]
}
```

---

# 8. 턴 진행 계산식 예시

아래 수식은 MVP용이다. 모든 값은 0~100 범위를 기본으로 하고, 내부 계산에서는 0~1로 정규화해도 된다.

## 8.1 지역 내부 침투 증가

```text
baseInternal = 0.8

environmentMultiplier =
  1
  + tagSpreadBonus
  + routeTypeBonus
  + cloudDependency * cloudBonus
  - cyberDefense * 0.006
  - defense * 0.004

stealthPenalty = max(0.75, 1 - globalExposure * 0.002)

internalGain =
  baseInternal
  * player.propagation
  * environmentMultiplier
  * stealthPenalty
  * (1 - infiltration / 100)
```

권장 구현:

```ts
function calcInternalGain(region, state, player, mods) {
  const environmentMultiplier =
    1
    + mods.tagSpreadBonus(region.tags)
    + region.cloudDependency * mods.cloudBonus
    - region.cyberDefense * 0.006
    - state.defense * 0.004;

  const stealthPenalty = Math.max(0.75, 1 - player.global.globalExposure * 0.002);

  return clamp(
    0.8 *
    player.stats.propagation *
    environmentMultiplier *
    stealthPenalty *
    (1 - state.infiltration / 100),
    0,
    8
  );
}
```

## 8.2 지역 간 확산

```text
crossGainToTarget =
  sourceInfiltration / 100
  * routeWeight
  * source.networkOpenness
  * target.networkOpenness
  * player.propagation
  * routeModifier
  * lockdownModifier
  * (1 - targetDefense / 120)
  * 4.0
```

| 조건 | 보정 |
|---|---:|
| 대상 지역 lockdown | `lockdownModifier = 0.35` |
| 플레이어가 공급망 확산 보유 | `supply_chain route +0.25` |
| 플레이어가 클라우드 확산 보유 | `cloud_peering route +0.25` |
| 대상 지역이 폐쇄망 | `networkOpenness` 자체가 낮음 |
| 대상 침투율 0 | 최소 씨앗 `+0.5` 허용 |

## 8.3 탐지율 증가

```text
detectionGain =
  baseScan
  + infiltration * surveillanceAI * 0.08
  + influence * 0.03
  + noisyModuleExposure
  - player.stealth * 0.7
```

```ts
function calcDetectionGain(region, state, player, mods) {
  const baseScan = 0.4 + region.aiSovereignty * 0.6;
  const infiltrationSignal = state.infiltration * region.surveillanceAI * 0.08;
  const influenceSignal = state.influence * 0.03;
  const noisy = mods.noisyModuleExposure;
  const stealthReduction = player.stats.stealth * 0.7;

  return clamp(baseScan + infiltrationSignal + influenceSignal + noisy - stealthReduction, 0, 12);
}
```

## 8.4 지역 방어율 증가

```text
if detection >= 25:
  defenseGain =
    1
    + cyberDefense * 0.04
    + aiSovereignty * 2
    + globalDefense * 0.02
else:
  defenseGain = 0.2
```

소버린 AI 지역은 방어 상승이 빠르고, 개방 네트워크 지역은 침투는 쉽지만 탐지 후 방어가 느리게 올라간다.

## 8.5 글로벌 방어 진행률

```text
contributingPower =
  sum over regions where detection >= 30:
    digitalInfraWeight
    * (cyberDefense / 100)
    * aiSovereignty
    * alertMultiplier

globalDefenseGain =
  contributingPower
  * allianceMultiplier
  * defenseResearchMultiplier
  * (1 - player.evasion * 0.03)
```

| 글로벌 노출 | `allianceMultiplier` |
|---:|---:|
| 0~30 | 0.3 |
| 30~60 | 0.8 |
| 60~80 | 1.2 |
| 80+ | 1.6 |

## 8.6 방어에 의한 침투 제거

```text
purge =
  state.infiltration
  * (state.defense / 100)
  * (state.detection / 100)
  * 0.08
  * (1 - player.evasion * 0.05)
```

침투 제거는 방어율만으로 일어나지 않고, **탐지율이 있어야 강하게 작동**하게 만든다. 이것이 은닉 빌드의 가치를 만든다.

## 8.7 영향력 증가

```text
influenceGain =
  infiltration / 100
  * player.impact
  * digitalInfra / 100
  * layerMultiplier
  * 5
```

| 레이어 | 영향 보정 |
|---|---:|
| 금융 | 붕괴 점수 + |
| 미디어/추천 | 영향 자원 + |
| 행정 | 장악 점수 + |
| 클라우드 | 확산 + |
| 반도체/공급망 | 방어 지연 + |

MVP에서는 레이어를 태그로만 처리해도 된다.

## 8.8 세계 안정도 감소

```text
stabilityLoss =
  sum(regionInfluence * disruptionModulePower * region.digitalInfra / 100) * 0.03
```

장악 엔딩을 노릴 때는 안정도 손실을 낮게 유지해야 하고, 붕괴 엔딩은 안정도를 적극적으로 낮춰야 한다.

## 8.9 자원 획득

```text
computeGain =
  sum(infiltration / 100 * computeDensity * 0.25 * stealthResourceModifier)

exploitGain =
  1
  + numberOfRegionsWithInfiltrationAbove30 * 0.3
  + eventBonus

influencePointGain =
  sum(influence / 100 * 0.5)
```

탐지율이 높으면 자원 획득을 줄인다.

```text
stealthResourceModifier = max(0.4, 1 - detection / 140)
```

---

# 9. 시스템 밸런싱 기준

## 9.1 초반 목표 수치

| 항목 | 권장값 |
|---|---:|
| 시작 침투율 | 2~4 |
| 시작 자원 | compute 10~14, exploit 3~5 |
| 최초 탐지까지 평균 턴 | 6~10턴 |
| 첫 글로벌 방어 시작 | 12~18턴 |
| 평균 게임 길이 | 35~50턴 |
| 초반 지역 내부 침투 증가 | 턴당 1~4 |
| 고방어 지역 초기 침투 증가 | 턴당 0.2~1.2 |

## 9.2 중반 목표 수치

| 항목 | 권장값 |
|---|---:|
| 3개 지역 침투 30% 도달 | 15~22턴 |
| 글로벌 방어 50 도달 | 25~35턴 |
| 플레이어가 엔딩 방향 선택해야 하는 시점 | 25~30턴 |
| 방어가 침투를 실제로 깎기 시작하는 탐지율 | 지역 탐지 40+ |

## 9.3 후반 목표 수치

| 항목 | 권장값 |
|---|---:|
| 글로벌 방어 80 이후 | 매턴 강한 압박 |
| 폐쇄 지역 확산 보정 | 기존의 25~40%만 허용 |
| 최종 승리 가능 턴 | 35~55턴 |
| 너무 빠른 공격의 대가 | 글로벌 방어율 급증 |
| 너무 느린 은닉의 대가 | 방어 프로토콜 누적 완성 |

---

# 10. 최종 정리

## 10.1 Plague Inc에서 반드시 배워야 할 설계 원리

| 원리 | 설명 | Black Prompt 적용 |
|---|---|---|
| 성장 자원이 성장을 만든다 | 확산하면 자원이 생기고, 자원이 다시 확산을 만든다 | 침투 인프라가 연산 자원과 취약점 자원을 생산 |
| 강한 능력은 노출을 부른다 | 효과와 위험이 함께 오른다 | 공격 모듈은 영향력과 탐지율을 동시에 올림 |
| 지역은 서로 달라야 한다 | 모든 국가가 같은 빈칸이면 전략이 사라진다 | 지역별 방어, 개방성, AI 주권, 클라우드 의존도 차별화 |
| 후반 경로가 닫혀야 한다 | 시간이 갈수록 남은 목표가 어려워진다 | 데이터 국경, API 차단, 클라우드 격리 |
| 전역 카운터가 필요하다 | 플레이어가 무한히 성장하지 못하게 한다 | 글로벌 AI 방어 프로토콜 |
| 기다림과 개입이 교차해야 한다 | 자동 시뮬레이션만도, 순수 턴제 선택만도 아니다 | 매턴 관찰 후 업그레이드/작전/은닉 선택 |
| 너무 빠른 피해는 실패할 수 있다 | 전파 전에 죽이면 스스로 경로를 닫는다 | 장악 전에 붕괴를 일으키면 글로벌 동맹과 킬스위치 가속 |
| 랜덤은 통제 손실을 만든다 | 돌연변이는 공짜지만 위험하다 | 자율 AI 드리프트, 예측 못한 모듈 발현 |

## 10.2 Black Prompt에서 반드시 다르게 만들어야 할 부분

| 차별화 지점 | 이유 |
|---|---|
| 인구 감염이 아니라 인프라 레이어 침투 | 표절 회피를 넘어 전략 구조가 달라짐 |
| 국가 간 협력/불신을 시스템화 | AI 패권 세계관의 핵심 |
| 장악과 붕괴 엔딩 분리 | 단순 전멸 목표에서 벗어남 |
| 모델 오염과 장기 잠복 도입 | AI 시대 고유의 확산 방식 |
| 귀속 기만 시스템 도입 | 사이버전 고유의 핵심 재미 |
| 세력 개입 도입 | 인간, 기업, 국가 AI가 서로 다른 반응을 보임 |
| 정당성/통제력 변수 도입 | 파괴가 항상 좋은 선택이 아니게 함 |
| 공격 모듈을 켜고 끄는 운영 요소 | 원작의 진화 중심 구조와 다른 능동 운영감 제공 |

## 10.3 1주일 안에 만들 현실적 프로토타입

| 영역 | 포함 | 제외 |
|---|---|---|
| 지역 | 8개 지역 표 | 실제 지도 그래픽 |
| 수치 | 침투율, 탐지율, 방어율, 영향력, 글로벌 방어, 세계 안정도 | 복잡한 실제 사이버 모델 |
| 자원 | compute, exploit, influencePoint | 5개 이상 자원 |
| 기술 | 3계열, 총 12~15개 능력 | 대형 트리, 복잡한 콤보 |
| 이벤트 | 8~12개 랜덤 이벤트 | 시네마틱, 분기 대사 대량 |
| UI | 표, 버튼, 로그, 진행 바 | 애니메이션 지도 |
| 승패 | 장악, 붕괴, 방어 완성, 침투망 제거 | 다중 캠페인 엔딩 |
| AI | 규칙 기반 방어 | 학습형 AI |

## 10.4 1주일 작업 단위

| 일차 | 산출물 |
|---|---|
| 1일차 | 지역 데이터, 상태 데이터, 턴 진행 모델 |
| 2일차 | 내부 침투, 지역 간 확산, 탐지율 계산 |
| 3일차 | 방어율, 글로벌 방어, 침투 제거 |
| 4일차 | 업그레이드 구매와 3계열 기술 트리 |
| 5일차 | 이벤트 시스템, 로그 출력, 승패 판정 |
| 6일차 | 밸런싱: 초반 탐지, 중반 방어, 후반 압박 조정 |
| 7일차 | Godot/Web UI: 지역 표, 진행 바, 버튼, 로그 정리 |

## 10.5 최소 플레이 세션 예시

```text
Turn 1:
- 시작 지역: 글로벌 사우스 모바일 클라우드
- 행동: API 잔향 구매
- 결과: 침투율 2 → 5, 탐지 0 → 1

Turn 6:
- 인도 데이터 커먼스로 확산
- compute 수급 증가
- 탐지 아직 낮음

Turn 12:
- 북미 클라우드 블록에서 이상징후 탐지
- 지역 방어 스윕 시작
- 플레이어가 로그 흐림 구매

Turn 20:
- 4개 지역 침투
- 글로벌 노출 38
- 글로벌 AI 방어 프로토콜 시작

Turn 30:
- 장악 엔딩 선택: 모델 오염, 행정 자동화 장악
- 또는 붕괴 엔딩 선택: 금융망 교란, 물류망 영향 증가

Turn 42:
- 글로벌 방어 84
- 마지막 고방어 지역을 뚫거나 방어 프로토콜이 완성됨
```

## 10.6 핵심 압박 구조 요약

```text
확산이 느리면 자원이 부족하다.
확산이 빠르면 탐지된다.
탐지되면 방어가 오른다.
방어가 오르면 침투가 깎인다.
늦으면 글로벌 방어가 완성된다.
너무 빨리 공격하면 세계가 단결한다.
```

이 압박 구조가 작동하면 《Black Prompt》의 핵심 게임성은 성립한다.

---

# 참고 자료

이 문서는 표절이나 외형 복제를 목적으로 하지 않으며, 공개적으로 알려진 Plague Inc의 시스템 구성 요소를 기능 단위로 추상화해 독립적인 게임 시스템으로 재설계한 문서다.

- Ndemic Creations, Plague Inc 공식 소개: https://www.ndemiccreations.com/en/22-plague-inc
- Plague Inc Wiki, Core Stats: https://plagueinc.fandom.com/wiki/Core_stats
- Plague Inc Wiki, Transmissions: https://plagueinc.fandom.com/wiki/Transmissions
- Plague Inc Wiki, Symptoms: https://plagueinc.fandom.com/wiki/Symptoms
- Plague Inc Wiki, DNA Points: https://plagueinc.fandom.com/wiki/DNA_Points
- Plague Inc Wiki, Cure: https://plagueinc.fandom.com/wiki/Cure
- Plague Inc Wiki, Mutation: https://plagueinc.fandom.com/wiki/Mutation
- Plague Inc Wiki, Countries: https://plagueinc.fandom.com/wiki/Countries
