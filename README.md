# PR_Ati.Web

ATI 공식 웹사이트 제작 프로젝트입니다.
본 프로젝트는 ATI(Advanced Technology Inc.)의 기업 소개, 핵심 기술, 제품 및 적용 분야, ESG, 회사 소식, 문의 정보를 효과적으로 전달하기 위한 웹사이트 구축을 목적으로 합니다.

## 📌 Project Overview

`PR_Ati.Web`은 ATI의 브랜드 아이덴티티와 기술 경쟁력을 웹 환경에서 일관성 있게 표현하기 위한 정적 웹사이트 프로젝트입니다.

반도체 및 PCB 산업을 위한 검사·계측 솔루션 기업으로서 ATI의 전문성, 글로벌 네트워크, 제품 라인업, 기술 역량을 사용자에게 직관적으로 전달하는 것을 목표로 합니다.

## 🎯 Objectives

* ATI 기업 소개 및 브랜드 이미지 강화
* 반도체·PCB 검사 및 계측 솔루션 정보 제공
* 제품 및 적용 분야를 사용자가 쉽게 이해할 수 있도록 구성
* 글로벌 고객 및 파트너 대상의 신뢰도 높은 웹사이트 구축
* 유지보수와 확장이 용이한 구조 설계

## 🧩 Main Contents

웹사이트는 다음과 같은 주요 콘텐츠로 구성됩니다.

### 1. Home

ATI의 핵심 메시지와 주요 비주얼을 통해 기업의 첫인상을 전달합니다.

### 2. About

ATI의 회사 소개, 연혁, 비전, 미션, 핵심 가치 등을 소개합니다.

### 3. Capabilities

ATI가 보유한 핵심 기술 역량을 설명합니다.

* Optics
* Automation
* Inspection
* Metrology
* Software & AI

### 4. Products & Applications

ATI의 제품군과 적용 분야를 소개합니다.

* Wafer
* Reticle
* Package
* PCB

### 5. ESG

지속가능경영을 위한 ATI의 활동과 방향성을 소개합니다.

* Environmental
* Social
* Governance

### 6. News

ATI의 새로운 소식, 전시회, 기술 업데이트 등 주요 뉴스를 제공합니다.

### 7. Contact

고객 및 파트너가 ATI에 문의할 수 있는 정보를 제공합니다.

## 🛠 Tech Stack

본 프로젝트는 기본적인 웹 표준 기술을 기반으로 제작되었습니다.

* HTML5
* CSS3
* JavaScript
* Responsive Web Design
* Git / GitHub

## 📁 Folder Structure

```bash
PR_Ati.Web
├── index.html
├── about.html
├── products.html
├── esg.html
├── news.html
├── contact.html
├── assets
│   ├── images
│   ├── videos
│   ├── icons
│   └── fonts
├── css
│   └── style.css
├── js
│   └── main.js
└── README.md
```

> 실제 폴더 구조는 프로젝트 진행 상황에 따라 변경될 수 있습니다.

## 💡 Design Direction

ATI 웹사이트는 정밀함, 신뢰감, 기술력, 글로벌 이미지를 중심으로 설계되었습니다.

전체적인 디자인은 깔끔하고 전문적인 기업 웹사이트 톤을 유지하며, 반도체·PCB 산업의 고도화된 기술 이미지를 시각적으로 표현하는 데 중점을 두었습니다.

### Design Keywords

* Precision
* Technology
* Reliability
* Innovation
* Global
* Semiconductor
* Inspection & Metrology

## 📱 Responsive Design

본 웹사이트는 다양한 디바이스 환경에서 원활하게 확인할 수 있도록 반응형 웹 구조를 고려하여 제작되었습니다.

지원 대상 화면은 다음과 같습니다.

* Desktop
* Laptop
* Tablet
* Mobile

## 🔧 Development Notes

개발 및 유지보수 시 아래 사항을 고려합니다.

* 공통 스타일은 재사용 가능한 형태로 관리합니다.
* 이미지 및 영상 리소스는 용량 최적화를 고려합니다.
* 텍스트 콘텐츠는 추후 다국어 확장을 고려하여 구조화합니다.
* 각 페이지의 섹션 구조는 유지보수와 수정이 쉽도록 명확하게 구분합니다.
* SEO를 고려하여 페이지별 title, description, heading 구조를 관리합니다.

## 🚀 Getting Started

프로젝트를 로컬 환경에서 확인하려면 저장소를 클론한 뒤 `index.html` 파일을 브라우저에서 실행합니다.

```bash
git clone https://github.com/{organization}/PR_Ati.Web.git
```

```bash
cd PR_Ati.Web
```

이후 `index.html` 파일을 브라우저에서 열어 확인할 수 있습니다.

## 📌 Naming Convention

프로젝트 내 클래스명과 파일명은 가독성과 유지보수를 고려하여 작성합니다.

### CSS Class

```css
.section-name
.section-name__element
.section-name--modifier
```

예시:

```css
hero-section
hero-section__title
hero-section__button
```

### File Naming

파일명은 소문자와 하이픈을 사용합니다.

```bash
about-overview.jpg
product-card-icon.svg
main-visual.mp4
```

## ✅ Commit Message Guide

커밋 메시지는 변경 내용을 명확하게 파악할 수 있도록 작성합니다.

예시:

```bash
feat: 메인 비주얼 섹션 추가
fix: 모바일 메뉴 레이아웃 수정
style: About 페이지 간격 조정
docs: README 내용 업데이트
refactor: 공통 버튼 스타일 정리
```

## 📄 License

본 프로젝트의 모든 콘텐츠, 디자인, 이미지 및 소스코드는 ATI 내부 자산으로 관리됩니다.
무단 복제, 배포, 수정 및 외부 사용을 금지합니다.

## 👥 Maintainer

ATI Web Project Team
