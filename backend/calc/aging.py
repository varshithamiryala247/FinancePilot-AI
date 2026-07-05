import json
import os
from datetime import datetime

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def get_aging_report(anchor_date_str="2026-07-01"):
    """
    Categorizes unpaid/partially paid invoices into aging buckets:
    - 0-30 days overdue
    - 30-60 days overdue
    - 60+ days overdue
    """
    invoices = load_json("backend/data/invoices.json")
    anchor_date = datetime.strptime(anchor_date_str, "%Y-%m-%d")
    
    report = {
        "0-30": [],
        "30-60": [],
        "60+": [],
        "summary": {
            "total_outstanding": 0.0,
            "0-30_total": 0.0,
            "30-60_total": 0.0,
            "60+_total": 0.0
        }
    }
    
    for inv in invoices:
        if inv["status"] == "matched":
            continue
            
        due_date = datetime.strptime(inv["due_date"], "%Y-%m-%d")
        amount = inv["amount"]
        
        # Calculate days overdue
        if due_date >= anchor_date:
            # Not overdue yet, or due today. We put it in 0-30 for reporting outstanding,
            # or we can treat it as current. Let's group it into 0-30 days.
            days_overdue = 0
        else:
            days_overdue = (anchor_date - due_date).days
            
        inv_summary = {
            "invoice_id": inv["invoice_id"],
            "client_name": inv["client_name"],
            "amount": amount,
            "due_date": inv["due_date"],
            "days_overdue": days_overdue
        }
        
        report["summary"]["total_outstanding"] += amount
        
        if days_overdue <= 30:
            report["0-30"].append(inv_summary)
            report["summary"]["0-30_total"] += amount
        elif 30 < days_overdue <= 60:
            report["30-60"].append(inv_summary)
            report["summary"]["30-60_total"] += amount
        else:
            report["60+"].append(inv_summary)
            report["summary"]["60+_total"] += amount
            
    # Round totals
    report["summary"]["total_outstanding"] = round(report["summary"]["total_outstanding"], 2)
    report["summary"]["0-30_total"] = round(report["summary"]["0-30_total"], 2)
    report["summary"]["30-60_total"] = round(report["summary"]["30-60_total"], 2)
    report["summary"]["60+_total"] = round(report["summary"]["60+_total"], 2)
    
    return report

if __name__ == "__main__":
    print(json.dumps(get_aging_report(), indent=2))
