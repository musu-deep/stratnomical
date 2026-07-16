import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const MAX_DILEMMA_LENGTH = 3000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 12;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "32kb" }));

type RateLimitEntry = { count: number; resetAt: number };
const requestCounters = new Map<string, RateLimitEntry>();

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestCounters.entries()) {
    if (entry.resetAt <= now) requestCounters.delete(key);
  }
}, RATE_LIMIT_WINDOW_MS);
cleanupTimer.unref();

app.use("/api/cosmic-consultant", (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const existing = requestCounters.get(key);

  if (!existing || existing.resetAt <= now) {
    requestCounters.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    res.setHeader("Retry-After", retryAfterSeconds.toString());
    return res.status(429).json({
      error: "تم بلوغ الحد المؤقت للاستشارات. الرجاء المحاولة بعد قليل.",
    });
  }

  existing.count += 1;
  requestCounters.set(key, existing);
  return next();
});

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "stratnomical-server",
        },
      },
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Falling back to high-fidelity Cosmic Strategy Simulator.");
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "stratnomical",
    aiMode: ai ? "gemini" : "simulator",
  });
});

// Simulated fallback database of cosmic strategy mappings
const simulatedResponses = [
  {
    cosmicPhenomenon: "أفق الحدث للثقب الأسود (Black Hole Event Horizon)",
    analysis: `مشكلتك تشبه تماماً الاقتراب من **أفق الحدث** للثقب الأسود. في الفيزياء، أفق الحدث هو نقطة اللاعودة؛ أي شيء يعبره ينجذب بشكل حتمي نحو التفرد (Singularity).
    في عالم الأعمال، شركتك تقف حالياً على حافة قرار مصيري (سواء كان استثماراً ضخماً، أو تأخراً في التطوير، أو نموذج ربحي غير مستدام). القوة الجاذبة للمنافسين أو الديون تسحبك للداخل. إذا واصلت السير في نفس المدار دون اتخاذ "مناورة المقلاع"، ستتجاوز أفق الحدث حيث لا تنفع الاستراتيجيات التقليدية.`,
    recommendations: [
      "تقليص النفقات الهامشية فوراً لتقليل كتلة الشركة وزيادة سرعة الاستجابة.",
      "تطبيق استراتيجية 'أفق الحدث': اتخاذ قرار حاسم بالتحول الكامل (Pivot) قبل تجاوز نقطة اللاعودة المتمثلة في نفاد السيولة.",
      "توليد طاقة طاردة متمثلة في ميزة تنافسية خارقة وصادمة للأسواق لإعادة توجيه المسار الجاذب."
    ],
    cosmicFormula: "E = MC² (البقاء = المرونة الكامنة × التغيير الحاسم²)"
  },
  {
    cosmicPhenomenon: "تمدد التضخم الكوني (Cosmic Inflation & Big Bang)",
    analysis: `إن حالة سوقك والنمو الذي تطمح إليه يشبهان فترة **التضخم الكوني السريع** التي تلت الانفجار العظيم مباشرة. في هذه اللحظات، يتمدد الكون بسرعة تفوق سرعة الضوء بفضل طاقة الفراغ.
    عملك الآن يحتاج إلى 'انفجار عظيم' خاص بالمنتج (Product Launch) مستغلاً فراغاً جلياً في السوق. تمدد السوق سريع، لكن العبرة ليست فقط في التوسع العشوائي بل في كيفية تكثيف الغبار الكوني لاحقاً ليشكل مجرات صلبة (قاعدة عملاء أوفياء). التوسع دون تماسك بنيوي سيؤدي إلى تشتت الطاقة و برودتها التامة.`,
    recommendations: [
      "ركز أولاً على تركيز المادة المظلمة (قيمتك غير المرئية كالثقافة والعلاقات العامة) لدعم التمدد السريع.",
      "لا تطلق منتجك في الفضاء المفتوح دفعة واحدة؛ بل حدد 'نقطة الانفجار الساخنة' وهي الشريحة الأكثر احتياجاً.",
      "استفد من قوانين الانتشار الكوني من خلال توظيف سفراء علامتك التجارية ليكونوا بمثابة قوى الجاذبية المحلية."
    ],
    cosmicFormula: "V = H × D (سرعة التوسع = ثابت الشغف × المسافة عن المنافسين)"
  },
  {
    cosmicPhenomenon: "المادة المظلمة للهوية الاستراتيجية (Dark Matter of Strategy)",
    analysis: `المادة المظلمة تشكل حوالي 85% من المادة الكلية في الكون. هي غير مرئية، لا تصدر ضوءاً ولا تعكسه، ولكن بدون جاذبيتها العظمى، لتشتت المجرات وتناثرت في الفضاء السحيق.
    في شركتك ومبيعاتك، أنت تركز فقط على المادة المرئية (الإيرادات، الأرقام المباشرة، الإعلانات). لكن المشكلة الحقيقية تكمن في **المادة المظلمة لمشروعك**: الثقة بين الفريق، ولاء العملاء العاطفي، الفلسفة العميقة لمنتجك، وسمعة العلامة التجارية غير الملموسة. بدون تقوية هذه المادة المظلمة، ستتفكك مجرتك التجارية عند أول عاصفة كونية.`,
    recommendations: [
      "أعد استثمار 30% من وقتك في تعزيز ثقافة العمل الداخلية والتماسك الفلسفي لمنتجك.",
      "اهتم بخدمة ما بعد البيع وبناء المجتمع؛ إنها القوة غير المرئية التي تجعل العميل يدور في فلكك للأبد.",
      "اجعل رسالتك الفلسفية واضحة ومغناطيسية تجذب الكفاءات دون الحاجة لضخ رواتب فلكية."
    ],
    cosmicFormula: "F = G × (M1 × M2) / R² (قوة تماسك الشركة = ثابت الثقة × تجانس القيم / المسافة الفكرية²)"
  },
  {
    cosmicPhenomenon: "مستعر أعظم وتجدد النجوم (Supernova & Star Rebirth)",
    analysis: `عندما ينتهي وقود نجم ضخم، فإنه ينهار على نفسه لينفجر في حدث كوني مهيب يسمى **المستعر الأعظم (Supernova)**، قاذفاً عناصر ثقيلة تشكل كواكب وحيوات جديدة.
    شركتك أو منتجك الحالي يمر بمرحلة احتضار النجم الراكد. النماذج القديمة لم تعد تولد طاقة كافية لمقاومة الجاذبية الداخلية للإنتروبيا والتكلفة. الحل ليس الترقيع الفني، بل هو إعلان الانفجار الأعظم لعلامتك التجارية! يجب إنهاء دورة حياة المنتج القديم بشجاعة لتوليد سديم كوني جديد مليء بالمعادن والمكونات المبتكرة التي ستصنع كواكب ومنتجات ثورية جديدة.`,
    recommendations: [
      "أعلن بجرأة عن إيقاف خطوط الإنتاج والخدمات التقليدية التي تستنزف الطاقة دون نمو حقيقي.",
      "أعد تدوير الرماد والغبار الكوني (الخبرات السابقة، قاعدة العملاء القديمة، الدروس المستفادة) لتأسيس مشروعك القادم.",
      "استغل ضوء الانفجار (الحملة التسويقية للتحول الهيكلي) للفت انظار المجرة الاستثمارية بأكملها."
    ],
    cosmicFormula: "E = Δm × c² (الطاقة المتولدة = كتلة الأفكار المتحولة × سرعة الإبداع²)"
  }
];

