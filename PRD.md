## **PRD: FinancePilot AI — Reconciliation-First Financial Copilot for Freelancers & Agencies** 

## **1. Problem Statement** 

Freelancers and small agencies track invoices and payments manually. They can't easily answer who owes them money, whether payments match invoices, how much cash runway they have, or which expenses are unusual — because raw invoice/transaction data is never reconciled into one source of truth. Generic AI chatbots hallucinate financial numbers because they try to do arithmetic and matching inside the LLM itself. 

## **2. Solution** 

FinancePilot AI ingests invoices and bank transactions, deterministically reconciles payments to invoices (flagging uncertain matches for review instead of guessing), computes financial metrics with plain code (not LLM math), and exposes a dashboard plus a chat interface where an LLM agent answers questions by calling verified functions and citing the exact source records behind every number. 

**Core principle:** The LLM never calculates or matches anything — it only orchestrates tool calls and explains results, with every answer traceable to source data. 

## **3. Target User** 

Solo freelancer or small agency owner (2–10 people) who invoices clients and wants plainEnglish answers about their finances without opening a spreadsheet. 

## **4. Scope — What We're Building** 

- Synthetic seed data (invoices + transactions), generated via code, not scraped 

- Deterministic reconciliation engine: exact match → fuzzy match → flag for review 

- Deterministic financial calc engine: revenue, expenses, profit, cash runway, aging of receivables, anomaly detection 

- Dashboard: revenue/expense/profit trend, outstanding payments, aging buckets 

- Chat interface backed by a single tool-using LLM agent (function calling only, via Groq) 

- Every chat answer traceable to specific source invoice/transaction rows 

- Reconciliation review tab: user confirms/rejects ambiguous matches 

- Visible reasoning trace in chat ("Checking cash → Calculating burn rate → Projecting runway") 

- Fixed 10-question evaluation set with known correct answers 

## **5. Architecture** 

[Seed Data: invoices.json, transactions.json — generated via Faker + hand-crafted edge cases] 

↓ 

[Reconciliation Engine — deterministic Python, rapidfuzz] 

Step 1: exact match (amount + date window + payer name exact) 

Step 2: fuzzy match (amount ± tolerance, date window, name similarity score) 

Step 3: if best fuzzy score < threshold → flag "needs review" with top 2 candidates 

Output: matched_invoices, unmatched_invoices, needs_review[] 

↓ 

[Financial Calc Engine — deterministic, pandas] 

- revenue, expenses, profit (by month) 

- outstanding balance per client 

- aging buckets: 0-30 / 30-60 / 60+ days overdue 

- cash runway = current cash ÷ avg monthly burn (last 3 months) 

- anomaly flags: expense category z-score > 2 

- every output includes source row IDs for traceability 

↓ 

[Agent Layer — single LLM orchestrator, Groq function-calling] 

Tools: get_revenue_expenses_profit, get_top_debtors, get_aging_report, 

get_cash_runway, get_anomalies, get_needs_review_matches 

LLM picks tool(s) based on the question, never computes numbers itself, 

receives structured JSON with source IDs, explains in plain English 

- ↓ 

## [Frontend] 

- Dashboard (charts) 

- Chat panel (Q&A + expandable "Sources" + reasoning trace) 

- Reconciliation review tab (confirm/reject ambiguous matches) 

**Why not RAG:** Financial numbers have exact correct answers. Semantic/vector retrieval introduces approximation where none is needed — not used for numeric queries. 

**Why not multi-agent:** One agent with well-defined tools is more reliable under demo time pressure than coordinating multiple agents. The reconciliation match→fuzzy→flag logic is deterministic code, not a second agent. 

## **6. Data Generation** 

generate_seed_data.py uses **Faker** (free, open-source) to create realistic fake client names, dates, and amounts. Manually inject 4 guaranteed edge cases into the generated set: 

- 1 clean exact match 

- 1 fuzzy name mismatch ("Acme Corp" vs "ACME CORP PVT LTD") 

