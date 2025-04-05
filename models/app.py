from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from llm_score import score_resume  # Import your LLM scoring function

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def hello():
    return "Flask AI model server is running!"

@app.route("/score", methods=["POST"])
def score():
    print("✅ Received request")

    try:
        data = request.get_json()
        print("📦 Data:", data)

        resumes = data.get("resumes", [])
        jd_text = data.get("job_description", "")

        if not resumes or not jd_text:
            return jsonify({"error": "Missing resumes or job_description"}), 400

        results = []
        for resume in resumes:
            resume_text = resume.get("text", "")
            if not resume_text:
                continue
            result = score_resume(resume_text, jd_text)
            result["id"] = resume.get("id")
            result["filename"] = resume.get("filename")
            results.append(result)

        return jsonify({"results": results})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
