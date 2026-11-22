/**
 * Gemini AI 더빙 스튜디오 - 생성 히스토리 컴포넌트
 */

import React from "react";
import {
  History,
  Play,
  Download,
  Trash2,
  Clock,
  User,
  Volume2,
} from "lucide-react";
import { DubbingResult } from "../types";
import { downloadBase64Audio, generateSafeFilename } from "../utils/audio";

interface HistoryListProps {
  history: DubbingResult[];
  activeId?: string;
  onSelect: (item: DubbingResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  activeId,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              최근 생성한 더빙 기록
            </h2>
            <p className="text-xs text-slate-500">
              이전에 생성한 음성을 다시 듣거나 MP3로 다운로드할 수 있습니다 (최근 {history.length}건)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center space-x-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>전체 삭제</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {history.map((item) => {
          const isActive = activeId === item.id;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isActive
                  ? "border-indigo-500 bg-indigo-50/40"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* 왼쪽: 음성 정보 및 대본 미리보기 */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5 text-xs">
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.voiceLabelKo}
                  </span>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {item.emotionLabelKo}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-0.5" />
                    약 {item.durationSeconds}초
                  </span>
                </div>
                <p className="text-xs text-slate-700 line-clamp-1">
                  "{item.text}"
                </p>
              </div>

              {/* 오른쪽: 재생 및 다운로드 액션 버튼 */}
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 mr-1" />
                  {isActive ? "재생 중" : "다시 듣기"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const filename = generateSafeFilename(
                      item.text,
                      item.voiceName,
                      "mp3"
                    );
                    downloadBase64Audio(
                      item.mp3Base64 || item.wavBase64,
                      filename,
                      "audio/mp3"
                    );
                  }}
                  title="MP3 다운로드"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  title="기록 삭제"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
