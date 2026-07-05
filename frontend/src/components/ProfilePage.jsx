import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ProfilePage({ onProfileUpdate }) {
  const [profile, setProfile] = useState({
    full_name: "Alex Mercer",
    email: "alex@mercer.studio",
    role: "Principal Designer / Freelancer",
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
    two_factor: false
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("personal"); // personal, security, notifications, billing

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setUpdating(true);

    try {
      const res = await api.saveProfile(profile);
      setSuccess(res.message || "Profile details updated successfully!");
      if (onProfileUpdate) {
        onProfileUpdate(profile);
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "AM";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold font-display text-primary">Loading configurations...</h2>
        <p className="text-on-surface-variant/80 text-xs mt-1">Retrieving profile metadata</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-margin-mobile md:p-margin-desktop lg:p-10 w-full max-w-container-max-width mx-auto">
      
      {/* Settings Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-primary tracking-tight">Account Settings</h2>
        <p className="text-sm text-on-surface-variant/80 mt-1">Manage your profile, security preferences, and billing details.</p>
      </div>

      {success && (
        <div className="p-4 bg-secondary-container/30 border border-secondary-container text-on-secondary-container text-xs font-semibold rounded-lg">
          {success}
        </div>
      )}

      {/* Main Settings Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter items-start">
        
        {/* Left Sub-nav panel */}
        <div className="md:col-span-1 bg-white border border-outline-variant rounded-[10px] p-2 space-y-1 shadow-sm">
          {[
            { id: "personal", label: "Personal Info", icon: "person" },
            { id: "security", label: "Security", icon: "shield" },
            { id: "notifications", label: "Notifications", icon: "notifications" },
            { id: "billing", label: "Billing", icon: "credit_card" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-xs font-bold transition-all ${
                activeSubTab === tab.id 
                  ? "bg-primary-container text-on-primary-container font-extrabold" 
                  : "text-on-surface-variant hover:text-primary hover:bg-background/80"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Settings Forms */}
        <div className="md:col-span-3 space-y-6">
          {activeSubTab === "personal" ? (
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Profile Picture Card */}
              <div className="bg-white border border-outline-variant rounded-[10px] p-6 shadow-sm">
                <h3 className="text-sm font-bold text-primary font-display mb-1">Profile Picture</h3>
                <p className="text-[11px] text-on-surface-variant/80 mb-4">This will be displayed on your profile and in communications.</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-display font-extrabold text-xl flex items-center justify-center border-2 border-white shadow-md">
                    {getInitials(profile.full_name)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      className="px-4 py-2 border border-outline-variant hover:bg-surface-container-low text-xs font-bold text-primary rounded-lg transition-colors"
                    >
                      Upload new
                    </button>
                    <button 
                      type="button"
                      className="px-4 py-2 text-xs font-bold text-error hover:underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Details Grid */}
              <div className="bg-white border border-outline-variant rounded-[10px] p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter text-xs font-semibold">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-on-surface-variant block">Full Name</label>
                    <input 
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      required
                    />
                  </div>

                  {/* Email address */}
                  <div className="space-y-1">
                    <label className="text-on-surface-variant block">Email Address</label>
                    <input 
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      required
                    />
                  </div>

                  {/* Professional Role */}
                  <div className="space-y-1">
                    <label className="text-on-surface-variant block">Professional Role</label>
                    <input 
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      required
                    />
                  </div>

                  {/* Timezone */}
                  <div className="space-y-1">
                    <label className="text-on-surface-variant block">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                    >
                      <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                      <option>(GMT+00:00) Greenwich Mean Time (London)</option>
                      <option>(GMT+05:30) Indian Standard Time (New Delhi)</option>
                      <option>(GMT+09:00) Japan Standard Time (Tokyo)</option>
                    </select>
                  </div>

                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/60">
                  <button 
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 bg-primary hover:bg-slate-900 text-on-primary font-bold text-xs rounded-lg transition-all shadow disabled:bg-slate-700"
                  >
                    {updating ? "Saving..." : "Update Profile"}
                  </button>
                </div>

              </div>

              {/* Security settings inline panel */}
              <div className="bg-white border border-outline-variant rounded-[10px] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-md">lock</span>
                  <div>
                    <h3 className="text-sm font-bold text-primary font-display">Security Settings</h3>
                    <p className="text-[10px] text-on-surface-variant/80">Manage your password and authentication methods.</p>
                  </div>
                </div>

                <div className="border-t border-outline-variant/60 pt-4 space-y-4 text-xs font-semibold">
                  {/* Current Password */}
                  <div className="space-y-1 max-w-sm">
                    <label className="text-on-surface-variant block">Current Password</label>
                    <input 
                      type="password"
                      value="••••••••"
                      disabled
                      className="w-full px-3 py-2 bg-slate-100 border border-outline-variant rounded-lg text-xs text-on-surface-variant focus:outline-none"
                    />
                  </div>

                  {/* 2FA Toggle switch */}
                  <div className="flex items-center justify-between py-2 border-t border-outline-variant/30">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-primary block">Two-Factor Authentication</span>
                      <span className="text-[10px] text-on-surface-variant block">Add an extra layer of security.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, two_factor: !prev.two_factor }))}
                      className={`w-11 h-6 rounded-full p-1 transition-all ${profile.two_factor ? 'bg-secondary' : 'bg-slate-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${profile.two_factor ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

            </form>
          ) : (
            <div className="bg-white border border-outline-variant rounded-[10px] p-10 text-center flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">construction</span>
              <h3 className="text-md font-bold font-display text-primary">Section under maintenance</h3>
              <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed">
                Billing details and notification triggers are managed by the financial system administrator.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
