import React from "react";
import Cell from "./Cell"
import '../styles/Screen.css';

export default function Screen(props) {
    let { height, width } = props;
    
    return (
        <div id="screen" style={{ gridTemplate: 'repeat(' + height + ', 25px) / repeat(' + width + ', 25px)' }} onContextMenu={e => e.preventDefault()}>
            {[...Array(height)].map((_, y) => {
                return [...Array(width)].map((_, x) => {
                    let key = x + y * width
                    return <Cell key={key} x={x} y={y} {...props} />
                })
            })}
        </div>
    )
}

