import React, { useState, useEffect, useRef } from "react";
import { EPISODES, Episode } from "../podcastData";
import { CosmicSynth } from "../lib/CosmicSynth";
import { Play, Pause, RotateCcw, Volume2, Calendar, Clock, Star, BookOpen, Sparkles, ChevronLeft, VolumeX } from "lucide-react";

interface CosmicPlayerProps {
  onEpisodeSelect: (episode: Episode) => void;
  selectedEpisode: Episode;
}

export default function CosmicPlayer({ onEpisodeSelect, selectedEpisode }: CosmicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(12); // simulated percentage
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "analogy" | "summary">("transcript");
  const [timeElapsed, setTimeElapsed] = useState("02:54");
  const [timeTotal, setTimeTotal] = useState("24:15");

  const synthRef = useRef<CosmicSynth | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize synth engine
  useEffect(() => {
    synthRef.current = new CosmicSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Sync sound with current episode & volume
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (synthRef.current && isPlaying) {
      synthRef.current.setEpisode(selectedEpisode.id);
    }
    // Update episode duration limits
    setTimeTotal(selectedEpisode.duration);
    setTimeElapsed("00:00");
    setPlaybackProgress(0);
  }, [selectedEpisode]);

  // Update progress bar when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (synthRef.current) synthRef.current.stop();
            return 100;
          }
          const next = prev + 0.1 * playbackSpeed;
          // Calculate time string
          const totalSeconds = parseDurationToSeconds(selectedEpisode.duration);
          const currentSec = Math.floor((next / 100) * totalSeconds);
          setTimeElapsed(formatSecondsToTimeString(currentSec));
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, selectedEpisode]);

  const togglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.stop();
      setIsPlaying(false);
    } else {
      synthRef.current.start(selectedEpisode.id);
      synthRef.current.setVolume(isMuted ? 0 : volume);
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Helper converters
  const parseDurationToSeconds = (durationStr: string) => {
    const [m, s] = durationStr.split(":").map(Number);
    return m * 60 + s;
  };

  const formatSecondsToTimeString = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Canvas visualizer rendering (Orbiting planets / gravity waves)
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 350);
    let height = (canvas.height = 300);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 350;
      height = canvas.height = 300;
    };
    window.addEventListener("resize", handleResize);

    let angle = 0;
    const waveHistory: number[] = Array(50).fill(0);

    const drawVisualizer = () => {
      ctx.fillStyle = "rgba(9, 13, 26, 0.4)"; // trails
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const primaryColor = selectedEpisode.colorPreset === "nebula-purple" ? "#8b5cf6" :
                           selectedEpisode.colorPreset === "nebula-cyan" ? "#06b6d4" :
                           selectedEpisode.colorPreset === "nebula-pink" ? "#ec4899" : "#f59e0b";

      // 1. Draw gravitational waves (glowing circles) pulsing
      const pulseSpeed = isPlaying ? 0.04 : 0.01;
      angle += pulseSpeed;

      ctx.shadowBlur = 0;
      for (let i = 1; i <= 3; i++) {
        const radius = 50 * i + Math.sin(angle * 2 + i) * (isPlaying ? 8 : 2);
        ctx.strokeStyle = `rgba(${selectedEpisode.id === 1 ? "139, 92, 246" : selectedEpisode.id === 2 ? "6, 182, 212" : "236, 72, 153"}, ${0.15 - i * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Draw active cosmic object (Galaxy core, Black Hole, String matrix, etc.)
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = isPlaying ? 25 : 12;

      if (selectedEpisode.id === 1) {
        // Black Hole (Singularity & event horizon accretion disk)
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
        ctx.fill();

        // Accretion disk
        ctx.strokeStyle = "rgba(139, 92, 246, 0.85)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 34 + Math.sin(angle * 3) * 2, angle, angle + Math.PI * 1.5);
        ctx.stroke();

        ctx.strokeStyle = "rgba(245, 158, 11, 0.6)"; // gold outer gas
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 44, -angle, -angle + Math.PI);
        ctx.stroke();

      } else if (selectedEpisode.id === 2) {
        // Big bang expanding core
        const coreSize = 20 + Math.sin(angle * 5) * (isPlaying ? 6 : 1);
        const grad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, coreSize * 1.5);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, "#06b6d4");
        grad.addColorStop(0.8, "rgba(139, 92, 246, 0.4)");
        grad.addColorStop(1, "rgba(9, 13, 26, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize * 1.8, 0, Math.PI * 2);
        ctx.fill();

      } else if (selectedEpisode.id === 3) {
        // String theory vibrating grid strings
        ctx.strokeStyle = "rgba(236, 72, 153, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = -4; i <= 4; i++) {
          const xOffset = i * 15;
          ctx.moveTo(centerX + xOffset, centerY - 60);
          // Sine wave path
          for (let py = -60; py <= 60; py += 5) {
            const waveX = centerX + xOffset + Math.sin(py * 0.08 + angle * (isPlaying ? 8 : 2)) * (isPlaying ? 12 : 3);
            ctx.lineTo(waveX, centerY + py);
          }
        }
        ctx.stroke();

      } else if (selectedEpisode.id === 4) {
        // Dark Matter - nebulous floating cloud nodes
        ctx.shadowBlur = 30;
        ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(angle) * 20, centerY + Math.sin(angle * 0.7) * 20, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(139, 92, 246, 0.12)";
        ctx.beginPath();
        ctx.arc(centerX + Math.sin(angle * 1.2) * 25, centerY + Math.cos(angle * 0.9) * 25, 55, 0, Math.PI * 2);
        ctx.fill();

        // Tiny orbit star dots binding
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 5;
        for (let s = 0; s < 12; s++) {
          const sx = centerX + Math.cos(angle * 0.5 + (s * Math.PI) / 6) * 65;
          const sy = centerY + Math.sin(angle * 0.5 + (s * Math.PI) / 6) * 65;
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // Entropy / Star rebirth
        ctx.fillStyle = "rgba(236, 72, 153, 0.1)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.fill();

        // Spiral dust
        ctx.strokeStyle = "rgba(245, 158, 11, 0.8)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let d = 0; d < 300; d += 3) {
          const r = d * 0.25;
          const theta = d * 0.1 + angle * (isPlaying ? 3 : 0.8);
          const dx = centerX + Math.cos(theta) * r;
          const dy = centerY + Math.sin(theta) * r;
          if (d === 0) ctx.moveTo(dx, dy);
          else ctx.lineTo(dx, dy);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // 3. Draw simulated waveform at the bottom
      ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 35);
      ctx.lineTo(width, height - 35);
      ctx.stroke();

      // Bouncing visualizer bars
      const barWidth = 4;
      const barGap = 3;
      const totalBars = Math.floor(width / (barWidth + barGap));

      ctx.fillStyle = primaryColor + "cc";
      for (let b = 0; b < totalBars; b++) {
        const x = b * (barWidth + barGap);
        // generate beautiful bouncing heights
        let targetHeight = 3;
        if (isPlaying) {
          const freqMultiplier = Math.sin(b * 0.15 + angle * 12);
          const rand = Math.random() * 20;
          targetHeight = Math.max(4, Math.abs(freqMultiplier) * 45 + rand);
        } else {
          targetHeight = 2 + Math.sin(b * 0.08 + angle) * 4;
        }

        ctx.fillRect(x, height - 35 - targetHeight / 2, barWidth, targetHeight);
      }

      // Draw active telemetry status text
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "10px JetBrains Mono";
      ctx.fillText(`EP.${selectedEpisode.id} // FREQ_MOD: ${(isPlaying ? 85.4 + Math.sin(angle)*1.2 : 44.0).toFixed(1)}Hz // ENTROPY_VAL: ${(0.42 + Math.cos(angle*0.1)*0.05).toFixed(3)}`, 15, height - 10);
      ctx.fillText(isPlaying ? "STATUS: DEEP_RESONANCE_ACTIVE" : "STATUS: STEADY_STATE", width - 170, height - 10);

      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [selectedEpisode, isPlaying]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" id="cosmic-player-root">
      {/* EPISODES PLAYLIST COLUMN */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <h3 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-cyan to-nebula-purple flex items-center gap-2 pr-2">
          <Sparkles className="w-5 h-5 text-nebula-cyan animate-pulse" />
          مكتبة الأثير الكوني
        </h3>

        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          {EPISODES.map((ep) => {
            const isActive = ep.id === selectedEpisode.id;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  onEpisodeSelect(ep);
                  setIsPlaying(false);
                  if (synthRef.current) synthRef.current.stop();
                }}
                className={`w-full text-right p-4 rounded-xl transition-all duration-300 text-slate-200 cursor-pointer ${
                  isActive
                    ? "glass-panel-active border-l-4 border-l-nebula-cyan glow-border"
                    : "glass-panel hover:bg-space-800/60"
                }`}
                id={`playlist-item-${ep.id}`}
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className="text-[10px] font-mono tracking-wider text-nebula-cyan px-2 py-0.5 rounded-full bg-nebula-cyan/10 border border-nebula-cyan/20">
                    الحلقة {ep.id}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ep.duration} دقيقة
                  </span>
                </div>

                <h4 className={`font-display text-sm font-semibold mb-1 transition-colors ${isActive ? "text-nebula-cyan" : "text-white"}`}>
                  {ep.title.replace(/^الحلقة\s+\w+:\s+/, "")}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-1">
                  {ep.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE ACTIVE PLAYER INTERFACE */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 border border-white/5 glow-border-purple">
          {/* Nebula Glowing Background behind the player */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-nebula-purple nebula-glow" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-nebula-cyan nebula-glow" />

          {/* Graphical Simulated Space Visualizer */}
          <div className="w-full md:w-[45%] flex flex-col items-center bg-space-900/80 rounded-xl overflow-hidden border border-white/10 relative">
            <canvas ref={visualizerCanvasRef} className="w-full block h-[260px]" id="canvas-visualizer" />

            {/* Audio Wave Play Button overlay */}
            <button
              onClick={togglePlay}
              className="absolute top-[100px] left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center bg-space-950/90 hover:bg-space-900 text-nebula-cyan border border-nebula-cyan/40 hover:scale-105 transition-all duration-300 shadow-lg shadow-nebula-cyan/20 cursor-pointer group"
              id="center-play-button"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-nebula-cyan animate-pulse" />
              ) : (
                <Play className="w-7 h-7 text-nebula-cyan translate-x-[2px] group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Controls & Metadatas */}
          <div className="w-full md:w-[55%] flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono text-cosmic-gold px-2.5 py-0.5 rounded-full bg-cosmic-gold/10 border border-cosmic-gold/20 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cosmic-gold text-cosmic-gold" />
                  أثير الفكر الاستراتيجي
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedEpisode.publishDate}
                </span>
              </div>

              <h2 className="text-xl font-display font-bold text-white mb-2 leading-snug">
                {selectedEpisode.title}
              </h2>
              <p className="text-sm text-slate-300 mb-4 font-light leading-relaxed">
                {selectedEpisode.subtitle}
              </p>

              {/* Technical indicators */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-space-900/50 border border-white/5 text-[11px] font-mono mb-4 text-slate-300">
                <div>🪐 المبدأ الفلكي: <span className="text-nebula-cyan font-sans font-medium block mt-0.5">{selectedEpisode.cosmicConcept.split(" (")[0]}</span></div>
                <div>💼 مسار الأعمال: <span className="text-nebula-purple font-sans font-medium block mt-0.5">{selectedEpisode.businessAnalogy}</span></div>
              </div>
            </div>

            {/* AUDIO TIMELINE AND BUTTON CONTROLS */}
            <div className="flex flex-col gap-3">
              {/* Timeline Slider */}
              <div className="flex flex-col gap-1">
                <div className="relative w-full h-1.5 bg-space-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="absolute top-0 right-0 h-full bg-gradient-to-l from-nebula-cyan to-nebula-purple rounded-full transition-all duration-100"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-1">
                  <span>{timeElapsed}</span>
                  <span>{timeTotal}</span>
                </div>
              </div>

              {/* Buttons array */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Playback speed multiplier */}
                  <button
                    onClick={handleSpeedChange}
                    className="px-3 py-1 rounded-md bg-space-900 hover:bg-space-800 text-xs font-mono border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
                    id="playback-speed-btn"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Reset/Restart */}
                  <button
                    onClick={() => {
                      setPlaybackProgress(0);
                      setTimeElapsed("00:00");
                    }}
                    className="p-2 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                    id="restart-episode-btn"
                    title="إعادة تشغيل"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Big main play/pause trigger */}
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-nebula-cyan to-nebula-purple hover:opacity-90 font-display text-sm font-semibold text-white shadow-lg shadow-nebula-cyan/15 cursor-pointer hover:scale-102 transition-all"
                  id="primary-play-btn"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>إيقاف الأثير</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>استماع للأثير</span>
                    </>
                  )}
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMuteToggle}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white transition-all cursor-pointer"
                    id="mute-toggle-btn"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-space-900 rounded-lg appearance-none cursor-pointer accent-nebula-cyan"
                    id="volume-slider-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS/TRANSCRIPT TABS */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex border-b border-white/10 pb-2 gap-6">
            <button
              onClick={() => setActiveTab("transcript")}
              className={`font-display pb-2 text-sm font-semibold relative cursor-pointer transition-all ${
                activeTab === "transcript" ? "text-nebula-cyan" : "text-slate-400 hover:text-slate-200"
              }`}
              id="tab-btn-transcript"
            >
              النص الفلسفي الكامل (Transcript)
              {activeTab === "transcript" && (
                <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-nebula-cyan rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("analogy")}
              className={`font-display pb-2 text-sm font-semibold relative cursor-pointer transition-all ${
                activeTab === "analogy" ? "text-nebula-cyan" : "text-slate-400 hover:text-slate-200"
              }`}
              id="tab-btn-analogy"
            >
              مفهوم الإسقاط الفلكي (Cosmic Analogy)
              {activeTab === "analogy" && (
                <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-nebula-cyan rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("summary")}
              className={`font-display pb-2 text-sm font-semibold relative cursor-pointer transition-all ${
                activeTab === "summary" ? "text-nebula-cyan" : "text-slate-400 hover:text-slate-200"
              }`}
              id="tab-btn-summary"
            >
              ملخص الحلقة والدروس (Summary)
              {activeTab === "summary" && (
                <div className="absolute bottom-0 right-0 left-0 h-[2px] bg-nebula-cyan rounded-full" />
              )}
            </button>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="min-h-[220px] transition-all duration-300 leading-relaxed text-sm text-slate-300">
            {activeTab === "transcript" && (
              <div className="space-y-4 whitespace-pre-line text-slate-200 pr-2 max-h-[350px] overflow-y-auto font-sans font-light text-base text-right leading-loose">
                <div className="flex items-center gap-2 mb-3 bg-space-900/60 p-3 rounded-lg border border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-nebula-cyan animate-pulse" />
                  <span className="text-xs text-slate-300 font-mono">المتحدث: {selectedEpisode.host}</span>
                </div>
                {selectedEpisode.transcript}
              </div>
            )}

            {activeTab === "analogy" && (
              <div className="space-y-4 pr-1">
                <div className="p-4 rounded-xl bg-space-900/50 border border-white/5 space-y-3">
                  <h5 className="font-display font-semibold text-white flex items-center gap-2 text-base">
                    <Sparkles className="w-4 h-4 text-cosmic-gold" />
                    كيف تترجم قوانين الكون إلى واقع شركتك الاستراتيجية؟
                  </h5>
                  <p className="font-sans font-light text-slate-300 text-sm leading-relaxed">
                    من خلال معادلات الفيزياء الفلكية، تم الكشف عن أن الكون يعيد تكرار أنماطه في مستويات متناهية الصغر والصخب. إن الهيكل التنظيمي لشركتك يتأثر بمجموعة قوى تشبه تماماً القوى الأساسية الأربعة في الكون (الجاذبية، الكهرومغناطيسية، القوة النووية القوية، والضعيفة):
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-xl bg-space-900/40 border border-white/5">
                    <span className="text-[11px] font-mono text-nebula-cyan uppercase tracking-wider block mb-1">الظاهرة الفيزيائية: {selectedEpisode.cosmicConcept}</span>
                    <p className="text-xs text-slate-400 mt-1">
                      تمثل البنية الفيزيائية أو الفلكية الطبيعية للكون التي تمتاز بالغموض، الصلابة، وحتمية القوانين والنتائج في الفضاء السحيق.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-space-900/40 border border-white/5">
                    <span className="text-[11px] font-mono text-nebula-purple uppercase tracking-wider block mb-1">الإسقاط الاستراتيجي: {selectedEpisode.businessAnalogy}</span>
                    <p className="text-xs text-slate-400 mt-1">
                      تمثل كيف تترجم هذه القوة الفلكية بشكل فلسفي وعملي على هياكل الأسواق وحركة المنتجات وإدارة النفس وتطوير العلاقات المهنية.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="p-5 rounded-xl bg-space-900/40 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-nebula-purple/10 border border-nebula-purple/20 text-nebula-purple shrink-0 mt-1">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-3 text-right">
                    <h4 className="font-display font-bold text-white text-base">خلاصة فلسفة الحلقة:</h4>
                    <p className="text-sm font-sans font-light text-slate-300 leading-relaxed">
                      {selectedEpisode.summary}
                    </p>
                    <div className="mt-4 p-3 rounded-lg bg-space-950 border border-white/10 inline-block font-mono text-xs text-cosmic-gold">
                      💡 القول الفلسفي للبدء: "إذا أردت حماية مجرتك التجارية، فلا تهمل مادتك المظلمة غير المرئية."
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
