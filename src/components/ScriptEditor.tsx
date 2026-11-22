/**
 * Gemini AI 더빙 스튜디오 - 대본 텍스트 에디터 및 생성 제어
 */

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Send,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SAMPLE_SCRIPTS } from "../data/voices";

interface ScriptEditorProps {
  text: string;
  onChangeText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onApplySample: (script: (typeof SAMPLE_SCRIPTS)[0]) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  onChangeText,
  onGenerate,
  isLoading,
  onApplySample,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenre, setAiGenre] = useState("narration");
  const [isGeneratingAiScript, setIsGeneratingAiScript] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 글자 수 및 추정 재생 시간 (한국어 기준 분당 약 300자)
  const charCount = text.length;
  const estimatedSeconds = Math.max(1, Math.round((charCount / 5) * 1.0));

  // 텍스트 클립보드 복사
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패 시 무시
    }
  };

  // 키보드 단축키 (Ctrl+Enter / Cmd+Enter로 생성)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (text.trim() && !isLoading) {
        onGenerate();
      }
    }
  };

  // AI 대본 작성 요청
  const handleRequestAiScript = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAiScript(true);
    setAiError(null);

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic.trim(), genre: aiGenre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "대본 생성에 실패했습니다.");
      if (data.script) {
        onChangeText(data.script);
        setShowAiHelper(false);
        setAiTopic("");
      }
    } catch (err: any) {
      setAiError(err.message || "오류가 발생했습니다.");
    } finally {
      setIsGeneratingAiScript(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      {/* 타이틀 및 상단 컨트롤 */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              더빙할 대본 입력
            </h2>
            <p className="text-xs text-slate-500">
              성우가 읽어줄 텍스트를 입력하거나 아래 샘플을 선택하세요
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* AI 대본 작성 도우미 토글 버튼 */}
          <button
            type="button"
            onClick={() => setShowAiHelper(!showAiHelper)}
            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              showAiHelper
                ? "bg-red-600 text-white border-red-600"
                : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200/80"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI 대본 도우미
          </button>

          {/* 복사 버튼 */}
          {text && (
            <button
              type="button"
              onClick={handleCopy}
              title="대본 복사"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}

          {/* 비우기 버튼 */}
          {text && (
            <button
              type="button"
              onClick={() => onChangeText("")}
              title="텍스트 비우기"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* AI 대본 도우미 패널 (토글형) */}
      {showAiHelper && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-50/70 to-rose-50/70 border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-red-900 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-red-600" />
              Gemini AI 대본 자동 생성기
            </h3>
            <span className="text-[11px] text-red-700">
              원하는 주제만 적으면 성우용 대본을 작성해드립니다
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="예: 제주도 해변 여행 브이로그, 스마트워치 신제품 소개 광고"
                className="w-full text-xs px-3 py-2 rounded-lg border border-red-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRequestAiScript();
                }}
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={aiGenre}
                onChange={(e) => setAiGenre(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-lg border border-red-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="narration">나레이션 / 낭독</option>
                <option value="vlog">유튜브 / 브이로그</option>
                <option value="commercial">광고 / 프로모션</option>
                <option value="story">동화 / 스토리</option>
              </select>

              <button
                type="button"
                onClick={handleRequestAiScript}
                disabled={isGeneratingAiScript || !aiTopic.trim()}
                className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium text-xs whitespace-nowrap flex items-center transition cursor-pointer"
              >
                {isGeneratingAiScript ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "대본 생성"
                )}
              </button>
            </div>
          </div>

          {aiError && (
            <p className="text-xs text-rose-600 mt-1">{aiError}</p>
          )}
        </div>
      )}

      {/* 원클릭 샘플 대본 칩 */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2.5 mb-3 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap mr-1">
          추천 샘플:
        </span>
        {SAMPLE_SCRIPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onApplySample(sample)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* 대본 텍스트 에리어 */}
      <div className="relative mb-3">
        <textarea
          id="script-textarea"
          rows={5}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="성우가 읽어줄 한국어 또는 다국어 텍스트를 입력해주세요.&#10;문장부호(쉼표, 마침표, 물음표)를 적절히 사용하면 더욱 자연스러운 호흡으로 낭독합니다.&#10;&#10;(단축키: Ctrl+Enter를 누르면 즉시 더빙 음성이 생성됩니다)"
          className="w-full text-sm sm:text-base leading-relaxed p-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-3 focus:ring-red-500/20 focus:border-red-600 transition placeholder:text-slate-400 font-sans"
        />

        {/* 하단 카운터 정보 */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1.5">
          <div className="flex items-center space-x-3">
            <span>
              글자 수: <strong className="text-slate-800">{charCount}</strong>자
            </span>
            <span>
              예상 낭독 시간: 약{" "}
              <strong className="text-red-600">{estimatedSeconds}초</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Ctrl + Enter로 바로 생성
          </span>
        </div>
      </div>

      {/* 생성 실행 메인 버튼 */}
      <button
        type="button"
        id="generate-dubbing-button"
        onClick={onGenerate}
        disabled={isLoading || !text.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:via-rose-700 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-base shadow-md shadow-red-100 transition-all flex items-center justify-center space-x-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Gemini TTS 모델로 고음질 더빙 음성 합성 중...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>선택한 목소리와 감정으로 더빙 음성 생성하기</span>
          </>
        )}
      </button>
    </section>
  );
};

