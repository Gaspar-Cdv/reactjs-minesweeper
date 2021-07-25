import React, { useState } from "react";
import '../styles/Settings.css';

export default function Settings(props) {
    let [difficulty, setDifficulty] = useState('beginner');
    let [height, setHeight] = useState(9);
    let [width, setWidth] = useState(9);
    let [mines, setMines] = useState(10);
    let settings = {difficulty, height, width, mines};

    let levels = {
        'beginner': {
            height: 9,
            width: 9,
            mines: 10
        },
        'intermediate': {
            height: 16,
            width: 16,
            mines: 40
        },
        'expert': {
            height: 16,
            width: 30,
            mines: 99
        }
    }

    let handleSubmit = e => {
        e.preventDefault();
        props.onSubmit({ difficulty, height, width, mines });
    }

    let changeDifficulty = e => {
        let difficulty = e.target.value;
        setDifficulty(difficulty);
        if (difficulty !== 'custom') {
            setHeight(levels[difficulty].height);
            setWidth(levels[difficulty].width);
            setMines(levels[difficulty].mines);
        }
    }

    let onChange = e => { // change inputs (height, width and mines)
        let {name, value} = e.target;
        let minePercent = Math.floor(100 * mines / (height * width));
        if (name === 'Height') {
            setHeight(+value);
            setMines(Math.min(Math.max(Math.ceil((minePercent * value * width) / 100), 5), value * width - 1));
        } else if (name === 'Width') {
            setWidth(+value);
            setMines(Math.min(Math.max(Math.ceil((minePercent * height * value) / 100), 5), height * value - 1));
        } else { // Mines
            setMines(+value);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <table>
                <tbody>
                    <Difficulty difficulty={difficulty} onChange={changeDifficulty} />

                    <Input {...{settings}} {...{onChange}}>Height</Input>
                    <Input {...{settings}} {...{onChange}}>Width</Input>
                    <Input {...{settings}} {...{onChange}}>Mines</Input>
                </tbody>
            </table>
        </form>
    )
}

function Difficulty({ difficulty, onChange }) {
    return (
        <tr>
            <td>
                <select value={difficulty} onChange={onChange}>
                    {['Beginner', 'Intermediate', 'Expert', 'Custom'].map(lvl => <option value={lvl.toLowerCase()} key={lvl}>{lvl}</option>)}
                </select>
            </td>
            <td>
                <input type="submit" value="New Game" />
            </td>
        </tr>
    )
}

function Input({ settings, onChange, children }) {
    let maxMines = settings.height * settings.width - 1;
    let value = Math.min(settings[children.toLowerCase()], maxMines);
    let min = children === 'Mines' ? 5 : 8;
    let max = children === 'Mines' ? maxMines : children === 'Height' ? 30 : 60;
    let percentMines = Math.floor(100 * settings.mines / (settings.height * settings.width));
    return (
        <tr>
            <td>{children} : {children === 'Mines' ? <>{percentMines} % ({value})</> : value} </td>
            <td>
                <input type="range" name={children} min={min} max={max} {...{ value }} {...{onChange}} disabled={settings.difficulty !== 'custom'} />
            </td>
        </tr>
    )
}