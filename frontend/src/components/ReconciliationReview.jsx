import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ReconciliationReview({ onActionComplete }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  async function loadReviewItems() {
    try {
      setLoading(true);
      const res = await api.getReconciliationReview();
      setItems(res.needs_review || []);
    } catch (err) {
      setError(err.message || "Failed to load reconciliation items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviewItems();
  }, []);

  const handleConfirm = async (invoiceId, txnId) => {
    try {
      setStatusMessage({ type: "loading", text: `Confirming match for invoice ${invoiceId}...` });
      const res = await api.confirmReconciliation(invoiceId, txnId);
      setStatusMessage({ type: "success", text: res.message });
      await loadReviewItems();
      if (onActionComplete) onActionComplete();
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  const handleReject = async (invoiceId, txnId) => {
    try {
      setStatusMessage({ type: "loading", text: `Rejecting candidate transaction ${txnId}...` });
      const res = await api.rejectReconciliation(invoiceId, txnId);
      setStatusMessage({ type: "success", text: res.message });
      await loadReviewItems();
      if (onActionComplete) onActionComplete();
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold font-display text-primary">Analyzing bank feeds...</h2>
        <p className="text-on-surface-variant/80 text-xs mt-1">Reconciliation matcher scanning for candidates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-margin-mobile md:p-margin-desktop lg:p-10 w-full max-w-container-max-width mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-primary tracking-tight">Deterministic Reconciliation Center</h2>
        <p className="text-sm text-on-surface-variant/80 mt-1">Validate ambiguous transaction-to-invoice match candidates flagged by the rule engine.</p>
      </div>

      {/* Floating Status Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-lg flex items-center justify-between border ${
          statusMessage.type === "loading" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-700" :
          statusMessage.type === "success" ? "bg-secondary-container/30 border-secondary-container/50 text-on-secondary-container" :
          "bg-error-container/30 border-error-container/50 text-on-error-container"
        }`}>
          <div className="flex items-center gap-3">
            {statusMessage.type === "loading" ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-md">
                {statusMessage.type === "success" ? "check_circle" : "error"}
              </span>
            )}
            <span className="text-xs font-semibold">{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-[10px] font-bold uppercase underline tracking-wider opacity-85 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Flagged Item Cards */}
      {items.length > 0 ? (
        <div className="space-y-6">
          {items.map((item, idx) => {
            const { invoice, candidates } = item;
            return (
              <div key={idx} className="bg-surface-container-lowest rounded-[10px] border border-surface-variant overflow-hidden ambient-shadow grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-surface-variant/50">
                
                {/* Left Side: Invoice details (takes 2 cols) */}
                <div className="p-6 lg:col-span-2 space-y-4 bg-background/30">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 bg-error-container/30 text-on-error-container border border-error-container/50 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Needs Review
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant/70 uppercase">{invoice.invoice_id}</span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Client Invoice</span>
                    <h3 className="text-md font-extrabold text-primary mt-0.5">{invoice.client_name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-surface-variant/60 text-xs">
                    <div>
                      <span className="text-on-surface-variant block font-medium">Amount Invoiced</span>
                      <span className="text-sm font-bold text-primary mt-1 block">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Due Date</span>
                      <span className="text-sm font-semibold text-primary mt-1 block">{invoice.due_date}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Candidate Transactions (takes 3 cols) */}
                <div className="p-6 lg:col-span-3 space-y-4">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Matching Candidate Transactions</span>
                  
                  <div className="space-y-4">
                    {candidates.map((cand, cIdx) => (
                      <div key={cIdx} className="p-4 bg-background/40 border border-outline-variant/60 hover:border-outline-variant rounded-lg space-y-3 transition-all relative overflow-hidden group">
                        
                        {/* Similarity Score Accent Badge */}
                        <div className="absolute top-0 right-0 px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-bl-lg text-[10px] font-extrabold font-mono border-l border-b border-outline-variant/60">
                          {Math.round(cand.score * 100)}% Match
                        </div>

                        {/* Top Line: Payer & Amount */}
                        <div className="flex justify-between items-start pr-20">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold font-mono">TXN: {cand.txn_id}</span>
                            <h4 className="text-xs font-bold text-primary">{cand.payer_name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-secondary font-mono">+${cand.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            <span className="text-[9px] text-on-surface-variant/80 block mt-0.5">Date: {cand.date}</span>
                          </div>
                        </div>

                        {/* Matching Explanation / Reason */}
                        <div className="p-2.5 bg-white rounded-md border border-outline-variant/40 text-xs text-on-surface-variant">
                          <span className="font-semibold text-primary">Matching Anomaly:</span> {cand.reason}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleConfirm(invoice.invoice_id, cand.txn_id)}
                            className="flex-grow py-2 bg-secondary hover:bg-on-secondary-container text-on-secondary font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Confirm Match
                          </button>
                          <button
                            onClick={() => handleReject(invoice.invoice_id, cand.txn_id)}
                            className="px-4 py-2 bg-white hover:bg-surface-container text-error border border-outline-variant hover:border-error/40 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                            Reject
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-surface-variant rounded-[10px] p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-10 ambient-shadow">
          <div className="p-4 bg-secondary-container/20 text-secondary rounded-full mb-4">
            <span className="material-symbols-outlined text-4xl">task_alt</span>
          </div>
          <h3 className="text-lg font-bold font-display text-primary">All Invoices Reconciled!</h3>
          <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
            Your ledger is 100% clean. The reconciliation engine detected no ambiguous payments requiring review. Feel free to use the AI Copilot to check outstanding client reports.
          </p>
        </div>
      )}
    </div>
  );
}
