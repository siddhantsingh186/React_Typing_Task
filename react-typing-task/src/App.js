import './App.css';
import TypingGame from './components/TypingGame/TypingGame';
import { useState } from 'react';
import StartScreen from './components/StartScreen/StartScreen';
function App() {
  const [gameStatus, setGameStatus] = useState(false);

  const handleStart = ()=> {
    setGameStatus(true);
  }

  const handleReset = ()=> {
    setGameStatus(false);
  }

  if(gameStatus){
    return (
        <TypingGame onReset={handleReset}/>
    );
  }
  else{
    return(
      <StartScreen onStart={handleStart}/>
    )
  }
}

export default App;
