import json
import os

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def save_json(data, filepath):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

def get_flagged_matches():
    """Retrieve all invoices that are in needs_review status, with details of candidates."""
    reconciliations = load_json("backend/data/reconciliation_output.json")
    invoices = load_json("backend/data/invoices.json")
    
    # Map invoice details for easy lookup
    invoice_map = {inv["invoice_id"]: inv for inv in invoices}
    
    flagged = []
    for rec in reconciliations:
        if rec["status"] == "needs_review":
            inv_id = rec["invoice_id"]
            if inv_id in invoice_map:
                flagged.append({
                    "invoice": invoice_map[inv_id],
                    "candidates": rec.get("candidates", [])
                })
    return flagged

def confirm_manual_match(invoice_id, txn_id):
    """
    Manually match an invoice to a transaction.
    Updates invoices.json and reconciliation_output.json.
    """
    invoices = load_json("backend/data/invoices.json")
    reconciliations = load_json("backend/data/reconciliation_output.json")
    transactions = load_json("backend/data/transactions.json")
    
    # 1. Update invoice status to matched
    invoice_updated = False
    for inv in invoices:
        if inv["invoice_id"] == invoice_id:
            inv["status"] = "matched"
            invoice_updated = True
            break
            
    # 2. Update reconciliation entry
    rec_updated = False
    for rec in reconciliations:
        if rec["invoice_id"] == invoice_id:
            rec["matched_txn_id"] = txn_id
            rec["match_type"] = "manual"
            rec["confidence_score"] = 1.0
            rec["status"] = "matched"
            if "candidates" in rec:
                del rec["candidates"]
            rec_updated = True
            break
            
    # 3. Add custom description to transaction if it exists
    # Find client name for the transaction payer
    client_name = ""
    for inv in invoices:
        if inv["invoice_id"] == invoice_id:
            client_name = inv["client_name"]
            break
            
    for txn in transactions:
        if txn["txn_id"] == txn_id:
            txn["description"] = f"Reconciled manually with invoice {invoice_id} ({client_name})"
            break

    if invoice_updated and rec_updated:
        save_json(invoices, "backend/data/invoices.json")
        save_json(reconciliations, "backend/data/reconciliation_output.json")
        save_json(transactions, "backend/data/transactions.json")
        return {"success": True, "message": f"Invoice {invoice_id} successfully matched to Transaction {txn_id}."}
    else:
        return {"success": False, "message": f"Could not find invoice {invoice_id} in data stores."}

def reject_manual_candidate(invoice_id, txn_id):
    """
    Reject a candidate transaction for a flagged invoice.
    Removes the candidate. If no candidates left, status becomes unpaid.
    """
    invoices = load_json("backend/data/invoices.json")
    reconciliations = load_json("backend/data/reconciliation_output.json")
    
    updated = False
    message = ""
    
    for rec in reconciliations:
        if rec["invoice_id"] == invoice_id:
            if "candidates" in rec:
                # Filter out the rejected candidate
                before_count = len(rec["candidates"])
                rec["candidates"] = [c for c in rec["candidates"] if c["txn_id"] != txn_id]
                after_count = len(rec["candidates"])
                
                if before_count != after_count:
                    updated = True
                    # If no candidates left, revert status to unpaid
                    if len(rec["candidates"]) == 0:
                        rec["status"] = "unpaid"
                        rec["reason"] = "All candidates rejected during manual review."
                        # Also update invoice status
                        for inv in invoices:
                            if inv["invoice_id"] == invoice_id:
                                inv["status"] = "unpaid"
                                break
                        message = f"Candidate {txn_id} rejected. No candidates left, invoice marked unpaid."
                    else:
                        message = f"Candidate {txn_id} rejected. {len(rec['candidates'])} candidates remaining."
                    break

    if updated:
        save_json(invoices, "backend/data/invoices.json")
        save_json(reconciliations, "backend/data/reconciliation_output.json")
        return {"success": True, "message": message}
    else:
        return {"success": False, "message": f"Could not find candidate {txn_id} for invoice {invoice_id}."}
