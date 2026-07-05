import os
import json
import subprocess
import io
import csv
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.calc.financials import get_financial_summary, get_outstanding_balances
from backend.calc.aging import get_aging_report
from backend.calc.runway import get_cash_runway
from backend.calc.anomalies import get_anomalies
from backend.reconciliation.review_flagging import get_flagged_matches, confirm_manual_match, reject_manual_candidate
from backend.reconciliation.matcher import run_reconciliation
from backend.agent.groq_client import chat_with_agent

app = FastAPI(title="FinancePilot AI API")

# Configure CORS (extremely important for Vite running on port 5173 to reach FastAPI on 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Request Models
class ReconcileActionRequest(BaseModel):
    invoice_id: str
    txn_id: str

class ChatRequest(BaseModel):
    prompt: str

class ProfileRequest(BaseModel):
    full_name: str
    email: str
    role: str
    timezone: str
    two_factor: bool


from fastapi.responses import RedirectResponse, FileResponse

# API ENDPOINTS
@app.get("/")
def redirect_to_docs():
    """Redirect root path to Swagger API documentation."""
    return RedirectResponse(url="/docs")

@app.get("/api/dashboard")
def api_dashboard():
    """Retrieve key metrics and data for the main dashboard."""
    try:
        runway_data = get_cash_runway()
        trends = get_financial_summary()
        debtors = get_outstanding_balances()
        aging = get_aging_report()
        anoms = get_anomalies()
        
        # Load raw transactions for the transaction log table (last 20 items)
        transactions_path = "backend/data/transactions.json"
        recent_txns = []
        if os.path.exists(transactions_path):
            with open(transactions_path, "r") as f:
                recent_txns = json.load(f)
            recent_txns.sort(key=lambda x: x["date"], reverse=True)
            recent_txns = recent_txns[:20]

        # Count items pending review
        flagged = get_flagged_matches()
        needs_review_count = len(flagged)
        
        return {
            "runway": runway_data,
            "trends": trends,
            "debtors": debtors,
            "aging": aging,
            "anomalies": anoms,
            "recent_transactions": recent_txns,
            "needs_review_count": needs_review_count,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reconciliation/review")
def api_reconciliation_review():
    """Get all invoices and matching transaction candidates pending review."""
    try:
        flagged = get_flagged_matches()
        return {
            "needs_review": flagged,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reconciliation/confirm")
def api_reconciliation_confirm(body: ReconcileActionRequest):
    """Confirm a reconciliation match manually."""
    res = confirm_manual_match(body.invoice_id, body.txn_id)
    if res.get("success"):
        return res
    raise HTTPException(status_code=400, detail=res.get("message"))

@app.post("/api/reconciliation/reject")
def api_reconciliation_reject(body: ReconcileActionRequest):
    """Reject a reconciliation candidate transaction."""
    res = reject_manual_candidate(body.invoice_id, body.txn_id)
    if res.get("success"):
        return res
    raise HTTPException(status_code=400, detail=res.get("message"))

@app.post("/api/chat")
def api_chat(body: ChatRequest):
    """Submit a prompt to the AI financial copilot agent."""
    try:
        response = chat_with_agent(body.prompt)
        return response
    except ValueError as e:
        # Catch missing API key and return HTTP 400 with user-friendly text
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eval")
def api_run_eval():
    """Run the 10-question evaluation suite and return the detailed results."""
    try:
        # Load the test questions
        eval_file = "eval/test_questions.json"
        if not os.path.exists(eval_file):
            raise HTTPException(status_code=404, detail="test_questions.json not found")
            
        with open(eval_file, "r") as f:
            questions = json.load(f)
            
        results = []
        correct_count = 0
        
        for q in questions:
            q_text = q["question"]
            expected_tools = q.get("expected_tools", [])
            
            try:
                # Execute chat agent query
                agent_res = chat_with_agent(q_text)
                
                # Verify if expected tools were called
                tools_called = agent_res.get("tools_called", [])
                tools_match = all(t in tools_called for t in expected_tools)
                
                # Check answer content for key terms
                content_match = True
                expected_terms = q.get("expected_terms", [])
                for term in expected_terms:
                    if term.lower() not in agent_res.get("answer", "").lower():
                        content_match = False
                        break
                        
                passed = tools_match and content_match
                if passed:
                    correct_count += 1
                
                results.append({
                    "id": q["id"],
                    "question": q_text,
                    "expected_tools": expected_tools,
                    "tools_called": tools_called,
                    "passed": passed,
                    "answer_preview": agent_res.get("answer", "")[:120] + "..."
                })
            except Exception as e:
                results.append({
                    "id": q["id"],
                    "question": q_text,
                    "expected_tools": expected_tools,
                    "tools_called": [],
                    "passed": False,
                    "answer_preview": f"Error executing test question: {str(e)}"
                })
            
        return {
            "score": f"{correct_count}/{len(questions)}",
            "pass_rate": round(correct_count / len(questions) * 100, 2),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/profile")
def get_profile():
    """Retrieve profile metadata from database file."""
    profile_path = "backend/data/profile.json"
    if os.path.exists(profile_path):
        with open(profile_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "full_name": "Alex Mercer",
        "email": "alex@mercer.studio",
        "role": "Principal Designer / Freelancer",
        "timezone": "(GMT-08:00) Pacific Time (US & Canada)",
        "two_factor": False
    }

@app.post("/api/profile")
def save_profile(body: ProfileRequest):
    """Save updated profile metadata to database file."""
    profile_path = "backend/data/profile.json"
    try:
        with open(profile_path, "w", encoding="utf-8") as f:
            json.dump(body.dict(), f, indent=2)
        return {"status": "success", "message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and parse custom CSV or JSON datasets, appending them to invoices or transactions."""
    content = await file.read()
    filename = file.filename.lower()
    
    records = []
    
    # Parse JSON
    if filename.endswith(".json"):
        try:
            records = json.loads(content.decode("utf-8"))
            if not isinstance(records, list):
                records = [records]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON file format: {str(e)}")
            
    # Parse CSV
    elif filename.endswith(".csv"):
        try:
            stream = io.StringIO(content.decode("utf-8"))
            reader = csv.DictReader(stream)
            for row in reader:
                cleaned_row = {k.strip(): v.strip() for k, v in row.items() if k is not None}
                if "amount" in cleaned_row:
                    cleaned_row["amount"] = float(cleaned_row["amount"])
                records.append(cleaned_row)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid CSV file format: {str(e)}")
            
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload .csv or .json files.")

    if not records:
        return {"status": "success", "message": "No records found in the uploaded file."}

    # Detect record type
    first = records[0]
    is_invoice = "invoice_id" in first or "client_name" in first
    is_transaction = "txn_id" in first or "payer_name" in first or "type" in first

    if is_invoice:
        db_path = "backend/data/invoices.json"
        existing = []
        if os.path.exists(db_path):
            with open(db_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
        
        existing_ids = {inv["invoice_id"] for inv in existing if "invoice_id" in inv}
        added_count = 0
        for rec in records:
            inv_id = rec.get("invoice_id")
            if inv_id and inv_id not in existing_ids:
                invoice_record = {
                    "invoice_id": inv_id,
                    "client_name": rec.get("client_name", "Unknown Client"),
                    "amount": float(rec.get("amount", 0)),
                    "issue_date": rec.get("issue_date", datetime.now().strftime("%Y-%m-%d")),
                    "due_date": rec.get("due_date", datetime.now().strftime("%Y-%m-%d")),
                    "status": rec.get("status", "unpaid")
                }
                existing.append(invoice_record)
                added_count += 1
                
        with open(db_path, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
            
        run_reconciliation()
        return {"status": "success", "message": f"Successfully parsed and saved {added_count} new invoices. Reconciliation engine re-run completed."}

    elif is_transaction:
        tx_path = "backend/data/transactions.json"
        exp_path = "backend/data/expenses.json"
        
        existing_tx = []
        if os.path.exists(tx_path):
            with open(tx_path, "r", encoding="utf-8") as f:
                existing_tx = json.load(f)
                
        existing_exp = []
        if os.path.exists(exp_path):
            with open(exp_path, "r", encoding="utf-8") as f:
                existing_exp = json.load(f)
                
        existing_tx_ids = {t["txn_id"] for t in existing_tx if "txn_id" in t}
        added_tx_count = 0
        
        for rec in records:
            t_id = rec.get("txn_id")
            if t_id and t_id not in existing_tx_ids:
                txn_record = {
                    "txn_id": t_id,
                    "date": rec.get("date", datetime.now().strftime("%Y-%m-%d")),
                    "amount": float(rec.get("amount", 0)),
                    "payer_name": rec.get("payer_name", rec.get("description", "Unknown Payer")),
                    "type": rec.get("type", "credit"),
                    "category": rec.get("category") or None
                }
                
                if txn_record["category"] == "":
                    txn_record["category"] = None
                    
                existing_tx.append(txn_record)
                added_tx_count += 1
                
                if txn_record["type"] == "debit":
                    exp_record = {
                        "txn_id": t_id,
                        "date": txn_record["date"],
                        "amount": txn_record["amount"],
                        "category": txn_record["category"] or "other_expenses",
                        "description": rec.get("description", txn_record["payer_name"])
                    }
                    existing_exp.append(exp_record)
                    
        with open(tx_path, "w", encoding="utf-8") as f:
            json.dump(existing_tx, f, indent=2)
            
        with open(exp_path, "w", encoding="utf-8") as f:
            json.dump(existing_exp, f, indent=2)
            
        run_reconciliation()
        return {"status": "success", "message": f"Successfully parsed and saved {added_tx_count} new transactions. Reconciliation engine re-run completed."}
        
    else:
        raise HTTPException(status_code=400, detail="Unknown document format. Could not match with invoice or transaction schemas.")

@app.get("/api/sample/invoices")
def download_sample_invoices():
    """Download sample CSV file containing test invoice rows."""
    if os.path.exists("sample_invoices.csv"):
        return FileResponse("sample_invoices.csv", media_type="text/csv", filename="sample_invoices.csv")
    raise HTTPException(status_code=404, detail="sample_invoices.csv not found")

@app.get("/api/sample/transactions")
def download_sample_transactions():
    """Download sample CSV file containing test transaction records."""
    if os.path.exists("sample_transactions.csv"):
        return FileResponse("sample_transactions.csv", media_type="text/csv", filename="sample_transactions.csv")
    raise HTTPException(status_code=404, detail="sample_transactions.csv not found")

@app.post("/api/reset-database")
def reset_database():
    """Clear all invoice, transaction, and expense database files."""
    try:
        # Clear files with empty arrays
        with open("backend/data/invoices.json", "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        with open("backend/data/transactions.json", "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        with open("backend/data/expenses.json", "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        with open("backend/data/reconciliation_output.json", "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
            
        return {"status": "success", "message": "All local ledger databases cleared successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
