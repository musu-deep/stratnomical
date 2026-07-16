import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Calendar, Tag, Search, Sparkles, FolderLock } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  date: string;
}

const STRATEGIC_TAGS = ["#ثقب_أسود", "#تمدد_تضخمي", "#مادة_مظلمة", "#أوتار_مهتزة", "#إنتروبيا", "#تطوير_ذاتي"];

export default function StrategyNotebook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("#ثقب_أسود");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("stratnomical_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load strategy notes:", e);
      }
    } else {
      // Seed initial sample note
      const initial: Note[] = [
        {
          id: "seed-1",
          title: "استراتيجية مقلاع الجاذبية لربع السنة القادم",
          content: "بدلاً من الصدام الإعلاني المباشر والمكلف مع المنافس المباشر العملاق، سنقوم بالاندماج مع خدمات الدفع المجانية الخاصة به وتوفير ميزة تكاملية ممتازة للعملاء، مما يسمح لنا بكسب تسارع وحصة سوقية كبيرة مستغلين قوة جاذبيته الضخمة بجهد تسويقي منخفض جداً.",
          tag: "#ثقب_أسود",
          date: "16 يوليو 2026"
        }
      ];
      setNotes(initial);
      localStorage.setItem("stratnomical_notes", JSON.stringify(initial));
    }
  }, []);

  // Save to LocalStorage
  const saveNotesToStorage = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem("stratnomical_notes", JSON.stringify(newNotes));
  };

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) return;

    const today = new Date();
    const formattedDate = today.toLocaleDateString("ar-SA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const newNote: Note = {
      id: Date.now().toString(),
      title: title,
      content: content,
      tag: selectedTag,
      date: formattedDate
    };

    const updated = [newNote, ...notes];
    saveNotesToStorage(updated);

    // Reset inputs
    setTitle("");
    setContent("");
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotesToStorage(updated);
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag ? n.tag === filterTag : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 relative overflow-hidden" id="strategy-notebook-root">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">

        {/* ADD NOTE FORM */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h3 className="text-lg font-display font-bold text-white flex items-center justify-end gap-2 mb-1">
              <span>صياغة معادلة استراتيجية جديدة</span>
              <BookOpen className="w-5 h-5 text-nebula-purple" />
            </h3>
            <p className="text-xs text-slate-400 font-light">
              سجل خواطرك الفلسفية، واكتب استراتيجيات مشروعك المستوحاة من مدارات الأثير الكوني لتصنع دليلاً مرجعياً لنفسك.
            </p>
          </div>

          <div className="space-y-3 bg-space-950/70 p-4 rounded-xl border border-white/5">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="note-title-input" className="text-[11px] text-slate-400 font-mono block">[ عنوان الفكرة أو المعادلة ]</label>
              <input
                id="note-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تطبيق الرنين الاستراتيجي للمنتج..."
                className="w-full p-2.5 rounded-lg bg-space-900 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-nebula-cyan text-right font-sans"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label htmlFor="note-content-textarea" className="text-[11px] text-slate-400 font-mono block">[ التفاصيل والخطوات الاستراتيجية ]</label>
              <textarea
                id="note-content-textarea"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="تفاصيل التفكير، ما هو الإسقاط الكوني للظاهرة، وكيف ستترجمها عملياً على أرقامك أو فريق عملك..."
                className="w-full p-2.5 rounded-lg bg-space-900 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-nebula-cyan text-right font-sans leading-relaxed"
              />
            </div>

            {/* Tag Selection */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-mono block">[ تصنيف الرمز الفلكي ]</span>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {STRATEGIC_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                      selectedTag === tag
                        ? "bg-nebula-cyan/20 border border-nebula-cyan/40 text-nebula-cyan"
                        : "bg-space-900 border border-white/5 text-slate-400 hover:text-slate-300"
                    }`}
                    id={`tag-btn-select-${tag.slice(1)}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleAddNote}
              disabled={!title.trim() || !content.trim()}
              className={`w-full py-2.5 rounded-lg font-display text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                title.trim() && content.trim()
                  ? "bg-gradient-to-r from-nebula-cyan to-nebula-purple hover:opacity-90"
                  : "bg-slate-800/40 text-slate-500 cursor-not-allowed border border-white/5"
              }`}
              id="add-note-btn"
            >
              <span>تسجيل المعادلة في الأثير</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NOTES GRID VIEW */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Filter, search and header tools */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <h4 className="text-base font-display font-semibold text-slate-200 text-center md:text-right w-full md:w-auto">
              معادلاتك المدونة ({filteredNotes.length})
            </h4>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-56">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في الخواطر..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-space-900 border border-white/10 text-xs text-white placeholder-slate-600 text-right focus:outline-none focus:border-nebula-cyan font-sans"
                  id="search-notes-input"
                />
              </div>
            </div>
          </div>

          {/* Quick Tag Filter Rail */}
          <div className="flex flex-wrap gap-1.5 justify-start border-b border-white/5 pb-2">
            <button
              onClick={() => setFilterTag(null)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                filterTag === null
                  ? "bg-white/10 border border-white/20 text-white"
                  : "bg-space-900 border border-white/5 text-slate-400 hover:text-slate-300"
              }`}
              id="tag-filter-btn-all"
            >
              الكل
            </button>
            {STRATEGIC_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                  filterTag === tag
                    ? "bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple"
                    : "bg-space-900 border border-white/5 text-slate-400 hover:text-slate-200"
                }`}
                id={`tag-filter-btn-${tag.slice(1)}`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* NOTES LIST CONTAINER */}
          <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-white/10 rounded-xl bg-space-900/10">
                <FolderLock className="w-8 h-8 text-slate-600 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">سجل فضاء معادلاتك فارغ حالياً.</p>
                  <p className="text-[10px] text-slate-600">اكتب فكرة ملهمة على اليمين لتسجيلها في مدار الأثير.</p>
                </div>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-space-900/40 hover:bg-space-900/60 border border-white/5 transition-all text-right group relative"
                  id={`note-card-${note.id}`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                      id={`delete-note-btn-${note.id}`}
                      title="حذف المعادلة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[9px] font-mono text-nebula-purple px-2 py-0.5 rounded-full bg-nebula-purple/10 border border-nebula-purple/20">
                          {note.tag}
                        </span>
                        <h5 className="font-display font-bold text-sm text-white">
                          {note.title}
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {note.date}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans font-light leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
