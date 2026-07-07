import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard({ onOpenCitation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const dashboardData = await api.getDashboard();
        setData(dashboardData);
      } catch (err) {
        setError(err.message || "Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold font-display text-primary">Ingesting financials...</h2>
        <p className="text-on-surface-variant/80 text-xs mt-1">Reconciliation engine compiling live metrics</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-error-container/20 text-error rounded-full mb-4">
          <span className="material-symbols-outlined text-4xl">alert_triangle</span>
        </div>
        <h2 className="text-xl font-bold font-display text-error">Calculation Error</h2>
        <p className="text-on-surface-variant mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  const { runway, trends, debtors, aging, anomalies, recent_transactions, needs_review_count } = data;

  const fmt = (num) => (num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-margin-mobile md:p-margin-desktop lg:p-10 w-full max-w-container-max-width mx-auto">
      
      {/* Live Reconciliation Pending Banner */}
      {needs_review_count > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-error-container/30 border border-error-container/50 rounded-[10px] animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-error-container/50 text-error rounded-lg shrink-0">
              <span className="material-symbols-outlined text-md">help_outline</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-error-container">Action Required: {needs_review_count} unreconciled invoice transactions</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Please review matching candidates to ensure cash runway and statements are 100% accurate.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = "/reconciliation"}
            className="w-full sm:w-auto px-4 py-1.5 bg-secondary text-on-secondary text-xs font-semibold rounded-lg hover:bg-on-secondary-container transition-all shrink-0 text-center"
          >
            Reconcile Now
          </button>
        </div>
      )}

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        
        {/* Revenue Card */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">3-Month Revenue</span>
            <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
            </div>
          </div>
          <div>
            <div className="font-display-metrics text-display-metrics text-primary mb-1">
              ${fmt(trends.reduce((acc, m) => acc + m.revenue, 0))}
            </div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant/75">
              <span>Cumulative performance</span>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">3-Month Expenses</span>
            <div className="w-8 h-8 rounded-full bg-error-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-sm">payments</span>
            </div>
          </div>
          <div>
            <div className="font-display-metrics text-display-metrics text-primary mb-1">
              ${fmt(trends.reduce((acc, m) => acc + m.expenses, 0))}
            </div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant/75">
              <span>Active debits & runway consumption</span>
            </div>
          </div>
        </div>

        {/* Cash Runway Card */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">Cash Runway</span>
            <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">hourglass_empty</span>
            </div>
          </div>
          <div>
            <div className="font-display-metrics text-display-metrics text-primary mb-1">
              {runway.runway_months.toFixed(1)} <span className="text-xs text-on-surface-variant">months</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant/80 w-full mt-2">
              <span className="whitespace-nowrap">Burn: <strong className="text-primary font-semibold">${fmt(runway.avg_monthly_burn)}/mo</strong></span>
              <span className="whitespace-nowrap text-secondary">Cash: <strong className="font-semibold">${fmt(runway.current_cash)}</strong></span>
            </div>
          </div>
        </div>

        {/* Outstanding Receivables Card */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">Outstanding Balances</span>
            <div className="w-8 h-8 rounded-full bg-error-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-sm">assignment_late</span>
            </div>
          </div>
          <div>
            <div className="font-display-metrics text-display-metrics text-primary mb-1">
              ${fmt(aging.summary.total_outstanding)}
            </div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant/75">
              <span>Overdue receivables</span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        
        {/* Performance Trend Chart (Revenue vs Expense) */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-md font-bold font-display text-primary">Monthly Performance Trend</h3>
              <p className="text-xs text-on-surface-variant/80">Revenue vs Expense breakdown</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-secondary rounded-full"></span>Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-error rounded-full"></span>Expenses</span>
            </div>
          </div>
          
          <div className="w-full h-64 bg-background/50 rounded-lg p-4 flex items-end justify-around relative border border-surface-variant/40">
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-1 pointer-events-none opacity-5">
              <div className="border-t border-slate-700 w-full"></div>
              <div className="border-t border-slate-700 w-full"></div>
              <div className="border-t border-slate-700 w-full"></div>
              <div className="border-t border-slate-700 w-full"></div>
            </div>

            {trends.map((item, i) => {
              const maxVal = Math.max(...trends.map(t => Math.max(t.revenue, t.expenses))) || 10000;
              const revHeight = (item.revenue / maxVal) * 80 + 5;
              const expHeight = (item.expenses / maxVal) * 80 + 5;

              return (
                <div key={i} className="flex flex-col items-center gap-2 w-1/4 h-full justify-end z-10">
                  <div className="flex gap-3 items-end h-[80%] w-full justify-center">
                    <div 
                      style={{ height: `${revHeight}%` }}
                      className="w-8 bg-secondary rounded-t-[4px] hover:opacity-80 transition-all duration-300 relative group cursor-pointer"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap z-50">
                        Rev: ${fmt(item.revenue)}
                      </div>
                    </div>
                    <div 
                      style={{ height: `${expHeight}%` }}
                      className="w-8 bg-error rounded-t-[4px] hover:opacity-80 transition-all duration-300 relative group cursor-pointer"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap z-50">
                        Exp: ${fmt(item.expenses)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant font-display mt-2 uppercase">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aging Bucket Chart */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6">
          <div>
            <h3 className="text-md font-bold font-display text-primary">Receivables Overdue Bucket</h3>
            <p className="text-xs text-on-surface-variant/80">Outstanding invoice aging</p>
          </div>
          
          <div className="mt-8 space-y-4">
            {[
              { label: "0-30 days overdue", val: aging.summary["0-30_total"], color: "bg-secondary", text: "text-secondary" },
              { label: "30-60 days overdue", val: aging.summary["30-60_total"], color: "bg-amber-500", text: "text-amber-600" },
              { label: "60+ days overdue", val: aging.summary["60+_total"], color: "bg-error", text: "text-error" }
            ].map((bucket, i) => {
              const maxVal = aging.summary.total_outstanding || 1;
              const pct = (bucket.val / maxVal) * 100;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">{bucket.label}</span>
                    <span className={bucket.text}>${fmt(bucket.val)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${pct}%` }} 
                      className={`h-full ${bucket.color} rounded-full transition-all duration-500`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-3.5 bg-background/50 rounded-lg border border-outline-variant/40 text-center">
            <span className="text-xs text-on-surface-variant block">Total Outstanding Balance</span>
            <span className="text-xl font-extrabold text-primary mt-1 block font-display">
              ${fmt(aging.summary.total_outstanding)}
            </span>
          </div>
        </div>

      </div>

      {/* Debtors & Anomalies Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        
        {/* Outstanding Payments Widget */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-primary-container/10 text-primary rounded-lg">
              <span className="material-symbols-outlined text-md">group</span>
            </div>
            <h3 className="text-md font-bold font-display text-primary">Outstanding Payments per Client</h3>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-3 pr-1">
            {debtors.length > 0 ? (
              debtors.map((d, i) => (
                <div key={i} className="p-3 bg-background/60 hover:bg-background/90 border border-outline-variant/30 rounded-lg flex items-center justify-between transition-colors group">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">{d.client_name}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-on-surface-variant">Invoices:</span>
                      {d.invoice_ids.map(inv_id => (
                        <button 
                          key={inv_id}
                          onClick={() => onOpenCitation(inv_id)}
                          className="px-1.5 py-0.5 bg-white hover:bg-surface-container text-on-surface-variant hover:text-secondary rounded border border-outline-variant/60 font-mono text-[9px] font-bold"
                        >
                          {inv_id}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary block">${fmt(d.amount_owed)}</span>
                    <span className="text-[10px] text-error font-semibold">{d.days_overdue} days overdue</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant py-10">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">task_alt</span>
                <p className="text-sm font-semibold">All cleared!</p>
                <p className="text-xs">No outstanding accounts receivable client balances.</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Anomalies Widget */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6 flex flex-col h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-error-container/20 text-error rounded-lg">
              <span className="material-symbols-outlined text-md">warning</span>
            </div>
            <h3 className="text-md font-bold font-display text-primary">Statistical Expense Anomalies</h3>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-3 pr-1">
            {anomalies.length > 0 ? (
              anomalies.map((a, i) => (
                <div key={i} className="p-3 bg-error-container/10 hover:bg-error-container/20 border border-error-container/40 rounded-lg relative overflow-hidden group transition-all">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-error/10 text-error rounded-bl-lg text-[9px] font-bold">
                    Z-Score {a.z_score}
                  </div>
                  <div className="flex justify-between items-start mb-2 pr-16">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-secondary uppercase tracking-wider font-semibold">{a.category.replace('_', ' ')}</span>
                      <h4 className="text-xs font-bold text-primary">{a.description}</h4>
                    </div>
                    <span className="text-xs font-extrabold text-error">${fmt(a.amount)}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant italic">"{a.reason}"</p>
                  <div className="mt-3 flex items-center justify-between text-[9px] text-on-surface-variant/80">
                    <span>Date: {a.date}</span>
                    <button 
                      onClick={() => onOpenCitation(a.txn_id)}
                      className="px-2 py-0.5 bg-white hover:bg-surface-container text-on-surface-variant hover:text-secondary rounded border border-outline-variant font-bold"
                    >
                      Audit Citation ({a.txn_id})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant py-10">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">verified_user</span>
                <p className="text-sm font-semibold">No anomalies detected.</p>
                <p className="text-xs">All categorized expenses reside within expected standard deviations.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Raw Ledger Log */}
      <div className="bg-surface-container-lowest rounded-[10px] border border-surface-variant ambient-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-container/10 text-primary rounded-lg">
              <span className="material-symbols-outlined text-md">receipt_long</span>
            </div>
            <h3 className="text-md font-bold font-display text-primary">Live Bank Ledger</h3>
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono">Showing last 20 events</span>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-background border-b border-outline-variant text-on-surface-variant/80 font-bold font-display uppercase tracking-wider">
                <th className="py-3 px-4">TXN ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payer / Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {recent_transactions.map((t, i) => (
                <tr key={i} className="hover:bg-background/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-primary font-bold">{t.txn_id}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{t.date}</td>
                  <td className="py-3 px-4 text-primary font-medium">
                    {t.payer_name}
                    {t.description && t.description !== t.payer_name && (
                      <span className="text-[10px] text-on-surface-variant block font-normal italic mt-0.5">"{t.description}"</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                      t.type === 'credit' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-bold font-mono ${
                    t.type === 'credit' ? 'text-secondary' : 'text-error'
                  }`}>
                    {t.type === 'credit' ? '+' : '-'}${fmt(t.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => onOpenCitation(t.txn_id)}
                      className="px-2.5 py-1 bg-white hover:bg-surface-container text-on-surface-variant hover:text-secondary border border-outline-variant rounded font-semibold transition-all"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
