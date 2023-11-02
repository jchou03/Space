import React, { useEffect, useState } from 'react';
import '../style/Journal.css';

// api functions
async function postJSON(data){
    console.log(data)
    try{
        const response = await fetch("http://127.0.0.1:5000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json()
        console.log("Success: ", result)
    }catch (e) {
        console.log("Error: " + e)
    }
}

function saveJournal(user, promptId, entry){
    postJSON({user: user, promptId: promptId, entry: entry})
}

const Journal = () => {
    const [user, setUser] = useState('generalUser')
    const [entry, setEntry] = useState('')
    const [promptId, setPromptId] = useState(0)
    const [prompt, setPrompt] = useState('Loading...')

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/journal_prompt')
            .then(response => {
                if(!response.ok){
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                setPromptId(data.promptId)
                setPrompt(data.prompt)
            })
            .catch(error => {
                console.error("There was a problem with fetching the journal prompt. Error message: " + error.message)
                setPrompt("What's the most memorable thing that happened to you today?")
            })
    }, [])

    return (
        <div className="journal-container">
            <h2 className="journal-prompt">{prompt}</h2>
            <textarea 
                className="journal-entry" 
                value={entry} 
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your thoughts..."
            />
            <button className="journal-submit" onClick={() => {saveJournal(user, promptId, entry)}}>Save</button>
        </div>
    )
}

export default Journal