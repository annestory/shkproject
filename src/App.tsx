/**
 * Gemini AI 더빙 스튜디오 - 메인 애플리케이션 컴포넌트
 * 
 * 주요 기능:
 * 1. 5인의 전문 성우 보이스 선택 (Kore, Puck, Charon, Fenrir, Zephyr)
 * 2. 8가지 감정 연기 프리셋 및 디테일 연출 메모 지원
 * 3. 스크립트 작성 및 Gemini AI 대본 생성 도우미 연동
 * 4. Gemini 3.1 Flash TTS 모델을 통한 실시간 고음질 음성 합성
 * 5. 직관적인 오디오 플레이어 (파형 시각화, 재생 제어, 배속 조절)
 * 6. 원클릭 MP3 및 무손실 WAV 파일 다운로드
 * 7. 로컬 더빙 히스토리 저장 및 다시 듣기
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { VoiceSelector } from "./components/VoiceSelector";
import { EmotionSelector } from "./components/EmotionSelector";
import { ScriptEditor } from "./components/ScriptEditor";
import { AudioPlayer } from "./components/AudioPlayer";
import { HistoryList } from "./components/HistoryList";
import { VOICE_PRESETS, EMOTION_PRESETS, SAMPLE_SCRIPTS } from "./data/voices";
import { DubbingResult, TtsGenerateResponse } from "./types";
import { AlertCircle, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";

const LOCAL_STORAGE_HISTORY_KEY = "gemini_tts_dubbing_history_v1";

export default function App() {
  // 1. 상태 관리
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("Kore");
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>("natural");
  const [customDirection, setCustomDirection] = useState<string>("");
  
  // 기본 샘플 텍스트 설정
  const [scriptText, setScriptText] = useState<string>(
    SAMPLE_SCRIPTS[0].text
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentDubbing, setCurrentDubbing] = useState<DubbingResult | null>(null);
  const [history, setHistory] = useState<DubbingResult[]>([]);

  // 2. 컴포넌트 마운트 시 로컬스토리지에서 이전 더빙 기록 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          if (parsed.length > 0) {
            setCurrentDubbing(parsed[0]);
          }
        }
      }
    } catch (e) {
      console.warn("히스토리 불러오기 실패:", e);
    }
  }, []);

  // 3. 히스토리 변경 시 로컬스토리지 동기화
  const saveHistory = (newHistory: DubbingResult[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_HISTORY_KEY,
        JSON.stringify(newHistory.slice(0, 20)) // 최근 20건까지 보관
      );
    } catch (e) {
      console.warn("히스토리 저장 실패:", e);
    }
  };

  // 선택된 성우 및 감정 메타데이터 조회
  const selectedVoice =
    VOICE_PRESETS.find((v) => v.id === selectedVoiceId) || VOICE_PRESETS[0];
  const selectedEmotion =
    EMOTION_PRESETS.find((e) => e.id === selectedEmotionId) || EMOTION_PRESETS[0];

  // 샘플 대본 선택 시 해당 샘플의 추천 성우 및 감정까지 원클릭으로 세팅
  const handleApplySample = (sample: (typeof SAMPLE_SCRIPTS)[0]) => {
    setScriptText(sample.text);
    if (sample.suggestedVoice) {
      setSelectedVoiceId(sample.suggestedVoice);
    }
    if (sample.suggestedEmotion) {
      setSelectedEmotionId(sample.suggestedEmotion);
    }
    setErrorMessage(null);
  };

  // 4. Gemini TTS 음성 생성 실행 핸들러
  const handleGenerateDubbing = async () => {
    if (!scriptText.trim()) {
      setErrorMessage("더빙할 텍스트를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: scriptText.trim(),
          voiceName: selectedVoiceId,
          emotionPrompt: selectedEmotion.promptKeyword,
          customDirection: customDirection.trim(),
        }),
      });

      const data: TtsGenerateResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "음성 합성 생성에 실패했습니다.");
      }

      // 생성된 새 더빙 결과 객체 구성
      const newResult: DubbingResult = {
        id: `dub_${Date.now()}`,
        text: scriptText.trim(),
        voiceName: selectedVoice.id,
        voiceLabelKo: selectedVoice.nameKo,
        emotionId: selectedEmotion.id,
        emotionLabelKo: selectedEmotion.labelKo,
        customDirection: customDirection.trim() || undefined,
        mp3Base64: data.mp3Base64,
        wavBase64: data.wavBase64,
        isMp3: data.isMp3,
        durationSeconds: data.durationSeconds,
        sampleRate: data.sampleRate,
        createdAt: new Date().toISOString(),
      };

      // 플레이어 및 히스토리 업데이트
      setCurrentDubbing(newResult);
      const updatedHistory = [newResult, ...history.filter((h) => h.id !== newResult.id)];
      saveHistory(updatedHistory);
    } catch (err: any) {
      console.error("더빙 생성 중 오류:", err);
      setErrorMessage(
        err?.message || "서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 히스토리 항목 삭제 핸들러
  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentDubbing?.id === id) {
      setCurrentDubbing(updated[0] || null);
    }
  };

  // 히스토리 전체 삭제 핸들러
  const handleClearAllHistory = () => {
    if (window.confirm("생성된 모든 더빙 기록을 삭제하시겠습니까?")) {
      saveHistory([]);
      setCurrentDubbing(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* 상단 네비게이션 헤더 */}
      <Header
        selectedVoiceNameKo={selectedVoice.nameKo}
        selectedEmotionLabelKo={selectedEmotion.labelKo}
      />

      {/* 메인 작업 대시보드 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 오류 안내 배너 */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">더빙 생성 실패</h4>
              <p className="text-xs mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
            >
              닫기
            </button>
          </div>
        )}

        {/* 1단계: 성우 보이스 선택 */}
        <VoiceSelector
          selectedVoiceId={selectedVoiceId}
          onSelectVoice={(id) => setSelectedVoiceId(id)}
        />

        {/* 2단계: 감정 및 연기 스타일 선택 */}
        <EmotionSelector
          selectedEmotionId={selectedEmotionId}
          onSelectEmotion={(id) => setSelectedEmotionId(id)}
          customDirection={customDirection}
          onChangeCustomDirection={(val) => setCustomDirection(val)}
        />

        {/* 3단계: 대본 텍스트 입력 및 생성 버튼 */}
        <ScriptEditor
          text={scriptText}
          onChangeText={(val) => setScriptText(val)}
          onGenerate={handleGenerateDubbing}
          isLoading={isLoading}
          onApplySample={handleApplySample}
        />

        {/* 4단계: 생성된 오디오 플레이어 및 MP3/WAV 다운로드 센터 */}
        <AudioPlayer currentDubbing={currentDubbing} />

        {/* 5단계: 최근 더빙 기록 보관소 */}
        <HistoryList
          history={history}
          activeId={currentDubbing?.id}
          onSelect={(item) => setCurrentDubbing(item)}
          onDelete={handleDeleteHistory}
          onClearAll={handleClearAllHistory}
        />

        {/* 하단 초보자 가이드 & 안내 카드 */}
        <section className="bg-gradient-to-br from-red-50/50 via-slate-50 to-rose-50/50 rounded-2xl p-6 border border-red-100/80">
          <h3 className="text-sm font-bold text-red-950 flex items-center mb-3">
            <HelpCircle className="w-4 h-4 mr-1.5 text-red-600" />
            Gemini TTS 더빙 스튜디오 200% 활용 꿀팁
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">
                🎙️ 호흡과 억양 조절하기
              </span>
              마침표(.), 쉼표(,), 말줄임표(…)를 적극 활용하면 성우가 실제 사람처럼 자연스럽게 쉬어가며 말합니다.
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">
                🎭 감정 연출 메모 활용
              </span>
              디테일 연출 메모에 '속삭이듯이', '비밀스럽게', '기운차게' 등을 적으면 Gemini 모델이 더욱 몰입감 있게 발화합니다.
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">
                📥 어디서나 재생되는 MP3
              </span>
              생성된 음성은 표준 MP3 파일로 즉시 다운로드되어 프리미어, 캡컷(CapCut), 팟캐스트, PPT 등 모든 곳에 곧바로 삽입 가능합니다.
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Powered by <strong>Google Gemini 3.1 Flash TTS Preview</strong> &bull; AI 더빙 음성 생성 및 MP3 다운로드 스튜디오
        </div>
      </footer>
    </div>
  );
}
