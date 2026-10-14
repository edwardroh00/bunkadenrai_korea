# ZUTOMAYO · MY ROOM

프로젝트의 최종 방향은 **개인화된 즛토마요 덕질 홈페이지**입니다. 첫 버전은 본인용 굿즈 보유·사이즈, 관람한 공연, 라이브에서 들어본 곡과 개인 통계를 한곳에 모읍니다. 목표·집계 기준은 [프로젝트 메모리](./project_memory/README.md)에 기록했습니다.

## 개인 기록장 첫 버전 · 2026.10.15

[본인용 홈페이지 열기](https://zutomayo-my-room-1014.spunky-gnat-0005.chatgpt.site) · ChatGPT 로그인 필요 · 비공개 Sites 배포. GitHub 소스와 Sites 배포는 별도로 관리합니다.

- 홈: 현장·온라인 관람을 구분한 공연 수, 원곡 청취 달성률, 최다 청취곡, 도시 수, 위시리스트, 최근 관람 기록
- 라이브: 출처가 연결된 첫 카탈로그 12개 공연, 관람·부분 관람·들은 곡 체크, 좌석·감상 메모, 목록에 없는 공연 직접 추가
- 곡 도감: 원곡 71곡의 한글·일본어·영문 검색, 곡별 연주 횟수와 공연 수, 첫 청취 공연, 즐겨찾기
- 굿즈: 기존 도감 234개와 개인 굿즈 직접 등록, 보유·위시리스트·배송 중·지난 기록 구분, 수량·색상·사이즈·착용감 기록
- 사이즈: 공식 상품 스냅샷에서 추출한 56개 상품·202개 사이즈의 약 실측, 내 실측 우선 비교, 길이 차이 표시. 상품 근거 확인일은 2026.10.03
- 백업: MY ROOM JSON 백업·복원, 복원 전 자동 백업, 기존 나라 장바구니 가져오기. 개인 기록은 브라우저에 저장되며 클라우드 자동 동기화는 아직 없음

개인 기록의 저장 키는 `ztmy-my-room-profile-v1`, 기존 구매 기록 키는 그대로 보존합니다. 웹 주소·브라우저가 다르면 JSON으로 기록을 옮겨야 합니다. 테스트 기록은 별도 테스트 주소에서만 만들었으며 배포 파일에 포함하지 않습니다.

공통 자료는 `data/songs.json`, `data/lives.json`, `data/goods.json`, `data/size-charts.json`에 있습니다. 개인 입력은 공통 자료와 분리됩니다. 메들리는 구성곡별로 연결하고 반복 연주는 출처가 확인된 횟수만 반영합니다. 나라 ultra魂의 반복 횟수 차이는 원문 메모로 표시합니다.

`index.html`, `my-room.css`, `my-room.js`, `fan-model.js`가 새 개인 홈입니다. 기존 나라 가이드는 `nara.html`에서 열며 기존 `styles.css`, `app.js`, `planner.js`를 사용합니다.

Windows의 현재 실행 환경에는 npm과 bash가 없어 Node 검사·테스트를 직접 실행하고, Sites 공통 빌드 검증기와 Windows tar로 배포 패키지를 만듭니다. `scripts/prepare-my-room-site.mjs`는 명시된 공개 앱 파일만 Sites 하위 저장소로 복사합니다. `.openai/hosting.json`의 Site ID를 재사용하며 원본 GitHub 저장소와 별도로 배포합니다.

## 기존 나라 공연 가이드

즛토마요 **LEGACY ZOMBIE LABO「文禍伝雷」奈良・平城京** 공연의 비공식 한국어 안내 페이지입니다.

- 공연일: 2026년 10월 10일 / 11일
- 정보 확인 기준: 2026년 10월 3일
- 공식 출처: https://zutomayo.net/bunka-denrai/
- 축제 구역 출처: https://zutomayo.net/special/bunka-denrai/matsuri-area/

HTML / CSS / JavaScript로 작성한 정적 사이트입니다. 외부 라이브러리, 빌드 과정, 자체 서버 API 없이 GitHub Pages에서 동작합니다. 메인 삽화는 직접 제작한 SVG, 상품 사진과 현장 지도는 공식 출처의 공개 이미지 URL을 사용합니다. 외부 이미지 제공처에서 변경·차단하면 사진 표시가 영향을 받을 수 있습니다.

## 로컬 실행

Node.js가 있다면 다음 명령으로 실행합니다. 패키지 설치는 필요 없습니다.

```powershell
node scripts/serve.mjs
```

브라우저에서 http://127.0.0.1:4173 을 엽니다. ES 모듈과 JSON을 읽으므로 파일을 직접 여는 대신 로컬 서버 또는 GitHub Pages로 접속해야 모든 기능이 동작합니다.

## 기능

- 모바일 / 데스크톱 반응형 안내
- 참석일 선택, 공연 시작까지의 카운트다운
- 선택 날짜의 입장 / 개연 일정 `.ics` 다운로드
- 브라우저 로컬 저장소를 사용하는 준비물 체크리스트
- 교통, 현장 유의사항, 공식 정보 링크
- 굿즈 도감 234개: 색상별 실제 사진 갤러리, 품번·옵션·가격·구매 경로·회원 조건, 검색과 필터
- 장바구니: 온라인 선행·배송 / 방문수령 / 팝업 / 현장 4개 분류, 수량·실제 단가·옵션·주문일·수령일·메모·상태
- 구매 기록은 브라우저 저장, JSON 백업·추가 가져오기·삭제 되돌리기 지원. 실제 공식 주문을 실행하는 기능은 없습니다.
- 체험 9종과 PIA 집합 시간 199개, 사전 추첨·당일 참여권, 팝업 입장 예약 구분
- 양일 낮 무대, 공개 푸드 메뉴·가격, 두 종류의 스탬프 행사, 공원 지도

상품 합계는 세금 포함 엔화 기준이며 배송비·주문별 수수료는 제외합니다. 취소 기록은 합계에서 제외합니다. 같은 상품도 경로·옵션·주문일이 다른 기록은 독립적으로 보관합니다. 백업 가져오기는 기존 기록에 추가하고 동일 ID는 중복 추가하지 않습니다. 브라우저 데이터 삭제 시 기록도 사라지므로 백업을 보관하세요.

확인한 메일과 웹 출처, 가격 차이·개별 사진 미확인 품목은 [SOURCES.md](./SOURCES.md)에 기록했습니다. 개인 메일 주소, 티켓·결제·인증 정보는 프로젝트에 포함하지 않았습니다.

## 검증

```powershell
node --test tests/cart.test.mjs tests/fan.test.mjs
```

경로별 분리·합계, 백업 왕복, 잘못된 입력 거부, 앨범 경로별 가격, 한정 색상 경로·카탈로그 출처를 검증합니다. 브라우저에서는 저장 유지, 상태 수정, 삭제 되돌리기, 필터, 갤러리와 모바일 가로 넘침을 확인했습니다.

카운트다운은 방문자의 기기 시간을 사용하고, 공연 시각은 UTC+09:00으로 계산합니다. 사이트의 정보 확인일은 수동 갱신합니다. 공연 종료시각은 단정하지 않으며 캘린더에는 입장 / 개연 시점만 등록합니다. 준비물 체크리스트는 팬 가이드의 추천이고, 사용자 간 동기화되지는 않습니다.

## GitHub에 푸시

GitHub에서 빈 저장소를 만들고 실제 저장소 URL로 아래 `OWNER/REPOSITORY`를 바꿉니다. 초기 README나 라이선스를 생성한 기존 저장소에는 바로 실행하지 말고 먼저 이력을 확인하세요.

```powershell
git add .
git commit -m "Add Korean ZUTOMAYO Nara concert guide"
git branch -M main
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

이미 `origin`이 있으면 `git remote add`는 생략합니다. 푸시에는 이 컴퓨터의 GitHub 인증이 필요합니다. 공개 저장소에는 프로젝트 파일만 올리고 계정 토큰, 티켓, 여권, 개인 일정은 넣지 마세요.

## GitHub Pages 공개

저장소 **Settings → Pages → Build and deployment**에서 아래와 같이 설정합니다.

1. Source: **Deploy from a branch**
2. Branch: **main**, 폴더: **/(root)**
3. **Save**

공개 주소는 일반적으로 `https://OWNER.github.io/REPOSITORY/`입니다. 상대 경로를 사용하므로 저장소 이름에 따른 하위 경로에서도 동작합니다. GitHub Pages 공개 설정을 활성화하기 전까지 푸시만으로 웹사이트가 공개되지는 않습니다.

GitHub 공식 문서: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 수정할 곳

- `index.html`: 한국어 내용, 출처, 정보 확인일, SVG 삽화
- `styles.css`: 색상, 레이아웃, 모바일 스타일
- `app.js`: 공연 날짜, 캘린더, 카운트다운, 체크리스트
- `planner.js`: 탭·굿즈·장바구니·체험·무대 화면
- `cart-model.js`: 기록 검증, 백업 형식, 경로별 합계
- `festival-data.js`: 한국어 체험·낮 무대·식음료 데이터
- `data/goods.json`: 상품별 공식 사진·가격·채널·조건·출처
- `data/activity-slots.json`: 날짜별 PIA 집합 시간
- `assets/favicon.svg`: 브라우저 아이콘

공식 안내의 변경을 확인한 뒤 내용과 확인일을 함께 갱신하세요. 본 페이지는 공식 사이트를 대체하지 않습니다.
