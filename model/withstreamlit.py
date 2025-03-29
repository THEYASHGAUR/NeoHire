import streamlit as st
from crewai import Agent, Task, Crew, Process
from typing import Dict, List
import os
from langchain.llms.base import LLM
from pydantic import PrivateAttr
import google.generativeai as genai
import re

# Load Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    st.error("Please set the GEMINI_API_KEY environment variable.")
    st.stop()

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Custom Gemini LLM class for LangChain compatibility
class GeminiLLM(LLM):
    model_name: str = "gemini/gemini-2.0-flash"  # Updated to a valid model name
    temperature: float = 0.7
    _client = PrivateAttr()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        try:
            self._client = genai.GenerativeModel(self.model_name)
        except Exception as e:
            st.error(f"Failed to initialize Gemini model: {str(e)}")
            raise

    def _call(self, prompt: str, stop: List[str] = None) -> str:
        try:
            response = self._client.generate_content(
                prompt,
                generation_config={
                    "temperature": self.temperature,
                    "stop_sequences": stop if stop else None
                }
            )
            return response.text
        except Exception as e:
            st.error(f"Error calling Gemini API: {str(e)}")
            raise

    @property
    def _llm_type(self) -> str:
        return "gemini"

    @property
    def _identifying_params(self) -> Dict[str, any]:
        return {"model_name": self.model_name, "temperature": self.temperature}

# Instantiate the LLM
llm = GeminiLLM()

# Helper function to extract data using LLM
def extract_with_llm(text: str, prompt: str) -> Dict:
    full_prompt = f"{prompt}\n\nText: {text}\n\nReturn a JSON-like dictionary with 'skills' (list), 'experience' (int), and 'education' (str)."
    try:
        response = llm._call(full_prompt)
        import json
        data = json.loads(response)
        return {
            "skills": data.get("skills", []),
            "experience": int(data.get("experience", 0)),
            "education": data.get("education", "")
        }
    except Exception as e:
        st.warning(f"LLM extraction failed: {str(e)}. Falling back to regex.")
        skills = re.findall(r'skills?:? ([\w\s,]+)', text, re.IGNORECASE)
        experience = re.findall(r'experience:? (\d+)', text, re.IGNORECASE)
        education = re.findall(r'education:? ([\w\s]+)', text, re.IGNORECASE)
        return {
            "skills": skills[0].split(', ') if skills else [],
            "experience": int(experience[0]) if experience else 0,
            "education": education[0] if education else ""
        }

# Define Agents
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

# Define Tasks
def parse_resume_task(resume_text: str) -> Task:
    return Task(
        description=f'Extract skills, experience, and education from this resume: {resume_text}',
        agent=resume_parser,
        expected_output='A dictionary with skills (list), experience (int), and education (str).'
    )

def parse_jd_task(jd_text: str) -> Task:
    return Task(
        description=f'Extract required skills, experience, and qualifications from this JD: {jd_text}',
        agent=jd_parser,
        expected_output='A dictionary with skills (list), experience (int), and qualifications (str).'
    )

def match_task(resume_data: Dict, jd_data: Dict) -> Task:
    return Task(
        description=f'Compare this resume data {resume_data} with this JD data {jd_data} and compute a score.',
        agent=matcher,
        expected_output='A score (0-100) with an explanation.'
    )

