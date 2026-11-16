# 자취방 3D — 안드로이드 앱(APK) 만들기

이 폴더는 **자취방 3D**를 안드로이드 앱으로 감싼 Capacitor 프로젝트예요.
컴퓨터에 아무것도 설치하지 않고 **GitHub이 대신 APK를 만들어 주는 방법(A)**을 먼저 추천해요.
사지방처럼 프로그램을 설치할 수 없는 컴퓨터에서도 웹 브라우저만 있으면 돼요.

---

## A. GitHub으로 자동 빌드 (추천, 설치 없음)

### 1) 저장소 만들기
1. https://github.com 에 로그인 (계정이 없으면 가입)
2. 오른쪽 위 **＋ → New repository**
3. 이름: `jachwi3d-app` 정도로 입력 → **Private** 선택 → **Create repository**

### 2) 파일 올리기
1. 만든 저장소 화면에서 **uploading an existing file** 링크를 누름
2. 압축을 푼 폴더 안의 파일과 폴더(`src`, `scripts`, `assets`, `package.json`, `capacitor.config.json`, `README.md`, `.gitignore`)를 끌어다 놓기
3. 아래 **Commit changes** 누르기

> ⚠️ 이름이 점(.)으로 시작하는 `.github` 폴더는 브라우저가 빼먹는 경우가 많아요. 3)에서 따로 만들어요.

### 3) 자동 빌드 파일 만들기
1. 저장소 화면에서 **Add file → Create new file**
2. 파일 이름 칸에 정확히 `.github/workflows/android.yml` 입력 (슬래시를 치면 폴더가 생겨요)
3. 이 폴더의 `.github/workflows/android.yml` 내용을 전부 복사해서 붙여넣기
4. **Commit changes**

### 4) 빌드 기다리기 (약 5~8분)
- 저장소 위쪽 **Actions** 탭 → **안드로이드 APK 만들기**가 노란 점(진행 중) → 초록 체크(완료)
- 빨간 X가 뜨면 그 실행을 눌러 어느 단계에서 멈췄는지 확인해 주세요.
- 다시 만들고 싶으면 Actions → 왼쪽 **안드로이드 APK 만들기** → **Run workflow**

### 5) 폰에 설치
1. 폰 브라우저로 저장소의 **Releases**(오른쪽 칸, 또는 주소 끝에 `/releases`) 열기
   - Private 저장소면 폰 브라우저에서도 GitHub 로그인이 필요해요.
2. 맨 위 `자취방 3D 1.0.N` → **jachwi3d-1.0.N.apk** 누르기 → 다운로드
3. 설치할 때 “출처를 알 수 없는 앱” 경고가 나오면 **설정 → 이 출처 허용** 후 설치
4. 새 버전을 만들면 번호가 올라가서, 그대로 설치하면 **덮어쓰기(저장한 방·매물 유지)** 돼요.

---

## B. 내 컴퓨터에서 빌드 (Android Studio가 있을 때)

필요한 것: Node.js 22 이상, Android Studio(최신), JDK 21(Android Studio에 포함)

```bash
npm install
npm run build:web          # src → www (three.js·지도 라이브러리를 앱 안에 넣음)
npx cap add android        # 처음 한 번만
npx capacitor-assets generate --android
npm run android:patch      # 위치 권한·버전
npx cap sync android
npx cap open android       # Android Studio에서 ▶ Run (폰을 USB로 연결)
```

앱 화면(`src/index.html`)을 고친 뒤에는 `npm run android:sync` 후 다시 실행하면 돼요.

---

## 앱에서 달라지는 점 (미리보기 화면과 비교)

| 기능 | 미리보기(claude.ai) | 앱(APK) |
|---|---|---|
| 3D 방·가구·예산 | ✅ | ✅ (라이브러리가 앱 안에 있어 인터넷 없이도 3D가 떠요) |
| 집 찾기 지도 | 간이 지도(내장 역·대학) | **실제 지도**: 지구본, 3D 건물, 위성 사진 |
| 주소 검색 | 역·대학·도시 이름만 | 주소·동 이름까지 (OpenStreetMap) |
| 내 위치 | ❌ | ✅ (처음에 위치 권한 허용) |
| 매물·쇼핑 링크 | 새 창 | 폰 기본 브라우저/앱으로 열림 |
| 뒤로가기 버튼 | - | 창 닫기 → 선택 해제 → 시트 접기 → 앱 종료 |

- 지도·위성 사진·주소 검색은 인터넷이 필요해요.
- 저장한 방·매물은 폰 안(앱 저장공간)에 저장돼요. 앱을 지우면 같이 지워져요.
- 이 APK는 **개인 설치용(디버그 서명)**이에요. 플레이스토어에 올리려면 따로 서명 키를 만들어야 해요.

## 폴더 구성

```
src/index.html                 앱 화면 전체 (claude.ai 미리보기와 같은 파일)
scripts/build-web.mjs          www/ 만들기 + 라이브러리 내장
scripts/patch-android.mjs      위치 권한, 버전 번호
assets/                        앱 아이콘·시작 화면 원본
capacitor.config.json          앱 이름·ID (com.jachwi3d.app)
.github/workflows/android.yml  GitHub 자동 빌드
```
