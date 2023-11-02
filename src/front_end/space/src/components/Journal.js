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

function saveJournal(user, promptId, entry, curEntry){
    const currentDate = new Date().toISOString().split('T')[0];
    const journal = {user: user, promptId: promptId, entry: entry, date: currentDate, id: curEntry != null ? curEntry.id : -1}
    console.log(journal)
    postJSON(journal, "http://127.0.0.1:5000/api/save")
}

const Journal = () => {
    const [user, setUser] = useState('generalUser')
    const [entry, setEntry] = useState('')
    const [promptId, setPromptId] = useState(0)
    const [prompt, setPrompt] = useState('Loading...')
    const [prevEntries, setPrevEntries] = useState([])
    const [curEntry, setCurEntry] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/journal_prompt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                // console.log(data)
                setPromptId(data.promptId)
                setPrompt(data.prompt)
                return getPreviousEntries(user, data.promptId)  // returning the promise
            })
            .then(entries => {
                let arrEntries = Array.from(entries)
                if(arrEntries.length == 0) return
                arrEntries.sort((a, b) => {return -a.date.localeCompare(b.date)})
                console.log(arrEntries)
                setPrevEntries(arrEntries)
                // console.log("prevEntries: " + prevEntries)


                const currentDate = new Date().toISOString().split('T')[0];
                // just need to check the last entry since array is sorted in reverse order
                if(arrEntries[0].date == currentDate){
                
                    setCurEntry(arrEntries[0])

                    setEntry(arrEntries[0].entry)
                    console.log("curEntry" + arrEntries[0])
                    
                    arrEntries.shift()
                    setPrevEntries(arrEntries)
                    console.log(arrEntries)
                }
                
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
            <button className="journal-submit" onClick={() => {saveJournal(user, promptId, entry, curEntry)}}>Save</button>
            <div style={{"width":"100%"}}>
                {prevEntries.length > 0 ? prevEntries.map(entryObj => {
                    return <JournalEntry key={entryObj.id} date={entryObj.date} entry={entryObj.entry}/>
                }) 
                : <></>
                // <p>No previous entries found.</p>
            }
            
            </div>
        </div>
    )
}

export default Journal