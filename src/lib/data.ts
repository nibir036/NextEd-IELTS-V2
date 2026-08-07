import {
  UserProfile,
  SkillScore,
  StatSummary,
  LearningPathItem,
  ActivityEntry,
  SkillModule,
  SiteStat,
  MockTest,
  ReadingPassage,
  SubmissionItem,
} from '../types';

export const currentUser: UserProfile = {
  name: 'Alex Rivers',
  avatar: 'AR',
  targetBand: 8.0,
  currentBand: 7.5,
  examDate: '2026-09-15',
  streakDays: 14,
  practiceHours: 38.5,
  testsCompleted: 12,
};

export const bandSummary = {
  overall: 7.5,
  target: 8.0,
  reading: 7.5,
  listening: 8.0,
  writing: 6.5,
  speaking: 7.0,
  forecastBand: 7.8,
  confidencePercent: 92,
};

export const skillScores: SkillScore[] = [
  { skill: 'Listening', band: 8.0, change: '+0.5' },
  { skill: 'Reading', band: 7.5, change: '+0.5' },
  { skill: 'Speaking', band: 7.0, change: 'Stable' },
  { skill: 'Writing', band: 6.5, change: 'Needs Focus' },
];

export const statSummaries: StatSummary[] = [
  {
    label: 'Overall Band Score',
    value: '7.5',
    footnote: 'Target Band: 8.0 (+0.5 needed)',
    trend: '+0.5 this month',
    icon: 'Trophy',
  },
  {
    label: 'Daily Streak',
    value: '14 Days',
    footnote: 'Top 5% active learner consistency',
    trend: '🔥 14d streak',
    icon: 'Flame',
  },
  {
    label: 'Practice Hours',
    value: '38.5 hrs',
    footnote: 'Avg 1.2 hrs/day focused study',
    trend: '+4.2 hrs this week',
    icon: 'Clock',
  },
  {
    label: 'Tests Completed',
    value: '12 Tests',
    footnote: '8 Full Mocks · 4 Section Sprints',
    trend: '3 passed > 7.5',
    icon: 'FileCheck',
  },
];

export const learningPath: LearningPathItem[] = [
  {
    id: 'path-1',
    title: 'Task 2 Essay Structure & Cohesion Masterclass',
    level: 'Focus Area: Band 6.5 → 7.5',
    skill: 'writing',
    duration: '25 mins',
    icon: 'PenTool',
    status: 'recommended',
  },
  {
    id: 'path-2',
    title: 'Part 3 Abstract Discussion & Complex Connectors',
    level: 'Focus Area: Band 7.0 → 8.0',
    skill: 'speaking',
    duration: '20 mins',
    icon: 'Mic',
    status: 'in-progress',
  },
  {
    id: 'path-3',
    title: 'True / False / Not Given Strategy & Distractor Elimination',
    level: 'Focus Area: Band 7.5 → 8.5',
    skill: 'reading',
    duration: '15 mins',
    icon: 'BookOpen',
    status: 'recommended',
  },
  {
    id: 'path-4',
    title: 'Section 4 Academic Lecture Note-Taking Sprints',
    level: 'Focus Area: Band 8.0 → 8.5',
    skill: 'listening',
    duration: '18 mins',
    icon: 'Headphones',
    status: 'completed',
  },
];

export const recentActivity: ActivityEntry[] = [
  {
    id: 'act-1',
    skill: 'writing',
    title: 'Task 2 Opinion Essay: AI in Higher Education',
    date: 'Today, 10:45 AM',
    band: 6.5,
    summary: 'Strong vocabulary usage; coherence needs paragraph transitions refinement.',
  },
  {
    id: 'act-2',
    skill: 'speaking',
    title: 'Part 2 Cue Card: An Important Life Decision',
    date: 'Yesterday, 4:20 PM',
    band: 7.0,
    summary: 'Fluent cadence with good idiomatic phrases; slight hesitation on Part 3 abstract queries.',
  },
  {
    id: 'act-3',
    skill: 'reading',
    title: 'Academic Passage 3: Marine Biodiversity & Climate',
    date: 'Aug 4, 2026',
    band: 7.5,
    summary: '11/13 correct. Excelled at Headings; missed 2 True/False inference nuances.',
  },
  {
    id: 'act-4',
    skill: 'listening',
    title: 'Full Section 1-4 Sprint: Campus Facilities & Tech',
    date: 'Aug 2, 2026',
    band: 8.0,
    summary: '36/40 correct. Excellent performance on Section 3 multi-choice speakers.',
  },
];

