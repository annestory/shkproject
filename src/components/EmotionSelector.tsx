/**
 * Gemini AI 더빙 스튜디오 - 감정 및 연출 스타일 선택 패널
 */

import React from "react";
import {
  Volume2,
  Smile,
  Heart,
  Zap,
  Radio,
  Film,
  Sparkles,
  Mic,
  Sliders,
} from "lucide-react";
import { EmotionStyle } from "../types";
import { EMOTION_PRESETS } from "../data/voices";

interface EmotionSelectorProps {
  selectedEmotionId: string;
  onSelectEmotion: (emotionId: string) => void;
  customDirection: string;
  onChangeCustomDirection: (value: string) => void;
}

// 아이콘 매핑 헬퍼
const renderIcon = (iconName: string, isSelected: boolean) => {
  const iconClass = `w-4 h-4 ${isSelected ? "text-red-600" : "text-slate-500"}`;
  switch (iconName) {
    case "Smile":
      return <Smile className={iconClass} />;
    case "Heart":
      return <Heart className={iconClass} />;
    case "Zap":
      return <Zap className={iconClass} />;
    case "Radio":
      return <Radio className={iconClass} />;
    case "Film":
      return <Film className={iconClass} />;
    case "Sparkles":
      return <Sparkles className={iconClass} />;
    case "Mic":
      return <Mic className={iconClass} />;
    default:
      return <Volume2 className={iconClass} />;
  }
};

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotionId,
  onSelectEmotion,
  customDirection,
  onChangeCustomDirection,
}) => {
  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              감정 및 연기 스타일 선택
            </h2>
            <p className="text-xs text-slate-500">
              성우가 대본을 읽을 때 실어줄 목소리 톤과 감정을 선택하세요
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">
          8가지 감정 프리셋
        </span>
      </div>

      {/* 감정 프리셋 버튼 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-4">
        {EMOTION_PRESETS.map((emotion: EmotionStyle) => {
          const isSelected = selectedEmotionId === emotion.id;

          return (
            <button
              key={emotion.id}
              type="button"
              id={`emotion-button-${emotion.id}`}
              onClick={() => onSelectEmotion(emotion.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                isSelected
                  ? "border-red-600 bg-red-50/50 shadow-xs"
                  : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition ${
                  isSelected ? "bg-white shadow-xs" : "bg-slate-100"
                }`}
              >
                {renderIcon(emotion.iconName, isSelected)}
              </div>
              <span
                className={`text-xs font-bold leading-tight ${
                  isSelected ? "text-red-900" : "text-slate-800"
                }`}
              >
                {emotion.labelKo}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {emotion.subLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* 커스텀 연출 메모 인풋 */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="custom-direction-input"
            className="flex items-center text-xs font-semibold text-slate-700 space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-red-500" />
            <span>디테일 연출 메모 (선택 사항)</span>
          </label>
          <span className="text-[11px] text-slate-400">
            원하는 상황/호흡/빠르기를 직접 적으면 더욱 정교하게 연기합니다
          </span>
        </div>
        <div className="relative">
          <input
            id="custom-direction-input"
            type="text"
            value={customDirection}
            onChange={(e) => onChangeCustomDirection(e.target.value)}
            placeholder="예: 조금 쑥스러워하는 투로, 신비로운 비밀을 털어놓듯이, 끝을 올려 말하기 등"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
          />
          {customDirection && (
            <button
              type="button"
              onClick={() => onChangeCustomDirection("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              지우기
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

