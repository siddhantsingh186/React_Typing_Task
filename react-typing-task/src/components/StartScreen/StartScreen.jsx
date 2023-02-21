import React from 'react'
import './StartScreen.css'
const StartScreen = ({onStart}) => {

    function handleStartClick(){
        onStart();
    }
    return (
        <div id="start-screen">
            <h1>Welcome to Typing Game</h1>
            <p className="instruction">Click on the Start Button to test yourself.</p>
            <button id="start-button" onClick={handleStartClick}>Start</button>
        </div>
    )
}

export default StartScreen