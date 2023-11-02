from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import random

import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

# Firebase setup
cred = credentials.Certificate("../../key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# journal prompts from :https://mindfulhealthsolutions.com/20-journaling-prompts-for-mental-health/ 
journal_prompts={
    0:"What's the most memorable thing that happened to you today?",
    1:"How would you spend your perfect day off? What makes that perfect for you?",
    2:"Describe yourself in ten words. Why do those words come to mind?",
    3:"What makes you feel the most inspired?",
    4:"What is your favorite form of self-care? Why?",
    5:"What can you do today to take better care of yourself?",
    6:"What comes to mind first when you think of what makes you feel safe?",
    7:"What are five things about yourself you want people to know?",
    8:"What’s something that makes you feel warm inside?",
    9:"Explain what’s hardest for you in as many words as it takes.",
    10:"If you were to improve something about your life, what would that be? Why?",
    11:"What’s your first coping mechanism that comes to mind? Do you think it’s helpful or harmful, and why?"
}

@app.route('/api/journal_prompt', methods=['GET'])
def get_journal_prompt():
    # promptId = random.randint(0, len(journal_prompts)-1)
    promptId = 2
    return jsonify({'promptId': promptId, 'prompt':journal_prompts[promptId]})

@app.route('/api/save', methods=['POST'])
def save_journal():
    if not request.is_json:
        abort(400)
    obj = request.get_json()
    
    try:
        journal_ref = db.collection('journals/'+obj['user']+'/'+str(obj['promptId'])).document()
        journal_ref.set(obj)
        return jsonify({"status": "success", "docId": journal_ref.id}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

"""
Get the past journals by this user for this prompt
"""

@app.route('/api/past_journals', methods=['GET','POST'])
def get_past_journals():
    if not request.is_json:
        abort(400)
    obj = request.get_json()
    # print(obj)
    try:
        entries = db.collection('journals/'+obj['user']+'/'+str(obj['promptId'])).get()
        entry_list = []
        for doc in entries:
            entry_list.append(doc.to_dict())
        # print(entry_dict)
        return jsonify({"status":"success", "entries":entry_list})
    except Exception as e:
        print("error: " + str(e))
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
    