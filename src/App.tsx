import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  Calculator, HardHat, Building2, Ruler, PenTool, DraftingCompass, Mountain,
  BookOpen, RotateCcw, CheckCircle2, AlertCircle, TrendingUp, Award, Globe, ArrowLeft,
} from 'lucide-react';
import './App.css';

type Language = 'fr' | 'en' | 'ar';
type YearId = 'y1' | 'y2' | 'y3' | 'y4';
type SubPage = 'odd' | 'even' | 'annual';
type SemesterKey = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
type GradeField = 'td' | 'tp' | 'exam';

interface Assessment {
  field: GradeField;
  weight: number;
}

interface SemesterModule {
  id: string;
  label: string;
  coefficient: number;
  assessments: Assessment[];
  icon: React.ReactNode;
}

type Grades = Record<GradeField, string>;
type ModuleGrades = Record<string, Grades>;

const yearSemesters: Record<YearId, [SemesterKey, SemesterKey]> = {
  y1: ['s1', 's2'],
  y2: ['s3', 's4'],
  y3: ['s5', 's6'],
  y4: ['s7', 's8'],
};

const yearLabels: Record<Language, Record<YearId, string>> = {
  fr: { y1: 'Année 1', y2: 'Année 2', y3: 'Année 3', y4: 'Année 4' },
  en: { y1: 'Year 1', y2: 'Year 2', y3: 'Year 3', y4: 'Year 4' },
  ar: { y1: 'السنة 1', y2: 'السنة 2', y3: 'السنة 3', y4: 'السنة 4' },
};

const semesterLabels: Record<Language, Record<SemesterKey, string>> = {
  fr: { s1: 'Semestre 1', s2: 'Semestre 2', s3: 'Semestre 3', s4: 'Semestre 4', s5: 'Semestre 5', s6: 'Semestre 6', s7: 'Semestre 7', s8: 'Semestre 8' },
  en: { s1: 'Semester 1', s2: 'Semester 2', s3: 'Semester 3', s4: 'Semester 4', s5: 'Semester 5', s6: 'Semester 6', s7: 'Semester 7', s8: 'Semester 8' },
  ar: { s1: 'الفصل 1', s2: 'الفصل 2', s3: 'الفصل 3', s4: 'الفصل 4', s5: 'الفصل 5', s6: 'الفصل 6', s7: 'الفصل 7', s8: 'الفصل 8' },
};

const yearAccent: Record<YearId, { hex: string; soft: string; softer: string }> = {
  y1: { hex: '#22c55e', soft: 'rgba(34,197,94,0.14)', softer: 'rgba(34,197,94,0.22)' },
  y2: { hex: '#3b82f6', soft: 'rgba(59,130,246,0.14)', softer: 'rgba(59,130,246,0.22)' },
  y3: { hex: '#eab308', soft: 'rgba(234,179,8,0.14)', softer: 'rgba(234,179,8,0.22)' },
  y4: { hex: '#a855f7', soft: 'rgba(168,85,247,0.14)', softer: 'rgba(168,85,247,0.22)' },
};

const buildPlaceholderModules = (semesterKey: string, count = 6): SemesterModule[] => {
  const icons = [HardHat, Building2, Ruler, PenTool, DraftingCompass, Mountain, BookOpen, Calculator];
  return Array.from({ length: count }, (_, i) => ({
    id: `${semesterKey}-module${i + 1}`,
    label: `Module ${i + 1}`,
    coefficient: 1,
    assessments: [
      { field: 'td' as GradeField, weight: 20 },
      { field: 'tp' as GradeField, weight: 20 },
      { field: 'exam' as GradeField, weight: 60 },
    ],
    icon: (() => {
      const Icon = icons[i % icons.length];
      return <Icon className="w-5 h-5" />;
    })(),
  }));
};

const semesterConfigs: Record<SemesterKey, SemesterModule[]> = {
  s1: buildPlaceholderModules('s1'),
  s2: buildPlaceholderModules('s2'),
  s3: buildPlaceholderModules('s3'),
  s4: buildPlaceholderModules('s4'),
  s5: [
    { id: 'beton2', label: 'Béton Armé 2', coefficient: 2, assessments: [{ field: 'td', weight: 40 }, { field: 'exam', weight: 60 }], icon: <HardHat className="w-5 h-5" /> },
    { id: 'sol2', label: 'Mécanique des Sols 2', coefficient: 3, assessments: [{ field: 'td', weight: 20 }, { field: 'tp', weight: 20 }, { field: 'exam', weight: 60 }], icon: <Mountain className="w-5 h-5" /> },
    { id: 'materiaux2', label: 'Matériaux de Construction 2', coefficient: 2, assessments: [{ field: 'tp', weight: 40 }, { field: 'exam', weight: 60 }], icon: <Building2 className="w-5 h-5" /> },
    { id: 'rdm3', label: 'RDM 3', coefficient: 3, assessments: [{ field: 'td', weight: 40 }, { field: 'exam', weight: 60 }], icon: <Ruler className="w-5 h-5" /> },
    { id: 'charpente2', label: 'Charpente Métallique 2', coefficient: 2, assessments: [{ field: 'td', weight: 40 }, { field: 'exam', weight: 60 }], icon: <HardHat className="w-5 h-5" /> },
    { id: 'topo2', label: 'Topographie 2', coefficient: 2, assessments: [{ field: 'tp', weight: 40 }, { field: 'exam', weight: 60 }], icon: <Mountain className="w-5 h-5" /> },
    { id: 'dessinBtp', label: 'Dessin du BTP', coefficient: 2, assessments: [{ field: 'tp', weight: 100 }], icon: <PenTool className="w-5 h-5" /> },
    { id: 'dao2', label: 'DAO 2', coefficient: 2, assessments: [{ field: 'exam', weight: 100 }], icon: <DraftingCompass className="w-5 h-5" /> },
    { id: 'anglaisTech', label: 'Anglais Technique', coefficient: 1, assessments: [{ field: 'exam', weight: 100 }], icon: <BookOpen className="w-5 h-5" /> },
  ],
  s6: [
    { id: 'projetBetonArme', label: 'Projet de Béton Armé', coefficient: 3, assessments: [{ field: 'tp', weight: 60 }, { field: 'exam', weight: 40 }], icon: <HardHat className="w-5 h-5" /> },
    { id: 'mecaniqueSols3', label: 'Mécanique des Sols 3', coefficient: 3, assessments: [{ field: 'tp', weight: 20 }, { field: 'td', weight: 20 }, { field: 'exam', weight: 60 }], icon: <Mountain className="w-5 h-5" /> },
    { id: 'charpenteMetallique3', label: 'Charpente Métallique 3', coefficient: 3, assessments: [{ field: 'td', weight: 40 }, { field: 'exam', weight: 60 }], icon: <Building2 className="w-5 h-5" /> },
    { id: 'vrd', label: 'Voiries et Réseaux Divers', coefficient: 2, assessments: [{ field: 'td', weight: 40 }, { field: 'exam', weight: 60 }], icon: <Ruler className="w-5 h-5" /> },
    { id: 'organisationChantiers', label: 'Organisation des Chantiers', coefficient: 2, assessments: [{ field: 'td', weight: 40 }, { field: 'exam', weight: 60 }], icon: <Calculator className="w-5 h-5" /> },
    { id: 'dao3', label: 'DAO 3', coefficient: 2, assessments: [{ field: 'td', weight: 100 }], icon: <PenTool className="w-5 h-5" /> },
    { id: 'cao1', label: 'CAO 1', coefficient: 1, assessments: [{ field: 'td', weight: 100 }], icon: <DraftingCompass className="w-5 h-5" /> },
    { id: 'transfertThermique', label: 'Transfert Thermique', coefficient: 1, assessments: [{ field: 'exam', weight: 100 }], icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'entrepreneuriat', label: 'Entrepreneuriat et Start-up', coefficient: 1, assessments: [{ field: 'exam', weight: 100 }], icon: <Globe className="w-5 h-5" /> },
    { id: 'stageIndustriel', label: 'Stage Industriel 1', coefficient: 1, assessments: [{ field: 'tp', weight: 100 }], icon: <Award className="w-5 h-5" /> },
  ],
  s7: buildPlaceholderModules('s7'),
  s8: buildPlaceholderModules('s8'),
};

