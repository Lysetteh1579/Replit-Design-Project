import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Feather,
  Lightbulb,
  ListPlus,
  PenLine,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
  Trash2,
} from "lucide-react";

type Question = {
  prompt: string;
  answers: string[];
  correct: number;
};

type Quiz = {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: Question[];
  color: string;
  tag: string;
  author: string;
};

const starterQuizzes: Quiz[] = [
  {
    id: "kitchen",
    title: "A little kitchen know-how",
    category: "Everyday",
    description: "The small facts that make dinner-party chat.",
    color: "peach",
    tag: "5 questions",
    author: "Mara L.",
    questions: [
      { prompt: "Which herb is traditionally used to make pesto?", answers: ["Dill", "Basil", "Mint", "Parsley"], correct: 1 },
      { prompt: "What does al dente mean when pasta is cooked?", answers: ["Very soft", "With a little bite", "Extra salty", "Served cold"], correct: 1 },
      { prompt: "Which of these is a citrus fruit?", answers: ["Apricot", "Clementine", "Plum", "Pear"], correct: 1 },
      { prompt: "A standard loaf of sourdough gets its rise from what?", answers: ["Baking soda", "Whipped cream", "A starter culture", "Olive oil"], correct: 2 },
      { prompt: "What is the main ingredient in hummus?", answers: ["Chickpeas", "Lentils", "White beans", "Peas"], correct: 0 },
    ],
  },
  {
    id: "sky",
    title: "Look up: sky & space",
    category: "Curious minds",
    description: "A pocket-sized trip around our corner of the universe.",
    color: "blue",
    tag: "4 questions",
    author: "Theo R.",
    questions: [
      { prompt: "Which planet has the most prominent rings?", answers: ["Mars", "Saturn", "Venus", "Mercury"], correct: 1 },
      { prompt: "What is the name of our galaxy?", answers: ["Andromeda", "The Milky Way", "Sombrero", "Whirlpool"], correct: 1 },
      { prompt: "What do we call a rock from space that reaches the ground?", answers: ["Meteorite", "Comet", "Asteroid", "Nebula"], correct: 0 },
      { prompt: "Which star is closest to Earth?", answers: ["Sirius", "Polaris", "The Sun", "Vega"], correct: 2 },
    ],
  },
  {
    id: "words",
    title: "Words with a past",
    category: "Wordplay",
    description: "Guess where a few familiar words began.",
    color: "lilac",
    tag: "4 questions",
    author: "Nina P.",
    questions: [
      { prompt: "Which language gave us the word 'ballet'?", answers: ["Italian", "French", "Spanish", "German"], correct: 1 },
      { prompt: "A 'bungalow' originally comes from which region?", answers: ["Bengal", "Bavaria", "Brittany", "Bolivia"], correct: 0 },
      { prompt: "What does the Japanese word 'karaoke' roughly mean?", answers: ["Empty orchestra", "Quiet song", "Midnight music", "Open stage"], correct: 0 },
      { prompt: "Which language is the origin of 'kindergarten'?", answers: ["Dutch", "German", "Swedish", "Danish"], correct: 1 },
    ],
  },
  {
    id: "garden",
    title: "The tiny garden quiz",
    category: "Outdoors",
    description: "For anyone who has ever named a houseplant.",
    color: "green",
    tag: "4 questions",
    author: "Ari & Jo",
    questions: [
      { prompt: "Which part of a plant usually absorbs water from the soil?", answers: ["Leaves", "Roots", "Petals", "Stem"], correct: 1 },
      { prompt: "What do bees collect from flowers to make honey?", answers: ["Nectar", "Dew", "Pollen only", "Sap"], correct: 0 },
      { prompt: "Which of these is a bulb plant?", answers: ["Tulip", "Daisy", "Fern", "Lavender"], correct: 0 },
      { prompt: "What is the name for a young tree?", answers: ["Sapling", "Seedling", "Sprig", "Shoot"], correct: 0 },
    ],
  },
];

