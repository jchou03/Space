import React, { useState } from 'react';
import '../style/Journal.css';

const Journal = () => {
    const [entry, setEntry] = useState('');
    const prompt = "What's the most memorable thing that happened to you today?"; // Example prompt

    return (
        <div className="journal-container">
            <h2 className="journal-prompt">{prompt}</h2>
            <textarea 
                className="journal-entry" 
                value={entry} 
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your thoughts..."
            />
            <button className="journal-submit">Save</button>
        </div>
    );
};

export default Journal;