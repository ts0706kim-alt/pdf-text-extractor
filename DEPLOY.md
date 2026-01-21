# 배포 가이드

## GitHub에 푸시하기

1. GitHub에서 새 저장소 생성:
   - https://github.com/new 접속
   - Repository name: `pdf-text-extractor` (또는 원하는 이름)
   - Public 선택
   - "Initialize this repository with a README" 체크 해제
   - Create repository 클릭

2. 로컬 저장소를 GitHub에 연결:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pdf-text-extractor.git
git branch -M main
git push -u origin main
```

## Vercel에 배포하기

1. Vercel 계정 생성/로그인:
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. 새 프로젝트 추가:
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - Framework Preset: Next.js 자동 감지
   - "Deploy" 클릭

3. 배포 완료 후:
   - Vercel이 자동으로 배포 URL 제공
   - 예: https://pdf-text-extractor.vercel.app

## 수동 배포 (GitHub CLI 사용)

GitHub CLI가 설치되어 있다면:

```bash
gh repo create pdf-text-extractor --public --source=. --remote=origin --push
```

## 환경 변수

현재는 환경 변수가 필요하지 않습니다.

