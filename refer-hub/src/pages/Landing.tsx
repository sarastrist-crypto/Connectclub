import { Link } from 'react-router-dom';
import BrandMark from '@/components/BrandMark';

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Register once',
    body: 'Enter your email — no password. You get a personal referral link immediately.',
  },
  {
    num: '02',
    title: 'Nominate businesses you know',
    body: 'Fill in the form: the business, the owner, how you know them, and why Cobbled Works would help.',
  },
  {
    num: '03',
    title: 'We do the selling',
    body: 'Our sales team reaches out, runs a demo, and works the deal. You don't have to lift a finger.',
  },
  {
    num: '04',
    title: 'Earn — for life',
    body: '10% of their setup fee the day they connect. Then 10% of their monthly subscription, every month, forever.',
  },
];

const WHAT_WE_BUILD = [
  { icon: '🌊', label: 'Proof-of-service apps', note: 'GPS-locked field verification for crews' },
  { icon: '🌐', label: 'Branded websites',      note: 'Fast, beautiful, SEO-ready local pages' },
  { icon: '📊', label: 'AI lead studios',       note: 'Automated follow-up + audit pipelines' },
  { icon: '⚙️', label: 'Daily-ops dashboards', note: 'Command centers for solo operators' },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-ocean/90 backdrop-blur-md border-b border-azure/20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-azure">
            <BrandMark size={24} />
            <span className="font-mono text-xs tracking-widest text-steel uppercase">ConnectClub</span>
          </div>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">
            Join the network →
          </Link>
        </div>
      </header>
      <div className="grad-bar w-full" />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center relative z-10">
        <p className="font-mono text-xs tracking-widest text-azure uppercase mb-4">
          Cobbled Works — ConnectClub
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-bold text-sky leading-tight mb-6">
          Your network.<br /><em>Your money.</em>
        </h1>
        <p className="text-steel text-lg max-w-xl mx-auto leading-relaxed mb-10">
          You know small-business owners who could use better software. Nominate them.
          When they become clients, you earn{' '}
          <span className="text-sun font-semibold">10% of their setup fee</span> plus{' '}
          <span className="text-azure font-semibold">10% of their monthly subscription</span> — for as long
          as they stay clients.
        </p>

        {/* Commission callout */}
        <div className="inline-flex flex-col sm:flex-row gap-4 bg-ocean-mid border border-azure/20 rounded-2xl p-6 mb-10 text-left">
          <div className="text-center px-6">
            <p className="font-mono text-xs text-steel uppercase tracking-widest">Setup fee</p>
            <p className="font-display text-3xl font-bold text-money mt-1">$997</p>
            <p className="text-azure font-semibold mt-1">→ <em>$99.70</em> to you</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-azure/20 pt-4 sm:pt-0 sm:pl-6 text-center px-6">
            <p className="font-mono text-xs text-steel uppercase tracking-widest">Monthly fee</p>
            <p className="font-display text-3xl font-bold text-azure mt-1">$99/mo</p>
            <p className="text-azure font-semibold mt-1">→ <em>$9.90/mo</em> ongoing</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-azure/20 pt-4 sm:pt-0 sm:pl-6 text-center px-6">
            <p className="font-mono text-xs text-steel uppercase tracking-widest">After 12 months</p>
            <p className="font-display text-3xl font-bold text-sun mt-1">$218+</p>
            <p className="text-steel text-sm mt-1">from one introduction</p>
          </div>
        </div>

        <Link to="/register" className="btn-primary text-base py-3.5 px-8 inline-block">
          Start referring — it's free
        </Link>
        <p className="text-steel text-xs mt-3">No password. No obligation. No cap on earnings.</p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grad-bar w-16 mb-6" />
        <h2 className="font-display text-3xl font-bold text-sky mb-10">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.num} className="tile reveal">
              <p className="font-mono text-azure text-sm mb-3">{step.num}</p>
              <h3 className="font-display font-bold text-sky mb-2">{step.title}</h3>
              <p className="text-steel text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we build */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grad-bar w-16 mb-6" />
        <h2 className="font-display text-3xl font-bold text-sky mb-3">
          What Cobbled Works builds
        </h2>
        <p className="text-steel mb-10 max-w-lg">
          We make software for small field-service businesses. If you know an owner who
          struggles with any of these, they're a perfect nomination.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {WHAT_WE_BUILD.map((item) => (
            <div key={item.label} className="tile flex items-start gap-4 reveal">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-sky">{item.label}</p>
                <p className="text-steel text-sm mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-4xl font-bold text-sky mb-4">
          Ready to turn your rolodex<br />into <em>recurring income</em>?
        </h2>
        <p className="text-steel mb-8 max-w-md mx-auto">
          Join in 60 seconds. Your first nomination takes 2 minutes.
        </p>
        <Link to="/register" className="btn-primary text-base py-3.5 px-10 inline-block">
          Join ConnectClub →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-azure/10 py-8 text-center text-steel text-xs font-mono">
        <div className="flex items-center justify-center gap-2 mb-2 text-azure">
          <BrandMark size={16} />
          <span>Cobbled Works</span>
        </div>
        cobbledworks.com — ConnectClub Referral Network
      </footer>
    </div>
  );
}
