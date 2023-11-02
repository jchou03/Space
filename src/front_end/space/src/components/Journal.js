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
    const result = await postJSON({ user: user, promptId: promptId }, "http://127.0.0.1:5000/api/past_journals");
    if (result && result.entries) {
        return result.entries;
    }
    return []; // Return empty array if no entries found to avoid errors
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
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                setPromptId(data.promptId)
                setPrompt(data.prompt)
                return getPreviousEntries(user, data.promptId)  // returning the promise
            })
            .then(entries => {
                let arrEntries = Array.from(entries)
                // if (Array.isArray(arrEntries)) {
                //     console.log("it is an array!")
                //     console.log(typeof arrEntries)
                //     console.log(arrEntries)
                //     setPrevEntries([...arrEntries]);
                //     console.log(prevEntries)
                //     console.log("prevEntries: " + typeof prevEntries)
                // } else {
                //     console.warn('Received data is not an array:', entries);
                // }
                // console.log("Previous Entries: ", arrEntries)
                // console.log("type of arrEntries is: " + typeof arrEntries)
                setPrevEntries(arrEntries)
                console.log("prevEntries: " + prevEntries)
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
                    {prevEntries.length > 0 ? prevEntries.map(entryObj => {
                        console.log(prevEntries.length)
                        for(let i = 0; i < prevEntries.length; i++){
                            console.log(prevEntries[i])
                        }
                        return <p key={entryObj.id}>{entryObj.entry}</p>
                        // return <JournalEntry key={entryObj.id} entry={entryObj.entry}/>  // Assuming each entryObj has an 'id' and 'content' attribute
                    }) : <p>No previous entries found.</p>}
                </ul>
            </div>
        </div>
    )
}

export default Journal