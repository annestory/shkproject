/**
 * Gemini AI 더빙 스튜디오 - 성우 및 감정 프리셋 데이터
 */

import { Voice, EmotionStyle } from "../types";

// Gemini 지원 사전 제작 성우 5인 목록
export const VOICE_PRESETS: Voice[] = [
  {
    id: "Kore",
    nameKo: "코레 (Kore)",
    gender: "female",
    toneKo: "맑고 단정하며 다정한 여성 음성",
    description: "정확한 딕션과 부드러운 톤으로 오디오북, 낭독, 팟캐스트 및 서비스 안내에 가장 이상적인 성우입니다.",
    recommendedFor: ["오디오북", "안내 방송", "다큐멘터리", "교육 콘텐츠"],
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    avatarColor: "from-emerald-400 to-teal-600",
  },
  {
    id: "Puck",
    nameKo: "퍽 (Puck)",
    gender: "male",
    toneKo: "생기 넘치고 재치 있는 남성 음성",
    description: "발랄하고 친근한 톤으로 듣는 이에게 친밀감을 주며, 유튜브 브이로그 및 캐주얼 나레이션에 잘 어울립니다.",
    recommendedFor: ["유튜브 브이로그", "SNS 쇼츠", "게임 방송", "친근한 설명"],
    badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
    avatarColor: "from-blue-400 to-indigo-600",
  },
  {
    id: "Charon",
    nameKo: "카론 (Charon)",
    gender: "male",
    toneKo: "깊고 중후하며 신뢰감 넘치는 남성 음성",
    description: "묵직한 저음과 권위 있는 울림으로 정통 뉴스 브리핑, 역사 다큐, 기업 브랜드 영상에 강력한 몰입감을 줍니다.",
    recommendedFor: ["정통 뉴스", "역사 다큐", "브랜드 광고", "영화 예고편"],
    badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
    avatarColor: "from-slate-600 to-zinc-800",
  },
  {
    id: "Fenrir",
    nameKo: "펜리르 (Fenrir)",
    gender: "male",
    toneKo: "단단하고 카리스마 넘치는 남성 음성",
    description: "강한 에너지와 긴장감을 표현할 수 있는 개성 있는 보이스로 판타지 스토리텔링 및 게임 캐릭터 더빙에 특화되었습니다.",
    recommendedFor: ["게임 캐릭터", "판타지 소설", "액션 연출", "영화 드라마"],
    badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
    avatarColor: "from-amber-500 to-orange-600",
  },
  {
    id: "Zephyr",
    nameKo: "제피르 (Zephyr)",
    gender: "female",
    toneKo: "포근하고 차분하며 힐링되는 여성 음성",
    description: "마음을 편안하게 감싸주는 온화하고 몽환적인 음색으로 수면 유도 ASMR, 명상 가이드, 서정적 시 낭송에 탁월합니다.",
    recommendedFor: ["명상 가이드", "수면 유도", "서정적 에세이", "힐링 팟캐스트"],
    badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
    avatarColor: "from-purple-400 to-pink-600",
  },
];

