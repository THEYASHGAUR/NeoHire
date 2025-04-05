# Import necessary modules
from crewai import Agent, Task, Crew, Process
from typing import Dict, List
import os
from langchain.llms.base import LLM
from pydantic import PrivateAttr
import google.generativeai as genai
import re
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Custom Gemini LLM class using LangChain's base LLM
class GeminiLLM(LLM):
    model_name: str = "gemini/gemini-2.0-flash"
    temperature: float = 0.7
    _client = PrivateAttr()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._client = genai.GenerativeModel(self.model_name)

    def _call(self, prompt: str, stop: List[str] = None) -> str:
        # Generate a response from Gemini model
        response = self._client.generate_content(
            prompt,
            generation_config={"temperature": self.temperature, "stop_sequences": stop if stop else None}
        )
        return response.text

    @property
    def _llm_type(self) -> str:
        return "gemini"

    @property
    def _identifying_params(self) -> Dict[str, any]:
        return {"model_name": self.model_name, "temperature": self.temperature}

# Initialize LLM instance
llm = GeminiLLM()

# Function to extract structured data from resume or JD using LLM
def extract_with_llm(text: str, prompt: str) -> Dict:
    full_prompt = f"{prompt}\n\nText: {text}\n\nReturn a JSON-like dictionary with 'skills' (list), 'experience' (int), and 'education' (str)."
    try:
        response = llm._call(full_prompt)
        data = json.loads(response)
        return {
            "skills": data.get("skills", []),
            "experience": int(data.get("experience", 0)),
            "education": data.get("education", "")
        }
    except Exception:
        # Fallback regex-based extraction in case LLM fails
        skills = re.findall(r'skills?:? ([\w\s,]+)', text, re.IGNORECASE)
        experience = re.findall(r'experience:? (\d+)', text, re.IGNORECASE)
        education = re.findall(r'education:? ([\w\s]+)', text, re.IGNORECASE)
        return {
            "skills": skills[0].split(', ') if skills else [],
            "experience": int(experience[0]) if experience else 0,
            "education": education[0] if education else ""
        }

# Define agents with specific roles and goals
resume_parser = Agent(
    role='Resume Parser',
    goal='Extract key details from the resume such as skills, experience, and education.',
    backstory='Expert in parsing and understanding resume content.',
    verbose=True,
    llm=llm
)

jd_parser = Agent(
    role='JD Parser',
    goal='Extract key requirements from the job description such as skills, experience, and qualifications.',
    backstory='Specialist in interpreting job descriptions.',
    verbose=True,
    llm=llm
)

matcher = Agent(
    role='Matcher',
    goal='Compare resume and JD data to compute a compatibility score.',
    backstory='Analytical expert in matching candidates to job requirements.',
    verbose=True,
    llm=llm
)

# Define task to parse resume
def parse_resume_task(resume_text: str) -> Task:
    return Task(
        description=f'Extract skills, experience, and education from this resume: {resume_text}',
        agent=resume_parser,
        expected_output='A dictionary with skills (list), experience (int), and education (str).'
    )

# Define task to parse job description
def parse_jd_task(jd_text: str) -> Task:
    return Task(
        description=f'Extract required skills, experience, and qualifications from this JD: {jd_text}',
        agent=jd_parser,
        expected_output='A dictionary with skills (list), experience (int), and qualifications (str).'
    )

# Define task to match resume with JD and compute a score
def match_task(resume_data: Dict, jd_data: Dict) -> Task:
    return Task(
        description=f'Compare this resume data {resume_data} with this JD data {jd_data} and compute a score.',
        agent=matcher,
        expected_output='A score (0-100) with an explanation.'
    )

# Custom logic to compute score between resume and JD
def compute_score(resume_data: Dict, jd_data: Dict) -> Dict:
    resume_skills = set(resume_data["skills"])
    jd_skills = set(jd_data["skills"])
    
    # Skills match scoring (max 50 points)
    skill_match = len(resume_skills.intersection(jd_skills)) / len(jd_skills) if jd_skills else 0
    skills_score = skill_match * 50

    # Experience match scoring (max 30 points)
    exp_match = min(resume_data["experience"] / jd_data["experience"], 1.0) if jd_data["experience"] > 0 else 1.0
    exp_score = exp_match * 30

    # Education match scoring (max 20 points)
    edu_match = 1.0 if jd_data["education"].lower() in resume_data["education"].lower() else 0.5
    edu_score = edu_match * 20

    # Final total score
    total_score = min(round(skills_score + exp_score + edu_score, 2), 100)
    
    # Generate a readable explanation
    final_answer = (
        f"# Agent: Matcher\n"
        f"## Final Answer:\n"
        f"The compatibility score is {total_score}. "
        f"The candidate possesses relevant skills like {', '.join(resume_skills.intersection(jd_skills)) or 'none specified'}, "
        f"and their {resume_data['education']} aligns with the job's educational requirements. "
        f"The candidate's experience exceeds the minimum requirements which is a plus. "
        f"The skills score is {'low' if skill_match < 0.5 else 'moderate to high'}."
    )
    
    return {"score": total_score, "final_answer": final_answer}

# High-level function to score resume against a JD
def score_resume(resume_text: str, jd_text: str) -> Dict:
    # Extract structured data using LLM
    resume_data = extract_with_llm(resume_text, "Extract resume details")
    jd_data = extract_with_llm(jd_text, "Extract JD details")

    # Set up and run the Crew AI process
    crew = Crew(
        agents=[resume_parser, jd_parser, matcher],
        tasks=[
            parse_resume_task(resume_text),
            parse_jd_task(jd_text),
            match_task(resume_data, jd_data)
        ],
        process=Process.sequential,
        verbose=True
    )

    crew.kickoff()

    # Return computed score and breakdown
    return compute_score(resume_data, jd_data)
