import React from 'react';

export default function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col w-full overflow-y-auto">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-sm border-b border-outline-variant flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="font-display-serif text-lg font-bold text-primary tracking-tight">FinancePilot AI</span>
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
            className="h-9 px-5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-900 transition-all shadow-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-grow flex flex-col mt-16">
        
        {/* Hero Section */}
        <section className="w-full px-6 py-16 md:py-24 max-w-container-max-width mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 flex flex-col text-left items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#86f2e4]/20 text-[#006f66] text-[10px] font-bold uppercase tracking-wider mb-6 border border-[#86f2e4]/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                FinancePilot AI 2.0
              </div>
              <h1 className="font-display-serif text-5xl md:text-7xl font-bold text-primary tracking-tight leading-[1.08] mb-6">
                Your <span className="italic font-normal">Calm,</span><br />
                Capable CFO
              </h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                Stop drowning in spreadsheets. Let intelligent AI structure your financial data, reconcile transactions instantly, and deliver actionable insights so you can focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-white border border-outline-variant text-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">play_circle</span>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Tablet Mockup Column */}
            <div className="lg:col-span-7">
              <div className="relative w-full rounded-2xl overflow-hidden border border-outline-variant/65 shadow-[0_20px_50px_rgba(9,20,38,0.08)] bg-white p-2">
                <div className="rounded-xl overflow-hidden bg-background">
                  <img 
                    src="https://i.postimg.cc/KvyMCPGw/screen.jpg" 
                    alt="FinancePilot Dashboard Mockup Preview" 
                    className="w-full h-auto object-cover" 
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Trusted By Section */}
        <section className="w-full py-10 border-y border-outline-variant bg-surface-container-low/40 px-6">
          <div className="max-w-container-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <p className="font-display-serif text-lg md:text-xl text-primary font-medium leading-tight">
                Trusted by forward-thinking teams to manage <span className="italic">their financial reality.</span>
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center justify-start lg:justify-between gap-6 md:gap-8 opacity-70 grayscale text-sm font-bold">
                <div className="flex items-center gap-1.5 text-primary"><span className="material-symbols-outlined text-lg">ac_unit</span> Acme Corp</div>
                <div className="flex items-center gap-1.5 text-primary"><span className="material-symbols-outlined text-lg">architecture</span> BuildCo</div>
                <div className="flex items-center gap-1.5 text-primary"><span className="material-symbols-outlined text-lg">spa</span> Zenith Agency</div>
                <div className="flex items-center gap-1.5 text-primary"><span className="material-symbols-outlined text-lg">electric_bolt</span> Bolt Media</div>
                <div className="flex items-center gap-1.5 text-primary"><span className="material-symbols-outlined text-lg">eco</span> GreenTech</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-28 px-6 max-w-container-max-width mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-display-serif text-3xl md:text-5xl text-primary font-bold mb-4">
              Everything you need to scale
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              An all-in-one financial ecosystem designed to automate operations, track every cent, and give you absolute peace of mind.
            </p>
          </div>

          <div className="space-y-24 md:space-y-36">
            
            {/* Feature 1: Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Visual drag/drop box */}
              <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-[0_8px_30px_rgba(9,20,38,0.02)] p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-b from-white to-background/20">
                <div className="w-16 h-16 rounded-full bg-secondary/5 flex items-center justify-center mb-4 text-secondary">
                  <span className="material-symbols-outlined text-3xl">upload_file</span>
                </div>
                <span className="text-xs font-bold text-primary mb-1">Drag & drop ledger files here</span>
                <span className="text-[10px] text-on-surface-variant/80 mb-6">Supports .csv, .xlsx, .pdf files</span>
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-background border border-outline-variant/40 rounded-lg text-[10px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-on-surface-variant text-[14px]">draft</span>
                      <span className="font-semibold text-primary truncate">bank_statement_june.csv</span>
                    </div>
                    <span className="font-mono text-secondary font-bold">100% matched</span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col text-left items-start">
                <span className="text-[10px] tracking-widest font-extrabold text-secondary uppercase mb-2">01 / UPLOAD</span>
                <h3 className="font-display-serif text-2xl md:text-4xl text-primary font-bold mb-4">
                  Upload & Connect <span className="italic font-normal">Seamlessly</span>
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Securely connect your bank feeds via enterprise-grade APIs or drag and drop CSV files containing your historical transactions. Our system instantly imports and structures the data for processing.
                </p>
                <ul className="space-y-3 mt-6 text-xs text-on-surface-variant font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    Plaid & Yodlee Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    Enterprise-grade Security
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Reconcile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Text */}
              <div className="flex flex-col text-left items-start order-2 lg:order-1">
                <span className="text-[10px] tracking-widest font-extrabold text-secondary uppercase mb-2">02 / RECONCILE</span>
                <h3 className="font-display-serif text-2xl md:text-4xl text-primary font-bold mb-4">
                  AI Reconciles <span className="italic font-normal">Instantly</span>
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Our intelligent engine categorizes expenses, matches invoices to payments, and structures ledgers instantly. It flags anomalies before they become problems, saving you hours of manual entry.
                </p>
                <ul className="space-y-3 mt-6 text-xs text-on-surface-variant font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    Automated Reconciliation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    Anomaly Detection
                  </li>
                </ul>
              </div>

              {/* Visual Matched block */}
              <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-[0_8px_30px_rgba(9,20,38,0.02)] p-6 space-y-4 order-1 lg:order-2">
                <div className="p-4 bg-background/50 border border-outline-variant/40 rounded-xl relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/80 font-mono">Invoice INV-0042</span>
                    <span className="px-2 py-0.5 bg-error-container/20 text-on-error-container text-[8px] font-bold rounded-full uppercase">Unreconciled</span>
                  </div>
                  <span className="text-xs font-bold text-primary block">Zenith Agency</span>
                  <span className="text-sm font-extrabold text-primary mt-1 block">$4,500.00</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                  <span className="text-[10px] font-bold tracking-wider uppercase">98% Confidence Match</span>
                </div>

                <div className="p-4 bg-secondary-container/10 border border-secondary-container/40 rounded-xl relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-secondary font-mono">Transaction TXN-8392</span>
                    <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[8px] font-bold rounded-full uppercase">Reconciled</span>
                  </div>
                  <span className="text-xs font-bold text-primary block">ZENITH AGCY INC</span>
                  <span className="text-sm font-extrabold text-secondary mt-1 block">+$4,500.00</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Analyze */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Visual Chat Screen */}
              <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-[0_8px_30px_rgba(9,20,38,0.02)] p-6 flex flex-col h-[280px]">
                <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/40 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-[10px] font-bold text-primary font-mono uppercase">FinancePilot AI Chat</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                  <div className="flex flex-col items-end">
                    <div className="p-2.5 bg-primary text-white rounded-xl rounded-br-none max-w-[85%] font-medium">
                      What is my current runway?
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="p-2.5 bg-background border border-outline-variant/60 rounded-xl rounded-bl-none max-w-[85%] text-on-surface leading-normal whitespace-pre-line">
                      Your current runway is **14.2 months** based on your cash balance of **$176,500.00** and an average monthly burn rate of **$12,430.00**.
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col text-left items-start">
                <span className="text-[10px] tracking-widest font-extrabold text-secondary uppercase mb-2">03 / ANALYZE</span>
                <h3 className="font-display-serif text-2xl md:text-4xl text-primary font-bold mb-4">
                  Ask Questions, <span className="italic font-normal">Get Insights</span>
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Chat with your financial data to get runway insights, generate dynamic P&L reports, and plan cash flow ahead. It's like having an elite financial analyst on call 24/7.
                </p>
                <ul className="space-y-3 mt-6 text-xs text-on-surface-variant font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    Natural Language Queries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    Dynamic Report Generation
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </section>

        {/* Why FinancePilot Section */}
        <section className="w-full bg-[#091426] py-24 text-on-primary px-6">
          <div className="max-w-container-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 flex flex-col justify-start items-start text-left">
              <h2 className="font-display-serif text-3xl md:text-5xl text-white font-bold mb-4">
                Why <span className="italic font-normal text-[#86f2e4]">FinancePilot?</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-sm">
                Built on a foundation of absolute trust. IPC 2043 compliant, 100% secure.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-8 text-left">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/10 border border-[#86f2e4]/20 flex items-center justify-center text-[#86f2e4] shrink-0">
                  <span className="material-symbols-outlined text-sm">link</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">Traceable Source Data</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Every metric in your dashboard is linked directly to the original invoice or bank transaction citation, allowing for instant, error-free auditing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/10 border border-[#86f2e4]/20 flex items-center justify-center text-[#86f2e4] shrink-0">
                  <span className="material-symbols-outlined text-sm">shield_lock</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">Uncompromising Security</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Your financial records are encrypted at rest and in transit. We maintain strictly read-only access and never store your raw credentials.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/10 border border-[#86f2e4]/20 flex items-center justify-center text-[#86f2e4] shrink-0">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">High-Fidelity Reporting</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Stop worrying about spreadsheet math errors. Our calculations are calculated deterministically on the server side using Python pandas.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full px-6 bg-surface">
          <blockquote className="font-display-serif text-2xl md:text-4xl text-primary font-bold italic leading-normal text-center max-w-4xl mx-auto pt-20 pb-8">
            "FinancePilot AI completely replaced our need for a part-time bookkeeper. It took 10 minutes to set up, and now I have a perfectly reconciled P&L ready on the 1st of every month."
          </blockquote>
          <div className="text-center pb-20">
            <div className="font-bold text-xs text-primary font-display-serif">Sarah Jenkins</div>
            <div className="text-[9px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">Founder, Zenith Creative Agency</div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-20 px-6 text-center max-w-container-max-width mx-auto border-t border-outline-variant bg-surface-container-low/20">
          <h2 className="font-display-serif text-3xl md:text-5xl text-primary font-bold mb-6">
            Ready to regain <span className="italic font-normal">control of your finances?</span>
          </h2>
          <p className="text-xs text-on-surface-variant mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of founders who have automated their financial back-office with FinancePilot AI.
          </p>
          <button 
            onClick={onGetStarted}
            className="h-14 px-10 rounded-full bg-primary hover:bg-slate-900 text-on-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg mx-auto"
          >
            Start Your Free Trial
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-high py-12 px-6 border-t border-outline-variant mt-auto">
        <div className="max-w-container-max-width mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <span className="font-display-serif text-sm font-bold text-primary tracking-tight">FinancePilot AI</span>
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
