/**
 * Gemini AI 더빙 스튜디오 - 헤더 컴포넌트
 */

import React from "react";
import { Mic, Sparkles, Volume2 } from "lucide-react";

interface HeaderProps {
  selectedVoiceNameKo: string;
  selectedEmotionLabelKo: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedVoiceNameKo,
  selectedEmotionLabelKo,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* 서비스 로고 및 타이틀 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Gemini AI 더빙 스튜디오
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                Gemini 3.1 TTS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              텍스트를 다양한 전문 성우의 목소리와 감정 표현으로 읽고 MP3로 다운로드하세요
            </p>
          </div>
        </div>

        {/* 현재 설정된 옵션 현황 뱃지 */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 transition">
            <Volume2 className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            <span className="text-slate-500 mr-1">선택 성우:</span>
            <span className="font-semibold text-slate-900">{selectedVoiceNameKo}</span>
          </div>
          <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 transition">
            <span className="text-slate-500 mr-1">감정 연출:</span>
            <span className="font-semibold text-indigo-600">{selectedEmotionLabelKo}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