// 감정 및 연기 스타일 프리셋
export const EMOTION_PRESETS: EmotionStyle[] = [
  {
    id: "natural",
    labelKo: "자연스러움",
    subLabel: "Natural Standard",
    promptKeyword: "clear, natural, and standard narration",
    iconName: "Volume2",
    colorClass: "border-slate-400 text-slate-800 bg-slate-50",
    bgClass: "bg-slate-500",
  },
  {
    id: "cheerful",
    labelKo: "밝음 / 기쁨",
    subLabel: "Cheerful & Joyful",
    promptKeyword: "cheerful, bright, smiling, and happy",
    iconName: "Smile",
    colorClass: "border-amber-400 text-amber-800 bg-amber-50",
    bgClass: "bg-amber-500",
  },
  {
    id: "calm",
    labelKo: "차분함 / 힐링",
    subLabel: "Calm & Soothing",
    promptKeyword: "calm, peaceful, soothing, gentle, and relaxing",
    iconName: "Heart",
    colorClass: "border-emerald-400 text-emerald-800 bg-emerald-50",
    bgClass: "bg-emerald-500",
  },
  {
    id: "energetic",
    labelKo: "열정 / 에너지",
    subLabel: "Energetic & Hype",
    promptKeyword: "energetic, passionate, loud, and enthusiastic",
    iconName: "Zap",
    colorClass: "border-rose-400 text-rose-800 bg-rose-50",
    bgClass: "bg-rose-500",
  },
  {
    id: "serious",
    labelKo: "진지함 / 뉴스",
    subLabel: "Serious & News Anchor",
    promptKeyword: "authoritative, serious, formal, and articulate news anchor",
    iconName: "Radio",
    colorClass: "border-blue-400 text-blue-800 bg-blue-50",
    bgClass: "bg-blue-600",
  },
  {
    id: "dramatic",
    labelKo: "드라마 / 긴장감",
    subLabel: "Dramatic & Cinematic",
    promptKeyword: "dramatic, cinematic, tense, and suspenseful movie trailer",
    iconName: "Film",
    colorClass: "border-violet-400 text-violet-800 bg-violet-50",
    bgClass: "bg-violet-600",
  },
  {
    id: "emotional",
    labelKo: "감성 / 애틋함",
    subLabel: "Emotional & Melancholic",
    promptKeyword: "emotional, deep, sorrowful, and deeply touching",
    iconName: "Sparkles",
    colorClass: "border-pink-400 text-pink-800 bg-pink-50",
    bgClass: "bg-pink-500",
  },
  {
    id: "whispered",
    labelKo: "속삭임 / ASMR",
    subLabel: "Whispered & Soft",
    promptKeyword: "whispered, extremely soft, close-mic, and intimate ASMR",
    iconName: "Mic",
    colorClass: "border-indigo-400 text-indigo-800 bg-indigo-50",
    bgClass: "bg-indigo-500",
  },
];

// 원클릭 테스트를 위한 샘플 대본 목록
export const SAMPLE_SCRIPTS = [
  {
    title: "🎧 브이로그 오프닝",
    category: "유튜브",
    suggestedVoice: "Puck",
    suggestedEmotion: "cheerful",
    text: "여러분 안녕하세요! 오늘도 제 채널을 찾아주셔서 정말 감사해요. 오늘은 여러분과 함께 훌쩍 떠나는 특별한 여행을 준비했는데요, 끝까지 함께해 주실 거죠?",
  },
  {
    title: "📖 감성 오디오북 낭독",
    category: "에세이",
    suggestedVoice: "Zephyr",
    suggestedEmotion: "calm",
    text: "바쁜 하루의 끝, 문득 올려다본 밤하늘에는 조용히 빛나는 별들이 있었습니다. 오늘 하루도 정말 수고 많으셨어요. 이제는 따뜻한 온기 속에서 편안한 쉼을 누려보세요.",
  },
  {
    title: "🎬 영화 예고편 나레이션",
    category: "영화",
    suggestedVoice: "Charon",
    suggestedEmotion: "dramatic",
    text: "누구도 믿을 수 없는 거대한 음모의 시작. 마지막 순간, 진실을 밝힐 단 하나의 선택이 그를 기다린다. 이번 여름, 상상 그 이상의 전율이 찾아옵니다.",
  },
  {
    title: "🎙️ 아침 뉴스 브리핑",
    category: "뉴스",
    suggestedVoice: "Kore",
    suggestedEmotion: "serious",
    text: "오늘 아침 주요 뉴스입니다. 완연한 봄기운과 함께 기온이 크게 오르겠으며, 전국 대부분 지역에서 쾌청하고 맑은 하늘이 이어지겠습니다. 자세한 소식 전해드립니다.",
  },
  {
    title: "⚔️ 판타지 게임 인트로",
    category: "게임",
    suggestedVoice: "Fenrir",
    suggestedEmotion: "energetic",
    text: "오랜 어둠의 봉인이 마침내 풀렸다! 전설의 용사여, 망설일 시간이 없다. 검을 들고 운명의 전장으로 나아가라!",
  },
];