interface Translation {
  title: string; titleHighlight: string; homeSubtitle: string; homeDescription: string;
  selectorHint: string; startButton: string; backHome: string;
  modulesTitle: string; modulesDescription: string;
  progress: string; coeffFilled: string; coeff: string;
  td: string; tp: string; exam: string; calculateButton: string;
  resetButton: string; resultTitle: string; yourAverage: string;
  annualAverageLabel: string; coefficients: string; modules: string;
  completedModules: string; validation: string; precision: string; precisionDesc: string;
  structure: string; structureDesc: string; performance: string; performanceDesc: string;
  footerTitle: string; footerSubtitle: string; annualDescription: string; annualTab: string;
  gradeLabels: { excellent: string; veryGood: string; good: string; pass: string; fail: string };
  placeholderNotice: string;
}

const translations: Record<Language, Translation> = {
  fr: {
    title: 'Calculatrice', titleHighlight: 'Moyenne', homeSubtitle: 'Génie Civil',
    homeDescription: 'Choisissez votre année pour calculer votre moyenne.',
    selectorHint: 'Choisissez votre année.', startButton: 'Ouvrir', backHome: 'Retour',
    modulesTitle: 'Modules du semestre',
    modulesDescription: 'Un module est pris en compte uniquement quand toutes ses notes requises sont renseignées.',
    progress: 'Progression', coeffFilled: 'coefficients complétés', coeff: 'Coeff',
    td: 'TD', tp: 'TP', exam: 'Examen', calculateButton: 'Voir le résultat',
    resetButton: 'Réinitialiser', resultTitle: 'Résultat', yourAverage: 'Votre moyenne du semestre',
    annualAverageLabel: 'Votre moyenne annuelle', coefficients: 'Coefficients', modules: 'Modules',
    completedModules: 'Modules complets', validation: 'Validation', precision: 'Précision',
    precisionDesc: 'Calcul basé sur les coefficients et pondérations de chaque module.',
    structure: 'Structure', structureDesc: 'Organisation claire des modules par coefficient.',
    performance: 'Performance', performanceDesc: 'Suivez votre progression semestre après semestre.',
    footerTitle: 'Calculatrice de Moyenne', footerSubtitle: 'Génie Civil',
    annualDescription: 'Moyenne annuelle = (moyenne du 1er semestre + moyenne du 2e semestre) / 2, calculée automatiquement dès que les deux semestres ont au moins un module complet.',
    annualTab: 'Moyenne annuelle',
    gradeLabels: { excellent: 'Excellent', veryGood: 'Très Bien', good: 'Bien', pass: 'Passable', fail: 'Insuffisant' },
    placeholderNotice: "Modules provisoires — à remplacer par le programme officiel dès qu'il sera disponible.",
  },
  en: {
    title: 'Grade', titleHighlight: 'Calculator', homeSubtitle: 'Civil Engineering',
    homeDescription: 'Choose your year to calculate your average.',
    selectorHint: 'Choose your year.', startButton: 'Open', backHome: 'Back',
    modulesTitle: 'Semester modules',
    modulesDescription: 'A module is counted only when all its required grades are filled.',
    progress: 'Progress', coeffFilled: 'completed coefficients', coeff: 'Coeff',
    td: 'TD', tp: 'TP', exam: 'Exam', calculateButton: 'View result',
    resetButton: 'Reset', resultTitle: 'Result', yourAverage: 'Your semester average',
    annualAverageLabel: 'Your annual average', coefficients: 'Coefficients', modules: 'Modules',
    completedModules: 'Completed modules', validation: 'Validation', precision: 'Precision',
    precisionDesc: "Calculation based on each module's coefficient and weighting.",
    structure: 'Structure', structureDesc: 'Clear organization of modules by coefficient.',
    performance: 'Performance', performanceDesc: 'Track your progress semester after semester.',
    footerTitle: 'Grade Calculator', footerSubtitle: 'Civil Engineering',
    annualDescription: 'Annual average = (1st semester average + 2nd semester average) / 2, computed automatically once both semesters have at least one completed module.',
    annualTab: 'Annual average',
    gradeLabels: { excellent: 'Excellent', veryGood: 'Very Good', good: 'Good', pass: 'Pass', fail: 'Fail' },
    placeholderNotice: 'Placeholder modules — replace with the official program once available.',
  },
  ar: {
    title: 'حاسبة', titleHighlight: 'المعدل', homeSubtitle: 'الهندسة المدنية',
    homeDescription: 'اختر سنتك لحساب معدلك.',
    selectorHint: 'اختر سنتك.', startButton: 'فتح', backHome: 'رجوع',
    modulesTitle: 'وحدات الفصل',
    modulesDescription: 'يتم حساب الوحدة فقط عند إدخال جميع العلامات المطلوبة.',
    progress: 'التقدم', coeffFilled: 'من المعاملات مكتملة', coeff: 'معامل',
    td: 'أعمال موجهة', tp: 'أعمال تطبيقية', exam: 'امتحان', calculateButton: 'عرض النتيجة',
    resetButton: 'إعادة تعيين', resultTitle: 'النتيجة', yourAverage: 'معدل الفصل',
    annualAverageLabel: 'المعدل السنوي', coefficients: 'المعاملات', modules: 'الوحدات',
    completedModules: 'الوحدات المكتملة', validation: 'التحقق', precision: 'الدقة',
    precisionDesc: 'حساب مبني على معامل وترجيح كل وحدة.',
    structure: 'التنظيم', structureDesc: 'تنظيم واضح للوحدات حسب المعامل.',
    performance: 'الأداء', performanceDesc: 'تابع تقدمك فصلاً بعد فصل.',
    footerTitle: 'حاسبة المعدل', footerSubtitle: 'الهندسة المدنية',
    annualDescription: 'المعدل السنوي = (معدل الفصل الأول + معدل الفصل الثاني) / 2، يُحسب تلقائياً عند اكتمال وحدة واحدة على الأقل في كل فصل.',
    annualTab: 'المعدل السنوي',
    gradeLabels: { excellent: 'ممتاز', veryGood: 'جيد جداً', good: 'جيد', pass: 'مقبول', fail: 'ضعيف' },
    placeholderNotice: 'وحدات مؤقتة — يجب استبدالها بالبرنامج الرسمي عند توفره.',
  },
};

