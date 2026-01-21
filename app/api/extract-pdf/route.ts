import { NextRequest, NextResponse } from 'next/server';

// Python API 서버 URL (환경 변수로 설정 가능)
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'PDF 파일만 지원됩니다.' },
        { status: 400 }
      );
    }

    // Python API로 파일 전송
    const pythonFormData = new FormData();
    pythonFormData.append('file', file);

    const response = await fetch(`${PYTHON_API_URL}/extract-pdf`, {
      method: 'POST',
      body: pythonFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'PDF 텍스트 추출에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      text: data.text,
      pages: data.pages,
      total_chars: data.total_chars,
      pages_info: data.pages_info,
    });
  } catch (error) {
    console.error('PDF 추출 오류:', error);
    console.error('Python API URL:', PYTHON_API_URL);
    
    // Python API 서버에 연결할 수 없는 경우
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      const errorMessage = PYTHON_API_URL === 'http://localhost:5000' 
        ? 'Python API 서버 URL이 설정되지 않았습니다. Vercel 환경 변수 PYTHON_API_URL을 설정해주세요.'
        : `PDF 추출 서버에 연결할 수 없습니다. (${PYTHON_API_URL}) Python API 서버가 실행 중인지 확인해주세요.`;
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: `PDF 텍스트 추출 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}

