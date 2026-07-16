import React, { useState, useEffect } from "react";
import { EPISODES, Episode } from "./podcastData";
import Starfield from "./components/Starfield";
import CosmicPlayer from "./components/CosmicPlayer";
import CosmicConsultant from "./components/CosmicConsultant";
import SimulationLab from "./components/SimulationLab";
import StrategyNotebook from "./components/StrategyNotebook";
import { Radio, Terminal, Sliders, BookOpen, Star, Sparkles, Compass, HelpCircle, ArrowUpRight, Clock, Heart } from "lucide-react";

const COSMIC_QUOTES = [
  {
    quote: "الكون لا يكترث لقرارات البيروقراطية؛ إما أن تتمدد كالمستعر الأعظم (Supernova)، أو ستواجه موتاً حرارياً بارداً لمنتجاتك الراكدة.",
    author: "أثير استراتنموي"
  },
  {
    quote: "المادة المظلمة لشركتك هي ثقافة فريقك وولاء عملائك. بدون هذه الكتلة غير المرئية، ستتفكك مجرة مبيعاتك وتتناثر عند أول عاصفة كونية.",
    author: "أثير استراتنموي"
  },
  {
    quote: "لا تصطدم بالشركات العملاقة صداماً صخرياً؛ بل استخدم 'مناورة مقلاع الجاذبية' لتكتسب تسارعاً هائلاً من زخمهم التسويقي دون تكلفة.",
    author: "أثير استراتنموي"
  },
  {
    quote: "الأوتار المهتزة متناهية الصغر في تجربة مستخدم منتجك هي ما يصنع لحناً فلسفياً متناغماً يتردد صداه عبر أبعاد الأسواق المختلفة.",
    author: "أثير استراتنموي"
  }
];