const emptyGrades: Grades = { td: '', tp: '', exam: '' };

const buildInitialGrades = (modules: SemesterModule[]): ModuleGrades =>
  modules.reduce((acc: ModuleGrades, module) => {
    acc[module.id] = { ...emptyGrades };
    return acc;
  }, {});

const normalizeInput = (value: string) => value.replace(',', '.').trim();

const parseGrade = (value: string): number | null => {
  const normalized = normalizeInput(value);
  if (!normalized || normalized === '.' || normalized === '-.' || normalized === '-') return null;
  const num = Number(normalized);
  if (!Number.isFinite(num)) return null;
  if (num < 0) return 0;
  if (num > 20) return 20;
  return num;
};

const sanitizeGradeInput = (value: string): string => {
  const parsed = parseGrade(value);
  return parsed === null ? '' : String(parsed);
};

const canAcceptInput = (value: string): boolean => {
  const normalized = value.replace(',', '.');
  return normalized === '' || /^-?\d{0,2}(\.\d{0,2})?$/.test(normalized);
};

const isModuleComplete = (module: SemesterModule, grades: Grades): boolean =>
  module.assessments.every((a) => parseGrade(grades[a.field]) !== null);

const calculateModuleAverage = (module: SemesterModule, grades: Grades): number | null => {
  if (!isModuleComplete(module, grades)) return null;
  const totalWeight = module.assessments.reduce((s, a) => s + a.weight, 0);
  const weightedSum = module.assessments.reduce((s, a) => s + (parseGrade(grades[a.field]) as number) * a.weight, 0);
  return totalWeight > 0 ? weightedSum / totalWeight : null;
};

