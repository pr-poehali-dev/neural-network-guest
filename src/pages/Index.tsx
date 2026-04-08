import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Примеры", href: "#examples" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const FEATURES = [
  {
    icon: "Sparkles",
    title: "Генерация текста",
    desc: "Создавайте статьи, посты, описания продуктов и рекламные тексты за секунды. AI понимает контекст и стиль вашего бизнеса.",
    color: "from-violet-500 to-purple-700",
    glow: "hover:glow-violet",
  },
  {
    icon: "Image",
    title: "Генерация изображений",
    desc: "Профессиональные иллюстрации, логотипы, баннеры и арты по текстовому описанию. Без дизайнера.",
    color: "from-pink-500 to-rose-700",
    glow: "hover:glow-pink",
  },
  {
    icon: "Zap",
    title: "Мгновенная скорость",
    desc: "В 10× быстрее ChatGPT. Ответ за 0.3 секунды. Работает без ограничений и очередей даже в пиковое время.",
    color: "from-cyan-400 to-blue-600",
    glow: "hover:glow-cyan",
  },
  {
    icon: "Brain",
    title: "Память контекста",
    desc: "Помнит всю историю вашего проекта. Не нужно объяснять одно и то же снова — AI строит на предыдущих ответах.",
    color: "from-lime-400 to-green-600",
    glow: "",
  },
  {
    icon: "Globe",
    title: "50+ языков",
    desc: "Переводит и создаёт контент на любом языке мира с сохранением тона и смысла. Русский — на высшем уровне.",
    color: "from-orange-400 to-red-600",
    glow: "",
  },
  {
    icon: "Shield",
    title: "Безопасность данных",
    desc: "Данные шифруются и никогда не используются для обучения. Соответствует GDPR и российским требованиям.",
    color: "from-violet-400 to-indigo-600",
    glow: "",
  },
];

const COMPARE = [
  { feature: "Скорость ответа", guest: "0.3 сек", chatgpt: "2–5 сек" },
  { feature: "Генерация изображений", guest: "Встроено", chatgpt: "Платно отдельно" },
  { feature: "Память контекста", guest: "Безлимит", chatgpt: "128K токенов" },
  { feature: "Русскоязычная поддержка", guest: "24/7 на русском", chatgpt: "Английский приоритет" },
  { feature: "Очереди в пиковое время", guest: "Нет очередей", chatgpt: "Частые задержки" },
  { feature: "Цена", guest: "От 490 ₽/мес", chatgpt: "От $20/мес" },
];

const PRICING = [
  {
    name: "Старт",
    price: "490",
    period: "мес",
    desc: "Для частных пользователей и фрилансеров",
    features: ["100 000 токенов/мес", "500 изображений", "10 языков", "Email поддержка"],
    cta: "Начать бесплатно",
    highlight: false,
    badge: null,
  },
  {
    name: "Про",
    price: "1 490",
    period: "мес",
    desc: "Для малого бизнеса и команд до 5 человек",
    features: ["Безлимит токенов", "5 000 изображений", "50+ языков", "Приоритетная поддержка", "API доступ"],
    cta: "Выбрать Про",
    highlight: true,
    badge: "Популярный",
  },
  {
    name: "Бизнес",
    price: "4 990",
    period: "мес",
    desc: "Для крупных команд и корпораций",
    features: ["Всё из Про", "Команда до 20 чел.", "Выделенный сервер", "SLA 99.9%", "Персональный менеджер"],
    cta: "Связаться с нами",
    highlight: false,
    badge: null,
  },
];

const EXAMPLES = [
  { tag: "Маркетинг", title: "Продающий лендинг за 3 минуты", desc: "Полный текст для лендинга SaaS-продукта с заголовками, описаниями и CTA" },
  { tag: "SMM", title: "30 постов для Instagram", desc: "Контент-план на месяц с идеями, текстами и хэштегами для бьюти-бренда" },
  { tag: "Изображения", title: "Логотип и фирменный стиль", desc: "Серия изображений в едином стиле для стартапа по запросу в одну строку" },
  { tag: "SEO", title: "Статья на 5000 слов", desc: "Оптимизированная статья для блога с ключевыми словами, структурой и мета-тегами" },
  { tag: "E-commerce", title: "1000 описаний товаров", desc: "Уникальные описания для каталога интернет-магазина одежды за 20 минут" },
  { tag: "HR", title: "Вакансии и офферы", desc: "Привлекательные тексты вакансий и персонализированные офферы кандидатам" },
];

