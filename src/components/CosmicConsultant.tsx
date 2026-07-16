import React, { useState } from "react";
import { Sparkles, Brain, Compass, Cpu, CheckCircle, MessageSquare, ArrowLeft, RefreshCw, Send, ShieldAlert } from "lucide-react";

interface ConsultantResponse {
  cosmicPhenomenon: string;
  analysis: string;
  recommendations: string[];
  cosmicFormula: string;
}

const STARTER_PROMPTS = [
  {
    label: "منافس عملاق يسحب الحصة السوقية",
    text: "أنا شركة ناشئة جديدة، وهناك شركة كبرى تهيمن على السوق وتسحب منا كل العملاء وتجذب السوق بقوتها التسويقية الكاسحة. كيف أواجه ذلك؟"
  },
  {
    label: "تمدد سريع يسبب ترهل وفوضى داخلية",
    text: "مشروعنا يتوسع بسرعة مبيعات كبيرة لكننا نعاني من فوضى داخلية تامة، وضعف تواصل الفريق، وتفكك الجودة بشكل مخيف."
  },
  {
    label: "العملاء لا يعودون بعد الشراء الأول",
    text: "نطلق حملات إعلانية ممتازة ويشتري الناس منتجنا أول مرة، لكنهم لا يعودون للشراء مجدداً ولا نملك قاعدة عملاء أوفياء مستدامة."
  },
  {
    label: "الجمود والملل يسيطران على المنتج",
    text: "منتجنا كان ناجحاً في السنوات الماضية لكن الآن هناك ركود شديد، والأفكار الجديدة تواجه البيروقراطية والبطء الشديد."
  }
];

