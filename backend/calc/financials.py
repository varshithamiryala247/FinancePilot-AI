import json
import os
from datetime import datetime

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def get_financial_summary(period="3m"):
    """
    Computes revenue, expenses, and profit grouped by month.
    Also returns the source transaction IDs for traceability.
    """
    transactions = load_json("backend/data/transactions.json")
    
    # Group by month (YYYY-MM)
    monthly_data = {}
    
    for txn in transactions:
        txn_date = datetime.strptime(txn["date"], "%Y-%m-%d")
        month_key = txn_date.strftime("%Y-%m")
        
        if month_key not in monthly_data:
            monthly_data[month_key] = {
                "revenue": 0.0,
                "expenses": 0.0,
                "profit": 0.0,
                "credits_source_ids": [],
                "debits_source_ids": []
            }
            
        amount = txn["amount"]
        txn_id = txn["txn_id"]
        
        if txn["type"] == "credit":
            monthly_data[month_key]["revenue"] += amount
            monthly_data[month_key]["credits_source_ids"].append(txn_id)
        else: # debit / expense
            monthly_data[month_key]["expenses"] += amount
            monthly_data[month_key]["debits_source_ids"].append(txn_id)

    # Calculate profit for each month
    for month_key in monthly_data:
        data = monthly_data[month_key]
        data["profit"] = round(data["revenue"] - data["expenses"], 2)
        data["revenue"] = round(data["revenue"], 2)
        data["expenses"] = round(data["expenses"], 2)

    # Sort months chronologically
    sorted_months = sorted(monthly_data.keys())
    
    result = []
    for m in sorted_months:
        result.append({
            "month": m,
            "revenue": monthly_data[m]["revenue"],
            "expenses": monthly_data[m]["expenses"],
            "profit": monthly_data[m]["profit"],
            "source_txn_ids": monthly_data[m]["credits_source_ids"] + monthly_data[m]["debits_source_ids"]
        })
        
    return result

def get_outstanding_balances(limit=5):
    """
    Computes the outstanding balance per client (top debtors).
    An invoice is outstanding if its status is not 'matched'.
    Calculates days overdue relative to the anchor date 2026-07-01.
    """
    invoices = load_json("backend/data/invoices.json")
    anchor_date = datetime(2026, 7, 1)
    
    client_balances = {}
    
    for inv in invoices:
        if inv["status"] == "matched":
            continue
            
        client = inv["client_name"]
        amount = inv["amount"]
        invoice_id = inv["invoice_id"]
        due_date = datetime.strptime(inv["due_date"], "%Y-%m-%d")
        
        # Calculate days overdue
        if due_date < anchor_date:
            days_overdue = (anchor_date - due_date).days
        else:
            days_overdue = 0
            
        if client not in client_balances:
            client_balances[client] = {
                "client_name": client,
                "amount_owed": 0.0,
                "invoice_ids": [],
                "max_days_overdue": 0
            }
            
        client_balances[client]["amount_owed"] += amount
        client_balances[client]["invoice_ids"].append(invoice_id)
        client_balances[client]["max_days_overdue"] = max(client_balances[client]["max_days_overdue"], days_overdue)

    # Round balances and sort by amount owed descending
    sorted_debtors = []
    for client in client_balances:
        data = client_balances[client]
        sorted_debtors.append({
            "client_name": data["client_name"],
            "amount_owed": round(data["amount_owed"], 2),
            "invoice_ids": data["invoice_ids"],
            "days_overdue": data["max_days_overdue"]
        })
        
    sorted_debtors.sort(key=lambda x: x["amount_owed"], reverse=True)
    return sorted_debtors[:limit]

if __name__ == "__main__":
    print("Financial Summary:")
    print(json.dumps(get_financial_summary(), indent=2))
    print("\nTop Debtors:")
    print(json.dumps(get_outstanding_balances(), indent=2))
