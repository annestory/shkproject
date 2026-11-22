/**
 * Gemini TTS 더빙 스튜디오 - Express 백엔드 서버
 * 
 * 주요 역할:
 * 1. Google Gemini 3.1 Flash TTS 모델을 호출하여 텍스트를 고음질 음성(24kHz PCM)으로 생성
 * 2. 24kHz 모노 16-bit PCM 오디오를 무손실 WAV 및 고음질 MP3로 인코딩
 * 3. AI 대본 어시스턴트(Gemini 3.8 Flash)를 통해 더빙용 스크립트 작성 보조 기능 제공
 * 4. 개발 환경에서는 Vite 개발 미들웨어를, 프로덕션 환경에서는 빌드된 정적 파일을 서빙
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createRequire } from "module";

// .env 파일의 환경 변수 로드
dotenv.config();

const require = createRequire(import.meta.url);
const lamejs = require("lamejs");

const app = express();
const PORT = 3000;

// JSON 요청 본문 파싱 (최대 10MB 허용)
app.use(express.json({ limit: "10mb" }));

// Gemini SDK 클라이언트 초기화 (User-Agent 설정 준수)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/**
 * 16-bit Linear PCM 데이터에 표준 44바이트 RIFF WAV 헤더를 생성하는 함수
 * @param dataLength PCM 데이터의 바이트 크기
 * @param sampleRate 오디오 샘플레이트 (기본: 24000Hz)
 * @param numChannels 채널 수 (1: 모노, 2: 스테레오)
 * @param bitsPerSample 샘플 당 비트 수 (기본: 16비트)
 * @returns 44바이트 WAV 헤더 버퍼
 */
function createWavHeader(
  dataLength: number,
  sampleRate: number = 24000,
  numChannels: number = 1,
  bitsPerSample: number = 16
): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  header.write("RIFF", 0); // 청크 식별자
  header.writeUInt32LE(36 + dataLength, 4); // 전체 파일 크기 - 8바이트
  header.write("WAVE", 8); // 형식 식별자
  header.write("fmt ", 12); // 하위 청크 식별자
  header.writeUInt32LE(16, 16); // 하위 청크 크기 (PCM의 경우 16)
  header.writeUInt16LE(1, 20); // 오디오 포맷 (1: PCM)
  header.writeUInt16LE(numChannels, 22); // 채널 수
  header.writeUInt32LE(sampleRate, 24); // 샘플 레이트
  header.writeUInt32LE(byteRate, 28); // 초당 바이트 수
  header.writeUInt16LE(blockAlign, 32); // 데이터 블록 정렬 크기
  header.writeUInt16LE(bitsPerSample, 34); // 샘플당 비트 수
  header.write("data", 36); // 데이터 청크 식별자
  header.writeUInt32LE(dataLength, 40); // 데이터 청크 크기

  return header;
}

/**
 * 24kHz 16-bit 모노 PCM 버퍼를 MP3 버퍼로 인코딩하는 함수 (lamejs 활용)
 * @param pcmBuffer 순수 PCM 오디오 바이너리
 * @param sampleRate 오디오 샘플레이트 (24000)
 * @returns 인코딩된 MP3 Buffer
 */
function convertPcmToMp3(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  try {
    const encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
    const samples = new Int16Array(
      pcmBuffer.buffer,
      pcmBuffer.byteOffset,
      Math.floor(pcmBuffer.byteLength / 2)
    );

    const mp3Chunks: Buffer[] = [];
    const chunkSize = 1152; // MP3 인코딩 기본 프레임 단위

    for (let i = 0; i < samples.length; i += chunkSize) {
      const chunk = samples.subarray(i, i + chunkSize);
      const mp3buf = encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Chunks.push(Buffer.from(mp3buf));
      }
    }

    const endBuf = encoder.flush();
    if (endBuf.length > 0) {
      mp3Chunks.push(Buffer.from(endBuf));
    }

    return Buffer.concat(mp3Chunks);
  } catch (err) {
    console.error("MP3 인코딩 중 오류 발생, WAV 폴백 사용:", err);
    throw err;
  }
}

// -------------------------------------------------------------
// API 라우트
// -------------------------------------------------------------