export default function CosmicConsultant() {
  const [dilemma, setDilemma] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState<ConsultantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateLoadingSequence = async () => {
    const statuses = [
      "📡 جاري فتح قناة الاتصال بالأثير الكوني...",
      "🌌 جاري مسح الكلمات المفتاحية عبر مدارات الذكاء الفلكي...",
      "🔬 تطبيق معادلات الفيزياء الفلكية للأعمال وتسجيل الكتلة...",
      "📐 توليد مصفوفة الحلول الاستراتيجية الفلسفية...",
      "✨ تنزيل الاستشارة المدارية النهائية..."
    ];

    for (const status of statuses) {
      setStatusText(status);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  };

  const handleConsult = async (textToUse?: string) => {
    const queryText = textToUse || dilemma;
    if (!queryText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Start loading text transitions alongside API call
    const loadingPromise = simulateLoadingSequence();

    try {
      const response = await fetch("/api/cosmic-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma: queryText })
      });

      if (!response.ok) {
        throw new Error("عذراً، فشل الاتصال بالمستشار الكوني. الرجاء المحاولة لاحقاً.");
      }

      const data = await response.json();

      // Wait for simulated scanning steps to finish so UI is majestic
      await loadingPromise;

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم الكوني.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetConsultant = () => {
    setDilemma("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 relative overflow-hidden" id="cosmic-consultant-root">
      {/* Decorative galaxy background */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-nebula-purple/10 nebula-glow" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-nebula-cyan/10 nebula-glow" />

      <div className="max-w-4xl mx-auto flex flex-col gap-6 z-10 relative">
        <div className="text-right">
          <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-cyan via-nebula-purple to-nebula-pink mb-2">
            بوابة المستشار الكوني الاستراتيجي
          </h3>
          <p className="text-sm text-slate-300 font-light leading-relaxed">
            اطرح معضلتك التجارية أو التشغيلية أو الفلسفية، ودع "المستشار الكوني" يحللها عبر مصفوفة الفيزياء الفلكية وعجائب الأكوان، ليولد لك معادلات نمو ثورية.
          </p>
        </div>

        {/* INPUT STAGE */}
        {!isLoading && !result && (
          <div className="flex flex-col gap-5 text-right">
            <div className="space-y-2">
              <label htmlFor="dilemma-textarea" className="text-xs font-semibold text-slate-400 font-mono tracking-wider block">
                [ أدخل المعضلة الاستراتيجية للمشروع ]
              </label>
              <textarea
                id="dilemma-textarea"
                rows={4}
                value={dilemma}
                onChange={(e) => setDilemma(e.target.value)}
                placeholder="مثال: أواجه صعوبة في منافسة علامة تجارية عملاقة تجذب عملائنا باستمرار، أو نعاني من تشتت جهود فريق العمل ولا نرى تماسكاً..."
                className="w-full p-4 rounded-xl bg-space-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-cyan focus:ring-1 focus:ring-nebula-cyan/30 text-sm leading-relaxed text-right font-sans"
              />
            </div>

            {/* STARTER PROMPTS GRID */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider block">
                [ أو اختر تساؤلاً مدارياً جاهزاً لتحليله ]
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDilemma(p.text);
                      handleConsult(p.text);
                    }}
                    className="p-3 text-right rounded-xl bg-space-900/50 hover:bg-space-800/80 border border-white/5 hover:border-nebula-cyan/30 transition-all text-xs text-slate-300 font-sans hover:text-white cursor-pointer"
                    id={`starter-prompt-${idx}`}
                  >
                    🚀 <span className="font-semibold text-nebula-cyan">{p.label}:</span>{" "}
                    <span className="line-clamp-1 mt-1 text-slate-400">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SEND ACTION BUTTON */}
            <div className="flex justify-start">
              <button
                onClick={() => handleConsult()}
                disabled={!dilemma.trim()}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm text-white shadow-lg cursor-pointer transition-all ${
                  dilemma.trim()
                    ? "bg-gradient-to-r from-nebula-cyan to-nebula-purple hover:scale-102 hover:shadow-nebula-cyan/10"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-white/5"
                }`}
                id="consult-submit-btn"
              >
                <span>استشارة المستشار الكوني</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE - SCI-FI SCANNER */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-6 text-center" id="consultant-loading">
            {/* Pulsing high tech scan ring */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-nebula-cyan/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-nebula-purple/50 animate-spin" />
              <div className="absolute inset-4 rounded-full border border-nebula-pink/40 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-space-950 flex items-center justify-center border border-white/20">
                <Brain className="w-6 h-6 text-nebula-cyan animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-display font-semibold text-white">جاري حساب الإسقاطات الفلكية للمشروع</h4>
              <p className="text-sm text-nebula-cyan font-mono animate-pulse">{statusText}</p>
            </div>
          </div>
        )}

        {/* ERROR SCREEN */}
        {error && (
          <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/20 text-right space-y-4" id="consultant-error">
            <div className="flex items-center gap-3 justify-end text-red-400">
              <h4 className="font-display font-bold">عطل في البوابة الفلكية</h4>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {error}
            </p>
            <div className="flex justify-end">
              <button
                onClick={resetConsultant}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white text-xs cursor-pointer transition-all"
              >
                <span>إعادة المحاولة</span>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN - MAJESTIC PRESENTATION */}
        {result && (
          <div className="flex flex-col gap-6 text-right" id="consultant-results">
            {/* Header / Phenomenon card */}
            <div className="p-5 rounded-2xl bg-space-900/60 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 glow-border">
              <button
                onClick={resetConsultant}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-all order-2 md:order-1 cursor-pointer"
                id="back-to-consultant-btn"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                <span>طرح استشارة جديدة</span>
              </button>

              <div className="space-y-1 text-center md:text-right order-1 md:order-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-nebula-cyan block">
                  [ تم تعيين الظاهرة الكونية المماثلة ]
                </span>
                <h4 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-cyan to-cosmic-gold">
                  {result.cosmicPhenomenon}
                </h4>
              </div>
            </div>

            {/* Glowing Formula Card */}
            <div className="p-4 rounded-xl bg-gradient-to-l from-space-900 to-space-950 border border-cosmic-gold/30 text-center space-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-cosmic-gold/5 nebula-glow" />
              <span className="text-[10px] font-mono tracking-wider text-cosmic-gold uppercase block relative z-10">
                // معادلة الأعمال الفلكية المقترحة //
              </span>
              <p className="text-2xl font-mono font-bold text-white tracking-wide py-1 relative z-10">
                {result.cosmicFormula}
              </p>
            </div>

            {/* Main analysis */}
            <div className="p-6 rounded-2xl bg-space-900/40 border border-white/5 space-y-4">
              <h5 className="font-display font-bold text-base text-white flex items-center justify-end gap-2 border-b border-white/10 pb-2">
                <span>التحليل الفلسفي الاستراتيجي</span>
                <Compass className="w-4 h-4 text-nebula-purple" />
              </h5>

              <div className="text-sm font-sans font-light text-slate-200 leading-loose whitespace-pre-line text-right">
                {result.analysis}
              </div>
            </div>

            {/* Recommendations checklist */}
            <div className="p-6 rounded-2xl bg-space-900/40 border border-white/5 space-y-4">
              <h5 className="font-display font-bold text-base text-white flex items-center justify-end gap-2 border-b border-white/10 pb-2">
                <span>توجيهات العمل المدارية (Orbital Directives)</span>
                <Cpu className="w-4 h-4 text-nebula-cyan" />
              </h5>

              <div className="flex flex-col gap-3 mt-3">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-space-950/60 p-4 rounded-xl border border-white/5 text-right">
                    <div className="p-1 rounded-full bg-nebula-cyan/10 border border-nebula-cyan/20 text-nebula-cyan shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-300 font-sans font-light leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
