import json
import os
import random
from datetime import datetime, timedelta
from faker import Faker

def generate_seed_data():
    fake = Faker()
    Faker.seed(42)
    random.seed(42)

    # Set up directories
    os.makedirs("backend/data", exist_ok=True)

    # 1. Starting Cash Balance
    account = {
        "starting_balance": 50000.0,
        "currency": "USD",
        "account_number": "1234-5678-90",
        "bank_name": "Silicon Valley Trust"
    }
    with open("backend/data/account.json", "w") as f:
        json.dump(account, f, indent=2)

    # Date boundaries for the 3-month demo window (April, May, June 2026)
    start_date = datetime(2026, 4, 1)
    end_date = datetime(2026, 6, 30)

    clients = [
        "Acme Corp", "Alpha Tech", "Beta Services", "Delta Design",
        "Echo Consulting", "Foxtrot Labs", "Gamma Media"
    ]

    invoices = []
    transactions = []

    # --- INJECT EDGE CASES ---
    
    # Edge Case 1: Clean Exact Match
    # INV-001 (Acme Corp, $4,500)
    invoices.append({
        "invoice_id": "INV-001",
        "client_name": "Acme Corp",
        "amount": 4500.0,
        "issue_date": "2026-05-01",
        "due_date": "2026-05-31",
        "status": "unpaid"
    })
    # TXN-101 (Acme Corp, $4,500, exact match)
    transactions.append({
        "txn_id": "TXN-101",
        "date": "2026-05-15",
        "amount": 4500.0,
        "payer_name": "Acme Corp",
        "type": "credit",
        "category": None,
        "description": "Invoice INV-001 Payment"
    })

    # Edge Case 2: Fuzzy Name Mismatch
    # INV-002 (Alpha Tech, $2,500)
    invoices.append({
        "invoice_id": "INV-002",
        "client_name": "Alpha Tech",
        "amount": 2500.0,
        "issue_date": "2026-05-10",
        "due_date": "2026-06-10",
        "status": "unpaid"
    })
    # TXN-102 (ALPHA TECHNOLOGY LLC, $2,500, fuzzy match)
    transactions.append({
        "txn_id": "TXN-102",
        "date": "2026-05-12",
        "amount": 2500.0,
        "payer_name": "ALPHA TECHNOLOGY LLC",
        "type": "credit",
        "category": None,
        "description": "Direct deposit Alpha Tech"
    })

    # Edge Case 3: Partial Payment (to be flagged for review)
    # INV-003 (Beta Services, $5,000)
    invoices.append({
        "invoice_id": "INV-003",
        "client_name": "Beta Services",
        "amount": 5000.0,
        "issue_date": "2026-05-15",
        "due_date": "2026-06-15",
        "status": "unpaid"
    })
    # TXN-103 (Beta Services, $4,000, partial amount mismatch)
    transactions.append({
        "txn_id": "TXN-103",
        "date": "2026-05-20",
        "amount": 4000.0,
        "payer_name": "Beta Services",
        "type": "credit",
        "category": None,
        "description": "Partial payment INV-003"
    })

    # Edge Case 4: Anomalous Expense
    # TXN-205 (software_subscriptions category, $12,000, AWS bill)
    transactions.append({
        "txn_id": "TXN-205",
        "date": "2026-06-05",
        "amount": 12000.0,
        "payer_name": "Amazon Web Services",
        "type": "debit",
        "category": "software_subscriptions",
        "description": "AWS Cloud Hosting Annual"
    })

    # --- GENERATE SEED DATA ---
    
    # Generate Invoices (around 15 more, total ~18)
    invoice_seq = 4
    for i in range(15):
        client = random.choice(clients)
        amount = round(random.uniform(1000.0, 8000.0), 2)
        
        # issue date spread across April, May, June
        days_offset = random.randint(0, 85)
        issue_dt = start_date + timedelta(days=days_offset)
        due_dt = issue_dt + timedelta(days=30)
        
        invoices.append({
            "invoice_id": f"INV-{invoice_seq:03d}",
            "client_name": client,
            "amount": amount,
            "issue_date": issue_dt.strftime("%Y-%m-%d"),
            "due_date": due_dt.strftime("%Y-%m-%d"),
            "status": "unpaid"
        })
        invoice_seq += 1

    # Generate Transactions (around 25 more, total ~30)
    txn_seq = 104
    debit_categories = ["software_subscriptions", "office_rent", "marketing", "contractors", "utilities", "travel"]
    
    # Ingest credits (some paying the invoices, some random client deposits)
    # We want some invoices to be fully paid (exact matches we can reconcile)
    # Let's create transactions for about half the random invoices
    for inv in invoices[3:]: # skip edge cases
        # Decide if this invoice got paid
        if random.random() < 0.6:
            # Create a matching transaction
            pay_days_after = random.randint(2, 25)
            issue_dt = datetime.strptime(inv["issue_date"], "%Y-%m-%d")
            pay_dt = issue_dt + timedelta(days=pay_days_after)
            
            # Payer name could be exact or slightly different
            payer_name = inv["client_name"]
            if random.random() < 0.2:
                # Add Inc/LLC suffix for mild variation
                payer_name += " Inc."
                
            transactions.append({
                "txn_id": f"TXN-{txn_seq}",
                "date": pay_dt.strftime("%Y-%m-%d"),
                "amount": inv["amount"],
                "payer_name": payer_name,
                "type": "credit",
                "category": None,
                "description": f"Payment for {inv['invoice_id']}"
            })
            txn_seq += 1

    # Ingest multiple normal software subscription expenses to reduce standard deviation impact
    normal_softwares = [
        ("GitHub", 19.00), ("Slack", 49.00), ("Zoom", 14.99), ("Figma", 15.00),
        ("Gmail Suite", 12.00), ("Vercel Pro", 20.00), ("OpenAI API", 30.00),
        ("Sentry", 29.00), ("Mailchimp", 50.00), ("Adobe CC", 54.99)
    ]
    for name, price in normal_softwares:
        # spread over April, May, June
        for month in [4, 5, 6]:
            day = random.randint(1, 28)
            txn_dt = datetime(2026, month, day)
            transactions.append({
                "txn_id": f"TXN-{txn_seq}",
                "date": txn_dt.strftime("%Y-%m-%d"),
                "amount": price,
                "payer_name": name,
                "type": "debit",
                "category": "software_subscriptions",
                "description": f"{name} Monthly Charge"
            })
            txn_seq += 1

    # Generate random expense transactions (debits) spread over 3 months for OTHER categories
    other_categories = ["office_rent", "marketing", "contractors", "utilities", "travel"]
    for i in range(18):
        days_offset = random.randint(0, 90)
        txn_dt = start_date + timedelta(days=days_offset)
        category = random.choice(other_categories)
        
        if category == "office_rent":
            amount = 1500.00
            desc = "WeWork Shared Office Room"
        elif category == "marketing":
            amount = round(random.uniform(200.0, 800.0), 2)
            desc = "Google Ads Campaign"
        elif category == "contractors":
            amount = round(random.uniform(500.0, 2500.0), 2)
            desc = "Freelance Design Contractor"
        elif category == "utilities":
            amount = round(random.uniform(50.0, 150.0), 2)
            desc = "Electric and Internet Bill"
        else: # travel
            amount = round(random.uniform(100.0, 400.0), 2)
            desc = "Client Dinner / Uber Expenses"

        transactions.append({
            "txn_id": f"TXN-{txn_seq}",
            "date": txn_dt.strftime("%Y-%m-%d"),
            "amount": amount,
            "payer_name": desc,
            "type": "debit",
            "category": category,
            "description": desc
        })
        txn_seq += 1

    # Extract expenses (type == debit) to write to expenses.json
    expenses = []
    for txn in transactions:
        if txn["type"] == "debit":
            expenses.append({
                "txn_id": txn["txn_id"],
                "date": txn["date"],
                "amount": txn["amount"],
                "category": txn["category"],
                "description": txn["description"]
            })

    # Save to JSON files
    with open("backend/data/invoices.json", "w") as f:
        json.dump(invoices, f, indent=2)

    with open("backend/data/transactions.json", "w") as f:
        json.dump(transactions, f, indent=2)

    with open("backend/data/expenses.json", "w") as f:
        json.dump(expenses, f, indent=2)

    print(f"Generated {len(invoices)} invoices, {len(transactions)} transactions, and {len(expenses)} expenses.")

if __name__ == "__main__":
    generate_seed_data()
