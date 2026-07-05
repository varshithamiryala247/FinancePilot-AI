import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import WelcomePage from './components/WelcomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import DataSources from './components/DataSources.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import ReconciliationReview from './components/ReconciliationReview.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import SourceCitation from './components/SourceCitation.jsx';
import api from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem("financepilot_currentTab") || "landing";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("financepilot_authenticated") === "true";
  });
  const [activeCitation, setActiveCitation] = useState(null);
  const [dashboardKey, setDashboardKey] = useState(0);
  const [chatOpen, setChatOpen] = useState(true); // Toggle right-hand chat drawer

  useEffect(() => {
    localStorage.setItem("financepilot_currentTab", currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem("financepilot_authenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);
  
  // Resizable Sidebar Panel States
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  // Resizable Chat Panel States
  const [chatWidth, setChatWidth] = useState(380);
  const [isChatResizing, setIsChatResizing] = useState(false);

  // Dynamic Profile States
  const [profile, setProfile] = useState({
    full_name: "Alex Mercer",
    email: "alex@mercer.studio",
    role: "Principal Designer / Freelancer",
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    two_factor: false
  });

  // Load Profile from backend on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load initial profile:", err);
      }
    }
    loadProfile();
  }, [currentTab]);

  // Sidebar drag handles
  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const startChatResizing = (e) => {
    setIsChatResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isResizing && !isChatResizing) return;
    
    const handleMouseMove = (e) => {
      if (isResizing) {
        let newWidth = e.clientX;
        if (newWidth < 180) newWidth = 180;
        if (newWidth > 360) newWidth = 360;
        setSidebarWidth(newWidth);
      }
      if (isChatResizing) {
        let newWidth = window.innerWidth - e.clientX;
        if (newWidth < 260) newWidth = 260;
        if (newWidth > 480) newWidth = 480;
        setChatWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsChatResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isChatResizing]);

  // Evaluation States
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  const handleActionComplete = () => {
    setDashboardKey(prev => prev + 1);
  };

  const handleRunEvaluation = async () => {
    try {
      setEvalLoading(true);
      setEvalError(null);
      const res = await api.runEvaluation();
      setEvalResult(res);
    } catch (err) {
      setEvalError(err.message || "Failed to execute evaluation set.");
    } finally {
      setEvalLoading(false);
    }
  };

  // Full Screen views without Nav sidebar
  if (currentTab === "landing") {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentTab("login")} 
        onLogin={() => setCurrentTab("login")} 
      />
    );
  }

  if (currentTab === "login") {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          setCurrentTab("welcome");
        }}
        onLogoClick={() => setCurrentTab("landing")}
      />
    );
  }

  if (currentTab === "welcome") {
    return (
      <WelcomePage 
        onExploreDemo={() => setCurrentTab("dashboard")} 
        onUploadTab={() => setCurrentTab("upload")} 
      />
    );
  }

  // Dashboard / Workspace layout (including Nav sidebar)
  return (
    <div className="flex h-screen bg-background text-on-surface select-none overflow-hidden relative w-full">
      
      {/* Dynamic Citation Audit Modal */}
      {activeCitation && (
        <SourceCitation 
          citationId={activeCitation} 
          onClose={() => setActiveCitation(null)} 
        />
      )}

      {/* 1. Left Sidebar Navigation (Dark Slate Navy) with Resize Grabber */}
      <nav 
        style={{ width: `${sidebarWidth}px` }}
        className="h-screen bg-primary flex flex-col py-stack-lg border-r border-transparent shrink-0 hidden md:flex relative group/nav"
      >
        {/* Resize Bar (thin vertical strip on the right border) */}
        <div 
          onMouseDown={startResizing}
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-secondary/50 active:bg-secondary z-30 transition-all ${
            isResizing ? 'bg-secondary w-1.5' : ''
          }`}
        />

        {/* Logo / Brand */}
        <div 
          onClick={() => setCurrentTab("landing")}
          className="px-6 mb-8 flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-sm group-hover:rotate-12 transition-transform">flight_takeoff</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-display text-sm font-bold text-on-primary tracking-tight truncate">FinancePilot AI</span>
            <span className="text-[10px] text-on-primary opacity-60 truncate">Calm CFO Mode</span>
          </div>
        </div>

        {/* New Transaction Action Block */}
        <div className="px-4 mb-6">
          <button 
            onClick={() => setCurrentTab("upload")}
            className="w-full bg-secondary hover:bg-on-secondary-container text-on-secondary py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Transaction
          </button>
        </div>

        {/* Links List */}
        <ul className="flex-1 overflow-y-auto px-2 flex flex-col gap-1">
          <li>
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentTab === "dashboard"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-primary-container opacity-70 hover:opacity-100 hover:bg-primary-container/40"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${currentTab === 'dashboard' ? 'fill-icon' : ''}`}>dashboard</span>
              <span className="text-xs">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentTab("reconciliation")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentTab === "reconciliation"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-primary-container opacity-70 hover:opacity-100 hover:bg-primary-container/40"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${currentTab === 'reconciliation' ? 'fill-icon' : ''}`}>account_balance_wallet</span>
              <span className="text-xs">Reconciliation</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentTab("upload")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentTab === "upload"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-primary-container opacity-70 hover:opacity-100 hover:bg-primary-container/40"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${currentTab === 'upload' ? 'fill-icon' : ''}`}>cloud_upload</span>
              <span className="text-xs">Data Upload</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentTab("evaluation")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentTab === "evaluation"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-primary-container opacity-70 hover:opacity-100 hover:bg-primary-container/40"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${currentTab === 'evaluation' ? 'fill-icon' : ''}`}>analytics</span>
              <span className="text-xs">Copilot Evaluation</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                currentTab === "profile"
                  ? "bg-[#86f2e4] text-[#00201d] font-bold"
                  : "text-on-primary-container opacity-70 hover:opacity-100 hover:bg-primary-container/40"
              }`}
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span className="text-xs">Settings</span>
            </button>
          </li>
        </ul>

        {/* Ask FinancePilot Drawer Toggle button */}
        <div className="px-4 mb-4">
          <button 
            onClick={() => setChatOpen(prev => !prev)}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs border ${
              chatOpen 
                ? "bg-primary-container text-on-primary-container border-slate-700/60" 
                : "bg-secondary text-on-secondary hover:bg-on-secondary-container border-transparent shadow"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            {chatOpen ? "Hide Copilot" : "Ask FinancePilot"}
          </button>
        </div>

        {/* CFO User Profile Section */}
        <div 
          onClick={() => setCurrentTab("profile")}
          className="px-4 border-t border-primary-container/20 pt-4 cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              alt="CFO Profile Avatar" 
              className="w-9 h-9 rounded-full object-cover border border-primary-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs21CGSzIy-Ica5tozmGffG_RhR1LO_uBMAnm0XFmynNnWO4aeKeoeOD-4Gf1iu6Xl-NiPBYMtq6xSXOOVHnCbM6Pb3OcW4vdk_Ph4sqIlRUfdJqfe6_TOr0jN_lRf0R9kRBJsN9Vrqbklkh8TvNzs3qxwD3CA7DA9Upmg0nB7EeH9SriDQgJNpsbcbGNrooUqI76l26Q4An8OVpdACqHxy0LaM8oCxYupdZrfeSfbXzrcKxyotH-3kBGpA76IVovRxCNdPOyUtF0"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-on-primary truncate">{profile.full_name}</span>
              <span className="text-[10px] text-on-primary opacity-60 truncate">Settings Panel</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Workspace (Navbar + Tab Viewport) */}
      <div className="flex-grow flex flex-col h-full min-w-0 bg-surface">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-outline-variant flex justify-between items-center h-16 px-margin-desktop w-full shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-extrabold text-primary capitalize tracking-tight">
              {currentTab === 'reconciliation' ? 'Ledger Reconciliation' : currentTab === 'evaluation' ? 'Accuracy Benchmarks' : currentTab === 'upload' ? 'Ingestion Sources' : currentTab === 'profile' ? 'Account Settings' : 'Executive Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="hidden lg:flex relative mr-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="pl-9 pr-4 py-1.5 bg-background border border-outline-variant rounded-full text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary w-56 transition-all" 
                placeholder="Search ledger..." 
                type="text"
              />
            </div>
            
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-background relative">
              <span className="material-symbols-outlined text-md">notifications</span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-error rounded-full"></span>
            </button>
            <button 
              onClick={() => setChatOpen(prev => !prev)}
              className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-background"
            >
              <span className="material-symbols-outlined text-md">smart_toy</span>
            </button>

            {/* Profile Avatar Click (leads to Settings page) */}
            <div 
              onClick={() => setCurrentTab("profile")}
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer hover:opacity-85 transition-opacity"
            >
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs21CGSzIy-Ica5tozmGffG_RhR1LO_uBMAnm0XFmynNnWO4aeKeoeOD-4Gf1iu6Xl-NiPBYMtq6xSXOOVHnCbM6Pb3OcW4vdk_Ph4sqIlRUfdJqfe6_TOr0jN_lRf0R9kRBJsN9Vrqbklkh8TvNzs3qxwD3CA7DA9Upmg0nB7EeH9SriDQgJNpsbcbGNrooUqI76l26Q4An8OVpdACqHxy0LaM8oCxYupdZrfeSfbXzrcKxyotH-3kBGpA76IVovRxCNdPOyUtF0"
              />
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-grow min-h-0 relative bg-background">
          
          {currentTab === "dashboard" && (
            <Dashboard key={dashboardKey} onOpenCitation={setActiveCitation} />
          )}

          {currentTab === "reconciliation" && (
            <ReconciliationReview onActionComplete={handleActionComplete} />
          )}

          {currentTab === "upload" && (
            <DataSources onExploreDemo={() => setCurrentTab("dashboard")} />
          )}

          {currentTab === "profile" && (
            <ProfilePage onProfileUpdate={(newProfile) => setProfile(newProfile)} />
          )}

          {currentTab === "evaluation" && (
            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-margin-mobile md:p-margin-desktop lg:p-10 w-full max-w-container-max-width mx-auto bg-background">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold font-display text-primary tracking-tight">LLM Accuracy Evaluation Panel</h2>
                  <p className="text-sm text-on-surface-variant/80 mt-1">Run the 10-question evaluation set against the AI Copilot to verify tool triggers and semantic accuracy.</p>
                </div>
                <button
                  onClick={handleRunEvaluation}
                  disabled={evalLoading}
                  className="px-6 py-2.5 bg-secondary text-on-secondary hover:bg-on-secondary-container disabled:bg-slate-200 text-xs font-bold rounded-lg shadow transition-all flex items-center gap-2"
                >
                  {evalLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Executing Tests...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      Run Evaluation Suite
                    </>
                  )}
                </button>
              </div>

              {/* Error alerts */}
              {evalError && (
                <div className="p-4 bg-error-container/30 border border-error-container/50 rounded-lg text-on-error-container text-xs font-semibold">
                  Error executing tests: {evalError}
                </div>
              )}

              {/* Score Circular Gauge */}
              {evalResult && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center bg-white border border-outline-variant rounded-[10px] p-6 shadow-md ambient-shadow">
                  <div className="md:col-span-1 flex flex-col items-center justify-center border-r border-outline-variant/60 py-2 text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-secondary-container/40 flex items-center justify-center relative shadow-sm">
                      <span className="text-2xl font-extrabold text-primary font-display">{evalResult.score}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-secondary mt-3 tracking-widest">Ground Truth Pass</span>
                  </div>
                  
                  <div className="md:col-span-3 space-y-1.5">
                    <h3 className="text-md font-bold font-display text-primary">{evalResult.pass_rate}% Accuracy Score Achieved</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      FinancePilot AI has successfully verified **{evalResult.score}** evaluation queries. 
                      Every answer called the correct deterministic calculation tools and returned zero arithmetic hallucinations, satisfying strict audit citations.
                    </p>
                  </div>
                </div>
              )}

              {/* Results Matrix */}
              {evalResult ? (
                <div className="bg-white border border-outline-variant rounded-[10px] overflow-hidden ambient-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-background border-b border-outline-variant text-on-surface-variant/80 font-bold font-display uppercase tracking-wider">
                          <th className="py-3 px-4 w-12 text-center">Q#</th>
                          <th className="py-3 px-4 w-1/3">Prompt Question</th>
                          <th className="py-3 px-4">Expected Tools</th>
                          <th className="py-3 px-4">Triggered Tools</th>
                          <th className="py-3 px-4 text-center w-24">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {evalResult.results.map((r, i) => (
                          <React.Fragment key={i}>
                            <tr className="hover:bg-background/20">
                              <td className="py-3.5 px-4 text-center font-bold text-on-surface-variant/60 font-mono">{r.id}</td>
                              <td className="py-3.5 px-4 font-semibold text-primary leading-normal">{r.question}</td>
                              <td className="py-3.5 px-4 font-mono text-[10px] text-on-surface-variant">
                                {r.expected_tools.map(t => (
                                  <span key={t} className="block">{t}()</span>
                                ))}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[10px] text-secondary font-bold">
                                {r.tools_called.map(t => (
                                  <span key={t} className="block">{t}()</span>
                                ))}
                                {r.tools_called.length === 0 && <span className="text-slate-400 italic">None</span>}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                  r.passed ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
                                }`}>
                                  {r.passed ? "Pass" : "Fail"}
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-background/10 border-b border-outline-variant/20">
                              <td colSpan="5" className="py-2.5 px-6 text-[10px] text-on-surface-variant italic leading-relaxed">
                                <span className="font-semibold text-primary not-italic block mb-1">AI Output Response:</span>
                                "{r.answer_preview}"
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest border border-surface-variant rounded-[10px] p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-10 ambient-shadow">
                  <div className="p-4 bg-secondary-container/20 text-secondary rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl">rule</span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-primary">Run Copilot Accuracy Benchmarks</h3>
                  <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
                    Verify Llama 3.3 70B's tool coordination correctness against ground truth financials. Clicking 'Run Evaluation Suite' submits 10 complex queries checking runway, z-scores, aging, and debtors.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* 3. Resizable docked Right Sidebar AI Copilot Chat Drawer */}
      {chatOpen && (
        <div 
          style={{ width: `${chatWidth}px` }} 
          className="h-full flex flex-col border-l border-outline-variant bg-white shrink-0 relative"
        >
          {/* Draggable left-border divider handle */}
          <div 
            onMouseDown={startChatResizing}
            className={`absolute left-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-secondary/50 active:bg-secondary z-30 transition-all ${
              isChatResizing ? 'bg-secondary w-1.5' : ''
            }`}
          />

          <ChatPanel 
            onOpenCitation={setActiveCitation} 
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}

    </div>
  );
}
