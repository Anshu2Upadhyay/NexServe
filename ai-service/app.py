import os
import joblib

from flask import Flask, request, jsonify


app = Flask(__name__)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


category_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "category_model.pkl"
    )
)

skill_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "skill_model.pkl"
    )
)

difficulty_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "difficulty_model.pkl"
    )
)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "NexServe AI Service is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400

        description = data.get("description")

        if not description:
            return jsonify({
                "success": False,
                "message": "Job description is required"
            }), 400

        description = description.strip()

        if len(description) < 5:
            return jsonify({
                "success": False,
                "message": "Job description is too short"
            }), 400

        category = category_model.predict(
            [description]
        )[0]

        required_skill = skill_model.predict(
            [description]
        )[0]

        difficulty = difficulty_model.predict(
            [description]
        )[0]

        return jsonify({
            "success": True,
            "prediction": {
                "category": category,
                "requiredSkill": required_skill,
                "difficulty": difficulty
            }
        })

    except Exception as error:
        print("Prediction error:", error)

        return jsonify({
            "success": False,
            "message": "AI prediction failed"
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )