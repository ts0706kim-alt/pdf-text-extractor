'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('PDF 파일만 업로드 가능합니다.');
        setFile(null);
      }
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setExtractedText(data.text || '텍스트를 추출할 수 없습니다.');
      } else {
        setError(data.error || '텍스트 추출에 실패했습니다.');
      }
    } catch (err) {
      setError('텍스트 추출 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.pdf', '')}_extracted.txt` : 'extracted.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative">
      {/* 저작권 문구 */}
      <div className="absolute top-4 right-4 text-xs text-gray-400">
        © 2026 Kevin. This program is the property of Kevin.
      </div>
      
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-4xl font-bold text-white mb-6">
          PDFTextExtractor
        </h1>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <div className="mb-4">
            <label htmlFor="pdf-file" className="block text-sm font-medium text-gray-300 mb-2">
              PDF 파일 선택
            </label>
            <input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-400">
                선택된 파일: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            onClick={handleExtract}
            disabled={!file || loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '텍스트 추출 중...' : '텍스트 추출하기'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {extractedText && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">추출된 텍스트</h2>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                텍스트 다운로드
              </button>
            </div>
            <div className="border border-gray-600 rounded p-4 bg-gray-900 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono">
                {extractedText}
              </pre>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              총 {extractedText.length}자 추출됨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

