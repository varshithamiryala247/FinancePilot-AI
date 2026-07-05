import React from 'react';

export default function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col w-full overflow-y-auto">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-sm border-b border-outline-variant flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="font-display text-lg font-extrabold text-primary tracking-tight">FinancePilot AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold"
          >
            Log In
          </button>
          <button 
            onClick={onGetStarted}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-grow flex flex-col mt-16">
        
        {/* Hero Section */}
        <section className="w-full px-4 pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center justify-center text-center max-w-container-max-width mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant text-[11px] font-bold mb-6 border border-primary-fixed">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            FinancePilot AI 2.0 is live
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-primary font-extrabold mb-6 max-w-4xl tracking-tight leading-tight">
            Your Calm, Capable CFO
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop drowning in spreadsheets. Let intelligent AI structure your financial data, reconcile transactions instantly, and deliver actionable insights so you can focus on growing your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0 justify-center">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white border border-outline-variant text-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              Explore Dashboard
            </button>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="w-full py-10 border-y border-outline-variant bg-surface-container-low">
          <div className="max-w-container-max-width mx-auto px-4 text-center">
            <p className="text-[10px] font-bold text-on-surface-variant mb-6 uppercase tracking-widest">Trusted by forward-thinking teams</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale text-sm">
              <div className="flex items-center gap-2 font-bold text-primary"><span className="material-symbols-outlined text-xl">ac_unit</span> Acme Corp</div>
              <div className="flex items-center gap-2 font-bold text-primary"><span className="material-symbols-outlined text-xl">architecture</span> BuildCo</div>
              <div className="flex items-center gap-2 font-bold text-primary"><span className="material-symbols-outlined text-xl">spa</span> Zenith Agency</div>
              <div className="flex items-center gap-2 font-bold text-primary hidden md:flex"><span className="material-symbols-outlined text-xl">electric_bolt</span> Bolt Media</div>
              <div className="flex items-center gap-2 font-bold text-primary hidden lg:flex"><span className="material-symbols-outlined text-xl">eco</span> GreenTech</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 px-6 max-w-container-max-width mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold font-display text-primary mb-4">Everything you need to scale</h2>
            <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">Powerful features designed to automate your financial operations and give you peace of mind.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[10px] border border-outline-variant ambient-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary-fixed/50 flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <h3 className="text-md font-bold text-primary mb-3">AI-Powered Insights</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Chat naturally with your financial data. Ask questions about burn rate, runway, or expense categorization and get instant, accurate answers.</p>
            </div>
            <div className="bg-white p-8 rounded-[10px] border border-outline-variant ambient-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-lg bg-secondary-container/50 flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined">sync</span>
              </div>
              <h3 className="text-md font-bold text-primary mb-3">Real-time Reconciliation</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Connect your bank feeds securely. Our engine automatically matches transactions and flags anomalies before they become problems.</p>
            </div>
            <div className="bg-white p-8 rounded-[10px] border border-outline-variant ambient-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/50 flex items-center justify-center mb-6 text-tertiary">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <h3 className="text-md font-bold text-primary mb-3">Bank-grade Security</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Your financial data is encrypted at rest and in transit. We use read-only access to your accounts to ensure your money is never at risk.</p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-20 bg-surface-container-low px-6 border-t border-outline-variant">
          <div className="max-w-container-max-width mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold font-display text-primary mb-4">How it works</h2>
              <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">Get up and running in minutes, not weeks. It's as simple as connecting your accounts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t border-dashed border-outline-variant/60"></div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-2xl bg-white border border-outline-variant shadow-sm flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold mb-4 absolute -top-3 -right-3 md:right-auto md:left-1/2 md:-ml-4 border-4 border-surface-container-low">1</div>
                <h3 className="text-sm font-bold text-primary mb-3">Upload Data</h3>
                <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">Securely connect your bank feeds or drag-and-drop CSV files containing your historical transactions.</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-2xl bg-white border border-outline-variant shadow-sm flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-4xl">account_balance_wallet</span>
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold mb-4 absolute -top-3 -right-3 md:right-auto md:left-1/2 md:-ml-4 border-4 border-surface-container-low">2</div>
                <h3 className="text-sm font-bold text-primary mb-3">AI Reconciles</h3>
                <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">Our intelligent engine categorizes expenses, matches invoices to payments, and creates structured ledgers instantly.</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-2xl bg-white border border-outline-variant shadow-sm flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary text-4xl">chat</span>
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold mb-4 absolute -top-3 -right-3 md:right-auto md:left-1/2 md:-ml-4 border-4 border-surface-container-low">3</div>
                <h3 className="text-sm font-bold text-primary mb-3">Ask Questions</h3>
                <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">Chat with your financial data to uncover insights, generate P&L reports, and plan cash flow ahead.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full py-20 bg-primary text-on-primary px-6">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-primary-fixed/50 mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <blockquote className="font-display text-xl md:text-3xl leading-relaxed mb-10 text-on-primary">
              "FinancePilot AI completely replaced our need for a bookkeeper. It took 10 minutes to set up, and now I have a perfectly reconciled ledger ready on the 1st of every month. It feels like having an elite CFO in my pocket."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center border border-slate-700/60">
                <span className="material-symbols-outlined text-secondary">person</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-xs text-on-primary">Sarah Jenkins</div>
                <div className="text-[10px] text-on-primary opacity-60">Founder, Zenith Creative Agency</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-20 px-6 text-center max-w-container-max-width mx-auto">
          <h2 className="text-3xl font-extrabold font-display text-primary mb-6">Ready to regain control of your finances?</h2>
          <p className="text-xs text-on-surface-variant mb-10 max-w-xl mx-auto">Join thousands of founders who have automated their financial back-office with FinancePilot AI.</p>
          <button 
            onClick={onGetStarted}
            className="h-14 px-10 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg mx-auto"
          >
            Start Your Free Trial
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-high py-12 px-6 border-t border-outline-variant mt-auto">
        <div className="max-w-container-max-width mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <span className="font-display text-sm font-bold text-primary tracking-tight">FinancePilot AI</span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">Your calm, capable CFO. Structuring financial data for intelligent analysis.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-primary mb-4 uppercase tracking-wider">Product</h4>
            <ul className="flex flex-col gap-3 text-[11px] text-on-surface-variant font-semibold">
              <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Integrations</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-primary mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col gap-3 text-[11px] text-on-surface-variant font-semibold">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-primary mb-4 uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col gap-3 text-[11px] text-on-surface-variant font-semibold">
              <li><a className="hover:text-primary transition-colors" href="#">About</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max-width mx-auto pt-8 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-on-surface-variant">
          <p>© 2024 FinancePilot AI. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono font-bold">
            <span>AUDIT PROVEN</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
