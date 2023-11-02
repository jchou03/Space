import React, { useEffect, useState } from 'react';
import '../style/Journal.css';
import JournalEntry from './JournalEntry';

// api functions
async function postJSON(data, endpoint){
    // console.log(data)
    try{
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json()
        // console.log("Success: ", result)
        return result
    }catch (e) {
        // console.log("Error: " + e)
        return e
    }
}

async function getPreviousEntries(user, promptId){
    // console.log("")
    return postJSON({user: user, promptId: promptId}, "http://127.0.0.1:5000/api/past_journals")
}

function saveJournal(user, promptId, entry){
    postJSON({user: user, promptId: promptId, entry: entry}, "http://127.0.0.1:5000/api/save")
}

const Journal = () => {
    const [user, setUser] = useState('generalUser')
    const [entry, setEntry] = useState('')
    const [promptId, setPromptId] = useState(0)
    const [prompt, setPrompt] = useState('Loading...')
    const [prevEntries, setPrevEntries] = useState([])

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
                return getPreviousEntries(user, data.promptId)
            })
            .then(async data => {
                let temp = await getPreviousEntries(user, 2)
                console.log("prevEntries: " + temp)
                console.log(typeof temp)
                setPrevEntries(temp)
                console.log("prevEntries len: " + prevEntries.length)
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
            <div>
                <ul>
                    {
                        [124].map(() => {
                            return <JournalEntry entry="my previous journal entry" />
                        })
                    }
                    {prevEntries.length > 0 ? prevEntries.map(() => {
                        return <JournalEntry entry="my previous journal entry"/>
                    }) : <p>test</p>}
                </ul>
            </div>
        </div>
    )
}

export default Journal