import React, { useState } from 'react';
import '../style/JournalEntry.css';

const JournalEntry = ({ key, date, entry }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="collapsible-container" key={key} onClick={() => setIsOpen(!isOpen)}>
            <div className="date">{date}</div>
            {isOpen && <div className="content">{entry}</div>}
        </div>
    );
}


export default JournalEntry