import React, { useState, useEffect } from "react";
import { Sliders, Orbit, Sparkles, Zap, Flame, Shield, HelpCircle } from "lucide-react";

export default function SimulationLab() {
  const [gravity, setGravity] = useState(50); // Brand attraction
  const [expansion, setExpansion] = useState(40); // Scaling rate
  const [entropy, setEntropy] = useState(30); // Bureaucracy / Chaos
  const [darkMatter, setDarkMatter] = useState(60); // Cultural trust

  const [simulationState, setSimulationState] = useState({
    title: "منظومة المجرة المتناغمة (Harmonious Solar System)",
    description: "توازن استراتيجي مثالي. جاذبية علامتك متكافئة مع تمدد سوقك، وبنيتك الثقافية تحميك من الفوضى التشغيلية.",
    statusColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.2)",
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    advice: "أنت في مدار ممتاز للاستدامة. حافظ على ثقة فريقك الحالية واستغل هذا التوازن المثالي لضخ كميات محسوبة من التمدد الابتكاري."
  });

  // Calculate system state on slider change
  useEffect(() => {
    let title = "";
    let description = "";
    let statusColor = "";
    let glowColor = "";
    let icon = <Sparkles className="w-5 h-5" />;
    let advice = "";

    if (entropy > 75) {
      // High Chaos / Bureaucracy state
      title = "سديم الفوضى العارمة (Nebula of Total Chaos)";
      description = "لقد ارتفعت الإنتروبيا التشغيلية لمشروعك بشكل فادح. الترهل الإداري وتبدد الموارد يمنعان نشوء أي مدار مستقر للنجوم (الموظفين).";
      statusColor = "text-rose-400";
      glowColor = "rgba(244, 63, 94, 0.25)";
      icon = <Flame className="w-5 h-5 text-rose-400" />;
      advice = "أنت بحاجة ماسة لضخ طاقة وهيكلة خارجية فوراً. قلل عدد الاجتماعات والعمليات البيروقراطية لتخفيض الإنتروبيا قبل حدوث انهيار تشغيلي شامل.";
    } else if (gravity > 80 && expansion < 30) {
      // Supermassive Black Hole collapse
      title = "الانهيار الجاذبي الكثيف (Gravitational Black Hole)";
      description = "قوة جذب علامتك أو سيطرة الإدارة شديدة ولكن بلا توسع أو نمو. النواة منقبضة على نفسها لدرجة خنق الابتكار وهجوب الكفاءات.";
      statusColor = "text-purple-400";
      glowColor = "rgba(139, 92, 246, 0.25)";
      icon = <Orbit className="w-5 h-5 text-purple-400" />;
      advice = "قم بفتح المنظومة المغلقة. خفف قبضة التحكم الصارمة ودع الكفاءات تبتكر بحرية لتوليد طاقة طاردة تدعم تمدد خطوط الإنتاج والانتشار.";
    } else if (expansion > 80 && gravity < 30) {
      // Cosmic Deep Freeze
      title = "الجليد الكوني المتشتت (Expanding Deep Freeze)";
      description = "معدل التمدد فائق السرعة للغاية بينما جاذبية علامتك وولاء عملائك ضئيل جداً. رأس مالك مهدد بالتشتت والبرود التام في الفراغ السحيق.";
      statusColor = "text-cyan-400";
      glowColor = "rgba(6, 182, 212, 0.25)";
      icon = <Zap className="w-5 h-5 text-cyan-400" />;
      advice = "أوقف التوسع الجغرافي أو المالي العشوائي مؤقتاً. ركز على ترسيخ قاعدة عملائك الحاليين وتثبيت هوية العلامة التجارية لإنقاذ المنظومة من التبخر.";
    } else if (darkMatter < 25) {
      // Low culture / trust disintegrating galaxy
      title = "المجرة المتبخرة (Disintegrating Galaxy)";
      description = "مستوى المادة المظلمة (الثقافة الداخلية، الثقة والأخلاق) متدني جداً. بدون هذه الكتلة الصامتة، تتفكك مجرتك المؤسسية وتتناثر أجزاؤها.";
      statusColor = "text-amber-400";
      glowColor = "rgba(245, 158, 11, 0.25)";
      icon = <Shield className="w-5 h-5 text-amber-400" />;
      advice = "التركيز على الأرقام الظاهرة فقط لن يحميك. ابدأ بإعادة بناء الثقة مع الموظفين والعملاء، وصياغة مادة قيمية متماسكة تحفظ مشروعك من التفكك.";
    } else {
      // Harmonious system
      title = "منظومة المجرة المتناغمة (Harmonious Solar System)";
      description = "توازن استراتيجي مثالي. جاذبية علامتك متكافئة مع تمدد سوقك، وبنيتك الثقافية والائتمانية تحميك من الفوضى التشغيلية والإنتروبيا.";
      statusColor = "text-emerald-400";
      glowColor = "rgba(16, 185, 129, 0.2)";
      icon = <Sparkles className="w-5 h-5 text-emerald-400" />;
      advice = "أنت في مدار ممتاز للاستدامة والازدهار. حافظ على ثقة فريقك الحالية واستغل هذا التوازن لتوليد قفزات ابتكارية منظمة وهادفة.";
    }

    setSimulationState({ title, description, statusColor, glowColor, icon, advice });
  }, [gravity, expansion, entropy, darkMatter]);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 relative overflow-hidden" id="simulation-lab-root">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">

        {/* INTERACTIVE DYNAMIC SIMULATOR VISUALIZER */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-space-950/80 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          {/* Animated Nebula background glow synced with slider outcome */}
          <div
            className="absolute inset-0 transition-colors duration-500 rounded-2xl pointer-events-none nebula-glow"
            style={{ backgroundColor: simulationState.glowColor, filter: "blur(70px)" }}
          />

          {/* Render rotating physics simulator using SVG */}
          <div className="w-full aspect-square max-w-[280px] relative flex items-center justify-center z-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Star orbit rings */}
              <circle
                cx="100"
                cy="100"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
                strokeDasharray={entropy > 50 ? "3, 6" : "0"}
              />
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
                strokeDasharray={entropy > 50 ? "2, 4" : "0"}
              />

              {/* Gravitational pull field representation */}
              <circle
                cx="100"
                cy="100"
                r={gravity * 0.8}
                fill="none"
                stroke="rgba(139, 92, 246, 0.05)"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Dark Matter halo shroud representation */}
              <circle
                cx="100"
                cy="100"
                r={85}
                fill="none"
                stroke="rgba(245, 158, 11, 0.04)"
                strokeWidth={darkMatter * 0.2}
                className="transition-all duration-300"
              />

              {/* Central Star / Core representing gravity and entropy */}
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor={entropy > 75 ? "#f43f5e" : gravity > 80 ? "#8b5cf6" : "#f59e0b"} />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r={15 + gravity * 0.15 + (entropy > 75 ? Math.random() * 3 : 0)}
                fill="url(#sunGlow)"
                className="transition-all duration-300"
              />

              {/* Orbiting Planet 1 (Product Line) */}
              <g className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: "100px 100px", animationDuration: `${14 - expansion * 0.1}s` }}>
                <circle
                  cx={100 + (35 + expansion * 0.25)}
                  cy="100"
                  r={5 + darkMatter * 0.05}
                  fill="#06b6d4"
                  className="transition-all duration-300"
                />
                {/* Chaos micro orbit trails if entropy is high */}
                {entropy > 50 && (
                  <circle
                    cx={100 + (35 + expansion * 0.25)}
                    cy="100"
                    r={8}
                    fill="none"
                    stroke="rgba(244, 63, 94, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="2, 2"
                    className="animate-spin"
                  />
                )}
              </g>

              {/* Orbiting Planet 2 (Market Capital) */}
              <g className="animate-[spin_18s_linear_infinite]" style={{ transformOrigin: "100px 100px", animationDuration: `${24 - expansion * 0.15}s` }}>
                <circle
                  cx={100 - (60 + expansion * 0.1)}
                  cy="100"
                  r={8}
                  fill="#ec4899"
                  className="transition-all duration-300"
                />
              </g>
            </svg>
          </div>

          {/* Indicator panel */}
          <div className="w-full mt-4 p-3 rounded-xl bg-space-900/60 border border-white/5 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
              // مصفوفة المحاكاة الكونية الحية //
            </span>
            <p className="text-xs text-slate-300 font-mono">
              GRAVITY: <span className="text-nebula-purple">{gravity}%</span> |
              EXP: <span className="text-nebula-cyan">{expansion}%</span> |
              ENTROPY: <span className="text-red-400">{entropy}%</span> |
              DARK_M: <span className="text-cosmic-gold">{darkMatter}%</span>
            </p>
          </div>
        </div>

        {/* CONTROLS AND FEEDBACK COLUMN */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white flex items-center justify-end gap-2 mb-1">
                <span>مختبر المحاكاة الفلكية للأعمال</span>
                <Sliders className="w-5 h-5 text-nebula-cyan" />
              </h3>
              <p className="text-xs text-slate-400 font-light">
                قم بمطابقة قوى فضاء مشروعك لتقييم مصير علامتك التجارية استباقياً في عوالم الأسواق المنافسة.
              </p>
            </div>

            {/* SLIDERS LIST */}
            <div className="space-y-4 bg-space-900/40 p-4 rounded-2xl border border-white/5">
              {/* Gravity slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-nebula-purple font-mono">{gravity}%</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    الجاذبية الكونية (قوة سحب العلامة وولاء العملاء)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gravity}
                  onChange={(e) => setGravity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-nebula-purple"
                  id="slider-gravity"
                />
              </div>

              {/* Expansion slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-nebula-cyan font-mono">{expansion}%</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    سرعة التمدد والنمو (معدل تضخم النطاق والتمويل)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={expansion}
                  onChange={(e) => setExpansion(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-nebula-cyan"
                  id="slider-expansion"
                />
              </div>

              {/* Entropy slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-red-400 font-mono">{entropy}%</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    الإنتروبيا (فوضى الترهل والبيروقراطية وتشتت الطاقة)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={entropy}
                  onChange={(e) => setEntropy(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-red-400"
                  id="slider-entropy"
                />
              </div>

              {/* Dark matter slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-cosmic-gold font-mono">{darkMatter}%</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    المادة المظلمة (قيم الثقة، التماسك الثقافي والرمزي)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={darkMatter}
                  onChange={(e) => setDarkMatter(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-space-950 rounded-lg appearance-none cursor-pointer accent-cosmic-gold"
                  id="slider-dark-matter"
                />
              </div>
            </div>
          </div>

          {/* FEEDBACK BOARD PANEL */}
          <div className="p-5 rounded-2xl bg-space-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className={`font-display font-bold text-base ${simulationState.statusColor}`}>
                {simulationState.title}
              </h4>
              {simulationState.icon}
            </div>

            <p className="text-sm font-sans font-light text-slate-200 leading-relaxed">
              {simulationState.description}
            </p>

            <div className="p-3.5 rounded-xl bg-space-950/80 border border-white/5 text-right space-y-1.5">
              <span className="text-[10px] font-mono text-nebula-cyan block">
                [ توجيه فيزياء استراتيجية الأعمال ]
              </span>
              <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                {simulationState.advice}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
