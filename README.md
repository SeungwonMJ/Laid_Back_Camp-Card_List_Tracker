# ゆるキャン△ SEASON3 Card Tracker

바이스 슈발츠 유루캠△ SEASON3 카드 컬렉션 트래커

> 개인 팬 프로젝트입니다. 상업적 목적 없이 순수 팬심으로 만들었습니다.

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
│   ├── cards.json       # 카드 데이터 (부스터팩 228종 + 트라이얼덱 42종)
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
- 덱 모드 전환: 전체 / 부스터팩 / 트라이얼덱
- 레어도별 필터 (다중 선택 가능)
- 수집 / 미수집 / 전체 필터
- 카드 번호 및 이름 검색
- 그리드 / 리스트 뷰 전환

**진행도**
- 선택한 덱 모드 기준 수집 진행도 표시 (카운터 + 퍼센트 바)
- 레어도별 수집 현황 표시

**UI**
- 다크 / 라이트 모드 전환
- 일본어 / 영어 / 한국어 전환
