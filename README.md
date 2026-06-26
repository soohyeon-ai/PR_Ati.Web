# ATI - Advanced Technology Inc. Website

반도체 검사 및 계측 장비 전문 기업 **ATI (Advanced Technology Inc.)** 의 공식 웹사이트입니다.

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript
- 별도 빌드 도구 없이 정적 파일로 구성
- 다국어 지원 (한국어 / English)

## 폴더 구조

```
PR_Ati.Web/
├── index.html              ← 메인 페이지 (진입점)
├── about.html              ← 회사 소개
├── contact.html            ← 문의하기
├── faq.html                ← 자주 묻는 질문
├── news.html               ← 뉴스
├── news-article.html       ← 뉴스 상세
├── services.html           ← 서비스
├── solutions-ai.html       ← AI 솔루션
├── products-*.html         ← 제품 목록 (Wafer / Reticle / Package / PCB / Semiconductor)
├── product-*.html          ← 제품 상세 페이지
├── css/                    ← 스타일시트
│   ├── style.css           ← 공통 스타일
│   ├── controls.css        ← UI 컨트롤 스타일
│   ├── responsive.css      ← 반응형
│   ├── products.css        ← 제품 페이지
│   └── ...                 ← 페이지별 스타일
├── js/                     ← 자바스크립트
│   ├── main.js             ← 메인 스크립트
│   └── controls/           ← 기능별 모듈
│       ├── i18n.js         ← 다국어 처리
│       ├── navigation.js   ← 네비게이션
│       └── ...
└── assets/
    ├── images/             ← 이미지 리소스
    └── videos/             ← 비디오 리소스
```

## GitHub Pages 배포 방법

### 1. GitHub 저장소 생성 및 Push

```bash
# 저장소 초기화 (이미 git init 되어 있다면 생략)
git init

# 모든 파일 스테이징
git add .

# 커밋
git commit -m "Initial commit: ATI website for GitHub Pages deployment"

# GitHub 원격 저장소 연결 (본인의 저장소 URL로 변경)
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git

# push
git push -u origin main
```

### 2. GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Pages** 클릭
4. **Source** 항목에서:
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 선택
5. **Save** 클릭

### 3. 접속

배포 완료 후 (보통 1~2분 소요) 아래 형식의 URL로 접속할 수 있습니다:

```
https://<USERNAME>.github.io/<REPO_NAME>/
```

예시:
```
https://mycompany.github.io/ati-website/
```

## 다국어 전환

- 페이지 하단 푸터의 **KR / EN** 드롭다운으로 언어를 전환할 수 있습니다.
- 선택한 언어는 `localStorage`에 저장되어 새로고침 후에도 유지됩니다.

## 라이선스

© Copyright 2018 - 2026 | Advanced Technology Inc. | All Rights Reserved
