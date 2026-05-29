from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv
import os, json

load_dotenv()

llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

analyst = Agent(
    role="Senior Security Analyst",
    goal="Explain vulnerabilities in plain English and classify them",
    backstory="You are a security expert who makes complex issues simple.",
    llm=llm, verbose=False
)

fixer = Agent(
    role="Security Fix Engineer",
    goal="Write secure replacement code and PoC test payloads",
    backstory="You write clean, minimal fixes that solve exactly the issue.",
    llm=llm, verbose=False
)

mapper = Agent(
    role="Threat Intelligence Analyst",
    goal="Map how vulnerabilities chain into attack paths",
    backstory="You think like an attacker and connect the dots.",
    llm=llm, verbose=False
)

reporter = Agent(
    role="Security Report Writer",
    goal="Write executive summaries and prioritised fix queues",
    backstory="You translate technical findings into business language.",
    llm=llm, verbose=False
)

AGENT_ORDER = ["analyst", "fixer", "mapper", "reporter"]


def run_pipeline(semgrep_findings, code_files, on_agent_done=None):
    findings_str = json.dumps(semgrep_findings)
    agents_done: list[str] = []

    def task_callback(_output):
        idx = len(agents_done)
        if idx < len(AGENT_ORDER):
            agents_done.append(AGENT_ORDER[idx])
            if on_agent_done:
                on_agent_done(list(agents_done))

    task1 = Task(
        description=f"Analyse these findings: {findings_str}. For each: explain in 2 plain sentences, classify OWASP, score severity 1-10, write business impact in 1 sentence. Return JSON array.",
        agent=analyst,
        expected_output="JSON array of analysed vulnerabilities"
    )

    task2 = Task(
        description="For each vulnerability from task1: write the fixed code (changes only), write a safe PoC test payload, estimate fix time in minutes. Return JSON.",
        agent=fixer,
        expected_output="JSON with fixed_code, poc_payload, fix_minutes per vuln"
    )

    task3 = Task(
        description="Given all vulnerabilities, identify how an attacker chains them. Return JSON: {nodes:[{id,file,vuln_type}], edges:[{from,to,reason}]}",
        agent=mapper,
        expected_output="JSON attack path graph"
    )

    task4 = Task(
        description="Write a 3-sentence executive summary for a non-technical CEO. Then list vulnerabilities in priority order with estimated fix times. Return JSON.",
        agent=reporter,
        expected_output="JSON with summary string and priority_queue array"
    )

    crew = Crew(
        agents=[analyst, fixer, mapper, reporter],
        tasks=[task1, task2, task3, task4],
        process=Process.sequential,
        verbose=False,
        task_callback=task_callback,
    )

    result = crew.kickoff()
    return result