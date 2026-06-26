# ゆるキャン△ SEASON3 Card Tracker

바이스 슈발츠 유루캠△ SEASON3 카드 컬렉션 트래커

**🌐 [https://seungwonmj.github.io/Laid_Back_Camp-Card_List_Tracker/](https://seungwonmj.github.io/Laid_Back_Camp-Card_List_Tracker/)**

> 개인 팬 프로젝트입니다. 상업적 목적 없이 순수 팬심으로 만들었습니다.

## 현황

카드 기본 정보 (이름, 레어도, 종류, 레벨, 파워, 코스트)는 입력 완료되었습니다.
소울, 트리거, 효과 텍스트는 순차적으로 업데이트 예정입니다.

## 변경 이력

- **2026-06-26** — PR 카드 5종 추가, PR 덱 탭 및 레어리티 필터 추가, 여분 수량 표시 개선
- **2026-04-29** — 페이지 타이틀 수정
- **2026-04-23** — 모바일 카드 모달 닫기 버튼 추가 및 레이아웃 개선
- **2026-04-14** — 최초 배포 (덱 모드 다국어, WS 아이콘, 여분 필터, 데이터 내보내기/가져오기)

## 라이선스

앱 소스 코드는 [MIT License](LICENSE) © 2026 [SeungwonMJ](https://github.com/SeungwonMJ)

카드 데이터 및 이미지는 Bushiroad 소유입니다. ゆるキャン△ © あfろ / Bushiroad

## 실행 방법

### 1. 사전 준비
- [Node.js](https://nodejs.org/) 설치 (v16 이상)

### 2. 의존성 설치
```bash
cd yurucamp-tracker
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```
브라우저에서 `http://localhost:3000` 자동으로 열립니다.

### 4. 빌드 (배포용)
```bash
npm run build
```

## 프로젝트 구조

```
yurucamp-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # 메인 컴포넌트
│   ├── cards.json       # 카드 데이터 (부스터팩 228종 + 트라이얼덱 42종 + PR 5종)
│   └── index.js         # 진입점
├── package.json
└── README.md
```

## 기능

**카드 관리**
- 카드 수량 관리 (0~N장)
- 카드 이미지 자동 로드 (ws-tcg.com)
- 카드 이미지 직접 업로드 또는 URL 입력으로 교체 가능
- 카드 이름 직접 편집 (언어별)
- localStorage 자동 저장 (브라우저 종료 후에도 유지)

**필터 / 뷰**
- 덱 모드 전환: 전체 / 부스터팩 / 트라이얼덱 / PR 카드
- 레어도별 필터 (다중 선택 가능)
- 수집 / 미수집 / 여분 / 전체 필터
- 카드 번호 및 이름 검색
- 그리드 / 리스트 뷰 전환

**진행도**
- 선택한 덱 모드 기준 수집 진행도 표시 (카운터 + 퍼센트 바)
- 레어도별 수집 현황 표시

**데이터**
- localStorage 자동 저장 (브라우저 종료 후에도 유지)
- 컬렉션 데이터 JSON 내보내기 / 가져오기 (백업 및 기기 간 이동)

**UI**
- 다크 / 라이트 모드 전환
- 일본어 / 영어 / 한국어 전환
- 카드 스탯에 공식 WS 아이콘 표시 (사이드, 색, 소울, 트리거)
