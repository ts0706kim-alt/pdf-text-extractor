# PDFTextExtractor

PDF 파일에서 텍스트를 추출하는 웹 애플리케이션입니다. **pdfplumber**를 사용하여 정확한 텍스트 추출을 제공합니다.

## 기능

- PDF 파일 업로드
- pdfplumber를 사용한 정확한 텍스트 추출
- 추출된 텍스트 확인 및 다운로드
- 다크 테마 UI

## 기술 스택

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Python Flask
- pdfplumber

## 설치 방법

### 1. Node.js 의존성 설치

```bash
npm install
```

### 2. Python 의존성 설치

```bash
cd python-api
pip install -r requirements.txt
```

## 실행 방법

### 1. Python API 서버 실행

터미널 1:
```bash
cd python-api
python app.py
```

Python API 서버가 `http://localhost:5000`에서 실행됩니다.

### 2. Next.js 개발 서버 실행

터미널 2:
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 사용 방법

1. Python API 서버가 실행 중인지 확인합니다.
2. "PDF 파일 선택" 버튼을 클릭하여 PDF 파일을 선택합니다.
3. "텍스트 추출하기" 버튼을 클릭합니다.
4. 추출된 텍스트가 화면에 표시됩니다.
5. "텍스트 다운로드" 버튼을 클릭하여 텍스트 파일로 저장할 수 있습니다.

## 환경 변수

Python API 서버 URL을 변경하려면 `.env.local` 파일을 생성하세요:

```
PYTHON_API_URL=http://localhost:5000
```

## 배포

### Python API 서버 배포

Python API 서버는 다음 플랫폼에 배포할 수 있습니다:
- Heroku
- Railway
- Render
- PythonAnywhere
- AWS Lambda (서버리스)

배포 후 `.env.local` 파일에 배포된 URL을 설정하세요.

### Next.js 배포

Vercel에 배포할 수 있습니다. 단, Python API 서버를 별도로 배포해야 합니다.

## 라이선스

© 2026 Kevin. This program is the property of Kevin.
