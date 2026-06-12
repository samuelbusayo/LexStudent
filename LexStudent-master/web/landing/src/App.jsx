import { useEffect, useState } from 'react'

const FEATURES = [
  {
    icon: 'auto_stories',
    title: 'Smart reading',
    body: 'Open your study material in a distraction-free reader with built-in keyword search, highlights and inline notes that sync everywhere.',
  },
  {
    icon: 'smart_toy',
    title: 'AI study tutor',
    body: 'Ask anything about what you just read. The AI cites the page it came from and stays grounded in your own materials.',
  },
  {
    icon: 'quiz',
    title: 'Bar Part II quiz bank',
    body: '348+ past-question style items across 14 topics with timed sessions, instant explanations and a knowledge-gap tracker.',
  },
  {
    icon: 'edit_note',
    title: 'Personal summaries',
    body: 'Build your own digest of every topic. Highlight a passage and it becomes a citable chip in your summary, automatically.',
  },
  {
    icon: 'event',
    title: 'Reading planner',
    body: 'Set daily goals tied to specific topics and pages. Watch the progress bar move as you read — no manual logging.',
  },
  {
    icon: 'local_fire_department',
    title: 'Streaks & milestones',
    body: 'Stay consistent with daily streaks, weekly targets and milestone countdowns to your Bar exams.',
  },
]