- 1 partial payment (amount doesn't fully match) 

- 1 clearly anomalous expense (for anomaly detection demo) 

Target: 15–20 invoices, 20–30 transactions. 

## **7. Data Schema** 

## **invoices.json** 

json 

{ 

"invoice_id": "INV-001", 

"client_name": "Acme Corp", 

"amount": 45000, 

"issue_date": "2026-05-01", 

"due_date": "2026-05-31", 

"status": "unpaid" 

} 

## **transactions.json** 

json 

{ 

"txn_id": "TXN-101", 

"date": "2026-06-02", 

"amount": 45000, 

"payer_name": "ACME CORP PVT LTD", 

"type": "credit", "category": null 

} 

**expenses.json** (transactions where type = debit, categorized) 

json 

{ "txn_id": "TXN-205", "date": "2026-06-05", "amount": 12000, 

"category": "software_subscriptions", "description": "AWS bill" 

} 

## **reconciliation_output.json** (generated) 

json 

{ 

"invoice_id": "INV-001", 

"matched_txn_id": "TXN-101", 

"match_type": "fuzzy", 

"confidence_score": 0.91, "status": "matched" 

} 

## **8. Tool Function Signatures** 

python 

def get_revenue_expenses_profit(period: str) -> dict: 

# {revenue, expenses, profit, source_txn_ids} 

def get_top_debtors(limit: int = 5) -> list[dict]: 

# [{client_name, amount_owed, invoice_ids, days_overdue}] 

def get_aging_report() -> dict: 

# {"0-30": [...], "30-60": [...], "60+": [...]} 

def get_cash_runway() -> dict: 

# {current_cash, avg_monthly_burn, runway_months, source_txn_ids} 

def get_anomalies() -> list[dict]: 

# [{txn_id, category, amount, mean, std_dev, reason}] 

def get_needs_review_matches() -> list[dict]: 

# [{invoice_id, candidate_txn_ids, scores, reason}] 

Each function returns structured JSON with source record IDs, which the LLM explains in plain language and the UI renders as clickable citations. 

## **9. Tech Stack (100% free)** 

**Layer Choice** Frontend React (Next.js) + Tailwind Charts Recharts Backend FastAPI (Python) 

Reconciliation/Matching pandas + rapidfuzz 

Faker Synthetic data LLM Groq API (free tier), Llama 3.3 70B, function-calling mode Data store Local JSON / SQLite Hosting (demo) Vercel (frontend) + Render/Railway (backend), or run locally 

## **10. Project Structure** 

financepilot-ai/ ├── backend/ 

│   ├── data/ 

- │   │   ├── generate_seed_data.py 

- │   │   ├── invoices.json 

- │   │   ├── transactions.json 

- │   │   └── expenses.json 

│   ├── reconciliation/ 

- │   │   ├── matcher.py 

│   │   └── review_flagging.py 

│   ├── calc/ 

│   │   ├── financials.py 

│   │   ├── aging.py 

│   │   ├── runway.py 

- │   │   └── anomalies.py 

│   ├── agent/ 

│   │   ├── tools.py 

│   │   ├── groq_client.py 

- │   │   └── system_prompt.py 

│   ├── main.py 

- │   └── requirements.txt 

- ├── frontend/ 

│   ├── src/ 

│   │   ├── components/ 

│   │   │   ├── Dashboard.jsx 

│   │   │   ├── ChatPanel.jsx 

│   │   │   ├── ReconciliationReview.jsx 

│   │   │   └── SourceCitation.jsx 

│   │   ├── App.jsx 

│   │   └── api.js 

- │   ├── package.json 

- │   └── tailwind.config.js 

- ├── eval/ 

- │   └── test_questions.json 

└── README.md 

## **11. Chat UX Behavior** 

User asks a question → agent selects tool(s) → shows reasoning trace → gives plain-English answer → expandable "Sources" section lists exact invoice/transaction IDs used. If a question touches an unmatched/ambiguous invoice, the agent explicitly flags it rather than ignoring the gap. 

## **12. Reconciliation Review UI** 

Lists all "needs review" pairs: invoice details, top 1–2 candidate transactions, match score, and reason (e.g., "amount matches exactly, but payer name is 78% similar"). One-click confirm/reject updates the reconciliation output. 

## **13. Evaluation** 

10 fixed test questions with known correct answers, verified against seed data before demo. State "10/10 correct against ground truth" in the pitch — strong trust signal for engineerjudges. 

## **14. Demo Script (5 min)** 

1. 30s — problem + one-liner: "Generic AI chatbots hallucinate financial numbers because they try to do math inside the LLM. We separated deterministic computation from language generation." 

2. 1 min — dashboard walkthrough 

3. 1.5 min — chat demo: "Who owes me the most?" → expand sources to prove traceability 

4. 1 min — reconciliation review tab: one ambiguous match, explain confidence scoring 

5. 1 min — "Can I afford to hire someone?" → runway answer, close with architecture diagram 

## **15. Build Timeline (48 hrs)** 

## **Hours Task** 

- 0–2 Seed data generation script + edge cases 

- 2–8 Reconciliation engine 

- 8–11 Calc engine 

11–16 Agent layer (Groq tool-calling) 

16–24 Dashboard UI 

24–30 Chat UI + trace + citations 

30–33 Reconciliation review UI 

33–36 Evaluation: run 10 test questions, fix bugs 

36–42 Polish, error handling, rehearsal 

42–48 Buffer 

## **16. One-Sentence Pitch** 

_"FinancePilot AI reconciles a freelancer's invoices and payments deterministically, then answers questions in plain English — every answer traces back to the exact transactions that produced it, because we never let the AI do the math."_ 

