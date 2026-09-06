import os
import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_FILE = os.path.join(
    BASE_DIR,
    "data",
    "jobs.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


def train_model():
    print("Loading training dataset...")

    data = pd.read_csv(DATA_FILE)

    required_columns = [
        "description",
        "category",
        "requiredSkill",
        "difficulty"
    ]

    for column in required_columns:
        if column not in data.columns:
            raise ValueError(
                f"Missing column in dataset: {column}"
            )

    os.makedirs(MODEL_DIR, exist_ok=True)

    print(f"Total training examples: {len(data)}")

    # Category Model
    category_model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2)
            )
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=1000
            )
        )
    ])

    category_model.fit(
        data["description"],
        data["category"]
    )

    category_model_path = os.path.join(
        MODEL_DIR,
        "category_model.pkl"
    )

    joblib.dump(
        category_model,
        category_model_path
    )

    print("Category model saved.")


    # Skill Model
    skill_model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2)
            )
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=1000
            )
        )
    ])

    skill_model.fit(
        data["description"],
        data["requiredSkill"]
    )

    skill_model_path = os.path.join(
        MODEL_DIR,
        "skill_model.pkl"
    )

    joblib.dump(
        skill_model,
        skill_model_path
    )

    print("Skill model saved.")


    # Difficulty Model
    difficulty_model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2)
            )
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=1000
            )
        )
    ])

    difficulty_model.fit(
        data["description"],
        data["difficulty"]
    )

    difficulty_model_path = os.path.join(
        MODEL_DIR,
        "difficulty_model.pkl"
    )

    joblib.dump(
        difficulty_model,
        difficulty_model_path
    )

    print("Difficulty model saved.")

    print("\nTraining completed successfully.")


if __name__ == "__main__":
    train_model()