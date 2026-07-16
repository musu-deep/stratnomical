# استراتنموي | Stratnomical

منصة بودكاست عربية تفاعلية تمزج **الفكر الاستراتيجي** بظواهر الفيزياء والكون، وتحوّل المفاهيم الفلكية إلى أدوات للتفكير في الأعمال والأسواق والمنتجات وتطوير الذات.

## مكونات المنصة

- **أثير البودكاست:** حلقات نصية وصوت تركيبي مع مشهد بصري كوني تفاعلي.
- **المستشار الكوني:** يحلل المعضلات الاستراتيجية عبر Gemini، مع محاكي محلي احتياطي عند غياب المفتاح أو تعذر الاتصال.
- **مختبر المحاكاة:** تجربة مرئية لتغيير مؤشرات الجاذبية والسرعة والجسيمات.
- **مفكرة الأثير:** حفظ الأفكار والملاحظات محلياً في المتصفح.
- واجهة عربية RTL متجاوبة مبنية بأسلوب زجاجي وفضائي.

## التقنيات

- React 19 + TypeScript
- Vite + Tailwind CSS 4
- Express
- Google GenAI SDK
- Canvas API + Web Audio API

## التشغيل المحلي

### المتطلبات

- Node.js 20 أو أحدث
- npm 10 أو أحدث

### الخطوات

```bash
npm install
cp .env.example .env
npm run dev
```

في Windows PowerShell استخدم:

```powershell
Copy-Item .env.example .env
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## متغيرات البيئة

| المتغير | مطلوب | الوصف |
|---|---:|---|
| `GEMINI_API_KEY` | لا | مفتاح Gemini. عند غيابه يعمل المستشار بنمط المحاكاة المحلية. |
| `GEMINI_MODEL` | لا | النموذج المستخدم، والقيمة الافتراضية `gemini-3.5-flash`. |
| `PORT` | لا | منفذ الخادم، والافتراضي `3000`. |
| `APP_URL` | لا | الرابط العام للتطبيق بعد النشر. |

> لا تضع المفتاح الحقيقي داخل الكود أو `render.yaml`، ولا ترفع ملف `.env` إلى GitHub.

## أوامر المشروع

```bash
npm run dev        # تشغيل التطوير
npm run typecheck  # فحص TypeScript
npm run build      # إنشاء نسخة الإنتاج
npm start          # تشغيل نسخة الإنتاج بعد البناء
npm run check      # فحص TypeScript ثم البناء
npm run clean      # حذف مجلد dist
```


## الرفع إلى GitHub

أنشئ مستودعاً فارغاً في GitHub، ثم نفّذ من داخل مجلد المشروع:

```bash
git init
git add .
git commit -m "Initial release: Stratnomical platform"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

لا تضف ملف `README` أو `.gitignore` جديداً من واجهة GitHub عند إنشاء المستودع، لأن المشروع يحتويهما بالفعل.

## النشر على Render

المشروع Full-Stack ويحتوي على مسار API، لذلك يحتاج **Web Service** وليس استضافة ملفات ثابتة فقط. يوجد ملف `render.yaml` جاهز:

1. ارفع المشروع إلى GitHub.
2. أنشئ Blueprint أو Web Service في Render من المستودع.
3. أضف قيمة `GEMINI_API_KEY` في Environment إن أردت تشغيل الذكاء الحقيقي.
4. مسار فحص الصحة هو `/api/health`.

إعدادات النشر اليدوية:

```text
Build Command: npm ci && npm run build
Start Command: npm start
Health Check: /api/health
```

## الأمان والخصوصية

- مفتاح Gemini يبقى في الخادم ولا يُرسل إلى المتصفح.
- يوجد حد لحجم المدخلات وعدد طلبات المستشار لحماية المفتاح من الاستخدام المفرط.
- ملاحظات المستخدم تحفظ في `localStorage` داخل جهازه ولا تُرسل إلى خادم خارجي.

## فحص الجاهزية

```bash
npm ci
npm run check
```

حقوق المشروع محفوظة لصاحب المشروع. عدم وجود ترخيص مفتوح لا يمنح إذناً بإعادة الاستخدام أو التوزيع.