# Scoring Logic with detailed breakdown
def compute_score(resume_data: Dict, jd_data: Dict) -> Dict:
    score_breakdown = {}
    explanation = []

    # Skills match (50% weight)
    resume_skills = set(resume_data["skills"])
    jd_skills = set(jd_data["skills"])
    skill_match = len(resume_skills.intersection(jd_skills)) / len(jd_skills) if jd_skills else 0
    skills_score = skill_match * 50
    score_breakdown["skills"] = skills_score
    explanation.append(
        f"Skills Score: {skills_score:.2f}/50\n"
        f"- Calculation: ({len(resume_skills.intersection(jd_skills))} matching skills / {len(jd_skills)} required skills) * 50 = {skills_score:.2f}"
    )

    # Experience match (30% weight)
    exp_match = min(resume_data["experience"] / jd_data["experience"], 1.0) if jd_data["experience"] > 0 else 1.0
    exp_score = exp_match * 30
    score_breakdown["experience"] = exp_score
    explanation.append(
        f"Experience Score: {exp_score:.2f}/30\n"
        f"- Calculation: (min({resume_data['experience']} years / {jd_data['experience']} years required, 1.0)) * 30 = {exp_score:.2f}"
    )

    # Education match (20% weight)
    edu_match = 1.0 if jd_data["education"].lower() in resume_data["education"].lower() else 0.5
    edu_score = edu_match * 20
    score_breakdown["education"] = edu_score
    explanation.append(
        f"Education Score: {edu_score:.2f}/20\n"
        f"- Calculation: ({'1.0' if edu_match == 1.0 else '0.5'} match factor) * 20 = {edu_score:.2f}"
    )

    total_score = min(round(sum(score_breakdown.values()), 2), 100)
    
    # Agent's final answer (only this part will be shown on the interface)
    final_answer = (
        f"# Agent: Matcher\n"
        f"## Final Answer:\n"
        f"The compatibility score is {total_score}. "
        f"The candidate possesses relevant skills like {', '.join(resume_skills.intersection(jd_skills)) or 'none specified'}, "
        f"and their {resume_data['education']} aligns with the job's educational requirements. "
        f"The candidate's experience exceeds the minimum requirements which is a plus. "
        f"The skills score is {'low' if skill_match < 0.5 else 'moderate to high'} because the candidate "
        f"{'does not have many' if skill_match < 0.5 else 'has several'} of the desired skills outlined in the job description."
    )

    return {"score": total_score, "final_answer": final_answer}

# Core Scoring Function
def score_resume(resume_text: str, jd_text: str) -> Dict:
    resume_task = parse_resume_task(resume_text)
    jd_task = parse_jd_task(jd_text)

    resume_data = extract_with_llm(resume_text, "Extract resume details")
    jd_data = extract_with_llm(jd_text, "Extract JD details")
    
    match_task_instance = match_task(resume_data, jd_data)

    crew = Crew(
        agents=[resume_parser, jd_parser, matcher],
        tasks=[resume_task, jd_task, match_task_instance],
        process=Process.sequential,
        verbose=True
    )

    crew.kickoff()
    result = compute_score(resume_data, jd_data)
    return result

# Streamlit Interface (modified to show only the final answer)
def main():
    st.title("Resume-JD Compatibility Scorer")
    st.write("Upload or paste your resume and job description to get a compatibility score.")

    tab1, tab2 = st.tabs(["Text Input", "File Upload"])

    resume_text = ""
    jd_text = ""

    with tab1:
        st.subheader("Enter Resume and JD Text")
        resume_text = st.text_area("Paste Resume Here", height=200)
        jd_text = st.text_area("Paste Job Description Here", height=200)

    with tab2:
        st.subheader("Upload Resume and JD Files")
        resume_file = st.file_uploader("Upload Resume (TXT or PDF)", type=["txt", "pdf"])
        jd_file = st.file_uploader("Upload Job Description (TXT or PDF)", type=["txt", "pdf"])

        if resume_file:
            if resume_file.type == "text/plain":
                resume_text = resume_file.read().decode("utf-8")
            elif resume_file.type == "application/pdf":
                try:
                    import PyPDF2
                    pdf_reader = PyPDF2.PdfReader(resume_file)
                    resume_text = "".join([page.extract_text() for page in pdf_reader.pages])
                except:
                    st.error("PDF parsing failed. Please upload a text file or paste the text.")
        
        if jd_file:
            if jd_file.type == "text/plain":
                jd_text = jd_file.read().decode("utf-8")
            elif jd_file.type == "application/pdf":
                try:
                    import PyPDF2
                    pdf_reader = PyPDF2.PdfReader(jd_file)
                    jd_text = "".join([page.extract_text() for page in pdf_reader.pages])
                except:
                    st.error("PDF parsing failed. Please upload a text file or paste the text.")

    if st.button("Score Resume"):
        if not resume_text or not jd_text:
            st.error("Please provide both a resume and a job description.")
        else:
            with st.spinner("Processing..."):
                try:
                    result = score_resume(resume_text, jd_text)
                    st.subheader("Results")
                    # Display only the final answer
                    st.markdown(result["final_answer"])
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()