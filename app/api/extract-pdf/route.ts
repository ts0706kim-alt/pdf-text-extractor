import { NextRequest, NextResponse } from 'next/server';

// Python API 서버 URL (환경 변수로 설정 가능)
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000';

// 런타임 설정 (Vercel에서 API 라우트가 제대로 작동하도록)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET 메서드 추가 (헬스 체크용)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    pythonApiUrl: PYTHON_API_URL ? '설정됨' : '설정되지 않음',
    message: 'PDF Extract API is running'
  });
}

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

    // 환경 변수 확인
    if (!process.env.PYTHON_API_URL) {
      console.warn('PYTHON_API_URL 환경 변수가 설정되지 않았습니다. 기본값 사용:', PYTHON_API_URL);
    }

    const apiUrl = `${PYTHON_API_URL}/extract-pdf`;
    console.log('Calling Python API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: pythonFormData,
    });

    // 응답 타입 확인
    const contentType = response.headers.get('content-type');
    console.log('Response status:', response.status);
    console.log('Response content-type:', contentType);

    if (!response.ok) {
      let errorMessage = 'PDF 텍스트 추출에 실패했습니다.';
      
      // JSON 응답인지 확인
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = `서버 오류 (${response.status}): ${text.substring(0, 200)}`;
        }
      } else {
        // HTML 응답인 경우
        const text = await response.text();
        errorMessage = `서버 오류 (${response.status}): ${text.substring(0, 200)}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // JSON 응답인지 확인
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return NextResponse.json(
        { error: `예상치 못한 응답 형식입니다. 서버가 JSON을 반환하지 않습니다: ${text.substring(0, 200)}` },
        { status: 500 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      return NextResponse.json(
        { error: `JSON 파싱 오류: ${text.substring(0, 200)}` },
        { status: 500 }
      );
    }

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

