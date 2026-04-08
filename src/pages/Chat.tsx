import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/be667513-6940-4936-b35a-e448a3aa2f17";

interface Message {
  id: string;
  role: "user" | "assistant";
  type: "text" | "image";
  text: string;
  image_url?: string;
  loading?: boolean;
}

const SUGGESTIONS = [
  { icon: "Pen", label: "Напиши пост для Instagram", prompt: "Напиши яркий продающий пост для Instagram для кофейни. Включи хэштеги." },
  { icon: "Image", label: "Нарисуй картинку", prompt: "Нарисуй красивый логотип для IT-стартапа в стиле минимализм, фиолетовые и синие цвета" },
  { icon: "Search", label: "SEO-статья", prompt: "Напиши SEO-статью на 500 слов на тему «Как выбрать CRM для малого бизнеса»" },
  { icon: "ShoppingBag", label: "Описание товара", prompt: "Напиши продающее описание для интернет-магазина: беспроводные наушники Sony WH-1000XM5" },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      type: "text",
      text: "Привет! Я Guest — твой AI-ассистент 👋\n\nЯ умею:\n• Писать тексты, посты, статьи, скрипты\n• **Рисовать картинки** по твоему описанию\n• Помогать с маркетингом и бизнесом\n• Отвечать на любые вопросы\n\nПопробуй написать что-нибудь или выбери подсказку ниже!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      type: "text",
      text: text.trim(),
    };

    const loadingMsg: Message = {
      id: "loading",
      role: "assistant",
      type: "text",
      text: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => !m.loading && m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.text }));

      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), messages: history }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: Date.now().toString() + "_ai",
        role: "assistant",
        type: data.type || "text",
        text: data.text || "Произошла ошибка, попробуй ещё раз.",
        image_url: data.image_url,
      };

      setMessages((prev) => [...prev.filter((m) => m.id !== "loading"), assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading"),
        {
          id: Date.now().toString() + "_err",
          role: "assistant",
          type: "text",
          text: "Не удалось получить ответ. Проверь подключение к интернету.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatText = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/`(.*?)`/g, "<code class='bg-white/10 px-1 rounded text-cyan-300 font-mono text-sm'>$1</code>");
        if (line.startsWith("• ") || line.startsWith("- ")) {
          return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s/, "") }} />;
        }
        return <p key={i} className={line === "" ? "h-2" : ""} dangerouslySetInnerHTML={{ __html: formatted }} />;
      });
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090F] font-golos">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 h-16 glass border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
              <Icon name="Sparkles" size={14} className="text-white" />
            </div>
            <div>
              <div className="font-montserrat font-black text-sm text-white leading-none">Guest AI</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-lime-400 text-xs font-golos">онлайн</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            onClick={() => setMessages([{
              id: "welcome",
              role: "assistant",
              type: "text",
              text: "Привет! Я Guest — твой AI-ассистент 👋\n\nЯ умею:\n• Писать тексты, посты, статьи, скрипты\n• **Рисовать картинки** по твоему описанию\n• Помогать с маркетингом и бизнесом\n• Отвечать на любые вопросы\n\nПопробуй написать что-нибудь или выбери подсказку ниже!",
            }])}
            title="Новый чат"
          >
            <Icon name="RotateCcw" size={16} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name="Sparkles" size={13} className="text-white" />
                </div>
              )}

              {/* Bubble */}
              <div className={`max-w-[80%] sm:max-w-[70%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {msg.loading ? (
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 border border-white/5">
                    <TypingDots />
                  </div>
                ) : msg.type === "image" && msg.image_url ? (
                  <div className="space-y-2">
                    <div className="glass rounded-2xl rounded-tl-sm p-1 border border-white/10 overflow-hidden">
                      <img
                        src={msg.image_url}
                        alt="Generated"
                        className="rounded-xl max-w-full w-full sm:w-80"
                        loading="lazy"
                      />
                    </div>
                    {msg.text && (
                      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 border border-white/5 text-white/80 text-sm leading-relaxed">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-violet-600 to-pink-600 text-white rounded-tr-sm"
                      : "glass border border-white/5 text-white/85 rounded-tl-sm"
                  }`}>
                    <div className="space-y-0.5">{formatText(msg.text)}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions (only when empty) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.prompt)}
                className="glass border border-white/5 hover:border-violet-500/30 rounded-2xl p-3 text-left transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <Icon name={s.icon} size={16} className="text-violet-400 mb-2 group-hover:scale-110 transition-transform" fallback="Sparkles" />
                <div className="text-white/60 text-xs font-golos leading-snug">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 sm:pb-6 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl border border-white/10 focus-within:border-violet-500/40 transition-colors flex items-end gap-2 px-4 py-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напиши сообщение... (Shift+Enter для новой строки)"
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none resize-none font-golos leading-relaxed max-h-32 disabled:opacity-50"
              style={{ minHeight: "24px" }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform disabled:opacity-30 disabled:scale-100"
            >
              <Icon name="Send" size={15} className="text-white" />
            </button>
          </div>
          <p className="text-center text-white/20 text-xs mt-2 font-golos">
            Guest AI может ошибаться. Проверяй важную информацию.
          </p>
        </div>
      </div>
    </div>
  );
}