// API endpoint for Cosmic Consultant using server-side Gemini or simulator fallback
app.post("/api/cosmic-consultant", async (req, res) => {
  const dilemma = typeof req.body?.dilemma === "string" ? req.body.dilemma.trim() : "";

  if (!dilemma) {
    return res.status(400).json({ error: "الرجاء كتابة معضلتك التجارية أو الفكرية أولاً." });
  }

  if (dilemma.length > MAX_DILEMMA_LENGTH) {
    return res.status(400).json({
      error: `النص طويل جداً. الحد الأقصى هو ${MAX_DILEMMA_LENGTH} حرفاً.`,
    });
  }

  // If Gemini client is active, call the API
  if (ai) {
    try {
      console.log(`Querying Gemini with dilemma: "${dilemma}"`);
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `أنت فيلسوف استراتيجي كوني بارع وعالم فلك فذ، تتحدث باللغة العربية الفصحى البليغة والراقية جداً.
اسمك "المستشار الكوني" لبودكاست (استراتنموي - Stratnomical) الذي يدمج عمق الفكر الاستراتيجي والغموض الكوني مع مسارات الأعمال وتقلبات الأسواق والتنافسية والمنتجات والتطوير الذاتي.

لقد طرح عليك أحد المستمعين أو رواد الأعمال هذه المعضلة أو التحدي في عمله أو حياته المهنية:
"${dilemma}"

مهمتك هي تحليل هذه المعضلة وتقديم استشارة استراتيجية فلسفية فلكية مذهلة باللغة العربية الفصحى، مع إسقاط مباشر ومبهر لأحد الظواهر الفلكية أو القوانين الكونية عليها (مثل: الثقوب السوداء، أفق الحدث، المادة المظلمة، تمدد الكون، الانفجار العظيم، نظرية الأوتار، القصور الحراري/الإنتروبيا، المستعرات الأعظمية، السدم، الجاذبية الثقالية، الثقوب الدودية، النجوم النابضة Pulsars... إلخ).

يجب أن تقوم بإرجاع التحليل في صيغة JSON مطابقة تماماً للمواصفات التالية:
{
  "cosmicPhenomenon": "اسم الظاهرة الفلكية باللغة العربية مع اسمها الإنجليزي بين قوسين",
  "analysis": "تحليل فلسفي استراتيجي غني وعميق جداً باللغة العربية (يمكنك استخدام لغة مارك داون Markdown للتنسيق وإضافة رموز فضائية خفيفة)، يربط الظاهرة بالمعضلة التجارية بشكل مذهل ومبهر فكرياً وعصرياً ويشرح كيف ينطبق المفهوم الفلكي على واقعه.",
  "recommendations": [
    "توصية عملية أولى مصاغة بلغة فلكية استراتيجية جذابة وقابلة للتطبيق",
    "توصية عملية ثانية مصاغة بلغة فلكية استراتيجية جذابة وقابلة للتطبيق",
    "توصية عملية ثالثة مصاغة بلغة فلكية استراتيجية جذابة وقابلة للتطبيق"
  ],
  "cosmicFormula": "معادلة كونية رمزية تسقط الفكرة على الأعمال بأسلوب ممتع ومبتكر (على غرار E = MC²)"
}

الرجاء التأكد تماماً من إرجاع كود JSON صالح فقط ومباشر دون استخدام علامات الاقتباس الفوقية للكود مثل \`\`\`json أو أي نصوص إضافية قبل أو بعد الـ JSON.`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.85,
        },
      });

      const responseText = response.text ? response.text.trim() : "";
      console.log("Raw response from Gemini:", responseText);

      try {
        const parsedData = JSON.parse(responseText);
        return res.json(parsedData);
      } catch (parseError) {
        console.error("Failed to parse Gemini output as JSON, attempting cleanup", parseError);
        // Fallback cleanup if model wrapped it in code blocks despite instructions
        const cleanJson = responseText
          .replace(/^```json/i, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();
        const parsedData = JSON.parse(cleanJson);
        return res.json(parsedData);
      }
    } catch (apiError) {
      console.error("Gemini API call failed, falling back to simulator", apiError);
      // Fallback to random high fidelity simulation
      const randomIdx = Math.floor(Math.random() * simulatedResponses.length);
      const simulated = simulatedResponses[randomIdx];
      return res.json({
        ...simulated,
        analysis: `⚠️ (ملاحظة: المستشار الكوني يعمل حالياً بنمط المحاكاة الذاتية الطارئة)\n\n${simulated.analysis}`
      });
    }
  } else {
    // Return high quality simulated mapping based on keywords
    console.log("Using simulated response generator (no Gemini API key)");
    const dilemmaLower = dilemma.toLowerCase();
    let selected = simulatedResponses[0]; // Black Hole as default

    if (dilemmaLower.includes("نمو") || dilemmaLower.includes("توسع") || dilemmaLower.includes("انطلاق") || dilemmaLower.includes("منتج جديد") || dilemmaLower.includes("سوق")) {
      selected = simulatedResponses[1]; // Cosmic Inflation
    } else if (dilemmaLower.includes("هوية") || dilemmaLower.includes("ثقافة") || dilemmaLower.includes("ولاء") || dilemmaLower.includes("علامة") || dilemmaLower.includes("فريق")) {
      selected = simulatedResponses[2]; // Dark Matter
    } else if (dilemmaLower.includes("خسارة") || dilemmaLower.includes("فشل") || dilemmaLower.includes("تغيير") || dilemmaLower.includes("نهاية") || dilemmaLower.includes("تجديد")) {
      selected = simulatedResponses[3]; // Supernova
    } else {
      // Pick a random one for variety if no keyword matches
      selected = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
    }

    // Add a tiny random delay to simulate deep astronomical calculations
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return res.json({
      ...selected,
      analysis: `✨ **مرحباً بك في أثير استراتنموي.** لقد قمنا بتحليل معضلتك عبر مصفوفة الفيزياء الفلكية للأعمال:\n\n${selected.analysis}`
    });
  }
});

// Configure Vite or Static Assets
async function startServer() {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.npm_lifecycle_event === "start";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files serving from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stratnomical server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Stratnomical server:", error);
  process.exit(1);
});