/**
 * 서버 상태 점검 엔드포인트
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Gemini TTS 더빙 음성 생성 엔드포인트
 * POST /api/tts
 * Body:
 *   - text: string (읽을 대본)
 *   - voiceName: string ('Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr')
 *   - emotionPrompt: string (감정 지시어, 예: 'cheerful and smiling')
 *   - customDirection: string (사용자 추가 연출 메모, 예: '빠르고 활기차게')
 */
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore", emotionPrompt = "natural", customDirection = "" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "음성으로 변환할 텍스트를 입력해주세요." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. AI Studio 비밀키 설정을 확인해주세요.",
      });
    }

    // 감정 및 스타일 지시어 프롬프트 조합
    // Gemini TTS는 연기 지도(Acting direction)를 문두에 추가할 때 탁월한 감정 표현력을 발휘합니다.
    let direction = "";
    if (emotionPrompt && emotionPrompt !== "natural") {
      direction += emotionPrompt;
    }
    if (customDirection && customDirection.trim()) {
      direction = direction ? `${direction}, ${customDirection.trim()}` : customDirection.trim();
    }

    let ttsPromptText = text.trim();
    if (direction) {
      ttsPromptText = `Say in a ${direction} style: ${text.trim()}`;
    }

    console.log(`[TTS 생성 요청] 성우: ${voiceName}, 지시: ${direction || "기본"}, 글자수: ${text.length}`);

    // Gemini 3.1 Flash TTS 모델 호출
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [
        {
          parts: [{ text: ttsPromptText }],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.[0];
    const rawAudioBase64 = audioPart?.inlineData?.data;

    if (!rawAudioBase64) {
      throw new Error("Gemini 모델로부터 오디오 데이터를 수신하지 못했습니다.");
    }

    // Base64를 24kHz 모노 16-bit PCM 바이너리 버퍼로 복원
    const pcmBuffer = Buffer.from(rawAudioBase64, "base64");

    // 1. WAV 파일 생성 (헤더 + PCM 데이터)
    const wavHeader = createWavHeader(pcmBuffer.length, 24000, 1, 16);
    const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
    const wavBase64 = wavBuffer.toString("base64");

    // 2. MP3 파일 인코딩 생성 (lamejs 사용)
    let mp3Base64 = "";
    try {
      const mp3Buffer = convertPcmToMp3(pcmBuffer, 24000);
      mp3Base64 = mp3Buffer.toString("base64");
    } catch (mp3Err) {
      console.warn("MP3 인코딩 실패, WAV만 전달합니다:", mp3Err);
    }

    // 재생 시간 추정 (24000Hz * 16bit(2바이트) * 1채널 = 48000 바이트/초)
    const durationSeconds = +(pcmBuffer.length / 48000).toFixed(2);

    res.json({
      success: true,
      mp3Base64: mp3Base64 || wavBase64, // MP3 실패 시 호환성 위해 WAV 전달
      wavBase64: wavBase64,
      isMp3: Boolean(mp3Base64),
      durationSeconds,
      sampleRate: 24000,
      voiceName,
      emotionPrompt,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[TTS API 오류]:", error);
    res.status(500).json({
      error: error?.message || "음성 합성 생성 중 서버 오류가 발생했습니다.",
    });
  }
});

/**
 * AI 대본 자동 생성/교정 도우미 엔드포인트
 * POST /api/generate-script
 * 사용자가 키워드나 주제를 입력하면 Gemini 3.8 Flash가 나레이션/더빙용 대본을 작성해줍니다.
 */
app.post("/api/generate-script", async (req, res) => {
  try {
    const { topic, genre = "narration", mood = "warm" } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ error: "대본 주제를 입력해주세요." });
    }

    const prompt = `당신은 전문 방송 작가 및 더빙 디렉터입니다.
다음 주제에 맞춰 성우가 소리 내어 읽기에 가장 자연스러운 한국어 더빙/나레이션 대본을 작성해주세요.

[대본 정보]
- 주제 또는 키워드: ${topic}
- 장르: ${genre} (예: 광고, 팟캐스트, 오디오북, 유튜브 오프닝, 감성 시, 뉴스 등)
- 분위기: ${mood}

[작성 규칙]
1. 성우가 발음하기 편하고 듣는 사람이 몰입하기 좋은 구어체 문장을 사용하세요.
2. 2~4개 문장 내외(약 80~180자)로 깔끔하고 임팩트 있게 작성하세요.
3. 부가 설명, 제목, 따옴표 없이 오직 성우가 읽을 순수 대본 본문만 출력하세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const script = response.text ? response.text.trim() : "";
    res.json({ script });
  } catch (error: any) {
    console.error("[대본 생성 오류]:", error);
    res.status(500).json({
      error: error?.message || "대본 생성 중 오류가 발생했습니다.",
    });
  }
});

// -------------------------------------------------------------
// 서버 부팅 및 Vite 미들웨어 통합
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // 개발 모드: Vite 개발 서버 미들웨어 마운트
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // 프로덕션 모드: 빌드된 정적 dist 서빙
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[서버 시작] Gemini AI 더빙 스튜디오가 포트 ${PORT}에서 실행 중입니다.`);
  });
}

startServer();