export const skillModules: SkillModule[] = [
  {
    id: 'reading',
    name: 'IELTS Reading',
    description: 'Academic & General passages with real-time AI paragraph analysis and vocabulary lookup.',
    activeModulesCount: 42,
    targetTip: 'Master True/False/Not Given traps with instant line-by-line evidence justification.',
    icon: 'BookOpen',
  },
  {
    id: 'listening',
    name: 'IELTS Listening',
    description: 'Native speaker accents (UK, AU, US, CA) with variable playback speeds and synchronized audio transcripts.',
    activeModulesCount: 38,
    targetTip: 'Train spelling & signpost recognition under exam time pressure.',
    icon: 'Headphones',
  },
  {
    id: 'writing',
    name: 'IELTS Writing',
    description: 'Instant Band 0-9 evaluation powered by official IELTS descriptors with sentence-level rewrites.',
    activeModulesCount: 56,
    targetTip: 'Boost Lexical Resource & Cohesion with automated collocations feedback.',
    icon: 'PenTool',
  },
  {
    id: 'speaking',
    name: 'IELTS Speaking',
    description: 'Voice simulator with real-time prompt analysis, fluency tracking, and pronunciation diagnosis.',
    activeModulesCount: 29,
    targetTip: 'Practice Part 2 cue cards with 60-second prep timer & AI examiner response analysis.',
    icon: 'Mic',
  },
];

export const siteStats: SiteStat[] = [
  {
    label: 'Core Exam Modules',
    value: '4 Skills',
    description: 'Reading, Listening, Writing, and Speaking practice',
  },
  {
    label: 'Official Descriptors',
    value: 'Band 0–9',
    description: 'Evaluated against official IELTS band criteria',
  },
  {
    label: 'IELTS Standard',
    value: '0.5 Rounding',
    description: 'Calculates exact official rounded band score',
  },
  {
    label: 'Diagnostic Engine',
    value: 'Instant AI',
    description: 'Sentence-level rewrites & pronunciation guidance',
  },
];

export const mockTestsList: MockTest[] = [
  {
    id: 'mock-1',
    title: 'Academic Full Test 01 - Complete Exam Simulation',
    category: 'Academic',
    duration: '2 hrs 45 mins',
    difficulty: 'Exam Simulation',
    questionsCount: 80,
    completedCount: 4120,
    description: 'Full 4-skill test under strict Cambridge timer constraints with instant AI evaluation.',
  },
  {
    id: 'mock-2',
    title: 'Writing Task 1 & 2 Intensive Sprint',
    category: 'Skill Sprint',
    duration: '60 mins',
    difficulty: 'Hard',
    questionsCount: 2,
    completedCount: 8290,
    description: 'One Bar Chart analysis and one 250-word Opinion essay with detailed band feedback.',
  },
  {
    id: 'mock-3',
    title: 'General Training Reading & Writing Pack',
    category: 'General Training',
    duration: '2 hrs 00 mins',
    difficulty: 'Medium',
    questionsCount: 42,
    completedCount: 3100,
    description: 'Workplace passages, formal complaint letter, and community policy essays.',
  },
  {
    id: 'mock-4',
    title: 'Speaking Part 1-3 AI Examiner Simulator',
    category: 'Skill Sprint',
    duration: '15 mins',
    difficulty: 'Exam Simulation',
    questionsCount: 12,
    completedCount: 9450,
    description: 'Real-time audio prompts, Part 2 cue card timer, and Part 3 abstract discussion.',
  },
];

