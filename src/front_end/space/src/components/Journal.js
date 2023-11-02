import React, { useEffect, useState } from 'react';
import '../style/Journal.css';

const Journal = () => {
    const [entry, setEntry] = useState('');
    const [prompt, setPrompt] = useState('Loading...');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/journal_prompt')
            .then(response => {
                if(!response.ok){
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
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
            <button className="journal-submit" onClick={() => console.log("message: " + entry)}>Save</button>
        </div>
    );
};

export default Journal;