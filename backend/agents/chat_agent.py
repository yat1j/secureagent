from groq import Groq
import os, json

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def run_chat(report: dict, question: str) -> str:
    """
    Agent 5: Stateless chat. Gets full report + user question,
    answers as a security expert who analysed this codebase.
    """
    system = """You are a security expert who just analysed this codebase.
Answer the developer's question using only the findings in this report.
Be specific, reference file names and line numbers. Keep answers under 150 words."""

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"Report: {json.dumps(report)}\n\nQuestion: {question}"}
        ],
        max_tokens=300
    )
    return response.choices[0].message.content
