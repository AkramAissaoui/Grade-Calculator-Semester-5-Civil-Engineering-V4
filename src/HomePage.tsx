import { Link } from 'react-router-dom';
import { Calculator, BookOpen, Ruler, HardHat, Award, Languages } from 'lucide-react';

type Language = 'fr' | 'en' | 'ar';

const yearIcons = [
  <BookOpen className="w-7 h-7" />,
  <Ruler className="w-7 h-7" />,
  <HardHat className="w-7 h-7" />,
  <Award className="w-7 h-7" />,
];

const yearLabels: Record<Language, Record<number, string>> = {
  fr: { 1: 'Année 1', 2: 'Année 2', 3: 'Année 3', 4: 'Année 4' },
  en: { 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4' },
  ar: { 1: 'السنة 1', 2: 'السنة 2', 3: 'السنة 3', 4: 'السنة 4' },
};

const yearDescriptions: Record<Language, Record<number, string>> = {
  fr: {
    1: 'Calculez votre moyenne des semestres 1 et 2.',
    2: 'Calculez votre moyenne des semestres 3 et 4.',
    3: 'Calculez votre moyenne des semestres 5 et 6.',
    4: 'Calculez votre moyenne des semestres 7 et 8.',
  },
  en: {
    1: 'Calculate your Semester 1 and 2 average.',
    2: 'Calculate your Semester 3 and 4 average.',
    3: 'Calculate your Semester 5 and 6 average.',
    4: 'Calculate your Semester 7 and 8 average.',
  },
  ar: {
    1: 'احسب معدلك للفصل 1 و 2.',
    2: 'احسب معدلك للفصل 3 و 4.',
    3: 'احسب معدلك للفصل 5 و 6.',
    4: 'احسب معدلك للفصل 7 و 8.',
  },
};

export function HomePage({
  lang,
  onLanguageChange,
}: {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}) {
  const t = {
    title: lang === 'fr' ? 'Calculatrice Moyenne' : lang === 'en' ? 'Grade Calculator' : 'حاسبة المعدل',
    subtitle: lang === 'fr' ? 'Génie Civil' : lang === 'en' ? 'Civil Engineering' : 'الهندسة المدنية',
    selectYear: lang === 'fr' ? 'Choisissez votre année' : lang === 'en' ? 'Choose your year' : 'اختر سنتك',
    open: lang === 'fr' ? 'Ouvrir' : lang === 'en' ? 'Open' : 'فتح',
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-ce-dark text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-ce-dark via-ce-gray to-ce-dark" />
      <div className="absolute inset-0 blueprint-grid opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              const next: Language =
                lang === 'fr' ? 'en' : lang === 'en' ? 'ar' : 'fr';
              onLanguageChange(next);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/20"
          >
            <Languages className="w-4 h-4" />
            <span className="text-sm font-medium">{lang.toUpperCase()}</span>
          </button>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ce-yellow/10 border border-ce-yellow/20 text-ce-yellow mb-6">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">{t.selectYear}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-5">
                {t.title} <span className="text-ce-yellow">{t.subtitle}</span>
              </h1>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4].map((yearNum) => (
                <Link
                  key={yearNum}
                  to={`/year${yearNum}`}
                  className="selector-card ce-card glass-panel text-left p-8 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-ce-yellow/10 text-ce-yellow">
                      {yearIcons[yearNum - 1]}
                    </div>
                    <div className="text-sm font-semibold text-ce-yellow">{t.open}</div>
                  </div>
                  <h2 className="text-2xl font-bold font-poppins text-ce-dark mb-2">
                    {yearLabels[lang][yearNum]}
                  </h2>
                  <p className="text-ce-concrete mb-5">
                    {yearDescriptions[lang][yearNum]}
                  </p>
                  <div className="flex items-center font-medium text-ce-yellow group-hover:translate-x-1 transition-transform">
                    {t.open}
                    <span className="ml-2">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}