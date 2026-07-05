import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess, onLogoClick }) {
  const [email, setEmail] = useState("alex@mercer.studio");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    // Simulating authentication delay
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);

    // Simple demo validation
    if (password === "password" || email.includes("@")) {
      onLoginSuccess({
        email: email,
        name: email === "alex@mercer.studio" ? "Alex Mercer" : email.split("@")[0]
      });
    } else {
      setError("Invalid credentials. Try using 'password' as your password.");
    }
  };

  return (
    <div 
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center p-6 relative font-body-md"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')" 
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>

      {/* Login Card */}
      <div className="bg-[#e4e2e3]/90 backdrop-blur-md rounded-2xl w-full max-w-[420px] shadow-2xl p-8 border border-white/20 relative z-10 animate-fade-in flex flex-col items-center">
        
        {/* Header Building Logo */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-85 transition-opacity"
        >
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          <span className="font-display text-lg font-extrabold text-primary tracking-tight">FinancePilot AI</span>
        </div>

        <h2 className="text-2xl font-bold font-display text-primary text-center mb-1">Welcome back</h2>
        <p className="text-xs text-on-surface-variant text-center mb-6">Please enter your details to sign in.</p>

        {error && (
          <div className="w-full p-3 mb-4 bg-error-container/30 border border-error-container/60 rounded-lg text-on-error-container text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-xs">
          
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-on-surface-variant font-semibold block">Email address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-on-surface-variant font-semibold block">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-0.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center py-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface-variant font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5"
              />
              Remember me
            </label>
            <a href="#" className="text-xs font-semibold text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-primary hover:bg-slate-900 text-on-primary font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2 disabled:bg-slate-700"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              "Log In"
            )}
          </button>

        </form>

        <p className="text-[11px] text-on-surface-variant mt-6 text-center">
          Don't have an account? <a href="#" className="font-bold text-primary hover:underline">Sign up</a>
        </p>

      </div>
    </div>
  );
}