export default function App() {
  const [activeEpisode, setActiveEpisode] = useState<Episode>(EPISODES[0]);
  const [activeNav, setActiveNav] = useState<"player" | "consultant" | "lab" | "notebook">("player");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [utcTime, setUtcTime] = useState("");

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % COSMIC_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Update live space telemetry clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace("T", " // ").slice(0, 21) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-hidden" id="stratnomical-app-deck">
      {/* 1. Real-time animated starlight background */}
      <Starfield />

      {/* Editorial Decorative Orbit Background Rings */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] orbit-ring opacity-20 pointer-events-none z-0" />
      <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] orbit-ring opacity-10 pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] orbit-ring opacity-15 pointer-events-none z-0" />

      {/* Decorative large nebula glows */}
      <div className="fixed top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-nebula-purple nebula-glow -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-nebula-cyan nebula-glow -z-10" />

      {/* 2. MAIN HEADER & CONTROL PANEL */}
      <header className="w-full border-b border-white/5 bg-space-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Left panel - Space Telemetry Indicators (Arabic style) */}
          <div className="flex items-center gap-3 order-3 md:order-1 text-xs font-mono text-slate-400">
            <div className="bg-space-900/80 px-3.5 py-2 rounded-xl border border-white/5 flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-nebula-cyan animate-pulse" />
              <span>{utcTime}</span>
            </div>
            <div className="hidden sm:block bg-space-900/80 px-3.5 py-2 rounded-xl border border-white/5 shadow-sm">
              🪐 SYSTEM // <span className="text-nebula-purple font-bold">RESONANT_VIBE</span>
            </div>
          </div>

          {/* Center navigation controls (Editorial Style) */}
          <nav className="flex items-center bg-white/[0.02] p-1 rounded-xl border border-white/10 order-2" id="main-navigation-panel">
            <button
              onClick={() => setActiveNav("notebook")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-serif font-medium cursor-pointer transition-all tracking-wider ${
                activeNav === "notebook"
                  ? "bg-white text-slate-950 font-semibold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-btn-notebook"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>مفكرة الأثير</span>
            </button>

            <button
              onClick={() => setActiveNav("lab")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-serif font-medium cursor-pointer transition-all tracking-wider ${
                activeNav === "lab"
                  ? "bg-white text-slate-950 font-semibold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-btn-lab"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>مختبر المحاكاة</span>
            </button>

            <button
              onClick={() => setActiveNav("consultant")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-serif font-medium cursor-pointer transition-all tracking-wider ${
                activeNav === "consultant"
                  ? "bg-white text-slate-950 font-semibold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-btn-consultant"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>المستشار الكوني</span>
            </button>

            <button
              onClick={() => setActiveNav("player")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-serif font-medium cursor-pointer transition-all tracking-wider ${
                activeNav === "player"
                  ? "bg-white text-slate-950 font-semibold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-btn-player"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>أثير البودكاست</span>
            </button>
          </nav>

          {/* Right panel - Logo Brand (Highly Editorial with black rotated square inside white circle) */}
          <div className="flex items-center gap-3.5 order-1 md:order-3 text-right">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter font-serif text-white uppercase flex items-center gap-2">
                استراتنموي
              </h1>
              <p className="text-[10px] text-nebula-cyan font-mono tracking-[0.25em] uppercase">
                STRATNOMICAL // ARCHITECTURE
              </p>
            </div>

            <div className="w-11 h-11 bg-white flex items-center justify-center rounded-full shadow-lg shadow-white/5 hover:scale-105 transition-transform duration-300">
              <div className="w-5 h-5 bg-black rounded-sm rotate-45 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-white -rotate-45" />
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. DYNAMIC BODY CONTAINER WITH DESKTOP EDITORIAL SIDE RAIL */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 flex gap-8 z-10 relative">

        {/* Core Main Content Area */}
        <main className="flex-1 space-y-8 min-w-0">

          {/* ROTATING COSMIC QUOTE OF THE DAY CAROUSEL */}
          <section className="glass-panel rounded-3xl p-5 border border-white/5 relative overflow-hidden flex items-center justify-between gap-6" id="cosmic-quote-section">
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-nebula-cyan to-nebula-purple" />

            <div className="flex-grow text-right pr-4">
              <span className="text-[9px] font-mono tracking-[0.3em] text-cosmic-gold uppercase flex items-center justify-end gap-1.5 mb-1.5">
                <Star className="w-3 h-3 fill-cosmic-gold text-cosmic-gold" />
                خاطرة اليوم الكونية الاستراتيجية
              </span>
              <p className="text-sm sm:text-base text-slate-100 font-serif font-light leading-relaxed transition-opacity duration-500 animate-fade-in italic">
                "{COSMIC_QUOTES[currentQuoteIndex].quote}"
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-center justify-center pl-2 shrink-0 border-l border-white/10 pr-6">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">ORBIT STATE</span>
              <span className="text-xs font-mono text-indigo-400 font-bold tracking-widest animate-pulse">● RESONANT</span>
            </div>
          </section>

          {/* COMPONENT ROUTER PANEL */}
          <section className="transition-all duration-300">
            {activeNav === "player" && (
              <CosmicPlayer
                onEpisodeSelect={(ep) => setActiveEpisode(ep)}
                selectedEpisode={activeEpisode}
              />
            )}

            {activeNav === "consultant" && (
              <CosmicConsultant />
            )}

            {activeNav === "lab" && (
              <SimulationLab />
            )}

            {activeNav === "notebook" && (
              <StrategyNotebook />
            )}
          </section>

          {/* SPECIAL DESIGN PHILOSOPHY SECTION WITH ASYMMETRIC BORDERS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/5 border-r-4 border-r-nebula-cyan text-right space-y-3 transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-nebula-cyan flex items-center justify-center mb-1 mr-auto md:mr-0">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-white text-base">الفكر الاستراتيجي</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                تجاوز القشور والتحليلات التقليدية؛ نتعمق في جذور القوى والنظم التي تحكم نجاح المنظمات واستمراريتها.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 border-r-4 border-r-nebula-purple text-right space-y-3 transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-nebula-purple flex items-center justify-center mb-1 mr-auto md:mr-0">
                <Star className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-white text-base">الغموض الكوني للأعمال</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                إسقاط مباشر لعجائب الكون والفيزياء الفلكية على حركة الشركات والمنافسين ونقاط اللاعودة للمنتجات.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 border-r-4 border-r-cosmic-gold text-right space-y-3 transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-cosmic-gold flex items-center justify-center mb-1 mr-auto md:mr-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-white text-base">تطوير الذات العصري</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                دمج العناصر التقنية والتنموية بأسلوب بليغ يغذي شغف المعرفة والارتقاء بالنفس في فضاء ريادة الأعمال.
              </p>
            </div>
          </section>

        </main>

        {/* Elegant Editorial Side Rail (Only Visible on desktop view as in Design HTML) */}
        <aside className="hidden lg:flex w-12 flex-col items-center justify-between py-8 glass-panel rounded-full max-h-[600px] sticky top-28 border border-white/5 opacity-80 self-start">
          <span className="writing-mode-vertical-rl text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500 origin-center rotate-180">
            STRATEGY
          </span>
          <div className="w-1.5 h-1.5 bg-nebula-cyan rounded-full animate-ping" />
          <span className="writing-mode-vertical-rl text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-nebula-cyan origin-center rotate-180">
            EVOLUTION
          </span>
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <span className="writing-mode-vertical-rl text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-nebula-purple origin-center rotate-180">
            COSMOS
          </span>
        </aside>

      </div>

      {/* 4. FOOTER CREDITS */}
      <footer className="w-full border-t border-white/5 py-6 bg-space-950/80 backdrop-blur-sm z-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right">

          <div className="text-[11px] text-slate-500 font-mono order-2 sm:order-1">
            © 2026 STRATNOMICAL. ALL ORBITS SECURED. BUILT IN THE DEEP SPACE CODES.
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 order-1 sm:order-2">
            <span>صُنع بشغف فلسفي كوني في فضاء</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="font-bold text-nebula-cyan">استراتنموي</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