const VERSIONS = [
  { version: "v3.0", date: "Апрель 2026", title: "Мультимодальность", desc: "Анализ видео и аудио файлов, распознавание речи", status: "current" },
  { version: "v2.5", date: "Январь 2026", title: "Генерация изображений", desc: "Интегрирован FLUX и Stable Diffusion", status: "released" },
  { version: "v2.0", date: "Октябрь 2025", title: "Память контекста", desc: "Безлимитная история диалогов", status: "released" },
  { version: "v1.0", date: "Июль 2025", title: "Запуск", desc: "Первая публичная версия платформы", status: "released" },
];

const FAQ_ITEMS = [
  { q: "Чем Guest лучше ChatGPT?", a: "Guest работает в 10× быстрее, включает генерацию изображений без доплат, имеет безлимитную память контекста и стоит дешевле. Плюс — полная поддержка русского языка на уровне родного." },
  { q: "Можно ли попробовать бесплатно?", a: "Да! Тариф «Старт» включает бесплатный пробный период 14 дней без ввода карты. Просто зарегистрируйтесь." },
  { q: "Как подключить API?", a: "В тарифе «Про» и «Бизнес» доступна документация и API-ключи в личном кабинете. Подключение занимает 5 минут." },
  { q: "Данные в безопасности?", a: "Мы используем шифрование AES-256. Данные хранятся на серверах в России. Никогда не передаются третьим лицам и не используются для обучения моделей." },
  { q: "Есть ли мобильное приложение?", a: "Веб-версия полностью адаптирована для мобильных. Нативные приложения для iOS и Android в разработке — выйдут в Q3 2026." },
];

