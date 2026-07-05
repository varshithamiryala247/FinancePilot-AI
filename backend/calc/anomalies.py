import json
import os
import math

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def get_anomalies():
    """
    Groups expenses by category, calculates the mean and standard deviation of expense amounts,
    and identifies transactions with a z-score > 2.0.
    """
    expenses = load_json("backend/data/expenses.json")
    
    # Group by category
    by_category = {}
    for exp in expenses:
        cat = exp["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(exp)
        
    anomalies = []
    
    for cat, items in by_category.items():
        if len(items) < 2:
            # Not enough data points to compute standard deviation.
            # But we check if the single item is unusually large (e.g., > $5,000)
            for item in items:
                if item["amount"] > 5000.0:
                    description = item.get("description", "")
                    anomalies.append({
                        "txn_id": item["txn_id"],
                        "date": item["date"],
                        "category": cat,
                        "amount": item["amount"],
                        "mean": item["amount"],
                        "std_dev": 0.0,
                        "z_score": 3.0, # artificial high z-score
                        "description": description,
                        "reason": f"Insufficient category history, but transaction for '{description}' (${item['amount']:.2f}) is extremely high for category '{cat}'."
                    })
            continue
            
        amounts = [item["amount"] for item in items]
        mean = sum(amounts) / len(amounts)
        
        # Calculate standard deviation
        variance = sum((x - mean) ** 2 for x in amounts) / (len(amounts) - 1)
        std_dev = math.sqrt(variance)
        
        for item in items:
            amount = item["amount"]
            if std_dev > 0:
                z_score = (amount - mean) / std_dev
            else:
                z_score = 0.0
                
            # We look for unusually high debits (z_score > 2)
            if z_score > 2.0:
                description = item.get("description", "")
                anomalies.append({
                    "txn_id": item["txn_id"],
                    "date": item["date"],
                    "category": cat,
                    "amount": amount,
                    "mean": round(mean, 2),
                    "std_dev": round(std_dev, 2),
                    "z_score": round(z_score, 2),
                    "description": description,
                    "reason": f"Transaction for '{description}' (${amount:.2f}) is significantly higher than the category average of ${mean:.2f} (z-score: {z_score:.2f})."
                })
                
    return anomalies

if __name__ == "__main__":
    print(json.dumps(get_anomalies(), indent=2))
