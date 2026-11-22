/**
 * Gemini AI 더빙 스튜디오 - 데이터 타입 정의
 */

// 성우 정보 인터페이스
export interface Voice {
  id: string; // Gemini voiceName ('Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr')
  nameKo: string; // 한국어 성우 이름 (예: '코레')
  gender: 'female' | 'male'; // 성별
  toneKo: string; // 음색 특징
  description: string; // 상세 설명
  recommendedFor: string[]; // 추천 장르 태그
  badgeColor: string; // 배지 UI 색상
  avatarColor: string; // 아바타 배경색
}

// 감정 및 연기 스타일 인터페이스
export interface EmotionStyle {
  id: string; // 감정 ID
  labelKo: string; // 한국어 감정 레이블
  subLabel: string; // 짧은 영문/보조 설명
  promptKeyword: string; // Gemini 프롬프트에 적용할 연출 지시어
  iconName: string; // 아이콘 이름
  colorClass: string; // 선택 시 테두리/하이라이트 스타일
  bgClass: string; // 배경 스타일
}

// 생성된 더빙 오디오 결과
export interface DubbingResult {
  id: string;
  text: string;
  voiceName: string;
  voiceLabelKo: string;
  emotionId: string;
  emotionLabelKo: string;
  customDirection?: string;
  mp3Base64: string;
  wavBase64: string;
  isMp3: boolean;
  durationSeconds: number;
  sampleRate: number;
  createdAt: string;
}

// API 요청 파라미터
export interface TtsGenerateRequest {
  text: string;
  voiceName: string;
  emotionPrompt: string;
  customDirection?: string;
}

// API 응답 결과
export interface TtsGenerateResponse {
  success: boolean;
  mp3Base64: string;
  wavBase64: string;
  isMp3: boolean;
  durationSeconds: number;
  sampleRate: number;
  voiceName: string;
  emotionPrompt: string;
  text: string;
  createdAt: string;
  error?: string;
}
