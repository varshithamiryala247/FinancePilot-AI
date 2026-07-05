import json
import os
from datetime import datetime

def load_json(filepath):
    if not os.path.exists(filepath):
        return {}
    with open(filepath, "r") as f:
        return json.load(f)

def get_cash_runway(anchor_date_str="2026-07-01"):
    """
    Computes cash runway based on:
    - current_cash = starting_balance + sum(credits) - sum(debits)
    - avg_monthly_burn = average debits over the last 3 months (April, May, June 2026)
    - runway = current_cash / avg_monthly_burn
    """
    account = load_json("backend/data/account.json")
    transactions = load_json("backend/data/transactions.json")
    
    starting_balance = account.get("starting_balance", 0.0)
    
    current_cash = starting_balance
    total_credits = 0.0
    total_debits = 0.0
    
    # We want to identify monthly burn for the last 3 months (April, May, June 2026)
    burn_by_month = {"2026-04": 0.0, "2026-05": 0.0, "2026-06": 0.0}
    source_txn_ids = []
    
    for txn in transactions:
        amount = txn["amount"]
        txn_id = txn["txn_id"]
        source_txn_ids.append(txn_id)
        
        txn_date = datetime.strptime(txn["date"], "%Y-%m-%d")
        month_key = txn_date.strftime("%Y-%m")
        
        if txn["type"] == "credit":
            current_cash += amount
            total_credits += amount
        else: # debit
            current_cash -= amount
            total_debits += amount
            if month_key in burn_by_month:
                burn_by_month[month_key] += amount

    # Avg monthly burn (last 3 months)
    # If a month has no data, it defaults to 0. We sum the burn and divide by 3.
    avg_monthly_burn = sum(burn_by_month.values()) / 3.0
    
    # Avoid division by zero
    if avg_monthly_burn > 0:
        runway_months = current_cash / avg_monthly_burn
    else:
        runway_months = float('inf')
        
    return {
        "starting_balance": round(starting_balance, 2),
        "total_credits": round(total_credits, 2),
        "total_debits": round(total_debits, 2),
        "current_cash": round(current_cash, 2),
        "avg_monthly_burn": round(avg_monthly_burn, 2),
        "runway_months": round(runway_months, 2) if runway_months != float('inf') else 999.0,
        "source_txn_ids": source_txn_ids
    }

if __name__ == "__main__":
    print(json.dumps(get_cash_runway(), indent=2))
