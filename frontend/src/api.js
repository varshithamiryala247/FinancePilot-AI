const API_BASE = ""; // requests are proxied via vite proxy in dev

const api = {
  async getDashboard() {
    const res = await fetch(`${API_BASE}/api/dashboard`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getReconciliationReview() {
    const res = await fetch(`${API_BASE}/api/reconciliation/review`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async confirmReconciliation(invoiceId, txnId) {
    const res = await fetch(`${API_BASE}/api/reconciliation/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_id: invoiceId, txn_id: txnId })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async rejectReconciliation(invoiceId, txnId) {
    const res = await fetch(`${API_BASE}/api/reconciliation/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_id: invoiceId, txn_id: txnId })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async sendChatMessage(prompt) {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      const errorText = await res.text();
      let parsedError = errorText;
      try {
        const jsonError = JSON.parse(errorText);
        parsedError = jsonError.detail || errorText;
      } catch (e) {}
      throw new Error(parsedError);
    }
    return res.json();
  },

  async runEvaluation() {
    const res = await fetch(`${API_BASE}/api/eval`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/api/profile`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async saveProfile(profileData) {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/api/reset-database`, {
      method: "POST"
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export default api;
