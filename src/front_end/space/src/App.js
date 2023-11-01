import logo from './logo.svg';
import './App.css';
import Journal from './components/Journal'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My daily journal</h1>
      </header>
      <Journal />
    </div>
  );
}

export default App;
