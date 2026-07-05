import React from 'react';

export default function WelcomePage({ onExploreDemo, onUploadTab }) {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center p-6 relative">
      
      {/* Onboarding Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="font-display text-lg font-extrabold text-primary tracking-tight">FinancePilot AI</span>
        </div>
        <div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-md">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mt-16 flex flex-col items-center justify-center gap-8">
        
        {/* Onboarding Title */}
        <div className="text-center mb-4 space-y-2">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary">Welcome to FinancePilot AI</h1>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Your calm, capable CFO. Let's get your financial data structured and ready for intelligent analysis.
          </p>
        </div>

        {/* 3-Step Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-4">
          
          {/* Step 1 */}
          <div className="bg-white rounded-[10px] border border-outline-variant p-6 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-primary">
              <span className="material-symbols-outlined text-xl">cloud_upload</span>
            </div>
            <h3 className="font-bold text-sm text-primary mb-2">1. Upload Data</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">Securely connect your bank feeds or upload CSV files containing your transactions.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[10px] border border-outline-variant p-6 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-4 text-secondary">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <h3 className="font-bold text-sm text-primary mb-2">2. AI Reconciles</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">Our intelligent engine categorizes and matches transactions with unprecedented accuracy.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[10px] border border-outline-variant p-6 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mb-4 text-tertiary">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <h3 className="font-bold text-sm text-primary mb-2">3. Ask Questions</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">Chat with your financial data to uncover insights, generate reports, and plan ahead.</p>
          </div>

        </div>

        {/* Actions Button Panel */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onUploadTab}
            className="h-11 px-8 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-opacity-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            Get Started by Uploading Data
          </button>
          <button 
            onClick={onExploreDemo}
            className="h-11 px-8 rounded-full border border-primary text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary-fixed/30 transition-all"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            Explore with Demo Data
          </button>
        </div>

      </main>

    </div>
  );
}
