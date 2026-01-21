import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

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

    // File을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF 텍스트 추출
    const data = await pdf(buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'PDF에서 텍스트를 추출할 수 없습니다. 이미지로만 구성된 PDF일 수 있습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: text,
      pages: data.numpages,
      info: data.info,
    });
  } catch (error) {
    console.error('PDF 추출 오류:', error);
    return NextResponse.json(
      { error: 'PDF 텍스트 추출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

