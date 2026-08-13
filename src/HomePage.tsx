import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { HardHat, Building2, Ruler, PenTool, DraftingCompass, Mountain, BookOpen, Calculator, ChevronDown, Globe } from 'lucide-react';
import './App.css';

type Language = 'fr' | 'en' | 'ar';
type YearId = 'y1' | 'y2' | 'y3' | 'y4';

interface Translation {
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  selectorHint: string;
  startButton: string;
  footerTitle: string;
  footerSubtitle: string;
  years: Record<YearId, string>;
}

const translations: Record<Language, Translation> = {
  fr: {
    title: 'Calculatrice',
    titleHighlight: 'Moyenne',
    subtitle: 'Génie Civil',
    description: 'Choisissez votre année pour calculer votre moyenne.',
    selectorHint: 'Choisissez votre année.',
    startButton: 'Ouvrir',
    footerTitle: 'Calculatrice de Moyenne',
    footerSubtitle: 'Génie Civil',
    years: { y1: 'Année 1', y2: 'Année 2', y3: 'Année 3', y4: 'Année 4' },
  },
  en: {
    title: 'Grade',
    titleHighlight: 'Calculator',
    subtitle: 'Civil Engineering',
    description: 'Choose your year to calculate your average.',
    selectorHint: 'Choose your year.',
    startButton: 'Open',
    footerTitle: 'Grade Calculator',
    footerSubtitle: 'Civil Engineering',
    years: { y1: 'Year 1', y2: 'Year 2', y3: 'Year 3', y4: 'Year 4' },
  },
  ar: {
    title: 'حاسبة',
    titleHighlight: 'المعدل',
    subtitle: 'الهندسة المدنية',
    description: 'اختر سنتك لحساب معدلك.',
    selectorHint: 'اختر سنتك.',
    startButton: 'فتح',
    footerTitle: 'حاسبة المعدل',
    footerSubtitle: 'الهندسة المدنية',
    years: { y1: 'السنة 1', y2: 'السنة 2', y3: 'السنة 3', y4: 'السنة 4' },
  },
};

const yearAccent: Record<YearId, { hex: string; soft: string; softer: string }> = {
  y1: { hex: '#22c55e', soft: 'rgba(34,197,94,0.14)', softer: 'rgba(34,197,94,0.22)' },
  y2: { hex: '#3b82f6', soft: 'rgba(59,130,246,0.14)', softer: 'rgba(59,130,246,0.22)' },
  y3: { hex: '#eab308', soft: 'rgba(234,179,8,0.14)', softer: 'rgba(234,179,8,0.22)' },
  y4: { hex: '#a855f7', soft: 'rgba(168,85,247,0.14)', softer: 'rgba(168,85,247,0.22)' },
};

export function HomePage({
  lang,
  onLanguageChange,
}: {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title', { opacity: 0, y: 40, rotateX: 35 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-cta, .selector-card, .info-card', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, delay: 0.35, ease: 'power3.out' });
    }, heroRef);
    return () => ctx.revert();
  }, [lang]);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية', flag: 'AR' },
  ];

  const currentLanguage = languages.find((l) => l.code === lang);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section ref={heroRef} className="relative overflow-hidden bg-ce-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ce-dark via-ce-gray to-ce-dark" />
        <div className="absolute inset-0 blueprint-grid opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-end mb-6">
            <div className="relative" ref={null}>
              <button
                type="button"
                onClick={() => setIsSelectorOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-300 border border-white/20"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLanguage?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSelectorOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-ce-lg border border-ce-border overflow-hidden z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(language.code);
                        setIsSelectorOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        lang === language.code ? 'bg-ce-yellow/10 text-ce-yellow' : 'text-ce-dark hover:bg-ce-light'
                      }`}
                    >
                      <span className="text-xs font-semibold w-6">{language.flag}</span>
                      <span className="text-sm font-medium">{language.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <HardHat className="w-4 h-4" />
              <span className="text-sm font-medium">{t.subtitle}</span>
            </div>

            <h1 className="hero-title text-5xl md:text-7xl font-bold font-poppins mb-5">
              {t.title} <span style={{ color: '#fbbf24' }}>{t.titleHighlight}</span>
            </h1>

            <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-3">{t.subtitle}</p>
            <p className="hero-subtitle text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-12">{t.description}</p>

            <div className="hero-cta mb-16">
              <Link to="/year/y1" className="ce-btn inline-flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {t.startButton}
              </Link>
            </div>

            <p className="text-sm text-gray-400 mb-8">{t.selectorHint}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {(['y1', 'y2', 'y3', 'y4'] as YearId[]).map((yearId, index) => {
                const accent = yearAccent[yearId];
                return (
                  <Link
                    key={yearId}
                    to={`/year/${yearId}`}
                    className="selector-card group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: accent.soft }} />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: accent.soft, color: accent.hex }}>
                        {[HardHat, Building2, Ruler, PenTool][index % 4] && (() => {
                          const Icon = [HardHat, Building2, Ruler, PenTool][index % 4];
                          return <Icon className="w-6 h-6" />;
                        })()}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t.years[yearId]}</h3>
                      <p className="text-sm text-gray-400">Semesters 1–2</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="info-card p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-ce-yellow/20 flex items-center justify-center mb-4">
                  <Ruler className="w-5 h-5 text-ce-yellow" />
                </div>
                <h3 className="font-semibold mb-2">{t.footerTitle}</h3>
                <p className="text-sm text-gray-400">{t.footerSubtitle}</p>
              </div>

              <div className="info-card p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-ce-blue/20 flex items-center justify-center mb-4">
                  <Calculator className="w-5 h-5 text-ce-blue" />
                </div>
                <h3 className="font-semibold mb-2">Calcul précis</h3>
                <p className="text-sm text-gray-400">Basé sur les coefficients</p>
              </div>

              <div className="info-card p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-ce-green/20 flex items-center justify-center mb-4">
                  <Mountain className="w-5 h-5 text-ce-green" />
                </div>
                <h3 className="font-semibold mb-2">Suivi de progression</h3>
                <p className="text-sm text-gray-400">Semestre après semestre</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;