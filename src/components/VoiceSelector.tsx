/**
 * Gemini AI 더빙 스튜디오 - 성우 선택 패널
 */

import React from "react";
import { Check, User, Sparkles } from "lucide-react";
import { Voice } from "../types";
import { VOICE_PRESETS } from "../data/voices";

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
}) => {
  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              성우 보이스 선택
            </h2>
            <p className="text-xs text-slate-500">
              원하는 느낌의 전문 AI 보이스를 선택하세요 (총 5명 제공)
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">
          Gemini Prebuilt Voices
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {VOICE_PRESETS.map((voice: Voice) => {
          const isSelected = selectedVoiceId === voice.id;

          return (
            <button
              key={voice.id}
              type="button"
              id={`voice-card-${voice.id}`}
              onClick={() => onSelectVoice(voice.id)}
              className={`text-left relative flex flex-col justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                  : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              {/* 상단: 아바타, 이름, 체크 표시 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${voice.avatarColor} text-white flex items-center justify-center font-semibold text-xs shadow-xs`}
                  >
                    {voice.nameKo.slice(0, 1)}
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                      {voice.gender === "female" ? "여성" : "남성"}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 mb-1">
                  <h3 className="font-bold text-sm text-slate-900">
                    {voice.nameKo}
                  </h3>
                </div>

                <p className="text-xs font-medium text-indigo-700 mb-2 line-clamp-1">
                  {voice.toneKo}
                </p>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {voice.description}
                </p>
              </div>

              {/* 하단: 추천 태그 */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                {voice.recommendedFor.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
