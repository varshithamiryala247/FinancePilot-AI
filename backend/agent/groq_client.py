import os
import json
import re
from groq import Groq
from backend.agent.system_prompt import SYSTEM_PROMPT
from backend.agent.tools import TOOLS_SCHEMA, TOOLS_MAP

# Load environment variables manually from .env if present
if os.path.exists(".env"):
    try:
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                stripped = line.strip()
                if stripped and not stripped.startswith("#") and "=" in stripped:
                    key, val = stripped.split("=", 1)
                    os.environ[key.strip()] = val.strip()
    except Exception as e:
        print(f"Warning: Could not load .env file ({e})")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

def get_groq_client():
    if GROQ_API_KEY:
        try:
            return Groq(api_key=GROQ_API_KEY)
        except Exception:
            return None
    return None

def chat_with_agent(prompt: str):
    """
    Main interface to execute the LLM agent using Groq.
    Throws ValueError if GROQ_API_KEY is not configured.
    """
    if not GROQ_API_KEY:
        raise ValueError("Groq API Key not found. Please set your GROQ_API_KEY in the root .env file.")

    client = get_groq_client()
    if not client:
        raise ValueError("Failed to initialize Groq client. Please check your GROQ_API_KEY.")

    # Groq Llama 3.3 70B implementation with tool calling
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ]
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        tools=TOOLS_SCHEMA,
        tool_choice="auto",
        temperature=0.0
    )
    
    response_message = response.choices[0].message
    tool_calls = response_message.tool_calls
    
    tools_called = []
    reasoning_steps = []
    citations = []
    
    if tool_calls:
        # Add assistant message to trace
        messages.append(response_message)
        
        # Execute tool calls
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            try:
                function_args = json.loads(tool_call.function.arguments) if tool_call.function.arguments else {}
            except Exception:
                function_args = {}
            
            if not isinstance(function_args, dict):
                function_args = {}
            
            tools_called.append(function_name)
            reasoning_steps.append(f"Calling tool: {function_name}({json.dumps(function_args)})")
            
            func = TOOLS_MAP[function_name]
            tool_output = func(**function_args)
            
            # Capture source citations
            if isinstance(tool_output, list):
                for item in tool_output:
                    if "invoice_ids" in item:
                        citations.extend(item["invoice_ids"])
                    if "txn_id" in item:
                        citations.append(item["txn_id"])
            elif isinstance(tool_output, dict):
                citations.extend(tool_output.get("source_txn_ids", []))
                citations.extend(tool_output.get("source_invoice_ids", []))
            
            messages.append({
                "tool_call_id": tool_call.id,
                "role": "tool",
                "name": function_name,
                "content": json.dumps(tool_output),
            })
            
        # Call Groq again with tool results
        second_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.0
        )
        final_content = second_response.choices[0].message.content
    else:
        final_content = response_message.content

    # Clean citations
    citations = list(set([c for c in citations if c]))
    
    # Parse reasoning trace from the LLM output if present
    reasoning_match = re.search(r"<reasoning>(.*?)</reasoning>", final_content, re.DOTALL)
    reasoning = reasoning_match.group(1).strip() if reasoning_match else "\n".join(reasoning_steps)
    
    return {
        "answer": final_content,
        "tools_called": tools_called,
        "reasoning": reasoning if reasoning else "Processed query directly.",
        "citations": citations
    }
