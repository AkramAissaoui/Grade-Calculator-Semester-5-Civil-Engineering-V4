import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import {
  Calculator,
  HardHat,
  Building2,
  Ruler,
  PenTool,
  DraftingCompass,
  Mountain,
  BookOpen,
  Languages,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Globe,
  ArrowLeft
} from 'lucide-react'
import './App.css'

type Language = 'fr' | 'en' | 'ar'
type SemesterId = 's5' | 's6'
type GradeField = 'td' | 'tp' | 'exam'
type ModuleNameKey =
  | 'beton2'
  | 'sol2'
  | 'materiaux2'
  | 'rdm3'
  | 'charpente2'
  | 'topo2'
  | 'dessinBtp'
  | 'dao2'
  | 'anglaisTech'
  | 'projetBetonArme'
  | 'mecaniqueSols3'
  | 'charpenteMetallique3'
  | 'vrd'
  | 'organisationChantiers'
  | 'dao3'
  | 'cao1'
  | 'transfertThermique'
  | 'entrepreneuriat'
  | 'stageIndustriel'

interface Assessment {
  field: GradeField
  weight: number
}

interface SemesterModule {
  id: string
  nameKey: ModuleNameKey
  coefficient: number
  assessments: Assessment[]
  icon: React.ReactNode
}

type Grades = Record<GradeField, string>
type ModuleGrades = Record<string, Grades>

