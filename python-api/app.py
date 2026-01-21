from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import io
import os

app = Flask(__name__)
# CORS 설정: 모든 origin 허용
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'pdf-extractor-api'}), 200

@app.route('/extract-pdf', methods=['POST'])
def extract_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': '파일이 제공되지 않았습니다.'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'PDF 파일만 지원됩니다.'}), 400
        
        # PDF 파일 읽기
        pdf_bytes = file.read()
        
        # pdfplumber로 텍스트 추출
        text_content = []
        pages_info = []
        
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            total_pages = len(pdf.pages)
            
            for page_num, page in enumerate(pdf.pages, start=1):
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
                pages_info.append({
                    'page': page_num,
                    'width': page.width,
                    'height': page.height
                })
        
        # 모든 페이지의 텍스트를 합치기
        full_text = '\n\n'.join(text_content)
        
        if not full_text or not full_text.strip():
            return jsonify({
                'error': 'PDF에서 텍스트를 추출할 수 없습니다. 이미지로만 구성된 PDF일 수 있습니다.'
            }), 400
        
        return jsonify({
            'text': full_text,
            'pages': total_pages,
            'pages_info': pages_info,
            'total_chars': len(full_text)
        })
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f'PDF 추출 오류: {str(e)}')
        print(f'Traceback: {error_trace}')
        return jsonify({
            'error': f'PDF 텍스트 추출 중 오류가 발생했습니다: {str(e)}',
            'details': str(e) if len(str(e)) < 200 else str(e)[:200]
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