const calculateSemesterStats = (modules: SemesterModule[], grades: ModuleGrades) => {
  let totalWeightedSum = 0, countedCoeff = 0, completedModules = 0;
  modules.forEach((module) => {
    const moduleGrades = grades[module.id] ?? emptyGrades;
    const avg = calculateModuleAverage(module, moduleGrades);
    if (avg !== null) {
      totalWeightedSum += avg * module.coefficient;
      countedCoeff += module.coefficient;
      completedModules += 1;
    }
  });
  const totalAvailableCoeff = modules.reduce((s, m) => s + m.coefficient, 0);
  return {
    average: countedCoeff > 0 ? totalWeightedSum / countedCoeff : 0,
    countedCoeff,
    totalAvailableCoeff,
    completedModules,
    totalModules: modules.length,
    progressPercent: totalAvailableCoeff > 0 ? (countedCoeff / totalAvailableCoeff) * 100 : 0,
  };
};

const getGradeColor = (average: number): string => {
  if (average >= 16) return 'grade-excellent';
  if (average >= 14) return 'grade-good';
  if (average >= 10) return 'grade-pass';
  return 'grade-fail';
};

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const initialValue = displayValue;
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(initialValue + (value - initialValue) * eased);
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <>{displayValue.toFixed(2)}</>;
}

