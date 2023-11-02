import logo from './logo.svg';
import './App.css';
import Journal from './components/Journal'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Space</h1>
        <h2>a safe space for your thoughts</h2>
      </header>
      <Journal />
    </div>
  );
}

export default App;