const translations = {
  fr: {
    title: 'Calculatrice',
    titleHighlight: 'Moyenne',
    homeSubtitle: 'Génie Civil',
    homeDescription: 'Choisissez le semestre à ouvrir.',
    selectorHint: 'Même thème, même logique, un calcul exact.',
    startButton: 'Ouvrir',
    backHome: 'Retour',
    modulesTitle: 'Modules du semestre',
    modulesDescription: 'Un module est pris en compte uniquement quand toutes ses notes requises sont renseignées.',
    progress: 'Progression',
    coeffFilled: 'coefficients complétés',
    coeff: 'Coeff',
    td: 'TD',
    tp: 'TP',
    exam: 'Exam',
    calculateButton: 'Voir le résultat',
    resetButton: 'Réinitialiser',
    resultTitle: 'Résultat',
    yourAverage: 'Votre moyenne du semestre',
    coefficients: 'Coefficients',
    modules: 'Modules',
    completedModules: 'Modules complets',
    validation: 'Validation',
    precision: 'Précision',
    precisionDesc: 'Aucun arrondi intermédiaire, uniquement un affichage final à 2 décimales.',
    structure: 'Structure',
    structureDesc: 'Le même design est conservé pour le semestre 5, le semestre 6 et la page de sélection.',
    performance: 'Performance',
    performanceDesc: 'Calcul en temps réel, champs vides sûrs et aucune valeur NaN.',
    footerTitle: 'Calculatrice Moyenne',
    footerSubtitle: 'Génie Civil',
    gradeLabels: {
      excellent: 'Excellent',
      veryGood: 'Très Bien',
      good: 'Bien',
      pass: 'Passable',
      fail: 'Insuffisant'
    },
    semesterNames: {
      s5: 'Semestre 5',
      s6: 'Semestre 6'
    },
    moduleNames: {
      beton2: 'Béton Armé 2',
      sol2: 'Mécanique des sols 2',
      materiaux2: 'Matériaux de construction 2',
      rdm3: 'Résistance des matériaux 3',
      charpente2: 'Charpente Métallique 2',
      topo2: 'Topographie 2',
      dessinBtp: 'Dessin du BTP',
      dao2: 'DAO 2',
      anglaisTech: 'Anglais technique',
      projetBetonArme: 'Projet de Béton Armé',
      mecaniqueSols3: 'Mécanique des sols 3',
      charpenteMetallique3: 'Charpente Métallique 3',
      vrd: 'Voiries et Réseaux Divers',
      organisationChantiers: 'Organisation des Chantiers',
      dao3: 'DAO 3',
      cao1: 'CAO 1',
      transfertThermique: 'Transfert Thermique',
      entrepreneuriat: 'Entrepreneuriat et Start-up',
      stageIndustriel: 'Stage dans un milieu industriel 1'
    }
  },
  en: {
    title: 'Grade',
    titleHighlight: 'Calculator',
    homeSubtitle: 'Civil Engineering',
    homeDescription: 'Choose the semester you want to open.',
    selectorHint: 'Same theme, same logic, exact calculation.',
    startButton: 'Open',
    backHome: 'Back',
    modulesTitle: 'Semester modules',
    modulesDescription: 'A module is counted only when all its required grades are filled.',
    progress: 'Progress',
    coeffFilled: 'completed coefficients',
    coeff: 'Coeff',
    td: 'TD',
    tp: 'TP',
    exam: 'Exam',
    calculateButton: 'View result',
    resetButton: 'Reset',
    resultTitle: 'Result',
    yourAverage: 'Your semester average',
    coefficients: 'Coefficients',
    modules: 'Modules',
    completedModules: 'Completed modules',
    validation: 'Validation',
    precision: 'Precision',
    precisionDesc: 'No intermediate rounding, only final 2-decimal display.',
    structure: 'Structure',
    structureDesc: 'The same design is kept for Semester 5, Semester 6, and the selection page.',
    performance: 'Performance',
    performanceDesc: 'Real-time calculation, safe empty fields, and no NaN values.',
    footerTitle: 'Grade Calculator',
    footerSubtitle: 'Civil Engineering',
    gradeLabels: {
      excellent: 'Excellent',
      veryGood: 'Very Good',
      good: 'Good',
      pass: 'Pass',
      fail: 'Fail'
    },
    semesterNames: {
      s5: 'Semester 5',
      s6: 'Semester 6'
    },
    moduleNames: {
      beton2: 'Reinforced Concrete 2',
      sol2: 'Soil Mechanics 2',
      materiaux2: 'Construction Materials 2',
      rdm3: 'Strength of Materials 3',
      charpente2: 'Steel Structure 2',
      topo2: 'Topography 2',
      dessinBtp: 'Technical Drawing',
      dao2: 'CAD 2',
      anglaisTech: 'Technical English',
      projetBetonArme: 'Reinforced Concrete Project',
      mecaniqueSols3: 'Soil Mechanics 3',
      charpenteMetallique3: 'Steel Structure 3',
      vrd: 'Roads and Utility Networks',
      organisationChantiers: 'Construction Site Organization',
      dao3: 'CAD 3',
      cao1: 'CAE 1',
      transfertThermique: 'Heat Transfer',
      entrepreneuriat: 'Entrepreneurship and Start-up',
      stageIndustriel: 'Industrial Internship 1'
    }
  },
  ar: {
    title: 'حاسبة',
    titleHighlight: 'المعدل',
    homeSubtitle: 'الهندسة المدنية',
    homeDescription: 'اختر الفصل الذي تريد فتحه.',
    selectorHint: 'نفس التصميم ونفس المنطق مع حساب دقيق.',
    startButton: 'فتح',
    backHome: 'رجوع',
    modulesTitle: 'وحدات الفصل',
    modulesDescription: 'يتم احتساب الوحدة فقط عند إدخال كل العلامات المطلوبة لها.',
    progress: 'التقدم',
    coeffFilled: 'معاملات مكتملة',
    coeff: 'المعامل',
    td: 'TD',
    tp: 'TP',
    exam: 'الامتحان',
    calculateButton: 'عرض النتيجة',
    resetButton: 'إعادة تعيين',
    resultTitle: 'النتيجة',
    yourAverage: 'معدلك الفصلي',
    coefficients: 'المعاملات',
    modules: 'الوحدات',
    completedModules: 'وحدات مكتملة',
    validation: 'النجاح',
    precision: 'الدقة',
    precisionDesc: 'بدون أي تقريب وسيط، فقط عرض نهائي بمنزلتين عشريتين.',
    structure: 'البنية',
    structureDesc: 'تم الحفاظ على نفس التصميم للفصل الخامس والفصل السادس وصفحة الاختيار.',
    performance: 'الأداء',
    performanceDesc: 'حساب فوري، معالجة آمنة للحقول الفارغة، وبدون قيم NaN.',
    footerTitle: 'حاسبة المعدل',
    footerSubtitle: 'الهندسة المدنية',
    gradeLabels: {
      excellent: 'ممتاز',
      veryGood: 'جيد جداً',
      good: 'جيد',
      pass: 'مقبول',
      fail: 'راسب'
    },
    semesterNames: {
      s5: 'الفصل الخامس',
      s6: 'الفصل السادس'
    },
    moduleNames: {
      beton2: 'الخرسانة المسلحة 2',
      sol2: 'ميكانيكا التربة 2',
      materiaux2: 'مواد البناء 2',
      rdm3: 'مقاومة المواد 3',
      charpente2: 'الهياكل المعدنية 2',
      topo2: 'الطبوغرافيا 2',
      dessinBtp: 'الرسم التقني للبناء',
      dao2: 'DAO 2',
      anglaisTech: 'الإنجليزية التقنية',
      projetBetonArme: 'مشروع الخرسانة المسلحة',
      mecaniqueSols3: 'ميكانيكا التربة 3',
      charpenteMetallique3: 'الهياكل المعدنية 3',
      vrd: 'الطرق والشبكات المختلفة',
      organisationChantiers: 'تنظيم الورشات',
      dao3: 'DAO 3',
      cao1: 'CAO 1',
      transfertThermique: 'الانتقال الحراري',
      entrepreneuriat: 'المقاولاتية والمؤسسات الناشئة',
      stageIndustriel: 'تربص في وسط صناعي 1'
    }
  }
} as const

