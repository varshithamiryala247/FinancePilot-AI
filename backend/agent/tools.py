import json
import os
from backend.calc.financials import get_financial_summary, get_outstanding_balances
from backend.calc.aging import get_aging_report as calc_aging_report
from backend.calc.runway import get_cash_runway as calc_cash_runway
from backend.calc.anomalies import get_anomalies as calc_anomalies
from backend.reconciliation.review_flagging import get_flagged_matches

def get_revenue_expenses_profit(period: str = "3m") -> dict:
    """
    Retrieves the total revenue, expenses, and profit grouped by month.
    
    Args:
        period: Time period filter (e.g., '3m' for 3 months). Default is '3m'.
        
    Returns:
        A dictionary containing lists of monthly summaries and source transaction IDs.
    """
    try:
        data = get_financial_summary(period)
        # Gather all source transaction IDs across all months
        all_txn_ids = []
        for month_data in data:
            all_txn_ids.extend(month_data.get("source_txn_ids", []))
            
        return {
            "summary": data,
            "source_txn_ids": list(set(all_txn_ids)),
            "status": "success"
        }
    except Exception as e:
        return {"status": "error", "message": str(e), "source_txn_ids": []}

def get_top_debtors(limit: int = 5) -> list[dict]:
    """
    Retrieves a list of clients who owe the most money (outstanding unpaid balances).
    
    Args:
        limit: Max number of debtors to return. Default is 5.
        
    Returns:
        A list of dictionaries with client_name, amount_owed, invoice_ids, and days_overdue.
    """
    try:
        debtors = get_outstanding_balances(limit)
        return debtors
    except Exception as e:
        return []

def get_aging_report() -> dict:
    """
    Retrieves the aging of receivables report, grouping outstanding amounts in buckets:
    - 0-30 days overdue
    - 30-60 days overdue
    - 60+ days overdue
    
    Returns:
        A dictionary representation of aging buckets, including details of outstanding invoices.
    """
    try:
        report = calc_aging_report()
        # Extract invoice IDs as source references
        source_inv_ids = []
        for bucket in ["0-30", "30-60", "60+"]:
            for inv in report.get(bucket, []):
                source_inv_ids.append(inv["invoice_id"])
                
        report["source_invoice_ids"] = source_inv_ids
        return report
    except Exception as e:
        return {"error": str(e), "source_invoice_ids": []}

def get_cash_runway() -> dict:
    """
    Retrieves cash runway metrics: current cash balance, average monthly burn, and remaining runway in months.
    
    Returns:
        A dictionary with current_cash, avg_monthly_burn, runway_months, and source_txn_ids.
    """
    try:
        runway_info = calc_cash_runway()
        return runway_info
    except Exception as e:
        return {"error": str(e), "source_txn_ids": []}

def get_anomalies() -> list[dict]:
    """
    Retrieves any flagged transaction anomalies in expenses (where type is debit and z-score > 2.0).
    
    Returns:
        A list of transaction anomalies, including transaction details, z-scores, and reasons.
    """
    try:
        anomalies = calc_anomalies()
        return anomalies
    except Exception as e:
        return []

def get_needs_review_matches() -> list[dict]:
    """
    Retrieves invoices that are flagged as 'needs review' for reconciliation,
    along with their top candidate transactions.
    
    Returns:
        A list of dictionaries representing invoices needing manual review.
    """
    try:
        flagged = get_flagged_matches()
        # Extract invoice and candidate txn IDs for citations
        source_invoice_ids = []
        source_txn_ids = []
        formatted_list = []
        
        for item in flagged:
            inv = item["invoice"]
            candidates = item["candidates"]
            inv_id = inv["invoice_id"]
            source_invoice_ids.append(inv_id)
            
            cand_txn_ids = [c["txn_id"] for c in candidates]
            source_txn_ids.extend(cand_txn_ids)
            
            formatted_list.append({
                "invoice_id": inv_id,
                "client_name": inv["client_name"],
                "amount": inv["amount"],
                "issue_date": inv["issue_date"],
                "due_date": inv["due_date"],
                "candidates": candidates,
                "reason": f"{len(candidates)} matching candidate transaction(s) found but with parameter variance."
            })
            
        return {
            "needs_review": formatted_list,
            "source_invoice_ids": source_invoice_ids,
            "source_txn_ids": source_txn_ids
        }
    except Exception as e:
        return {"needs_review": [], "source_invoice_ids": [], "source_txn_ids": []}

# Schema definitions for Groq function calling
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "get_revenue_expenses_profit",
            "description": "Retrieves the total revenue, expenses, and profit grouped by month. Essential for answering questions about monthly performance, trends, and profit margins.",
            "parameters": {
                "type": "object",
                "properties": {
                    "period": {
                        "type": "string",
                        "description": "Period to group data (e.g. '3m' for last 3 months).",
                        "default": "3m"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_top_debtors",
            "description": "Retrieves a list of clients who owe the most money (outstanding unpaid balances). Essential for answering who owes us money and who is overdue.",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Max number of debtors to return.",
                        "default": 5
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_aging_report",
            "description": "Retrieves the aging of receivables report, grouping outstanding amounts in buckets: 0-30, 30-60, and 60+ days overdue. Helps analyze client payment delays.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_cash_runway",
            "description": "Retrieves cash runway metrics: current cash balance, average monthly burn, and remaining runway in months. Used to answer if we can afford new hires or how long we can survive on current cash.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_anomalies",
            "description": "Retrieves any flagged transaction anomalies in expenses (where type is debit and z-score > 2.0). Essential for finding suspicious or unusually large expenses.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_needs_review_matches",
            "description": "Retrieves invoices that are flagged as 'needs review' for reconciliation. Crucial for identifying pending reconciliation items that require manual review.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    }
]

# Mapper to execute tools by name
TOOLS_MAP = {
    "get_revenue_expenses_profit": get_revenue_expenses_profit,
    "get_top_debtors": get_top_debtors,
    "get_aging_report": get_aging_report,
    "get_cash_runway": get_cash_runway,
    "get_anomalies": get_anomalies,
    "get_needs_review_matches": get_needs_review_matches
}
