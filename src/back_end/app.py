from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# journal prompts from :https://mindfulhealthsolutions.com/20-journaling-prompts-for-mental-health/ 
journal_prompts=[
    "How would you spend your perfect day off? What makes that perfect for you?",
    "Describe yourself in ten words. Why do those words come to mind?",
    "What makes you feel the most inspired?",
    "What is your favorite form of self-care? Why?",
    "What can you do today to take better care of yourself?",
    "What comes to mind first when you think of what makes you feel safe?",
    "What are five things about yourself you want people to know?",
    "What’s something that makes you feel warm inside?",
    "Explain what’s hardest for you in as many words as it takes.",
    "If you were to improve something about your life, what would that be? Why?",
    "What’s your first coping mechanism that comes to mind? Do you think it’s helpful or harmful, and why?"
]

@app.route('/api/journal_prompt', methods=['GET'])
def get_journal_prompt():
    import random
    prompt = random.choice(journal_prompts)
    return jsonify({'prompt':prompt})

if __name__ == '__main__':
    app.run(debug=True)
    