const letters = ["A", "B", "C", "D", "E", "F"];

function copyQuiz(quiz: Quiz): Quiz {
  return { ...quiz, questions: quiz.questions.map((question) => ({ ...question, answers: [...question.answers] })) };
}

export function QuizSite() {
  const [page, setPage] = useState<"browse" | "play" | "edit">("browse");
  const [quizzes, setQuizzes] = useState<Quiz[]>(starterQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<Quiz>(copyQuiz(starterQuizzes[0]));
  const [playQuestions, setPlayQuestions] = useState<Question[]>(copyQuiz(starterQuizzes[0]).questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answersGiven, setAnswersGiven] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [category, setCategory] = useState("All quizzes");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const categories = ["All quizzes", "Everyday", "Curious minds", "Wordplay", "Outdoors"];
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory = category === "All quizzes" || quiz.category === category;
    const query = search.trim().toLowerCase();
    return matchesCategory && (!query || `${quiz.title} ${quiz.description} ${quiz.category}`.toLowerCase().includes(query));
  });
  const currentQuestion = playQuestions[questionIndex];

  function startQuiz(quiz: Quiz) {
    setActiveQuiz(copyQuiz(quiz));
    setPlayQuestions(copyQuiz(quiz).questions);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswersGiven([]);
    setShowResult(false);
    setNotice("");
    setPage("play");
  }

  function startEditing(quiz?: Quiz) {
    const draft = quiz ? copyQuiz(quiz) : {
      id: `my-quiz-${Date.now()}`,
      title: "A quiz of my own",
      category: "Everyday",
      description: "A few good questions for friends.",
      questions: [{ prompt: "", answers: ["", "", "", ""], correct: 0 }],
      color: "peach",
      tag: "Your quiz",
      author: "You",
    };
    setActiveQuiz(draft);
    setPage("edit");
  }

  function moveQuestion(direction: number) {
    if (selectedAnswer === null) return;
    const updatedAnswers = [...answersGiven];
    updatedAnswers[questionIndex] = selectedAnswer;
    setAnswersGiven(updatedAnswers);
    const nextIndex = questionIndex + direction;
    setSelectedAnswer(updatedAnswers[nextIndex] ?? null);
    setQuestionIndex(nextIndex);
  }

  function finishQuiz() {
    if (selectedAnswer === null) return;
    const updatedAnswers = [...answersGiven];
    updatedAnswers[questionIndex] = selectedAnswer;
    setAnswersGiven(updatedAnswers);
    setShowResult(true);
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    setActiveQuiz((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((question, questionNumber) =>
        questionNumber === index ? { ...question, ...updates } : question,
      ),
    }));
  }

  function updateAnswer(questionIndexToUpdate: number, answerIndex: number, value: string) {
    const question = activeQuiz.questions[questionIndexToUpdate];
    const answers = [...question.answers];
    answers[answerIndex] = value;
    updateQuestion(questionIndexToUpdate, { answers });
  }

  function saveQuiz() {
    if (!activeQuiz.title.trim()) {
      setNotice("Give your quiz a title before saving.");
      return;
    }
    const completeQuestions = activeQuiz.questions.filter((question) => question.prompt.trim());
    const saved = { ...activeQuiz, questions: completeQuestions.length ? completeQuestions : activeQuiz.questions };
    setQuizzes((existing) => {
      const alreadySaved = existing.some((quiz) => quiz.id === saved.id);
      return alreadySaved ? existing.map((quiz) => (quiz.id === saved.id ? saved : quiz)) : [saved, ...existing];
    });
    setActiveQuiz(saved);
    setNotice("Saved to your little quiz shelf.");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function shuffleQuestions() {
    const shuffled = [...playQuestions];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlayQuestions(shuffled);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswersGiven([]);
    setShowResult(false);
  }

  const score = answersGiven.reduce((total, answer, index) => total + (answer === playQuestions[index]?.correct ? 1 : 0), 0);

  return (
    <div className="lystte min-h-screen bg-[#fffaf1] text-[#2f3029]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
        .lystte { --ink:#2f3029; --muted:#78776d; --paper:#fffaf1; --line:#e9dfcc; --coral:#e66c4d; --teal:#276e67; --yellow:#f4c95d; font-family:'DM Sans',sans-serif; }
        .lystte * { box-sizing:border-box; }
        .lystte button, .lystte input, .lystte textarea, .lystte select { font:inherit; }
        .lystte button:focus-visible, .lystte input:focus-visible, .lystte textarea:focus-visible, .lystte select:focus-visible { outline:3px solid #e66c4d; outline-offset:3px; }
        .lystte .display { font-family:'Fraunces', Georgia, serif; }
        .lystte .paper-dots { background-image: radial-gradient(#c7b99d 0.7px, transparent 0.7px); background-size:18px 18px; }
        .lystte .card-lift { transition:transform .2s ease, box-shadow .2s ease; }
        .lystte .card-lift:hover { transform:translateY(-4px) rotate(-.35deg); box-shadow:0 14px 28px #47351a14; }
        .lystte .slide-in { animation:lystte-in .28s ease both; }
        @keyframes lystte-in { from { opacity:0; transform:translateY(7px) } to { opacity:1; transform:translateY(0) } }
        .lystte .scribble { text-decoration: underline; text-decoration-color:#e66c4d; text-decoration-thickness:3px; text-underline-offset:6px; }
        .lystte .option-radio:checked + span { border-color:#276e67; background:#e7f2ed; box-shadow:inset 0 0 0 1px #276e67; }
        .lystte .option-radio:checked + span .option-letter { background:#276e67; color:white; }
        @media (prefers-reduced-motion: reduce) { .lystte *, .lystte *::before, .lystte *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; scroll-behavior:auto !important; } }
      `}</style>
      <header className="border-b border-[#e9dfcc] bg-[#fffaf1]/95">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <button className="group flex items-center gap-2.5 text-left" onClick={() => setPage("browse")} aria-label="Lystte Quiz home">
            <span className="grid h-10 w-10 rotate-[-5deg] place-items-center rounded-[13px] bg-[#e66c4d] text-white shadow-[3px_3px_0_#b44f36]"><Feather size={20} strokeWidth={2.5} /></span>
            <span><span className="display block text-[24px] font-bold leading-none tracking-[-.04em]">lystte<span className="text-[#e66c4d]">.</span></span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.18em] text-[#77766c]">the quiz club</span></span>
          </button>
          <nav aria-label="Main navigation" className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={() => setPage("browse")} className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${page === "browse" ? "bg-[#f3ead8] text-[#2f3029]" : "text-[#77766c] hover:bg-[#f3ead8]"}`}>Explore</button>
            <button onClick={() => startEditing()} className="flex items-center gap-2 rounded-full bg-[#276e67] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#174e49] transition hover:-translate-y-0.5 hover:shadow-[0_5px_0_#174e49]"><Plus size={16} /> <span className="hidden sm:inline">Make a quiz</span><span className="sm:hidden">Make</span></button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8">
        {page === "browse" && (
          <section className="slide-in">
            <div className="relative mt-7 overflow-hidden rounded-[28px] border border-[#eadfc8] bg-[#f7e8ca] px-6 py-9 sm:mt-10 sm:px-12 sm:py-12">
              <div className="paper-dots pointer-events-none absolute inset-y-0 right-0 w-[38%] opacity-35" />
              <div className="relative z-10 max-w-[680px]">
                <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-md bg-[#fffaf1] px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#276e67] shadow-sm"><Sparkles size={14} /> Made for curious people</div>
                <h1 className="display max-w-[650px] text-[42px] font-semibold leading-[1.02] tracking-[-.04em] sm:text-[64px]">A good question<br className="hidden sm:block" /> makes a good <span className="scribble text-[#e66c4d]">little moment.</span></h1>
                <p className="mt-5 max-w-[470px] text-base leading-7 text-[#68675d] sm:text-lg">Pick up a quiz, play a few rounds, or make one for your people. No big deal. Just good questions.</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button onClick={() => startQuiz(filteredQuizzes[0] ?? quizzes[0])} className="inline-flex items-center gap-2 rounded-full bg-[#e66c4d] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_0_#b84e37] transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_#b84e37]">Play a quick quiz <ArrowRight size={17} /></button>
                  <span className="text-sm font-medium text-[#77766c]"><span className="font-bold text-[#2f3029]">{quizzes.length}</span> quizzes to browse</span>
                </div>
              </div>
              <div aria-hidden="true" className="absolute -right-3 bottom-[-22px] hidden h-[250px] w-[290px] rotate-[5deg] lg:block">
                <div className="absolute right-9 top-1 h-44 w-40 rotate-[-13deg] rounded-[21px] border-2 border-[#d6c4a3] bg-[#fffaf1] shadow-[7px_9px_0_#d8c6a5]">
                  <div className="absolute left-4 right-4 top-5 border-b border-dashed border-[#d8c6a5] pb-3 text-center text-[10px] font-bold uppercase tracking-[.2em] text-[#91856d]">Question 03</div>
                  <div className="display px-4 pt-[62px] text-center text-[20px] font-semibold leading-tight">Where do good ideas grow?</div>
                  <div className="mx-auto mt-4 h-1 w-12 rounded bg-[#e66c4d]" />
                </div>
                <div className="absolute bottom-8 right-0 grid h-16 w-16 rotate-[10deg] place-items-center rounded-full bg-[#f4c95d] text-[#53441d] shadow-md"><Lightbulb size={27} /></div>
                <div className="absolute bottom-2 right-[100px] h-12 w-12 rotate-[-12deg] rounded-full border-[3px] border-[#276e67] opacity-80" />
              </div>
            </div>

            <div className="mb-5 mt-10 flex flex-col justify-between gap-4 sm:mt-12 sm:flex-row sm:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#e66c4d]">The club shelf</p><h2 className="display mt-1 text-3xl font-semibold tracking-[-.03em]">Find your next five minutes</h2></div>
              <label className="relative block w-full sm:w-[260px]">
                <span className="sr-only">Search quizzes</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the shelf…" className="w-full rounded-full border border-[#e4d8c3] bg-[#fffdf7] px-4 py-2.5 text-sm placeholder:text-[#aaa18f] focus:border-[#276e67]" />
              </label>
            </div>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1" aria-label="Filter quizzes by topic">
              {categories.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? "border-[#2f3029] bg-[#2f3029] text-[#fffaf1]" : "border-[#e4d8c3] bg-transparent text-[#77766c] hover:border-[#9d927e]"}`}>{item}</button>)}
            </div>
            {filteredQuizzes.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredQuizzes.map((quiz, index) => <article key={quiz.id} className={`card-lift relative flex min-h-[248px] flex-col overflow-hidden rounded-[20px] border border-[#e7dcc9] p-5 ${quiz.color === "peach" ? "bg-[#f8e6dc]" : quiz.color === "blue" ? "bg-[#e1edf0]" : quiz.color === "lilac" ? "bg-[#ede6f1]" : quiz.color === "green" ? "bg-[#e5eddb]" : "bg-[#f4e8c8]"}`}>
                <div className="flex items-center justify-between"><span className="rounded-full bg-white/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#68675d]">{quiz.category}</span><span className="display text-2xl font-semibold text-[#857864]">0{index + 1}</span></div>
                <div className="mt-7"><h3 className="display text-[25px] font-semibold leading-[1.08] tracking-[-.025em]">{quiz.title}</h3><p className="mt-2 text-sm leading-5 text-[#6c6a61]">{quiz.description}</p></div>
                <div className="mt-auto flex items-end justify-between pt-5"><div><p className="text-xs font-bold text-[#494940]">{quiz.author}</p><p className="mt-1 text-[11px] text-[#827d70]">{quiz.questions.length} questions · 3 min</p></div><button onClick={() => startQuiz(quiz)} aria-label={`Play ${quiz.title}`} className="grid h-10 w-10 place-items-center rounded-full bg-[#fffaf1] text-[#276e67] shadow-sm transition hover:scale-105"><ArrowRight size={18} /></button></div>
                <button onClick={() => startEditing(quiz)} className="absolute bottom-5 right-[68px] grid h-10 w-10 place-items-center rounded-full border border-[#d9cfbd] bg-white/60 text-[#79766d] transition hover:bg-white" aria-label={`Edit ${quiz.title}`}><PenLine size={15} /></button>
              </article>)}
            </div> : <div className="rounded-2xl border border-dashed border-[#d8ccb7] bg-[#fffdf7] px-6 py-12 text-center"><CircleHelp className="mx-auto text-[#9b907d]" /><p className="display mt-3 text-xl font-semibold">No quizzes on this shelf.</p><p className="mt-1 text-sm text-[#77766c]">Try another topic, or start one of your own.</p><button onClick={() => startEditing()} className="mt-4 font-bold text-[#276e67] underline underline-offset-4">Make a quiz</button></div>}
            <div className="mt-9 flex flex-col items-start justify-between gap-4 rounded-[20px] border border-[#e6dbc8] bg-[#fffdf7] p-5 sm:flex-row sm:items-center sm:px-7">
              <div className="flex items-start gap-3"><span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f4c95d]/40 text-[#80631c]"><PenLine size={18} /></span><div><h3 className="display text-xl font-semibold">Got a question you love?</h3><p className="mt-1 text-sm text-[#77766c]">Make a tiny quiz and pass it around your table.</p></div></div>
              <button onClick={() => startEditing()} className="inline-flex items-center gap-2 rounded-full border border-[#276e67] px-4 py-2.5 text-sm font-bold text-[#276e67] transition hover:bg-[#e7f2ed]">Start writing <ArrowRight size={16} /></button>
            </div>
          </section>
        )}

        {page === "play" && (
          <section className="slide-in mx-auto max-w-[850px] pt-8 sm:pt-12">
            <button onClick={() => setPage("browse")} className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#77766c] hover:text-[#2f3029]"><ArrowLeft size={16} /> Back to the shelf</button>
            <div className="grid gap-6 md:grid-cols-[1fr_240px]">
              <div className="rounded-[25px] border border-[#e8ddca] bg-[#fffdf7] p-5 shadow-[0_12px_35px_#5442250d] sm:p-9">
                {!showResult ? <>
                  <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#e66c4d]">{activeQuiz.category} · {activeQuiz.author}</p><h1 className="display mt-2 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">{activeQuiz.title}</h1></div>
                    <button onClick={shuffleQuestions} className="inline-flex items-center gap-2 rounded-full border border-[#ded3c1] px-3 py-2 text-xs font-bold text-[#68675d] hover:bg-[#f6f0e4]"><Shuffle size={14} /> Shuffle</button>
                  </div>
                  <div className="mb-7 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eee5d6]"><div className="h-full rounded-full bg-[#e66c4d] transition-all" style={{ width: `${((questionIndex + 1) / playQuestions.length) * 100}%` }} /></div><span className="shrink-0 text-xs font-bold tabular-nums text-[#77766c]">{String(questionIndex + 1).padStart(2, "0")} <span className="font-normal">/ {String(playQuestions.length).padStart(2, "0")}</span></span></div>
                  <div key={questionIndex} className="slide-in">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#827d70]">Your question</p>
                    <h2 className="display mb-7 max-w-[620px] text-[28px] font-semibold leading-[1.16] sm:text-[36px]">{currentQuestion?.prompt || "This question is still being written."}</h2>
                    <fieldset className="space-y-3"><legend className="sr-only">Choose one answer</legend>{currentQuestion?.answers.map((answer, answerIndex) => <label key={`${questionIndex}-${answerIndex}`} className="block cursor-pointer">
                      <input className="option-radio sr-only" type="radio" name={`answer-${questionIndex}`} checked={selectedAnswer === answerIndex} onChange={() => setSelectedAnswer(answerIndex)} />
                      <span className="flex min-h-[56px] items-center gap-3 rounded-[14px] border border-[#e7ddcd] bg-[#fffaf1] px-4 py-3 transition hover:border-[#a9b9a9]"><span className="option-letter grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#efe8da] text-xs font-bold text-[#6c685d]">{letters[answerIndex]}</span><span className="text-sm font-semibold text-[#46463f]">{answer || "Answer option"}</span></span>
                    </label>)}</fieldset>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-[#eee5d6] pt-5">
                    <button onClick={() => moveQuestion(-1)} disabled={questionIndex === 0 || selectedAnswer === null} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[#77766c] transition hover:bg-[#f5efe3] disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={16} /> Previous</button>
                    {questionIndex === playQuestions.length - 1 ? <button onClick={finishQuiz} disabled={selectedAnswer === null} className="inline-flex items-center gap-2 rounded-full bg-[#276e67] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#174e49] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">See my score <Check size={16} /></button> : <button onClick={() => moveQuestion(1)} disabled={selectedAnswer === null} className="inline-flex items-center gap-2 rounded-full bg-[#276e67] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#174e49] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">Next question <ArrowRight size={16} /></button>}
                  </div>
                </> : <div className="py-5 text-center sm:py-12">
                  <div className="mx-auto grid h-16 w-16 rotate-[-7deg] place-items-center rounded-[21px] bg-[#f4c95d] text-[#55431a] shadow-[4px_4px_0_#deae3f]"><Check size={30} /></div>
                  <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#e66c4d]">That’s a wrap</p>
                  <h1 className="display mt-2 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{score === playQuestions.length ? "Every one. Lovely." : score >= Math.ceil(playQuestions.length / 2) ? "Nicely done." : "Good questions, right?"}</h1>
                  <p className="mt-3 text-[#77766c]">You got <span className="font-bold text-[#2f3029]">{score} out of {playQuestions.length}</span> right in <span className="font-bold text-[#2f3029]">{activeQuiz.title}</span>.</p>
                  <div className="mx-auto mt-8 max-w-[460px] space-y-2 text-left">{playQuestions.map((question, index) => <div key={`${question.prompt}-${index}`} className="flex items-start gap-3 rounded-xl bg-[#f8f3e9] p-3"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${answersGiven[index] === question.correct ? "bg-[#dcece1] text-[#276e67]" : "bg-[#f5dfd5] text-[#b5533d]"}`}><span className="text-xs font-bold">{answersGiven[index] === question.correct ? "✓" : "×"}</span></span><div><p className="text-sm font-semibold">{question.prompt}</p><p className="mt-1 text-xs text-[#77766c]">Answer: {question.answers[question.correct]}</p></div></div>)}</div>
                  <div className="mt-8 flex flex-wrap justify-center gap-3"><button onClick={() => startQuiz(activeQuiz)} className="inline-flex items-center gap-2 rounded-full bg-[#e66c4d] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#b84e37]"><RotateCcw size={16} /> Play again</button><button onClick={() => setPage("browse")} className="rounded-full border border-[#ded3c1] px-5 py-3 text-sm font-bold text-[#55554d] hover:bg-[#f5efe3]">Browse more</button></div>
                </div>}
              </div>
              <aside className="space-y-4">
                <div className="rounded-[19px] border border-[#e6dbc8] bg-[#f7e8ca] p-5"><div className="flex items-center gap-2 text-[#826528]"><Clock3 size={17} /><span className="text-xs font-bold uppercase tracking-[.13em]">A small pause</span></div><p className="display mt-3 text-[21px] font-semibold leading-tight">No timer. No pressure. Just pick what feels right.</p><div className="mt-4 h-[2px] w-12 bg-[#e66c4d]" /></div>
                <div className="rounded-[19px] border border-[#d7e3dc] bg-[#e7f1eb] p-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#276e67]">Little club note</p><p className="mt-2 text-sm leading-6 text-[#5d6c62]">A wrong answer is usually a new fact in disguise.</p></div>
              </aside>
            </div>
          </section>
        )}

        {page === "edit" && (
          <section className="slide-in mx-auto max-w-[900px] pt-8 sm:pt-12">
            <button onClick={() => setPage("browse")} className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#77766c] hover:text-[#2f3029]"><ArrowLeft size={16} /> Back to the shelf</button>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#e66c4d]">Your desk</p><h1 className="display mt-1 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Make a little quiz</h1><p className="mt-2 text-sm text-[#77766c]">Write the kind of questions you’d ask over lunch.</p></div>
              <button onClick={saveQuiz} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#276e67] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#174e49] transition hover:-translate-y-0.5"><Check size={16} /> Save quiz</button>
            </div>
            {notice && <p role="status" className="mb-4 rounded-xl border border-[#c8ded0] bg-[#e7f1eb] px-4 py-3 text-sm font-semibold text-[#276e67]">{notice}</p>}
            <div className="mb-5 rounded-[20px] border border-[#e5dac7] bg-[#fffdf7] p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-[1fr_190px]">
                <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#77766c]">Quiz title</span><input value={activeQuiz.title} onChange={(event) => setActiveQuiz({ ...activeQuiz, title: event.target.value })} placeholder="What’s your quiz about?" className="display w-full border-b-2 border-[#e4dac7] bg-transparent pb-2 text-2xl font-semibold outline-none placeholder:text-[#b3a994] focus:border-[#276e67]" /></label>
                <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#77766c]">Topic</span><span className="relative block"><select value={activeQuiz.category} onChange={(event) => setActiveQuiz({ ...activeQuiz, category: event.target.value })} className="w-full appearance-none rounded-xl border border-[#e4dac7] bg-[#fffaf1] px-3 py-3 pr-9 text-sm font-semibold"><option>Everyday</option><option>Curious minds</option><option>Wordplay</option><option>Outdoors</option><option>Just for fun</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 text-[#77766c]" size={16} /></span></label>
              </div>
              <label className="mt-5 block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#77766c]">A note about it</span><textarea value={activeQuiz.description} onChange={(event) => setActiveQuiz({ ...activeQuiz, description: event.target.value })} rows={2} placeholder="A one-line invitation to play…" className="w-full resize-y rounded-xl border border-[#e4dac7] bg-[#fffaf1] px-3 py-3 text-sm leading-6 placeholder:text-[#aaa18f]" /></label>
            </div>
            <div className="mb-4 flex items-center justify-between"><h2 className="display text-2xl font-semibold">Your questions <span className="ml-1 text-base font-medium text-[#9a907e]">({activeQuiz.questions.length})</span></h2><span className="hidden items-center gap-1.5 text-xs font-semibold text-[#807b6d] sm:flex"><Lightbulb size={14} /> One right answer per question</span></div>
            <div className="space-y-4">
              {activeQuiz.questions.map((question, questionIndexForEdit) => <article key={`edit-${questionIndexForEdit}`} className="rounded-[20px] border border-[#e5dac7] bg-[#fffdf7] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="display grid h-9 w-9 rotate-[-4deg] place-items-center rounded-xl bg-[#f4c95d] text-sm font-bold text-[#51421e]">{String(questionIndexForEdit + 1).padStart(2, "0")}</span><span className="text-xs font-bold uppercase tracking-[.13em] text-[#817a6c]">Question</span></div>{activeQuiz.questions.length > 1 && <button onClick={() => setActiveQuiz({ ...activeQuiz, questions: activeQuiz.questions.filter((_, index) => index !== questionIndexForEdit) })} aria-label={`Remove question ${questionIndexForEdit + 1}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#9b5c4e] hover:bg-[#f8e7df]"><Trash2 size={14} /> Remove</button>}</div>
                <textarea value={question.prompt} onChange={(event) => updateQuestion(questionIndexForEdit, { prompt: event.target.value })} rows={2} placeholder="Write the question…" aria-label={`Question ${questionIndexForEdit + 1} text`} className="display mb-5 w-full resize-y rounded-xl border border-[#e4dac7] bg-[#fffaf1] px-4 py-3 text-xl font-semibold leading-snug placeholder:text-[#b3a994]" />
                <div className="grid gap-3 sm:grid-cols-2">{question.answers.map((answer, answerIndex) => <div key={`answer-${questionIndexForEdit}-${answerIndex}`} className={`flex items-center gap-2 rounded-xl border p-2 ${question.correct === answerIndex ? "border-[#a6c5b0] bg-[#edf5ee]" : "border-[#e9dfd0] bg-[#fffaf1]"}`}>
                  <button type="button" onClick={() => updateQuestion(questionIndexForEdit, { correct: answerIndex })} aria-label={`Mark answer ${letters[answerIndex]} as correct`} aria-pressed={question.correct === answerIndex} className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${question.correct === answerIndex ? "bg-[#276e67] text-white" : "bg-[#efe8da] text-[#77766c] hover:bg-[#e1d8c7]"}`}>{question.correct === answerIndex ? <Check size={14} /> : letters[answerIndex]}</button>
                  <input value={answer} onChange={(event) => updateAnswer(questionIndexForEdit, answerIndex, event.target.value)} aria-label={`Question ${questionIndexForEdit + 1}, answer ${letters[answerIndex]}`} placeholder={`Answer ${letters[answerIndex]}`} className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-[#aaa18f]" />
                </div>)}</div>
                <p className="mt-3 text-[11px] font-semibold text-[#8a8476]">Tap the letter to mark the correct answer.</p>
              </article>)}
            </div>
            <button onClick={() => setActiveQuiz({ ...activeQuiz, questions: [...activeQuiz.questions, { prompt: "", answers: ["", "", "", ""], correct: 0 }] })} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[17px] border-2 border-dashed border-[#d8cdb9] bg-[#fffaf1] px-4 py-4 text-sm font-bold text-[#276e67] transition hover:border-[#276e67] hover:bg-[#f4f5eb]"><ListPlus size={17} /> Add a question</button>
            <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 rounded-[18px] bg-[#f3ead8] px-5 py-4 sm:flex-row"><p className="text-sm text-[#77766c]"><span className="font-bold text-[#2f3029]">{activeQuiz.questions.length} questions</span> in your quiz · edits stay right here</p><button onClick={saveQuiz} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e66c4d] px-5 py-3 text-sm font-bold text-white shadow-[0_3px_0_#b84e37] transition hover:-translate-y-0.5 sm:w-auto"><Check size={16} /> Save to my shelf</button></div>
          </section>
        )}
      </main>
      <footer className="border-t border-[#e9dfcc] bg-[#f7f0e2]">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-2 px-5 py-5 text-xs text-[#858071] sm:flex-row sm:items-center sm:px-8"><span className="display text-base font-semibold text-[#59564d]">A little curiosity goes a long way.</span><span>Made for the quiz club · Lystte</span></div>
      </footer>
    </div>
  );
}