export const readingPassageSample: ReadingPassage = {
  title: 'The Architecture of Deep Sea Coral Reefs',
  category: 'Academic Reading — Passage 3',
  durationMinutes: 20,
  paragraphs: [
    {
      label: 'Paragraph A',
      text: 'Deep-sea coral reefs, often located hundreds of meters beneath the surface where sunlight cannot penetrate, represent some of the planet’s most mysterious ecosystems. Unlike tropical corals that rely on photosynthetic algae called zooxanthellae, deep-water stony corals such as Lophelia pertusa thrive in pitch darkness by capturing organic particles suspended in ocean currents.',
    },
    {
      label: 'Paragraph B',
      text: 'Recent autonomous underwater vehicle (AUV) mapping expeditions off the North Atlantic coast have revealed vast mounds formed over millennia. These carbonate mounds can reach heights exceeding 150 meters and stretch across several kilometers, housing diverse fish species, crustaceans, and sponges.',
    },
    {
      label: 'Paragraph C',
      text: 'Despite their cold, high-pressure environments, deep-sea corals are exceptionally vulnerable to anthropogenic disturbances. Bottom-trawling commercial fishing gear can reduce centuries-old reef structures to rubble in a single pass. Furthermore, ocean acidification alters seawater carbonate chemistry, making it harder for corals to build calcium carbonate skeletons.',
    },
    {
      label: 'Paragraph D',
      text: 'Marine conservationists argue that expanding Marine Protected Areas (MPAs) into international waters is vital to protecting deep corals. Advanced acoustics and environmental DNA (eDNA) sampling now enable scientists to identify coral hotspots without disturbing fragile marine habitats.',
    },
  ],
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'How do deep-water corals obtain nourishment in total darkness?',
      options: [
        'A. Through photosynthetic algae zooxanthellae',
        'B. By capturing organic matter floating in water currents',
        'C. By absorbing direct thermal energy from hydro-vents',
        'D. Through chemical reactions with seabed carbonate',
      ],
      correctAnswer: 'B. By capturing organic matter floating in water currents',
      explanation: 'Paragraph A specifies that deep stony corals thrive in darkness "by capturing organic particles suspended in ocean currents."',
    },
    {
      id: 2,
      type: 'true-false-not-given',
      question: 'Deep-sea carbonate mounds take centuries or millennia to reach 150 meters in height.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'TRUE',
      explanation: 'Paragraph B notes these mounds are "formed over millennia" and "can reach heights exceeding 150 meters."',
    },
    {
      id: 3,
      type: 'true-false-not-given',
      question: 'Commercial bottom-trawling has been completely banned in international marine sanctuaries.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'NOT GIVEN',
      explanation: 'Paragraph D mentions conservationists argue for expanding protected areas, but nowhere does the passage state bottom-trawling is completely banned.',
    },
  ],
};

export const writingPromptsSample = {
  task1: {
    title: 'Task 1: Academic Line Graph Analysis',
    prompt: 'The graph below shows the percentage of household budget spent on energy, food, and transport in three European countries between 2000 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (Min 150 words)',
  },
  task2: {
    title: 'Task 2: Opinion Essay on Technology in Education',
    prompt: 'Some people believe that artificial intelligence tools should be integrated into higher education to replace traditional lectures, while others argue that human interaction in universities is indispensable. Discuss both views and give your own opinion. Give reasons for your answer and include relevant examples from your knowledge or experience. (Min 250 words)',
    sampleEssay: `In the contemporary era, the rapid evolution of artificial intelligence has sparked intense debate regarding its role in tertiary education. While proponents contend that AI-driven instruction can deliver hyper-personalized learning experiences that surpass traditional lectures, opponents maintain that human pedagogical guidance remains paramount. In my view, although AI tools provide extraordinary efficiency in information retrieval, they should augment rather than replace human professors.

On the one hand, advocates of AI integration highlight the unprecedented scalability and adaptability of digital tutors. AI systems can analyze an individual student's learning pace, identify conceptual deficiencies, and tailor exercises accordingly. Furthermore, digital platforms grant round-the-clock access to vast repositories of knowledge, liberating students from rigid lecture timetables. For instance, intelligent tutoring platforms in computer science can instantly review thousands of lines of student code, delivering real-time debugging feedback that a single lecturer could never provide to a large cohort.

On the other hand, traditional university lectures cultivate essential interpersonal and critical thinking skills that algorithms cannot replicate. Human educators do not merely transmit facts; they mentor, inspire, and foster ethical debates. The collaborative atmosphere of a university seminar encourages spontaneous discourse, empathy, and intellectual disagreement. Moreover, professors serve as role models, offering tailored career counsel and emotional encouragement during challenging academic periods. 

In conclusion, while artificial intelligence undeniably revolutionizes information delivery in higher education, human professors provide indispensable emotional intelligence and mentorship. Therefore, a hybrid educational framework—wherein AI handles routine instruction and human academics lead high-level discussions—represents the optimal approach for future universities.`,
  },
};

