import json
import os
from datetime import datetime
from rapidfuzz import fuzz

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def save_json(data, filepath):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

def run_reconciliation():
    invoices = load_json("backend/data/invoices.json")
    transactions = load_json("backend/data/transactions.json")

    reconciliation_results = []
    
    # Keep track of transactions that have been matched so they aren't double matched
    matched_txn_ids = set()

    # Step 1 & 2: Match each invoice
    for inv in invoices:
        inv_id = inv["invoice_id"]
        client_name = inv["client_name"].strip()
        amount = inv["amount"]
        issue_date = datetime.strptime(inv["issue_date"], "%Y-%m-%d")
        due_date = datetime.strptime(inv["due_date"], "%Y-%m-%d")

        exact_match = None
        fuzzy_matches = []
        needs_review_candidates = []

        # Find candidate transactions (credits that occur within a date window)
        # Date window: transaction date must be after (issue_date - 3 days) and before (due_date + 45 days)
        for txn in transactions:
            if txn["type"] != "credit":
                continue
            
            txn_id = txn["txn_id"]
            if txn_id in matched_txn_ids:
                continue

            txn_date = datetime.strptime(txn["date"], "%Y-%m-%d")
            
            # Check date window
            if not (issue_date - timedelta_days(3) <= txn_date <= due_date + timedelta_days(45)):
                continue

            txn_amount = txn["amount"]
            payer_name = txn["payer_name"].strip()

            # Exact match check
            name_exact = client_name.lower() == payer_name.lower()
            amount_exact = abs(amount - txn_amount) < 0.01

            if name_exact and amount_exact:
                exact_match = txn
                break

            # Calculate similarity scores
            name_sim = fuzz.token_sort_ratio(client_name.lower(), payer_name.lower()) / 100.0
            amount_diff_pct = abs(amount - txn_amount) / amount if amount > 0 else 1.0

            # Fuzzy match criteria: exact amount and name similarity >= 80%
            if amount_exact and name_sim >= 0.8:
                fuzzy_matches.append((txn, name_sim))
            
            # Review criteria:
            # - Exact amount, name similarity between 40% and 80% (potential typo)
            # - Name similarity >= 75%, but amount mismatch (partial payment)
            # - Amount matches within 5% tolerance, and name similarity >= 60%
            elif amount_exact and 0.4 <= name_sim < 0.8:
                needs_review_candidates.append({
                    "txn": txn,
                    "score": name_sim,
                    "reason": f"Payer name '{payer_name}' is {int(name_sim*100)}% similar to '{client_name}'"
                })
            elif name_sim >= 0.75 and amount_diff_pct > 0.01:
                needs_review_candidates.append({
                    "txn": txn,
                    "score": name_sim,
                    "reason": f"Amount mismatch (Invoiced: ${amount:.2f}, Paid: ${txn_amount:.2f})"
                })
            elif amount_diff_pct <= 0.05 and name_sim >= 0.60:
                needs_review_candidates.append({
                    "txn": txn,
                    "score": (name_sim + (1.0 - amount_diff_pct)) / 2.0,
                    "reason": f"Amount is within 5% tolerance (${txn_amount:.2f} vs ${amount:.2f}) and name similarity is {int(name_sim*100)}%"
                })

        # Process matches
        if exact_match:
            txn_id = exact_match["txn_id"]
            matched_txn_ids.add(txn_id)
            reconciliation_results.append({
                "invoice_id": inv_id,
                "matched_txn_id": txn_id,
                "match_type": "exact",
                "confidence_score": 1.0,
                "status": "matched",
                "reason": "Exact match (amount, date window, payer name)"
            })
            inv["status"] = "matched"
        elif fuzzy_matches:
            # Pick best fuzzy match
            fuzzy_matches.sort(key=lambda x: x[1], reverse=True)
            best_txn, score = fuzzy_matches[0]
            txn_id = best_txn["txn_id"]
            matched_txn_ids.add(txn_id)
            reconciliation_results.append({
                "invoice_id": inv_id,
                "matched_txn_id": txn_id,
                "match_type": "fuzzy",
                "confidence_score": round(score, 2),
                "status": "matched",
                "reason": f"Fuzzy match on client name ({int(score*100)}% similarity)"
            })
            inv["status"] = "matched"
        elif needs_review_candidates:
            # Sort review candidates by score
            needs_review_candidates.sort(key=lambda x: x["score"], reverse=True)
            top_candidates = needs_review_candidates[:2]
            
            # Format top candidates for reconciliation output
            candidates_formatted = []
            for c in top_candidates:
                candidates_formatted.append({
                    "txn_id": c["txn"]["txn_id"],
                    "payer_name": c["txn"]["payer_name"],
                    "amount": c["txn"]["amount"],
                    "date": c["txn"]["date"],
                    "score": round(c["score"], 2),
                    "reason": c["reason"]
                })

            reconciliation_results.append({
                "invoice_id": inv_id,
                "matched_txn_id": None,
                "match_type": None,
                "confidence_score": None,
                "status": "needs_review",
                "candidates": candidates_formatted
            })
            inv["status"] = "needs_review"
        else:
            reconciliation_results.append({
                "invoice_id": inv_id,
                "matched_txn_id": None,
                "match_type": None,
                "confidence_score": 0.0,
                "status": "unpaid",
                "reason": "No matching credit transactions found in window"
            })
            inv["status"] = "unpaid"

    # Save outputs
    save_json(reconciliation_results, "backend/data/reconciliation_output.json")
    
    # Save back updated invoices to keep status in sync
    save_json(invoices, "backend/data/invoices.json")
    print(f"Reconciliation run finished. Saved results for {len(reconciliation_results)} invoices.")

def timedelta_days(days):
    from datetime import timedelta
    return timedelta(days=days)

if __name__ == "__main__":
    run_reconciliation()