const STATS = [
  { value: '348+', label: 'Past-question style items' },
  { value: '14', label: 'Bar Part II topics covered' },
  { value: '6', label: 'Law School campuses' },
  { value: '3', label: 'Platforms — web, desktop, mobile' },
]

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
        <span className="font-serif text-gold text-lg leading-none font-bold">L</span>
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold" />
      </div>
      <span className="font-serif text-xl font-semibold text-navy tracking-tight">LexStudent</span>
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${
      scrolled ? 'bg-sand/85 backdrop-blur-xl border-b border-line/60' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-smoke/80">
          <a href="#features" className="hover:text-navy transition-colors">Features</a>
          <a href="#how" className="hover:text-navy transition-colors">How it works</a>
          <a href="#platforms" className="hover:text-navy transition-colors">Platforms</a>
          <a href="#download" className="hover:text-navy transition-colors">Download</a>
        </nav>
        <a
          href="#download"
          className="inline-flex items-center gap-1.5 bg-navy text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-ink transition-colors"
        >
          Get the app
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden noise">
      {/* Background ornaments */}
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute top-40 -left-20 w-96 h-96 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-navy/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-xs font-semibold text-navy mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Built for the Nigerian Law School · Bar Part II
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tightest text-navy text-balance animate-fade-up">
            Pass Bar Part II,<br />
            <span className="italic text-navy/70">on your terms.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-smoke/70 max-w-2xl leading-relaxed text-pretty animate-fade-up" style={{ animationDelay: '0.1s' }}>
            LexStudent is the study companion built for Bar Part II students at all six Law School campuses.
            Read smarter, revise sharper, and walk into Lagos, Yola, Enugu, Kano, Port Harcourt or Abuja with confidence.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="#download"
              className="group inline-flex items-center gap-2 bg-navy text-white px-6 py-3.5 rounded-full font-semibold text-base hover:bg-ink transition-all"
            >
              Download LexStudent
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-white border border-line text-navy px-6 py-3.5 rounded-full font-semibold text-base hover:bg-cream transition-all"
            >
              See features
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8 text-xs uppercase tracking-widest text-smoke/40 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <span>For Bar Part II students</span>
            <span className="hidden md:inline">·</span>
            <span>Web · Desktop · Mobile</span>
            <span className="hidden md:inline">·</span>
            <span>Offline-friendly</span>
          </div>
        </div>

        {/* Showcase tile */}
        <div className="mt-24 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <HeroMockup />
        </div>
      </div>
    </section>
  )
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="relative rounded-3xl border border-line bg-white shadow-2xl shadow-navy/10 overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-cream/40">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-xs text-smoke/50 font-mono">lexstudent · WK 5: Duties of Counsel to Client</span>
        </div>

        <div className="grid grid-cols-12 gap-0 h-[480px]">
          {/* Sidebar */}
          <aside className="col-span-3 border-r border-line bg-cream/30 p-4">
            <Logo className="mb-6" />
            {['Dashboard', 'Courses', 'Planner', 'Revision', 'AI Tutor', 'Profile'].map((it, i) => (
              <div key={it} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm ${i === 2 ? 'bg-navy text-white' : 'text-smoke/70'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                {it}
              </div>
            ))}
          </aside>

          {/* Reader */}
          <main className="col-span-6 p-8 overflow-hidden">
            <div className="text-xs font-bold tracking-widest text-gold mb-2">PROFESSIONAL ETHICS</div>
            <h3 className="font-serif text-2xl text-navy mb-4 leading-tight">WK 5: Duties of Counsel to Client</h3>
            <div className="space-y-3 text-sm text-smoke/75 leading-relaxed">
              <p>A legal practitioner owes their client undivided loyalty, confidentiality and competent representation. The fiduciary nature of the relationship demands…</p>
              <p>
                <mark className="bg-gold/40 text-navy px-1 rounded">The Rules of Professional Conduct (RPC) Rule 14</mark> require counsel to devote attention, energy and learning to a client's case…
              </p>
              <p>Failure to maintain this standard may expose the practitioner to disciplinary proceedings before the LPDC.</p>
            </div>
            <div className="absolute bottom-6 left-[28%] flex items-center gap-2 bg-white border border-line rounded-full px-3 py-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-gold">bookmark</span>
              <span className="text-xs text-smoke/70">Page 12 of 24 · Saved</span>
            </div>
          </main>

          {/* AI chat panel */}
          <aside className="col-span-3 border-l border-line bg-navy/[0.02] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest text-navy">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              AI TUTOR
            </div>
            <div className="space-y-2 flex-1 overflow-hidden">
              <div className="bg-navy text-white text-xs p-2.5 rounded-lg rounded-br-sm ml-6">
                What is the difference between RPC Rule 14 and 15?
              </div>
              <div className="bg-white border border-line text-xs p-2.5 rounded-lg rounded-bl-sm">
                Rule 14 deals with <b>dedication & devotion</b> to a client's cause, while Rule 15 covers <b>representation within bounds of law</b>… <span className="text-gold">[page 8]</span>
              </div>
              <div className="bg-white border border-line text-xs p-2.5 rounded-lg rounded-bl-sm text-smoke/50 italic">
                Drafting answer…
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 bg-white border border-line rounded-full px-3 py-2 text-xs text-smoke/50">
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Ask anything…
            </div>
          </aside>
        </div>
      </div>

      {/* Floating accent card */}
      <div className="hidden lg:block absolute -bottom-8 -right-4 bg-white border border-line rounded-2xl p-4 shadow-xl shadow-navy/10 animate-float">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-navy">local_fire_department</span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-smoke/50 font-bold">Streak</div>
            <div className="font-serif text-xl text-navy">12 days</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stats() {
  return (
    <section className="border-y border-line bg-cream/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-y-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="font-serif text-4xl md:text-5xl text-navy">{s.value}</div>
            <div className="mt-2 text-xs uppercase tracking-widest text-smoke/50 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Built for the Bar exam</div>
          <h2 className="font-serif text-4xl md:text-6xl text-navy tracking-tightest leading-[1.05] text-balance">
            Everything you need to walk into the exam hall ready.
          </h2>
          <p className="mt-6 text-lg text-smoke/70 text-pretty">
            One workspace for reading, revision, practice and progress — designed around the Bar Part II curriculum and the way Nigerian Law School students actually study.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group relative p-7 rounded-2xl border border-line bg-white hover:border-navy/40 transition-all ${
                i === 0 ? 'lg:row-span-2 lg:bg-navy lg:text-white lg:border-navy' : ''
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                i === 0 ? 'lg:bg-gold lg:text-navy bg-navy/5 text-navy' : 'bg-navy/5 text-navy'
              }`}>
                <span className="material-symbols-outlined text-[22px]">{f.icon}</span>
              </div>
              <h3 className={`font-serif text-2xl mb-2 ${i === 0 ? 'lg:text-white text-navy' : 'text-navy'}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${
                i === 0 ? 'lg:text-white/70 text-smoke/70' : 'text-smoke/70'
              }`}>
                {f.body}
              </p>
              {i === 0 && (
                <div className="hidden lg:block mt-8">
                  <div className="border-t border-white/10 pt-6">
                    <div className="text-xs uppercase tracking-widest text-gold mb-3 font-semibold">Reader preview</div>
                    <div className="rounded-xl bg-white/5 p-4 text-sm text-white/80 leading-relaxed border border-white/10">
                      The role of counsel <mark className="bg-gold/30 text-gold px-1 rounded">includes the protection of the client's interest</mark> within the limits of the law…
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Add your materials', body: 'Drop in your Bar Part II PDFs, DOCX or PPTX. Each topic gets its own indexed library.' },
    { num: '02', title: 'Read with intent', body: 'Highlight key passages and they become citable chips in your personal summary, automatically.' },
    { num: '03', title: 'Ask the AI tutor', body: 'Get answers grounded in your own materials, with page citations you can jump to.' },
    { num: '04', title: 'Quiz, revise, repeat', body: 'Take past-question style quizzes and the app surfaces your weakest topics for revision.' },
  ]
  return (
    <section id="how" className="py-24 lg:py-32 bg-navy text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-gold mb-4">How it works</div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tightest leading-[1.05] text-balance">
            Four steps from textbook to exam-ready.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="relative">
              <div className="font-serif text-6xl text-gold/30 mb-2">{s.num}</div>
              <div className="border-t-2 border-gold w-12 mb-5" />
              <h3 className="font-serif text-2xl mb-3 text-white">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Platforms() {
  return (
    <section id="platforms" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Anywhere you study</div>
            <h2 className="font-serif text-4xl md:text-6xl text-navy tracking-tightest leading-[1.05] text-balance">
              Web. Desktop. Mobile.<br />
              <span className="italic text-navy/60">All in sync.</span>
            </h2>
            <p className="mt-6 text-lg text-smoke/70 leading-relaxed text-pretty">
              Start a reading session on your laptop at the library, continue on your phone during the commute,
              and review on the desktop app when you're back home. Everything stays connected.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                { icon: 'laptop_mac', title: 'Desktop (Windows · macOS · Linux)', body: 'Native Tauri build with offline reading and live lecture recording.' },
                { icon: 'smartphone', title: 'Mobile (Android)', body: 'Capacitor app with offline SQLite — read and quiz without data.' },
                { icon: 'public', title: 'Web', body: 'Open in any browser, no install required.' },
              ].map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-navy">{p.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-navy">{p.title}</div>
                    <div className="text-sm text-smoke/60 mt-0.5">{p.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] aspect-[9/19] rounded-[44px] bg-navy p-2 shadow-2xl shadow-navy/30">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-navy rounded-full z-10" />
      <div className="w-full h-full rounded-[36px] bg-cream overflow-hidden relative">
        <div className="p-5 pt-10">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-navy">menu</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-widest text-smoke/40 font-bold mb-1">Today</div>
            <div className="font-serif text-2xl text-navy leading-tight">Reading Goal</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-line mb-3">
            <div className="text-xs uppercase tracking-widest text-gold font-bold mb-1">Professional Ethics</div>
            <div className="text-sm font-semibold text-navy mb-3">WK 5: Duties of Counsel</div>
            <div className="h-1.5 bg-line rounded-full overflow-hidden">
              <div className="h-full w-3/5 bg-gold rounded-full" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-smoke/50">
              <span>Page 12 of 20</span>
              <span className="text-gold font-semibold">60%</span>
            </div>
          </div>
          <div className="bg-navy rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-gold text-[20px]">local_fire_department</span>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Streak</span>
            </div>
            <div className="font-serif text-3xl mb-1">12 days</div>
            <div className="text-xs text-white/60">Keep it going — quiz at 6pm</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Download() {
  return (
    <section id="download" className="py-24 lg:py-32 bg-cream/50 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-navy/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Download LexStudent</div>
        <h2 className="font-serif text-4xl md:text-6xl text-navy tracking-tightest leading-[1.05] text-balance">
          Ready to read smarter?
        </h2>
        <p className="mt-6 text-lg text-smoke/70 max-w-2xl mx-auto text-pretty">
          Pick the version that fits how you study. Sign in once and your progress follows you everywhere.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <DownloadButton
            primary
            icon="laptop_mac"
            title="Download for Desktop"
            subtitle="Windows · macOS · Linux"
          />
          <DownloadButton
            icon="smartphone"
            title="Download for Mobile"
            subtitle="Android · iOS coming soon"
          />
        </div>

        <div className="mt-6 text-xs text-smoke/50">
          Or use it instantly in your browser — <a href="#" className="text-navy font-semibold hover:underline">launch the web app</a>
        </div>

        <div className="mt-16 grid grid-cols-3 max-w-md mx-auto gap-6 text-center">
          {[
            { label: 'Free to try', icon: 'check_circle' },
            { label: 'Offline-friendly', icon: 'cloud_off' },
            { label: 'No ads', icon: 'block' },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-gold">{b.icon}</span>
              <span className="text-xs text-smoke/60 font-semibold uppercase tracking-widest">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DownloadButton({ icon, title, subtitle, primary }) {
  return (
    <button
      type="button"
      className={`group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
        primary
          ? 'bg-navy text-white hover:bg-ink ring-gold-glow'
          : 'bg-white text-navy border border-line hover:border-navy/30'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        primary ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'
      }`}>
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
      <div className="text-left">
        <div className={`text-xs uppercase tracking-widest font-bold ${primary ? 'text-gold' : 'text-smoke/50'}`}>
          {subtitle}
        </div>
        <div className="text-base font-semibold">{title}</div>
      </div>
      <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 ${primary ? 'text-white' : 'text-navy/50'}`}>
        arrow_forward
      </span>
    </button>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-smoke/60 max-w-sm">
              A modern study companion built for Nigerian Law School Bar Part II students.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-navy font-bold mb-3">Product</div>
            <ul className="space-y-2 text-sm text-smoke/60">
              <li><a href="#features" className="hover:text-navy">Features</a></li>
              <li><a href="#platforms" className="hover:text-navy">Platforms</a></li>
              <li><a href="#download" className="hover:text-navy">Download</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-navy font-bold mb-3">Campuses</div>
            <ul className="space-y-2 text-sm text-smoke/60">
              <li>Lagos · Yola · Enugu</li>
              <li>Kano · Port Harcourt · Abuja</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs text-smoke/50">
          <span>© {new Date().getFullYear()} LexStudent · For Bar Part II students.</span>
          <span>Made for the Nigerian Law School.</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen text-smoke">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Platforms />
      <Download />
      <Footer />
    </div>
  )
}
