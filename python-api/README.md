# Python PDF 추출 API

pdfplumber를 사용하여 PDF에서 텍스트를 추출하는 Flask API 서버입니다.

## 설치

```bash
pip install -r requirements.txt
```

## 실행

```bash
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### POST /extract-pdf

PDF 파일을 업로드하여 텍스트를 추출합니다.

**요청:**
- Content-Type: multipart/form-data
- 파일 필드명: `file`

**응답:**
```json
{
  "text": "추출된 텍스트",
  "pages": 5,
  "pages_info": [...],
  "total_chars": 1234
}
```

