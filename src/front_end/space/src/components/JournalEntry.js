const JournalEntry = ({key,entry}) => {
    return (
        <div key={key}>
            <p>{entry}</p>
        </div>
    )
}

export default JournalEntry