type Translation = (typeof translations)[Language]

const semesterConfigs: Record<SemesterId, { modules: SemesterModule[] }> = {
  s5: {
    modules: [
      {
        id: 'beton2',
        nameKey: 'beton2',
        coefficient: 2,
        assessments: [
          { field: 'td', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <HardHat className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'sol2',
        nameKey: 'sol2',
        coefficient: 3,
        assessments: [
          { field: 'td', weight: 20 },
          { field: 'tp', weight: 20 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Mountain className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'materiaux2',
        nameKey: 'materiaux2',
        coefficient: 2,
        assessments: [
          { field: 'tp', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Building2 className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'rdm3',
        nameKey: 'rdm3',
        coefficient: 3,
        assessments: [
          { field: 'td', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Ruler className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'charpente2',
        nameKey: 'charpente2',
        coefficient: 2,
        assessments: [
          { field: 'td', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <HardHat className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'topo2',
        nameKey: 'topo2',
        coefficient: 2,
        assessments: [
          { field: 'tp', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Mountain className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'dessinBtp',
        nameKey: 'dessinBtp',
        coefficient: 2,
        assessments: [{ field: 'tp', weight: 100 }],
        icon: <PenTool className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'dao2',
        nameKey: 'dao2',
        coefficient: 2,
        assessments: [{ field: 'exam', weight: 100 }],
        icon: <DraftingCompass className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'anglaisTech',
        nameKey: 'anglaisTech',
        coefficient: 1,
        assessments: [{ field: 'exam', weight: 100 }],
        icon: <BookOpen className="w-5 h-5 text-ce-yellow" />
      }
    ]
  },
  s6: {
    modules: [
      {
        id: 'projetBetonArme',
        nameKey: 'projetBetonArme',
        coefficient: 3,
        assessments: [
          { field: 'tp', weight: 60 },
          { field: 'exam', weight: 40 }
        ],
        icon: <HardHat className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'mecaniqueSols3',
        nameKey: 'mecaniqueSols3',
        coefficient: 3,
        assessments: [
          { field: 'tp', weight: 20 },
          { field: 'td', weight: 20 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Mountain className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'charpenteMetallique3',
        nameKey: 'charpenteMetallique3',
        coefficient: 3,
        assessments: [
          { field: 'td', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Building2 className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'vrd',
        nameKey: 'vrd',
        coefficient: 2,
        assessments: [
          { field: 'td', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Ruler className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'organisationChantiers',
        nameKey: 'organisationChantiers',
        coefficient: 2,
        assessments: [
          { field: 'td', weight: 40 },
          { field: 'exam', weight: 60 }
        ],
        icon: <Calculator className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'dao3',
        nameKey: 'dao3',
        coefficient: 2,
        assessments: [{ field: 'td', weight: 100 }],
        icon: <PenTool className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'cao1',
        nameKey: 'cao1',
        coefficient: 1,
        assessments: [{ field: 'td', weight: 100 }],
        icon: <DraftingCompass className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'transfertThermique',
        nameKey: 'transfertThermique',
        coefficient: 1,
        assessments: [{ field: 'exam', weight: 100 }],
        icon: <TrendingUp className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'entrepreneuriat',
        nameKey: 'entrepreneuriat',
        coefficient: 1,
        assessments: [{ field: 'exam', weight: 100 }],
        icon: <Globe className="w-5 h-5 text-ce-yellow" />
      },
      {
        id: 'stageIndustriel',
        nameKey: 'stageIndustriel',
        coefficient: 1,
        assessments: [{ field: 'tp', weight: 100 }],
        icon: <Award className="w-5 h-5 text-ce-yellow" />
      }
    ]
  }
}

const emptyGrades = (): Grades => ({
  td: '',
  tp: '',
  exam: ''
})

const buildInitialGrades = (modules: SemesterModule[]): ModuleGrades =>
  modules.reduce<ModuleGrades>((acc, module) => {
    acc[module.id] = emptyGrades()
    return acc
  }, {})

const normalizeInput = (value: string) => value.replace(',', '.').trim()

const parseGrade = (value: string): number | null => {
  const normalized = normalizeInput(value)
  if (!normalized || normalized === '.' || normalized === '-.' || normalized === '-') {
    return null
  }

  const num = Number(normalized)
  if (!Number.isFinite(num)) return null

  if (num < 0) return 0
  if (num > 20) return 20
  return num
}

const sanitizeGradeInput = (value: string): string => {
  const parsed = parseGrade(value)
  return parsed === null ? '' : String(parsed)
}

const canAcceptInput = (value: string): boolean => {
  const normalized = value.replace(',', '.')
  return normalized === '' || /^(\d+(\.\d*)?|\.\d*)$/.test(normalized)
}

const isModuleStarted = (module: SemesterModule, grades: Grades): boolean =>
  module.assessments.some(({ field }) => grades[field].trim() !== '')

const isModuleComplete = (module: SemesterModule, grades: Grades): boolean =>
  module.assessments.every(({ field }) => parseGrade(grades[field]) !== null)

const calculateModuleAverage = (module: SemesterModule, grades: Grades): number | null => {
  if (!isModuleComplete(module, grades)) return null

  const totalWeight = module.assessments.reduce((sum, assessment) => sum + assessment.weight, 0)
  const weightedSum = module.assessments.reduce((sum, assessment) => {
    const grade = parseGrade(grades[assessment.field]) as number
    return sum + grade * assessment.weight
  }, 0)

  return totalWeight === 0 ? null : weightedSum / totalWeight
}

const calculateSemesterStats = (modules: SemesterModule[], grades: ModuleGrades) => {
  let totalWeightedSum = 0
  let countedCoeff = 0
  let completedModules = 0
  let startedModules = 0

  modules.forEach((module) => {
    const moduleGrades = grades[module.id] ?? emptyGrades()

    if (isModuleStarted(module, moduleGrades)) {
      startedModules += 1
    }

    const moduleAverage = calculateModuleAverage(module, moduleGrades)
    if (moduleAverage === null) return

    totalWeightedSum += moduleAverage * module.coefficient
    countedCoeff += module.coefficient
    completedModules += 1
  })

  const totalAvailableCoeff = modules.reduce((sum, module) => sum + module.coefficient, 0)

  return {
    average: countedCoeff > 0 ? totalWeightedSum / countedCoeff : 0,
    countedCoeff,
    totalAvailableCoeff,
    completedModules,
    totalModules: modules.length,
    startedModules,
    progressPercent: totalAvailableCoeff > 0 ? (countedCoeff / totalAvailableCoeff) * 100 : 0
  }
}

const getGradeColor = (average: number): string => {
  if (average >= 16) return 'grade-excellent'
  if (average >= 14) return 'grade-good'
  if (average >= 10) return 'grade-pass'
  return 'grade-fail'
}

const AnimatedCounter = ({
  value,
  duration = 1200
}: {
  value: number
  duration?: number
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const initialValue = displayValue

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = initialValue + (value - initialValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        frame = requestAnimationFrame(update)
      }
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <>{displayValue.toFixed(2)}</>
}

const LanguageSwitcher = ({
  currentLang,
  onLanguageChange
}: {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية', flag: 'AR' }
  ]

  const currentLanguage = languages.find((language) => language.code === currentLang)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-300 border border-white/20"
      >
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-ce-lg border border-ce-border overflow-hidden z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => {
                onLanguageChange(language.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                currentLang === language.code
                  ? 'bg-ce-yellow/10 text-ce-yellow'
                  : 'text-ce-dark hover:bg-ce-light'
              }`}
            >
              <span className="text-xs font-semibold w-6">{language.flag}</span>
              <span className="text-sm font-medium">{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ModuleCard = ({
  module,
  grades,
  onGradeChange,
  index,
  t
}: {
  module: SemesterModule
  grades: Grades
  onGradeChange: (field: GradeField, value: string) => void
  index: number
  t: Translation
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const moduleAverage = calculateModuleAverage(module, grades)

  useEffect(() => {
    if (!cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        delay: index * 0.06,
        ease: 'power3.out'
      }
    )
  }, [index, module.id])

  const handleInputChange = (field: GradeField, value: string) => {
    if (!canAcceptInput(value)) return
    onGradeChange(field, value.replace(',', '.'))
  }

  const handleBlur = (field: GradeField, value: string) => {
    onGradeChange(field, sanitizeGradeInput(value))
  }

  return (
    <div ref={cardRef} className="module-card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-ce-yellow/10 flex items-center justify-center">
            {module.icon}
          </div>
          <div>
            <h3 className="font-semibold text-ce-dark leading-snug">
              {t.moduleNames[module.nameKey]}
            </h3>
            <p className="text-sm text-ce-concrete">
              {t.coeff}: {module.coefficient}
            </p>
          </div>
        </div>

        {moduleAverage !== null && (
          <div className="px-3 py-1 rounded-full bg-ce-yellow/10 text-ce-yellow text-sm font-semibold">
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
              onChange={(event) => handleInputChange(assessment.field, event.target.value)}
              onBlur={(event) => handleBlur(assessment.field, event.target.value)}
              placeholder="--"
              className="ce-input text-center py-2.5 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState<Language>('fr')
  const [selectedSemester, setSelectedSemester] = useState<SemesterId | null>(null)
  const [gradesBySemester, setGradesBySemester] = useState<Record<SemesterId, ModuleGrades>>({
    s5: buildInitialGrades(semesterConfigs.s5.modules),
    s6: buildInitialGrades(semesterConfigs.s6.modules)
  })

  const heroRef = useRef<HTMLDivElement | null>(null)
  const calculatorRef = useRef<HTMLDivElement | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)

  const t = translations[lang]
  const currentConfig = selectedSemester ? semesterConfigs[selectedSemester] : null

  const currentGrades = useMemo<ModuleGrades>(() => {
    if (!selectedSemester) return {}
    return gradesBySemester[selectedSemester]
  }, [selectedSemester, gradesBySemester])

  const stats = useMemo(() => {
    if (!currentConfig) {
      return {
        average: 0,
        countedCoeff: 0,
        totalAvailableCoeff: 0,
        completedModules: 0,
        totalModules: 0,
        startedModules: 0,
        progressPercent: 0
      }
    }

    return calculateSemesterStats(currentConfig.modules, currentGrades)
  }, [currentConfig, currentGrades])

  const handleGradeChange = useCallback(
    (semesterId: SemesterId, moduleId: string, field: GradeField, value: string) => {
      setGradesBySemester((prev) => ({
        ...prev,
        [semesterId]: {
          ...prev[semesterId],
          [moduleId]: {
            ...prev[semesterId][moduleId],
            [field]: value
          }
        }
      }))
    },
    []
  )

  const handleReset = () => {
    if (!selectedSemester) return

    setGradesBySemester((prev) => ({
      ...prev,
      [selectedSemester]: buildInitialGrades(semesterConfigs[selectedSemester].modules)
    }))
  }

  const handleSelectSemester = (semesterId: SemesterId) => {
    setSelectedSemester(semesterId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const getGradeLabel = (average: number) => {
    if (average >= 16) return t.gradeLabels.excellent
    if (average >= 14) return t.gradeLabels.veryGood
    if (average >= 12) return t.gradeLabels.good
    if (average >= 10) return t.gradeLabels.pass
    return t.gradeLabels.fail
  }

  useEffect(() => {
    if (!heroRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 40, rotateX: 35 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' }
      )

      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' }
      )

      gsap.fromTo(
        '.hero-cta, .selector-card, .info-card, .result-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, delay: 0.35, ease: 'power3.out' }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [selectedSemester, lang])

  if (!selectedSemester) {
    return (
      <div ref={heroRef} className="min-h-screen relative overflow-hidden bg-ce-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ce-dark via-ce-gray to-ce-dark" />
        <div className="absolute inset-0 blueprint-grid opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
          <div className="flex justify-end">
            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
          </div>

          <div className="flex-1 flex items-center">
            <div className="w-full">
              <div className="text-center max-w-4xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ce-yellow/10 border border-ce-yellow/20 text-ce-yellow mb-6">
                  <Calculator className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.selectorHint}</span>
                </div>

                <h1 className="hero-title text-5xl md:text-7xl font-bold font-poppins mb-5">
                  {t.title} <span className="text-ce-yellow">{t.titleHighlight}</span>
                </h1>

                <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-3">
                  {t.homeSubtitle}
                </p>

                <p className="hero-subtitle text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                  {t.homeDescription}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {(['s5', 's6'] as SemesterId[]).map((semesterId) => (
                  <button
                    key={semesterId}
                    type="button"
                    onClick={() => handleSelectSemester(semesterId)}
                    className="selector-card ce-card glass-panel text-left p-8 group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-ce-yellow/10 flex items-center justify-center">
                        <Calculator className="w-7 h-7 text-ce-yellow" />
                      </div>
                      <div className="text-ce-yellow text-sm font-semibold">
                        {t.startButton}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold font-poppins text-ce-dark mb-2">
                      {t.semesterNames[semesterId]}
                    </h2>

                    <p className="text-ce-concrete mb-5">
                      {semesterId === 's5'
                        ? t.lang === 'ar'
                          ? 'حاسبة الفصل الخامس الحالية بعد تصحيح المنطق الحسابي.'
                          : lang === 'en'
                          ? 'Current semester calculator with corrected calculation logic.'
                          : 'Calculatrice actuelle du semestre corrigée avec une logique exacte.'
                        : lang === 'ar'
                        ? 'نفس الواجهة مع وحدات الفصل السادس والحساب اللحظي.'
                        : lang === 'en'
                        ? 'Same interface with Semester 6 modules and live calculations.'
                        : 'La même interface avec les modules du semestre 6 et un calcul en direct.'}
                    </p>

                    <div className="flex items-center text-ce-yellow font-medium group-hover:translate-x-1 transition-transform">
                      {t.startButton}
                      <span className="ml-2">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentSemesterName = t.semesterNames[selectedSemester]
  const gradeColor = getGradeColor(stats.average)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section ref={heroRef} className="relative overflow-hidden bg-ce-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-ce-dark via-ce-gray to-ce-dark" />
        <div className="absolute inset-0 blueprint-grid opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-14">
            <button
              type="button"
              onClick={() => setSelectedSemester(null)}
              className="ce-btn-secondary inline-flex items-center gap-2 self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backHome}
            </button>

            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
          </div>

          <div className="text-center max-w-4xl mx-auto pb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ce-yellow/10 border border-ce-yellow/20 text-ce-yellow mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{currentSemesterName}</span>
            </div>

            <h1 className="hero-title text-5xl md:text-7xl font-bold font-poppins mb-5">
              {t.title} <span className="text-ce-yellow">{t.titleHighlight}</span>
            </h1>

            <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-3">
              {currentSemesterName} - {t.homeSubtitle}
            </p>

            <p className="hero-subtitle text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              {t.modulesDescription}
            </p>

            <button
              type="button"
              onClick={() => calculatorRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="hero-cta ce-btn inline-flex items-center gap-2 text-lg"
            >
              <Calculator className="w-5 h-5" />
              {t.startButton}
            </button>
          </div>
        </div>
      </section>

      <section ref={calculatorRef} className="relative py-20">
        <div className="absolute inset-0 blueprint-grid opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold font-poppins text-ce-dark mb-4">{t.modulesTitle}</h2>
            <p className="text-lg text-ce-concrete max-w-3xl mx-auto">{t.modulesDescription}</p>
          </div>

          <div className="ce-card p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-ce-dark">{t.progress}</h3>
                <p className="text-sm text-ce-concrete">
                  {Math.round(stats.progressPercent)}% • {stats.countedCoeff} / {stats.totalAvailableCoeff}{' '}
                  {t.coeffFilled}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={scrollToResult} className="ce-btn inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.calculateButton}
                </button>

                <button type="button" onClick={handleReset} className="ce-btn-secondary inline-flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {t.resetButton}
                </button>
              </div>
            </div>

            <div className="h-2 bg-ce-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentConfig.modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                grades={currentGrades[module.id]}
                onGradeChange={(field, value) =>
                  handleGradeChange(selectedSemester, module.id, field, value)
                }
                index={index}
                t={t}
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
                <p className="text-ce-yellow font-medium mb-3">{t.resultTitle}</p>
                <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{t.yourAverage}</h2>

                <div className={`text-6xl md:text-7xl font-bold font-poppins mb-3 ${gradeColor}`}>
                  <AnimatedCounter value={stats.average} />
                </div>

                <p className="text-xl text-gray-300 mb-4">/20</p>

                <div className="flex items-center justify-center gap-3">
                  {stats.average >= 10 && stats.countedCoeff > 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className="text-xl font-semibold">{getGradeLabel(stats.average)}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="text-3xl font-bold text-ce-yellow mb-1">{stats.countedCoeff}</div>
                  <div className="text-sm text-gray-300">{t.coefficients}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="text-3xl font-bold text-ce-yellow mb-1">{stats.completedModules}</div>
                  <div className="text-sm text-gray-300">{t.completedModules}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="text-3xl font-bold text-ce-yellow mb-1">
                    {stats.average >= 10 && stats.countedCoeff > 0 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-300">{t.validation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ce-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="construction-line mb-16" />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="info-card ce-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-ce-yellow/10 flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-ce-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-ce-dark">{t.precision}</h3>
              <p className="text-ce-concrete leading-relaxed">{t.precisionDesc}</p>
            </div>

            <div className="info-card ce-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-ce-yellow/10 flex items-center justify-center mb-5">
                <Building2 className="w-7 h-7 text-ce-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-ce-dark">{t.structure}</h3>
              <p className="text-ce-concrete leading-relaxed">{t.structureDesc}</p>
            </div>

            <div className="info-card ce-card p-8">
              <div className="w-14 h-14 rounded-2xl bg-ce-yellow/10 flex items-center justify-center mb-5">
                <TrendingUp className="w-7 h-7 text-ce-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-ce-dark">{t.performance}</h3>
              <p className="text-ce-concrete leading-relaxed">{t.performanceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-ce-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold font-poppins mb-2">{t.footerTitle}</h3>
          <p className="text-gray-400">
            {t.footerSubtitle} - {currentSemesterName}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App