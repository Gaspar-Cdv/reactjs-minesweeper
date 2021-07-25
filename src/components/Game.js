/* eslint no-unused-vars : "off" */
import React from "react";
import Screen from "./Screen";
import Dashboard from "./Dashboard";
import '../styles/Game.css';

export default function Game(props) {
    let [mouseDown, setMouseDown] = React.useState(null);
    let [twoButtons, setTwoButtons] = React.useState(null);
    
    React.useEffect(() => document.addEventListener('mouseup', e => setMouseDown(null)), [setMouseDown])
    
    let hooks = { mouseDown, setMouseDown, twoButtons, setTwoButtons };
    
    return (
        <div id="game">
            <Dashboard {...props} {...hooks} />
            <Screen {...props} {...hooks} />
        </div>
    );
}