const MARQUEE_ITEMS = [
  "Генерация текста", "AI изображения", "SEO контент", "Email рассылки",
  "Посты для соцсетей", "Описания товаров", "Переводы", "Скрипты продаж",
  "Генерация текста", "AI изображения", "SEO контент", "Email рассылки",
  "Посты для соцсетей", "Описания товаров", "Переводы", "Скрипты продаж",
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#" className="font-montserrat font-black text-xl tracking-tight">
          <span className="gradient-text">Guest</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-golos">
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm text-white/70 hover:text-white px-4 py-2 transition-colors font-golos">Войти</button>
          <button className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:scale-105 transition-transform duration-200 shadow-lg font-montserrat">
            Попробовать
          </button>
        </div>
        <button className="md:hidden text-white/80" onClick={() => setOpen(!open)}>
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>
      {open && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white py-1 font-golos" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <button className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-montserrat">
            Попробовать бесплатно
          </button>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[-5%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-xs text-violet-300 mb-8 animate-fade-in font-golos">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse inline-block" />
          Версия 3.0 — Мультимодальность уже доступна
        </div>

        <h1 className="font-montserrat font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <span className="text-white">AI, который</span>
          <br />
          <span className="gradient-text">превосходит</span>
          <br />
          <span className="text-white">всё</span>
        </h1>

        <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-golos leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          Генерация текста и изображений за секунды. В 10 раз быстрее ChatGPT, дешевле и с безлимитной памятью. Для бизнеса, маркетологов и создателей.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <button className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white font-montserrat font-bold text-base hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2">
            Попробовать бесплатно
            <Icon name="ArrowRight" size={18} />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl glass border border-white/10 text-white font-golos font-medium text-base hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2">
            <Icon name="Play" size={16} />
            Смотреть демо
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
          {[
            { val: "10×", label: "Быстрее ChatGPT" },
            { val: "50K+", label: "Пользователей" },
            { val: "99.9%", label: "Uptime" },
            { val: "14 дней", label: "Бесплатно" },
          ].map((s) => (
            <div key={s.val} className="glass rounded-2xl p-4 border border-white/5">
              <div className="font-montserrat font-black text-2xl sm:text-3xl gradient-text">{s.val}</div>
              <div className="text-white/50 text-sm mt-1 font-golos">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <div className="overflow-hidden border-y border-white/5 py-4 bg-white/[0.02]">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-white/40 text-sm font-golos flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="section-pad">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-violet-400 text-sm font-montserrat font-semibold uppercase tracking-widest">Возможности</span>
          <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mt-3 mb-4">
            Всё что нужно —<br /><span className="gradient-text">в одном месте</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto font-golos">Больше не нужно платить за несколько сервисов. Guest объединяет всё.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`group glass rounded-3xl p-7 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 ${f.glow}`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={f.icon} size={22} className="text-white" fallback="Sparkles" />
              </div>
              <h3 className="font-montserrat font-bold text-lg text-white mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-golos">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="font-montserrat font-black text-3xl text-white">
              Guest <span className="gradient-text">vs</span> ChatGPT
            </h3>
          </div>
          <div className="max-w-3xl mx-auto glass rounded-3xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-6 py-3 text-xs font-montserrat font-semibold uppercase tracking-wider">
              <span className="text-white/40">Параметр</span>
              <span className="text-center gradient-text">Guest</span>
              <span className="text-center text-white/40">ChatGPT</span>
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 items-center ${i % 2 === 0 ? 'bg-white/[0.01]' : ''} border-t border-white/5`}>
                <span className="text-white/60 text-sm font-golos">{row.feature}</span>
                <span className="text-center text-sm font-semibold font-golos flex items-center justify-center gap-1.5 text-lime-400">
                  <Icon name="Check" size={13} className="text-lime-400 flex-shrink-0" />
                  {row.guest}
                </span>
                <span className="text-center text-sm text-white/30 font-golos">{row.chatgpt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-violet-400 text-sm font-montserrat font-semibold uppercase tracking-widest">Тарифы</span>
          <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mt-3 mb-4">
            Честные цены,<br /><span className="gradient-text">без сюрпризов</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto font-golos">14 дней бесплатно на любом тарифе. Без ввода карты.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((plan) => (
            <div key={plan.name} className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
              plan.highlight
                ? 'bg-gradient-to-b from-violet-600/20 to-pink-600/10 border border-violet-500/40 glow-violet'
                : 'glass border border-white/5 hover:border-white/15'
            }`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-montserrat font-bold whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <div className="font-montserrat font-black text-xl text-white mb-1">{plan.name}</div>
                <div className="text-white/50 text-sm font-golos">{plan.desc}</div>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-montserrat font-black text-4xl text-white">{plan.price} ₽</span>
                <span className="text-white/40 text-sm font-golos">/ {plan.period}</span>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70 font-golos">
                    <Icon name="Check" size={15} className="text-lime-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3.5 rounded-2xl font-montserrat font-bold text-sm transition-all duration-200 hover:scale-105 ${
                plan.highlight
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg'
                  : 'glass border border-white/15 text-white hover:border-white/30'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExamplesSection() {
  return (
    <section id="examples" className="section-pad">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-violet-400 text-sm font-montserrat font-semibold uppercase tracking-widest">Примеры</span>
          <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mt-3 mb-4">
            Что умеет<br /><span className="gradient-text">Guest</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="group glass rounded-3xl p-6 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-montserrat font-semibold mb-4">{ex.tag}</span>
              <h3 className="font-montserrat font-bold text-white text-base mb-2">{ex.title}</h3>
              <p className="text-white/50 text-sm font-golos leading-relaxed">{ex.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity font-golos">
                Подробнее <Icon name="ArrowRight" size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VersionsSection() {
  return (
    <section id="versions" className="section-pad">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-violet-400 text-sm font-montserrat font-semibold uppercase tracking-widest">История версий</span>
          <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mt-3 mb-4">
            Мы постоянно<br /><span className="gradient-text">становимся лучше</span>
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-600 via-pink-600 to-transparent" />
          <div className="space-y-8">
            {VERSIONS.map((v, i) => (
              <div key={i} className="relative flex gap-6">
                <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  v.status === 'current'
                    ? 'bg-gradient-to-br from-violet-600 to-pink-600 text-white glow-violet'
                    : 'glass border border-white/10 text-white/50'
                }`}>
                  {v.status === 'current'
                    ? <Icon name="Zap" size={18} className="text-white" />
                    : <Icon name="Check" size={16} className="text-white/40" />}
                </div>
                <div className="flex-1 glass rounded-2xl p-5 border border-white/5">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-montserrat font-black text-white text-base">{v.version} — {v.title}</span>
                    {v.status === 'current' && <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 text-xs font-semibold font-montserrat">Текущая</span>}
                  </div>
                  <p className="text-white/50 text-sm font-golos">{v.desc}</p>
                  <span className="text-white/30 text-xs mt-2 block font-golos">{v.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section-pad">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-violet-400 text-sm font-montserrat font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mt-3">
            Частые<br /><span className="gradient-text">вопросы</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`glass rounded-2xl border transition-all duration-300 ${open === i ? 'border-violet-500/30' : 'border-white/5 hover:border-white/10'}`}>
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-montserrat font-semibold text-white text-sm sm:text-base pr-4">{item.q}</span>
                <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={18} className="text-white/40 flex-shrink-0" />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/60 text-sm leading-relaxed font-golos">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactsSection() {
  return (
    <section id="contacts" className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-violet-400 text-sm font-montserrat font-semibold uppercase tracking-widest">Контакты</span>
          <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mt-3 mb-4">
            Напишите нам
          </h2>
          <p className="text-white/50 font-golos">Ответим в течение одного рабочего дня</p>
        </div>
        <div className="glass rounded-3xl border border-white/5 p-8 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white/50 text-xs font-montserrat font-semibold uppercase tracking-wider block mb-2">Имя</label>
              <input className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 border border-white/5 focus:border-violet-500/50 outline-none transition-colors font-golos" placeholder="Ваше имя" />
            </div>
            <div>
              <label className="text-white/50 text-xs font-montserrat font-semibold uppercase tracking-wider block mb-2">Email</label>
              <input type="email" className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 border border-white/5 focus:border-violet-500/50 outline-none transition-colors font-golos" placeholder="email@example.com" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-white/50 text-xs font-montserrat font-semibold uppercase tracking-wider block mb-2">Сообщение</label>
            <textarea rows={4} className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 border border-white/5 focus:border-violet-500/50 outline-none transition-colors resize-none font-golos" placeholder="Расскажите о вашем запросе..." />
          </div>
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-montserrat font-bold hover:scale-[1.02] transition-transform duration-200 shadow-xl">
            Отправить сообщение
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/40 text-sm">
          <a href="mailto:hello@guest.ai" className="flex items-center gap-2 hover:text-white/70 transition-colors font-golos">
            <Icon name="Mail" size={15} /> hello@guest.ai
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white/70 transition-colors font-golos">
            <Icon name="MessageCircle" size={15} /> Telegram
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white/70 transition-colors font-golos">
            <Icon name="Phone" size={15} /> +7 (800) 000-00-00
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-montserrat font-black text-xl gradient-text">Guest</span>
        <p className="text-white/30 text-xs font-golos">© 2026 Guest AI. Все права защищены.</p>
        <div className="flex gap-5 text-white/30 text-xs font-golos">
          <a href="#" className="hover:text-white/60 transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-white/60 transition-colors">Оферта</a>
        </div>
      </div>
    </footer>
  );
}

const Index = () => {
  return (
    <div className="bg-[#09090F] min-h-screen font-golos">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <PricingSection />
      <ExamplesSection />
      <VersionsSection />
      <FaqSection />
      <ContactsSection />
      <Footer />
    </div>
  );
};

export default Index;
