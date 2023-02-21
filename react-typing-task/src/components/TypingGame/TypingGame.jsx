import axios from 'axios';
import {useState, useEffect} from 'react'
import "./TypingGame.css"

const TypingGame = ({onReset}) =>{
    const [quotes, setQuotes] = useState([]);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [displayQuote, setDisplayQuote] = useState(quotes[quoteIndex]);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [timerRunning,setTimerRunning] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [leaderBoard, setLeaderBoard] = useState([]);

    useEffect(() => {
        axios.get('https://type.fit/api/quotes')
            .then(res => {
                const quoteText = res.data.slice(0, 15).map(quote => quote.text);
                setQuotes(quoteText);
            }).catch(err => {
                console.log(err)
            })
    }, []);
    
    useEffect(() => {
        setDisplayQuote(quotes[quoteIndex]);
        setInputValue('');
    }, [quoteIndex, quotes]);

    useEffect(() => {
        if(timerRunning){
            const interval = setInterval(() => {
                setTime(time => time + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        else{
            setTime(0);
        }
    }, [timerRunning]);

    useEffect(() => {
        const leaderBoarddata = JSON.parse(localStorage.getItem('leaderBoard')) || [];
        setLeaderBoard(leaderBoarddata);
    }, []);

    useEffect(() => {
        localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
    }, [leaderBoard]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleKeyDown = (event) => {
        if(event.key === 'Enter'){
            if(inputValue === displayQuote){
                setScore(score => score + 1);
            }
            if(quoteIndex === quotes.length-1){
                setTimerRunning(false);
                setLeaderBoard(leaderBoard =>
                     [...leaderBoard, 
                        {score, time}
                    ]);
                localStorage.setItem('score', score);
                localStorage.setItem('time', time);
                    setScore(0);
                    setTime(0);
            }
            else{
                setQuoteIndex(quoteIndex => quoteIndex + 1);
            }
        }
    }

    const handleReset = () => {
        setQuoteIndex(0);
        setScore(0);
        setTimerRunning(true);
        setInputValue('');
        displayQuote(quotes[0]);
        setTime(0);
    }
    
    const sortedLeaderBoard = [...leaderBoard].sort((a, b) => {
        if(a.score === b.score){
            return a.time - b.time;
        }
        else{
            return b.score - a.score;
        }
    });

    return (
        <div id="game-container">
            <div className='stats'>
                <h1>Typing Game</h1>
                <p>Press Enter and move to the next quote</p>
                <p>Score : {score}</p>
                <p>Time : {time} seconds</p>
            </div>
            <div className='quote'>
                <p>{displayQuote}</p>
            </div>
            <input
                className='typing-input'
                type = 'text'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={!timerRunning}
            />
            {!timerRunning && (
                <div className='typing-leaderboard'>
                    <h2>Your score is {localStorage.getItem('score')} & time is {localStorage.getItem('time')} seconds</h2>
                    <h2>Leaderboard</h2>
                    <table>
                        <thead>
                            <tr id = "headers">
                                <th>Rank</th>
                                <th>Score</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedLeaderBoard.map((leader, index) => (
                                <tr key={index} className ="tableRows">
                                    <td>{index + 1}</td>
                                    <td>{leader.score}</td>
                                    <td>{leader.time} seconds</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <button onClick={handleReset} className="resetButton">Reset</button>
                </div>
            )}
        </div>
    )
}
export default TypingGame;