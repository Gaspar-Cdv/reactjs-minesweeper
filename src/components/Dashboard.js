import '../styles/Dashboard.css';

export default function Dashboard({ difficulty, height, width, mines, minesLeft, time, mouseDown, gameOver, win, resetGame }) {
    let onClick = () => resetGame({difficulty, height, width, mines});
    
    minesLeft = minesLeft >= 0 ? minesLeft.toString().padStart(3, 0) : '-' + (-minesLeft).toString().padStart(2, 0)
    time = time.toString().padStart(3, '0');
    let smiley = gameOver ? 'dead' : win ? 'sunglasses' : mouseDown ? 'surprised' : 'happy';
    
    return (
        <div id="dashboard">
            <span id="minesLeft">{minesLeft}</span>
            <span id="smiley" {...{onClick}}><img src={`./img/${smiley}.png`} alt="smiley" /></span>
            <span id="time">{time}</span>
        </div>
    )
}