# 출석부 (Yukyoung Attendance)

20명 이상의 학생을 엑셀로 수작업 관리하던 교사의 요청으로, 실제 운영 중인 출석 관리 웹 서비스를 **기획부터 배포까지 1인 개발**했습니다.

비개발자인 교사가 별도 교육 없이 사용할 수 있도록 필수 기능만 남긴 최소 UI로 설계했으며, 수업 중 모바일로 출석을 기록하는 환경을 고려해 **910px 기준 반응형**으로 개발했습니다.

🔗 **테스트 URL:** [https://school-attendance-test.firebaseapp.com/](https://school-attendance-test.firebaseapp.com/) (`admin`, `teacher1`, `teacher2` 등으로 로그인)  
🔗 **운영 URL:** [https://yukyoung-attendance-ac519.firebaseapp.com/](https://yukyoung-attendance-ac519.firebaseapp.com/)

---

## 프로젝트 개요

| 항목      | 내용                                      |
| ------- | --------------------------------------- |
| 개발 기간   | 2025. 07. 24 ~ 2025. 08. 11             |
| 개발 인원   | 1인                                      |
| 담당 업무   | 기획 · 디자인 · FE 개발 · BE 개발               |

---

## 기술 스택

| 분류          | 기술                                   |
| ----------- | ------------------------------------ |
| 언어 / 프레임워크  | TypeScript, React                    |
| 스타일         | Styled Components                    |
| 상태 관리       | TanStack Query, Zustand              |
| Backend     | Firebase (Firestore)                 |
| 배포          | Firebase Hosting, GitHub Actions     |
| 디자인         | Figma                                |

---

## 주요 구현 내용

### 1. 달력

- 다양한 색상으로 출석·결석·휴일 등 **현재 상태를 한눈에 확인**
- 달마다 변하는 주차 수에 따라 리스트 영역 높이를 동적으로 계산

### 2. 반별 분류 & 출석부

- 담당 반을 분류하여 각 상태를 **출석부에 요약**
- 요일별 출석 횟수를 숫자로 표시
- 관리자에게는 **오늘 출석한 학생 수**를 별도로 요약

### 3. 출석부 명단

- 색상으로 **학생과 강사를 구분**
- 메인 화면에서 선택한 반별로 명단 분류
- 모바일에서는 헤더 탭으로 전체 리스트를 넓게 조회

### 4. 휴일 등록 & 관리 기능

- 관리자가 주말 외 **휴일을 직접 등록·삭제**
- 학기, 반, 학생, 교사 CRUD
- 학기 단위 데이터 관리

### 5. 보안

- **20분 자동 로그아웃** (타이머 + 탭 복귀 시 만료 검사)
- 출석 변경 이력을 `action_logs` 컬렉션에 기록

---

## 아키텍처

### DB 구조 (Firestore)

Firebase NoSQL 특성상 JOIN 없이 **데이터 중복 저장** 구조로 설계하여 조회 효율을 높였습니다.

```
semester (학기)
├── class (반)
│   └── student (학생)
├── attendance (출석 일자)
│   └── student_attendance (학생별 출석 상태)
└── ──────────────────────

user (사용자)          holiday (휴일)
role / assigned_class  date / name

─────────────────────────

action_logs (액션 로그)
action / performedBy / timestamp
```

- **학기 단위 관리**: 학기를 최상위 단위로 두어 특정 학기만 조회, 불필요한 데이터 접근 최소화
- **계층 구조화**: `class → student → attendance → student_attendance`로 실제 조회 시 필요한 데이터만 탐색
- **휴일 관리**: 독립된 `holiday` 컬렉션으로 관리자 휴일 등록·삭제
- **액션 로그**: 변경 주체와 시점을 기록해 30일 이후에도 이력 추적 가능

### 환경 분리

`window.location.hostname`을 기준으로 prod/dev Firebase 인스턴스를 분기합니다. 동일 코드베이스에서 테스트·운영 DB를 독립적으로 관리합니다.

| 호스트                                     | Firebase 프로젝트  |
| ----------------------------------------- | --------------- |
| `localhost`, `school-attendance-test.*`   | dev (테스트)       |
| `yukyoung-attendance-ac519.*`             | prod (운영)       |

### TanStack Query 캐싱

Firebase는 요청 횟수에 따라 과금됩니다. 로그아웃 주기와 교사별 독립적인 데이터 조회 환경을 고려해, 기본 캐싱과 `staleTime` 설정으로 불필요한 재요청을 줄였습니다.

---

## 프로젝트 구조

```
src/
├── components/
│   ├── Calendar/       # 달력 UI
│   ├── Modal/          # 출석 모달, 휴일 버튼
│   └── Management/     # 관리자 설정 모달 (학기·반·학생·교사)
├── hooks/              # TanStack Query hooks, 인증, mutation
├── layout/             # Calendar, ChildList, Classes, Login 등
├── store/              # Zustand 전역 상태
└── utils/              # 날짜, 로그, Firestore fetch 유틸
```

---

## 실행 방법

```bash
# 의존성 설치
yarn

# 개발 서버 실행 (localhost → dev Firebase 연결)
yarn start

# 프로덕션 빌드
yarn build
```

---

## 기술적 의사결정

| 주제   | 선택                    | 이유                          |
| ---- | --------------------- | --------------------------- |
| DB   | Firebase Firestore    | 별도 서버 없이 빠른 구축, 실시간 데이터    |
| 캐싱   | TanStack Query        | Firebase 과금 구조상 요청 횟수 절감    |
| UI   | Styled Components     | 컴포넌트 단위 스타일 관리              |
| 상태   | Zustand               | UI·세션 등 경량 전역 상태            |
| 반응형  | 910px breakpoint      | 교사 모바일 출석 기록 환경             |

---

## 트러블슈팅

### NoSQL 설계
JOIN이 없는 NoSQL 특성상 출석 데이터에 학생 정보가 포함되지 않아 **데이터 중복 저장** 구조로 설계했습니다. 요일별 출석 횟수 집계는 `filter`와 `map`을 조합해 클라이언트에서 직접 계산합니다.

### 달력 높이 계산
달마다 유동적으로 변하는 주차 수에 따라 `calendarHeight` 값으로 리스트 영역 높이를 동적 계산했습니다. 렌더링 시 버벅임이 남아 있어, 한 줄 높이 고정 방식으로 개선할 예정입니다.

### 테스트/운영 서버 분리
실서비스 운영 중 개발용 DB가 필요해져 `hostname` 기준 Firebase 인스턴스 분기를 구현했습니다.
