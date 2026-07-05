import json
import os
import sys

# Set output encoding to UTF-8 to avoid encoding errors when printing to console
sys.stdout.reconfigure(encoding='utf-8')

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.agent.groq_client import chat_with_agent

def run_evaluation():
    eval_file = "eval/test_questions.json"
    if not os.path.exists(eval_file):
        print(f"Error: {eval_file} not found.")
        sys.exit(1)
        
    with open(eval_file, "r") as f:
        questions = json.load(f)
        
    print("=" * 80)
    print(" FinancePilot AI — Evaluation Suite ")
    print("=" * 80)
    
    passed_count = 0
    
    for idx, q in enumerate(questions):
        print(f"\n[{idx+1}/{len(questions)}] Running: \"{q['question']}\"")
        
        # Run agent query
        res = chat_with_agent(q["question"])
        
        tools_called = res.get("tools_called", [])
        answer = res.get("answer", "")
        
        # Check tools
        expected_tools = q.get("expected_tools", [])
        tools_ok = all(t in tools_called for t in expected_tools)
        
        # Check keywords
        expected_terms = q.get("expected_terms", [])
        terms_ok = all(term.lower() in answer.lower() for term in expected_terms)
        
        passed = tools_ok and terms_ok
        status_str = "✅ PASSED" if passed else "❌ FAILED"
        
        if passed:
            passed_count += 1
            
        print(f"   Tools Expected: {expected_tools}")
        print(f"   Tools Called:   {tools_called} ({'OK' if tools_ok else 'MISSING'})")
        print(f"   Terms Expected: {expected_terms} ({'OK' if terms_ok else 'MISSING'})")
        print(f"   Status:         {status_str}")
        
    print("\n" + "=" * 80)
    print(f" Final Score: {passed_count}/{len(questions)} ({round(passed_count / len(questions) * 100, 2)}% Pass Rate)")
    print("=" * 80)
    
    if passed_count == len(questions):
        print("🎉 10/10 correct against ground truth! Standard-compliant AI.")
    else:
        print("⚠️ Some tests failed. Please check details.")
    print("=" * 80)

if __name__ == "__main__":
    run_evaluation()
