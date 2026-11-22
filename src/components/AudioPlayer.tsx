/**
 * Gemini AI 더빙 스튜디오 - 오디오 플레이어 및 다운로드 센터
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FileAudio,
  Sparkles,
  Check,
  Share2,
} from "lucide-react";
import { DubbingResult } from "../types";
import {
  formatTime,
  downloadBase64Audio,
  generateSafeFilename,
} from "../utils/audio";

interface AudioPlayerProps {
  currentDubbing: DubbingResult | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentDubbing }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // 새로운 더빙 결과가 들어왔을 때 오디오 소스 갱신 및 자동 재생 준비
  useEffect(() => {
    if (!currentDubbing) return;

    // MP3가 기본이며, 데이터가 없을 경우 WAV 데이터 활용
    const audioData = currentDubbing.mp3Base64 || currentDubbing.wavBase64;
    const mimeType = currentDubbing.isMp3 ? "audio/mp3" : "audio/wav";
    const audioSrc = `data:${mimeType};base64,${audioData}`;

    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);

      // 브라우저 자동 재생 시도
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // 사용자 제스처 정책으로 인한 자동 재생 실패 시 수동 대기
          setIsPlaying(false);
        });
    }
  }, [currentDubbing]);

  // 배속 변경 시 적용
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // 재생 / 일시정지 토글
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 처음부터 다시 듣기
  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // 시크바 탐색
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 볼륨 변경
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  // 음소거 토글
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  // MP3 다운로드 처리
  const handleDownloadMp3 = () => {
    if (!currentDubbing) return;
    const filename = generateSafeFilename(
      currentDubbing.text,
      currentDubbing.voiceName,
      "mp3"
    );
    downloadBase64Audio(
      currentDubbing.mp3Base64 || currentDubbing.wavBase64,
      filename,
      "audio/mp3"
    );
    setDownloadSuccess("MP3 다운로드가 완료되었습니다!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // WAV 무손실 다운로드 처리
  const handleDownloadWav = () => {
    if (!currentDubbing) return;
    const filename = generateSafeFilename(
      currentDubbing.text,
      currentDubbing.voiceName,
      "wav"
    );
    downloadBase64Audio(currentDubbing.wavBase64, filename, "audio/wav");
    setDownloadSuccess("무손실 WAV 다운로드가 완료되었습니다!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  if (!currentDubbing) {
    return (
      <section className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center min-h-[260px]">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
          <FileAudio className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          더빙 음성을 생성하면 여기에 플레이어가 열립니다
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          원하는 성우와 감정 스타일을 고른 후, 대본을 입력하고 ‘더빙 음성
          생성하기’ 버튼을 눌러보세요. 고음질 오디오와 MP3 다운로드가 제공됩니다.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-red-200/90 shadow-sm relative overflow-hidden">
      {/* 배경 장식 그라데이션 라인 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

      {/* 숨겨진 오디오 태그 */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || currentDubbing.durationSeconds);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* 상단: 생성 메타데이터 배지 및 다운로드 알림 */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            성우: {currentDubbing.voiceLabelKo}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            감정: {currentDubbing.emotionLabelKo}
          </span>
          {currentDubbing.customDirection && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              연출: {currentDubbing.customDirection}
            </span>
          )}
        </div>

        {downloadSuccess && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center">
            <Check className="w-3.5 h-3.5 mr-1" />
            {downloadSuccess}
          </span>
        )}
      </div>

      {/* 대본 원문 요약 박스 */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-5">
        <p className="text-xs text-slate-500 font-semibold mb-1">
          낭독 텍스트
        </p>
        <p className="text-sm text-slate-800 leading-relaxed font-sans line-clamp-3">
          "{currentDubbing.text}"
        </p>
      </div>

      {/* 비주얼라이저 (가상 오디오 파형 바) */}
      <div className="flex items-end justify-center space-x-1 sm:space-x-1.5 h-12 mb-4 px-4 bg-gradient-to-b from-red-50/30 to-slate-50 rounded-xl py-2">
        {Array.from({ length: 32 }).map((_, index) => {
          // 재생 중일 때 동적인 높이 시뮬레이션
          const seed = (index * 7 + 13) % 10;
          const isCurrentSegment =
            duration > 0 && currentTime / duration > index / 32;
          const height = isPlaying
            ? `${Math.max(20, Math.min(95, seed * 10 + 15))}%`
            : "24%";

          return (
            <div
              key={index}
              style={{ height }}
              className={`flex-1 max-w-[6px] rounded-full transition-all duration-150 ${
                isCurrentSegment
                  ? "bg-red-600"
                  : isPlaying
                  ? "bg-red-300"
                  : "bg-slate-300"
              }`}
            />
          );
        })}
      </div>

      {/* 프로그레스 바 (타임라인 시크바) */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || currentDubbing.durationSeconds || 1}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-xs text-slate-500 font-mono mt-1 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>
            {formatTime(duration || currentDubbing.durationSeconds || 0)}
          </span>
        </div>
      </div>

      {/* 오디오 메인 컨트롤러 및 다운로드 버튼 그룹 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        {/* 재생, 정지, 재시작 */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            id="audio-play-pause-button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-200 transition cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            title="처음부터 다시 듣기"
            className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* 볼륨 컨트롤 */}
          <div className="flex items-center space-x-2 pl-1">
            <button
              type="button"
              onClick={toggleMute}
              className="text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
          </div>
        </div>

        {/* 재생 배속 조절기 */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          {[0.8, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleRateChange(rate)}
              className={`px-2 py-1 text-xs rounded-md font-medium transition cursor-pointer ${
                playbackRate === rate
                  ? "bg-white text-red-700 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* 핵심: MP3 및 WAV 다운로드 버튼 */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* MP3 다운로드 버튼 (강조) */}
          <button
            type="button"
            id="download-mp3-button"
            onClick={handleDownloadMp3}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5 text-red-400" />
            <span>MP3 다운로드</span>
          </button>

          {/* 무손실 WAV 다운로드 버튼 */}
          <button
            type="button"
            id="download-wav-button"
            onClick={handleDownloadWav}
            className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer"
            title="고음질 24kHz 무손실 원본"
          >
            <FileAudio className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>WAV</span>
          </button>
        </div>
      </div>
    </section>
  );
};
