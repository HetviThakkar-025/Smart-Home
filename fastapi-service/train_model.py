# train_model.py
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sentence_transformers import SentenceTransformer
import joblib

# Load data
df = pd.read_csv('notes_dataset.csv')

# Optional: clean text
df['text'] = df['text'].astype(str).str.lower()

# Encode text
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(df['text'].tolist())

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    embeddings, df['urgency'], test_size=0.2, random_state=42
)

# Train classifier
clf = LogisticRegression(max_iter=1000)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
print(accuracy_score(y_test, y_pred))

# Save classifier and embedding model
joblib.dump({'classifier': clf, 'embedder': model}, 'model.pkl')

print("Model saved as model.pkl")