function ModuleCard({
  module,
  grades,
  onGradeChange,
  index,
  t,
  accent,
}: {
  module: SemesterModule;
  grades: Grades;
  onGradeChange: (field: GradeField, value: string) => void;
  index: number;
  t: Translation;
  accent: { hex: string; soft: string; softer: string };
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const moduleAverage = calculateModuleAverage(module, grades);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, delay: index * 0.06, ease: 'power3.out' });
  }, [index, module.id]);

  const handleInputChange = (field: GradeField, value: string) => {
    if (!canAcceptInput(value)) return;
    onGradeChange(field, value.replace(',', '.'));
  };

  const handleBlur = (field: GradeField, value: string) => onGradeChange(field, sanitizeGradeInput(value));

  return (
    <div ref={cardRef} className="module-card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent.soft, color: accent.hex }}>
            {module.icon}
          </div>
          <div>
            <h3 className="font-semibold text-ce-dark leading-snug">{module.label}</h3>
            <p className="text-sm text-ce-concrete">{t.coeff}: {module.coefficient}</p>
          </div>
        </div>
        {moduleAverage !== null && (
          <div className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: accent.soft, color: accent.hex }}>
            {moduleAverage.toFixed(2)}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {module.assessments.map((assessment) => (
          <div key={`${module.id}-${assessment.field}`}>
            <label className="block text-sm font-medium text-ce-gray mb-2">
              {t[assessment.field]} ({assessment.weight}%)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={grades[assessment.field]}
              onChange={(e) => handleInputChange(assessment.field, e.target.value)}
              onBlur={(e) => handleBlur(assessment.field, e.target.value)}
              placeholder="--"
              className="ce-input text-center py-2.5 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App({
  year,
  lang,
}: {
  year: YearId;
  lang: Language;
}) {
  const [subPage, setSubPage] = useState<SubPage>('odd');
  const [gradesBySemester, setGradesBySemester] = useState<Record<SemesterKey, ModuleGrades>>(() => {
    const initial = {} as Record<SemesterKey, ModuleGrades>;
    (Object.keys(semesterConfigs) as SemesterKey[]).forEach((key) => {
      initial[key] = buildInitialGrades(semesterConfigs[key]);
    });
    return initial;
  });

  const heroRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const t = translations[lang];

  const oddKey = yearSemesters[year][0];
  const evenKey = yearSemesters[year][1];
  const activeKey = subPage === 'even' ? evenKey : oddKey;
  const activeModules = semesterConfigs[activeKey];
  const activeGrades = gradesBySemester[activeKey];
  const accent = yearAccent[year];

  const oddStats = useMemo(
    () => calculateSemesterStats(semesterConfigs[oddKey], gradesBySemester[oddKey]),
    [oddKey, gradesBySemester]
  );
  const evenStats = useMemo(
    () => calculateSemesterStats(semesterConfigs[evenKey], gradesBySemester[evenKey]),
    [evenKey, gradesBySemester]
  );
  const activeStats = subPage === 'even' ? evenStats : oddStats;

  const annualReady = !!(oddStats.completedModules > 0 && evenStats.completedModules > 0);
  const annualAverage = annualReady ? (oddStats.average + evenStats.average) / 2 : 0;
  const displayedAverage = subPage === 'annual' ? annualAverage : activeStats.average;
  const gradeColor = getGradeColor(displayedAverage);
  const currentYearLabel = yearLabels[lang][year];

  const handleGradeChange = useCallback((semesterKey: SemesterKey, moduleId: string, field: GradeField, value: string) => {
    setGradesBySemester((prev) => ({
      ...prev,
      [semesterKey]: {
        ...prev[semesterKey],
        [moduleId]: {
          ...prev[semesterKey][moduleId],
          [field]: value,
        },
      },
    }));
  }, []);

  const handleReset = () => {
    if (subPage === 'annual') return;
    setGradesBySemester((prev) => ({ ...prev, [activeKey]: buildInitialGrades(semesterConfigs[activeKey]) }));
  };

  const scrollToResult = () => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const getGradeLabel = (average: number) => {
    if (average >= 16) return t.gradeLabels.excellent;
    if (average >= 14) return t.gradeLabels.veryGood;
    if (average >= 12) return t.gradeLabels.good;
    if (average >= 10) return t.gradeLabels.pass;
    return t.gradeLabels.fail;
  };

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-title', { opacity: 0, y: 40, rotateX: 35 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-cta, .selector-card, .info-card, .result-card', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, delay: 0.35, ease: 'power3.out' });
    }, heroRef);
    return () => ctx.revert();
  }, [year, lang]);

  if (subPage === 'annual') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <section ref={heroRef} className="relative overflow-hidden bg-ce-dark text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-ce-dark via-ce-gray to-ce-dark" />
          <div className="absolute inset-0 blueprint-grid opacity-10" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-14">
              <Link to="/" className="ce-btn-secondary inline-flex items-center gap-2 self-start">
                <ArrowLeft className="w-4 h-4" /> {t.backHome}
              </Link>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubPage('odd')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: accent.hex, color: '#1a1a1a' }}
                >
                  {semesterLabels[lang][oddKey]}
                </button>
                <button
                  type="button"
                  onClick={() => setSubPage('even')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: accent.hex, color: '#1a1a1a' }}
                >
                  {semesterLabels[lang][evenKey]}
                </button>
              </div>
            </div>

            <div className="text-center max-w-4xl mx-auto pb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: accent.soft, border: `1px solid ${accent.softer}`, color: accent.hex }}>
                <TrendingUp className="w-4 h-4" /><span className="text-sm font-medium">{currentYearLabel}</span>
              </div>
              <h1 className="hero-title text-5xl md:text-7xl font-bold font-poppins mb-5">{t.title} <span style={{ color: accent.hex }}>{t.titleHighlight}</span></h1>
              <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-3">{currentYearLabel} - {t.homeSubtitle}</p>
              <p className="hero-subtitle text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-8">{t.annualDescription}</p>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="absolute inset-0 blueprint-grid opacity-30" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ce-card p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-ce-gray mb-2">{t.annualAverageLabel} - {semesterLabels[lang][oddKey]}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={oddStats.average ? oddStats.average.toFixed(2) : '--'}
                    onChange={() => {}}
                    placeholder="--"
                    className="ce-input text-center py-3"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ce-gray mb-2">{t.annualAverageLabel} - {semesterLabels[lang][evenKey]}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={evenStats.average ? evenStats.average.toFixed(2) : '--'}
                    onChange={() => {}}
                    placeholder="--"
                    className="ce-input text-center py-3"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button type="button" onClick={scrollToResult} className="ce-btn inline-flex items-center gap-2" style={{ backgroundColor: accent.hex, borderColor: accent.hex }}>
                  <CheckCircle2 className="w-4 h-4" /> {t.calculateButton}
                </button>
                <button type="button" onClick={handleReset} className="ce-btn-secondary inline-flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> {t.resetButton}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section ref={resultRef} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="result-card result-display">
              <div className="relative z-10 text-center">
                <p className="font-medium mb-3" style={{ color: accent.hex }}>{t.resultTitle}</p>
                <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{t.annualAverageLabel}</h2>
                <div className={`text-6xl md:text-7xl font-bold font-poppins mb-3 ${gradeColor}`}>
                  <AnimatedCounter value={annualAverage} />/20
                </div>
                <div className="flex items-center justify-center gap-3">
                  {annualReady && annualAverage >= 10 ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className="text-xl font-semibold">{getGradeLabel(annualAverage)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section ref={heroRef} className="relative overflow-hidden bg-ce-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ce-dark via-ce-gray to-ce-dark" />
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-14">
            <Link to="/" className="ce-btn-secondary inline-flex items-center gap-2 self-start">
              <ArrowLeft className="w-4 h-4" /> {t.backHome}
            </Link>
            <button
              type="button"
              onClick={() => setSubPage('annual')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: accent.hex, color: '#1a1a1a' }}
            >
              {t.annualTab}
            </button>
          </div>

          <div className="text-center max-w-4xl mx-auto pb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: accent.soft, border: `1px solid ${accent.softer}`, color: accent.hex }}>
              <TrendingUp className="w-4 h-4" /><span className="text-sm font-medium">{currentYearLabel}</span>
            </div>
            <h1 className="hero-title text-5xl md:text-7xl font-bold font-poppins mb-5">{t.title} <span style={{ color: accent.hex }}>{t.titleHighlight}</span></h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-3">{currentYearLabel} - {t.homeSubtitle}</p>
            <p className="hero-subtitle text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-8">{t.modulesDescription}</p>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ce-card p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-ce-dark">{t.progress}</h3>
                <p className="text-sm text-ce-concrete">
                  {Math.round(activeStats.progressPercent)}% • {activeStats.countedCoeff} / {activeStats.totalAvailableCoeff} {t.coeffFilled}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={scrollToResult} className="ce-btn inline-flex items-center gap-2" style={{ backgroundColor: accent.hex, borderColor: accent.hex }}>
                  <CheckCircle2 className="w-4 h-4" /> {t.calculateButton}
                </button>
                <button type="button" onClick={handleReset} className="ce-btn-secondary inline-flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> {t.resetButton}
                </button>
              </div>
            </div>
            <div className="h-2 bg-ce-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${activeStats.progressPercent}%`, backgroundColor: accent.hex }} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeModules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                grades={activeGrades[module.id] ?? emptyGrades}
                onGradeChange={(field, value) => handleGradeChange(activeKey, module.id, field, value)}
                index={index}
                t={t}
                accent={accent}
              />
            ))}
          </div>
        </div>
      </section>

      <section ref={resultRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="result-card result-display">
            <div className="relative z-10">
              <div className="text-center mb-10">
                <p className="font-medium mb-3" style={{ color: accent.hex }}>{t.resultTitle}</p>
                <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{t.yourAverage}</h2>
                <div className={`text-6xl md:text-7xl font-bold font-poppins mb-3 ${gradeColor}`}>
                  <AnimatedCounter value={displayedAverage} />/20
                </div>
                <div className="flex items-center justify-center gap-3">
                  {displayedAverage >= 10 ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className="text-xl font-semibold">{getGradeLabel(displayedAverage)}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="text-3xl font-bold mb-1" style={{ color: accent.hex }}>
                    {oddStats.completedModules > 0 ? oddStats.average.toFixed(2) : '--'}
                  </div>
                  <div className="text-sm text-gray-300">{semesterLabels[lang][oddKey]}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="text-3xl font-bold mb-1" style={{ color: accent.hex }}>
                    {evenStats.completedModules > 0 ? evenStats.average.toFixed(2) : '--'}
                  </div>
                  <div className="text-sm text-gray-300">{semesterLabels[lang][evenKey]}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="text-3xl font-bold mb-1" style={{ color: accent.hex }}>
                    {activeStats.countedCoeff}
                  </div>
                  <div className="text-sm text-gray-300">{t.coefficients}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}