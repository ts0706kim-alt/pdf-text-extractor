# 배포 가이드

## 전체 배포 구조

이 프로젝트는 두 부분으로 구성됩니다:
1. **Python Flask API 서버** (pdfplumber 사용)
2. **Next.js 프론트엔드** (Vercel 배포)

## 1단계: Python API 서버 배포

### 옵션 A: Railway 배포 (추천)

1. https://railway.app 접속 및 GitHub 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. `pdf-text-extractor` 저장소 선택
5. Root Directory를 `python-api`로 설정
6. Start Command: `python app.py`
7. Port: `5000` (자동 감지)
8. 환경 변수 추가:
   - `PORT=5000`
9. 배포 완료 후 제공되는 URL 복사 (예: `https://pdf-api-production.up.railway.app`)

### 옵션 B: Render 배포

1. https://render.com 접속 및 GitHub 로그인
2. "New +" → "Web Service" 클릭
3. 저장소 연결: `ts0706kim-alt/pdf-text-extractor`
4. 설정:
   - Name: `pdf-text-extractor-api`
   - Root Directory: `python-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
5. 배포 완료 후 제공되는 URL 복사

## 2단계: Next.js 프론트엔드 배포 (Vercel)

1. https://vercel.com 접속 및 GitHub 로그인
2. "Add New Project" 클릭
3. 저장소 선택: `ts0706kim-alt/pdf-text-extractor`
4. Framework Preset: Next.js (자동 감지)
5. **환경 변수 추가**:
   - Key: `PYTHON_API_URL`
   - Value: 1단계에서 배포한 Python API URL (예: `https://pdf-api-production.up.railway.app`)
6. "Deploy" 클릭
7. 배포 완료 후 제공되는 URL 확인 (예: `https://pdf-text-extractor.vercel.app`)

## 3단계: CORS 설정 확인

Python API 서버의 `app.py`에서 CORS가 이미 설정되어 있습니다:
```python
CORS(app)
```

이 설정으로 모든 도메인에서 접근 가능합니다.

## 배포 후 확인사항

1. Vercel 배포 URL 접속
2. PDF 파일 업로드 테스트
3. 텍스트 추출이 정상 작동하는지 확인

## 문제 해결

### Python API에 연결할 수 없는 경우
- Python API 서버가 실행 중인지 확인
- 환경 변수 `PYTHON_API_URL`이 올바르게 설정되었는지 확인
- CORS 설정 확인

### 배포 URL 확인
- Railway: Dashboard → Service → Settings → Domains
- Render: Dashboard → Service → Settings → Custom Domain
- Vercel: Dashboard → Project → Settings → Domains

