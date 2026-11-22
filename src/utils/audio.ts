/**
 * Gemini AI 더빙 스튜디오 - 오디오 처리 유틸리티 함수
 */

/**
 * Base64 인코딩된 문자열을 Blob 객체로 변환합니다.
 * @param base64 Base64 오디오 데이터
 * @param mimeType MIME 타입 (예: 'audio/mp3', 'audio/wav')
 * @returns Blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Base64 데이터를 사용자의 기기로 즉시 다운로드합니다.
 * @param base64 Base64 오디오 데이터
 * @param filename 저장될 파일명 (확장자 포함)
 * @param mimeType MIME 타입
 */
export function downloadBase64Audio(
  base64: string,
  filename: string,
  mimeType: string = "audio/mp3"
): void {
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 초 단위 숫자를 '00:00' 포맷으로 변환합니다.
 * @param seconds 초
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * 텍스트와 성우 이름을 바탕으로 안전하고 직관적인 파일명을 생성합니다.
 * @param text 대본 원문
 * @param voiceName 성우명
 * @param extension 확장자 (예: 'mp3', 'wav')
 */
export function generateSafeFilename(
  text: string,
  voiceName: string,
  extension: "mp3" | "wav" = "mp3"
): string {
  // 특수문자 제거 후 첫 15글자 추출
  const sanitizedText = text
    .trim()
    .replace(/[\n\r]/g, " ")
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, "")
    .slice(0, 15)
    .trim()
    .replace(/\s+/g, "_") || "더빙음성";

  const dateStr = new Date()
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");

  return `GeminiTTS_${voiceName}_${sanitizedText}_${dateStr}.${extension}`;
}
