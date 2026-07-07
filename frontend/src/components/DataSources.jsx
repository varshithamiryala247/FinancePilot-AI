import React, { useState } from 'react';
import api from '../api';

export default function DataSources({ onExploreDemo }) {
  const [uploads, setUploads] = useState([
    { name: "invoices_may_2026.csv", size: "1.2 MB", time: "2 hours ago", status: "Processed" },
    { name: "bank_statement_june.csv", size: "840 KB", time: "5 hours ago", status: "Processed" },
    { name: "tax_receipts_q2.pdf", size: "4.5 MB", time: "1 day ago", status: "Processed" }
  ]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleDemoLoad = async () => {
    setLoading(true);
    setStep("Ingesting synthetic records...");
    await new Promise(r => setTimeout(r, 800));
    setStep("Mapping schema variables...");
    await new Promise(r => setTimeout(r, 600));
    setStep("Validating matching anomalies...");
    await new Promise(r => setTimeout(r, 600));
    
    setLoading(false);
    showToast("success", "Demo financial data initialized successfully!");
    onExploreDemo();
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    if (!files || files.length === 0) return;

    const file = files[0];
    
    setLoading(true);
    setStep(`Reading ${file.name}...`);
    await new Promise(r => setTimeout(r, 600));
    setStep("Uploading to secure financial server...");

    try {
      const res = await api.uploadFile(file);
      setStep("Executing deterministic reconciliation...");
      await new Promise(r => setTimeout(r, 800));

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;

      setUploads(prev => [
        { name: file.name, size: sizeStr, time: "Just now", status: "Processed" },
        ...prev
      ]);
      showToast("success", res.message || "File uploaded and statements reconciled!");
    } catch (err) {
      showToast("error", err.message || "Failed to process upload. Please check CSV format.");
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseReset = async () => {
    if (!window.confirm("Are you sure you want to clear all invoices and transactions from the server? This action cannot be undone.")) return;
    
    setLoading(true);
    setStep("Clearing ledger databases...");
    try {
      const res = await api.resetDatabase();
      setUploads([]);
      showToast("success", res.message || "Ledger database reset successfully.");
    } catch (err) {
      showToast("error", err.message || "Failed to reset ledger database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-margin-mobile md:p-margin-desktop lg:p-10 w-full max-w-container-max-width mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div>
          <h2 className="text-2xl font-bold font-display text-primary tracking-tight">Financial Data Sources</h2>
          <p className="text-sm text-on-surface-variant/80 mt-1">Upload files or connect data integrations to ingest bank ledgers, tax papers, and invoices.</p>
        </div>
        
        {/* Real Document template links */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold w-full lg:w-auto">
          <button 
            onClick={handleDatabaseReset}
            className="flex-1 sm:flex-none px-3 py-1.5 bg-[#fce8e6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm border border-red-200/40"
          >
            <span className="material-symbols-outlined text-[16px]">delete_forever</span>
            Reset Database
          </button>
          <a 
            href="/api/sample/invoices" 
            download="sample_invoices.csv"
            className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-outline-variant hover:bg-slate-50 text-primary rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Invoices
          </a>
          <a 
            href="/api/sample/transactions" 
            download="sample_transactions.csv"
            className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-outline-variant hover:bg-slate-50 text-primary rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Transactions
          </a>
        </div>
      </div>

      {/* Success/Error Toast */}
      {toast && (
        <div className={`p-4 rounded-lg flex items-center justify-between border ${
          toast.type === "success" 
            ? "bg-secondary-container/20 border-secondary-container/50 text-on-secondary-container" 
            : "bg-error-container/20 border-error-container/50 text-on-error-container"
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-md">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-[10px] font-bold uppercase underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-outline-variant rounded-[10px] min-h-[350px] shadow-sm text-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-md font-bold text-primary font-display">{step}</h3>
          <p className="text-xs text-on-surface-variant max-w-xs">Connecting ledger pipelines. Please do not close your browser tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          
          {/* Upload and Demo column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Drag & Drop Card */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload}
              className="bg-white rounded-[10px] border-2 border-dashed border-outline-variant hover:border-secondary p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-primary">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <h3 className="text-md font-bold font-display text-primary mb-2 text-center">Drop CSV or PDF invoices here</h3>
              <p className="text-xs text-on-surface-variant mb-6 text-center max-w-sm leading-relaxed">
                Upload your transactions or billing ledgers to process statements. Supported formats: **.csv, .pdf, .xlsx** up to 50MB.
              </p>
              <label className="bg-primary hover:bg-opacity-95 text-on-primary text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".csv,.pdf,.xlsx"
                />
              </label>
            </div>

            {/* Load Demo Data */}
            <div className="bg-secondary-container/20 rounded-[10px] border border-secondary-container/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-container text-secondary rounded-full">
                  <span className="material-symbols-outlined text-md">science</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-primary">Use Sample Demo Data</h4>
                  <p className="text-xs text-on-surface-variant">Populate the copilot dashboard with audit statements for evaluation.</p>
                </div>
              </div>
              <button 
                onClick={handleDemoLoad}
                className="w-full sm:w-auto px-5 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary font-bold text-xs rounded-lg transition-all"
              >
                Load Demo Data
              </button>
            </div>

          </div>

          {/* Upload history column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[10px] border border-outline-variant shadow-sm flex flex-col h-full min-h-[350px]">
              
              <div className="p-4 border-b border-outline-variant">
                <h3 className="font-bold text-sm text-primary font-display">Recent Ingestion History</h3>
              </div>

              <div className="p-4 flex-grow overflow-y-auto space-y-4">
                {uploads.map((upload, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background/50 border border-outline-variant/40 rounded-lg gap-2 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="material-symbols-outlined text-on-surface-variant text-md shrink-0">draft</span>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="text-xs font-bold text-primary block truncate">{upload.name}</span>
                        <span className="text-[10px] text-on-surface-variant block truncate">{upload.size} • {upload.time}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0">
                      {upload.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