export const submissionsHistory: SubmissionItem[] = [
  {
    id: 'sub-101',
    type: 'writing',
    title: 'Task 2: Artificial Intelligence in Higher Education',
    submittedAt: 'Today, 10:45 AM',
    bandScore: 6.5,
    details: {
      prompt: 'Discuss both views on AI replacing traditional university lectures...',
      userResponse: 'In recent years, AI has become popular in universities...',
      evaluations: [
        { label: 'Task Response', score: 7.0, notes: 'Addressed both views clearly with good arguments.' },
        { label: 'Coherence & Cohesion', score: 6.0, notes: 'Paragraphing is logical, but linking devices are repetitive.' },
        { label: 'Lexical Resource', score: 6.5, notes: 'Good academic vocabulary; minor awkward collocations.' },
        { label: 'Grammatical Accuracy', score: 6.5, notes: 'Complex sentences used, but 3 punctuation errors detected.' },
      ],
      feedback: 'To reach Band 7.5+, vary your discourse markers (e.g., replace "On the other hand" with "Conversely") and ensure every topic sentence is supported by concrete examples.',
    },
  },
  {
    id: 'sub-102',
    type: 'speaking',
    title: 'Part 2 Cue Card: An Important Decision',
    submittedAt: 'Aug 5, 2026, 4:20 PM',
    bandScore: 7.0,
    details: {
      prompt: 'Describe a decision you made recently that changed your perspective...',
      userResponse: 'Audio recording submitted (1 min 52 seconds)',
      evaluations: [
        { label: 'Fluency & Coherence', score: 7.0, notes: 'Natural pace with smooth transitions between cue card points.' },
        { label: 'Lexical Resource', score: 7.5, notes: 'Used idiom "crossroads in life" and "weighed the pros and cons".' },
        { label: 'Grammatical Range', score: 6.5, notes: 'Occasional tense slips when switching from past to present.' },
        { label: 'Pronunciation', score: 7.0, notes: 'Clear intonation; minor stress issue on "photographer".' },
      ],
      feedback: 'Excellent response length! Work on consistent past perfect tense usage when describing events leading up to the decision.',
    },
  },
  {
    id: 'sub-103',
    type: 'reading',
    title: 'Academic Passage 3: Marine Biodiversity',
    submittedAt: 'Aug 4, 2026',
    bandScore: 7.5,
    details: {
      prompt: 'The Architecture of Deep Sea Coral Reefs (13 Questions)',
      userResponse: 'Completed in 16 mins 42 secs',
      evaluations: [
        { label: 'Multiple Choice', score: 100, notes: '4/4 correct' },
        { label: 'Headings Matching', score: 80, notes: '4/5 correct' },
        { label: 'True / False / Not Given', score: 75, notes: '3/4 correct' },
      ],
      feedback: 'Strong performance on factual retrieval. Pay special attention to "NOT GIVEN" questions where statements sound plausible but are unmentioned in text.',
    },
  },
];
